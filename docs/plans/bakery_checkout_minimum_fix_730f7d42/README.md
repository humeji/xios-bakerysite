# Plan Summary: Checkout Minimum Order Fix

**Plan ID:** `bakery_checkout_minimum_fix_730f7d42`  
**Status:** [COMPLETE]  
**Dates:** February 19-23, 2026  
**Client:** Xiomarly Perez - Xio's Bakery (xiosbakery.com)

---

## Objective

Replace the cookie-count checkout blocking with a configurable $40 minimum order total, allow digital product purchases without requiring cookies, and add non-refundable messaging for digital items.

## What Was Delivered

### Core Implementation (Feb 19)

- Configurable minimum order amount ($40 default) via Shopify Theme Settings
- Digital product detection using Shopify's `requires_shipping` property
- Non-refundable purchase notice for digital products
- Shop owner can change minimum amount without developer assistance

### Hardening & Localization (Feb 20)

- Edge case protection: values of 0, negative, NaN, Infinity safely fall back to $40 default
- Bilingual support (English/Spanish) for all customer-facing messages
- Separate configurable message fields for English and Spanish in Theme Settings
- Admin-only warning banner in theme editor when minimum is set below $20

### Live Deployment Validation (Feb 21)

A comprehensive live deployment session was conducted against the production store (xiosbakery.com). During interactive testing, seven bugs were discovered and resolved across PRs #14 through #24. Each fix was deployed through the CI/CD pipeline, verified live, and captured with a dedicated regression test. Issues found and resolved:

| # | Bug Found During Testing | Root Cause | Fix (PR) |
|---|--------------------------|------------|----------|
| 1 | JSONC comments in `settings_data.json` broke Shopify ZIP upload | JSONC headers are not valid JSON; Shopify parser rejected the file | PR #14 |
| 2 | Header logo disappeared after ZIP upload ("Liquid error") | Changing `theme_version` in `settings_schema.json` invalidated image references | PR #19 |
| 3 | Shop Pay / Apple Pay / Google Pay buttons remained clickable below minimum | Only the main checkout button was disabled; dynamic checkout buttons were not hidden | PR #20 |
| 4 | Design mode warning showed even when feature was disabled | Warning did not check the `enable_minimum_order` toggle; also lacked Spanish translation and 0/negative handling | PR #21 |
| 5 | "Enable minimum order" toggle did not actually disable the feature | Liquid `| default: true` filter treats boolean `false` as falsy and replaces it with `true` | PR #22 |
| 6 | Cart notification popup and icon counter stopped working | `safeSetHTML` sanitization stripped scripts and event handlers required by Dawn's section rendering API | PRs #23, #24 |
| 7 | Cart & Checkout settings missing from `settings_data.json` presets | Theme settings section existed in schema but had no matching entry in `settings_data.json`, causing Shopify to ignore it on fresh uploads | PR #27 |

Additionally, PRs #15-#18 handled restoring production JS files, removing the Shopify GitHub sync integration, and cleanly re-applying the cart minimum order feature on a verified production baseline.

### Regression Test Suite (Feb 21)

37 targeted regression tests were added in `tests/regression-2026-02-21.test.js` covering all seven bugs above. These tests run in CI on every push and PR to prevent reintroduction. Coverage areas:

- `theme_version` must remain at the production value (`13.4.8-tybo-hard-hide`)
- `safeSetHTML` must not appear in Dawn core JS files (`cart-notification.js`, `cart.js`, `cart-drawer.js`, `global.js`)
- Liquid templates must not use `| default: true` for boolean settings
- Dynamic checkout buttons must be hidden when below minimum
- `settings_data.json` must be valid JSON with no JSONC comments
- `security-utils.js` must remain isolated from Dawn core files
- `themes/current/` and `themes/development/` must stay in sync for all critical files

### Final Stabilization (Feb 23)

