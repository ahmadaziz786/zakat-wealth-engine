import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><RefreshCw size={32} /></div>
          <h1 className="text-4xl font-extrabold text-white">Refund Policy</h1>
        </div>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>Last updated: September 2026</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Digital Goods Return Policy</h2>
          <p>
            As our primary offerings (such as Certified Wealth Audit Reports) are immediately accessible digital goods, we adhere to a standard digital refund policy to protect against abuse while ensuring customer satisfaction.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7-Day Technical Guarantee</h2>
          <p>
            We offer a full 100% refund within 7 days of purchase if you experience verifiable technical issues that prevent the core functionality of the engine, such as the inability to generate or download your PDF audit reports. 
          </p>
          <p>
            To request a refund under these conditions, please contact our support team at zakatengine.help@gmail.com with details of the technical error.
          </p>
        </div>
      </div>
    </div>
  );
}
