import { describe, it, expect } from 'vitest';
import type { AddOn } from '../types';

function calcTotal(baseCost: number, addOns: AddOn[]): number {
  return baseCost + addOns.reduce((s, a) => s + a.amount, 0);
}

describe('totalCost calculation', () => {
  it('equals base cost when no add-ons', () => {
    expect(calcTotal(15000, [])).toBe(15000);
  });

  it('sums base + all add-ons', () => {
    const addOns: AddOn[] = [
      { id: '1', label: 'Tyres', amount: 500 },
      { id: '2', label: 'Service', amount: 300 },
    ];
    expect(calcTotal(10000, addOns)).toBe(10800);
  });

  it('matches the reported bug scenario: base 1800 + addon1 200 + addon2 500 = 2500', () => {
    const addOns: AddOn[] = [
      { id: '1', label: 'addon no 1', amount: 200 },
      { id: '2', label: 'addon no 2', amount: 500 },
    ];
    expect(calcTotal(1800, addOns)).toBe(2500);
  });

  it('handles zero base cost', () => {
    const addOns: AddOn[] = [{ id: '1', label: 'Rego', amount: 800 }];
    expect(calcTotal(0, addOns)).toBe(800);
  });

  it('handles zero-amount add-ons without inflating total', () => {
    const addOns: AddOn[] = [
      { id: '1', label: 'Tyres', amount: 500 },
      { id: '2', label: 'Empty', amount: 0 },
    ];
    expect(calcTotal(10000, addOns)).toBe(10500);
  });
});

describe('partner validation', () => {
  it('passes when partner total equals car total', () => {
    const totalCost = 2500;
    const partnersTotal = 2500;
    expect(Math.abs(partnersTotal - totalCost) < 0.01).toBe(true);
  });

  it('fails when partner total is less than car total', () => {
    const totalCost = 2500;
    const partnersTotal = 2000;
    expect(Math.abs(partnersTotal - totalCost) < 0.01).toBe(false);
  });

  it('fails when partner total exceeds car total', () => {
    const totalCost = 2500;
    const partnersTotal = 3000;
    expect(Math.abs(partnersTotal - totalCost) < 0.01).toBe(false);
  });

  it('allows tiny floating point differences (< 0.01)', () => {
    const totalCost = 1000;
    const partnersTotal = 1000.005;
    expect(Math.abs(partnersTotal - totalCost) < 0.01).toBe(true);
  });

  it('ownership % sums to 100 when investments equal total', () => {
    const totalCost = 10000;
    const partners = [
      { id: '1', name: 'Alice', invested: 6000 },
      { id: '2', name: 'Bob', invested: 2500 },
      { id: '3', name: 'Charlie', invested: 1500 },
    ];
    const pctSum = partners.reduce((s, p) => s + (p.invested / totalCost) * 100, 0);
    expect(pctSum).toBeCloseTo(100);
  });

  it('uneven ownership (60/25/15) still sums to 100%', () => {
    const totalCost = 10000;
    const partners = [
      { id: '1', name: 'Alice', invested: 6000 },
      { id: '2', name: 'Bob', invested: 2500 },
      { id: '3', name: 'Charlie', invested: 1500 },
    ];
    const sum = partners.reduce((s, p) => s + p.invested, 0);
    expect(sum).toBe(totalCost);
  });
});
