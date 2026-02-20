const {
  parseMinimumOrder,
  parseEnableFlag,
  evaluateCart,
} = require('./helpers/cart-validation-logic');
const { buildCart } = require('./helpers/cart-dom-setup');

// ---------------------------------------------------------------------------
// Edge Cases: Minimum Order Amount Parsing
// ---------------------------------------------------------------------------

describe('parseMinimumOrder - Zero Value', () => {
  test('0 falls back to $40 default', () => {
    expect(parseMinimumOrder('0')).toBe(40);
    expect(parseMinimumOrder(0)).toBe(40);
  });

  test('zero-valued cart is blocked at $40 default', () => {
    const min = parseMinimumOrder('0');
    const cart = buildCart([
      { title: 'Item', price: 2000, requires_shipping: true },
    ], 20);
    const result = evaluateCart(cart, min, true);

    expect(result.checkoutDisabled).toBe(true);
  });
});

describe('parseMinimumOrder - Negative Values', () => {
  test('-10 falls back to $40 default', () => {
    expect(parseMinimumOrder('-10')).toBe(40);
    expect(parseMinimumOrder(-10)).toBe(40);
  });

  test('-0.01 falls back to $40 default', () => {
    expect(parseMinimumOrder('-0.01')).toBe(40);
  });

  test('-999 falls back to $40 default', () => {
    expect(parseMinimumOrder('-999')).toBe(40);
  });
});

describe('parseMinimumOrder - Decimal Values', () => {
  test('45.99 is parsed correctly', () => {
    expect(parseMinimumOrder('45.99')).toBe(45.99);
  });

  test('0.01 is treated as valid (not zero)', () => {
    expect(parseMinimumOrder('0.01')).toBe(0.01);
  });

  test('100.50 is parsed correctly', () => {
    expect(parseMinimumOrder('100.50')).toBe(100.5);
  });

  test('decimal minimum enforces correctly', () => {
    const min = parseMinimumOrder('45.99');
    const cart = buildCart([
      { title: 'Cookie Box', price: 4500, requires_shipping: true },
    ], 45);
    const result = evaluateCart(cart, min, true);

    expect(result.checkoutDisabled).toBe(true);
  });

  test('cart at exact decimal minimum passes', () => {
    const min = parseMinimumOrder('45.99');
    const cart = buildCart([
      { title: 'Cookie Box', price: 4599, requires_shipping: true },
    ], 45.99);
    const result = evaluateCart(cart, min, true);

    expect(result.checkoutDisabled).toBe(false);
  });
});

describe('parseMinimumOrder - Non-Numeric / Missing Values', () => {
  test('alphabetic string falls back to $40', () => {
    expect(parseMinimumOrder('abc')).toBe(40);
  });

  test('empty string falls back to $40', () => {
    expect(parseMinimumOrder('')).toBe(40);
  });

  test('undefined falls back to $40', () => {
    expect(parseMinimumOrder(undefined)).toBe(40);
  });

  test('null falls back to $40', () => {
    expect(parseMinimumOrder(null)).toBe(40);
  });

  test('NaN falls back to $40', () => {
    expect(parseMinimumOrder(Number.NaN)).toBe(40);
  });

  test('Infinity falls back to $40', () => {
    expect(parseMinimumOrder(Infinity)).toBe(40);
  });

  test('-Infinity falls back to $40', () => {
    expect(parseMinimumOrder(-Infinity)).toBe(40);
  });
});

describe('parseMinimumOrder - Large Values', () => {
  test('99999 is parsed correctly', () => {
    expect(parseMinimumOrder('99999')).toBe(99999);
  });

  test('very large minimum works in cart evaluation', () => {
    const min = parseMinimumOrder('99999');
    const cart = buildCart([
      { title: 'Expensive', price: 5000000, requires_shipping: true },
    ], 50000);
    const result = evaluateCart(cart, min, true);

    expect(result.checkoutDisabled).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseEnableFlag
// ---------------------------------------------------------------------------

describe('parseEnableFlag', () => {
  test('"true" returns true', () => {
    expect(parseEnableFlag('true')).toBe(true);
  });

  test('"false" returns false', () => {
    expect(parseEnableFlag('false')).toBe(false);
  });

  test('undefined returns true (default enabled)', () => {
    expect(parseEnableFlag(undefined)).toBe(true);
  });

  test('empty string returns true', () => {
    expect(parseEnableFlag('')).toBe(true);
  });

  test('"yes" returns true (only "false" disables)', () => {
    expect(parseEnableFlag('yes')).toBe(true);
  });
});
