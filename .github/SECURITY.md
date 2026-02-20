# Security Policy

## Current Security Status

[SECURE] All critical security vulnerabilities have been resolved. Theme is production-ready.

### Security Audit History

| Date | Version | Auditor | Status | Report |
|------|---------|---------|--------|--------|
| 2025-08-23 | v13.4.3-tiktok-link-fix2 | AI Security Assistant | [COMPLETE] All issues resolved | [View Report](../security/audits/2025/SECURITY_AUDIT_REPORT.md) |

### Completed Security Fixes

- [x] **68+ XSS vulnerabilities resolved** -- All `innerHTML` replaced with `safeSetHTML()`
- [x] **Content Security Policy implemented** -- Conditional CSP: IG/FB always on; Pop Convert allowed when enabled
- [x] **Security headers added** -- X-Frame-Options, X-Content-Type-Options, etc.
- [x] **Input sanitization implemented** -- `security-utils.js` provides safe DOM manipulation
- [x] **Security testing completed** -- `window.testXSSPrevention()` passes all tests

## Supported Versions

| Version | Supported | Security Status |
|---------|-----------|-----------------|
| v13.4.9-checkout-minimum-fix | Yes | [SECURE] |
| v13.4.3-tiktok-link-fix2 | Yes | [SECURE] |
| v13.3.x | Yes | [SECURE] |
| v13.2.x-secure | Yes | [SECURE] |

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

**Last Updated:** February 2026 (v13.4.9)
