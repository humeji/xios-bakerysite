# Security Policy

## Current Security Status

[INCOMPLETE] Security audit from February 2026 is partially complete. Key remediations for Dawn core JS files and CSP were reverted due to regressions. A fresh audit is required before the next production deployment of security changes. See [plan status](../docs/plans/security_audit_2026_b0e62e95/README.md) for full details.

### Security Audit History

| Date | Version Range | Auditor | Status | Report |
|------|--------------|---------|--------|--------|
| 2026-02-20 | v13.4.3-tiktok-link-fix2 to v13.6.7-explicit-cart-settings | AI Security Assistant | [INCOMPLETE] 8 findings identified; Dawn core JS and CSP remediations reverted | [View Report](../security/audits/2026/SECURITY_AUDIT_REPORT.md) |
| 2025-08-23 | v13.4.3-tiktok-link-fix2 | AI Security Assistant | [COMPLETE] All issues resolved | [View Report](../security/audits/2025/SECURITY_AUDIT_REPORT.md) |

### Security Fixes -- Current State

- [x] **68+ XSS vulnerabilities resolved (Aug 2025)** -- `innerHTML` replaced with `safeSetHTML()` in custom files
- [x] **Fallback sanitization hardened** -- `_stripDangerousAttrs()` active in non-core files (facets.js, predictive-search.js, etc.)
- [x] **Security headers added** -- X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [x] **Input sanitization implemented** -- `security-utils.js` provides safe DOM manipulation
- [x] **Security testing completed** -- `window.testXSSPrevention()` passes all tests
- [x] **Dependency scanning added** -- npm audit in CI, Dependabot enabled (Feb 2026)
- [x] **package-lock.json committed** -- Reproducible builds ensured (Feb 2026)
- [x] **textContent replacements in global.js** -- Safe, non-breaking changes remain active
- [ ] **Dawn core JS innerHTML** -- `safeSetHTML` in cart-notification.js, cart.js, cart-drawer.js, global.js was REVERTED (broke section rendering API)
- [ ] **CSP cleanup** -- Changes in theme.liquid were REVERTED (broke font loading and header rendering)
- [ ] **Dawn base version assessment** -- Theme runs Dawn 13.4.8; Shopify only patches the latest Dawn release
- [ ] **Fresh audit required** -- Current audit reports reflect v13.6.0 state, not v13.6.7

## Supported Versions

| Version | Supported | Security Status |
|---------|-----------|-----------------|
| v13.6.7-explicit-cart-settings | Yes | [PARTIAL] -- Latest release; security audit incomplete |
| v13.6.0-cart-minimum-order | Yes | [PARTIAL] -- Security remediations partially reverted |
| v13.5.0-cicd-pipeline | Yes | [SECURE] |
| v13.4.9-checkout-minimum-fix | Deprecated | [SECURE] -- Superseded by v13.6.x |
| v13.4.3-tiktok-link-fix2 | Deprecated | [SECURE] -- Superseded by v13.6.x |
| v13.3.x and older | No | End of support |

---

## Reporting a Vulnerability

We take security vulnerabilities seriously. Please follow these steps to report security issues:

### Private Reporting (Preferred)

1. **GitHub Security Advisories** (Recommended)
   - Go to the "Security" tab of this repository
   - Click "Report a vulnerability"
   - Fill out the private vulnerability report form

2. **Email Reporting**
   - Send details to: [security@example.com]
   - Subject: "Security Vulnerability - Xios Bakery Theme"
   - Include: vulnerability details, reproduction steps, impact assessment

### What to Include

- **Vulnerability Type:** XSS, CSRF, injection, etc.
- **Location:** File path and line numbers
- **Reproduction Steps:** Clear, step-by-step instructions
- **Impact:** Potential security implications
- **Suggested Fix:** If you have recommendations

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Triage:** Within 1 week
- **Status Updates:** Weekly until resolved
- **Resolution:** Varies by severity (P0: immediate, P1: 1 week, P2: 1 month)

---

## Security Best Practices

- Re-test `window.testXSSPrevention()` after major edits to JavaScript files
- Keep third-party toggles (e.g., Pop Convert) OFF unless needed
- Never expose sourcemaps in production deployments
- All DOM manipulation must use `security-utils.js` safe functions
- Run SonarQube analysis on all changed files before packaging

### Resources

- [Security Audit Reports](../security/audits/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Shopify Security Guidelines](https://shopify.dev/docs/themes/best-practices/security)

### Recognition

We appreciate security researchers who help improve our theme's security. Contributors may be recognized in our security acknowledgments (with permission).

---

**Note:** Please do not create public GitHub issues for security vulnerabilities. Use the private reporting methods above.

**Last Updated:** February 24, 2026 (v13.6.7-explicit-cart-settings)
