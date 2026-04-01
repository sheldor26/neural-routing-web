"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Cpu, TrendingUp, Loader2, Shield, Key, Copy, Eye, EyeOff, 
  CheckCircle2, History, Terminal, Sparkles, Play, MessageSquare, 
  Home, DollarSign, ExternalLink, Clock, MousePointer
} from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [apiData, setApiData] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [testPrompt, setTestPrompt] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [stats, setStats] = useState({ 
    savings: 0, requests: 0, opt_opportunity_usd: 0, last_requests: [] as any[]
  });

  const PRESETS = [
    { label: "Summarize", prompt: "Summarize this ticket: 'Customer is angry because shipping is delayed for order #99'" },
    { label: "Extract", prompt: "Extract name and city from: 'I am Juan and I live in Corrientes, Argentina'" }
  ];

  const API_BASE = "https://web-production-4f439.app.railway.app";
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
      // Actualización de logs en tiempo real
      setStats(prev => ({ ...prev, last_requests: [data, ...prev.last_requests.slice(0, 4)] }));
    } catch (e) { console.error(e); } finally { setTestLoading(false); }
  };

  const copyOutput = () => {
    if (testResult?.output?.ai_answer) {
      navigator.clipboard.writeText(testResult.output.ai_answer);
      setOutputCopied(true);
      setTimeout(() => setOutputCopied(false), 2000);
    }
  };

  if (!isLoaded || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3"><Zap size={20} className="text-blue-500" /><span className="text-xl font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span></Link>
            <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-8">
                <Link href="/" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Home</Link>
                <Link href="/pricing" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Pricing</Link>
                <Link href="/chat" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Neural Chat</Link>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        
        {/* HERO: OPTIMIZER & YEARLY SAVINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Live <span className="text-blue-600">Optimizer</span></h2>
                <div className="flex gap-2">
                    {PRESETS.map(p => (
                        <button key={p.label} onClick={() => setTestPrompt(p.prompt)} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-zinc-400">
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <textarea value={testPrompt} onChange={(e) => setTestPrompt(e.target.value)} placeholder="Paste your prompt here..." className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-6 text-sm font-mono focus:border-blue-500 outline-none min-h-[140px] resize-none" />
                <button onClick={runLiveTest} disabled={testLoading || !testPrompt.trim()} className="absolute bottom-4 right-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                    {testLoading ? <Loader2 size={14} className="animate-spin" /> : <><Play size={14} /> Run Test</>}
                </button>
            </div>

            {testResult && (
              <div className="animate-in zoom-in-95 duration-300 space-y-4">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase flex items-center gap-2 mb-1"><Sparkles size={12}/> Analysis Complete</p>
                        <p className="text-2xl font-black italic text-white uppercase leading-none">
                            Cost: ${testResult.business_metrics?.cost_usd?.toFixed(4) || "0.0009"} 
                            <span className="text-zinc-600 text-sm line-through ml-2">was ${testResult.business_metrics?.estimated_gpt4_cost?.toFixed(4) || "0.0150"}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase mb-1"><Clock size={12}/> Latency: {testResult.latency_ms}ms <span className="text-zinc-600 line-through">vs 1200ms</span></div>
                        <div className="px-4 py-1.5 bg-emerald-500 text-black text-[9px] font-black uppercase italic rounded-lg">-{testResult.business_metrics?.savings_percentage?.toFixed(0)}% Cheaper</div>
                    </div>
                </div>
                
                <div className="p-6 bg-black border border-zinc-800 rounded-2xl relative group">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Model Output ({testResult.model_used})</p>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium italic">{testResult.output?.ai_answer || "Intelligence verified. Check logs for raw data."}</p>
                    <button onClick={copyOutput} className="absolute top-4 right-4 p-2 bg-zinc-900 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-white">
                        {outputCopied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)]">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Projected Yearly Savings</span>
            <h3 className="text-7xl font-black italic text-white tracking-tighter">${(stats.opt_opportunity_usd * 12).toFixed(0)}</h3>
            <p className="text-[10px] font-black text-blue-900 uppercase">Based on ${stats.opt_opportunity_usd.toFixed(2)}/mo leakage</p>
            <Link href="/pricing" className="mt-4 px-8 py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Upgrade Capacity</Link>
          </div>
        </div>

        {/* ACCESS & INTEGRATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <h3 className="text-white font-black italic uppercase text-lg tracking-tight">Active <span className="text-blue-500">Node Access</span></h3>
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
                <h3 className="text-white font-black italic uppercase text-[10px] tracking-widest flex items-center gap-3"><Terminal size={16} className="text-zinc-500" /> Quick Setup</h3>
                <pre className="bg-black/40 p-5 rounded-2xl border border-white/5 text-[10px] font-mono text-zinc-500 overflow-x-auto">
{`const res = await fetch("https://neuralrouting.io/v1/dispatch", {
  method: "POST",
  headers: { "X-API-KEY": "${apiData?.key?.substring(0, 8) || "YOUR_KEY"}..." },
  body: JSON.stringify({ messages: [{ role: "user", content: "..." }] })
})`}
                </pre>
            </div>
        </div>

        {/* LOGS */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-10">
          <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-8 flex items-center gap-3"><History size={20} className="text-blue-500" /> Efficiency Log</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.last_requests.length > 0 ? stats.last_requests.map((req, i) => (
              <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4 group hover:border-blue-500/30 transition-all animate-in fade-in slide-in-from-left-2">
                <div>
                    <p className="text-[10px] font-black text-emerald-500">Saved +${req.business_metrics?.savings_generated_usd?.toFixed(3) || "0.001"}</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Cost: ${req.business_metrics?.cost_usd?.toFixed(4)}</p>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                   <p className="text-[9px] font-black text-blue-500 uppercase truncate">{req.model_used}</p>
                   <Clock size={10} className="text-zinc-700" />
                </div>
              </div>
            )) : (
              <div className="col-span-5 py-12 flex flex-col items-center gap-4 text-zinc-700 border-2 border-dashed border-white/5 rounded-3xl">
                  <MousePointer size={32} />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Run your first optimization to see savings</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
