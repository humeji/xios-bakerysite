# Xio's Bakery - Project Planning & Architecture

**Project:** Shopify Theme for Xio's Bakery  
**Store URL:** xiosbakery.com  
**Admin URL:** https://xiosbakery.myshopify.com/admin  
**Current Version:** v13.4.9-checkout-minimum-fix  
**Last Updated:** February 20, 2026

---

## Project Overview

A Shopify storefront theme for Xio's Bakery, a bakery business that sells physical products (cookies, baked goods) and digital products (recipe e-books). The theme is based on Shopify's Dawn theme with extensive custom modifications for security, cart validation, and digital product support.

---

## Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Templates | Shopify Liquid |
| JavaScript | Vanilla JS + jQuery (loaded via Shopify CDN) |
| Styling | CSS (custom.css + Shopify component CSS) |
| Testing | Jest (Node environment) |
| Packaging | Bash script + Python 3 (`scripts/package-theme.sh`) |
| Environment | Python 3.10+ venv, Node.js 18+ |
| Deployment | Manual ZIP upload to Shopify Admin |

### Directory Structure

```
xios-bakerysite/
├── themes/
│   ├── current/              # Production theme (packaged into ZIP)
│   │   ├── assets/           # JS, CSS, images
│   │   ├── config/           # settings_schema.json, settings_data.json
│   │   ├── layout/           # theme.liquid (base layout)
│   │   ├── locales/          # en.default.json, es.json, etc.
│   │   ├── sections/         # Reusable page sections
│   │   ├── snippets/         # Small reusable components
│   │   └── templates/        # Page templates
│   └── development/          # Development copy (mirrors current/)
├── tests/                    # Jest unit tests
│   └── helpers/              # Test utilities and extracted logic
├── scripts/                  # Build/deployment scripts
├── docs/                     # Project documentation
├── security/                 # Security audit reports and guides
├── .github/                  # GitHub config, workflows, development guide
├── ig-fixed.xml              # Reference HTML: corrected Instagram embed snippet
└── package.json              # Node dependencies (dev-only, for testing)
```

### Key Custom Files

| File | Purpose |
|------|---------|
| `assets/custom.js` | Cart validation: minimum order enforcement, digital product detection |
| `assets/custom.css` | Styling for validation messages and refund notices |
| `assets/security-utils.js` | XSS-safe DOM manipulation utilities |
| `config/settings_schema.json` | Theme settings including "Cart & Checkout Rules" section |
| `sections/main-cart-items.liquid` | Cart page with locale-aware messages and admin warnings |
| `snippets/cart-drawer.liquid` | Slide-out cart drawer (mirrors cart page logic) |
| `layout/theme.liquid` | Base layout with CSP headers and security config |

---

## Conventions & Standards

### Dual-Theme Workflow

All code changes must be applied to both `themes/current/` and `themes/development/`. The current theme is the source for ZIP packaging; the development theme is a working copy.

### Localization

- The store supports **English** (default) and **Spanish**
- Customer-facing messages use `request.locale.iso_code` to select the correct language
- Configurable messages have separate fields per language in `settings_schema.json`
- Static system text uses Shopify's `| t` filter with locale files (`locales/en.default.json`, `locales/es.json`)

### Settings Schema Pattern

Custom settings go in the "Cart & Checkout Rules" section of `settings_schema.json`. When adding new configurable fields:

1. Use descriptive `id`, `label`, and `info` text
2. Always provide a `default` value
3. Add validation info in the `info` field (e.g., valid ranges)
4. For text fields, provide separate entries for English and Spanish

### JavaScript Patterns

- Cart validation logic lives in `custom.js`
- Configuration is read from `data-*` attributes on hidden DOM elements (set by Liquid)
- The Shopify Cart API (`/cart.js`) is polled via `$.getJSON` every 5 seconds
- Digital products are identified by `requires_shipping === false`
- Input parsing uses `Number.isFinite()` guards with safe fallback defaults

### CSS Patterns

- Custom styles in `custom.css` (not inline, except for admin-only warnings)
- Message types: `.custom-cart-qty-msg` (red/error), `.digital-no-refund-msg` (yellow/warning)
- Cart drawer variants get `.drawer__cart-notice` as an additional class

### Security

- CSP headers defined in `layout/theme.liquid`
- All DOM manipulation uses `security-utils.js` safe functions
- No inline JavaScript in templates (except Shopify-required schema blocks)
- Sourcemaps disabled in production
- See `security/README.md` for full security documentation

---

## Testing

### Test Structure

```
tests/
├── helpers/
│   ├── cart-validation-logic.js   # Extracted pure logic from custom.js
│   └── cart-dom-setup.js          # Mock cart builder utility
├── cart-validation.test.js        # Core cart validation scenarios
├── config-parsing.test.js         # Edge cases for settings parsing
└── locale-messages.test.js        # Localized message rendering
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode during development
npm run test:ci       # CI mode with coverage report
```

### SonarQube Quality Gate

Every file created, modified, or touched must pass SonarQube analysis with **zero findings** before the change is considered complete. Use the `analyze_file_list` MCP tool to scan changed files. This applies to production code, test files, helper modules, scripts, and stylesheets alike.

See `.cursor/rules/sonarqube-quality-gate.mdc` for the full rule.

### Test-Code Sync Rule

