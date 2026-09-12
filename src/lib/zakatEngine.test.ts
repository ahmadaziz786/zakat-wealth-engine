import { describe, it, expect } from 'vitest';
import { calculateZakat, ZakatInput } from './zakatEngine';

describe('Zakat Engine', () => {
  const baseInput: ZakatInput = {
    currency: 'USD',
    calendarType: 'lunar',
    nisabMetal: 'silver',
    metalPrices: {
      goldPerGram: 60,
      silverPerGram: 0.8
    },
    liquidAssets: {
      cashInHand: 0,
      bankChecking: 0,
      bankSavings: 0
    },
    modernEquities: {
      tradingStocksMarketValue: 0,
      longTermHoldingsValue: 0,
      vestedRSUsValue: 0,
      unvestedRSUsValue: 0
    },
    cryptoAssets: {
      liquidCryptoValue: 0,
      lockedStakingValue: 0
    },
    retirementAssets: {
      lockedRetirementCorpus: 0,
      liquidRetirementCorpus: 0
    },
    preciousMetals: {
      goldGrams: 0,
      silverGrams: 0
    },
    hawlDate: '2025-01-01',
    deductibleLiabilities: {
      immediateDueBills: 0,
      currentMonthDebtObligations: 0
    }
  };

  it('Test 1: Unvested RSUs are strictly ignored (0% weight)', () => {
    const input = {
      ...baseInput,
      liquidAssets: { ...baseInput.liquidAssets, cashInHand: 1000 },
      modernEquities: { ...baseInput.modernEquities, unvestedRSUsValue: 50000 }
    };
    const result = calculateZakat(input);
    expect(result.zakatablePool).toBe(1000);
    expect(result.zakatDue).toBe(1000 * 0.025);
  });

  it('Test 2: Long-term equities only count at exactly 25% of market value', () => {
    const input = {
      ...baseInput,
      modernEquities: { ...baseInput.modernEquities, longTermHoldingsValue: 4000 }
    };
    const result = calculateZakat(input);
    expect(result.zakatablePool).toBe(1000);
    expect(result.zakatDue).toBe(1000 * 0.025);
  });

  it('Test 3: Locked staking crypto is excluded from zakatable pool', () => {
    const input = {
      ...baseInput,
      liquidAssets: { ...baseInput.liquidAssets, cashInHand: 1000 },
      cryptoAssets: { ...baseInput.cryptoAssets, lockedStakingValue: 10000 }
    };
    const result = calculateZakat(input);
    expect(result.zakatablePool).toBe(1000);
    expect(result.zakatDue).toBe(1000 * 0.025);
  });

  it('Test 4: When zakatable pool is below Nisab threshold, zakatDue is strictly 0', () => {
    const input = {
      ...baseInput,
      liquidAssets: { ...baseInput.liquidAssets, cashInHand: 400 } // Below 476 silver nisab
    };
    const result = calculateZakat(input);
    expect(result.zakatablePool).toBe(400);
    expect(result.isNisabReached).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it('Test 5: Accurate rate calculation comparing Solar (2.577%) vs Lunar (2.5%)', () => {
    const lunarInput = {
      ...baseInput,
      calendarType: 'lunar' as const,
      liquidAssets: { ...baseInput.liquidAssets, cashInHand: 1000 }
    };
    const solarInput = {
      ...baseInput,
      calendarType: 'solar' as const,
      liquidAssets: { ...baseInput.liquidAssets, cashInHand: 1000 }
    };
    const lunarResult = calculateZakat(lunarInput);
    const solarResult = calculateZakat(solarInput);
    
    expect(lunarResult.zakatDue).toBe(1000 * 0.025);
    expect(solarResult.zakatDue).toBe(1000 * 0.02577);
  });

  it('Test 6: Deductible current debts correctly offset liquid balances', () => {
    const input = {
      ...baseInput,
      liquidAssets: { ...baseInput.liquidAssets, cashInHand: 1000 },
      deductibleLiabilities: { immediateDueBills: 200, currentMonthDebtObligations: 300 }
    };
    const result = calculateZakat(input);
    expect(result.zakatablePool).toBe(500); // 1000 - 200 - 300
    expect(result.zakatDue).toBe(500 * 0.025);
  });
});
