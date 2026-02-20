import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";

const CUSTOM_THEME_FILES = [
  "themes/*/assets/custom.js",
  "themes/*/assets/security-utils.js",
  "themes/*/assets/security-test.js",
  "themes/*/assets/third-party-security.js",
];

export default [
  // Full sonarjs enforcement on our custom theme files
  {
    files: CUSTOM_THEME_FILES,
    plugins: { sonarjs },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        $: "readonly",
        jQuery: "readonly",
        Shopify: "readonly",
      },
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
    },
  },

  // Shopify Dawn stock files: sonarjs with relaxed rules for patterns
  // inherent to Dawn's codebase that would require non-trivial refactoring
  {
    files: ["themes/*/assets/*.js"],
    ignores: CUSTOM_THEME_FILES,
    plugins: { sonarjs },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        $: "readonly",
        jQuery: "readonly",
        Shopify: "readonly",
      },
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-ignored-exceptions": "off",
      "sonarjs/constructor-for-side-effects": "off",
      "sonarjs/no-nested-assignment": "off",
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/block-scoped-var": "off",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/no-dead-store": "off",
    },
  },

  // Test files
  {
    files: ["tests/**/*.js"],
    plugins: { sonarjs },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
    },
  },
];
