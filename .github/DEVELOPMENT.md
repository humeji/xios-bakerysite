# Development Guide - Xio's Bakery Shopify Theme

**Last Updated:** February 24, 2026

---

## Prerequisites

- Python 3.10+ (used by the packaging script)
- Node.js 18+ (for running Jest tests and ESLint)
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

# Install Node dependencies (also sets up husky pre-commit hooks)
npm install

# Verify setup
npm test
npm run lint
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

### 3. Commit Code

A pre-commit hook (husky + lint-staged) runs ESLint with SonarJS rules on all staged JS files. If lint fails, the commit is blocked. Fix the issues before committing.

To bypass in emergencies: `git commit --no-verify` (CI will still catch lint errors).

### 4. Run Tests

```bash
npm test
```

All tests must pass before packaging. If you changed cart validation logic in `custom.js`, update the corresponding functions in `tests/helpers/cart-validation-logic.js` and add/update tests.

### 5. Run Linting

```bash
npm run lint        # Show all findings
npm run lint:ci     # Strict mode: zero warnings allowed
```

ESLint uses `eslint-plugin-sonarjs` to enforce the same rules as SonarQube for IDE. This runs automatically on commit (pre-commit hook) and in CI (GitHub Actions).

### 6. Run SonarQube Analysis

Use the `analyze_file_list` MCP tool (via the `user-sonarqube` server in Cursor) to scan every file you created or modified. Zero findings are required -- resolve all MINOR, MAJOR, and BLOCKER issues before proceeding.

### 7. Update Documentation

Before packaging, update all relevant documentation:

- `PLANNING.md` -- update if architecture, settings, or validation logic changed
- `README.md` -- update if version, features, or project structure changed
- Deployment guide -- update if cart/checkout behavior changed

### 8. Release

See the **CI/CD & Release Process** section below.

---

## CI/CD & Release Process

### Quality Gates (Three Layers)

| Layer | What Runs | When |
|-------|-----------|------|
| Pre-commit hook | ESLint + SonarJS on staged files | Every `git commit` |
| CI pipeline | `npm test` + `npm run lint:ci` | Every push / PR |
| Release pipeline | Tests + lint + ZIP packaging | On version tag push |

### Build Policy

| Build Type | How | Purpose | Upload to Shopify? |
|------------|-----|---------|-------------------|
| **Production** | Push a git tag (`v13.x.x-plan-name`) | CI-validated release bundle | YES |
| **Local** | `./scripts/package-theme.sh <plan-id>` | Dev testing only | NO |

Production ZIPs are created exclusively by the CI/CD release workflow. Never upload a local build to Shopify production.

### Creating a Production Release

#### Prerequisites

Before tagging a release, make sure:

- Your feature branch has been merged to `main` via a PR
- The `test-and-lint` CI check passed on the PR
- `CHANGELOG.md` has an entry for the new version

#### Step-by-Step

```bash
# 1. Switch to main and pull the latest merged code
git checkout main
git pull

# 2. Create a version tag
git tag v13.6.0-your-plan-name

# 3. Push the tag -- this triggers the release workflow
git push --tags
```

That's it. The release workflow runs automatically and does the rest.

#### What Happens After You Push the Tag

| Step | Automated Action | On Failure |
|------|-----------------|------------|
| 1 | `npm ci` (install dependencies) | Pipeline fails |
| 2 | `npm test` (Jest unit tests) | Pipeline fails -- no ZIP created |
| 3 | `npm run lint:ci` (ESLint + SonarJS) | Pipeline fails -- no ZIP created |
| 4 | `package-theme.sh --ci <tag>` (create ZIP) | Pipeline fails -- no release |
| 5 | GitHub Release created with ZIP attached | -- |

#### After the Release

