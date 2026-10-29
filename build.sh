#!/bin/sh
# Builds the deployable site in dist/ from the last commit, then appends ?v=<content hash>
# to every CSS/JS reference in the HTML pages (cache busting).
# The site is built in dist.tmp/ and swapped in at the end, so dist/ is never half-built.
set -e
cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  echo "warning: uncommitted changes are NOT included in the build" >&2
fi

rm -rf dist.tmp dist.old
mkdir dist.tmp
git archive HEAD | tar -x -C dist.tmp
rm -rf dist.tmp/.github dist.tmp/.gitattributes dist.tmp/.gitignore \
  dist.tmp/build.sh dist.tmp/deploy.sh dist.tmp/todo.md

(
  cd dist.tmp
  find css js -type f \( -name '*.css' -o -name '*.js' \) | while IFS= read -r asset; do
    version=$(git hash-object "$asset" | cut -c1-8)
    asset_regex=$(printf '%s' "$asset" | sed 's/[][\.*^$#]/\\&/g')
    find . -type f -name '*.html' | while IFS= read -r page; do
      sed -i -E "s#([\"'/])${asset_regex}(\?v=[^\"']*)?([\"'])#\1${asset}?v=${version}\3#g" "$page"
    done
    echo "cache-bust: $asset?v=$version"
  done

  # Build timestamp in the footer of the home page, in Belgian time.
  build_datetime=$(TZ=Europe/Brussels date '+%Y-%m-%dT%H:%M%:z')
  build_label=$(TZ=Europe/Brussels date '+%d/%m/%Y à %H:%M')
  sed -i "s#<!-- build-time -->#build: <time datetime=\"${build_datetime}\">${build_label}</time>#" index.html
  echo "build-time: $build_label"
)

if [ -d dist ]; then
  mv dist dist.old
fi
mv dist.tmp dist
rm -rf dist.old
