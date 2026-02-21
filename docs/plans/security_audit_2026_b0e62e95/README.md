# Plan: Security Audit 2026

**Plan ID:** `security_audit_2026_b0e62e95`
**Status:** [INCOMPLETE] -- Requires fresh audit
**Date:** February 20, 2026
**Last Updated:** February 21, 2026
**Original Version:** v13.6.0-security-audit-2026
**Current Version:** v13.6.6-surgical-safesethtml-fix

---

## Objective

Conduct a comprehensive security audit of the Xio's Bakery Shopify theme covering all changes since the August 2025 audit (v13.4.3 through v13.5.0). Identify new vulnerabilities, re-validate prior fixes, and produce a formal 2026 audit report with actionable remediations.

---

## Current Status

The original security audit deliverables were largely **reverted** during troubleshooting on February 20-21, 2026. The `safeSetHTML` approach used to replace `innerHTML` in Dawn core JS files caused critical regressions:

1. **Broken header/logo** -- CSP changes in `theme.liquid` restricted font loading; `settings_schema.json` version change invalidated Shopify settings
2. **Broken cart notification popup** -- `safeSetHTML` sanitization in `cart-notification.js`, `cart.js`, `cart-drawer.js`, and `global.js` stripped scripts and event handlers needed by Dawn's section rendering API
3. **Cart icon counter not updating** -- Same root cause as above

### What Was Reverted

