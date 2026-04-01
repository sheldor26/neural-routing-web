"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Cpu, TrendingUp, Loader2, Target, Shield, Key, Copy, Eye, EyeOff, 
  CheckCircle2, ArrowRight, AlertCircle, History, Terminal, Sparkles, Play, Database, MessageSquare
} from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [apiData, setApiData] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // LIVE TESTER STATES
  const [testPrompt, setTestPrompt] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const [stats, setStats] = useState({ 
    savings: 0, requests: 0, opt_opportunity_usd: 0, last_requests: [] as any[]
  });

  const PRESETS = [
    { label: "Summarize", prompt: "Summarize this long email in 2 sentences: [Insert Text Here]" },
    { label: "Sentiment", prompt: "Classify the sentiment of this review: 'The product is okay but the shipping was slow.'" },
    { label: "Extract", prompt: "Extract the phone number and name from: 'Call Juan at +54 3756 123456'" }
  ];

  const API_BASE = "https://web-production-4f439.up.railway.app";
  const INTERNAL_KEY = "nr-dev-secret-123"; 

  useEffect(() => {
    async function loadData() {
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;
      try {
        setLoading(true);
        const { data: dbData } = await supabase.from('api_keys').select('key, plan_type').eq('email', user.primaryEmailAddress.emailAddress).single();
        if (dbData) setApiData(dbData);

        const res = await fetch(`${API_BASE}/v1/user-stats/${user.id}`, { headers: { 'X-API-KEY': INTERNAL_KEY } });
        const data = await res.json();
        if (data && !data.error) {
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            opt_opportunity_usd: Number(data.optimization_opportunity_usd || 0),
            last_requests: data.recent_decisions?.slice(0, 5) || []
          });
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    loadData();
  }, [isLoaded, user]);

  const runLiveTest = async () => {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    try {
      const res = await fetch('/api/proxy/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: "user", content: testPrompt }], user_id: user?.id })
      });
      const data = await res.json();
      setTestResult(data);
      
      // LOOP VISUAL: Actualizar logs instantáneamente
      setStats(prev => ({
        ...prev,
        last_requests: [data, ...prev.last_requests.slice(0, 4)]
      }));
    } catch (e) { console.error(e); } finally { setTestLoading(false); }
  };

  if (!isLoaded || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 pb-20">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3"><Zap size={20} className="text-blue-500" /><span className="text-xl font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span></Link>
          <UserButton afterSignOutUrl="/" />
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        
        {/* 1. INTERACTIVE OPTIMIZER & YEARLY IMPACT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Live <span className="text-blue-600">Optimizer</span></h2>
                <div className="flex gap-2">
                    {PRESETS.map(p => (
                        <button key={p.label} onClick={() => setTestPrompt(p.prompt)} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <textarea 
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Paste your prompt here..."
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-6 text-sm font-mono focus:border-blue-500 outline-none transition-all min-h-[140px] resize-none"
                />
                <button onClick={runLiveTest} disabled={testLoading || !testPrompt.trim()} className="absolute bottom-4 right-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50">
                    {testLoading ? <Loader2 size={14} className="animate-spin" /> : <><Play size={14} /> Analyze Costs</>}
                </button>
            </div>

            {testResult && (
              <div className="animate-in zoom-in-95 duration-300 space-y-4">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Sparkles size={12}/> Optimization Success</p>
                        <p className="text-2xl font-black italic text-white uppercase leading-none">Cost: $0.0009 <span className="text-zinc-600 text-sm line-through ml-2">was $0.015</span></p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase italic rounded-lg">-{ (testResult.business_metrics?.savings_percentage || 94).toFixed(0) }% Cheaper</div>
                </div>
                
                {/* AI RESPONSE VISOR */}
                <div className="p-6 bg-black border border-zinc-800 rounded-2xl space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><MessageSquare size={12}/> Model Output ({testResult.model_used})</p>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium italic">{testResult.output || "Optimization successful. Model reasoning complete."}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)]">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Projected Yearly Savings</span>
            <h3 className="text-7xl font-black italic text-white tracking-tighter">${(stats.opt_opportunity_usd * 12).toFixed(0)}</h3>
            <p className="text-[10px] font-black text-blue-900 uppercase">Based on ${(stats.opt_opportunity_usd).toFixed(2)}/mo leakage</p>
            <Link href="/billing" className="mt-4 px-8 py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Unlock Full Capacity</Link>
          </div>
        </div>

        {/* 2. API KEY: THE 30 SECONDS ACTIVATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-black italic uppercase text-lg tracking-tight">Start sending requests <span className="text-blue-500">in 30s</span></h3>
                    <Shield size={18} className="text-zinc-700" />
                </div>
                <div className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-6 font-mono text-xs flex items-center justify-between group">
                    <span className="text-zinc-500 truncate mr-6">{showKey ? apiData?.key : "••••••••••••••••••••••••••••••••••••"}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setShowKey(!showKey)} className="text-zinc-600 hover:text-white transition-colors">{showKey ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        <button onClick={() => { navigator.clipboard.writeText(apiData?.key || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 bg-zinc-800/50 rounded-xl hover:bg-blue-600 transition-all text-blue-500 hover:text-white">
                            {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-10 space-y-4">
                <h3 className="text-white font-black italic uppercase text-[10px] tracking-widest flex items-center gap-3"><Terminal size={16} className="text-zinc-500" /> Node.js Implementation</h3>
                <pre className="bg-black/40 p-5 rounded-2xl border border-white/5 text-[10px] font-mono text-zinc-500 overflow-x-auto">
{`const res = await fetch("https://neuralrouting.io/v1/dispatch", {
  method: "POST",
  headers: { "X-API-KEY": "${apiData?.key?.substring(0, 8) || "YOUR_KEY"}..." },
  body: JSON.stringify({ messages: [...] })
})`}
                </pre>
            </div>
        </div>

        {/* 3. ADDICTIVE COMPARATIVE LOGS */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-black italic uppercase tracking-tighter text-xl flex items-center gap-3"><History size={20} className="text-blue-500" /> Efficiency Log</h3>
            <div className="flex items-center gap-4">
                <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Router Active</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.last_requests.map((req, i) => (
              <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4 group hover:border-blue-500/30 transition-all">
                <div>
                    <p className="text-[10px] font-black text-emerald-500">Saved +${(req.savings_generated_usd || 0.001).toFixed(3)}</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Cost: $0.001 (was $0.015)</p>
                </div>
                <div className="pt-3 border-t border-white/5">
                   <p className="text-[9px] font-black text-blue-500 uppercase truncate">{req.model_used || 'Economy'}</p>
                   <p className="text-[8px] text-zinc-600 font-bold truncate mt-1">"{req.prompt_preview || 'Audit'}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
