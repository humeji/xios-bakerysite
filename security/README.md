# Security Documentation

This directory contains all security-related documentation for the Xio's Bakery Shopify Theme.

## Directory Structure

```
security/
├── README.md                    # This file
├── XSS_FIX_GUIDE.md            # XSS remediation guide
├── audits/
│   ├── 2025/
│   │   ├── README.md                        # 2025 audit index
│   │   ├── SECURITY_AUDIT_REPORT.md         # English audit report
│   │   └── REPORTE_AUDITORIA_SEGURIDAD.md   # Spanish audit report
│   └── 2026/
│       ├── README.md                        # 2026 audit index
│       ├── SECURITY_AUDIT_REPORT.md         # English audit report
│       └── REPORTE_AUDITORIA_SEGURIDAD.md   # Spanish audit report
```

## Current Security Status

[SECURE] All security vulnerabilities resolved. Theme is production-ready.

### Completed Security Fixes

- [x] **68+ XSS vulnerabilities resolved** -- All `innerHTML` replaced with `safeSetHTML()`
- [x] **10 residual raw innerHTML fixed** -- Dawn stock files remediated (Feb 2026 audit)
- [x] **Fallback sanitization hardened** -- All fallback paths strip `on*` event attributes
- [x] **Content Security Policy cleaned** -- Duplicates removed, incorrect directives fixed
- [x] **Security headers active** -- X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [x] **Dependency scanning enabled** -- npm audit in CI, Dependabot configured
- [x] **Reproducible builds** -- package-lock.json committed

## Latest Audit Report

**Date:** February 20, 2026
**Status:** [COMPLETE] -- 8 findings, all remediated
**Version:** v13.6.0-security-audit-2026
**Reports:**
- [English Version](./audits/2026/SECURITY_AUDIT_REPORT.md)
- [Spanish Version](./audits/2026/REPORTE_AUDITORIA_SEGURIDAD.md)

### Previous Audits

- [August 2025 Audit](./audits/2025/) -- 68+ XSS vulnerabilities, all resolved

## Security Tools

| Tool | Purpose | Integration |
|------|---------|-------------|
| `security-utils.js` | XSS-safe DOM manipulation (`safeSetHTML`) | Loaded in theme.liquid |
| `security-test.js` | XSS prevention test harness | Loaded in theme.liquid |
| `third-party-security.js` | Third-party script monitoring | Loaded in theme.liquid |
| ESLint + SonarJS | Static analysis for code quality | Pre-commit hook + CI |
| SonarQube for IDE | IDE-level static analysis | Cursor MCP tool |
| npm audit | Dependency vulnerability scanning | CI workflows |
| Dependabot | Automated dependency updates | GitHub weekly PRs |

## Access Control

[NOTE] Security audit reports may contain sensitive information about vulnerabilities. Follow responsible disclosure practices.

---

**Maintained by:** Security Team
**Last Updated:** February 2026
