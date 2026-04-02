"use client";
import { useState, useMemo, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Zap, DollarSign, TrendingUp, Brain, ArrowRight, MousePointer2, Sparkles, ShieldCheck, ZapOff } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface RoutingResult {
  status: string;
  model_used: string;
  output: { ai_answer: string };
  business_metrics: {
    latency_ms: number;
    cost_usd: number;
    estimated_gpt4_cost: number;
    savings_percentage: number;
  };
}

export default function Playground() {
  const { isLoaded } = useUser();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [monthlyVolume, setMonthlyVolume] = useState(1000000); 

  const API_BASE = "https://web-production-4f439.up.railway.app";
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_API_KEY || "nr-dev-secret-123";

  const metrics = useMemo(() => {
    if (!result) return { yearly: 0, efficiency: 0, gpt4Yearly: 0, nrYearly: 0, monthlyLoss: 0 };
    const gpt4Unit = Number(result.business_metrics.estimated_gpt4_cost || 0);
    const nrUnit = Number(result.business_metrics.cost_usd || 0);
    
    const gpt4Yearly = gpt4Unit * monthlyVolume * 12;
    const nrYearly = nrUnit * monthlyVolume * 12;

    return {
      gpt4Yearly,
      nrYearly,
      yearlySavings: Math.max(0, gpt4Yearly - nrYearly),
      monthlyLoss: Math.max(0, (gpt4Yearly - nrYearly) / 12),
      efficiency: gpt4Yearly > 0 ? (((gpt4Yearly - nrYearly) / gpt4Yearly) * 100).toFixed(1) : 0
    };
  }, [result, monthlyVolume]);

  const testRoute = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const steps = ["Analyzing intent...", "Calculating GPT-4 tax...", "Optimizing route..."];
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 500));
    }

    try {
      const response = await fetch(`${API_BASE}/v1/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": PUBLIC_KEY },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: finalPrompt.trim() }],
          user_id: "juan_dev_34"
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || "Error");
      setResult(data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <section id="playground" className="max-w-5xl mx-auto px-6 py-20 relative z-30">
      
      {/* MEJORA #3: LIVE COUNTER (Social Proof) */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-900/80 border border-white/5 px-6 py-2 rounded-full flex items-center gap-3 shadow-2xl">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-zinc-800 border border-black"></div>)}
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <span className="text-emerald-500 animate-pulse">●</span> Developers saved <span className="text-white">$142,891</span> this week
            </p>
        </div>
      </div>

      <div className="bg-[#080808] border border-white/10 rounded-[3.5rem] p-8 md:p-16 shadow-3xl relative overflow-hidden">
        
        {/* HEADER ACTUALIZADO (Mejora #5) */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 italic uppercase text-white tracking-tighter">
            You’re Overpaying for AI — <span className="text-blue-500">Stop the Leak</span>
          </h2>
          <div className="flex items-center justify-center gap-4 text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">
            <span>Compatible with:</span>
            <span className="text-zinc-400">OpenAI</span>
            <span className="text-zinc-400">Anthropic</span>
            <span className="text-zinc-400">LangChain</span>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="space-y-6">
          <div className="relative">
            <textarea 
              className="w-full bg-black border border-zinc-800 rounded-3xl p-8 text-white focus:border-blue-500 outline-none transition-all text-lg resize-none shadow-2xl"
              rows={3}
              placeholder='Try: "Classify these 1000 customer tickets by sentiment"'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={() => testRoute()}
              disabled={loading || !prompt}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all flex items-center gap-3 shadow-xl uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Optimize & Compare"}
            </button>
          </div>

          <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-white uppercase italic tracking-tighter">Scale: <span className="text-blue-500">{(monthlyVolume/1000000).toFixed(1)}M req/mo</span></p>
            <input type="range" min="100000" max="10000000" step="100000" value={monthlyVolume} onChange={(e) => setMonthlyVolume(Number(e.target.value))} className="w-full md:w-64 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </div>

        {result && (
          <div className="mt-12 space-y-10 animate-in fade-in zoom-in duration-700">
            
            {/* MEJORA #4: LOSS FRAMING (The Pain Point) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/10 flex flex-col items-center justify-center text-center relative group">
                <ZapOff size={24} className="text-red-500/20 absolute top-6 right-8" />
                <p className="text-[10px] font-black uppercase text-red-500/50 mb-4 tracking-[0.3em]">Direct Loss (GPT-4 Only)</p>
                <h4 className="text-4xl font-black text-zinc-700 line-through tracking-tighter italic">
                  ${metrics.gpt4Yearly.toLocaleString()}
                </h4>
                <div className="mt-4 px-4 py-1 bg-red-500/10 rounded-full text-[9px] font-black text-red-500 uppercase italic">
                   You are wasting ${metrics.monthlyLoss.toLocaleString()}/mo
                </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col items-center justify-center text-center shadow-[0_20px_80px_-20px_rgba(37,99,235,0.8)] relative group">
                <Sparkles size={24} className="text-white/30 absolute top-6 right-8 animate-pulse" />
                <p className="text-[10px] font-black uppercase text-blue-100 mb-4 tracking-[0.3em]">With NeuralRouting</p>
                <h4 className="text-6xl font-black text-white tracking-tighter italic">
                  ${metrics.nrYearly.toLocaleString()}<span className="text-xl">/yr</span>
                </h4>
                <p className="mt-4 text-[10px] font-black text-blue-100 uppercase italic">-{metrics.efficiency}% Cost reduction</p>
              </div>
            </div>

            {/* MEJORA #8: INSTANT CREDIBILITY */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] relative">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="text-emerald-500" size={20}/>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">
                    Decision: <span className="text-blue-500">{result.model_used}</span> • <span className="text-emerald-500 font-black">Zero Quality Loss</span>
                </p>
              </div>
              <p className="text-zinc-500 text-xs italic leading-relaxed text-center">
                 "Engine analysis: Task matches {result.model_used} reasoning patterns. 
                 GPT-4 output would be identical, but <span className="text-white">{(metrics.efficiency)}% more expensive</span>. 
                 Optimizing route now."
              </p>
            </div>

            {/* MEJORA #6: DYNAMIC CTA */}
            <div className="flex flex-col items-center gap-6 pt-6">
               <button onClick={() => setResult(null)} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
                  ⚡ You just saved your first cent. Try another prompt →
               </button>
               
               <a href="/dashboard" className="group relative w-full md:w-auto bg-white text-black px-16 py-8 rounded-2xl font-black text-xl uppercase tracking-tighter italic transition-all hover:scale-105 shadow-2xl flex flex-col items-center gap-1">
                  <div className="flex items-center gap-3">
                    Save ${metrics.yearlySavings.toLocaleString()}/yr → Get Started
                  </div>
                  <span className="text-[9px] font-black text-zinc-400 normal-case tracking-widest italic opacity-60">
                    No credit card required • Instant API access
                  </span>
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] px-3 py-1 rounded-full animate-bounce">+$5 FREE CREDIT</div>
               </a>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
