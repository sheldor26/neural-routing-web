"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Cpu, Sliders, TrendingUp, Home, Loader2, Target, 
  Rocket, HelpCircle, Shield, Key, Copy, Eye, EyeOff, CheckCircle2, 
  ArrowRight, AlertCircle, PlayCircle, Trophy, BarChart3, History
} from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useUser, UserButton } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [chartData, setChartData] = useState<any[]>([]);
  const [routingMode, setRoutingMode] = useState('Balanced');
  const [apiData, setApiData] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [stats, setStats] = useState({ 
    savings: 0, 
    requests: 0, 
    quality: 0, 
    risk: 0, 
    global_confidence: 0,
    opt_opportunity_usd: 0,
    last_requests: [] as any[] // Ahora es un array real de historial
  });

  const [loading, setLoading] = useState(true);

  const API_BASE = "https://web-production-4f439.up.railway.app";
  const INTERNAL_KEY = "nr-dev-secret-123"; 

  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;
      try {
        setLoading(true);
        // 1. Datos de licencia
        const { data: dbData } = await supabase.from('api_keys').select('key, plan_type').eq('email', user.primaryEmailAddress.emailAddress).single();
        if (dbData) setApiData(dbData);

        // 2. Stats reales del Router
        const response = await fetch(`${API_BASE}/v1/user-stats/${user.id}`, { 
            headers: { 'X-API-KEY': INTERNAL_KEY } 
        });
        const data = await response.json();
        
        if (data && !data.error) {
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            quality: Number(data.quality_score || 0),
            global_confidence: data.global_confidence || 0,
            risk: data.at_risk_percent || 0,
            opt_opportunity_usd: data.optimization_opportunity_usd || 0,
            last_requests: data.recent_decisions?.slice(0, 5) || [] // Tomamos los últimos 5 reales
          });
          if (data.history?.length > 0) {
            setChartData(data.history.map((item: any) => ({ name: item.name, savings: Number(item.savings) })));
          }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    loadDashboardData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40}/>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Syncing Production Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20"><Zap size={20} className="text-blue-500" /></div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* 1. DYNAMIC HERO: PERSONALIZED LOSS AVERSION */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase text-red-500">
                <AlertCircle size={12} /> Active Leakage
              </div>
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-[0.85]">
                You're losing <span className="text-blue-600">${stats.opt_opportunity_usd.toFixed(2)}/mo</span> <br/> 
                <span className="text-zinc-500">on overkill models.</span>
              </h2>
              <Link href="/playground">
                <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all flex items-center gap-3 shadow-xl">
                  Run Optimization Audit <PlayCircle size={18} />
                </button>
              </Link>
            </div>

            {/* MILESTONE: GAMIFICATION */}
            <div className="relative z-10 bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                <Trophy size={32} className="text-blue-500 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Next Milestone</p>
                <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">$100 Saved</h4>
                <div className="w-32 bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${Math.min((stats.savings / 100) * 100, 100)}%` }} />
                </div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase mt-2 italic">Keep routing to unlock</p>
            </div>
          </div>

          {/* 2. UPGRADE PRESSURE: REAL SAVINGS CAP */}
          <div className="p-10 rounded-[3rem] bg-zinc-900 border border-zinc-800 flex flex-col justify-center items-center text-center space-y-2 group relative overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Savings Capacity</span>
            <h3 className="text-4xl font-black italic text-white tracking-tighter">
              {apiData?.plan_type === 'pro' ? 'UNLIMITED' : 'CAPPED'}
            </h3>
            <p className="text-[9px] font-black text-red-500 uppercase italic opacity-80">
                Unlock +${(stats.opt_opportunity_usd * 0.8).toFixed(2)} savings
            </p>
            <Link href="/billing" className="mt-4 px-6 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
                Upgrade Now
            </Link>
          </div>
        </div>

        {/* 3. LIVE AUDIT LOG: TRUST REINFORCEMENT */}
        <div className="mb-12 p-8 md:p-10 bg-zinc-900/20 border border-white/5 rounded-[3rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-black italic uppercase tracking-tighter text-xl flex items-center gap-3">
              <History size={20} className="text-blue-500" /> Real-time Efficiency Log
            </h3>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Last 5 Requests</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.last_requests.length > 0 ? stats.last_requests.map((req, i) => (
              <div key={i} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-3 group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Saved</span>
                  <span className="text-[10px] font-black text-emerald-500">+${(req.savings_generated_usd || 0.001).toFixed(3)}</span>
                </div>
                <p className="text-[10px] font-bold text-zinc-400 truncate uppercase italic">"{req.prompt_preview || 'Audit'}"</p>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   <span className="text-[9px] font-black text-blue-500 uppercase truncate">{req.model_used || 'Economy'}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-5 py-10 text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] italic">Waiting for production traffic...</div>
            )}
          </div>
        </div>

        {/* 4. PERFORMANCE NARRATIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 p-10 rounded-[3.5rem] bg-zinc-900/10 border border-zinc-800 h-[450px]">
             <div className="flex justify-between items-end mb-10">
               <div className="space-y-1">
                 <h4 className="text-white font-black italic uppercase text-xl flex items-center">
                   <TrendingUp size={20} className="text-blue-500 mr-3" /> Efficiency Growth
                 </h4>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Scaling with your infrastructure</p>
               </div>
               <div className="text-right">
                 <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Current Savings</p>
                 <h5 className="text-3xl font-black italic text-blue-500 leading-none">${stats.savings.toFixed(3)}</h5>
               </div>
             </div>
             <ResponsiveContainer width="100%" height="70%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10, fontWeight: 900}} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '15px' }} />
                  <Area type="monotone" dataKey="savings" stroke="#3b82f6" fill="url(#colorSavings)" strokeWidth={4} />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* 5. API KEY & INTEGRATION */}
          <div className="lg:col-span-4 p-10 rounded-[3.5rem] bg-zinc-900/40 border border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-white font-black italic uppercase text-xl flex items-center gap-3">
                <Key size={20} className="text-blue-500" /> API Access
              </h4>
              <div className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-5 font-mono text-[10px] flex items-center justify-between group">
                <span className="text-zinc-500 truncate mr-6">{showKey ? apiData?.key : "••••••••••••••••••••••••"}</span>
                <button onClick={() => setShowKey(!showKey)} className="text-zinc-600 hover:text-white transition-colors">
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Setup time: &lt; 2 minutes. Replace OpenAI Base URL.</p>
            </div>
            <button 
                onClick={() => { navigator.clipboard.writeText(apiData?.key || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
            >
              {copied ? 'Copied!' : 'Copy API Key'} <Copy size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