1. Monitor progress at [Actions](https://github.com/humeji/xios-bakerysite/actions)
2. Once complete, go to [Releases](https://github.com/humeji/xios-bakerysite/releases)
3. Download the ZIP from the release page
4. Upload to [Shopify Admin > Online Store > Themes](https://xiosbakery.myshopify.com/admin/themes)
5. Preview the theme and verify changes
6. Publish when ready

#### Tag Naming Convention

Tags follow the format `v<version>-<description>`, matching the `CHANGELOG.md` heading:

| Tag | CHANGELOG Heading |
|-----|-------------------|
| `v13.5.0-cicd-pipeline` | `[13.5.0-cicd-pipeline]` |
| `v13.4.9-checkout-minimum-fix` | `[13.4.9-checkout-minimum-fix]` |

### CI Workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | `.github/workflows/ci.yml` | Push to any branch, PR to main | Run tests + ESLint/SonarJS |
| Release | `.github/workflows/release.yml` | Tag push (`v*`) | Tests + lint + ZIP + GitHub Release |

### Branch Protection (Active)

A **repository ruleset** named "Protect main" is active on this repository. It enforces:

- **Pull request required**: Direct pushes to `main` are blocked; all changes must go through a PR
- **Required status check**: The `test-and-lint` CI job must pass before merging

This ensures no code reaches `main` without passing all quality gates.

To view or modify the ruleset: **Settings > Rules > Rulesets > Protect main** ([direct link](https://github.com/humeji/xios-bakerysite/rules/13059466)).

[NOTE] GitHub Free only enforces rulesets on **public** repositories. This repo was made public to enable enforcement. If the repo is ever changed back to private, the ruleset will become advisory-only (not enforced).

---

## Testing

### Structure

```
tests/
├── helpers/
│   ├── cart-validation-logic.js       # Pure logic extracted from custom.js
│   └── cart-dom-setup.js              # Mock Shopify cart builder
├── cart-validation.test.js            # Cart scenarios (empty, under/over min, digital, mixed)
├── config-parsing.test.js             # Edge cases (0, negative, NaN, decimals, Infinity)
├── locale-messages.test.js            # English/Spanish message template rendering
└── regression-2026-02-21.test.js      # 37 regression tests guarding against bugs from Feb 2026 session
```

### Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Re-run tests on file changes |
| `npm run test:ci` | CI mode with coverage report |
| `npm run lint` | Run ESLint + SonarJS rules |
| `npm run lint:ci` | Strict lint: zero warnings allowed |

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

See [`scripts/README.md`](../scripts/README.md) for versioning format, naming conventions, the `--ci` flag, and the full build policy (local vs production).

---

## Documentation Updates

When making changes tied to a plan, update the relevant documentation:

| What Changed | Update These |
|-------------|-------------|
| Any plan work | `CHANGELOG.md`, plan's `README.md` in `docs/plans/<plan-id>/` |
| Cart validation logic | `PLANNING.md` (validation matrix), plan's deployment guide, tests |
| Theme settings | `PLANNING.md` (configuration table), plan's deployment guide |
| New feature | `CHANGELOG.md`, `PLANNING.md`, plan docs, add tests, update README if needed |
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

### Updating Store Customizer Settings (settings_data.json)

The file `config/settings_data.json` stores the actual values for the store's customizer settings (logo, colors, typography, social links, color schemes, etc.). This file is included in every theme ZIP so that new uploads preserve the store's branding.

**When to update:** If the store owner changes the logo, colors, or other customizer settings through the Shopify admin, the repo copy must be refreshed:

1. Go to Shopify Admin > Online Store > Themes
2. On the **live** theme, click "..." > navigate to code editor
3. Open `config/settings_data.json` and copy the contents
4. Replace `themes/current/config/settings_data.json` and `themes/development/config/settings_data.json`
5. The packaging script validates this file exists before creating a ZIP

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
| Theme settings | `config/settings_schema.json`, `config/settings_data.json` |
| Security | `assets/security-utils.js`, `layout/theme.liquid` (CSP) |
| Styling | `assets/custom.css` |
| Localization | `locales/en.default.json`, `locales/es.json` |
| CI/CD | `.github/workflows/ci.yml`, `.github/workflows/release.yml` |
| Pre-commit | `.husky/pre-commit`, `eslint.config.mjs` |
