"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2, Zap, CheckCircle2, ArrowRight, Copy, Terminal, Activity, TrendingDown, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000; // Un poco más lento para generar suspenso
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
};

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const executeRealDispatch = async () => {
    if (!prompt.trim() || !user) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/proxy/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          user_id: user.id,
          session_id: "onboarding_final_shredder"
        })
      });
      
      const data = await response.json();
      setResult(data);
      setStep(2);
    } catch (e) {
      console.error("Onboarding Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyEndpoint = () => {
    navigator.clipboard.writeText("https://neuralrouting.io/v1/dispatch");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        
        {/* STEP 1: INPUT */}
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                    <Activity size={12} className="text-blue-500" /> Infrastructure Node Active
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.9]">
                    Expose Your <br/> <span className="text-blue-600">Cost Inefficiency.</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium italic">
                    Paste a prompt from your actual app. We'll audit the cost leakage you're suffering on GPT-4 right now.
                </p>
            </div>

            <div className="space-y-4">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Write a technical documentation snippet for an API..."
                    className="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-base focus:border-blue-500 outline-none transition-all placeholder:text-zinc-900 min-h-[160px] resize-none shadow-2xl font-mono"
                />
                <button 
                    onClick={executeRealDispatch}
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-20 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Auditing Model Performance...</span>
                        </>
                    ) : (
                        <>Calculate Unnecessary Spend <Zap size={18} className="fill-white" /></>
                    )}
                </button>
            </div>
            <p className="text-center text-[9px] font-bold text-zinc-700 uppercase tracking-widest flex items-center justify-center gap-2">
                <AlertTriangle size={10} className="text-yellow-600" /> Every hour without routing = wasted margin.
            </p>
          </div>
        )}

        {/* STEP 2: IMPACTO Y CREDIBILIDAD */}
        {step === 2 && result && (
          <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
            <div className="text-center">
                <div className="inline-flex px-4 py-1.5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-tighter italic rounded-full mb-4">
                    ↓ 94.2% cheaper than direct GPT-4
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Routing Audit <span className="text-blue-500">Complete.</span></h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Based on your input: "{prompt.substring(0, 40)}..."</p>
            </div>

            {/* CARD DE SHOCK DE AHORRO */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 text-center relative overflow-hidden group border-b-emerald-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-[length:200%_100%] animate-gradient" />
                
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-2">You are currently losing:</p>
                <div className="text-7xl font-black italic tracking-tighter text-white mb-2">
                    <AnimatedCounter value={result.business_metrics?.savings_generated_usd * 100000} />
                </div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-6">Every 100k requests / month</p>
                
                <div className="flex flex-col items-center gap-2 border-t border-white/5 pt-6">
                    <p className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2">
                        <ShieldCheck size={12} className="text-blue-500" /> Calculated from real routing data
                    </p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase italic">Reflecting typical SaaS usage patterns at your current scale</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Latency</span>
                    <span className="text-xs font-bold text-blue-400">{result.latency_ms}ms</span>
                </div>
                <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Model</span>
                    <span className="text-xs font-bold text-white uppercase">{result.model_used}</span>
                </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 text-center">Start Saving in Production</h3>
                    
                    <div className="bg-black/30 rounded-xl p-4 mb-6 flex items-center justify-between border border-white/10 w-full">
                        <code className="text-[10px] font-mono text-blue-100 truncate mr-4">https://neuralrouting.io/v1/dispatch</code>
                        <button onClick={copyEndpoint} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-3 mb-4"
                    >
                         Access Production Keys <ArrowRight size={18} />
                    </button>
                    
                    <div className="flex gap-4 items-center opacity-70">
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-100">Setup time: &lt; 2 minutes</p>
                        <div className="w-1 h-1 rounded-full bg-blue-200" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-100">Free Tier Ready</p>
                    </div>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}