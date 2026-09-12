'use client';

import React, { useMemo, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Download, Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { ZakatPDFDocument } from './ZakatPDFDocument';
import { useZakatStore } from '@/store/useZakatStore';
import { calculateZakat } from '@/lib/zakatEngine';
import { PaywallModal } from './PaywallModal';
import { downloadExcelLedger } from '@/utils/exportExcelLedger';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <FallbackButton /> }
);

function FallbackButton() {
  return (
    <button disabled className="w-full bg-slate-800 text-slate-400 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
      <Loader2 size={18} className="animate-spin" />
      Loading PDF Engine...
    </button>
  );
}

interface PDFDownloadButtonProps {
  isPaywallOpen?: boolean;
  onPaywallChange?: (isOpen: boolean) => void;
}

export default function PDFDownloadButton({ isPaywallOpen, onPaywallChange }: PDFDownloadButtonProps) {
  const state = useZakatStore();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = onPaywallChange ? isPaywallOpen : internalIsOpen;
  const setIsOpen = onPaywallChange || setInternalIsOpen;
  const downloadWrapperRef = useRef<HTMLDivElement>(null);
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.search.includes('dev=true'));
  
  const breakdown = useMemo(() => {
    return calculateZakat({
      currency: state.currency,
      calendarType: state.calendarType,
      nisabMetal: state.nisabMetal,
      metalPrices: state.metalPrices,
      liquidAssets: state.liquidAssets,
      modernEquities: state.modernEquities,
      cryptoAssets: state.cryptoAssets,
      preciousMetals: state.preciousMetals,
      retirementAssets: state.retirementAssets,
      hawlDate: state.hawlDate,
      deductibleLiabilities: state.deductibleLiabilities,
    });
  }, [
    state.currency,
    state.calendarType,
    state.nisabMetal,
    state.metalPrices,
    state.liquidAssets,
    state.modernEquities,
    state.cryptoAssets,
    state.preciousMetals,
    state.retirementAssets,
    state.hawlDate,
    state.deductibleLiabilities,
  ]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    try {
      const session = localStorage.getItem('zakat_unlocked_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed?.isUnlocked) {
          state.setUnlocked(true);
        }
      }
    } catch (e) {}
  }, []);

  if (!mounted) {
    return <FallbackButton />;
  }

  const handleSuccess = async (response?: any) => {
    state.setUnlocked(true);
    try {
      localStorage.setItem('zakat_unlocked_session', JSON.stringify({ isUnlocked: true, timestamp: Date.now() }));
    } catch (e) {}

    if (response?.isDevPreview) {
      return;
    }

    // Prompt for email if razorpay_email not present
    let userEmail = response?.razorpay_email;
    if (!userEmail) {
      userEmail = window.prompt("Enter email address to receive PDF backup copy:");
    }

    if (userEmail) {
      try {
        const { pdf } = await import('@react-pdf/renderer');
        const asPdf = pdf(<ZakatPDFDocument state={state} breakdown={breakdown} />);
        const blob = await asPdf.toBlob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = (reader.result as string).split(',')[1];
          const finalZakatFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: state.currency, maximumFractionDigits: 0 }).format(breakdown.zakatDue);
          
          await fetch('/api/send-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userEmail,
              pdfBase64: base64data,
              auditId: `ZKT-${new Date().getFullYear()}-AUTO`, 
              finalZakat: finalZakatFormatted
            })
          });
        };
      } catch (err) {
        console.error("Failed to email report:", err);
      }
    }
  };

  return (
    <>
      {state.isUnlocked && (
        <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-emerald-500/30 rounded-2xl shadow-2xl mt-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2 animate-pulse">
            <CheckCircle2 size={14} />
            Payment Confirmed • Audit Hash Generated
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-3 mt-2">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Audit Pack Unlocked!</h3>
          <p className="text-xs text-slate-400 text-center mb-6">Your certified AAOIFI computation documents are ready for download.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <PDFDownloadLink
              document={<ZakatPDFDocument state={state} breakdown={breakdown} />}
              fileName={`Zakat_Audit_Report_${new Date().getFullYear()}${isDev ? '_PREVIEW' : ''}.pdf`}
              className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-center"
            >
              {({ loading }: any) => (
                loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    📄 Download Certified PDF
                  </>
                )
              )}
            </PDFDownloadLink>
            
            <button 
              onClick={() => downloadExcelLedger(state, breakdown)}
              className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              📊 Download CA Excel (.xlsx)
            </button>
          </div>
        </div>
      )}

      {!state.isUnlocked && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-3 w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold shadow-lg shadow-emerald-950/50 transition-all duration-200 cursor-pointer mt-4"
        >
          <Lock size={20} strokeWidth={2.5} className="w-5 h-5 shrink-0 text-white" />
          <span className="text-sm sm:text-base font-bold leading-tight text-center tracking-tight">
            Download Certified Wealth Audit Report (PDF)
          </span>
        </button>
      )}

      {isOpen && !state.isUnlocked && (
        <div className="mt-4">
          <PaywallModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </>
  );
}
