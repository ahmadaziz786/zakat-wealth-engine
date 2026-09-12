'use client';

import React, { useMemo, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Download, Loader2, Lock } from 'lucide-react';
import { ZakatPDFDocument } from './ZakatPDFDocument';
import { useZakatStore } from '@/store/useZakatStore';
import { calculateZakat } from '@/lib/zakatEngine';
import { PaywallModal } from './PaywallModal';

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
  const [hasPaid, setHasPaid] = useState(false);
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
  }, []);

  if (!mounted) {
    return <FallbackButton />;
  }

  const handleSuccess = async (response?: any) => {
    setHasPaid(true);
    // Try to trigger synchronously so browser doesn't block it
    if (downloadWrapperRef.current) {
      const link = downloadWrapperRef.current.querySelector('a');
      if (link) {
         link.click();
      }
    }

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
      {/* We always render the PDF engine hidden in the DOM so the blob is pre-built */}
      <div className={hasPaid ? "block" : "hidden"} ref={downloadWrapperRef}>
        <PDFDownloadLink
          document={<ZakatPDFDocument state={state} breakdown={breakdown} />}
          fileName={`Zakat_Audit_Report_${new Date().getFullYear()}${isDev ? '_PREVIEW' : ''}.pdf`}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-400 font-semibold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
        >
          {({ loading }: any) => (
            loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating PDF...
              </>
            ) : (
              <>
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                Download Unlocked Report Again
              </>
            )
          )}
        </PDFDownloadLink>
      </div>

      {!hasPaid && !isOpen && (
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

      {isOpen && !hasPaid && (
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
