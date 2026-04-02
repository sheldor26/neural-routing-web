"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
 Zap, Cpu, TrendingUp, Loader2, Shield, Key, Copy, Eye, EyeOff, 
 CheckCircle2, History, Terminal, Sparkles, Play, MessageSquare, 
 Home, DollarSign, ExternalLink, Clock, AlertCircle, ArrowRight, Code
} from 'lucide-react';
import { useUser, UserButton, useAuth } from '@clerk/nextjs'; // useAuth is already added
import { createClient } from '@supabase/supabase-js';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth(); // Required for the secure JWT token
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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    async function loadData() {
      if (!isLoaded || !user || !mounted) return;
      try {
        setLoading(true);
        
        // 1. GET THE SECURE TOKEN FROM CLERK
        // This token tells Supabase exactly who is logged in based on your JWT template
        const token = await getToken({ template: 'supabase' });

        // 2. CREATE AN AUTHENTICATED SUPABASE CLIENT
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        );

        // 3. FETCH API KEY
        // RLS policy "(auth.uid())::text = user_id" will now allow this request
        const { data: dbData, error: dbError } = await supabase
          .from('api_keys')
          .select('key, plan') 
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (dbError) throw dbError;

        if (dbData) {
          setApiData(dbData);
        } else if (user.id === 'user_3Bo8bDV0wvjHVfqYimprn8XdsVO' || user.username === 'juan_dev') {
          // Fallback for your specific admin account
          setApiData({ key: 'nr-dev-secret-123', plan: 'development' });
        } else {
          setApiData(null);
        }

        // 4. FETCH ANALYTICS
        // Using user.id to fetch specific stats if available, otherwise fallback to dev stats
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
        console.error("Sync Error:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    loadData();
  }, [isLoaded, user, mounted, getToken]); // Added getToken to dependencies

  const runLiveTest = async () => {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    setTestResult(null); 

    try {
      const res = await fetch(`${API_BASE}/v1/dispatch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': apiData?.key || INTERNAL_KEY 
        },
        body: JSON.stringify({ 
            messages: [{ role: "user", content: testPrompt }], 
            session_id: "dashboard-test"
        })
      });

      const data = await res.json();
      
      if (res.status === 402) {
          alert(`Balance Required: ${data.details || "Please top up your account credits."}`);
          return;
      }

      if (!res.ok) throw new Error(data.details || data.error || `Error ${res.status}`);

      setTestResult(data);
      setStats(prev => ({ ...prev, last_requests: [data, ...prev.last_requests.slice(0, 4)] }));
    } catch (e: any) { 
      console.error("Test Error:", e);
      alert(`Optimization failed: ${e.message}`);
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
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Zap size={20} className="text-blue-500 fill-blue-500" />
              <span className="text-xl font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Network Status</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center justify-end gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Operational
              </span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* ONBOARDING STEPPER */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/10">
            <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Step 1: Deployment</p>
                <h2 className="text-xl font-black italic text-white uppercase italic">Zero-Config Integration</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {["Copy Key", "Switch Endpoint", "Monitor Savings"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-400 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                        <span className="text-blue-500">{i+1}.</span> {text}
                    </div>
                ))}
            </div>
        </div>
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6 backdrop-blur-md">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Live <span className="text-blue-600">Optimizer</span></h2>
                <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 animate-pulse bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <AlertCircle size={12}/> Loss Opportunity: ~${stats.opt_opportunity_usd.toFixed(2)}/mo
                </span>
            </div>

            <div className="relative">
                <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 ml-2 italic">Test your production prompts here</p>
                <textarea 
                  value={testPrompt} 
                  onChange={(e) => setTestPrompt(e.target.value)} 
                  placeholder="Paste a prompt to see how much you could save..." 
                  className="w-full bg-black/60 border border-zinc-800 rounded-3xl p-8 text-sm font-mono focus:border-blue-500/50 outline-none min-h-[160px] resize-none transition-all" 
                />
                <button 
                  onClick={runLiveTest} 
                  disabled={testLoading || !testPrompt.trim()} 
                  className="absolute bottom-4 right-4 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:grayscale"
                >
                    {testLoading ? <Loader2 size={14} className="animate-spin" /> : "Analyze Route"}
                </button>
            </div>

            {testResult && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-3 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Routing Decision: {testResult.model_used}</p>
                      </div>
                      <p className="text-sm font-mono text-zinc-500 line-clamp-2 italic">"{testResult.output?.ai_answer}"</p>
                      <div className="flex items-end gap-3">
                        <p className="text-3xl font-black italic text-white uppercase tracking-tighter">
                          ${testResult.business_metrics?.cost_usd?.toFixed(5)} 
                        </p>
                        <span className="text-zinc-600 text-sm line-through mb-1 font-bold">vs ${testResult.business_metrics?.estimated_gpt4_cost?.toFixed(5)}</span>
                      </div>
                  </div>
                  <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Latency: {testResult.business_metrics?.latency_ms}ms</p>
                      <div className="px-5 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase italic rounded-xl shadow-lg shadow-emerald-500/20">
                        -{testResult.business_metrics?.savings_percentage?.toFixed(1)}% Efficiency
                      </div>
                  </div>
              </div>
            )}
          </div>

          <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_80px_-20px_rgba(37,99,235,0.5)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <TrendingUp size={160} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 z-10">Projected Yearly Savings</span>
            <h3 className="text-7xl font-black italic text-white tracking-tighter z-10">${(stats.opt_opportunity_usd * 12).toFixed(0)}</h3>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest z-10 opacity-70">Based on current traffic volume</p>
            <button className="mt-4 w-full py-5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors z-10">
                Scale Savings Now →
            </button>
          </div>
        </div>

        {/* API ACCESS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-inner">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black italic uppercase text-lg tracking-tight">Access <span className="text-blue-600">Credentials</span></h3>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase text-zinc-500 border border-white/5">Plan: {apiData?.plan || "Free Tier"}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">Active API Key</span>
                        <span className="text-zinc-200 font-mono text-xs tracking-widest">
                          {showKey ? (apiData?.key || "No Key Found") : "•".repeat(32)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => setShowKey(!showKey)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                            {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                          <button 
                            onClick={() => { 
                              navigator.clipboard.writeText(apiData?.key || ""); 
                              setCopied(true); 
                              setTimeout(() => setCopied(false), 2000); 
                            }} 
                            className={`p-3 rounded-xl transition-all ${
                              copied ? "bg-emerald-500 text-black" : "bg-zinc-800 text-blue-500 hover:bg-blue-600 hover:text-white"
                            }`}
                          >
                              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                          </button>
                      </div>
                  </div>
                </div>
                <p className="text-[9px] text-zinc-600 font-black uppercase italic tracking-widest">Never share your secret key in client-side code.</p>
            </div>

            <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Terminal size={18} />
                  </div>
                  <h3 className="text-white font-black italic uppercase text-sm tracking-widest">Integration Snippet</h3>
                </div>
                
                <div className="relative group">
                  <pre className="bg-black/60 p-6 rounded-3xl border border-white/5 text-[11px] font-mono text-zinc-400 overflow-x-auto leading-relaxed">
{`// NeuralRouting Endpoint
const res = await fetch("${API_BASE}/v1/dispatch", {
  method: "POST",
  headers: { 
    "X-API-KEY": "${apiData?.key?.substring(0, 10) || "YOUR_KEY"}...",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ 
    messages: [{ role: "user", content: "..." }] 
  })
})`}
                  </pre>
                  <button onClick={() => navigator.clipboard.writeText(`${API_BASE}/v1/dispatch`)} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors">
                    <Copy size={14}/>
                  </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}