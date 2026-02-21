const fs = require('fs');
const path = require('path');

const THEME_DIR = path.join(__dirname, '..', 'themes', 'current');
const DEV_DIR = path.join(__dirname, '..', 'themes', 'development');

function readAsset(filename) {
  return fs.readFileSync(path.join(THEME_DIR, 'assets', filename), 'utf8');
}

function readConfig(filename) {
  return fs.readFileSync(path.join(THEME_DIR, 'config', filename), 'utf8');
}

function readSection(filename) {
  return fs.readFileSync(path.join(THEME_DIR, 'sections', filename), 'utf8');
}

function readLayout(filename) {
  return fs.readFileSync(path.join(THEME_DIR, 'layout', filename), 'utf8');
}

// ---------------------------------------------------------------------------
// Regression #1: theme_version must stay at production value
// Bug: Changing theme_version in settings_schema.json caused Shopify to
// invalidate the logo image reference during ZIP upload, producing
// "Liquid error (sections/header line 179): invalid url input"
// Fix: PR #19
// ---------------------------------------------------------------------------

describe('Regression: theme_version must match production', () => {
  let schema;

  beforeAll(() => {
    schema = JSON.parse(readConfig('settings_schema.json'));
  });

  test('theme_version is set to production value 13.4.8-tybo-hard-hide', () => {
    const themeInfo = schema.find((s) => s.name === 'theme_info');
    expect(themeInfo).toBeDefined();
    expect(themeInfo.theme_version).toBe('13.4.8-tybo-hard-hide');
  });

  test('theme_version is consistent between current and development', () => {
    const devSchema = JSON.parse(
      fs.readFileSync(path.join(DEV_DIR, 'config', 'settings_schema.json'), 'utf8')
    );
    const currentInfo = schema.find((s) => s.name === 'theme_info');
    const devInfo = devSchema.find((s) => s.name === 'theme_info');
    expect(currentInfo.theme_version).toBe(devInfo.theme_version);
  });
});

// ---------------------------------------------------------------------------
// Regression #2: safeSetHTML must NOT appear in Dawn core JS files
// Bug: safeSetHTML sanitization stripped scripts and event handlers needed
// by Dawn's section rendering API, breaking cart notification popup and
// cart icon counter updates.
// Fix: PRs #23, #24
// ---------------------------------------------------------------------------

describe('Regression: no safeSetHTML in Dawn core JS files', () => {
  const DAWN_CORE_FILES = [
    'cart-notification.js',
    'cart.js',
    'cart-drawer.js',
    'global.js',
  ];

  test.each(DAWN_CORE_FILES)('%s must not reference safeSetHTML', (filename) => {
    const content = readAsset(filename);
    expect(content).not.toMatch(/safeSetHTML/);
  });

  test.each(DAWN_CORE_FILES)('%s must not reference safeReplaceWithSanitizedElement', (filename) => {
    const content = readAsset(filename);
    expect(content).not.toMatch(/safeReplaceWithSanitizedElement/);
  });

  test.each(DAWN_CORE_FILES)('%s must not reference _stripDangerousAttrs', (filename) => {
    const content = readAsset(filename);
    expect(content).not.toMatch(/_stripDangerousAttrs/);
  });

  test.each(DAWN_CORE_FILES)('%s must use innerHTML for section rendering', (filename) => {
    const content = readAsset(filename);
    expect(content).toMatch(/\.innerHTML\s*=/);
  });
});

// ---------------------------------------------------------------------------
// Regression #3: Liquid | default filter does not catch false/0
// Bug: {{ settings.enable_minimum_order | default: true }} always outputs
// "true" because Liquid treats boolean false as falsy and replaces it.
// Similarly, {{ settings.minimum_order_amount | default: 40 }} does not
// catch 0 (zero is a valid number in Liquid, not nil).
// Fix: PRs #21, #22
// ---------------------------------------------------------------------------

