#!/bin/bash -eu

VERSION_SPEC=${1:-patch}

npm version --workspaces --include-workspace-root "$VERSION_SPEC" &&
  git add package.json packages/*/package.json
