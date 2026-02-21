# Plan: Shopify GitHub Sync

**Plan ID:** `shopify_github_sync_a1b2c3d4`
**Status:** [COMPLETE]
**Date:** February 20, 2026

---

## Objective

Connect the GitHub repository directly to the Shopify store via Shopify's GitHub integration to streamline the development and delivery workflow.

## Problem

Shopify's GitHub integration requires theme files (`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`) at the root of the connected branch. The repository's `main` branch stores theme files under `themes/current/`, causing Shopify to reject the connection with "Branch isn't a valid theme."

## Solution

Created an auto-generated orphan branch (`shopify`) that mirrors `themes/current/` at root level. A GitHub Action keeps this branch in sync whenever theme files change on `main`.

## What Was Delivered

- **GitHub Action workflow** (`.github/workflows/sync-shopify-branch.yml`): Automatically rebuilds the `shopify` branch from `themes/current/` on every push to `main` that modifies theme files. Also supports manual dispatch.
- **Helper script** (`scripts/create-shopify-branch.sh`): Creates the initial `shopify` branch locally without affecting the working tree. Useful for first-time setup or manual rebuilds.
- **CI exclusion**: Updated `ci.yml` to skip the `shopify` branch (no `package.json` or tests on that branch).
- **Documentation updates**: PLANNING.md, DEVELOPMENT.md, scripts/README.md, and CHANGELOG.md updated with Shopify GitHub integration details.

## Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/sync-shopify-branch.yml` | GitHub Action to sync `themes/current/` to `shopify` branch |
| `scripts/create-shopify-branch.sh` | Helper script for initial branch creation |
| `docs/plans/shopify_github_sync_a1b2c3d4/README.md` | This plan record |

## Files Modified

| File | Change |
|------|--------|
| `.github/workflows/ci.yml` | Excluded `shopify` branch from CI triggers |
| `.github/DEVELOPMENT.md` | Added Shopify GitHub Integration section and updated CI Workflows table |
| `PLANNING.md` | Added deployment workflow section, updated tech stack, constraints, documentation index, and plan table |
| `scripts/README.md` | Documented `create-shopify-branch.sh` |
| `CHANGELOG.md` | Added version entry |

## How to Connect in Shopify

1. Go to Shopify Admin > Online Store > Themes
2. Click "Add theme" or use the "Connect theme" panel
3. Select the `humeji` account and `xios-bakerysite` repository
4. Select the **`shopify`** branch (not `main`)
5. Shopify will detect the theme and add it to the theme library

## Open Items

- None
