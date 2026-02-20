/**
 * Shared test utilities for cart validation tests.
 *
 * Pure functions only -- no DOM or jQuery dependencies so these
 * can run in a plain Node environment.
 */

/**
 * Builds a mock Shopify cart object.
 *
 * @param {object[]} items - Array of cart item stubs.
 * @param {number}   [totalOverride] - Explicit total in dollars; auto-summed otherwise.
 * @returns {{ total_price: number, items: object[] }}
 */
function buildCart(items, totalOverride) {
  const cartItems = items || [];
  const totalCents =
    totalOverride === undefined
      ? cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
      : totalOverride * 100;

  return {
    total_price: totalCents,
    items: cartItems.map((i) => ({
      title: i.title || 'Test Product',
      price: i.price || 0,
      quantity: i.quantity || 1,
      requires_shipping: i.requires_shipping === undefined ? true : i.requires_shipping,
      product_type: i.product_type || 'General',
    })),
  };
}

module.exports = {
  buildCart,
};
