'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useZakatStore } from '@/store/useZakatStore';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [feedbackType, setFeedbackType] = useState('Suggestion');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const state = useZakatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackType,
          message,
          userEmail,
          currentInputs: state
        })
      });
      setToastMessage("Feedback received! JazakAllah Khair");
      setIsOpen(false);
      setMessage('');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-100 text-sm font-medium py-2.5 px-4 rounded-full shadow-lg shadow-black/40 flex items-center gap-2 transition-all hover:bg-slate-800"
      >
        <MessageSquare size={16} />
        Feedback / Fiqh Query
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/50 p-5 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" /> Let us know
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <select 
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option>Suggestion</option>
              <option>Calculation Error / Fiqh Query</option>
              <option>Bug</option>
            </select>
            
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What went wrong or what would you like to see?"
              rows={4}
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none"
            />
            
            <input 
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Your email (if you want a reply)"
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            />
            
            <button 
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mt-1"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Send
            </button>
          </form>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 text-slate-100 text-sm py-3 px-5 rounded-xl shadow-2xl shadow-emerald-950/50 flex items-center gap-3 w-fit">
            <div className="shrink-0 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
            <p className="flex-1 whitespace-nowrap">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
