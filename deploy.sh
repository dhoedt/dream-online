#!/bin/sh
# Updates this clone to origin/main and rebuilds dist/.
# Runs on the server, triggered over SSH by the GitHub Actions deploy workflow.
set -e
cd "$(dirname "$0")"

git fetch -q origin main
git reset -q --hard origin/main
sh build.sh
