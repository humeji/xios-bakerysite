# Plan: Security Audit 2026

**Plan ID:** `security_audit_2026_b0e62e95`
**Status:** [COMPLETE]
**Date:** February 20, 2026
**Version:** v13.6.0-security-audit-2026

---

## Objective

Conduct a comprehensive security audit of the Xio's Bakery Shopify theme covering all changes since the August 2025 audit (v13.4.3 through v13.5.0). Identify new vulnerabilities, re-validate prior fixes, and produce a formal 2026 audit report with actionable remediations.

---

## What Was Delivered

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
- `assets/quick-order-list.js` -- safeSetHTML + textContent + _stripDangerousAttrs
- `assets/product-info.js` -- safeSetHTML + _stripDangerousAttrs fallback
- `assets/pickup-availability.js` -- Hardened fallback with cloneNode + sanitize
- `assets/price-per-item.js` -- innerHTML replaced with textContent
- `assets/quick-add.js` -- Accepted risk documented, clearing uses textContent
- `assets/facets.js` -- _stripDangerousAttrs for 6 innerHTML + 4 outerHTML fallbacks
- `assets/global.js` -- _stripDangerousAttrs for 6 fallback blocks
- `assets/cart.js` -- _stripDangerousAttrs for 2 fallback blocks
- `assets/cart-drawer.js` -- _stripDangerousAttrs for 1 fallback block
- `assets/cart-notification.js` -- _stripDangerousAttrs for 1 fallback block
- `assets/predictive-search.js` -- _stripDangerousAttrs for 1 fallback block
- `layout/theme.liquid` -- CSP cleaned, comment added

### CI/CD
- `.github/workflows/ci.yml` -- npm audit step added
- `.github/workflows/release.yml` -- npm audit step added
- `.github/dependabot.yml` -- Created

### Documentation
- `.github/SECURITY.md` -- Updated
- `security/README.md` -- Rewritten
- `security/audits/2026/SECURITY_AUDIT_REPORT.md` -- Created
- `security/audits/2026/REPORTE_AUDITORIA_SEGURIDAD.md` -- Created
- `security/audits/2026/README.md` -- Created
- `CHANGELOG.md` -- Version entry added
- `PLANNING.md` -- Version and plan index updated
- `docs/plans/security_audit_2026_b0e62e95/README.md` -- This file

### Dependencies
- `package-lock.json` -- Generated

---

## Bundles Produced

No theme ZIP bundle produced for this plan. This was a security audit and remediation plan. The next version tag (`v13.6.0-security-audit-2026`) will trigger the release workflow.

---

## Open Items

- **minimatch ReDoS (dev-only):** 22 high-severity npm audit findings in eslint/jest transitive dependencies. Monitor for upstream fixes. No production impact.
- **Shopify CSP limitations:** `unsafe-inline`/`unsafe-eval` required by Shopify platform. Adopt nonce-based CSP when supported.
- **Quarterly audits:** Next audit recommended Q2 2026.
