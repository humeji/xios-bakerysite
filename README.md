# Xio's Bakery - Shopify Theme

[SECURE] [PRODUCTION-READY] - All security vulnerabilities resolved

## Current Status

**Version:** v13.4.9-checkout-minimum-fix  
**Security:** All 68+ XSS vulnerabilities resolved  
**CSP:** Conditional CSP with Instagram/Facebook always enabled; Pop Convert allowed only when toggled on  
**Testing:** 49 unit tests passing  
**Deployment:** Ready for production

## Prerequisites

- Python 3.10+ (used by the packaging script)
- Node.js 18+ (for running Jest tests)
- Git

## Quick Start

```bash
git clone https://github.com/humeji/xios-bakerysite.git
cd xios-bakerysite
```

### 1. Set Up Python Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate          # Windows
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Verify Everything Works

```bash
npm test
```

All 49 tests should pass. You're ready to develop.

### Reactivating the Environment

Each time you open a new terminal session:

```bash
cd xios-bakerysite
source venv/bin/activate
```

## Deployment

See [`scripts/README.md`](scripts/README.md) for full packaging prerequisites, checklist, and usage.

Quick reference:

```bash
npm test
./scripts/package-theme.sh <plan-id>
```

## Project Structure

```
xios-bakerysite/
├── themes/
│   ├── current/          # Production theme (packaged into ZIP)
│   └── development/      # Development copy (must stay in sync)
├── tests/                # Jest unit tests (49 tests)
├── scripts/              # Packaging script
├── docs/                 # Project documentation
└── security/             # Security audits and guides
```

## Development

See [.github/DEVELOPMENT.md](.github/DEVELOPMENT.md) for the full development workflow, testing instructions, and documentation update rules.

See [PLANNING.md](PLANNING.md) for architecture, conventions, and constraints.

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode during development
npm run test:ci       # CI mode with coverage
```

Tests cover:
- Cart validation scenarios (empty, under/over minimum, digital, physical, mixed)
- Configuration parsing edge cases (zero, negative, decimal, NaN, Infinity)
- Localized message rendering (English, Spanish, custom templates, fallback)

## Key Features

### Cart & Checkout Rules (Configurable via Theme Settings)
- Minimum order amount enforcement ($40 default, configurable)
- Digital product detection via Shopify's `requires_shipping` property
- Non-refundable notice for digital products
- Bilingual support (English/Spanish) for all customer-facing messages
- Admin warning in theme editor when minimum is set below $20

### Security
- 68+ XSS vulnerabilities resolved with safe DOM utilities
- Content Security Policy (CSP) with conditional third-party support
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

### Integrations
- Pop Convert (toggleable via Theme Settings > Integrations)
- Shop Pay enabled
- Privacy Policy, Cookie Banner, and CCPA compliance (automatic)

## Store Information

- **Store URL:** xiosbakery.com
- **Admin:** https://xiosbakery.myshopify.com/admin
- **Development Method:** Download/Upload (no Shopify CLI required)

## Documentation

### Project

| Document | Description |
|----------|-------------|
| [TASK.md](TASK.md) | Work ledger -- completed work by date and plan |
| [PLANNING.md](PLANNING.md) | Architecture, conventions, constraints |
| [.github/DEVELOPMENT.md](.github/DEVELOPMENT.md) | Development workflow and testing |
| [docs/SHOPIFY_DEPLOYMENT_GUIDE.md](docs/SHOPIFY_DEPLOYMENT_GUIDE.md) | General deployment guide |
| [security/README.md](security/README.md) | Security audit documentation |

### Plan: Checkout Minimum Fix

| Document | Description |
|----------|-------------|
| [README.md](docs/plans/bakery_checkout_minimum_fix_730f7d42/README.md) | Plan completion record |
| [Deployment Guide](docs/plans/bakery_checkout_minimum_fix_730f7d42/GUIA_DESPLIEGUE_MINIMO_PEDIDO_ES.md) | Deployment and testing (Spanish) |
| [Statement of Work](docs/plans/bakery_checkout_minimum_fix_730f7d42/SOW_MINIMO_PEDIDO_ES.md) | SOW and cost estimate (Spanish) |
