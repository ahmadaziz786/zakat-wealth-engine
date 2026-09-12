import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateZakat, ZakatInput, ZakatBreakdown, Currency, CalendarType, NisabMetal } from '@/lib/zakatEngine';

export interface ZakatState extends ZakatInput {
  setCurrency: (c: Currency) => void;
  setCalendarType: (c: CalendarType) => void;
  setNisabMetal: (m: NisabMetal) => void;
  setMetalPrices: (prices: Partial<ZakatInput['metalPrices']>) => void;
  setLiquidAssets: (assets: Partial<ZakatInput['liquidAssets']>) => void;
  setModernEquities: (equities: Partial<ZakatInput['modernEquities']>) => void;
  setCryptoAssets: (crypto: Partial<ZakatInput['cryptoAssets']>) => void;
  setRetirementAssets: (ret: Partial<ZakatInput['retirementAssets']>) => void;
  setPreciousMetals: (metals: Partial<ZakatInput['preciousMetals']>) => void;
  setHawlDate: (date: string) => void;
  setDeductibleLiabilities: (liabs: Partial<ZakatInput['deductibleLiabilities']>) => void;
  resetAllInputs: () => void;
  isUnlocked: boolean;
  setUnlocked: (val: boolean) => void;
}

const defaultMetalPrices: Record<Currency, { goldPerGram: number; silverPerGram: number }> = {
  INR: { silverPerGram: 85, goldPerGram: 7200 },
  USD: { silverPerGram: 0.95, goldPerGram: 75 },
  AED: { silverPerGram: 3.5, goldPerGram: 275 },
  GBP: { silverPerGram: 0.75, goldPerGram: 59 },
  EUR: { silverPerGram: 0.88, goldPerGram: 69 },
};

export const useZakatStore = create<ZakatState>()(
  persist(
    (set) => ({
      currency: 'INR',
      calendarType: 'solar',
      nisabMetal: 'silver',
  metalPrices: defaultMetalPrices['INR'],
  liquidAssets: { cashInHand: 0, bankChecking: 0, bankSavings: 0 },
  modernEquities: { tradingStocksMarketValue: 0, longTermHoldingsValue: 0, vestedRSUsValue: 0, unvestedRSUsValue: 0 },
  cryptoAssets: { liquidCryptoValue: 0, lockedStakingValue: 0 },
  retirementAssets: { lockedRetirementCorpus: 0, liquidRetirementCorpus: 0 },
  preciousMetals: { goldGrams: 0, silverGrams: 0 },
  hawlDate: new Date().toISOString().split('T')[0],
  deductibleLiabilities: { immediateDueBills: 0, currentMonthDebtObligations: 0 },
  isUnlocked: false,

  setCurrency: (c) => set({ currency: c, metalPrices: defaultMetalPrices[c] }),
  setCalendarType: (c) => set({ calendarType: c }),
  setNisabMetal: (m) => set({ nisabMetal: m }),
  setMetalPrices: (prices) => set((state) => ({ metalPrices: { ...state.metalPrices, ...prices } })),
  setLiquidAssets: (assets) => set((state) => ({ liquidAssets: { ...state.liquidAssets, ...assets } })),
  setModernEquities: (equities) => set((state) => ({ modernEquities: { ...state.modernEquities, ...equities } })),
  setCryptoAssets: (crypto) => set((state) => ({ cryptoAssets: { ...state.cryptoAssets, ...crypto } })),
  setRetirementAssets: (ret) => set((state) => ({ retirementAssets: { ...state.retirementAssets, ...ret } })),
  setPreciousMetals: (metals) => set((state) => ({ preciousMetals: { ...state.preciousMetals, ...metals } })),
  setHawlDate: (date) => set({ hawlDate: date }),
  setDeductibleLiabilities: (liabs) => set((state) => ({ deductibleLiabilities: { ...state.deductibleLiabilities, ...liabs } })),
  setUnlocked: (val) => set({ isUnlocked: val }),
  resetAllInputs: () => set({
    liquidAssets: { cashInHand: 0, bankChecking: 0, bankSavings: 0 },
    modernEquities: { tradingStocksMarketValue: 0, longTermHoldingsValue: 0, vestedRSUsValue: 0, unvestedRSUsValue: 0 },
    cryptoAssets: { liquidCryptoValue: 0, lockedStakingValue: 0 },
    retirementAssets: { lockedRetirementCorpus: 0, liquidRetirementCorpus: 0 },
    preciousMetals: { goldGrams: 0, silverGrams: 0 },
    hawlDate: new Date().toISOString().split('T')[0],
    deductibleLiabilities: { immediateDueBills: 0, currentMonthDebtObligations: 0 },
  }),
    }),
    {
      name: 'zakat-wealth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

