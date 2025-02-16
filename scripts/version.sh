#!/bin/bash -eu

VERSION_SPEC=${1:-patch}

npm version --workspaces --include-workspace-root --no-git-tag-version "$VERSION_SPEC"

git add package.json packages/*/package.json

NEW_TAG="$(node -pe "require('./package.json').version")"
echo "New tag: $NEW_TAG"
git commit -m "chore(release): bump version to $NEW_TAG"
git tag "v$NEW_TAG"
