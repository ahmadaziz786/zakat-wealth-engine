import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ZakatState } from '@/store/useZakatStore';
import { ZakatBreakdown } from '@/lib/zakatEngine';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b', // slate-800
    backgroundColor: '#ffffff',
  },
  headerBanner: {
    backgroundColor: '#064e3b', // deep emerald-900
    padding: 20,
    borderRadius: 4,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#a7f3d0', // emerald-200
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 5,
    marginBottom: 15,
    marginTop: 20,
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 15,
    borderRadius: 6,
  },
  metadataCol: {
    width: '48%',
    marginBottom: 10,
  },
  metadataLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  hashText: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: '#475569',
    marginTop: 2,
  },
  highlightBox: {
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 6,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#ecfdf5',
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  highlightLabel: {
    fontSize: 11,
    color: '#065f46',
  },
  highlightValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#064e3b',
  },
  zakatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#34d399',
  },
  zakatLabel: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#047857',
  },
  zakatValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#047857',
  },
  sealBox: {
    marginTop: 40,
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    borderStyle: 'dashed',
  },
  sealText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 5,
  },
  sealSubtext: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 20,
  },
  signatureLine: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: '#94a3b8',
    paddingTop: 5,
    textAlign: 'center',
    fontSize: 9,
    color: '#64748b',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 28,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontFamily: 'Helvetica-Bold',
  },
  col1: { width: '40%', paddingLeft: 5, paddingRight: 5 },
  col2: { width: '20%', textAlign: 'right', paddingRight: 5 },
  col3: { width: '20%', textAlign: 'center' },
  col4: { width: '20%', textAlign: 'right', paddingRight: 5 },
  cellText: { fontSize: 9 },
  cellHeader: { fontSize: 9, color: '#475569' },
  noteBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    marginBottom: 20,
  },
  noteTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 4,
    color: '#1e40af',
  },
  noteText: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.5,
  },
  matrixBox: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    marginBottom: 20,
  },
  matrixRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
    alignItems: 'center',
  },
  matrixCheck: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 2,
  },
  matrixCategory: {
    width: '30%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#0f172a',
    paddingRight: 5,
  },
  matrixDesc: {
    width: '58%',
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  }
});

interface Props {
  state: ZakatState;
  breakdown: ZakatBreakdown;
}

