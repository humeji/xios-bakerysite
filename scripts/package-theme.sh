#!/bin/bash

# Package Theme for Upload
# Creates a zip file from themes/current/ ready for Shopify upload.
#
# Usage:
#   Local (dev):  ./scripts/package-theme.sh <plan-id>
#   CI pipeline:  ./scripts/package-theme.sh --ci <tag-name>
#
# Flags:
#   --ci   Skips interactive prompts (tests and lint already ran in CI).
#          Intended for GitHub Actions only.
#
# Requirements enforced before packaging (local mode):
#   1. All unit tests must pass (npm test)
#   2. SonarQube analysis must report zero issues (manual via MCP tool)
#   3. Plan ID must be provided (links bundle to the work that produced it)
#
# Output: xios-bakery-theme-<plan-id>-<YYYYMMDD>.zip

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CI_MODE=false

# ---------------------------------------------------------------
# Parse flags
# ---------------------------------------------------------------

if [[ "${1:-}" == "--ci" ]]; then
  CI_MODE=true
  shift
fi

# ---------------------------------------------------------------
# Validate arguments
# ---------------------------------------------------------------

if [[ $# -lt 1 || -z "${1:-}" ]]; then
  echo "[ERROR] Plan ID / tag name is required." >&2
  echo "" >&2
  echo "Usage:" >&2
  echo "  Local:  $0 <plan-id>" >&2
  echo "  CI:     $0 --ci <tag-name>" >&2
  echo "  Example: $0 bakery_checkout_minimum_fix_730f7d42" >&2
  exit 1
fi

PLAN_ID="$1"

echo "======================================================"
echo " Xio's Bakery - Theme Packaging"
echo "======================================================"
echo ""

if [[ "$CI_MODE" == true ]]; then
  echo "[INFO] Running in CI mode (non-interactive)"
else
  echo "[WARNING] Local builds are for DEVELOPMENT/TESTING only."
  echo "          Production bundles must come from the CI/CD pipeline"
  echo "          (push a version tag to trigger a GitHub Release)."
  echo ""
fi

echo "[INFO] Plan ID / Tag: $PLAN_ID"
echo ""

cd "$REPO_ROOT"

# ---------------------------------------------------------------
# Step 1: Run unit tests (skipped in CI -- already ran)
# ---------------------------------------------------------------

if [[ "$CI_MODE" == true ]]; then
  echo "[STEP 1/4] Unit tests... SKIPPED (already validated by CI)"
  echo ""
else
  echo "[STEP 1/4] Running unit tests..."
  echo ""

  if ! npm test; then
    echo "" >&2
    echo "[ERROR] Unit tests failed. Fix all failures before packaging." >&2
    exit 1
  fi

  echo ""
  echo "[SUCCESS] All tests passed."
  echo ""
fi

# ---------------------------------------------------------------
# Step 2: SonarQube quality gate (skipped in CI -- ESLint/SonarJS ran)
# ---------------------------------------------------------------

if [[ "$CI_MODE" == true ]]; then
  echo "[STEP 2/4] SonarQube quality gate... SKIPPED (ESLint + SonarJS validated by CI)"
  echo ""
else
  echo "[STEP 2/4] SonarQube quality gate..."
  echo ""
  echo "  [IMPORTANT] Before continuing, confirm that SonarQube analysis"
  echo "  reports ZERO findings on all files touched in this plan."
  echo "  Use the analyze_file_list MCP tool in Cursor to verify."
  echo ""
  read -r -p "  Have all SonarQube issues been resolved? (y/N): " sonar_confirm
  if [[ ! "$sonar_confirm" =~ ^[Yy]$ ]]; then
    echo "" >&2
    echo "[ERROR] SonarQube quality gate not confirmed. Resolve all issues first." >&2
    exit 1
  fi
  echo ""
  echo "[SUCCESS] SonarQube quality gate confirmed."
  echo ""
fi

# ---------------------------------------------------------------
# Step 3: Verify theme source exists
# ---------------------------------------------------------------

echo "[STEP 3/4] Verifying theme source..."

THEME_DIR="$REPO_ROOT/themes/current"
if [[ ! -d "$THEME_DIR" ]]; then
  echo "[ERROR] Theme directory not found at $THEME_DIR" >&2
  exit 1
fi

SETTINGS_SCHEMA="$THEME_DIR/config/settings_schema.json"
if [[ ! -f "$SETTINGS_SCHEMA" ]]; then
  echo "[ERROR] settings_schema.json not found at $SETTINGS_SCHEMA" >&2
  exit 1
fi

SETTINGS_DATA="$THEME_DIR/config/settings_data.json"
if [[ ! -f "$SETTINGS_DATA" ]]; then
  echo "[ERROR] settings_data.json not found at $SETTINGS_DATA" >&2
  echo "" >&2
  echo "  This file contains the store's customizer settings (logo, colors," >&2
  echo "  typography, etc.). Without it, uploaded themes will display Liquid" >&2
  echo "  errors and missing branding." >&2
  echo "" >&2
  echo "  To fix: export settings_data.json from the live Shopify theme" >&2
  echo "  and place it at $SETTINGS_DATA" >&2
  exit 1
fi

echo "[SUCCESS] Theme source verified (schema + settings data)."
echo ""

# ---------------------------------------------------------------
# Step 4: Create ZIP bundle
# ---------------------------------------------------------------

echo "[STEP 4/4] Creating ZIP bundle..."

DATE_STAMP=$(date +"%Y%m%d")
OUTFILE="$REPO_ROOT/xios-bakery-theme-${PLAN_ID}-${DATE_STAMP}.zip"

cd "$THEME_DIR"
zip -r "$OUTFILE" . -x "*.DS_Store" "*.git*" "node_modules/*" "*.log" >/dev/null

cd "$REPO_ROOT"

echo ""
echo "======================================================"
echo " [COMPLETE] Theme packaged successfully"
echo "======================================================"
echo ""
echo " Plan ID / Tag : $PLAN_ID"
echo " Date          : $DATE_STAMP"
echo " File          : $OUTFILE"
echo ""

if [[ "$CI_MODE" == true ]]; then
  echo " [INFO] CI mode -- ZIP will be uploaded as a GitHub Release asset."
else
  echo " [WARNING] This is a LOCAL build for dev/testing only."
  echo "           Do NOT upload this ZIP to Shopify production."
  echo "           Push a version tag to create a production release."
  echo ""
  echo " Next steps (development testing):"
  echo "   1. Upload to Shopify Admin as an unpublished test theme"
  echo "   2. Preview and test interactively"
  echo "   3. Delete the test theme when done"
fi
echo ""
