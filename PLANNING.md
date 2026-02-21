# Xio's Bakery - Project Planning & Architecture

**Project:** Shopify Theme for Xio's Bakery  
**Store URL:** xiosbakery.com  
**Admin URL:** https://xiosbakery.myshopify.com/admin  
**Current Version:** v13.7.0-shopify-github-sync  
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
| Linting | ESLint + eslint-plugin-sonarjs (SonarQube rules) |
| Pre-commit | husky + lint-staged (ESLint on staged files) |
| CI/CD | GitHub Actions (test + lint on push; ZIP + Release on tag; Shopify branch sync) |
| Packaging | Bash script (`scripts/package-theme.sh`) |
| Environment | Python 3.10+ venv, Node.js 18+ |
| Deployment | ZIP upload to Shopify Admin, or Shopify GitHub integration (`shopify` branch) |

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
│   └── reference/            # Known-good third-party embed snippets
├── security/                 # Security audit reports and guides
├── .github/                  # GitHub config, CI/CD workflows, development guide
├── .husky/                   # Git hooks (pre-commit: ESLint via lint-staged)
├── eslint.config.mjs         # ESLint flat config with SonarJS rules
└── package.json              # Node dependencies (dev-only, for testing + linting)
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

### Build Policy

| Build Type | How | Purpose | Upload to Shopify? |
|------------|-----|---------|-------------------|
| **Production** | Push a git tag (`v13.x.x-plan-name`) | CI-validated release | YES |
| **Local** | `./scripts/package-theme.sh <plan-id>` | Dev testing only | NO |

Production ZIPs are created exclusively by the CI/CD release workflow. Local builds are for development testing only.

### Development to Release

1. Make changes in `themes/current/` and `themes/development/`
2. Commit (pre-commit hook runs ESLint/SonarJS on staged files)
3. Push branch, open PR -- CI runs `npm test` + `npm run lint:ci` automatically
4. Run SonarQube for IDE on all touched files -- zero findings required
5. Update all relevant documentation (see Documentation Index below)
6. Merge PR after CI passes
7. When ready to release:
   ```bash
   git tag v13.5.0-plan-name
   git push --tags
   ```
8. GitHub Actions runs tests + lint + packages ZIP + creates GitHub Release
9. Download ZIP from [GitHub Releases](https://github.com/humeji/xios-bakerysite/releases)
10. Upload ZIP to Shopify Admin > Online Store > Themes
11. Preview the theme, run interactive tests per deployment guide
12. Publish when verified

### Shopify GitHub Integration (Live Sync)

The `shopify` branch is an auto-generated orphan branch that contains only the contents of `themes/current/` at root level. This satisfies Shopify's requirement that theme files be at the branch root.

**How it works:**

- A GitHub Action (`.github/workflows/sync-shopify-branch.yml`) rebuilds the `shopify` branch every time `themes/current/` changes on `main`
- The `shopify` branch can also be rebuilt manually via `workflow_dispatch` in GitHub Actions
- In Shopify Admin > Themes > Connect theme, select the `shopify` branch
- Shopify will automatically detect theme updates when the branch is pushed

**Important:**

- Never commit directly to the `shopify` branch -- it is force-pushed on every sync
- Never merge the `shopify` branch into any other branch
- The `shopify` branch is excluded from CI (no `package.json` or tests on that branch)
- A backup tag (`shopify-backup/YYYYMMDD-HHMMSS`) is created automatically before each sync
- To rollback: `git push --force origin shopify-backup/YYYYMMDD-HHMMSS^{}:shopify`
- Always preview the connected theme in Shopify Admin before publishing
- For initial setup or manual rebuild, run `./scripts/create-shopify-branch.sh`

For packaging prerequisites, naming conventions, versioning, and the `--ci` flag, see [`scripts/README.md`](scripts/README.md).

---

## Documentation Index

### Project-Level Documents

| Document | Language | Purpose |
|----------|----------|---------|
| `CHANGELOG.md` | EN | Version history -- every bundle shipped, reverse chronological |
| `PLANNING.md` | EN | This file -- architecture, conventions, constraints |
| `README.md` | EN | Quick start, project overview |
| `.github/DEVELOPMENT.md` | EN | Development workflow, testing, packaging |
| `.github/workflows/ci.yml` | EN | CI workflow: test + lint on push/PR |
| `.github/workflows/release.yml` | EN | Release workflow: test + lint + ZIP + GitHub Release on tag push |
| `.github/workflows/sync-shopify-branch.yml` | EN | Syncs `themes/current/` to the orphan `shopify` branch for Shopify GitHub integration |
| `.cursor/rules/packaging-workflow.mdc` | EN | Cursor rule enforcing packaging requirements |
| `.cursor/rules/sonarqube-quality-gate.mdc` | EN | Cursor rule enforcing SonarQube zero-issue gate |
| `.cursor/rules/plan-documentation.mdc` | EN | Cursor rule enforcing plan-scoped documentation |
| `.cursor/rules/plan-kickoff.mdc` | EN | Cursor rule enforcing plan kickoff review |
| `.cursor/rules/shopify-branch-protection.mdc` | EN | Cursor rule preventing direct commits/merges to the `shopify` branch |
| `.github/SECURITY.md` | EN | Security policy, audit history, vulnerability reporting |
| `security/README.md` | EN | Security audit reports and XSS remediation |
| `eslint.config.mjs` | EN | ESLint flat config with SonarJS rules for quality gates |
| `docs/reference/instagram-embed-xiosbakery.html` | EN | Known-good Instagram oEmbed snippet for `@xios.bakery` (version 14). Not consumed by the theme directly -- copy into a Liquid section or custom HTML block when updating the storefront Instagram widget. Kept under version control to diff against future Instagram embed changes. |

### Plan-Scoped Documents

Plan-specific docs live in `docs/plans/<plan-id>/`. Each plan folder has a `README.md` as its high-level completion record (GitHub auto-renders it when browsing the folder).

| Plan | Folder | Status |
|------|--------|--------|
| Security Audit 2026 | `docs/plans/security_audit_2026_b0e62e95/` | [COMPLETE] |
| CI/CD Pipeline Setup | `docs/plans/ci_cd_pipeline_setup_713a17f2/` | [COMPLETE] |
| Checkout Minimum Fix | `docs/plans/bakery_checkout_minimum_fix_730f7d42/` | [COMPLETE] |
| Shopify GitHub Sync | `docs/plans/shopify_github_sync_a1b2c3d4/` | [COMPLETE] |

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
- **CI/CD releases only**: Production ZIPs are built by GitHub Actions on tag push; local builds are for dev testing only
- **No Shopify CLI**: Changes are deployed via ZIP upload or Shopify GitHub integration
- **Two themes in sync**: `themes/current/` and `themes/development/` must always match
- **`shopify` branch is auto-generated**: Never commit directly to the `shopify` branch; it is rebuilt automatically from `themes/current/` on every push to `main`
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
