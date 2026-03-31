"use client";

import React, { useState } from 'react';
import { Zap, Droplets, Shield, ArrowRight, Terminal, ChevronRight, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [isRouting, setIsRouting] = useState(false);
  const [routeResult, setRouteResult] = useState<null | 'economy' | 'premium'>(null);

  const simulateRouting = () => {
    setIsRouting(true);
    setRouteResult(null);
    setTimeout(() => {
      setIsRouting(false);
      setRouteResult(Math.random() > 0.4 ? 'economy' : 'premium');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="48" fill="black"/>
              <path d="M30 70 L70 30" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round"/>
              <circle cx="30" cy="70" r="12" fill="#3f3f46"/> 
              <circle cx="70" cy="30" r="12" fill="white"/>
            </svg>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">
              NeuralRoute<span className="text-blue-500">.io</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sign-up" className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[160px] rounded-full"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <h1 className="text-6xl md:text-[110px] font-black italic tracking-tighter uppercase mb-8 leading-[0.8] text-white">
            Scale <br /> Intelligence
          </h1>
          <p className="text-zinc-500 text-lg md:text-2xl max-w-2xl mx-auto italic font-medium mb-12">
            The world's first AI Router that optimizes for cost, speed, and <span className="text-blue-400">water consumption</span>. 
          </p>
        </div>
      </section>

      {/* --- INTERACTIVE SYSTEM TEST (El Recuadro que faltaba) --- */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <div className="rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 p-1 overflow-hidden shadow-2xl">
          <div className="bg-black/50 rounded-[2.3rem] p-8 md:p-12">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Terminal size={18} className="text-blue-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Neural Node Simulator</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative">
                <textarea 
                  placeholder="Type a complex prompt here..."
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-xl md:text-2xl font-medium italic text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={2}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <button 
                  onClick={simulateRouting}
                  disabled={isRouting}
                  className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isRouting ? "Analyzing Neural Path..." : "Dispatch Prompt"} 
                  <ChevronRight size={20} />
                </button>

                <div className="flex items-center gap-8">
                  <div className={`transition-opacity duration-500 ${routeResult === 'economy' ? 'opacity-100' : 'opacity-20'}`}>
                    <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Economy Node</p>
                    <p className="text-sm font-bold text-white uppercase italic">Llama 3.1 70B</p>
                  </div>
                  <div className={`transition-opacity duration-500 ${routeResult === 'premium' ? 'opacity-100' : 'opacity-20'}`}>
                    <p className="text-[10px] font-black uppercase text-blue-500 mb-1">Premium Node</p>
                    <p className="text-sm font-bold text-white uppercase italic">GPT-4o (Reasoning)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
        <div className="space-y-6">
          <div className="p-3 bg-blue-500/10 w-fit rounded-2xl"><Zap className="text-blue-500" /></div>
          <h3 className="text-2xl font-black italic uppercase text-white">90% Savings</h3>
          <p className="text-zinc-500 text-sm italic">Economic arbitrage between Tier-1 and Open Source models.</p>
        </div>
        <div className="space-y-6">
          <div className="p-3 bg-blue-500/20 w-fit rounded-2xl"><Droplets className="text-blue-400" /></div>
          <h3 className="text-2xl font-black italic uppercase text-white">Eco-Routing</h3>
          <p className="text-zinc-500 text-sm italic">We save approximately 12L of water per dollar optimized.</p>
        </div>
        <div className="space-y-6">
          <div className="p-3 bg-blue-500/10 w-fit rounded-2xl"><Shield className="text-blue-500" /></div>
          <h3 className="text-2xl font-black italic uppercase text-white">Privacy Edge</h3>
          <p className="text-zinc-500 text-sm italic">PII redaction at the edge before transmission.</p>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center bg-black">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">
          © 2026 NeuralRoute Global | Developed in Virasoro, Argentina
        </p>
      </footer>

    </div>
  );
}