- Explicit cart and checkout settings added to `settings_data.json` presets so new theme uploads receive correct defaults (PR #27)
- Email configuration guide (`GUIA_CONFIGURACION_CORREO_ES.md`) updated to v2.0 with simplified step-by-step instructions
- Deployment guide revised for non-technical client audience

### Quality & Infrastructure (Feb 20)

- 86 automated unit tests (Jest) across 4 test suites: cart validation, locale messages, config parsing, and regression
- Project documentation: PLANNING.md, CHANGELOG.md, .github/DEVELOPMENT.md
- CI/CD pipeline (GitHub Actions) running tests, linting, and security scans on every push
- Release pipeline producing verified ZIPs via version tags
- Packaging rules: tests must pass, docs must be current, plan-ID naming convention

## Validation Matrix

| Cart Contents | Total | Checkout | Messages |
|---------------|-------|----------|----------|
| Empty | N/A | Disabled | -- |
| Digital only | < $40 | Disabled | Minimum amount + Refund notice |
| Digital only | >= $40 | Enabled | Refund notice |
| Physical only | < $40 | Disabled | Minimum amount |
| Physical only | >= $40 | Enabled | -- |
| Mixed | < $40 | Disabled | Minimum amount + Refund notice |
| Mixed | >= $40 | Enabled | Refund notice |

All scenarios were verified live on xiosbakery.com during the Feb 21 deployment session.

## Theme Settings Added

| Setting | Type | Default |
|---------|------|---------|
| Enable minimum order amount | checkbox | true |
| Minimum order amount (USD) | number | 40 |
| Show non-refundable notice | checkbox | true |
| Digital product refund message (English) | textarea | (English default) |
| Digital product refund message (Spanish) | textarea | (Spanish default) |

## Files Modified

| File | Changes |
|------|---------|
| `config/settings_schema.json` | Added "Cart & Checkout Rules" section with 5 configurable fields |
| `config/settings_data.json` | Added explicit cart & checkout defaults to presets (PR #27) |
| `assets/custom.js` | Replaced cookie validation with minimum order + locale-aware messaging; hides dynamic checkout buttons below minimum |
| `assets/custom.css` | Added styling for validation and refund notice messages |
| `sections/main-cart-items.liquid` | Locale-aware messages, data attributes, design_mode warning with toggle check and Spanish translation |
| `snippets/cart-drawer.liquid` | Mirrored cart page changes for the slide-out cart drawer |
| `assets/cart-notification.js` | Restored to production original (reverted safeSetHTML breakage) |
| `assets/cart.js` | Restored to production original (reverted safeSetHTML breakage) |
| `assets/cart-drawer.js` | Restored to production original (reverted safeSetHTML breakage) |
| `assets/global.js` | Restored to production original (reverted safeSetHTML breakage) |

All changes applied to both `themes/current/` and `themes/development/`, verified in sync by automated tests.

## Plan Documents

| Document | Language | Purpose |
|----------|----------|---------|
| [README.md](README.md) | EN | This file -- high-level plan completion record |
| [GUIA_DESPLIEGUE_MINIMO_PEDIDO_ES.md](GUIA_DESPLIEGUE_MINIMO_PEDIDO_ES.md) | ES | Deployment and interactive testing guide (10-step checklist) |
| [GUIA_CONFIGURACION_CORREO_ES.md](GUIA_CONFIGURACION_CORREO_ES.md) | ES | Email configuration guide (optional add-on, pending client action) |

## Releases Produced

| Release | Tag | Date | Notes |
|---------|-----|------|-------|
| Initial implementation | (local ZIP) | Feb 19 | Pre-CI bundle with core feature |
| Hardened bundle | (local ZIP) | Feb 20 | Edge cases, localization, 49 tests |
| Exact production match | `v13.5.9` | Feb 21 | Baseline restore before re-applying features |
| Cart minimum re-applied | `v13.6.1` | Feb 21 | Feature re-applied on clean production base |
| Dynamic checkout fix | `v13.6.2` | Feb 21 | Shop Pay / Apple Pay hidden below minimum |
| Design mode warning fix | `v13.6.3` | Feb 21 | Warning respects toggle, Spanish, 0/negative |
| Enable toggle fix | `v13.6.4` | Feb 21 | Toggle actually disables the feature |
| Core JS restored | `v13.6.5` | Feb 21 | Cart notification and icon counter working |
| safeSetHTML surgical removal | `v13.6.6` | Feb 21 | Final fix for Dawn core JS isolation |
| Explicit settings data | `v13.6.7` | Feb 23 | Cart settings defaults in settings_data.json |

Each release from `v13.5.9` onward was produced by the CI/CD Release pipeline (GitHub Actions), which runs the full test suite and lint checks before packaging.

## Open Items

- [OPTIONAL] Email domain configuration -- requires client action first (see GUIA_CONFIGURACION_CORREO_ES.md)
