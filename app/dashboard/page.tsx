"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Droplets, Shield, ArrowRight, Activity, ChevronRight, Lock } from 'lucide-center';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  // 1. Estados
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ savings: 0, efficiency: 0, water: 0 });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false); // Estado para la notificación

  // Función para copiar la API Key con notificación personalizada
  const copyToClipboard = () => {
    // Aquí puedes usar la clave que definiste en tu main.py
    navigator.clipboard.writeText("nr_live_optica_carballo_2026");
    setShowToast(true);
    // Ocultar notificación tras 3 segundos
    setTimeout(() => setShowToast(false), 3000);
  };

  // 2. Sincronización con tu Nodo Neural
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const API_BASE = "https://web-production-4f439.up.railway.app"; 
        const userId = "user_38g3uPhdZraElqcUSk6VWnUVLo1"; 

        const response = await fetch(`${API_BASE}/v1/user-stats/${userId}`);
        const data = await response.json();
        
        if (data && !data.error) {
          setChartData(data.history || []);
          setStats({
            savings: data.savings || 0,
            efficiency: data.efficiency || 0,
            water: (data.savings || 0) * 12.5
          });
        }
      } catch (error) {
        console.error("Error sincronizando con Neural Node:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Zap size={40} className="text-blue-500 animate-pulse mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 text-center">
          Establishing Secure Link...<br/>
          <span className="text-blue-500/50">Neural Node System</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* --- NAV BAR --- */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Zap size={20} className="text-blue-500 fill-blue-500/20" />
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">
              NeuralDash<span className="text-blue-500">.io</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Neural Node: Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- METRIC CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 group hover:border-blue-500/30 transition-all shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Total Savings</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white mb-2">
              ${stats.savings.toFixed(4)}
            </h2>
            <p className="text-xs text-blue-500 font-bold italic tracking-tight flex items-center gap-1">
              <Zap size={12} /> Optimization: {stats.efficiency}%
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 group hover:bg-blue-500/10 transition-all">
            <div className="flex items-center gap-2 mb-6 text-blue-500">
              <Droplets size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Eco-Impact</span>
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter text-white leading-none mb-2">
              {stats.water.toFixed(4)}L
            </h2>
            <p className="text-zinc-500 text-sm font-medium italic">Water saved in datacenter cooling</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-6 text-zinc-500 font-black uppercase tracking-widest text-[10px]">
              <Lock size={12} /> Production Key
            </div>
            <div 
              onClick={copyToClipboard}
              className="bg-black/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all shadow-inner active:scale-95"
            >
              <code className="text-xs text-zinc-500 font-mono italic group-hover:text-blue-400 transition-colors">
                nr_live_••••••••••••
              </code>
              <ArrowRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* --- GRAPH + INFRASTRUCTURE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-8 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 flex flex-col h-[480px] shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-2xl flex items-center gap-3">
                <Activity size={24} className="text-blue-500" /> Neural Arbitrage Analytics
              </h4>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div><span className="text-[10px] font-black uppercase text-zinc-500 italic">Saved</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-zinc-800"></div><span className="text-[10px] font-black uppercase text-zinc-500 italic">Cost</span></div>
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
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '20px', padding: '15px' }}
                    itemStyle={{ fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '12px' }}
                    formatter={(value: number) => [`$${value.toFixed(4)}`, "SAVED"]}
                    labelFormatter={(label) => `Neural Report: ${label}`}
                  />
                  <Area type="monotone" dataKey="costo" stroke="#27272a" fillOpacity={0.1} fill="#27272a" strokeWidth={2} />
                  <Area type="monotone" dataKey="ahorro" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAhorro)" strokeWidth={5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 shadow-2xl">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-2xl mb-8 flex items-center gap-3">
              <Shield size={24} className="text-blue-500" /> Infrastructure
            </h4>
            <div className="space-y-6">
              {[
                { name: "Core Engine", status: "Active", lat: "12ms" },
                { name: "Economy Node", status: "Active", lat: "112ms" },
                { name: "Premium Node", status: "Active", lat: "450ms" },
                { name: "Privacy Layer", status: "Active", lat: "4ms" },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 group">
                  <div>
                    <p className="text-white text-sm font-bold uppercase italic tracking-tight group-hover:text-blue-400 transition-colors">{node.name}</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Latency: {node.lat}</p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-black text-green-500 uppercase tracking-widest">
                    {node.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- BILLING CTA --- */}
        <div className="p-10 rounded-[3rem] bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between group hover:bg-blue-500 transition-all cursor-pointer shadow-2xl shadow-blue-900/20">
          <div className="mb-6 md:mb-0">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Scale Your Capacity</h3>
            <p className="text-blue-100/70 text-sm font-medium italic">Unlock dedicated Neural nodes and advanced Neural Analytics.</p>
          </div>
          <div className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter text-xs flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-xl">
            Go to Billing <ChevronRight size={16} />
          </div>
        </div>

      </main>

      <footer className="py-12 text-center opacity-30 border-t border-white/5 mt-12 bg-black/20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-zinc-600 italic">NeuralDash Global // Neural Node // 2026</p>
      </footer>

      {/* --- NEURAL TOAST NOTIFICATION --- */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-zinc-950 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)] px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl">
            <div className="bg-blue-500/20 p-1.5 rounded-lg">
              <Zap size={16} className="text-blue-500 fill-blue-500/20" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white italic">
              Neural Key <span className="text-blue-500 ml-1">Copied to Clipboard</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
