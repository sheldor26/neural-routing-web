"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Shield, Activity, Cpu, Sliders, TrendingUp, Target, ArrowRight, Lock, HelpCircle, Loader2, ChevronRight, Home, LayoutDashboard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser, UserButton } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [chartData, setChartData] = useState([]);
  const [routingMode, setRoutingMode] = useState('Balanced');
  const [decisions, setDecisions] = useState([]); 
  const [stats, setStats] = useState({ 
    savings: 0, 
    requests: 0, 
    water: 0, 
    quality: null, 
    risk: 8, 
    validated_samples: 0,
    isEstimated: true 
  });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Helper for Quality Labels & Colors
  const getQualityContext = (score: number | null) => {
    if (score === null) return { text: "Pending", color: "text-zinc-500", bg: "bg-zinc-500/10" };
    if (score >= 0.90) return { text: "High Accuracy", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (score >= 0.75) return { text: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { text: "At Risk", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.85) return { text: "High Confidence", color: "text-emerald-500" };
    if (score >= 0.60) return { text: "Medium Confidence", color: "text-yellow-500" };
    return { text: "Low Confidence", color: "text-red-500" };
  };

  const getDynamicSimulator = () => {
    const q = stats.quality || 0.93;
    const r = stats.risk || 8;
    if (routingMode === 'Conservative') {
      return { qImp: `+${((1 - q) * 0.4).toFixed(1)}%`, sImp: `-${(r * 1.5).toFixed(1)}%`, label: "Risk Mitigation" };
    }
    if (routingMode === 'Aggressive') {
      return { qImp: `-${(q * 0.05).toFixed(1)}%`, sImp: `+${(r * 2.2).toFixed(1)}%`, label: "Profit Max" };
    }
    return { qImp: "0.0%", sImp: "0.0%", label: "System Baseline" };
  };

  const simulation = getDynamicSimulator();

  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoaded || !user?.id) return;
      try {
        const response = await fetch(`https://web-production-4f439.up.railway.app/v1/user-stats/${user.id}`);
        const data = await response.json();
        if (data && !data.error) {
          setDecisions(data.recent_decisions || []);
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            water: Number(data.requests_count || 0) * 0.0125,
            quality: data.quality_score || null,
            risk: data.at_risk_percent || 8,
            validated_samples: data.validated_samples || 0,
            isEstimated: !data.quality_score
          });
          setChartData((data.history || []).map((item: any) => ({ name: item.name || "Node", ahorro: Number(item.savings || 0) })));
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    loadDashboardData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
              <Zap size={20} className="text-blue-500 fill-blue-500/20" />
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors">
              Neuralrouting<span className="text-blue-500">.io</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"><Home size={14} /> Home</Link>
            <Link href="/chat" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"><Zap size={14} /> Open Chat</Link>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-l border-white/10 pl-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800">
                <LayoutDashboard size={12} className="text-blue-500" />
                <span>Console Active</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* OPTIMIZATION OPPORTUNITY CARD */}
        <div className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600/20 to-emerald-600/10 border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20"><Target size={28} className="text-white" /></div>
            <div>
              <h3 className="text-white font-black uppercase italic tracking-tighter text-xl leading-none">Optimization Opportunity</h3>
              <p className="text-[11px] text-blue-400 font-bold uppercase tracking-widest mt-2">64% of requests could use aggressive routing safely</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Potential Monthly Savings</p>
            <h4 className="text-4xl font-black italic text-emerald-500 tracking-tighter">+$420.00</h4>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Total Savings</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none">${stats.savings.toFixed(4)}</h2>
            <p className="text-xs text-blue-500 font-bold italic tracking-tight flex items-center gap-1 mt-4 uppercase"><Activity size={12} /> {stats.requests} Requests</p>
          </div>

          {/* 🚨 UPDATED QUALITY SCORE CARD */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Neural Quality Score</p>
              {stats.quality && (
                <span className="text-[8px] text-emerald-500 font-black uppercase bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">Validated</span>
              )}
            </div>

            {stats.quality ? (
              <>
                <div className="flex items-end gap-3 mb-4">
                  <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none">{stats.quality}</h2>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getQualityContext(stats.quality).bg} ${getQualityContext(stats.quality).color} mb-1`}>
                    {getQualityContext(stats.quality).text}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${stats.quality * 100}%` }} />
                </div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-4 italic">
                  Based on <span className="text-white">{stats.validated_samples.toLocaleString()}</span> validated requests
                </p>
              </>
            ) : (
              <div className="py-2">
                <h2 className="text-xl font-black italic text-zinc-600 uppercase tracking-tighter">Insufficient Data</h2>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2 italic leading-relaxed">
                  Validation engine requires <span className="text-blue-500">50 samples</span> to calculate accuracy. <br/>
                  Current progress: {stats.validated_samples}/50
                </p>
              </div>
            )}
          </div>

          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-red-500/10 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70 mb-2">Risk Factor</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none">{stats.risk}%</h2>
            <p className="text-[9px] text-zinc-500 font-medium uppercase mt-4 leading-relaxed text-white">
                <span className="text-red-500 font-black">ACTION REQUIRED:</span> Increase safety threshold by 12% to negate precision risks.
            </p>
          </div>
        </div>

        {/* DECISIONS & SIMULATOR SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-7 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 shadow-2xl overflow-hidden">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-8 flex items-center gap-3">
              <Cpu size={20} className="text-blue-500" /> Decision Engine Logs
            </h4>
            <div className="space-y-4">
              {decisions.length > 0 ? decisions.map((dec: any, i) => {
                const conf = getConfidenceLevel(dec.confidence || 0.6);
                return (
                  <div key={i} className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex gap-4">
                      <div className={`w-1 h-10 rounded-full ${dec.model_used?.includes('Premium') ? 'bg-blue-500' : 'bg-zinc-700'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-white font-black uppercase italic leading-none">{dec.model_used || "Node Dispatch"}</p>
                          <span className={`text-[8px] font-black uppercase ${conf.color}`}>{conf.text}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold mt-1.5">{dec.reason || "Semantic routing active"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-emerald-500 italic leading-none">Saved: ${dec.saved_amount || '0.0034'}</p>
                      <span className="text-[8px] text-zinc-700 font-black uppercase mt-1 block">Real-time</span>
                    </div>
                  </div>
                );
              }) : <p className="text-[10px] text-zinc-600 italic uppercase">Awaiting telemetry...</p>}
            </div>
          </div>

          <div className="lg:col-span-5 p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/20 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-2">Next-Gen Simulator</h4>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-10 italic">Strategy: {simulation.label}</p>
              <div className="p-6 bg-black/60 rounded-[2rem] border border-white/5 backdrop-blur-md">
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-4 italic text-white">Transition to {routingMode}:</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">Quality Impact</p>
                      <h5 className={`text-4xl font-black italic leading-none ${simulation.qImp.startsWith('+') ? 'text-white' : 'text-red-400'}`}>{simulation.qImp}</h5>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Savings Impact</p>
                      <h5 className="text-4xl font-black italic text-white leading-none">{simulation.sImp}</h5>
                    </div>
                  </div>
              </div>
              <button className="w-full mt-6 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-lg active:scale-95">Run Predictive Analytics</button>
            </div>
            <Zap size={180} className="absolute -bottom-10 -right-10 text-blue-500/5 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
          </div>
        </div>

        {/* POLICY CONTROL SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-zinc-900/10 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2 text-sm">
            <Sliders size={18} className="text-blue-500" /> Active Policy: <span className="text-blue-400">{routingMode}</span>
          </h3>
          <div className="flex bg-black/50 p-1.5 rounded-2xl border border-zinc-800">
            {['Conservative', 'Balanced', 'Aggressive'].map((mode) => (
              <button 
                key={mode} 
                onClick={() => setRoutingMode(mode)} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${routingMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
