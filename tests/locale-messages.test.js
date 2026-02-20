const { buildMessage } = require('./helpers/cart-validation-logic');

// ---------------------------------------------------------------------------
// Localization: Message Template Rendering
// ---------------------------------------------------------------------------

describe('buildMessage - English Template', () => {
  const EN = 'Minimum order amount is $[MIN]. Current total: $[TOTAL]';

  test('renders with integer amounts', () => {
    expect(buildMessage(EN, 40, 25)).toBe(
      'Minimum order amount is $40.00. Current total: $25.00'
    );
  });

  test('renders with decimal amounts', () => {
    expect(buildMessage(EN, 45.99, 33.5)).toBe(
      'Minimum order amount is $45.99. Current total: $33.50'
    );
  });

  test('renders with zero total', () => {
    expect(buildMessage(EN, 40, 0)).toBe(
      'Minimum order amount is $40.00. Current total: $0.00'
    );
  });
});

describe('buildMessage - Spanish Template', () => {
  const ES = 'El monto mínimo de pedido es $[MIN]. Total actual: $[TOTAL]';

  test('renders with integer amounts', () => {
    expect(buildMessage(ES, 40, 25)).toBe(
      'El monto mínimo de pedido es $40.00. Total actual: $25.00'
    );
  });

  test('renders with decimal amounts', () => {
    expect(buildMessage(ES, 45.99, 12.75)).toBe(
      'El monto mínimo de pedido es $45.99. Total actual: $12.75'
    );
  });
});

describe('buildMessage - Custom Templates', () => {
  test('custom template with both placeholders', () => {
    expect(buildMessage('Min: $[MIN] / Cart: $[TOTAL]', 55, 30)).toBe(
      'Min: $55.00 / Cart: $30.00'
    );
  });

  test('template without placeholders renders as-is', () => {
    expect(buildMessage('Your order is too small!', 40, 10)).toBe(
      'Your order is too small!'
    );
  });

  test('template with only [MIN] placeholder', () => {
    expect(buildMessage('Need at least $[MIN]', 40, 10)).toBe(
      'Need at least $40.00'
    );
  });

  test('template with only [TOTAL] placeholder', () => {
    expect(buildMessage('You have $[TOTAL]', 40, 10)).toBe(
      'You have $10.00'
    );
  });
});

describe('buildMessage - Formatting', () => {
  test('amounts always show 2 decimal places', () => {
    const msg = buildMessage('[MIN] / [TOTAL]', 40, 5);
    expect(msg).toBe('40.00 / 5.00');
  });

  test('large amounts format correctly', () => {
    const msg = buildMessage('[MIN] / [TOTAL]', 1000, 999.99);
    expect(msg).toBe('1000.00 / 999.99');
  });

  test('very small amounts format correctly', () => {
    const msg = buildMessage('[MIN] / [TOTAL]', 0.01, 0.005);
    expect(msg).toContain('0.01');
  });
});
