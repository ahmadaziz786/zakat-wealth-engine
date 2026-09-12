import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><FileText size={32} /></div>
          <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
        </div>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>Last updated: September 2026</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing the Modern Zakat & Wealth Tax Engine, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Not Legal or Fatwa Advice</h2>
          <p>
            <strong>Computational Estimations Only.</strong> The calculations provided by this tool are strictly mathematical estimations based on standardized AAOIFI accounting proxies (e.g., 25% proxy on long-term equities). This tool does not provide formal legal, tax, or binding clerical fatwa advice. Always consult with a qualified religious scholar or certified public accountant for your specific tax and religious liabilities.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Service Reliability</h2>
          <p>
            While we strive for deterministic accuracy, the tool is provided &quot;as is&quot; without warranties of any kind. You assume total responsibility for the numbers generated and declared.
          </p>
        </div>
      </div>
    </div>
  );
}
