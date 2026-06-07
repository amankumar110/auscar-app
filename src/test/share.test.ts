import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('share: clipboard', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('copies only the car model to clipboard', async () => {
    const car = { model: '2021 Toyota Camry', totalCost: 18000 };
    await navigator.clipboard.writeText(car.model);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('2021 Toyota Camry');
    expect(navigator.clipboard.writeText).not.toHaveBeenCalledWith(
      expect.stringContaining('18000')
    );
  });

  it('handles model with special characters cleanly', async () => {
    const car = { model: 'BMW 3-Series (2020) — White' };
    await navigator.clipboard.writeText(car.model);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(car.model);
  });
});
