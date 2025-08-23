#!/bin/bash

# Package Theme for Upload
# This script creates a zip file from your current theme ready for Shopify upload

set -euo pipefail

echo "Packaging Xio's Bakery theme for upload..."

# Resolve repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Extract version from themes/current/config/settings_schema.json
SETTINGS_JSON="$REPO_ROOT/themes/current/config/settings_schema.json"
if [[ ! -f "$SETTINGS_JSON" ]]; then
  echo "[ERROR] settings_schema.json not found at $SETTINGS_JSON" >&2
  exit 1
fi

version=$(python3 - "$SETTINGS_JSON" <<'PY'
import json,sys
p=sys.argv[1]
with open(p,'r',encoding='utf-8') as f:
    data=json.load(f)
# first block has theme_version
ver = None
if isinstance(data,list) and data:
    info = data[0]
    ver = info.get('theme_version')
print(ver or '')
PY
)

if [[ -z "$version" ]]; then
  echo "[ERROR] Could not parse theme_version from settings_schema.json" >&2
  exit 1
fi

ts=$(date +"%Y%m%d-%H%M%S")
outfile="$REPO_ROOT/xios-bakery-theme-v$version-$ts.zip"

# Create zip from themes/current
cd "$REPO_ROOT/themes/current"
zip -r "$outfile" . -x "*.DS_Store" "*.git*" "node_modules/*" "*.log" >/dev/null

cd "$REPO_ROOT"

echo "[COMPLETE] Theme packaged successfully"
echo "[FILE] $outfile"
