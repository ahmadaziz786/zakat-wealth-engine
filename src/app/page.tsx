'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Database, Search, Download, 
  Wallet, TrendingUp, Bitcoin, ReceiptText, 
  Settings2, CheckCircle2, AlertTriangle, RotateCcw, Mail, Briefcase, Coins
} from 'lucide-react';
import { useZakatStore } from '@/store/useZakatStore';
import { Currency, CalendarType, NisabMetal, calculateZakat } from '@/lib/zakatEngine';
import PDFDownloadButton from '@/components/PDFDownloadButton';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import Logo from '@/components/Logo';

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const inputClass = "h-11 w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white hover:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/70 outline-none transition-all duration-200 shadow-inner";

export default function ZakatDashboard() {
  const store = useZakatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [fetchedRates, setFetchedRates] = useState<any>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetToast, setResetToast] = useState(false);
  const hasHydrated = useRef(false);

  const handleReset = () => {
    setIsResetting(true);
    store.resetAllInputs();
    setResetToast(true);
    setTimeout(() => setIsResetting(false), 500);
    setTimeout(() => setResetToast(false), 3000);
  };

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setFetchedRates(data.rates);
        }
      })
      .catch(err => console.error("Failed to fetch rates", err));
  }, []);

  // Auto-load state on mount
  useEffect(() => {
    const saved = localStorage.getItem('zakat_wealth_draft_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.liquidAssets) store.setLiquidAssets(parsed.liquidAssets);
        if (parsed.modernEquities) store.setModernEquities(parsed.modernEquities);
        if (parsed.cryptoAssets) store.setCryptoAssets(parsed.cryptoAssets);
        if (parsed.retirementAssets) store.setRetirementAssets(parsed.retirementAssets);
        if (parsed.preciousMetals) store.setPreciousMetals(parsed.preciousMetals);
        if (parsed.deductibleLiabilities) store.setDeductibleLiabilities(parsed.deductibleLiabilities);
        if (parsed.currency) store.setCurrency(parsed.currency);
        if (parsed.calendarType) store.setCalendarType(parsed.calendarType);
        if (parsed.nisabMetal) store.setNisabMetal(parsed.nisabMetal);
        if (parsed.metalPrices) store.setMetalPrices(parsed.metalPrices);
      } catch(e) {}
    }
    hasHydrated.current = true;
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Auto-save state changes
  useEffect(() => {
    if (!hasHydrated.current) return;
    const stateToSave = {
      liquidAssets: store.liquidAssets,
      modernEquities: store.modernEquities,
      cryptoAssets: store.cryptoAssets,
      deductibleLiabilities: store.deductibleLiabilities,
      currency: store.currency,
      calendarType: store.calendarType,
      nisabMetal: store.nisabMetal,
      metalPrices: store.metalPrices,
      hawlDate: store.hawlDate,
      retirementAssets: store.retirementAssets,
      preciousMetals: store.preciousMetals,
    };
    localStorage.setItem('zakat_wealth_draft_v1', JSON.stringify(stateToSave));
  }, [
    store.liquidAssets, store.modernEquities, store.cryptoAssets, store.deductibleLiabilities,
    store.currency, store.calendarType, store.nisabMetal, store.metalPrices, store.hawlDate, store.retirementAssets, store.preciousMetals
  ]);
  
  const breakdown = useMemo(() => {
    return calculateZakat({
      currency: store.currency,
      calendarType: store.calendarType,
      nisabMetal: store.nisabMetal,
      metalPrices: store.metalPrices,
      liquidAssets: store.liquidAssets,
      modernEquities: store.modernEquities,
      cryptoAssets: store.cryptoAssets,
      deductibleLiabilities: store.deductibleLiabilities,
      hawlDate: store.hawlDate,
      retirementAssets: store.retirementAssets,
      preciousMetals: store.preciousMetals,
    });
  }, [
    store.currency, store.calendarType, store.nisabMetal, store.metalPrices,
    store.liquidAssets, store.modernEquities, store.cryptoAssets, store.deductibleLiabilities, store.hawlDate, store.retirementAssets, store.preciousMetals
  ]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
            <Logo className="w-20 h-20 relative z-10" />
          </div>
          <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden mb-4 border border-slate-800">
            <div className="h-full bg-emerald-500 w-1/2 rounded-full relative overflow-hidden animate-[ping_1.5s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-emerald-500 text-sm font-medium tracking-wide animate-pulse">
            Initializing AAOIFI FinTech Engine...
          </p>
        </div>
      )}

      {/* Reset Confirmation Toast */}
      {resetToast && (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs py-2.5 px-4 rounded-xl shadow-xl fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          All calculation inputs have been reset to defaults.
        </div>
      )}
      
      {/* Top Bar for Status Pill */}
      <div className="absolute top-0 w-full flex justify-end px-6 pt-4 z-40 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-[10px] sm:text-xs font-medium text-emerald-300 shadow-lg shadow-black/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          100% Client-Side • Auto-saved <span className="hidden sm:inline">(Do not clear cache)</span>
        </div>
      </div>

      <div className={`min-h-screen bg-slate-950 text-slate-50 font-sans pb-24 relative transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Trust Hero */}
        <header className="flex flex-col items-center justify-center text-center px-4 pt-6 pb-2 max-w-6xl mx-auto border-b border-slate-800/60 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Logo className="!w-6 !h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight mb-2">
            Modern Asset Zakat & <span className="text-emerald-400">Ethical Wealth Tax Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2 mb-8 text-center">
            Deterministic, AAOIFI-compliant calculations for Tech RSUs, Public Equities, and Web3 Portfolios.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
          <div className="flex items-center gap-2"><Database size={16} className="text-slate-500" /> Zero DB Storage</div>
          <div className="flex items-center gap-2"><Search size={16} className="text-slate-500" /> Open Network Audit Ready</div>
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-slate-500" /> Zero Donation Upsells</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Global Settings Bar */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-5 mb-8 relative hover:border-emerald-500/30 transition-all duration-300">
          
          {/* Header Row */}
          <div className="flex items-center justify-between w-full border-b border-slate-800/60 pb-4">
            <div className="flex items-center gap-2">
              <Settings2 className="text-slate-400" size={20} />
              <span className="font-medium text-slate-200">Global Settings</span>
            </div>
            <button 
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-600 active:scale-95 active:bg-slate-700/50 transition-all duration-150 bg-slate-950 shadow-sm"
              title="Clear all values"
            >
              <RotateCcw size={14} className={isResetting ? 'rotate-180 transition-transform duration-500' : ''} /> Reset
            </button>
          </div>
          
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end mt-5">
            {/* Col 1: Currency */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Currency</label>
              <select 
                value={store.currency} 
                onChange={(e) => {
                  const c = e.target.value as Currency;
                  store.setCurrency(c);
                  if (fetchedRates && fetchedRates[c]) {
                    store.setMetalPrices({ silverPerGram: fetchedRates[c].silver, goldPerGram: fetchedRates[c].gold });
                  }
                }}
                className={inputClass}
              >
                {['USD', 'INR', 'AED', 'GBP', 'EUR'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Col 2: Calendar Basis */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Calendar Basis</label>
              <select 
                value={store.calendarType} 
                onChange={(e) => store.setCalendarType(e.target.value as CalendarType)}
                className={inputClass}
              >
                <option value="lunar">Lunar (2.5%)</option>
                <option value="solar">Solar (2.577%)</option>
              </select>
            </div>

            {/* Col 3: Hawl Anniversary Date */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 group relative cursor-help w-fit">
                Hawl Date (Annual Zakat Cycle)
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-[10px] text-slate-200 rounded shadow-xl z-10 border border-slate-700">
                  The Islamic anniversary date when wealth first met Nisab.
                </div>
              </label>
              <input 
                type="date"
                value={store.hawlDate}
                onChange={(e) => store.setHawlDate(e.target.value)}
                onClick={(e) => { try { (e.target as HTMLInputElement).showPicker?.(); } catch(err) {} }}
                className={`${inputClass} [color-scheme:dark] cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80 hover:[&::-webkit-calendar-picker-indicator]:opacity-100`}
              />
            </div>

            {/* Col 4: Nisab Benchmark */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Nisab Benchmark</label>
              <select 
                value={store.nisabMetal} 
                onChange={(e) => store.setNisabMetal(e.target.value as NisabMetal)}
                className={inputClass}
              >
                <option value="silver">Silver (595g)</option>
                <option value="gold">Gold (85g)</option>
              </select>
            </div>
          </div>

          {/* Dedicated Spot Rates Sub-bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/40 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex gap-3">
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden h-10 shadow-inner focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
                <div className="px-3 py-2 bg-slate-900 border-r border-slate-800 text-xs font-medium text-slate-400">
                  Silver/g ({store.currency})
                </div>
                <input 
                  type="number" 
                  value={store.metalPrices.silverPerGram || ''} 
                  onChange={(e) => store.setMetalPrices({ silverPerGram: parseFloat(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="w-24 px-3 py-2 bg-transparent text-sm text-white outline-none"
                />
              </div>

              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden h-10 shadow-inner focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all">
                <div className="px-3 py-2 bg-slate-900 border-r border-slate-800 text-xs font-medium text-amber-500/90">
                  Gold/g ({store.currency})
                </div>
                <input 
                  type="number" 
                  value={store.metalPrices.goldPerGram || ''} 
                  onChange={(e) => store.setMetalPrices({ goldPerGram: parseFloat(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="w-28 px-3 py-2 bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400/90 font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              24K Bullion Spot (Click to edit for city rates)
            </div>
          </div>

        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Asset Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Liquid Cash */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Wallet size={24} /></div>
                <h2 className="text-xl font-semibold text-white">Liquid Cash & Bank Balances</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Cash in Hand</label>
                  <input type="number" min="0" value={store.liquidAssets.cashInHand || ''} onChange={(e) => store.setLiquidAssets({ cashInHand: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Checking Accounts</label>
                  <input type="number" min="0" value={store.liquidAssets.bankChecking || ''} onChange={(e) => store.setLiquidAssets({ bankChecking: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Savings Accounts</label>
                  <input type="number" min="0" value={store.liquidAssets.bankSavings || ''} onChange={(e) => store.setLiquidAssets({ bankSavings: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Card 2: Physical Precious Metals */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><Coins size={24} /></div>
                <h2 className="text-xl font-semibold text-white">Physical Gold & Silver Bullion</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                    Gold Weight (grams) <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">100% Zakatable</span>
                  </label>
                  <input type="number" min="0" placeholder="e.g. 50" value={store.preciousMetals.goldGrams || ''} onChange={(e) => store.setPreciousMetals({ goldGrams: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                  {store.preciousMetals.goldGrams > 0 && (
                    <div className="mt-1 text-[11px] text-amber-500 font-medium">
                      ≈ {formatCurrency(store.preciousMetals.goldGrams * store.metalPrices.goldPerGram, store.currency)} (@ {formatCurrency(store.metalPrices.goldPerGram, store.currency)}/g)
                    </div>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                    Silver Weight (grams) <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">100% Zakatable</span>
                  </label>
                  <input type="number" min="0" placeholder="e.g. 250" value={store.preciousMetals.silverGrams || ''} onChange={(e) => store.setPreciousMetals({ silverGrams: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                  {store.preciousMetals.silverGrams > 0 && (
                    <div className="mt-1 text-[11px] text-slate-400 font-medium">
                      ≈ {formatCurrency(store.preciousMetals.silverGrams * store.metalPrices.silverPerGram, store.currency)} (@ {formatCurrency(store.metalPrices.silverPerGram, store.currency)}/g)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Tech Equities */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><TrendingUp size={24} /></div>
                <h2 className="text-xl font-semibold text-white">Tech Equities & RSUs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                    Trading Stocks <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">100% Zakatable</span>
                  </label>
                  <input type="number" min="0" value={store.modernEquities.tradingStocksMarketValue || ''} onChange={(e) => store.setModernEquities({ tradingStocksMarketValue: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1 group relative cursor-help">
                    Long-term Holdings <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">25% Proxy</span>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded shadow-xl z-10 border border-slate-700 leading-relaxed">
                      AAOIFI proxy assumes ~25% of company market value represents liquid zakatable assets.
                    </div>
                  </label>
                  <input type="number" min="0" value={store.modernEquities.longTermHoldingsValue || ''} onChange={(e) => store.setModernEquities({ longTermHoldingsValue: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                    Vested RSUs <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">100% Zakatable</span>
                  </label>
                  <input type="number" min="0" value={store.modernEquities.vestedRSUsValue || ''} onChange={(e) => store.setModernEquities({ vestedRSUsValue: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1 group relative cursor-help">
                    Unvested RSUs <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-500 px-2 py-0.5 rounded line-through">0% Included</span>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded shadow-xl z-10 border border-slate-700 leading-relaxed">
                      Excluded under Milk-e-Taam rule: You do not have absolute ownership/control yet.
                    </div>
                  </label>
                  <input type="number" min="0" value={store.modernEquities.unvestedRSUsValue || ''} onChange={(e) => store.setModernEquities({ unvestedRSUsValue: parseFloat(e.target.value) || 0 })} className={`${inputClass} opacity-50`} onFocus={(e) => e.target.select()} />
                </div>
              </div>
            </div>

            {/* Card 3: Crypto */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg"><Bitcoin size={24} /></div>
                <h2 className="text-xl font-semibold text-white">Crypto & Digital Assets</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                    Liquid Spot Crypto <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">100% Zakatable</span>
                  </label>
                  <input type="number" min="0" value={store.cryptoAssets.liquidCryptoValue || ''} onChange={(e) => store.setCryptoAssets({ liquidCryptoValue: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1 group relative cursor-help">
                    Locked Staking <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-500 px-2 py-0.5 rounded line-through">0% Included</span>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded shadow-xl z-10 border border-slate-700 leading-relaxed">
                      Inaccessible assets are not zakatable until unlocked and received.
                    </div>
                  </label>
                  <input type="number" min="0" value={store.cryptoAssets.lockedStakingValue || ''} onChange={(e) => store.setCryptoAssets({ lockedStakingValue: parseFloat(e.target.value) || 0 })} className={`${inputClass} opacity-50`} onFocus={(e) => e.target.select()} />
                </div>
              </div>
            </div>

            {/* Card 4: Retirement Assets */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Briefcase size={24} /></div>
                <h2 className="text-xl font-semibold text-white">Retirement & Locked Funds (EPF / VPF / 401(k) / NPS)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1 group relative cursor-help">
                    Inaccessible / Locked Corpus <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-500 px-2 py-0.5 rounded line-through">0% Included</span>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded shadow-xl z-10 border border-slate-700 leading-relaxed">
                      Milkiyyah Tammah: Wealth is legally inaccessible without severe penalty or resignation. Not zakatable yet.
                    </div>
                  </label>
                  <input type="number" min="0" value={store.retirementAssets.lockedRetirementCorpus || ''} onChange={(e) => store.setRetirementAssets({ lockedRetirementCorpus: parseFloat(e.target.value) || 0 })} className={`${inputClass} opacity-50`} onFocus={(e) => e.target.select()} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                    Withdrawable / Liquid Corpus <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">100% Zakatable</span>
                  </label>
                  <input type="number" min="0" value={store.retirementAssets.liquidRetirementCorpus || ''} onChange={(e) => store.setRetirementAssets({ liquidRetirementCorpus: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Card 5: Liabilities */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg"><ReceiptText size={24} /></div>
                <h2 className="text-xl font-semibold text-white">Deductible Immediate Liabilities</h2>
              </div>
              <p className="text-sm text-slate-400 mb-6 bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                Only include debts and bills that are due immediately (within 30 days). Do not include the entirety of long-term loans.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Immediate Due Bills</label>
                  <input type="number" min="0" value={store.deductibleLiabilities.immediateDueBills || ''} onChange={(e) => store.setDeductibleLiabilities({ immediateDueBills: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Current Month Debt Obligations</label>
                  <input type="number" min="0" value={store.deductibleLiabilities.currentMonthDebtObligations || ''} onChange={(e) => store.setDeductibleLiabilities({ currentMonthDebtObligations: parseFloat(e.target.value) || 0 })} onFocus={(e) => e.target.select()} className={inputClass} />
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column - Sticky Live Breakdown */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 w-full min-h-[520px] flex flex-col transition-all duration-300 ease-out">
              <div className={`w-full flex flex-col flex-1 ${isPaywallOpen ? '' : 'min-h-[520px] justify-between bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 shadow-2xl rounded-2xl p-6 animate-in fade-in zoom-in-98 duration-200'}`}>
                
                <div className={isPaywallOpen ? 'hidden' : 'block'}>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  Live Calculation Breakdown
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Gross Assets</span>
                    <span className="font-medium text-slate-200">{formatCurrency(breakdown.grossAssets, store.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-rose-400">
                    <span>Deductible Liabilities</span>
                    <span>- {formatCurrency(breakdown.deductibleLiabilities, store.currency)}</span>
                  </div>
                  <div className="h-px bg-slate-800 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Net Zakatable Pool</span>
                    <span className="font-semibold text-white text-lg">{formatCurrency(breakdown.zakatablePool, store.currency)}</span>
                  </div>
                </div>

                <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Nisab Threshold ({store.nisabMetal})</span>
                    <span className="text-xs font-medium text-slate-300">{formatCurrency(breakdown.nisabThreshold, store.currency)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${breakdown.isNisabReached ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${Math.min((breakdown.zakatablePool / (breakdown.nisabThreshold || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {breakdown.isNisabReached ? (
                    <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                      <CheckCircle2 size={16} /> Nisab Reached
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm text-amber-400 font-medium">
                      <AlertTriangle size={16} /> Below Nisab
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="text-sm text-slate-400 mb-1">Final Zakat Due</h4>
                  <div className="text-5xl font-extrabold text-emerald-400 tracking-tight">
                    {formatCurrency(breakdown.zakatDue, store.currency)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Calculated at {(breakdown.effectiveRate * 100).toFixed(3)}% rate
                  </div>
                </div>
              </div>

              <div className={isPaywallOpen ? 'w-full flex-1 flex flex-col' : ''}>
                <PDFDownloadButton isPaywallOpen={isPaywallOpen} onPaywallChange={setIsPaywallOpen} />
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Enhanced Modern Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-16 pt-8 pb-12 border-t border-white/5 flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-6">
          <a href="/privacy" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</a>
          <span className="text-slate-700 text-[10px]">•</span>
          <a href="/terms" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</a>
          <span className="text-slate-700 text-[10px]">•</span>
          <a href="/refund" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">Refund Policy</a>
        </div>
        <a href="mailto:zakatengine.help@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 text-xs text-slate-400 hover:text-emerald-400 transition-all mb-6">
          <Mail size={14} /> zakatengine.help@gmail.com
        </a>
        <div className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Modern Zakat Engine. All rights reserved.
        </div>
      </footer>
    </div>
    <FeedbackWidget />
    </>
  );
}
