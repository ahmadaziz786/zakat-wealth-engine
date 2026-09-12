import * as XLSX from 'xlsx';
import { ZakatInput, ZakatBreakdown } from '@/lib/zakatEngine';

export function generateExcelLedger(state: ZakatInput, calculations: ZakatBreakdown) {
  const curr = state.currency;
  const fmt = (val: number) => `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const rows: any[][] = [];

  // Title Block
  rows.push(["ZAKAT & WEALTH TAX COMPUTATION LEDGER (AAOIFI Standard 35)"]);
  rows.push([]);

  // Metadata Block
  rows.push(["Metadata", "Details"]);
  rows.push(["Generation Date", new Date().toLocaleString()]);
  rows.push(["Hawl Date", state.hawlDate || "Not Set"]);
  rows.push(["Currency", state.currency]);
  rows.push(["Nisab Benchmark", state.nisabMetal.toUpperCase()]);
  rows.push(["Calendar Standard", state.calendarType === 'solar' ? "Solar (2.577%)" : "Lunar (2.5%)"]);
  rows.push([]);

  // Section A: Liquid & Bank Holdings
  rows.push(["SECTION A: LIQUID & BANK HOLDINGS"]);
  rows.push(["Asset Type", "Gross Value", "Zakatable %", "Zakatable Value"]);
  const cashTotal = state.liquidAssets.cashInHand + state.liquidAssets.bankChecking + state.liquidAssets.bankSavings;
  rows.push(["Cash in Hand", fmt(state.liquidAssets.cashInHand), "100%", fmt(state.liquidAssets.cashInHand)]);
  rows.push(["Bank Checking", fmt(state.liquidAssets.bankChecking), "100%", fmt(state.liquidAssets.bankChecking)]);
  rows.push(["Bank Savings", fmt(state.liquidAssets.bankSavings), "100%", fmt(state.liquidAssets.bankSavings)]);
  rows.push(["Section A Total", fmt(cashTotal), "", fmt(cashTotal)]);
  rows.push([]);

  // Section B: Bullion Assets
  rows.push(["SECTION B: BULLION ASSETS"]);
  rows.push(["Asset Type", "Gross Value", "Zakatable %", "Zakatable Value"]);
  const goldVal = state.preciousMetals.goldGrams * state.metalPrices.goldPerGram;
  const silverVal = state.preciousMetals.silverGrams * state.metalPrices.silverPerGram;
  rows.push([`Physical Gold (${state.preciousMetals.goldGrams}g @ ${fmt(state.metalPrices.goldPerGram)}/g)`, fmt(goldVal), "100%", fmt(goldVal)]);
  rows.push([`Physical Silver (${state.preciousMetals.silverGrams}g @ ${fmt(state.metalPrices.silverPerGram)}/g)`, fmt(silverVal), "100%", fmt(silverVal)]);
  rows.push(["Section B Total", fmt(goldVal + silverVal), "", fmt(goldVal + silverVal)]);
  rows.push([]);

  // Section C: Tech Equity & RSUs
  rows.push(["SECTION C: TECH EQUITY & RSUS (AAOIFI 35 compliant)"]);
  rows.push(["Asset Type", "Gross Value", "Zakatable %", "Zakatable Value", "Fiqh Rationale"]);
  const vestedRSU = state.modernEquities.vestedRSUsValue;
  const unvestedRSU = state.modernEquities.unvestedRSUsValue;
  const publicEq = state.modernEquities.tradingStocksMarketValue;
  const longEq = state.modernEquities.longTermHoldingsValue;
  rows.push(["Vested RSUs", fmt(vestedRSU), "100%", fmt(vestedRSU), "Milkiyyah Tammah (Complete Ownership)"]);
  rows.push(["Unvested RSUs", fmt(unvestedRSU), "0%", fmt(0), "Milk-e-Taam / Lack of Ownership"]);
  rows.push(["Public Trading Equities", fmt(publicEq), "100%", fmt(publicEq), "Liquid Capital"]);
  rows.push(["Long-Term Holdings", fmt(longEq), "25%", fmt(longEq * 0.25), "Working Capital Proxy (AAOIFI)"]);
  rows.push([]);

  // Section D: Deductible Short-Term Liabilities
  rows.push(["SECTION D: DEDUCTIBLE SHORT-TERM LIABILITIES"]);
  rows.push(["Liability Type", "Amount", "Deduction Applied"]);
  rows.push(["Immediate Due Bills", fmt(state.deductibleLiabilities.immediateDueBills), fmt(state.deductibleLiabilities.immediateDueBills)]);
  rows.push(["Current Month Debt Obligations", fmt(state.deductibleLiabilities.currentMonthDebtObligations), fmt(state.deductibleLiabilities.currentMonthDebtObligations)]);
  rows.push(["Section D Total", fmt(calculations.deductibleLiabilities), fmt(calculations.deductibleLiabilities)]);
  rows.push([]);

  // Section E: Final Computation Summary
  rows.push(["SECTION E: FINAL COMPUTATION SUMMARY"]);
  rows.push(["Metric", "Value"]);
  rows.push(["Gross Assets", fmt(calculations.grossAssets)]);
  rows.push(["Total Deductions", fmt(calculations.deductibleLiabilities)]);
  rows.push(["Net Zakatable Pool", fmt(calculations.zakatablePool)]);
  rows.push(["Nisab Threshold", fmt(calculations.nisabThreshold)]);
  rows.push(["Nisab Reached?", calculations.isNisabReached ? "YES" : "NO"]);
  rows.push(["Zakat Rate", `${(calculations.effectiveRate * 100).toFixed(3)}%`]);
  rows.push(["TOTAL ZAKAT DUE", fmt(calculations.zakatDue)]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 45 }, // A: Labels
    { wch: 25 }, // B: Gross Value
    { wch: 15 }, // C: %
    { wch: 25 }, // D: Zakatable Value
    { wch: 40 }, // E: Fiqh notes
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Zakat Audit Ledger");

  return wb;
}

export function downloadExcelLedger(state: ZakatInput, calculations: ZakatBreakdown) {
  const wb = generateExcelLedger(state, calculations);
  const fileName = `Zakat-Computation-Ledger-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
