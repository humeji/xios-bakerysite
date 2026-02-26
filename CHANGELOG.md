# Changelog

All notable versions of the Xio's Bakery Shopify theme are documented here in reverse chronological order.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [13.6.7-explicit-cart-settings] - 2026-02-23

### Fixed
- Added explicit cart & checkout settings (`enable_minimum_order`, `minimum_order_amount`, `show_digital_no_refund_message`, messages EN/ES) to `settings_data.json` so minimum order enforcement activates on first ZIP upload without manual configuration

### Changed
- Bumped eslint from 10.0.1 to 10.0.2 (Dependabot)

### Added
- 37 regression tests in `tests/regression-2026-02-21.test.js` covering theme version integrity, Dawn core JS isolation, Liquid default filters, dynamic checkout button hiding, settings_data.json validity, security-utils.js isolation, and current/development sync

---

## [13.6.6-surgical-safesethtml-fix] - 2026-02-21

**Plan:** `security_audit_2026_b0e62e95`

### Fixed
- Surgically removed `safeSetHTML` from Dawn core JS files (`cart-notification.js`, `cart.js`, `cart-drawer.js`, `global.js`) while keeping all other security-related code intact (textContent replacements, `_stripDangerousAttrs()` in non-core files)

---

## [13.6.5-restore-cart-notification] - 2026-02-21

### Fixed
- Restored `cart-notification.js`, `cart.js`, `cart-drawer.js`, `global.js` to production originals to fix broken cart notification popup and cart icon counter caused by `safeSetHTML` sanitization stripping scripts and event handlers required by Dawn's section rendering API

---

## [13.6.4-enable-toggle-fix] - 2026-02-21

### Fixed
- `enable_minimum_order` toggle now properly disables the minimum order enforcement feature when unchecked

---

## [13.6.3-design-mode-warning-fix] - 2026-02-21

### Fixed
- Design mode admin warning now respects the `enable_minimum_order` toggle (hidden when feature disabled)
- Design mode warning handles 0 and negative minimum amounts gracefully
- Design mode warning displays in Spanish when store locale is `es`

---

## [13.6.2-hide-dynamic-checkout] - 2026-02-21

### Fixed
- Shop Pay and dynamic checkout buttons now hidden when cart total is below minimum order amount (prevents bypass of minimum enforcement)

---

## [13.6.1-cart-minimum-order-fix] - 2026-02-21

### Fixed
- Reverted `theme_version` in `settings_schema.json` back to production value `13.4.8-tybo-hard-hide` to fix header logo rendering broken by version mismatch

---

## [13.6.0-cart-minimum-order] - 2026-02-21

**Plans:** `security_audit_2026_b0e62e95`, `bakery_checkout_minimum_fix_730f7d42`

### Added
- Re-applied cart minimum order enforcement and digital product validation (lost during v13.5.9 production match)
- February 2026 security audit report (English and Spanish) in `security/audits/2026/`
- `_stripDangerousAttrs()` helper in 9 non-core JS files for hardened fallback sanitization
- `npm audit` step in CI and Release workflows for dependency vulnerability scanning
- `.github/dependabot.yml` for automated weekly dependency and GitHub Actions updates
- `package-lock.json` committed for reproducible builds

### Fixed
- 4 raw `outerHTML` assignments in `facets.js` replaced with cloneNode + sanitize pattern
- Fallback sanitization in 9 non-core files hardened to strip `on*` event handler attributes
- `quick-add.js` script re-injection documented as accepted risk with inline security comments

### Changed
- `.github/SECURITY.md` updated with 2026 audit history and supported version table
- `security/README.md` rewritten with 2026 audit links and security tools inventory

### Removed
- Shopify GitHub integration (`shopify` branch, sync workflow, helper script, Cursor rule) -- disconnected and fully removed

**Note:** Security audit work for Dawn core JS (`safeSetHTML` replacements) and CSP cleanup in `theme.liquid` were included in this release but later reverted in v13.6.5 and v13.6.6 due to critical regressions. See [plan status](docs/plans/security_audit_2026_b0e62e95/README.md).

---

## [13.5.9-exact-production-match] - 2026-02-21

### Changed
- Theme files restored to exact production match to resolve persistent header rendering issue on ZIP upload
- Reverted security audit JS refactoring and cart minimum order theme code to match working production state

---

## [13.5.0-cicd-pipeline] - 2026-02-20

**Plan:** `ci_cd_pipeline_setup_713a17f2`

### Added
- GitHub Actions CI workflow: runs Jest tests + ESLint/SonarJS on every push and PR
- GitHub Actions Release workflow: validates, packages ZIP, and creates GitHub Release on version tag push
- ESLint + eslint-plugin-sonarjs for automated code quality enforcement (same rules as SonarQube for IDE)
- ESLint flat config (`eslint.config.mjs`) with full enforcement on custom files and relaxed rules for Shopify Dawn stock files
- Pre-commit hook (husky + lint-staged) that blocks commits with lint errors
- `npm run lint` and `npm run lint:ci` scripts
- Build policy: production ZIPs are CI-only; local builds are for dev testing
- Repository ruleset "Protect main": requires PR + passing `test-and-lint` check before merging to `main`

### Changed
- Repository visibility changed from **private to public** (required for GitHub Free to enforce repository rulesets)
- `scripts/package-theme.sh` now supports `--ci` flag for non-interactive CI execution
- Local packaging script runs display a warning that builds are for development only
- `scripts/README.md` restructured with separate Production Releases and Local Development sections
- `.github/DEVELOPMENT.md` updated with CI/CD workflows, build policy, release process, and branch protection details
- `PLANNING.md` updated with CI/CD in tech stack, deployment workflow, and documentation index

### Fixed
- `themes/*/assets/magnify.js`: implicit global variable (added `let` keyword)
- `themes/*/assets/show-more.js`: unused variable removed
- `themes/current/assets/third-party-security.js`: ignored exceptions now log debug messages; constructor-for-side-effects resolved
- `tests/cart-validation.test.js`: removed 3 unused imports

### Removed
- `.github/workflows/security.yml.example` (superseded by `ci.yml` and `release.yml`)

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
- Project standards: PLANNING.md, CHANGELOG.md, .github/DEVELOPMENT.md
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