- All `safeSetHTML` + fallback blocks in Dawn core JS files (`cart-notification.js`, `cart.js`, `cart-drawer.js`, `global.js`) -- restored to original `innerHTML` (PRs #23, #24)
- CSP changes in `theme.liquid` -- restored to production version (PR #15)
- `settings_data.json` -- restored to production version (PR #15)
- `theme_version` in `settings_schema.json` -- restored to production value `13.4.8-tybo-hard-hide` (PR #19)

### What Remains Active

- `security-utils.js` -- loaded in `theme.liquid` but `safeSetHTML` is no longer called by Dawn core files
- `security-test.js` -- loaded in `theme.liquid`
- `third-party-security.js` -- loaded in `theme.liquid`
- `textContent` replacements in `global.js` (safe, non-breaking changes)
- `_stripDangerousAttrs()` additions in non-core files (`facets.js`, `predictive-search.js`, `quick-order-list.js`, `product-info.js`, `pickup-availability.js`, `price-per-item.js`, `quick-add.js`)
- CI/CD additions: `npm audit` step, `dependabot.yml`
- Documentation and audit reports

---

## What Was Originally Delivered (v13.6.0)

### Code Security Remediation
- Replaced 10 residual raw `innerHTML` assignments in 5 Dawn stock files with `safeSetHTML` + fallback or `textContent`
- Converted 4 raw `outerHTML` assignments in `facets.js` to cloneNode + sanitize pattern
- Added `_stripDangerousAttrs()` helper to 9 files to harden fallback sanitization paths
- Documented `quick-add.js` script re-injection as accepted risk with inline security comments

### CSP Cleanup
- Removed 15 duplicate and redundant CSP entries in `theme.liquid`
- Fixed incorrect `fonts.googleapis.com` in `font-src` directive
- Added HTML comment documenting `unsafe-inline`/`unsafe-eval` as Shopify platform limitations

### Dependency and CI/CD Security
- Generated and committed `package-lock.json` for reproducible builds
- Added `npm audit --audit-level=high` step to `ci.yml` and `release.yml`
- Created `.github/dependabot.yml` for automated weekly dependency and GitHub Actions updates

### Audit Reports
- Full English audit report: `security/audits/2026/SECURITY_AUDIT_REPORT.md`
- Spanish translation: `security/audits/2026/REPORTE_AUDITORIA_SEGURIDAD.md`
- Audit index: `security/audits/2026/README.md`

### Documentation Updates
- Updated `.github/SECURITY.md` with 2026 audit history and supported versions
- Rewrote `security/README.md` with current status and tools inventory
- Added version entry in `CHANGELOG.md`
- Updated `PLANNING.md` version and plan index

---

## Files Modified

### Theme Code (both `themes/current/` and `themes/development/`)
- `assets/quick-order-list.js` -- safeSetHTML + textContent + _stripDangerousAttrs [ACTIVE]
- `assets/product-info.js` -- safeSetHTML + _stripDangerousAttrs fallback [ACTIVE]
- `assets/pickup-availability.js` -- Hardened fallback with cloneNode + sanitize [ACTIVE]
- `assets/price-per-item.js` -- innerHTML replaced with textContent [ACTIVE]
- `assets/quick-add.js` -- Accepted risk documented, clearing uses textContent [ACTIVE]
- `assets/facets.js` -- _stripDangerousAttrs for 6 innerHTML + 4 outerHTML fallbacks [ACTIVE]
- `assets/global.js` -- safeSetHTML REVERTED to innerHTML; textContent changes remain [PARTIAL]
- `assets/cart.js` -- safeSetHTML REVERTED to innerHTML [REVERTED]
- `assets/cart-drawer.js` -- safeSetHTML REVERTED to innerHTML [REVERTED]
- `assets/cart-notification.js` -- safeSetHTML REVERTED to innerHTML [REVERTED]
- `assets/predictive-search.js` -- _stripDangerousAttrs for 1 fallback block [ACTIVE]
- `layout/theme.liquid` -- CSP changes REVERTED to production [REVERTED]; security script loading remains [ACTIVE]

### CI/CD
- `.github/workflows/ci.yml` -- npm audit step added [ACTIVE]
- `.github/workflows/release.yml` -- npm audit step added [ACTIVE]
- `.github/dependabot.yml` -- Created [ACTIVE]

### Documentation
- `.github/SECURITY.md` -- Updated [ACTIVE]
- `security/README.md` -- Rewritten [ACTIVE]
- `security/audits/2026/SECURITY_AUDIT_REPORT.md` -- Created [NEEDS UPDATE]
- `security/audits/2026/REPORTE_AUDITORIA_SEGURIDAD.md` -- Created [NEEDS UPDATE]
- `security/audits/2026/README.md` -- Created [NEEDS UPDATE]
- `CHANGELOG.md` -- Version entry added [NEEDS UPDATE]
- `PLANNING.md` -- Version and plan index updated [NEEDS UPDATE]
- `docs/plans/security_audit_2026_b0e62e95/README.md` -- This file

### Dependencies
- `package-lock.json` -- Generated [ACTIVE]

---

## Bundles Produced

No dedicated security audit bundle. Changes are included in the incremental releases from v13.6.0 through v13.6.6.

---

## Open Items

- **[CRITICAL] Fresh security audit required:** Multiple code changes from v13.6.0 through v13.6.6 have altered the security posture. A new audit must be conducted against the current codebase.
- **[CRITICAL] safeSetHTML strategy failed for Dawn core files:** The `safeSetHTML` approach breaks Dawn's section rendering API which relies on `innerHTML` with inline scripts. A different hardening strategy is needed for these 4 files (cart-notification.js, cart.js, cart-drawer.js, global.js).
- **[CRITICAL] CSP changes reverted:** The CSP cleanup in `theme.liquid` was reverted because it broke font loading and header rendering. CSP changes must be re-applied incrementally with testing.
- **security-utils.js is loaded but unused by core files:** `window.safeSetHTML` is defined globally but no Dawn core file calls it. Consider removing the script load from `theme.liquid` or limiting it to files that still use it.
- **Audit reports are stale:** `SECURITY_AUDIT_REPORT.md` and its Spanish translation reflect the v13.6.0 state, not the current v13.6.6 state.
- **minimatch ReDoS (dev-only):** 22 high-severity npm audit findings in eslint/jest transitive dependencies. Monitor for upstream fixes. No production impact.
- **Shopify CSP limitations:** `unsafe-inline`/`unsafe-eval` required by Shopify platform. Adopt nonce-based CSP when supported.
- **Next audit:** Must be conducted before any production deployment of security changes.
