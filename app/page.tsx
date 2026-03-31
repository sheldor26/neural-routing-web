"use client";

import React, { useState } from 'react';
import { Zap, Droplets, Shield, Globe, ArrowRight, BarChart3, Lock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Simulamos los datos del Neural Node de Virasoro
  const [savings] = useState(0.48); 
  const [requests] = useState(142);
  const [efficiency] = useState(94.2);
  
  // Cálculo de impacto hídrico (litros ahorrados vs clusters premium masivos)
  const waterSaved = (savings * 12.5).toFixed(1);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* --- DASHBOARD HEADER --- */}
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
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Virasoro Node: Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- TOP METRICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Main Financial Savings */}
          <div className="relative p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 size={80} className="text-blue-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Total Savings</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white mb-2">
              ${savings.toFixed(2)}
            </h2>
            <p className="text-xs text-blue-500 font-bold italic tracking-tight flex items-center gap-1">
              <Zap size={12} /> Optimization Yield: {efficiency}%
            </p>
          </div>

          {/* ECO IMPACT: Water Savings (Tu idea de color) */}
          <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex flex-col justify-between group hover:bg-blue-500/10 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Droplets size={18} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Eco-Impact Metrics</span>
              </div>
              <h2 className="text-5xl font-black italic tracking-tighter text-white leading-none mb-2">
                {waterSaved}L
              </h2>
              <p className="text-zinc-500 text-sm font-medium italic">of water saved in server cooling</p>
            </div>
            <p className="text-[9px] text-blue-400/50 mt-6 font-mono uppercase tracking-tighter">
              Reduced GPU thermal dissipation via Neural Node efficiency.
            </p>
          </div>

          {/* Secure Access / API Key Section */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Lock size={14} className="text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Secure Access</span>
              </div>
              <h3 className="text-xl font-black italic uppercase text-white mb-4 tracking-tighter">Production Key</h3>
              <div className="bg-black/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-zinc-700 transition-colors">
                <code className="text-xs text-zinc-500 font-mono">nr_live_••••••••••••</code>
                <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
              <span>Rate Limit: 60 req/m</span>
              <span>Status: Global</span>
            </div>
          </div>

        </div>

        {/* --- SYSTEM INFRASTRUCTURE SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Infrastructure Health */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-900">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-2xl mb-8 flex items-center gap-3">
              <Shield size={24} className="text-blue-500" /> Neural Node Status
            </h4>
            <div className="space-y-6">
              {[
                { name: "Core Routing Engine", status: "Operational", lat: "12ms" },
                { name: "Economy Node (Groq)", status: "Operational", lat: "112ms" },
                { name: "Premium Node (OpenAI)", status: "Operational", lat: "450ms" },
                { name: "Privacy Shield Layer", status: "Active", lat: "4ms" },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                  <div>
                    <p className="text-white text-sm font-bold uppercase italic tracking-tight">{node.name}</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Latency: {node.lat}</p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">{node.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Getting Started */}
          <div className="flex flex-col gap-4">
            <div className="p-10 rounded-[3rem] bg-blue-600 text-white flex-grow flex flex-col justify-between group hover:bg-blue-500 transition-all cursor-pointer">
              <div>
                <Zap size={32} className="mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
                  Boost Your <br/> Neural Power
                </h3>
                <p className="text-blue-100/70 text-sm font-medium italic">Upgrade to Growth Plan to unlock 5M tokens and sub-100ms routing.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-black uppercase tracking-widest text-xs italic">
                Manage Subscription <ArrowRight size={14} />
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER TRUST BAR */}
      <footer className="py-12 text-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-zinc-600">Neural Node Framework v2.2</p>
        <div className="flex justify-center gap-8 text-[12px] font-black italic text-zinc-400">
           <span>STABILITY</span>
           <span>PRECISION</span>
           <span>EFFICIENCY</span>
        </div>
      </footer>

    </div>
  );
}