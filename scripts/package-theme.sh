#!/bin/bash

# Package Theme for Upload
# This script creates a zip file from your development theme ready for Shopify upload

echo "🎯 Packaging Xio's Bakery theme for upload..."

# Create timestamp for unique filename
timestamp=$(date +"%d%b%Y-%I%M%P")

# Create zip file from development theme
cd themes/development
zip -r "../../xios-bakery-theme-${timestamp}.zip" . -x "*.DS_Store" "*.git*" "*node_modules*"
cd ../..

echo "✅ Theme packaged successfully!"
echo "📦 File: xios-bakery-theme-${timestamp}.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Shopify Admin → Online Store → Themes"
echo "2. Click 'Add theme' → 'Upload theme'"
echo "3. Select the zip file: xios-bakery-theme-${timestamp}.zip"
echo "4. Preview your changes"
echo "5. Publish when ready"
echo ""
echo "🔗 Admin URL: https://xiosbakery.myshopify.com/admin/themes"
