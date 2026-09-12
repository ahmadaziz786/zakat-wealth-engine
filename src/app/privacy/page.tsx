import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><ShieldCheck size={32} /></div>
          <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
        </div>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>Last updated: September 2026</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Zero-Knowledge Architecture</h2>
          <p>
            The Modern Zakat & Wealth Tax Engine operates strictly on a zero-knowledge, client-side architecture. We do not store, log, transmit, or monetize any of your financial data, portfolio sizes, or personal wealth information.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Local Processing</h2>
          <p>
            All calculations, data inputs, and PDF exports are processed entirely within your browser's local memory. The moment you close the tab, your session data is destroyed. No database backend receives your financial inputs.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Third-Party Services</h2>
          <p>
            We may use standardized payment gateways (e.g., Stripe) for premium feature transactions. These processors operate independently and securely, and we do not intercept or store your payment credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
