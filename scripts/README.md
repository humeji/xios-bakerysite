# Scripts

## package-theme.sh

Creates a Shopify-ready ZIP bundle from `themes/current/`.

---

### Build Policy: Local vs Production

| Build Type | How | Purpose | Upload to Shopify? |
|------------|-----|---------|-------------------|
| **Production** | Push a git tag (`v13.x.x-plan-name`) | CI-validated release bundle | YES -- the only valid path |
| **Local** | `./scripts/package-theme.sh <plan-id>` | Dev testing, quick validation | NO -- development only |

Production ZIPs are created exclusively by the CI/CD release workflow (`.github/workflows/release.yml`). This guarantees every production bundle has passed all automated tests and ESLint/SonarJS lint gates. Download production ZIPs from the [GitHub Releases page](https://github.com/humeji/xios-bakerysite/releases).

Local builds print a warning banner reminding developers they are not production-grade.

---

### Production Releases (CI/CD)

Production bundles are created automatically when you push a version tag:

```bash
git tag v13.5.0-plan-name
git push --tags
```

The release workflow runs:

| Step | Action | On Failure |
|------|--------|------------|
| 1 | `npm test` (Jest) | Pipeline fails -- no ZIP created |
| 2 | `npm run lint:ci` (ESLint + SonarJS) | Pipeline fails -- no ZIP created |
| 3 | `package-theme.sh --ci <tag>` | Pipeline fails -- no release |
| 4 | Creates GitHub Release with ZIP | -- |

The tag name maps to the CHANGELOG.md version heading (e.g., tag `v13.4.9-checkout-minimum-fix` matches `[13.4.9-checkout-minimum-fix]`).

---

### Local Development Builds

For quick testing during development, you can still build a ZIP locally:

```bash
./scripts/package-theme.sh <plan-id>
```

- `<plan-id>` is the Cursor plan filename without the `.plan.md` extension
- Example: `./scripts/package-theme.sh bakery_checkout_minimum_fix_730f7d42`

[WARNING] Local builds are for development and testing only. Never upload a local build to Shopify production. Use the CI/CD release process for production bundles.

#### Output

```
xios-bakery-theme-<plan-id>-<YYYYMMDD>.zip
```

The ZIP is created at the repository root. The date stamp is generated automatically.

#### What the Script Does (Local Mode)

| Step | Action | On Failure |
|------|--------|------------|
| 1/4 | Runs `npm test` | Aborts -- fix failing tests first |
| 2/4 | Prompts for SonarQube confirmation | Aborts -- resolve all findings first |
| 3/4 | Verifies `themes/current/` and `settings_schema.json` exist | Aborts -- theme source missing |
| 4/4 | Creates the ZIP bundle | -- |

#### The `--ci` Flag

When called with `--ci`, the script runs in non-interactive mode:

```bash
./scripts/package-theme.sh --ci <tag-name>
```

- Skips `npm test` (already ran in CI pipeline)
- Skips the interactive SonarQube confirmation (ESLint/SonarJS already ran in CI)
- Intended for GitHub Actions only -- do not use locally

---

### Prerequisites (All Required -- Local Builds)

Before running the script locally, ensure every item is satisfied:

- [ ] All unit tests pass (`npm test`)
- [ ] ESLint passes with zero warnings (`npm run lint:ci`)
- [ ] SonarQube for IDE reports zero findings on every file touched (use the `analyze_file_list` MCP tool)
- [ ] `PLANNING.md` updated if architecture, settings, or validation logic changed
- [ ] Plan docs (`docs/plans/<plan-id>/README.md`) created or updated
- [ ] `CHANGELOG.md` updated with a new entry for this version/bundle
- [ ] Root `README.md` updated if version, features, or project structure changed
- [ ] `.github/DEVELOPMENT.md` updated if workflow or testing process changed

### Versioning

- Theme version is stored in `themes/current/config/settings_schema.json` under `theme_version`
- Format: `MAJOR.MINOR.PATCH-description` (e.g., `13.4.9-checkout-minimum-fix`)
- Update the version in `settings_schema.json` before running the script
- The `<plan-id>` in the ZIP filename links the bundle to the Cursor plan that produced it
- Git tags use the format `v<version>` (e.g., `v13.4.9-checkout-minimum-fix`)
