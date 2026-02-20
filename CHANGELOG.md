# Changelog

All notable versions of the Xio's Bakery Shopify theme are documented here in reverse chronological order.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [13.4.9-checkout-minimum-fix] - 2026-02-20

**Plan:** `bakery_checkout_minimum_fix_730f7d42`
**Bundle:** `xios-bakery-theme-bakery_checkout_minimum_fix_730f7d42-20260220.zip`

### Added
- Configurable minimum order amount ($40 default) via Theme Settings
- Digital product detection using `requires_shipping` property
- Non-refundable purchase notice for digital products (EN/ES)
- Bilingual support (English/Spanish) for all customer-facing cart messages
- Admin-only warning banner when minimum is set below $20
- 49 automated unit tests (Jest) for validation, parsing, and localization
- Project standards: PLANNING.md, TASK.md, CHANGELOG.md, .github/DEVELOPMENT.md
- Cursor rules for packaging, SonarQube, plan docs, and plan kickoff
- SonarQube quality gate enforced on all code changes

### Changed
- Replaced cookie-count checkout blocking with minimum order total enforcement
- `custom.js` now reads config from Liquid data attributes instead of hardcoded values
- Edge case protection: 0, negative, NaN, Infinity inputs default to $40
- `scripts/package-theme.sh` now enforces test gate and SonarQube confirmation
- ZIP naming convention changed to `xios-bakery-theme-<plan-id>-<YYYYMMDD>.zip`

### Removed
- Legacy cookie-based cart validation

---

## [13.4.8-tybo-hard-hide] - 2025-12-18

**Bundle:** `xios-bakery-theme-v13.4.8-tybo-hard-hide-20251218-130327.zip`

### Fixed
- CSS-based Tybo suppression for unwanted third-party widget
- Mobile TikTok social link rendering
- Removed broken neutralizer script

---

## [13.4.3-tiktok-link-fix2] - 2025-08-23

### Fixed
- TikTok social link normalization: accepts `@handle` format and ensures HTTPS URL opens safely
- Packaging script improvements and version sync between ZIP and internal metadata

### Changed
- Conditional CSP: Instagram/Facebook always enabled; Pop Convert allowed only when toggle is on
- Documentation refresh (README, SECURITY, deployment guide, audit reports)

---

## [13.4.0-popconvert-toggle] - 2025-08-23

### Added
- Pop Convert toggleable integration via Theme Settings (Integrations section)
- Neutralizer script that prevents Pop Convert loading when disabled

---

## [13.3.9-thirdparty-disabled] - 2025-08-22

### Changed
- Disabled third-party integrations and dynamic checkout temporarily for stability

---

## [13.3.8] - 2025-08-22

### Fixed
- Complete console message suppression for clean browser output

---

## [13.3.5] - 2025-08-22

### Fixed
- Internal `theme_version` metadata synced correctly
- Console message filtering for remaining warnings

---

## [13.3.4] - 2025-08-22

### Fixed
- Final cleanup of all remaining console errors and warnings

---

## [13.3.2] - 2025-08-22

### Fixed
- Blocked resource issues identified via HAR analysis

---

## [13.3.1] - 2025-08-22

### Fixed
- Complete resolution of all browser console errors

---

## [13.3.0] - 2025-08-22

### Fixed
- Security and console fixes resolving all browser console errors

---

## [13.2.8-secure] - 2025-08-22

**Bundle:** `xios-bakery-theme-v13.2.8-secure-20250822.zip`

### Fixed
- 68+ XSS vulnerabilities resolved (all `innerHTML` replaced with `safeSetHTML()`)
- Content Security Policy implemented with third-party integration support
- Security headers added: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Input sanitization via `security-utils.js`
- Product thumbnail and video srcset parsing errors resolved
- Shop.app payment session and Pop Convert CDN CSP violations resolved

### Added
- `security-utils.js` -- safe DOM manipulation utilities
- `security-test.js` -- XSS prevention test harness (`window.testXSSPrevention()`)
- Comprehensive security audit documentation

---

## [13.1.2-secure] - 2025-08-21

### Fixed
- Comprehensive CSP fixes for third-party domains

---

## [13.1.1-secure] - 2025-08-21

### Fixed
- CSP bugfix and `security-test.js` loading in `theme.liquid`

---

## [13.1.0-secure] - 2025-08-21

### Added
- Initial security audit and comprehensive documentation
- First round of XSS vulnerability remediation
