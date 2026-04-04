"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
 Zap, Cpu, TrendingUp, Loader2, Shield, Key, Copy, Eye, EyeOff, 
 CheckCircle2, History, Terminal, Sparkles, Play, MessageSquare, 
 Home, DollarSign, ExternalLink, Clock, AlertCircle, ArrowRight, Code
} from 'lucide-react';
import { useUser, UserButton, useAuth } from '@clerk/nextjs';
import { createAuthClient } from '@/lib/supabase';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingKey, setGeneratingKey] = useState(false);

  const [notification, setNotification] = useState<{msg: string, type: 'error' | 'success'} | null>(null);

  const API_BASE = "https://web-production-4f439.up.railway.app";

  const generateApiKey = async () => {
    if (!user) return;
    setGeneratingKey(true);
    try {
      const res = await fetch(`${API_BASE}/v1/account/keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, label: 'Primary Key' }),
      });
      if (!res.ok) throw new Error('Could not generate key');
      const data = await res.json();
      setApiData({ key: data.key, plan: 'free' });
      setNotification({ msg: 'API Key generated successfully!', type: 'success' });
    } catch (e: any) {
      setNotification({ msg: e.message, type: 'error' });
    } finally {
      setGeneratingKey(false);
    }
  };

  const PLAN_CREDITS: Record<string, number> = {
    "Free Tier": 5_000, "free": 5_000,
    "Starter": 50_000, "starter": 50_000,
    "Growth": 200_000, "growth": 200_000,
    "Business": 1_000_000, "business": 1_000_000,
  };
  const PLAN_COLOR: Record<string, string> = {
    "Free Tier": "text-zinc-400", "Starter": "text-blue-400",
    "Growth": "text-purple-400", "Business": "text-amber-400",
  };

  const [usageData, setUsageData] = useState({
    used: 0,
    creditsBalance: 0,
    creditsLimit: 5000,
    planName: "Free Tier",
  });

  const [testPrompt, setTestPrompt] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [streamingText, setStreamingText] = useState("");
  const [stats, setStats] = useState({ 
    savings: 0, requests: 0, opt_opportunity_usd: 0, last_requests: [] as any[]
  });

  useEffect(() => { setMounted(true); }, []);
useEffect(() => {
    const loadData = async () => {
      if (!isLoaded || !user || !mounted) return;

      try {
        setLoading(true);

        // 1. Obtener Token y Conectar Supabase para la API KEY
        const token = await getToken({ template: 'supabase' });
        const supabase = createAuthClient(token!);

        const { data: dbData } = await supabase
          .from('api_keys')
          .select('key, plan') 
          .eq('user_id', String(user.id))
          .maybeSingle();
        
        if (dbData) setApiData(dbData);

        // 2. Pedir Estadísticas a Railway (Ahorros acumulados e Historial)
        const res = await fetch(`${API_BASE}/v1/user-stats/${user.id}`, {
          headers: { 'X-API-KEY': dbData?.key || '' }
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("📊 DATOS CRUDOS DE RAILWAY:", data);

          // Sincronizar Ahorros y Cuadros de Abajo
          const planName = data.plan || "Free Tier";
          // Handle legacy USD credits (< 1000) by converting to credit units
          const rawCredits = Number(data.credits || 0);
          const creditsBalance = rawCredits < 1000 ? Math.round(rawCredits * 1000) : Math.round(rawCredits);
          const creditsLimit = PLAN_CREDITS[planName] || 5000;

          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            opt_opportunity_usd: Number(data.optimization_opportunity_usd || 0),
            last_requests: Array.isArray(data.recent_decisions)
              ? data.recent_decisions.map((log: any) => ({
                  model_used: log.model_used || "Neural-Router",
                  savings_percentage: log.savings_percentage || 0,
                  credits_used: log.credits_used || 0,
                  credit_tier: log.credit_tier || "budget",
                }))
              : []
          });

          setUsageData({
            used: Number(data.requests_count || 0),
            creditsBalance,
            creditsLimit,
            planName,
          });
        }
      } catch (e) {
        console.error("❌ Error en la carga del Dashboard:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoaded, user?.id, mounted, getToken]);

  const runLiveTest = async () => {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    setTestResult(null);
    setStreamingText("");

    try {
      const res = await fetch(`${API_BASE}/v1/dispatch/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiData?.key,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: testPrompt }],
          session_id: "dashboard-test",
        }),
      });

      if (res.status === 402) {
        setNotification({ msg: "Insufficient balance. Please upgrade.", type: 'error' });
        return;
      }
      if (!res.ok || !res.body) throw new Error(`Error ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let billingData: any = null;
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.object === "nr.billing") {
              billingData = parsed;
            } else {
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                accumulated += content;
                setStreamingText(accumulated);
              }
            }
          } catch { /* partial chunk, ignore */ }
        }
      }

      if (billingData) {
        const fin = billingData.financials ?? {};
        const billed    = fin.billed_price ?? 0;
        const gpt4ref   = fin.gpt4o_reference ?? 0;
        const savingsPct = gpt4ref > 0 ? ((gpt4ref - billed) / gpt4ref) * 100 : 0;

        const result = {
          model_used: billingData.model_used,
          business_metrics: {
            cost_usd:            billed,
            estimated_gpt4_cost: gpt4ref,
            savings_percentage:  savingsPct,
          },
        };
        setTestResult(result);
        setNotification({ msg: "Route optimized successfully!", type: 'success' });

        const newSavings = Math.max(gpt4ref - billed, 0);
        setStats(prev => ({
          ...prev,
          last_requests: [
            { model_used: billingData.model_used, savings_percentage: savingsPct, cost_usd: billed },
            ...prev.last_requests.slice(0, 4),
          ],
          savings:  prev.savings + newSavings,
          requests: prev.requests + 1,
        }));
        setUsageData(prev => ({ ...prev, used: prev.used + 1 }));
        setTimeout(() => setNotification(null), 4000);
      }

    } catch (e: any) {
      setNotification({ msg: e.message, type: 'error' });
    } finally {
      setTestLoading(false);
    }
  };

  console.log('[Dashboard] mounted:', mounted, '| isLoaded:', isLoaded, '| loading:', loading, '| user:', user?.id ?? 'null');

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
          <div className="flex items-center gap-3">
            <Link href="/" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Home</Link>
            <Link href="/pricing" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Pricing</Link>
            <Link href="/chat" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Chat</Link>
            <Link href="/workflows" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Workflows</Link>
            <Link href="/analytics" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Analytics</Link>
            <Link href="/logs" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Logs</Link>
            <UserButton afterSignOutUrl="/" />
          </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* ACTION FUNNEL */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/10">
            <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Step 1: Deployment</p>
                <h2 className="text-xl font-black italic text-white uppercase">Scale your savings to production</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <Link href="/setup" className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 font-bold">
                    Go to Production Setup <ArrowRight size={14}/>
                </Link>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LIVE OPTIMIZER */}
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6 backdrop-blur-md">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">See how much you are <span className="text-blue-600">overpaying</span></h2>
                {stats.requests > 0 && (
                  <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 animate-pulse bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <AlertCircle size={12}/> Loss Opportunity: ~${stats.opt_opportunity_usd.toFixed(2)}/mo
                  </span>
                )}
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
                  className="absolute bottom-4 right-4 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 font-bold"
                >
                    {testLoading ? <Loader2 size={14} className="animate-spin" /> : "Optimize This Request"}
                </button>
            </div>

            {(testLoading && streamingText) && (
              <div className="animate-in fade-in duration-300 p-6 bg-zinc-900/60 border border-zinc-800 rounded-[2rem]">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Streaming response...</p>
                <p className="text-sm text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {streamingText}<span className="inline-block w-1.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
                </p>
              </div>
            )}

            {testResult && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-[2rem]">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Response</p>
                  <p className="text-sm text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">{streamingText}</p>
                </div>
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6">
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
              </div>
            )}
          </div>

          {/* TOTAL SAVINGS CARD */}
          <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_80px_-20px_rgba(37,99,235,0.5)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <TrendingUp size={160} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 z-10 italic">Accumulated Savings</span>
            {!loading && stats.savings === 0 ? (
              <p className="text-xl font-black italic text-white tracking-tight z-10 px-4">
                Your first saving is one request away
              </p>
            ) : (
              <h3 className="text-7xl font-black italic text-white tracking-tighter z-10">
                {loading ? <Loader2 className="animate-spin" size={40} /> : `$${stats.savings.toFixed(2)}`}
              </h3>
            )}
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest z-10 opacity-70 italic">Total value saved by Neuralrouting</p>
            <Link href="/pricing" className="mt-4 block w-full py-5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors z-10 text-center">
                Maximize My Savings →
            </Link>
          </div>
        </div>

        {/* USAGE & CREDENTIALS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 space-y-6 shadow-inner">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-black italic uppercase text-lg tracking-tighter">Credits <span className="text-blue-600">& Plan</span></h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      usageData.planName === "Business" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" :
                      usageData.planName === "Growth"   ? "border-purple-500/30 bg-purple-500/10 text-purple-400" :
                      usageData.planName === "Starter"  ? "border-blue-500/30 bg-blue-500/10 text-blue-400" :
                      "border-white/10 bg-white/5 text-zinc-400"
                    }`}>{usageData.planName}</span>
                </div>
                <div className="space-y-4">
                    {/* Credits balance */}
                    <div className="flex justify-between items-baseline">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Credits Remaining</span>
                        <span className="text-2xl font-black text-white italic tracking-tighter">
                          {usageData.creditsBalance.toLocaleString()}
                          <span className="text-[9px] text-zinc-600 not-italic font-bold ml-1">/ {usageData.creditsLimit.toLocaleString()}</span>
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full transition-all duration-1000 ease-out rounded-full ${
                            usageData.creditsBalance / usageData.creditsLimit < 0.2
                              ? "bg-gradient-to-r from-red-600 to-red-400"
                              : "bg-gradient-to-r from-blue-600 to-blue-400"
                          }`}
                          style={{ width: `${Math.min(100, (usageData.creditsBalance / usageData.creditsLimit) * 100)}%` }}
                        />
                    </div>
                    {/* Credit tier legend */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: "Budget", cost: "1 cr / 1K", color: "text-emerald-400", note: "Llama 3" },
                        { label: "Medium", cost: "10 cr / 1K", color: "text-blue-400", note: "GPT-4o mini" },
                        { label: "Premium", cost: "100 cr / 1K", color: "text-purple-400", note: "GPT-4o" },
                      ].map(t => (
                        <div key={t.label} className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                          <span className={`text-[8px] font-black uppercase block ${t.color}`}>{t.label}</span>
                          <span className="text-[9px] font-bold text-white block mt-0.5">{t.cost}</span>
                          <span className="text-[7px] text-zinc-600 uppercase">{t.note}</span>
                        </div>
                      ))}
                    </div>
                </div>
                <a href="/pricing" className="block w-full py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all text-center">
                    Upgrade for more credits →
                </a>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-inner">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-black italic uppercase text-lg tracking-tighter">Ready to <span className="text-blue-600">Integrate</span></h3>
                  <Link href="/docs" className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-2 hover:underline">
                    View Docs <ExternalLink size={12}/>
                  </Link>
                </div>
                {!apiData?.key ? (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[8px] font-black text-amber-500 uppercase mb-1 tracking-widest block">No API Key Found</span>
                      <p className="text-xs text-zinc-500">Your key may not have been created yet. Generate one now.</p>
                    </div>
                    <button
                      onClick={generateApiKey}
                      disabled={generatingKey}
                      className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {generatingKey ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                      {generatingKey ? 'Generating...' : 'Generate Key'}
                    </button>
                  </div>
                ) : (
                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest italic">Secret Production Key</span>
                      <span className="text-zinc-200 font-mono text-xs tracking-widest uppercase">
                        {showKey ? apiData.key : "•".repeat(32)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowKey(!showKey)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                          {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(apiData.key); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`p-3 rounded-xl transition-all ${copied ? "bg-emerald-500 text-black" : "bg-zinc-800 text-blue-500 hover:bg-blue-600 hover:text-white"}`}>
                            {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>

        {/* RECENT OPTIMIZATIONS */}
        <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-10 space-y-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <History size={20} className="text-blue-600" />
              <h3 className="text-white font-black italic uppercase text-lg tracking-tighter">Recent <span className="text-blue-600">Optimizations</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.last_requests.map((req, i) => {
                    const tierColor = req.credit_tier === "premium" ? "text-purple-400 border-purple-500/20 bg-purple-500/5"
                      : req.credit_tier === "medium" ? "text-blue-400 border-blue-500/20 bg-blue-500/5"
                      : "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
                    return (
                      <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col gap-3 group hover:border-blue-500/30 transition-all">
                          <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-blue-500 uppercase italic tracking-tighter truncate pr-2">{req.model_used}</span>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${tierColor}`}>
                                {req.credit_tier || "budget"}
                              </span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-[9px] text-zinc-600 uppercase font-bold">Credits used</span>
                              <span className="text-white font-black text-sm">{req.credits_used || 1} cr</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-[9px] text-zinc-600 uppercase font-bold">Savings</span>
                              <span className="text-emerald-400 font-black text-[10px]">{Number(req.savings_percentage).toFixed(1)}% off GPT-4o</span>
                          </div>
                      </div>
                    );
                })}
                {stats.last_requests.length === 0 && (
                    <p className="text-[10px] text-zinc-600 font-black uppercase italic py-8 col-span-full text-center">No optimization data available yet.</p>
                )}
            </div>
        </div>

        {/* NOTIFICATION SYSTEM */}
        {notification && (
          <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-right-10 duration-500">
            <div className={`relative p-[1.5px] rounded-2xl bg-gradient-to-br ${notification.type === 'error' ? 'from-red-500/80 via-red-500/20 to-transparent shadow-[0_0_30px_-10px_rgba(239,68,68,0.5)]' : 'from-blue-600/80 via-blue-400/20 to-transparent shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)]'}`}>
              <div className="bg-[#080808]/90 backdrop-blur-xl rounded-2xl px-8 py-5 flex items-center gap-5 border border-white/5">
                <div className={`p-3 rounded-full ${notification.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'}`}>
                  {notification.type === 'error' ? <AlertCircle size={22} className="animate-pulse" /> : <CheckCircle2 size={22} className="animate-pulse" />}
                </div>
                <div className="flex flex-col min-w-[200px]">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic mb-1">System Message</span>
                  <span className="text-sm font-bold text-white tracking-tight leading-snug">{notification.msg}</span>
                </div>
                <button onClick={() => setNotification(null)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-700 hover:text-white transition-all">
                  <Code size={16} className="rotate-45" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}