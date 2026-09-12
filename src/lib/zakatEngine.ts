export type Currency = 'USD' | 'INR' | 'AED' | 'GBP' | 'EUR';
export type CalendarType = 'solar' | 'lunar';
export type NisabMetal = 'silver' | 'gold';

export interface ZakatInput {
  currency: Currency;
  calendarType: CalendarType;
  nisabMetal: NisabMetal;
  metalPrices: {
    goldPerGram: number;
    silverPerGram: number;
  };
  liquidAssets: {
    cashInHand: number;
    bankChecking: number;
    bankSavings: number;
  };
  modernEquities: {
    tradingStocksMarketValue: number;
    longTermHoldingsValue: number;
    vestedRSUsValue: number;
    unvestedRSUsValue: number;
  };
  cryptoAssets: {
    liquidCryptoValue: number;
    lockedStakingValue: number;
  };
  retirementAssets: {
    lockedRetirementCorpus: number;
    liquidRetirementCorpus: number;
  };
  hawlDate: string;
  deductibleLiabilities: {
    immediateDueBills: number;
    currentMonthDebtObligations: number;
  };
  preciousMetals: {
    goldGrams: number;
    silverGrams: number;
  };
}

export interface ZakatBreakdown {
  grossAssets: number;
  zakatablePool: number;
  deductibleLiabilities: number;
  nisabThreshold: number;
  isNisabReached: boolean;
  zakatDue: number;
  effectiveRate: number;
}

export function calculateZakat(input: ZakatInput): ZakatBreakdown {
  const silverNisab = 595 * input.metalPrices.silverPerGram;
  const goldNisab = 85 * input.metalPrices.goldPerGram;
  const nisabThreshold = input.nisabMetal === 'gold' ? goldNisab : silverNisab;

  const grossAssets = 
    input.liquidAssets.cashInHand + 
    input.liquidAssets.bankChecking + 
    input.liquidAssets.bankSavings + 
    input.modernEquities.tradingStocksMarketValue + 
    input.modernEquities.longTermHoldingsValue + 
    input.modernEquities.vestedRSUsValue + 
    input.modernEquities.unvestedRSUsValue + 
    input.cryptoAssets.liquidCryptoValue + 
    input.cryptoAssets.lockedStakingValue +
    input.retirementAssets.lockedRetirementCorpus +
    input.retirementAssets.liquidRetirementCorpus +
    (input.preciousMetals.goldGrams * input.metalPrices.goldPerGram) +
    (input.preciousMetals.silverGrams * input.metalPrices.silverPerGram);

  const deductibleLiabilities = 
    input.deductibleLiabilities.immediateDueBills + 
    input.deductibleLiabilities.currentMonthDebtObligations;

  let zakatablePool = 
    input.liquidAssets.cashInHand + 
    input.liquidAssets.bankChecking + 
    input.liquidAssets.bankSavings + 
    input.modernEquities.tradingStocksMarketValue + 
    (input.modernEquities.longTermHoldingsValue * 0.25) + 
    input.modernEquities.vestedRSUsValue + 
    input.cryptoAssets.liquidCryptoValue + 
    input.retirementAssets.liquidRetirementCorpus +
    (input.preciousMetals.goldGrams * input.metalPrices.goldPerGram) +
    (input.preciousMetals.silverGrams * input.metalPrices.silverPerGram) - 
    deductibleLiabilities;

  if (zakatablePool < 0) {
    zakatablePool = 0;
  }

  const isNisabReached = zakatablePool >= nisabThreshold;
  const effectiveRate = input.calendarType === 'solar' ? 0.02577 : 0.025;

  let zakatDue = 0;
  if (isNisabReached) {
    zakatDue = zakatablePool * effectiveRate;
  }

  return {
    grossAssets,
    zakatablePool,
    deductibleLiabilities,
    nisabThreshold,
    isNisabReached,
    zakatDue,
    effectiveRate
  };
}
