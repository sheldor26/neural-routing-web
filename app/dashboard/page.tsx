"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Droplets, Shield, ArrowRight, Activity, ChevronRight, Lock, HelpCircle, Home, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser, UserButton } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ 
    savings: 0, 
    requests: 0, 
    water: 0,
    quality: 0.93, // Default fallback
    risk: 8        // Default fallback
  });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("nr_live_client_2026_production");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const InfoTag = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-2 cursor-help">
      <HelpCircle size={12} className="text-zinc-600 hover:text-blue-500 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 bg-black border border-zinc-800 rounded-xl shadow-2xl z-50">
        <p className="text-[9px] leading-relaxed text-zinc-400 font-bold uppercase tracking-tighter italic">
          {text}
        </p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800"></div>
      </div>
    </div>
  );

  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoaded || !user?.id) return;
      
      try {
        const API_BASE = "https://web-production-4f439.up.railway.app"; 
        const response = await fetch(`${API_BASE}/v1/user-stats/${user.id}`);
        const data = await response.json();
        
        if (data && !data.error) {
          const totalSavings = Number(data.total_savings || data.savings || 0);
          const requestsCount = Number(data.requests_count || data.total_requests || 0);

          const formattedHistory = (data.history || []).map((item: any) => ({
            name: item.name || "Node",
            ahorro: Number(item.savings || 0),
            costo: Number(item.savings || 0) * 0.2 
          }));

          setChartData(formattedHistory);
          setStats({
            savings: totalSavings,
            requests: requestsCount,
            water: requestsCount * 0.0125,
            quality: data.quality_score || 0.93,
            risk: data.at_risk_percent || 8
          });
        }
      } catch (error) {
        console.error("Neural Node Sync Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 text-center">
          Establishing Secure Link...<br/>
          <span className="text-blue-500/50 italic">Retrieving Node Analytics</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all text-white">
              <Zap size={20} className="text-blue-500 fill-blue-500/20" />
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors">
              Neuralrouting<span className="text-blue-500">.io</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/chat" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
            >
              <Zap size={14} /> Open Chat
            </Link>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-l border-white/10 pl-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Node: Online</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* PRIMARY METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 group hover:border-blue-500/30 transition-all shadow-2xl relative">
            <div className="flex items-center mb-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Total Savings</p>
              <InfoTag text="Total economic optimization achieved by the neural routing engine across all operations." />
            </div>
            <h2 className="text-6xl font-black italic tracking-tighter text-white mb-2">
              ${stats.savings.toFixed(4)}
            </h2>
            <p className="text-xs text-blue-500 font-bold italic tracking-tight flex items-center gap-1 uppercase">
              <Activity size={12} /> {stats.requests} Processed Requests
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 group hover:bg-blue-500/10 transition-all relative">
            <div className="flex items-center mb-6 text-blue-500">
              <Droplets size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest ml-2">Eco-Impact</span>
              <InfoTag text="Calculated water conservation in datacenter cooling systems (0.0125L per optimized cycle)." />
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter text-white leading-none mb-2 uppercase">
              {stats.water.toFixed(4)}L
            </h2>
            <p className="text-zinc-500 text-sm font-medium italic uppercase tracking-tighter">H2O Conserved</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col justify-between relative">
            <div className="flex items-center mb-6 text-zinc-500 font-black uppercase tracking-widest text-[10px]">
              <Lock size={12} className="mr-2" /> API Access Key
              <InfoTag text="Encrypted key used for production-grade API authentication." />
            </div>
            <div 
              onClick={copyToClipboard}
              className="bg-black/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all active:scale-95"
            >
              <code className="text-xs text-zinc-500 font-mono italic group-hover:text-blue-400 uppercase">
                nr_live_prod_••••••••
              </code>
              <ArrowRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* --- QUALITY & RISK SECTION (NEW) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* QUALITY SCORE CARD */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-emerald-500/20 group hover:border-emerald-500/40 transition-all shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/70 text-emerald-500">Neural Quality Score</p>
                <h2 className="text-6xl font-black italic tracking-tighter text-white">{stats.quality}</h2>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Shield size={24} className="text-emerald-500" />
              </div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full shadow-[0_0_15px_#10b981] transition-all duration-1000" 
                style={{ width: `${stats.quality * 100}%` }}
              />
            </div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase mt-4 italic">
              Optimization Accuracy: <span className="text-emerald-500">Nominal</span>
            </p>
          </div>

          {/* RISK ASSESSMENT CARD */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-red-500/20 group hover:border-red-500/40 transition-all shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70 text-red-500">At Risk Requests</p>
                <h2 className="text-6xl font-black italic tracking-tighter text-white">{stats.risk}<span className="text-2xl text-red-500">%</span></h2>
              </div>
              <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-white">
                <Activity size={24} className="text-red-500" />
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < Math.ceil(stats.risk / 10) ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-zinc-800'}`} 
                />
              ))}
            </div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase mt-4 italic">
              Potential precision loss detected in current cycle
            </p>
          </div>

        </div>

        {/* GRAPH & INFRA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 flex flex-col h-[480px] shadow-2xl relative">
            <div className="flex items-center justify-between mb-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-2xl flex items-center gap-3 text-white">
                <Activity size={24} className="text-blue-500" /> Optimization Analytics
              </h4>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                  <span className="text-[10px] font-black uppercase text-zinc-500 italic">Savings</span>
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAhorro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10, fontWeight: 900}} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '20px' }}
                    itemStyle={{ fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '10px' }}
                    formatter={(value: number) => [`$${value.toFixed(4)}`, "SAVED"]}
                  />
                  <Area type="monotone" dataKey="ahorro" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAhorro)" strokeWidth={5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 shadow-2xl relative text-white">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-2xl mb-8 flex items-center gap-3">
              <Shield size={24} className="text-blue-500" /> Infrastructure
            </h4>
            <div className="space-y-6">
              {[
                { name: "Neural Gateway", status: "Active", lat: "14ms" },
                { name: "Llama-8B Engine", status: "Active", lat: "92ms" },
                { name: "DeepSeek Dispatch", status: "Active", lat: "410ms" },
                { name: "Supabase Core", status: "Active", lat: "8ms" },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 group">
                  <div>
                    <p className="text-white text-sm font-bold uppercase italic tracking-tight group-hover:text-blue-400 transition-colors">{node.name}</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Latency: {node.lat}</p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-black text-green-500 uppercase">
                    {node.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between group hover:bg-blue-500 transition-all cursor-pointer shadow-2xl">
          <div className="mb-6 md:mb-0">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Scale Your Capacity</h3>
            <p className="text-blue-100/70 text-sm font-medium italic uppercase tracking-tighter">Upgrade to Enterprise nodes for dedicated GPU throughput.</p>
          </div>
          <div className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter text-xs flex items-center gap-3 shadow-xl uppercase">
            Go Pro <ChevronRight size={16} />
          </div>
        </div>
      </main>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-zinc-950 border border-blue-500/50 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl text-white">
            <Zap size={16} className="text-blue-500" />
            <p className="text-xs font-black uppercase tracking-widest text-white italic">Key Copied to Clipboard</p>
          </div>
        </div>
      )}
    </div>
  );
}
