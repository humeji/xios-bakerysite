# Development Guide - Xio's Bakery Shopify Theme

**Last Updated:** February 20, 2026

---

## Prerequisites

- Python 3.10+ (used by the packaging script)
- Node.js 18+ (for running Jest tests)
- A text editor (VS Code recommended)
- Access to Shopify Admin: https://xiosbakery.myshopify.com/admin

## Setup

```bash
git clone https://github.com/humeji/xios-bakerysite.git
cd xios-bakerysite

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate          # Windows

# Install Node dependencies
npm install

# Verify setup
npm test
```

### Reactivating the Environment

Each time you open a new terminal:

```bash
cd xios-bakerysite
source venv/bin/activate
```

---

## Development Workflow

### 1. Read PLANNING.md First

Before starting any task, read `PLANNING.md` to understand the architecture, conventions, and constraints.

### 2. Edit Theme Files

- Work in both `themes/current/` and `themes/development/`
- Keep both directories in sync -- all changes must be applied to both
- Follow the patterns described in `PLANNING.md`

### 3. Run Tests

```bash
npm test
```

All tests must pass before packaging. If you changed cart validation logic in `custom.js`, update the corresponding functions in `tests/helpers/cart-validation-logic.js` and add/update tests.

### 4. Run SonarQube Analysis

Use the `analyze_file_list` MCP tool (via the `user-sonarqube` server in Cursor) to scan every file you created or modified. Zero findings are required -- resolve all MINOR, MAJOR, and BLOCKER issues before proceeding.

### 5. Update Documentation

Before packaging, update all relevant documentation:

- `TASK.md` (root) -- add a ledger entry for the work being bundled
- `PLANNING.md` -- update if architecture, settings, or validation logic changed
- `README.md` -- update if version, features, or project structure changed
- Deployment guide -- update if cart/checkout behavior changed

### 6. Package and Deploy

See [`scripts/README.md`](../scripts/README.md) for the full packaging prerequisites, checklist, naming convention, and deployment steps.

---

## Testing

### Structure

```
tests/
├── helpers/
│   ├── cart-validation-logic.js   # Pure logic extracted from custom.js
│   └── cart-dom-setup.js          # Mock Shopify cart builder
├── cart-validation.test.js        # Cart scenarios (empty, under/over min, digital, mixed)
├── config-parsing.test.js         # Edge cases (0, negative, NaN, decimals, Infinity)
└── locale-messages.test.js        # English/Spanish message template rendering
```

### Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Re-run tests on file changes |
| `npm run test:ci` | CI mode with coverage report |

### Adding Tests for New Features

1. If the feature involves pure logic (parsing, validation, formatting), add the function to `tests/helpers/cart-validation-logic.js`
2. Create a new `.test.js` file in `tests/` or add to an existing one
3. Include at minimum:
   - 1 test for expected behavior
   - 1 edge case
   - 1 failure case
4. Run `npm test` to verify

### Keeping Tests in Sync with Production Code

The test helpers in `tests/helpers/cart-validation-logic.js` mirror the logic from `themes/current/assets/custom.js`. When `custom.js` changes:

1. Update the matching function in `cart-validation-logic.js`
2. Add tests for the new/changed behavior
3. Run the full suite to check for regressions

---

## Versioning & Packaging

See [`scripts/README.md`](../scripts/README.md) for versioning format, naming conventions, prerequisites checklist, and step-by-step usage.

---

## Documentation Updates

When making changes tied to a plan, update the relevant documentation:

| What Changed | Update These |
|-------------|-------------|
| Any plan work | `TASK.md` (root), plan's `README.md` in `docs/plans/<plan-id>/` |
| Cart validation logic | `PLANNING.md` (validation matrix), plan's deployment guide, tests |
| Theme settings | `PLANNING.md` (configuration table), plan's deployment guide |
| New feature | `TASK.md`, `PLANNING.md`, plan docs, add tests, update README if needed |
| Security changes | `.github/SECURITY.md`, `security/README.md` |
| Deployment process | `.github/DEVELOPMENT.md`, `scripts/README.md` |

### Plan-Scoped Documentation

Every Cursor plan that modifies theme code must have a folder under `docs/plans/<plan-id>/` containing at minimum a `README.md`. See `.cursor/rules/plan-documentation.mdc` for the full rule.

---

## Common Tasks

### Adding a New Theme Setting

1. Add the setting to `themes/current/config/settings_schema.json`
2. Mirror it in `themes/development/config/settings_schema.json`
3. If it has a customer-facing message, add both English and Spanish fields
4. Use `request.locale.iso_code` in Liquid to select the right message
5. Pass values to JS via `data-*` attributes on hidden elements
6. Add tests for any new JS logic
7. Update `PLANNING.md` configuration table

### Adding a New Product Type Exemption

The current system uses `requires_shipping === false` to detect digital products. If a new exemption pattern is needed:

1. Update validation logic in `custom.js`
2. Mirror in `tests/helpers/cart-validation-logic.js`
3. Add test cases for the new product type
4. Update the validation matrix in `PLANNING.md`

---

## File Ownership

| Area | Primary Files |
|------|--------------|
| Cart validation | `assets/custom.js`, `sections/main-cart-items.liquid`, `snippets/cart-drawer.liquid` |
| Theme settings | `config/settings_schema.json` |
| Security | `assets/security-utils.js`, `layout/theme.liquid` (CSP) |
| Styling | `assets/custom.css` |
| Localization | `locales/en.default.json`, `locales/es.json` |
