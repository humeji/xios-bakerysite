# Security Policy

## Supported Versions

| Version | Supported          | Security Status |
| ------- | ------------------ | --------------- |
| 1.0.x   | :white_check_mark: | :red_circle: Critical vulnerabilities |

## Reporting a Vulnerability

We take security vulnerabilities seriously. Please follow these steps to report security issues:

### 🔒 Private Reporting (Preferred)

1. **GitHub Security Advisories** (Recommended)
   - Go to the "Security" tab of this repository
   - Click "Report a vulnerability"
   - Fill out the private vulnerability report form

2. **Email Reporting**
   - Send details to: [security@example.com]
   - Subject: "Security Vulnerability - Xios Bakery Theme"
   - Include: vulnerability details, reproduction steps, impact assessment

### 📋 What to Include

- **Vulnerability Type:** XSS, CSRF, injection, etc.
- **Location:** File path and line numbers
- **Reproduction Steps:** Clear, step-by-step instructions
- **Impact:** Potential security implications
- **Suggested Fix:** If you have recommendations

### ⏱️ Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Triage:** Within 1 week
- **Status Updates:** Weekly until resolved
- **Resolution:** Varies by severity (P0: immediate, P1: 1 week, P2: 1 month)

### 🚨 Current Security Status

**⚠️ CRITICAL WARNING:** This theme currently has known security vulnerabilities and should NOT be used in production environments.

**Known Issues:**
- 68+ XSS vulnerabilities in JavaScript files
- Insecure URL handling
- Missing Content Security Policy
- No input sanitization

**Status:** Under active remediation

### 🛡️ Security Measures

We are implementing:
- Regular security audits
- Automated vulnerability scanning
- Security-focused code reviews
- Dependency vulnerability monitoring

### 📚 Resources

- [Security Audit Reports](./security/audits/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Shopify Security Guidelines](https://shopify.dev/docs/themes/best-practices/security)

### 🏆 Recognition

We appreciate security researchers who help improve our theme's security. Contributors may be recognized in our security acknowledgments (with permission).

---

**Note:** Please do not create public GitHub issues for security vulnerabilities. Use the private reporting methods above.
