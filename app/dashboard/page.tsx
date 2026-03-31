"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Droplets, Shield, ArrowRight, Activity, ChevronRight, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  // 1. Estados para manejar datos reales
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ savings: 0, efficiency: 0, water: 0 });
  const [loading, setLoading] = useState(true);

  // 2. Efecto para buscar los datos al cargar la página
  useEffect(() => {
    async function loadDashboardData() {
      try {
        // AQUÍ CONECTARÁS TU API DE PYTHON/RAILWAY:
        // const response = await fetch('https://tu-api.railway.app/dashboard-stats');
        // const data = await response.json();
        
        // Simulación de carga de datos reales (Simulamos un delay de red)
        setTimeout(() => {
          const mockDataFromDB = [
            { name: 'Lun', ahorro: 420, costo: 150 },
            { name: 'Mar', ahorro: 580, costo: 180 },
            { name: 'Mie', ahorro: 890, costo: 210 },
            { name: 'Jue', ahorro: 720, costo: 160 },
            { name: 'Vie', ahorro: 1050, costo: 230 },
            { name: 'Sab', ahorro: 900, costo: 190 },
            { name: 'Dom', ahorro: 1150, costo: 170 },
          ];
          
          setChartData(mockDataFromDB);
          setStats({
            savings: 1240.50, // Suma total real de la DB
            efficiency: 92.4,
            water: 1240.50 * 12.5 // Proporción Neural: 12.5L por USD
          });
          setLoading(false);
        }, 1200);

      } catch (error) {
        console.error("Error conectando con los nodos de Neural:", error);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Zap size={40} className="text-blue-500 animate-pulse mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Synchronizing Neural Nodes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
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
            <h2 className="text-6xl font-black italic tracking-tighter text-white mb-2">${stats.savings.toLocaleString()}</h2>
            <p className="text-xs text-blue-500 font-bold italic tracking-tight flex items-center gap-1">
              <Zap size={12} /> Optimization: {stats.efficiency}%
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 group hover:bg-blue-500/10 transition-all">
            <div className="flex items-center gap-2 mb-6 text-blue-500">
              <Droplets size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Eco-Impact</span>
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter text-white leading-none mb-2">{stats.water.toLocaleString()}L</h2>
            <p className="text-zinc-500 text-sm font-medium italic">Water saved in datacenter cooling</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-6 text-zinc-500 font-black uppercase tracking-widest text-[10px]">
              <Lock size={12} /> Production Key
            </div>
            <div className="bg-black/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-zinc-700 transition-colors shadow-inner">
              <code className="text-xs text-zinc-500 font-mono italic">nr_live_••••••••••••</code>
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
                    formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                    labelFormatter={(label) => `Neural Node Report: ${label}`}
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
    </div>
  );
}