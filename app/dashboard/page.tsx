"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Cpu, TrendingUp, Loader2, Shield, Key, Copy, Eye, EyeOff, 
  CheckCircle2, History, Terminal, Sparkles, Play, MessageSquare, 
  Home, DollarSign, ExternalLink, Clock, AlertCircle, ArrowRight, Code
} from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [testPrompt, setTestPrompt] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [stats, setStats] = useState({ 
    savings: 0, requests: 0, opt_opportunity_usd: 0, last_requests: [] as any[]
  });

  const API_BASE = "https://web-production-4f439.up.railway.app";
  const INTERNAL_KEY = "nr-dev-secret-123"; 

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!isLoaded || !user || !mounted) return;
      try {
        setLoading(true);
        
        // Match Table Editor structure: user_id, key, plan
        // Attempting to match the development user_id seen in your DB screenshot
        const { data: dbData, error: dbError } = await supabase
          .from('api_keys')
          .select('key, plan') 
          .or(`user_id.eq.${user.id},user_id.eq.juan_dev_34`) // Try real ID or Dev ID
          .limit(1)
          .maybeSingle();
        
        if (dbError) console.error("Supabase Error:", dbError.message);
        if (dbData) setApiData(dbData);

        // Fetch Stats - Using Dev ID if real stats aren't found yet
        const fetchId = user.id || "juan_dev_34";
        const res = await fetch(`${API_BASE}/v1/user-stats/${fetchId}`, { 
            headers: { 'X-API-KEY': INTERNAL_KEY } 
        });

        if (res.ok) {
          const data = await res.json();
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            opt_opportunity_usd: Number(data.optimization_opportunity_usd || 0),
            last_requests: data.recent_decisions?.slice(0, 5) || []
          });
        }
      } catch (e) { 
        console.error("Dashboard Sync Error:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    loadData();
  }, [isLoaded, user, mounted]);

  const runLiveTest = async () => {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    setTestResult(null); 

    try {
      const res = await fetch('/api/proxy/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [{ role: "user", content: testPrompt }], 
            user_id: user?.id || "juan_dev_34" 
        })
      });

      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || `Server Error: ${res.status}`);
      }

      const data = await res.json();
      setTestResult(data);
      setStats(prev => ({ ...prev, last_requests: [data, ...prev.last_requests.slice(0, 4)] }));
    } catch (e: any) { 
      console.error("Test Error:", e);
      alert(`Optimization failed: ${e.message}`);
    } finally { 
      setTestLoading(false); 
    }
  };

  if (!mounted || !isLoaded || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3"><Zap size={20} className="text-blue-500" /><span className="text-xl font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span></Link>
          </div>
          <UserButton afterSignOutUrl="/" />
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Step 2: Connect Your App</p>
                <h2 className="text-xl font-black italic text-white uppercase italic">Stop the leakage in 30 seconds</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {["Copy API Key", "Replace Base URL", "Save Money"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-400 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                        <span className="text-blue-500">{i+1}.</span> {text}
                    </div>
                ))}
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Live <span className="text-blue-600">Optimizer</span></h2>
                <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 animate-pulse">
                    <AlertCircle size={12}/> Overpaying ~${stats.opt_opportunity_usd.toFixed(2)}/mo right now
                </span>
            </div>

            <div className="relative">
                <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 ml-2 italic">Paste a real request from your app</p>
                <textarea value={testPrompt} onChange={(e) => setTestPrompt(e.target.value)} placeholder="e.g. Summarize this customer ticket..." className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-6 text-sm font-mono focus:border-blue-500 outline-none min-h-[140px] resize-none" />
                <button onClick={runLiveTest} disabled={testLoading || !testPrompt.trim()} className="absolute bottom-4 right-4 px-8 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
                    {testLoading ? <Loader2 size={14} className="animate-spin" /> : "Run Optimization Audit"}
                </button>
            </div>

            {testResult && (
              <div className="animate-in zoom-in-95 duration-300 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex justify-between items-center">
                  <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-1"><Sparkles size={12}/> Result Found</p>
                      <p className="text-2xl font-black italic text-white uppercase leading-none">
                        Cost: ${testResult.business_metrics?.cost_usd?.toFixed(4) || "0.0000"} 
                        <span className="text-zinc-600 text-sm line-through ml-2">vs ${testResult.business_metrics?.estimated_gpt4_cost?.toFixed(4) || "0.0000"}</span>
                      </p>
                  </div>
                  <div className="text-right">
                      <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Latency: {testResult.latency_ms || 0}ms</p>
                      <div className="px-4 py-1.5 bg-emerald-500 text-black text-[9px] font-black uppercase italic rounded-lg">-{testResult.business_metrics?.savings_percentage?.toFixed(0) || 0}% Savings</div>
                  </div>
              </div>
            )}
          </div>

          <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] group">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Total Yearly Potential</span>
            <h3 className="text-7xl font-black italic text-white tracking-tighter">${(stats.opt_opportunity_usd * 12).toFixed(0)}</h3>
            <button className="mt-4 w-full py-4 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Connect My App → (30s)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <h3 className="text-white font-black italic uppercase text-lg tracking-tight">Your API <span className="text-blue-500">Key</span></h3>
                <div className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-6 font-mono text-xs flex items-center justify-between group">
                    <span className="text-zinc-400 truncate mr-6">{showKey ? apiData?.key : "••••••••••••••••••••••••••••••••••••"}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setShowKey(!showKey)} className="text-zinc-600 hover:text-white transition-colors">{showKey ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        <button onClick={() => { navigator.clipboard.writeText(apiData?.key || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 bg-zinc-800/50 rounded-xl hover:bg-blue-600 transition-all text-blue-500 hover:text-white">
                            {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-10 space-y-4">
                <h3 className="text-white font-black italic uppercase text-[10px] tracking-widest flex items-center gap-3"><Terminal size={16} className="text-zinc-500" /> Integration Snippet</h3>
                <pre className="bg-black/40 p-5 rounded-2xl border border-white/5 text-[10px] font-mono text-zinc-500 overflow-x-auto">
{`const res = await fetch("https://neuralrouting.io/v1/dispatch", {
  method: "POST",
  headers: { "X-API-KEY": "${apiData?.key?.substring(0, 8) || "YOUR_KEY"}..." },
  body: JSON.stringify({ messages: [{ role: "user", content: "..." }] })
})`}
                </pre>
            </div>
        </div>
      </main>
    </div>
  );
}
