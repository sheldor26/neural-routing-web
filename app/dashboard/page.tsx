"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Shield, Activity, Cpu, Sliders, TrendingUp, DollarSign, Target, ArrowRight, Lock, HelpCircle, Loader2, ChevronRight, Droplets } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser, UserButton } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [chartData, setChartData] = useState([]);
  const [routingMode, setRoutingMode] = useState('Balanced');
  const [decisions, setDecisions] = useState([]); 
  const [stats, setStats] = useState({ 
    savings: 0, requests: 0, water: 0, quality: 0.93, risk: 8, isEstimated: true 
  });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // 🚨 REFINEMENT 1: Confidence Level Context
  const getConfidenceLevel = (score: number) => {
    if (score >= 0.85) return { text: "High Confidence", color: "text-emerald-500" };
    if (score >= 0.60) return { text: "Medium Confidence", color: "text-yellow-500" };
    return { text: "Low Confidence", color: "text-red-500" };
  };

  // 🚨 REFINEMENT 3: Dynamic What-If Math
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText("nr_live_client_2026_production");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const InfoTag = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-2 cursor-help">
      <HelpCircle size={12} className="text-zinc-600 hover:text-blue-500 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 bg-black border border-zinc-800 rounded-xl shadow-2xl z-50 text-white">
        <p className="text-[9px] leading-relaxed text-zinc-400 font-bold uppercase tracking-tighter italic">{text}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800"></div>
      </div>
    </div>
  );

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
            quality: data.quality_score || 0.93,
            risk: data.at_risk_percent || 8,
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
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* 🚨 REFINEMENT 4: OPTIMIZATION OPPORTUNITY CARD */}
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

        {/* CORE STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Total Savings</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none">${stats.savings.toFixed(4)}</h2>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Quality Score</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none">{stats.quality}</h2>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-red-500/10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70 mb-2">Risk Factor</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none">{stats.risk}%</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* RECENT DECISIONS WITH SAVINGS DATA */}
          <div className="lg:col-span-7 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 shadow-2xl overflow-hidden">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-8 flex items-center gap-3">
              <Cpu size={20} className="text-blue-500" /> Decision Engine Logs
            </h4>
            <div className="space-y-4">
              {decisions.map((dec: any, i) => {
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
                        <p className="text-[11px] text-zinc-500 font-bold mt-1.5">{dec.reason}</p>
                      </div>
                    </div>
                    {/* 🚨 REFINEMENT 2: Decision Impact ($) */}
                    <div className="text-right">
                      <p className="text-[11px] font-black text-emerald-500 italic leading-none">Saved: ${dec.saved_amount || '0.0034'}</p>
                      <span className="text-[8px] text-zinc-700 font-black uppercase mt-1 block">Real-time</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIMULATOR */}
          <div className="lg:col-span-5 p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/20 relative overflow-hidden group shadow-2xl">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-2 relative z-10">Next-Gen Simulator</h4>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-10 italic relative z-10">Context: {simulation.label}</p>
            <div className="p-6 bg-black/60 rounded-[2rem] border border-white/5 backdrop-blur-md relative z-10">
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-4 italic">Estimated Impact:</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">Quality</p>
                    <h5 className={`text-4xl font-black italic leading-none ${simulation.qImp.startsWith('+') ? 'text-white' : 'text-red-400'}`}>{simulation.qImp}</h5>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Savings</p>
                    <h5 className="text-4xl font-black italic text-white leading-none">{simulation.sImp}</h5>
                  </div>
                </div>
            </div>
            <Zap size={180} className="absolute -bottom-10 -right-10 text-blue-500/5 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
          </div>
        </div>

        {/* POLICY CONTROL */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-zinc-900/10 border border-zinc-800 p-8 rounded-[2.5rem]">
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
