const {
  parseMinimumOrder,
  parseEnableFlag,
  buildMessage,
  evaluateCart,
} = require('./helpers/cart-validation-logic');
const { buildCart } = require('./helpers/cart-dom-setup');

// ---------------------------------------------------------------------------
// Cart Validation - Minimum Order Enforcement
// ---------------------------------------------------------------------------

describe('Cart Validation - Minimum Order Enforcement', () => {
  const MIN = 40;
  const ENABLED = true;

  test('empty cart disables checkout', () => {
    const cart = buildCart([]);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(true);
    expect(result.showMinMessage).toBe(false);
    expect(result.hasDigitalProducts).toBe(false);
  });

  test('cart below minimum blocks checkout and shows message', () => {
    const cart = buildCart([
      { title: 'Chocolate Cookies', price: 2500, requires_shipping: true },
    ], 25);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(true);
    expect(result.showMinMessage).toBe(true);
  });

  test('cart at exact minimum enables checkout', () => {
    const cart = buildCart([
      { title: 'Cookie Box', price: 4000, requires_shipping: true },
    ], 40);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(false);
    expect(result.showMinMessage).toBe(false);
  });

  test('cart above minimum enables checkout', () => {
    const cart = buildCart([
      { title: 'Large Cookie Box', price: 6000, requires_shipping: true },
    ], 60);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(false);
    expect(result.showMinMessage).toBe(false);
  });

  test('cart at $39.99 still blocks (one cent under)', () => {
    const cart = buildCart([
      { title: 'Cookie Box', price: 3999, requires_shipping: true },
    ], 39.99);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(true);
    expect(result.showMinMessage).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Cart Validation - Digital Products
// ---------------------------------------------------------------------------

describe('Cart Validation - Digital Products', () => {
  const MIN = 40;
  const ENABLED = true;

  test('digital product is detected via requires_shipping=false', () => {
    const cart = buildCart([
      { title: 'Pan De Jamon Recipe', price: 6000, requires_shipping: false },
    ], 60);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.hasDigitalProducts).toBe(true);
  });

  test('physical-only cart has no digital products', () => {
    const cart = buildCart([
      { title: 'Cookie Box', price: 5000, requires_shipping: true },
    ], 50);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.hasDigitalProducts).toBe(false);
  });

  test('digital product below minimum: blocked + digital detected', () => {
    const cart = buildCart([
      { title: 'Cheap Digital', price: 1500, requires_shipping: false },
    ], 15);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(true);
    expect(result.showMinMessage).toBe(true);
    expect(result.hasDigitalProducts).toBe(true);
  });

  test('digital product at/above minimum: enabled + digital detected', () => {
    const cart = buildCart([
      { title: 'Pan De Jamon Recipe', price: 6000, requires_shipping: false },
    ], 60);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(false);
    expect(result.hasDigitalProducts).toBe(true);
  });

  test('mixed cart above minimum: enabled + digital detected', () => {
    const cart = buildCart([
      { title: 'Cookie Box', price: 2500, requires_shipping: true },
      { title: 'Recipe Book', price: 6000, requires_shipping: false },
    ], 85);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(false);
    expect(result.hasDigitalProducts).toBe(true);
  });

  test('mixed cart below minimum: blocked + digital detected', () => {
    const cart = buildCart([
      { title: 'Small Cookie', price: 500, requires_shipping: true },
      { title: 'Cheap Digital', price: 500, requires_shipping: false },
    ], 10);
    const result = evaluateCart(cart, MIN, ENABLED);

    expect(result.checkoutDisabled).toBe(true);
    expect(result.hasDigitalProducts).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Cart Validation - Minimum Order Disabled
// ---------------------------------------------------------------------------

describe('Cart Validation - Minimum Order Disabled', () => {
  const MIN = 40;
  const DISABLED = false;

  test('checkout enabled regardless of total when minimum is disabled', () => {
    const cart = buildCart([
      { title: 'Single Cookie', price: 500, requires_shipping: true },
    ], 5);
    const result = evaluateCart(cart, MIN, DISABLED);

    expect(result.checkoutDisabled).toBe(false);
    expect(result.showMinMessage).toBe(false);
  });

  test('empty cart still disables checkout even when minimum is off', () => {
    const cart = buildCart([]);
    const result = evaluateCart(cart, MIN, DISABLED);

    expect(result.checkoutDisabled).toBe(true);
  });
});
