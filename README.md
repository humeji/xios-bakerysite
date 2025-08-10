# Xio's Bakery - Shopify Theme Development

## Local Development Setup

This project uses the Download/Upload method for Shopify theme development.

### Directory Structure
```
xios-bakerysite/
├── themes/
│   ├── current/          # Current live theme (downloaded from Shopify)
│   └── development/      # Development version of theme
├── scripts/              # Helper scripts for deployment
└── README.md
```

### Development Workflow

1. **Download Theme**: Download current theme from Shopify admin
2. **Local Development**: Edit theme files in `themes/development/`
3. **Upload Changes**: Upload modified theme back to Shopify

### Quick Start

1. Download your theme from Shopify Admin → Themes → Actions → Download
2. Extract the zip file to `themes/current/`
3. Copy to `themes/development/` for modifications
4. Edit files locally with your preferred editor
5. Upload changes back to Shopify when ready

### Theme Upload Process

- Create new theme version in Shopify admin
- Upload modified theme files
- Preview and test changes
- Publish when ready

## Store Information

- **Store URL**: xiosbakery.myshopify.com
- **Admin**: https://xiosbakery.myshopify.com/admin
- **Development Method**: Download/Upload (no CLI required)
