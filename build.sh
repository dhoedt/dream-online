#!/bin/sh
# Builds the deployable site in dist/ from the last commit, then appends ?v=<content hash>
# to every CSS/JS reference in the HTML pages (cache busting).
# Upload the content of dist/ to the server afterwards.
set -e
cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  echo "warning: uncommitted changes are NOT included in the build" >&2
fi

rm -rf dist
mkdir dist
git archive HEAD | tar -x -C dist
rm -rf dist/.githooks dist/.gitattributes dist/.gitignore dist/build.sh dist/todo.md

cd dist
find css js -type f \( -name '*.css' -o -name '*.js' \) | while IFS= read -r asset; do
  version=$(git hash-object "$asset" | cut -c1-8)
  asset_regex=$(printf '%s' "$asset" | sed 's/[][\.*^$#]/\\&/g')
  find . -type f -name '*.html' | while IFS= read -r page; do
    sed -i -E "s#([\"'/])${asset_regex}(\?v=[^\"']*)?([\"'])#\1${asset}?v=${version}\3#g" "$page"
  done
  echo "cache-bust: $asset?v=$version"
done
