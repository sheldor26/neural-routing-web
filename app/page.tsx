"use client";

import React, { useState } from 'react';
import { Zap, Droplets, Shield, ArrowRight, BarChart3, Lock, Globe, Server, Cpu } from 'lucide-react';
import Link from 'next/link';

// --- COMPONENTE HERO (La Propuesta de Valor) ---
const Hero = () => (
  <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-black overflow-hidden pt-20 border-b border-white/5">
    {/* Efecto de Pulso Neural de fondo */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
    
    <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Neural Node Framework v2.2</span>
      </div>

      <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 leading-[0.85] text-white">
        The Intelligence <br /> 
        <span className="text-blue-500 underline decoration-zinc-800 underline-offset-8">Router</span>
      </h1>

      <p className="text-zinc-500 text-lg md:text-2xl max-w-2xl mx-auto italic font-medium mb-12 leading-tight">
        Stop overpaying for GPT-4. Our Neural Engine automatically routes simple tasks to Llama 3.1, saving up to 90% in real-time.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <button className="w-full md:w-auto px-10 py-5 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
          Get Started
        </button>
        <button className="w-full md:w-auto px-10 py-5 bg-zinc-900 text-zinc-400 border border-zinc-800 font-black uppercase italic tracking-tighter rounded-2xl hover:bg-zinc-800 transition-all">
          View Docs
        </button>
      </div>
    </div>
  </section>
);

// --- PÁGINA PRINCIPAL ---
export default function Page() {
  const [savings] = useState(0.48); 
  const [efficiency] = useState(94.2);
  const waterSaved = (savings * 12.5).toFixed(1);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. DASHBOARD SECTION (Live Demo) */}
      <section id="dashboard" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">NeuralDash<span className="text-blue-500">.io</span></h2>
          <p className="text-zinc-500 font-medium italic">Real-time optimization from the Virasoro Edge Node.</p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Total Savings */}
          <div className="relative p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 group hover:border-blue-500/30 transition-all">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Total Savings</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-white mb-2">${savings.toFixed(2)}</h2>
            <p className="text-xs text-blue-500 font-bold italic flex items-center gap-1">
              <Zap size={12} /> Yield: {efficiency}%
            </p>
          </div>

          {/* ECO IMPACT: El dato de color del agua */}
          <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex flex-col justify-between group hover:bg-blue-500/15 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Droplets size={18} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Eco-Impact</span>
              </div>
              <h2 className="text-5xl font-black italic tracking-tighter text-white mb-2">{waterSaved}L</h2>
              <p className="text-zinc-500 text-sm font-medium italic text-balance">Water saved in server cooling</p>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Neural Node Status</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-green-500"></div>
                  <div className="w-1 h-1 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold italic text-white uppercase">Economy (Groq)</span>
                <span className="text-[10px] text-green-500 font-black">9ms</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold italic text-white uppercase">Premium (O1)</span>
                <span className="text-[10px] text-zinc-500 font-black">450ms</span>
              </div>
            </div>
            <button className="mt-6 w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
              Refresh System
            </button>
          </div>

        </div>

        {/* 3. API INTEGRATION BLOCK */}
        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-zinc-900/40 to-black border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">Enterprise Grade Security</h3>
            <p className="text-zinc-500 text-sm italic mb-6">Every prompt is filtered through our Privacy Shield before routing. No data leaks, no hallucinations, just pure efficiency.</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <Shield size={14} className="text-blue-500" /> AES-256
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <Lock size={14} className="text-blue-500" /> PII REDACTED
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col gap-3">
             <div className="px-6 py-4 bg-black border border-zinc-800 rounded-2xl font-mono text-xs text-zinc-500">
                npm install @neuralroute/sdk
             </div>
             <button className="px-8 py-4 bg-blue-600 text-white font-black italic uppercase rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                Deploy Node
             </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex justify-center gap-12 mb-8 opacity-20 grayscale hover:opacity-50 transition-opacity">
           <span className="font-black italic">OPENAI</span>
           <span className="font-black italic">GROQ</span>
           <span className="font-black italic">ANTHROPIC</span>
        </div>
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">
          © 2026 NeuralRoute Global | Infrastructure by Neural Nodes
        </p>
      </footer>

    </div>
  );
}