describe('Regression: Liquid default filter pitfalls in main-cart-items', () => {
  let liquid;

  beforeAll(() => {
    liquid = readSection('main-cart-items.liquid');
  });

  test('enable_minimum_order must NOT use | default: true', () => {
    // Liquid default filter replaces false with true, breaking the toggle
    expect(liquid).not.toMatch(/enable_minimum_order\s*\|\s*default:\s*true/);
  });

  test('minimum_order_amount has explicit zero/negative fallback', () => {
    // Liquid default filter does not catch 0, so we need explicit checks
    expect(liquid).toMatch(/if min_order_val\s*<=\s*0/);
  });

  test('design mode warning checks enable_minimum_order', () => {
    // Warning must not show when feature is disabled
    expect(liquid).toMatch(/request\.design_mode\s+and\s+settings\.enable_minimum_order\s*!=\s*false/);
  });

  test('design mode warning has Spanish translation', () => {
    expect(liquid).toMatch(/ADVERTENCIA/);
  });
});

// ---------------------------------------------------------------------------
// Regression #4: Dynamic checkout buttons must be hidden when below minimum
// Bug: The main checkout button was disabled but Shop Pay / Apple Pay /
// Google Pay buttons remained visible and clickable.
// Fix: PR #20
// ---------------------------------------------------------------------------

describe('Regression: dynamic checkout buttons in custom.js', () => {
  let customJs;

  beforeAll(() => {
    customJs = readAsset('custom.js');
  });

  test('hides .cart__dynamic-checkout-buttons when below minimum', () => {
    expect(customJs).toMatch(/cart__dynamic-checkout-buttons.*hide/s);
  });

  test('shows .cart__dynamic-checkout-buttons when at or above minimum', () => {
    expect(customJs).toMatch(/cart__dynamic-checkout-buttons.*show/s);
  });

  test('hides .cart__dynamic-checkout-buttons when cart is empty', () => {
    // The empty cart branch must also hide dynamic checkout
    const emptyBranch = customJs.match(/!hasItems[\s\S]*?return;/);
    expect(emptyBranch).not.toBeNull();
    expect(emptyBranch[0]).toMatch(/cart__dynamic-checkout-buttons/);
  });
});

// ---------------------------------------------------------------------------
// Regression #5: settings_data.json must be valid JSON (no JSONC comments)
// Bug: JSONC comment headers in settings_data.json caused Shopify to fail
// parsing during ZIP upload, breaking the entire theme.
// Fix: PR #14
// ---------------------------------------------------------------------------

describe('Regression: settings_data.json must be valid JSON', () => {
  test('settings_data.json parses without error', () => {
    const raw = readConfig('settings_data.json');
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  test('settings_data.json has no // comments', () => {
    const raw = readConfig('settings_data.json');
    const lines = raw.split('\n');
    const commentLines = lines.filter((line) => line.trim().startsWith('//'));
    expect(commentLines).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Regression #6: security-utils.js isolation
// Bug: security-utils.js defines window.safeSetHTML globally, but if Dawn
// core files call it, the sanitization breaks section rendering.
// Fix: security-utils.js must exist as standalone; Dawn core must not use it.
// ---------------------------------------------------------------------------

describe('Regression: security-utils.js isolation', () => {
  test('security-utils.js exists and exports safeSetHTML', () => {
    const content = readAsset('security-utils.js');
    expect(content).toMatch(/window\.safeSetHTML\s*=/);
  });

  test('theme.liquid loads security-utils.js', () => {
    const layout = readLayout('theme.liquid');
    expect(layout).toMatch(/security-utils\.js/);
  });

  test('Dawn core files do not depend on window.safeSetHTML', () => {
    const coreFiles = ['cart-notification.js', 'cart.js', 'cart-drawer.js', 'global.js'];
    for (const filename of coreFiles) {
      const content = readAsset(filename);
      expect(content).not.toMatch(/window\.safeSetHTML/);
    }
  });
});

// ---------------------------------------------------------------------------
// Regression #7: themes/current and themes/development must be in sync
// Bug: Inconsistencies between current and development caused confusion
// during debugging.
// ---------------------------------------------------------------------------

describe('Regression: current and development themes in sync', () => {
  const CRITICAL_FILES = [
    'config/settings_schema.json',
    'config/settings_data.json',
    'layout/theme.liquid',
    'assets/custom.js',
    'assets/custom.css',
    'assets/cart-notification.js',
    'assets/global.js',
  ];

  test.each(CRITICAL_FILES)('%s is identical in current and development', (relPath) => {
    const currentContent = fs.readFileSync(path.join(THEME_DIR, relPath), 'utf8');
    const devContent = fs.readFileSync(path.join(DEV_DIR, relPath), 'utf8');
    expect(currentContent).toBe(devContent);
  });
});
