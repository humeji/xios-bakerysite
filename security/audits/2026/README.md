# Security Audits -- 2026

## Audit History

| Date | Version Range | Findings | Status | Report |
|------|--------------|----------|--------|--------|
| February 2026 | v13.4.3-tiktok-link-fix2 to v13.6.7-explicit-cart-settings | 8 findings identified; key remediations reverted | [INCOMPLETE] | [English](SECURITY_AUDIT_REPORT.md) / [Spanish](REPORTE_AUDITORIA_SEGURIDAD.md) |

## Summary

The February 2026 audit covered all changes since the August 2025 audit across 18 tagged releases and 29 merged PRs. Eight findings were identified across code security (raw innerHTML, weak fallbacks), CSP configuration, dependency management, and CI/CD gaps.

**Critical update (Feb 21, 2026):** The `safeSetHTML` approach used in Dawn core JS files (cart-notification.js, cart.js, cart-drawer.js, global.js) caused critical regressions -- broken cart notifications, cart icon counter, and header rendering. These remediations were **reverted** to restore production functionality (PRs #23, #24). CSP changes in theme.liquid were also **reverted** (PR #15). A fresh audit with an alternative hardening strategy is required. See [plan status](../../docs/plans/security_audit_2026_b0e62e95/README.md) for full details.

### Remediation Breakdown

| Category | Count | Status |
|----------|-------|--------|
| Code-level XSS fixes (non-core files) | 3 | [REMEDIATED] -- Active in facets.js, predictive-search.js, etc. |
| Fallback hardening (_stripDangerousAttrs) | 1 | [REMEDIATED] -- Active in 9 non-core files |
| CSP cleanup | 1 | [REVERTED] -- Broke font loading and header rendering |
| Dawn core JS innerHTML | 1 | [REVERTED] -- safeSetHTML broke Dawn section rendering API |
| CI/CD hardening | 1 | [REMEDIATED] -- npm audit + Dependabot active |
| Platform limitations (documented) | 1 | [DOCUMENTED] -- unsafe-inline/unsafe-eval required by Shopify |
| Dependency issues (dev-only) | 1 | [DOCUMENTED] -- minimatch ReDoS in eslint/jest transitive deps |

### Overall Risk: MODERATE

Non-core file remediations and CI/CD hardening remain active. However, Dawn core JS files still use raw `innerHTML` and CSP changes were reverted. A fresh audit with an alternative strategy for Dawn core files is required before the next production deployment of security changes.
