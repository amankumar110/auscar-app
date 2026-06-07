import { describe, it, expect } from 'vitest';
import type { Car } from '../types';

function buildCar(overrides: Partial<Car> = {}): Car {
  return {
    id: '1',
    model: 'Test Car',
    baseCost: 10000,
    addOns: [],
    partners: [],
    totalCost: 10000,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

function calcMetrics(cars: Car[]) {
  return {
    totalPortfolio: cars.reduce((s, c) => s + c.totalCost, 0),
    totalBase: cars.reduce((s, c) => s + c.baseCost, 0),
    totalAddOns: cars.reduce(
      (s, c) => s + c.addOns.reduce((a, o) => a + o.amount, 0),
      0
    ),
  };
}

describe('dashboard metrics', () => {
  it('returns zeros for empty inventory', () => {
    expect(calcMetrics([])).toEqual({ totalPortfolio: 0, totalBase: 0, totalAddOns: 0 });
  });

  it('sums portfolio across multiple cars', () => {
    const cars = [
      buildCar({ totalCost: 15000 }),
      buildCar({ id: '2', totalCost: 22000 }),
    ];
    expect(calcMetrics(cars).totalPortfolio).toBe(37000);
  });

  it('sums base costs correctly', () => {
    const cars = [
      buildCar({ baseCost: 10000 }),
      buildCar({ id: '2', baseCost: 18000 }),
    ];
    expect(calcMetrics(cars).totalBase).toBe(28000);
  });

  it('sums add-on costs across all cars', () => {
    const cars = [
      buildCar({ addOns: [{ id: 'a', label: 'Tyres', amount: 500 }] }),
      buildCar({ id: '2', addOns: [{ id: 'b', label: 'Service', amount: 300 }, { id: 'c', label: 'Rego', amount: 200 }] }),
    ];
    expect(calcMetrics(cars).totalAddOns).toBe(1000);
  });
});
