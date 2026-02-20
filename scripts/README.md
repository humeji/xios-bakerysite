# Scripts

## package-theme.sh

Creates a Shopify-ready ZIP bundle from `themes/current/`.

### Usage

```bash
./scripts/package-theme.sh <plan-id>
```

- `<plan-id>` is the Cursor plan filename without the `.plan.md` extension
- Example: `./scripts/package-theme.sh bakery_checkout_minimum_fix_730f7d42`

### Output

```
xios-bakery-theme-<plan-id>-<YYYYMMDD>.zip
```

The ZIP is created at the repository root. The date stamp is generated automatically.

### What the Script Does

| Step | Action | On Failure |
|------|--------|------------|
| 1/4 | Runs `npm test` | Aborts -- fix failing tests first |
| 2/4 | Prompts for SonarQube confirmation | Aborts -- resolve all findings first |
| 3/4 | Verifies `themes/current/` and `settings_schema.json` exist | Aborts -- theme source missing |
| 4/4 | Creates the ZIP bundle | -- |

### Prerequisites (All Required)

Before running the script, ensure every item is satisfied:

- [ ] All unit tests pass (`npm test`)
- [ ] SonarQube reports zero findings on every file touched in this plan (use the `analyze_file_list` MCP tool)
- [ ] `TASK.md` (root) updated with a ledger entry for the work being bundled
- [ ] `PLANNING.md` updated if architecture, settings, or validation logic changed
- [ ] Plan docs (`docs/plans/<plan-id>/README.md`) created or updated
- [ ] Root `README.md` updated if version, features, or project structure changed
- [ ] `.github/DEVELOPMENT.md` updated if workflow or testing process changed

### Versioning

- Theme version is stored in `themes/current/config/settings_schema.json` under `theme_version`
- Format: `MAJOR.MINOR.PATCH-description` (e.g., `13.4.9-checkout-minimum-fix`)
- Update the version in `settings_schema.json` before running the script
- The `<plan-id>` in the ZIP filename links the bundle to the Cursor plan that produced it

### After Packaging

1. Upload the ZIP to **Shopify Admin > Online Store > Themes > Add theme > Upload ZIP**
2. Preview the theme and run interactive tests (see the plan's deployment guide)
3. Publish when verified
