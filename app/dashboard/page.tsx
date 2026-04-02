"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
 Zap, Cpu, TrendingUp, Loader2, Shield, Key, Copy, Eye, EyeOff, 
 CheckCircle2, History, Terminal, Sparkles, Play, MessageSquare, 
 Home, DollarSign, ExternalLink, Clock, AlertCircle, ArrowRight, Code
} from 'lucide-react';
import { useUser, UserButton, useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Custom Notification State
  const [notification, setNotification] = useState<{msg: string, type: 'error' | 'success'} | null>(null);

  const [usageData, setUsageData] = useState({
    used: 0,
    max: 50000,
    planName: "Free Tier"
  });

  const [testPrompt, setTestPrompt] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [stats, setStats] = useState({ 
    savings: 0, requests: 0, opt_opportunity_usd: 0, last_requests: [] as any[]
  });

  const API_BASE = "https://web-production-4f439.up.railway.app";
  
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    async function loadData() {
      if (!isLoaded || !user || !mounted) return;
      try {
        setLoading(true);
        const token = await getToken({ template: 'supabase' });
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: dbData, error: dbError } = await supabase
          .from('api_keys')
          .select('key, plan') 
          .eq('user_id', String(user.id))
          .maybeSingle();
        
        if (dbError) throw dbError;

        const planLimits: { [key: string]: number } = {
          "Free Tier": 50000,
          "Starter": 1500000,
          "Growth": 5000000,
          "Business": 999999999 
        };

        if (dbData) {
          setApiData(dbData);
          const currentPlan = dbData.plan || "Free Tier";
          setUsageData(prev => ({
            ...prev,
            planName: currentPlan,
            max: planLimits[currentPlan] || 50000
          }));
        }

        const res = await fetch(`${API_BASE}/v1/user-stats/${user.id}`);

        if (res.ok) {
          const data = await res.json();
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            opt_opportunity_usd: Number(data.optimization_opportunity_usd || 0),
            last_requests: data.recent_decisions?.slice(0, 5) || []
          });
          setUsageData(prev => ({ ...prev, used: Number(data.total_tokens_consumed || 0) }));
        } else if (res.status === 404) {
          setStats({ savings: 0, requests: 0, opt_opportunity_usd: 0, last_requests: [] });
          setUsageData(prev => ({ ...prev, used: 0 }));
        }
      } catch (e) { 
        console.error("Dashboard Sync Error:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    loadData();
  }, [isLoaded, user, mounted, getToken]);

  const runLiveTest = async () => {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    setTestResult(null); 

    try {
      const res = await fetch(`${API_BASE}/v1/dispatch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': apiData?.key 
        },
        body: JSON.stringify({ 
            messages: [{ role: "user", content: testPrompt }], 
            session_id: "dashboard-test"
        })
      });

      const data = await res.json();

      if (res.status === 402) {
        setNotification({ msg: "Free Tier reached. Upgrade to continue.", type: 'error' });
        return;
      }

      if (!res.ok) throw new Error(data.details || data.error || `Error ${res.status}`);

      setTestResult(data);
      setNotification({ msg: "Route optimized successfully!", type: 'success' });
      setStats(prev => ({ 
        ...prev, 
        last_requests: [data, ...prev.last_requests.slice(0, 4)],
        savings: prev.savings + (data.business_metrics?.savings_usd || 0)
      }));
      setTimeout(() => setNotification(null), 4000);

    } catch (e: any) { 
      setNotification({ msg: e.message, type: 'error' });
    } finally { setTestLoading(false); }
  };

  if (!mounted || !isLoaded || loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40}/>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Securing Neural Channel...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24 selection:bg-blue-500/30">
      {/* NAVIGATION */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Zap size={20} className="text-blue-500 fill-blue-500" />
              <span className="text-xl font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest italic">You're saving +18% vs last week</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center justify-end gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Network Healthy
              </span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* ACTION FUNNEL */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/10">
            <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Step 1: Deployment</p>
                <h2 className="text-xl font-black italic text-white uppercase italic">Scale your savings to production</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                    Go to Production Setup <ArrowRight size={14}/>
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LIVE OPTIMIZER */}
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6 backdrop-blur-md">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">See how much you are <span className="text-blue-600">overpaying</span></h2>
                <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 animate-pulse bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <AlertCircle size={12}/> Loss Opportunity: ~${stats.opt_opportunity_usd.toFixed(2)}/mo
                </span>
            </div>

            <div className="relative">
                <textarea 
                  value={testPrompt} 
                  onChange={(e) => setTestPrompt(e.target.value)} 
                  placeholder="Paste a prompt to analyze cost efficiency..." 
                  className="w-full bg-black/60 border border-zinc-800 rounded-3xl p-8 text-sm font-mono focus:border-blue-500/50 outline-none min-h-[160px] resize-none transition-all" 
                />
                <button 
                  onClick={runLiveTest} 
                  disabled={testLoading || !testPrompt.trim()} 
                  className="absolute bottom-4 right-4 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                >
                    {testLoading ? <Loader2 size={14} className="animate-spin" /> : "Optimize This Request"}
                </button>
            </div>

            {testResult && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-3 w-full text-center md:text-left">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Routing Result: {testResult.model_used}</p>
                      <div className="flex items-end justify-center md:justify-start gap-3">
                        <p className="text-3xl font-black italic text-white uppercase tracking-tighter">
                          Cost: ${testResult.business_metrics?.cost_usd?.toFixed(5)} 
                        </p>
                        <span className="text-zinc-600 text-sm line-through mb-1 font-bold">vs ${testResult.business_metrics?.estimated_gpt4_cost?.toFixed(5)}</span>
                      </div>
                  </div>
                  <div className="px-6 py-3 bg-emerald-500 text-black text-[10px] font-black uppercase italic rounded-xl shadow-lg shadow-emerald-500/20 font-bold">
                     Saved {testResult.business_metrics?.savings_percentage?.toFixed(1)}%
                  </div>
              </div>
            )}
          </div>

          {/* TOTAL SAVINGS CARD */}
          <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_80px_-20px_rgba(37,99,235,0.5)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <TrendingUp size={160} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 z-10 italic">Accumulated Savings</span>
            <h3 className="text-7xl font-black italic text-white tracking-tighter z-10">${stats.savings.toFixed(2)}</h3>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest z-10 opacity-70">Total value saved by Neuralrouting</p>
            <button className="mt-4 w-full py-5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors z-10 font-bold">
                Maximize My Savings →
            </button>
          </div>
        </div>

        {/* USAGE & CREDENTIALS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 space-y-6 shadow-inner">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-black italic uppercase text-lg tracking-tight">Usage <span className="text-blue-600">& Limits</span></h3>
                    <Sparkles size={18} className="text-blue-500 animate-pulse" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                        <span>{usageData.used.toLocaleString()} Requests used</span>
                        <span className={usageData.used > usageData.max * 0.9 ? "text-red-500" : "text-emerald-500"}>
                            {usageData.planName === "Business" ? "Unlimited Access" : `${((usageData.used / usageData.max) * 100).toFixed(1)}% of plan`}
                        </span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000" style={{ width: `${usageData.planName === "Business" ? 100 : Math.min((usageData.used / usageData.max) * 100, 100)}%` }} />
                    </div>
                </div>
                <button className="w-full py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all font-bold">
                    Upgrade to avoid throttling →
                </button>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-inner">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-black italic uppercase text-lg tracking-tight">Ready to <span className="text-blue-600">Integrate</span></h3>
                  <button className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-2 hover:underline font-bold">
                    View Docs <ExternalLink size={12}/>
                  </button>
                </div>
                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest italic">Secret Production Key</span>
                      <span className="text-zinc-200 font-mono text-xs tracking-widest">
                        {showKey ? (apiData?.key || "No Key Found") : "•".repeat(32)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowKey(!showKey)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                          {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(apiData?.key || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`p-3 rounded-xl transition-all ${copied ? "bg-emerald-500 text-black" : "bg-zinc-800 text-blue-500 hover:bg-blue-600 hover:text-white"}`}>
                            {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* RECENT OPTIMIZATIONS */}
        <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-10 space-y-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <History size={20} className="text-blue-600" />
              <h3 className="text-white font-black italic uppercase text-lg tracking-tight italic">Recent <span className="text-blue-600">Optimizations</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.last_requests.map((req, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col gap-2 group hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-blue-500 uppercase italic">{req.model_used}</span>
                            <span className="text-[9px] font-black text-emerald-500">-{req.business_metrics?.savings_percentage?.toFixed(1)}% cost</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-zinc-500">Optimized Cost:</span>
                            <span className="text-white font-bold">${req.business_metrics?.cost_usd?.toFixed(5)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* NEURAL NOTIFICATION SYSTEM */}
        {notification && (
          <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-5 duration-300">
            <div className={`p-[1px] rounded-2xl bg-gradient-to-br ${notification.type === 'error' ? 'from-red-500/50 to-transparent' : 'from-blue-500/50 to-transparent shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]'}`}>
              <div className="bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl px-6 py-4 flex items-center gap-4 border border-white/5">
                <div className={`p-2 rounded-full ${notification.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {notification.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}
                </div>
                <div className="flex flex-col pr-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Neural Message</span>
                  <span className="text-xs font-bold text-white tracking-tight leading-tight">{notification.msg}</span>
                </div>
                <button onClick={() => setNotification(null)} className="text-zinc-700 hover:text-white transition-colors">
                  <Code size={14} className="rotate-45" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}