The test helpers in `tests/helpers/cart-validation-logic.js` mirror the pure logic from `custom.js`. When `custom.js` changes:

1. Update the corresponding function in `cart-validation-logic.js`
2. Add or update tests for the changed behavior
3. Run `npm test` to verify nothing is broken
4. Run SonarQube analysis on all changed files -- zero findings required
5. Only package the theme after tests and SonarQube pass

### What to Test

When adding new cart/checkout features:

- At least 1 test for expected behavior
- At least 1 edge case (boundary values, empty inputs)
- At least 1 failure case (invalid input, missing data)

---

## Deployment Workflow

1. Make changes in `themes/current/` and `themes/development/`
2. Run `npm test` -- all tests must pass
3. Run SonarQube analysis on all touched files -- zero findings required
4. Update all relevant documentation (see Documentation Index below)
5. Update `TASK.md` at the project root with a ledger entry for the work
6. Run `./scripts/package-theme.sh <plan-id>` to create the ZIP bundle
7. Upload ZIP to Shopify Admin > Online Store > Themes
8. Preview the theme, run interactive tests per deployment guide
9. Publish when verified

For packaging prerequisites, naming conventions, versioning, and checklist, see [`scripts/README.md`](scripts/README.md).

---

## Documentation Index

### Project-Level Documents

| Document | Language | Purpose |
|----------|----------|---------|
| `TASK.md` | EN | Work ledger -- tracks completed work by date and plan ID |
| `PLANNING.md` | EN | This file -- architecture, conventions, constraints |
| `README.md` | EN | Quick start, project overview |
| `.github/DEVELOPMENT.md` | EN | Development workflow, testing, packaging |
| `.cursor/rules/packaging-workflow.mdc` | EN | Cursor rule enforcing packaging requirements |
| `.cursor/rules/sonarqube-quality-gate.mdc` | EN | Cursor rule enforcing SonarQube zero-issue gate |
| `.cursor/rules/plan-documentation.mdc` | EN | Cursor rule enforcing plan-scoped documentation |
| `.github/SECURITY.md` | EN | Security policy, audit history, vulnerability reporting |
| `.cursor/rules/plan-kickoff.mdc` | EN | Cursor rule enforcing plan kickoff review |
| `CHANGELOG.md` | EN | Version history -- every bundle shipped, reverse chronological |
| `security/README.md` | EN | Security audit reports and XSS remediation |
| `ig-fixed.xml` | EN | Reference HTML snippet: corrected Instagram profile embed (`@xios.bakery`) using oEmbed blockquote + `embed.js`. Not consumed by the theme directly -- paste into a Liquid section or custom HTML block when updating the storefront Instagram widget. |

### Plan-Scoped Documents

Plan-specific docs live in `docs/plans/<plan-id>/`. Each plan folder has a `README.md` as its high-level completion record (GitHub auto-renders it when browsing the folder).

| Plan | Folder | Status |
|------|--------|--------|
| Checkout Minimum Fix | `docs/plans/bakery_checkout_minimum_fix_730f7d42/` | [COMPLETE] |

**Contents of `bakery_checkout_minimum_fix_730f7d42/`:**

| Document | Language | Purpose |
|----------|----------|---------|
| `README.md` | EN | High-level plan completion record |
| `SOW_MINIMO_PEDIDO_ES.md` | ES | Statement of work and cost estimate |
| `SOW_RECETARIOS_FIX_ES.md` | ES | Original SOW from Dec 2025 (predecessor) |
| `GUIA_DESPLIEGUE_MINIMO_PEDIDO_ES.md` | ES | Deployment and interactive testing guide |
| `GUIA_CONFIGURACION_CORREO_ES.md` | ES | Email configuration guide (optional add-on) |

---

## Constraints

- **No build tools**: Shopify themes load assets directly -- no webpack, bundler, or transpiler
- **No ES modules in theme JS**: Browser scripts use IIFE/global patterns, not `import/export`
- **jQuery dependency**: The theme relies on jQuery (loaded via Shopify CDN), so custom JS uses `$`
- **Manual deployment**: No Shopify CLI -- changes are deployed via ZIP upload
- **Two themes in sync**: `themes/current/` and `themes/development/` must always match
- **Sourcemaps disabled**: Never expose sourcemaps in production deployments

---

## Active Feature: Cart & Checkout Rules

### Configuration (Theme Settings)

| Setting | Type | Default | Notes |
|---------|------|---------|-------|
| `enable_minimum_order` | checkbox | true | Master toggle for minimum enforcement |
| `minimum_order_amount` | number | 40 | USD amount; must be > 0, warns if < $20 |
| `show_digital_no_refund_message` | checkbox | true | Toggle refund notice visibility |
| `digital_no_refund_message` | textarea | (English default) | Shown when locale is English |
| `digital_no_refund_message_es` | textarea | (Spanish default) | Shown when locale is Spanish |

### Validation Matrix

| Cart Contents | Total | Checkout | Messages |
|---------------|-------|----------|----------|
| Empty | N/A | Disabled | -- |
| Digital only | < min | Disabled | Minimum + Refund notice |
| Digital only | >= min | Enabled | Refund notice |
| Physical only | < min | Disabled | Minimum |
| Physical only | >= min | Enabled | -- |
| Mixed | < min | Disabled | Minimum + Refund notice |
| Mixed | >= min | Enabled | Refund notice |
