#!/usr/bin/env bash
set -euo pipefail

# Creates (or recreates) the orphan `shopify` branch from themes/current/
# so that Shopify GitHub integration sees a valid theme at root level.
# Safe to run from any branch -- uses a temp clone, no working-tree changes.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
THEME_DIR="${REPO_ROOT}/themes/current"
BRANCH="shopify"

if [ ! -d "$THEME_DIR" ]; then
  echo "[ERROR] themes/current/ not found at ${THEME_DIR}"
  exit 1
fi

REMOTE_URL=$(git -C "$REPO_ROOT" remote get-url origin)
COMMIT_SHA=$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo "initial")

CLONE_DIR=$(mktemp -d)
trap 'rm -rf "$CLONE_DIR"' EXIT

echo "[INFO] Cloning repo to temp directory..."
git clone --no-checkout "$REMOTE_URL" "$CLONE_DIR" > /dev/null 2>&1

cd "$CLONE_DIR"

git checkout --orphan "$BRANCH"
git rm -rf . > /dev/null 2>&1
git clean -fd > /dev/null 2>&1

echo "[INFO] Copying themes/current/ into branch root..."
cp -r "${THEME_DIR}"/* .

git add -A
git commit -m "Sync theme from main (${COMMIT_SHA})" \
           -m "Auto-generated from themes/current/ on main branch." > /dev/null

echo "[INFO] Pushing ${BRANCH} branch to origin..."
git push --force origin "${BRANCH}"

cd "$REPO_ROOT"

echo ""
echo "[SUCCESS] Branch '${BRANCH}' pushed to origin."
echo "[INFO] In Shopify Admin > Themes > Connect theme, select the '${BRANCH}' branch."
