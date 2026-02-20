/**
 * Extracted cart validation logic from themes/current/assets/custom.js.
 *
 * These pure functions mirror the production logic exactly, enabling
 * unit testing without a full jQuery / jsdom / Shopify-API stack.
 * When custom.js changes, update these functions to match.
 */

/**
 * Parses the minimum order amount from a raw data-attribute value.
 * Mirrors: Number.parseFloat(...) guard in custom.js lines 17-18.
 *
 * @param {string|number} raw - Value from data-minimum-order attribute.
 * @returns {number} Parsed amount (> 0) or the $40 default.
 */
function parseMinimumOrder(raw) {
  const parsed = Number.parseFloat(raw);
  return (Number.isFinite(parsed) && parsed > 0) ? parsed : 40;
}

/**
 * Determines whether the minimum-order rule is enabled.
 * Mirrors: custom.js line 20.
 *
 * @param {string} raw - Value from data-enable-minimum-order attribute.
 * @returns {boolean}
 */
function parseEnableFlag(raw) {
  return raw !== 'false';
}

/**
 * Builds the localised minimum-order message by replacing placeholders.
 * Mirrors: custom.js lines 49-51.
 *
 * @param {string} template - Message template with [MIN] and [TOTAL] placeholders.
 * @param {number} minimum  - The minimum order amount.
 * @param {number} total    - The current cart total.
 * @returns {string}
 */
function buildMessage(template, minimum, total) {
  return template
    .replace('[MIN]', minimum.toFixed(2))
    .replace('[TOTAL]', total.toFixed(2));
}

/**
 * Evaluates the cart state and returns the UI decisions.
 * Mirrors: custom.js validateCartItems() function (lines 23-56).
 *
 * @param {{ total_price: number, items: Array<{ requires_shipping: boolean }> }} cart
 * @param {number}  minimumOrder   - Parsed minimum order amount.
 * @param {boolean} enableMinimum  - Whether the minimum-order rule is active.
 * @returns {{ checkoutDisabled: boolean, showMinMessage: boolean, hasDigitalProducts: boolean }}
 */
function evaluateCart(cart, minimumOrder, enableMinimum) {
  const cartTotal = cart.total_price / 100;
  const hasItems = cart.items.length > 0;
  let hasDigitalProducts = false;

  for (const item of cart.items) {
    if (item.requires_shipping === false) {
      hasDigitalProducts = true;
    }
  }

  if (!hasItems) {
    return { checkoutDisabled: true, showMinMessage: false, hasDigitalProducts: false };
  }

  const belowMinimum = enableMinimum && cartTotal < minimumOrder;

  return {
    checkoutDisabled: belowMinimum,
    showMinMessage: belowMinimum,
    hasDigitalProducts,
  };
}

module.exports = {
  parseMinimumOrder,
  parseEnableFlag,
  buildMessage,
  evaluateCart,
};
