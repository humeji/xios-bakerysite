# Shopify Store Security Deployment & Validation Guide

**Date:** August 23, 2025  
**Status:** ✅ **READY FOR DEPLOYMENT** - v13.4.3-tiktok-link-fix2 package complete  
**Current Version:** v13.4.3-tiktok-link-fix2  
**Impact:** Zero functionality loss, maximum security, conditional third‑party enablement (Pop Convert toggle)

---

## 🚀 **DEPLOYMENT & VALIDATION STEPS**

### **Step 1: Deploy the Theme (10 minutes)**

#### **1.1 Upload to Shopify**
1. Go to: **Shopify Admin → Online Store → Themes**
2. Click **"Add theme" → "Upload ZIP file"**
3. Select the latest: `xios-bakery-theme-v13.4.3-tiktok-link-fix2-<timestamp>.zip`
4. Upload and **activate the theme**

#### **1.2 What’s Included in v13.4.3**
- ✅ Conditional **CSP**: Instagram/Facebook enabled; Pop Convert allowed only when toggle is on
- ✅ **Pop Convert toggle**: Theme settings → Integrations → Enable Pop Convert
- ✅ **Neutralizer aware of toggle**: Prevents Pop Convert when disabled
- ✅ **All security fixes** retained (XSS, headers, srcset, performance)
 - ✅ **TikTok link normalization**: Social icon accepts `@handle` and ensures https link opens safely

### **Step 2: Configure Pop Convert (Optional)**
- Navigate to **Customize → Theme settings → Integrations**
- Toggle **Enable Pop Convert** ON to load `production.pc.min.js`
- Optional: Provide a custom **Pop Convert script URL** if given by vendor

### **Step 3: Validate CSP & Security (15 minutes)**
1. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)
2. Open Console → Expect minimal messages
3. Confirm Instagram embeds and Facebook tracking load
4. If Pop Convert is ON, confirm marketing widgets load without CSP blocks

### **Completion Checklist**
- [ ] Theme uploaded and activated
- [ ] Version shown in theme editor: `13.4.3-tiktok-link-fix2`
- [ ] Instagram/Facebook content loads
- [ ] Optional: Pop Convert loads when enabled
- [ ] No critical JavaScript errors

---

## 📊 **Version History (excerpt)**

### **v13.4.3-tiktok-link-fix2 (Current)**
- TikTok social link fix and packaging script improvements
- Conditional CSP and loader for Pop Convert (toggle in Theme settings)
- Instagram/Facebook remain enabled by default
- Version sync between ZIP and internal metadata

### **v13.3.x**
- Console and CSP refinements; Instagram CDN allowances

### **v13.2.x-secure**
- Security fixes, XSS remediation, initial CSP rollout

---

## 🔧 **Technical Notes**
- CSP snippet in `layout/theme.liquid` includes Pop Convert domains only when `settings.pop_convert_enabled` is true.
- Loader script injects Pop Convert from `settings.pop_convert_script_url` with sane default.
- Neutralizer intercepts script injection only when the toggle is OFF.
