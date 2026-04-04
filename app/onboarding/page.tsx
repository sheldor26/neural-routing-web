"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2, Zap, CheckCircle2, ArrowRight, Copy, Activity, AlertTriangle, ShieldCheck, Sparkles, Search, Cpu, Quote } from 'lucide-react';

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500; 
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
  const [analysisStep, setAnalysisStep] = useState(0); // 0: idle, 1: complexity, 2: decision
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);

  const API_BASE = "https://web-production-4f439.up.railway.app";

  const goToDashboard = async () => {
    if (!user) return;
    setGeneratingKey(true);
    try {
      await fetch(`${API_BASE}/v1/account/keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, label: 'Primary Key' }),
      });
    } catch {
      // If it fails (key already exists or network error), still go to dashboard
    } finally {
      router.push('/dashboard');
    }
  };

  const EXAMPLE_PROMPT = "Summarize this customer support ticket and extract the sentiment: 'My order #12345 hasn't arrived yet. I'm very frustrated because I paid for express shipping and it's been a week.'";

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
          session_id: "onboarding_ultimate_v10"
        })
      });
      const data = await response.json();
      
      setLoading(false);
      setAnalysisStep(1); // Analyzing complexity...
      
      setTimeout(() => {
        setAnalysisStep(2); // Routing to optimal model...
      }, 1000);

      setTimeout(() => {
        setResult(data);
        setAnalysisStep(0);
        setStep(2);
      }, 2000); 

    } catch (e) {
      console.error("Onboarding Error:", e);
      setLoading(false);
      setAnalysisStep(0);
    }
  };

  if (!isLoaded) return null;

  const rawSavings = result?.business_metrics?.savings_generated_usd || 0;
  const savingsValue = rawSavings * 100000;
  const savingsPercent = result?.business_metrics?.savings_percentage || 90;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                    <Activity size={12} className="text-blue-500" /> Infrastructure Node Active
                </div>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.85]">
                    See how much <br/> <span className="text-blue-600">you're losing.</span>
                </h1>
            </div>

            <div className="space-y-4">
                <div className="relative">
                  <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Paste a real prompt from your app..."
                      className="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-base focus:border-blue-500 outline-none transition-all placeholder:text-zinc-800 min-h-[180px] resize-none shadow-2xl font-mono"
                  />
                  {!prompt && (
                    <button onClick={() => setPrompt(EXAMPLE_PROMPT)} className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
                      <Sparkles size={12} className="text-blue-500" /> Try with example
                    </button>
                  )}
                </div>

                <button 
                    onClick={executeRealDispatch}
                    disabled={loading || analysisStep > 0 || !prompt.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)]"
                >
                    {loading ? (
                        <> <Loader2 className="animate-spin" size={18} /> <span>Auditing prompt...</span> </>
                    ) : analysisStep === 1 ? (
                        <> <Search className="animate-pulse" size={18} /> <span>Analyzing complexity...</span> </>
                    ) : analysisStep === 2 ? (
                        <> <Cpu className="animate-bounce" size={18} /> <span>Routing to optimal model...</span> </>
                    ) : (
                        <>Show My Savings <Zap size={18} className="fill-white" /></>
                    )}
                </button>
            </div>
            
            {/* SOCIAL PROOF REAL */}
            <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 bg-zinc-900/30 p-4 rounded-2xl border border-white/5">
                    <Quote size={16} className="text-blue-500" />
                    <p className="text-[10px] font-medium italic text-zinc-400">
                        "Reduced our AI bill by 72% in just 3 days" — <span className="text-zinc-200 font-black uppercase tracking-tighter">SaaS Founder</span>
                    </p>
                </div>
                <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest italic">
                    Trusted by 400+ teams optimizing AI costs daily.
                </p>
            </div>
          </div>
        )}

        {step === 2 && result && (
          <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Your Hidden <span className="text-red-500">AI Cost</span></h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Every day you wait = more money lost</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-12 text-center relative overflow-hidden group border-b-emerald-500/20">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-[length:200%_100%] animate-gradient" />
                
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-4">Current Monthly Leakage:</p>
                
                <div className="text-8xl font-black italic tracking-tighter text-white mb-4">
                    {savingsValue > 0 ? (
                      <AnimatedCounter value={savingsValue} />
                    ) : (
                      <span className="text-5xl text-blue-500 tracking-tight">OPTIMIZED</span>
                    )}
                </div>
                
                <div className="flex flex-col gap-3 items-center">
                  <div className="inline-flex px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    Based on scaling this request to 100k calls/month
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Cpu size={12} className="text-blue-400" />
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">
                      Result: {savingsValue > 0 ? 'Economy Node Selected' : 'High Efficiency Detected'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-3">
                    <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                        ↓ Save up to {Math.round(savingsPercent)}% with Intelligent Routing
                    </div>
                </div>
            </div>

            <div className="p-10 bg-blue-600 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1">Start Saving Now</h3>
                    <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest mb-6 opacity-90">
                      You can start saving on your next API call. No code changes.
                    </p>
                    
                    <button
                        onClick={goToDashboard}
                        disabled={generatingKey}
                        className="w-full py-6 bg-white text-blue-600 rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mb-4 shadow-xl disabled:opacity-80"
                    >
                        {generatingKey ? (
                          <><Loader2 size={20} className="animate-spin" /> Setting up your key...</>
                        ) : (
                          <>Get My API Key <ArrowRight size={20} /></>
                        )}
                    </button>
                    
                    <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200/60 italic">
                        OpenAI SDK Compatible • Setup &lt; 2 mins
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
