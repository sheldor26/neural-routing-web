"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Zap, CheckCircle2, ArrowRight, TrendingDown, DollarSign } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const startMagic = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    // Simulamos la latencia de pensamiento para que el usuario aprecie el "trabajo" del router
    await new Promise(r => setTimeout(r, 2200));
    setStep(2);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="max-w-xl w-full relative">
        
        {/* EFECTO DE LUZ DE FONDO */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                    <Zap size={12} className="fill-blue-500" /> System Activation
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.9]">
                    Let's save your <br/> <span className="text-blue-600">first dollar.</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium italic max-w-sm mx-auto">
                    Send a real prompt you use in your app. We'll show you how much you're overpaying right now.
                </p>
            </div>

            <div className="space-y-4">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Categorize these 50 customer reviews by sentiment..."
                    className="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-base focus:border-blue-500 outline-none transition-all placeholder:text-zinc-900 min-h-[160px] resize-none shadow-2xl font-medium"
                />
                <button 
                    onClick={startMagic}
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-20 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Analyzing Complexity...</span>
                        </>
                    ) : (
                        <>Analyze My Request <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
            <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingDown size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
                    Optimization <span className="text-emerald-500">Found.</span>
                </h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Router Decision: Llama 3.1 (Economy Tier)</p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-6 bg-zinc-900/40 border border-white/5 rounded-3xl opacity-50">
                    <span className="text-[10px] font-black uppercase text-zinc-500">Your Current Cost (GPT-4o)</span>
                    <span className="text-lg font-bold text-white line-through">$0.0150</span>
                </div>
                <div className="flex items-center justify-between p-8 bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[2.5rem] shadow-lg shadow-emerald-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 px-3 py-1 text-[8px] font-black text-black uppercase -rotate-12 translate-x-2">94% Cheaper</div>
                    <span className="text-[10px] font-black uppercase text-emerald-500">Neural Node Cost</span>
                    <span className="text-3xl font-black text-white italic">$0.0009</span>
                </div>
            </div>

            <div className="pt-6 space-y-4">
                <div className="p-6 bg-blue-600 rounded-3xl text-center shadow-2xl shadow-blue-500/20">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1">Total Impact Prediction</h3>
                    <p className="text-xs text-blue-100 italic mb-4 opacity-80">Based on 100k requests/mo</p>
                    <div className="text-4xl font-black italic tracking-tighter mb-6">+$1,410 / mo</div>
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-4 bg-white text-blue-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        Claim My API Key <ArrowRight size={14} />
                    </button>
                </div>
                <p className="text-center text-[9px] font-bold text-zinc-700 uppercase tracking-[0.3em]">No credit card required to start.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}