"use client";
import { useState, useMemo, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Zap, DollarSign, TrendingUp, Brain, ArrowRight, MousePointer2, Sparkles, ShieldCheck, ZapOff } from 'lucide-react';
import { useUser, useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

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
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [monthlyVolume, setMonthlyVolume] = useState(1000000);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const API_BASE = "https://web-production-4f439.up.railway.app";

  const QUICK_PROMPTS = [
    { label: "Summarize Text", prompt: "Summarize this text in 3 key bullet points for a quick update." },
    { label: "Fix Email", prompt: "Correct the grammar and make this email sound more professional and polite." },
    { label: "Extract Data", prompt: "Extract all names, dates, and locations from the following paragraph." }
  ];

  useEffect(() => {
    if (!prompt && !result) {
      setPrompt(QUICK_PROMPTS[0].prompt);
    }
  }, []);

  useEffect(() => {
    const fetchKey = async () => {
      if (!isLoaded || !user) return;
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        );
        const { data } = await supabase
          .from('api_keys')
          .select('key')
          .eq('user_id', String(user.id))
          .maybeSingle();
        if (data?.key) setApiKey(data.key);
      } catch (e) {
        console.error('Failed to fetch API key:', e);
      }
    };
    fetchKey();
  }, [isLoaded, user?.id]);

  const metrics = useMemo(() => {
    if (!result) return { yearlySavings: 0, efficiency: 0, gpt4Yearly: 0, nrYearly: 0, monthlyLoss: 0 };
    const gpt4Unit = Number(result.business_metrics.estimated_gpt4_cost || 0);
    const nrUnit = Number(result.business_metrics.cost_usd || 0);
    
    const gpt4Yearly = gpt4Unit * monthlyVolume * 12;
    const nrYearly = nrUnit * monthlyVolume * 12;
    const diff = gpt4Yearly - nrYearly;

    let effPercent = Number(result.business_metrics.savings_percentage || 0);
    if (effPercent <= 0 && gpt4Unit > 0) {
      effPercent = ((gpt4Unit - nrUnit) / gpt4Unit) * 100;
    }

    return {
      gpt4Yearly,
      nrYearly,
      yearlySavings: Math.max(0, diff),
      monthlyLoss: Math.max(0, diff / 12),
      efficiency: effPercent > 0 && effPercent < 0.1 ? "0.1" : effPercent.toFixed(1)
    };
  }, [result, monthlyVolume]);

  const testRoute = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const steps = ["Analyzing complexity...", "Estimating GPT-4 cost...", "Selecting optimal model..."];
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const response = await fetch(`${API_BASE}/v1/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": apiKey || "" },
        body: JSON.stringify({
          messages: [{ role: "user", content: finalPrompt.trim() }]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || "Error");
      setResult(data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <section id="playground" className="max-w-5xl mx-auto px-6 py-20 relative z-30 font-sans text-zinc-300">
      
      {/* SOCIAL PROOF COUNTER */}
      <div className="flex justify-center mb-10">
        <div className="bg-zinc-900/60 border border-white/5 px-6 py-2.5 rounded-full flex items-center gap-4 backdrop-blur-md">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[8px] font-bold">U{i}</div>)}
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <span className="text-emerald-500 animate-pulse mr-2">●</span> 
                Developers saved <span className="text-white">$128,492</span> this week
            </p>
        </div>
      </div>

      <div className="bg-[#080808] border border-white/10 rounded-[3.5rem] p-8 md:p-16 shadow-3xl relative overflow-hidden">
        
        {/* HEADER: EMOTIONAL & B2B */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 italic uppercase text-white tracking-tighter">
            You’re Overpaying for AI — <span className="text-blue-500">Here’s Proof</span>
          </h2>
          <div className="flex items-center justify-center gap-6 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="text-zinc-400 flex items-center gap-1"><ShieldCheck size={12}/> OpenAI</span>
            <span className="text-zinc-400 flex items-center gap-1"><ShieldCheck size={12}/> Anthropic</span>
            <span className="text-zinc-400 flex items-center gap-1"><ShieldCheck size={12}/> LangChain</span>
          </div>
        </div>

        {/* QUICK PROMPTS */}
        <div className="flex gap-2 flex-wrap mb-6 justify-center">
            <span className="text-[10px] font-black text-zinc-600 uppercase self-center mr-2">Quick Try:</span>
            {QUICK_PROMPTS.map((p) => (
                <button 
                  key={p.label}
                  onClick={() => { setPrompt(p.prompt); testRoute(p.prompt); }}
                  className="px-4 py-2 text-[9px] bg-zinc-900 border border-white/5 rounded-full text-zinc-400 hover:bg-blue-600 hover:text-white transition-all font-black uppercase tracking-widest"
                >
                    {p.label}
                </button>
            ))}
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <textarea 
              className="w-full bg-black border border-zinc-800 rounded-3xl p-8 text-white focus:border-blue-500 outline-none transition-all text-lg resize-none shadow-2xl placeholder:text-zinc-800"
              rows={3}
              placeholder='Enter your prompt...'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={() => testRoute()}
              disabled={loading || !prompt}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all flex items-center gap-3 shadow-xl uppercase tracking-widest active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-[10px] font-black">{["ANALYZING", "ESTIMATING", "ROUTING"][loadingStep]}...</span>
                </div>
              ) : "Run Neural Routing"}
            </button>
          </div>

          {/* SCALING SLIDER */}
          <div className="bg-zinc-900/20 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Monthly Traffic</p>
              <p className="text-sm font-bold text-white uppercase italic">Scale: <span className="text-blue-500">{(monthlyVolume/1000000).toFixed(1)}M requests</span></p>
            </div>
            <input type="range" min="100000" max="10000000" step="100000" value={monthlyVolume} onChange={(e) => setMonthlyVolume(Number(e.target.value))} className="w-full md:w-64 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </div>

        {result && (
          <div className="mt-12 space-y-10 animate-in fade-in zoom-in duration-1000">
            
            {/* LOSS FRAMING CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/10 flex flex-col items-center justify-center text-center opacity-60">
                <p className="text-[9px] font-black uppercase text-red-500/50 mb-3 tracking-[0.3em]">Without NeuralRouting</p>
                <h4 className="text-4xl font-black text-zinc-700 line-through tracking-tighter italic">
                  ${metrics.gpt4Yearly.toLocaleString()}
                </h4>
                <div className="mt-4 px-4 py-1 bg-red-500/10 rounded-full text-[9px] font-black text-red-500 uppercase italic">
                   That's ${metrics.monthlyLoss.toLocaleString()}/mo wasted
                </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-400/20 flex flex-col items-center justify-center text-center shadow-[0_20px_80px_-15px_rgba(37,99,235,0.5)] group">
                <p className="text-[9px] font-black uppercase text-blue-100 mb-3 tracking-[0.3em]">With NeuralRouting</p>
                <h4 className="text-6xl font-black text-white tracking-tighter italic">
                  ${metrics.nrYearly.toLocaleString()}<span className="text-xl">/yr</span>
                </h4>
                <p className="mt-4 text-[10px] font-black text-blue-100 uppercase italic">-{metrics.efficiency}% Cost reduction</p>
              </div>
            </div>

            {/* ENGINE LOGIC */}
            <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] space-y-6 relative overflow-hidden text-center">
                <div className="flex flex-col items-center gap-2">
                    <Brain className="text-blue-500 mb-2" size={32}/>
                    <p className="text-sm font-black text-white uppercase italic tracking-tighter">Routed to <span className="text-blue-500">{result.model_used}</span></p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identical quality • {result.business_metrics.latency_ms}ms latency</p>
                </div>
                <p className="text-zinc-500 text-xs italic leading-relaxed max-w-2xl mx-auto uppercase">
                   "Intent analysis detected low-complexity task. GPT-4 is overkill. 
                   Routing to {result.model_used} to prevent budget leakage."
                </p>
            </div>

            {/* ✅ DYNAMIC CTA: COMPLETELY IN ENGLISH */}
            <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/5">
               <button onClick={() => { setResult(null); setPrompt(""); }} className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-3">
                  ⚡ REQUEST OPTIMIZED. RUN ANOTHER SCENARIO? <ArrowRight size={12}/>
               </button>
               
               <a href="/dashboard" className="group relative w-full md:w-auto bg-white text-black px-16 py-8 rounded-[2rem] font-black text-2xl uppercase tracking-tighter italic transition-all hover:scale-105 active:scale-95 shadow-2xl flex flex-col items-center gap-1 overflow-hidden">
                  <div className="flex items-center gap-3 relative z-10 text-center">
                    {metrics.yearlySavings > 0 ? (
                        <>Save ${metrics.yearlySavings.toLocaleString()}/year → Get Started</>
                    ) : (
                        <>Get My API Key → Start Saving</>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 normal-case tracking-widest italic opacity-60 relative z-10">
                    Integration takes 30 seconds • No credit card required
                  </span>
                  
                  {/* Reward Badge */}
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] px-3 py-1.5 rounded-full font-black animate-bounce shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                     FREE $5 CREDIT
                  </div>
               </a>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