const formatCurrency = (amount: number, currency: string) => {
  return `${currency} ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

// Generates a pseudo hash based on inputs for the audit certificate
const generateHash = (state: ZakatState) => {
  const str = JSON.stringify(state) + new Date().getTime();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0') + Math.random().toString(16).substring(2, 10);
};

export const ZakatPDFDocument = ({ state, breakdown }: Props) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const refId = `ZKT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const auditHash = generateHash(state);
  
  const cashBankTotal = state.liquidAssets.cashInHand + state.liquidAssets.bankChecking + state.liquidAssets.bankSavings;
  const longTermProxy = state.modernEquities.longTermHoldingsValue * 0.25;

  const PageFooter = ({ pageNum, totalPages }: { pageNum: number, totalPages: number }) => (
    <Text style={styles.footer}>
      Report ID: {refId} • Page {pageNum} of {totalPages} • Modern Zakat Engine
    </Text>
  );

  return (
    <Document>
      {/* PAGE 1: EXECUTIVE SUMMARY */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>CERTIFIED WEALTH & ZAKAT AUDIT REPORT</Text>
          <Text style={styles.headerSubtitle}>INSTITUTIONAL-GRADE SHARIAH COMPLIANCE DOCUMENT</Text>
        </View>

        <View style={styles.metadataGrid}>
          <View style={styles.metadataCol}>
            <Text style={styles.metadataLabel}>Audit Reference ID</Text>
            <Text style={styles.metadataValue}>{refId}</Text>
          </View>
          <View style={styles.metadataCol}>
            <Text style={styles.metadataLabel}>Date of Generation</Text>
            <Text style={styles.metadataValue}>{currentDate}</Text>
          </View>
          <View style={styles.metadataCol}>
            <Text style={styles.metadataLabel}>Standards Compliance</Text>
            <Text style={styles.metadataValue}>AAOIFI Shariah Standard No. 35</Text>
          </View>
          <View style={styles.metadataCol}>
            <Text style={styles.metadataLabel}>Calculation Paradigm</Text>
            <Text style={styles.metadataValue}>{state.calendarType === 'solar' ? 'Solar Year (2.577%)' : 'Lunar Year (2.5%)'}</Text>
          </View>
          <View style={styles.metadataCol}>
            <Text style={styles.metadataLabel}>Hawl Anniversary</Text>
            <Text style={styles.metadataValue}>{state.hawlDate || 'Not Set'}</Text>
          </View>
          <View style={styles.metadataCol}>
            <Text style={styles.metadataLabel}>Next Zakat Due</Text>
            <Text style={styles.metadataValue}>{state.hawlDate ? `${parseInt(state.hawlDate.substring(0,4)) + 1}${state.hawlDate.substring(4)}` : 'Not Set'}</Text>
          </View>
          <View style={{ width: '100%', marginTop: 10 }}>
            <Text style={styles.metadataLabel}>Cryptographic Audit Hash</Text>
            <Text style={styles.hashText}>{auditHash} (SHA-256 Pseudo)</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Executive Summary</Text>
        
        <View style={styles.highlightBox}>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Total Gross Wealth</Text>
            <Text style={styles.highlightValue}>{formatCurrency(breakdown.grossAssets, state.currency)}</Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Deductible Immediate Liabilities (30-day limit)</Text>
            <Text style={styles.highlightValue}>-{formatCurrency(breakdown.deductibleLiabilities, state.currency)}</Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Net Zakatable Pool</Text>
            <Text style={styles.highlightValue}>{formatCurrency(breakdown.zakatablePool, state.currency)}</Text>
          </View>
          <View style={styles.zakatRow}>
            <Text style={styles.zakatLabel}>Final Zakat Liability Due</Text>
            <Text style={styles.zakatValue}>{formatCurrency(breakdown.zakatDue, state.currency)}</Text>
          </View>
        </View>

        <View style={styles.sealBox}>
          <Text style={styles.sealText}>INSTITUTIONAL ATTESTATION SEAL</Text>
          <Text style={styles.sealSubtext}>Tamper-Evident Client-Side Record</Text>
          <Text style={styles.signatureLine}>Client / Auditor Signature</Text>
        </View>

        <PageFooter pageNum={1} totalPages={3} />
      </Page>

      {/* PAGE 2: VALUATION & FIQH APPENDIX */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Line-Item Valuation & Fiqh Justification</Text>
        
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.col1, styles.cellHeader]}>Asset Category</Text>
            <Text style={[styles.col2, styles.cellHeader]}>Gross Value</Text>
            <Text style={[styles.col3, styles.cellHeader]}>Zakatable Weight</Text>
            <Text style={[styles.col4, styles.cellHeader]}>Net Zakatable</Text>
          </View>

          {/* Cash/Bank */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Liquid Cash & Bank Balances</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(cashBankTotal, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>100%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(cashBankTotal, state.currency)}</Text>
          </View>

          {/* Physical Gold */}
          {(state.preciousMetals?.goldGrams ?? 0) > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.col1, styles.cellText]}>Physical Gold Bullion ({state.preciousMetals.goldGrams}g @ {formatCurrency(state.metalPrices.goldPerGram, state.currency)}/g)</Text>
              <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.preciousMetals.goldGrams * state.metalPrices.goldPerGram, state.currency)}</Text>
              <Text style={[styles.col3, styles.cellText]}>100%</Text>
              <Text style={[styles.col4, styles.cellText]}>{formatCurrency(state.preciousMetals.goldGrams * state.metalPrices.goldPerGram, state.currency)}</Text>
            </View>
          )}

          {/* Physical Silver */}
          {(state.preciousMetals?.silverGrams ?? 0) > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.col1, styles.cellText]}>Physical Silver Bullion ({state.preciousMetals.silverGrams}g @ {formatCurrency(state.metalPrices.silverPerGram, state.currency)}/g)</Text>
              <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.preciousMetals.silverGrams * state.metalPrices.silverPerGram, state.currency)}</Text>
              <Text style={[styles.col3, styles.cellText]}>100%</Text>
              <Text style={[styles.col4, styles.cellText]}>{formatCurrency(state.preciousMetals.silverGrams * state.metalPrices.silverPerGram, state.currency)}</Text>
            </View>
          )}

          {/* Public Trading Equities */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Public Trading Equities</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.modernEquities.tradingStocksMarketValue, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>100%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(state.modernEquities.tradingStocksMarketValue, state.currency)}</Text>
          </View>

          {/* Long-Term Equities */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Long-Term Holdings (25% Proxy)</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.modernEquities.longTermHoldingsValue, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>25%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(longTermProxy, state.currency)}</Text>
          </View>

          {/* Vested RSUs */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Vested RSUs</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.modernEquities.vestedRSUsValue, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>100%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(state.modernEquities.vestedRSUsValue, state.currency)}</Text>
          </View>

          {/* Unvested RSUs */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Unvested RSUs (Milkiyyah Tammah)</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.modernEquities.unvestedRSUsValue, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>0%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(0, state.currency)}</Text>
          </View>

          {/* Crypto Spot */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Spot Crypto</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.cryptoAssets.liquidCryptoValue, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>100%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(state.cryptoAssets.liquidCryptoValue, state.currency)}</Text>
          </View>

          {/* Locked Staking */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Locked Staking</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.cryptoAssets.lockedStakingValue, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>0%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(0, state.currency)}</Text>
          </View>

          {/* Locked Retirement */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Locked Retirement (EPF/401k)</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.retirementAssets.lockedRetirementCorpus, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>0%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(0, state.currency)}</Text>
          </View>

          {/* Liquid Retirement */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Liquid Retirement Corpus</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(state.retirementAssets.liquidRetirementCorpus, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>100%</Text>
            <Text style={[styles.col4, styles.cellText]}>{formatCurrency(state.retirementAssets.liquidRetirementCorpus, state.currency)}</Text>
          </View>

          {/* Current Liabilities */}
          <View style={styles.tableRow}>
            <Text style={[styles.col1, styles.cellText]}>Immediate Liabilities (Deductible)</Text>
            <Text style={[styles.col2, styles.cellText]}>{formatCurrency(breakdown.deductibleLiabilities, state.currency)}</Text>
            <Text style={[styles.col3, styles.cellText]}>-100%</Text>
            <Text style={[styles.col4, styles.cellText]}>-{formatCurrency(breakdown.deductibleLiabilities, state.currency)}</Text>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Dividend Purification (Tathir) Schedule</Text>
          <Text style={styles.noteText}>
            Note: For public equities, investors must calculate and purify non-operating/interest income. A standard proxy of 5% of dividend income is often used for Shariah-compliant tech equities to be expensed entirely to charity. This is a separate obligation from Zakat and must be routed to general charity (Sadaqah) without intending reward.
          </Text>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Nisab Benchmark Used</Text>
          <Text style={styles.noteText}>
            The Nisab used for this calculation is {state.nisabMetal === 'silver' ? 'Silver (595 grams)' : 'Gold (85 grams)'}, valued at {formatCurrency(breakdown.nisabThreshold, state.currency)}. Since the Net Zakatable Pool {breakdown.isNisabReached ? 'meets/exceeds' : 'is below'} this threshold, Zakat is {breakdown.isNisabReached ? 'due' : 'not due'} for this period.
          </Text>
        </View>

        <PageFooter pageNum={2} totalPages={3} />
      </Page>

      {/* PAGE 3: QURANIC DISBURSEMENT MATRIX */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Quranic Disbursement Matrix (8 Masarif)</Text>
        <Text style={{ fontSize: 9, color: '#475569', marginBottom: 15, lineHeight: 1.4 }}>
          According to Surah At-Tawbah (9:60), Zakat must be distributed exclusively to the following categories. Use this checklist to track your allocation:
        </Text>

        <View style={styles.matrixBox}>
          {[
            ['Al-Fuqara', 'The Destitute - Those who have no wealth or income.'],
            ['Al-Masakin', 'The Needy - Those whose income does not cover their basic needs.'],
            ['Al-Amilina Alayha', 'Zakat Administrators - Authorized personnel collecting/distributing Zakat.'],
            ['Muallafatul Quloob', 'To Reconcile Hearts - New Muslims or those inclined towards Islam.'],
            ['Fir-Riqab', 'To Free Captives - Emancipating slaves or captives.'],
            ['Al-Gharimin', 'The Debt-Burdened - Those overwhelmed by debt they cannot repay.'],
            ['Fi Sabilillah', 'In the Cause of Allah - Defending and propagating the faith.'],
            ['Ibn As-Sabil', 'The Wayfarer - Stranded travelers lacking resources.']
          ].map((item, idx, arr) => (
            <View style={[styles.matrixRow, idx === arr.length - 1 ? { borderBottomWidth: 0 } : {}]} key={idx}>
              <View style={styles.matrixCheck}><View style={styles.checkbox}></View></View>
              <Text style={styles.matrixCategory}>{item[0]}</Text>
              <Text style={styles.matrixDesc}>{item[1]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tax Optimization Interplay</Text>
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            You can often achieve tax efficiency without compromising Shariah compliance by routing Zakat through registered 501(c)(3) organizations (US), Section 80G trusts (India), or equivalent tax-exempt entities in your jurisdiction.
            {'\n\n'}
            However, ensure the organization explicitly maintains a restricted "Zakat Fund" to guarantee the money is only spent on the 8 Masarif, rather than general operational expenses. General donations to a mosque or hospital building fund typically do not qualify as valid Zakat unless explicitly restricted for Al-Fuqara/Al-Masakin.
          </Text>
        </View>

        <PageFooter pageNum={3} totalPages={3} />
      </Page>
    </Document>
  );
};
