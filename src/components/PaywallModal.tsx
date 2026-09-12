import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Lock, ShieldCheck, Loader2 } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (response?: any) => void;
}

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export function PaywallModal({ isOpen, onClose, onSuccess }: PaywallModalProps) {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.search.includes('dev=true'));

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);


  const handlePayment = async () => {
    if (activeTab === 'international') {
      setToastMessage("International Stripe integration goes live shortly. Please switch to Domestic (India) for instant UPI access, or reach out to zakatengine.help@gmail.com");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        setToastMessage('Razorpay SDK failed to load. Are you offline?');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/create-order', { method: 'POST' });
      const data = await response.json();

      if (!data.orderId) {
        setToastMessage('Failed to create order.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 29900,
        currency: "INR",
        name: "Modern Zakat Engine",
        description: "Official Wealth Audit & Tax Breakdown Report (AAOIFI Standard 35)",
        order_id: data.orderId,
        handler: function (response: any) {
          onSuccess(response);
          onClose();
        },
        prefill: {},
        theme: {
          color: "#059669"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setToastMessage('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      setToastMessage('Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="relative w-full min-h-[520px] bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl p-6 sm:p-7 flex flex-col justify-between text-left animate-in fade-in zoom-in-98 duration-200">
      <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full aspect-square flex items-center justify-center bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-all duration-200 active:scale-90 shadow-md z-20 focus:outline-none">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="flex flex-col items-center text-center mb-2">
        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-3">
          <Lock size={20} />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Official Wealth Audit & Tax Breakdown Report</h2>
        <p className="text-xs text-slate-400">Institutional-grade AAOIFI Fiqh standard breakdown suitable for wealth records and CA review.</p>
      </div>

      <div className="flex rounded-lg bg-slate-950 p-1 mb-2 border border-slate-800">
        <button 
          onClick={() => setActiveTab('domestic')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'domestic' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Domestic (India)
        </button>
        <button 
          onClick={() => setActiveTab('international')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'international' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          International
        </button>
      </div>

      <div className="mb-2 text-center">
        {activeTab === 'domestic' ? (
          <div className="animate-in fade-in flex flex-col items-center">
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-semibold mb-1 w-fit">
              Launch Special: Flat 70% Off
            </div>
            <div className="flex items-end justify-center gap-2 mb-1">
              <span className="line-through text-slate-500 text-sm pb-1">₹999</span>
              <span className="text-3xl font-extrabold text-emerald-400">₹299</span>
              <span className="text-xs font-normal text-slate-400 pb-1.5">(One-time)</span>
            </div>
            <div className="text-xs text-slate-500">Instant UPI / QR / NetBanking</div>
          </div>
        ) : (
          <div className="animate-in fade-in">
            <div className="text-3xl font-extrabold text-white mb-1">$19 <span className="text-xs font-normal text-slate-400">(One-time)</span></div>
            <div className="text-xs text-slate-500">Cards / Apple Pay / Google Pay</div>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-2 text-left">
        <div className="flex items-start gap-2">
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-300">Official AAOIFI-Compliant PDF Audit Report (Signed with SHA-256 Hash)</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-300">CA-Ready Editable Excel Ledger (.xlsx) with embedded formulas</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-300">Tranche-wise RSU & ESPP equity breakdown</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-300">Valid for annual wealth records and CA tax filing</span>
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShieldCheck size={16} />
            {activeTab === 'domestic' ? 'Unlock & Download Audit Pack • ₹299' : 'Unlock & Download Audit Pack • $19'}
          </>
        )}
      </button>

      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => {
            onSuccess({ isDevPreview: true });
            onClose();
          }}
          className="w-full mt-3 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors py-1 text-center"
        >
          [Dev Mode: Download Preview PDF]
        </button>
      )}
    </div>

    {toastMessage && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-10 fade-in duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 text-slate-100 text-sm py-3 px-5 rounded-xl shadow-2xl shadow-emerald-950/50 flex items-center gap-3 w-[90vw] max-w-md">
          <div className="shrink-0 text-amber-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="flex-1 leading-snug">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="shrink-0 p-1 text-slate-400 hover:text-white transition-colors focus:outline-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )}
    </>
  );
}
