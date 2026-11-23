#!/bin/sh
# Updates this clone to origin/main, builds the site into a new release folder
# and switches the `current` symlink (nginx's root) to it.
# Runs on the server, triggered over SSH by the GitHub Actions deploy workflow.
#
# Layout under the deploy root (the parent of this clone by default, or $DEPLOY_ROOT):
#   repo/                   this clone
#   releases/<date>-<sha>/  one built site per deploy, the newest $KEEP_RELEASES are kept
#   current                 symlink to the live release
#   deploy.lock             lock file, so only one deploy runs at a time
set -e

KEEP_RELEASES=5

for command in git node npm flock; do
  if ! command -v "$command" > /dev/null 2>&1; then
    echo "error: $command is not installed" >&2
    exit 1
  fi
done

repo_dir=$(cd "$(dirname "$0")" && pwd)
DEPLOY_ROOT=${DEPLOY_ROOT:-$(dirname "$repo_dir")}
releases_dir="$DEPLOY_ROOT/releases"

exec 9> "$DEPLOY_ROOT/deploy.lock"
flock 9

cd "$repo_dir"
git fetch -q origin main
git reset -q --hard origin/main
npm ci --include=dev --engine-strict --no-audit --no-fund

release_name="$(date '+%Y%m%d-%H%M%S')-$(git rev-parse --short HEAD)"
release_dir="$releases_dir/$release_name"
mkdir -p "$releases_dir"

if ! npm run build -- --output="$release_dir"; then
  rm -rf "$release_dir"
  echo "error: build failed, the live site is unchanged" >&2
  exit 1
fi

# The rename is atomic: nginx serves either the old release or the new one, never a mix.
cd "$DEPLOY_ROOT"
ln -sfn "releases/$release_name" current.tmp
mv -T current.tmp current
echo "deployed: $release_name"

# Release names start with the date, so they sort oldest first.
ls -1 releases | sort | head -n -"$KEEP_RELEASES" | while IFS= read -r old_release; do
  rm -rf "releases/$old_release"
  echo "removed release: $old_release"
done
