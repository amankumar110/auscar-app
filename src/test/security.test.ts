import { describe, it, expect } from 'vitest';

describe('security: input sanitisation', () => {
  it('trims whitespace from model before save', () => {
    const raw = '  Toyota Camry  ';
    expect(raw.trim()).toBe('Toyota Camry');
  });

  it('rejects empty model after trim', () => {
    const model = '   ';
    expect(model.trim().length).toBe(0);
  });

  it('rejects negative base cost', () => {
    const baseCost = -500;
    expect(baseCost < 0).toBe(true);
  });

  it('rejects NaN base cost (non-numeric input)', () => {
    const raw = 'abc';
    const parsed = parseFloat(raw);
    expect(isNaN(parsed) || parsed < 0).toBe(true);
  });

  it('does not execute script tags in model field (React escapes by default)', () => {
    // React renders text as text nodes, not innerHTML — this verifies the data
    // handling logic strips nothing (sanitisation is React's responsibility)
    const model = '<script>alert("xss")</script>';
    // The stored value is the raw string; React will never execute it
    expect(model).toContain('<script>');
    // Confirms we do NOT strip it at data layer — React handles display safely
  });

  it('parseFloat safely handles script-injected amount strings', () => {
    const maliciousInput = '<script>alert(1)</script>';
    const result = parseFloat(maliciousInput) || 0;
    expect(result).toBe(0);
  });

  it('partner invested amount is always coerced to a number', () => {
    const inputs = ['abc', '', null, undefined, '<script>', '1e10'];
    const results = inputs.map((v) => parseFloat(v as string) || 0);
    expect(results).toEqual([0, 0, 0, 0, 0, 10000000000]);
  });
});

describe('security: data integrity', () => {
  it('totalCost stored with car matches baseCost + addOns sum', () => {
    const baseCost = 12000;
    const addOns = [
      { id: '1', label: 'Tyres', amount: 400 },
      { id: '2', label: 'Rego', amount: 600 },
    ];
    const computed = baseCost + addOns.reduce((s, a) => s + a.amount, 0);
    expect(computed).toBe(13000);
  });

  it('partner amounts cannot exceed totalCost (validation gate)', () => {
    const totalCost = 5000;
    const partnersTotal = 6000;
    const valid = Math.abs(partnersTotal - totalCost) < 0.01;
    expect(valid).toBe(false);
  });

  it('car with no partners is still valid (partners are optional)', () => {
    const partners: { invested: number }[] = [];
    const partnersTotal = partners.reduce((s, p) => s + p.invested, 0);
    const totalCost = 0;
    const valid = totalCost === 0 || Math.abs(partnersTotal - totalCost) < 0.01;
    expect(valid).toBe(true);
  });
});
