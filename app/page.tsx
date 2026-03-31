"use client";

import React from 'react';
import { Zap, Droplets, Shield, ArrowRight, CheckCircle2, Globe, Cpu } from 'lucide-react';
import Link from 'next/link';

// --- NAV BAR MINIMALISTA ---
const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Tu Logo Minimalista de los dos puntos conectados */}
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <Link href="/sign-in" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Login</Link>
        <Link href="/sign-up" className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all">
          Start Free
        </Link>
      </div>
    </div>
  </nav>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* El resplandor del Neural Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 mb-8 animate-fade-in">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Neural Node Framework v2.2</span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-black italic tracking-tighter uppercase mb-8 leading-[0.8] text-white">
            Scale <br /> Intelligence
          </h1>

          <p className="text-zinc-500 text-lg md:text-2xl max-w-2xl mx-auto italic font-medium mb-12 leading-tight">
            Stop overpaying for LLMs. Our Neural Router automatically shifts traffic to efficient nodes, saving you <span className="text-white">90% on costs</span> and <span className="text-blue-400">liters of water</span> per request.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="w-full md:w-auto px-12 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2">
              Deploy Your Node <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITIONS --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
        
        {/* Cost Feature */}
        <div className="space-y-6">
          <div className="p-3 bg-blue-500/10 w-fit rounded-2xl">
            <Zap className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Economic Arbitrage</h3>
          <p className="text-zinc-500 text-sm italic leading-relaxed">
            Route 85% of prompts to Llama 3.1 70B via our high-speed Neural Nodes. Reserve Premium Tier models only for complex reasoning.
          </p>
        </div>

        {/* ECO Feature - Tu idea del agua */}
        <div className="space-y-6">
          <div className="p-3 bg-blue-500/20 w-fit rounded-2xl">
            <Droplets className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Water Efficiency</h3>
          <p className="text-zinc-500 text-sm italic leading-relaxed">
            Every optimized request reduces GPU thermal dissipation. We save approximately <span className="text-blue-400 font-bold">12L of water</span> per dollar saved in API costs.
          </p>
        </div>

        {/* Privacy Feature */}
        <div className="space-y-6">
          <div className="p-3 bg-blue-500/10 w-fit rounded-2xl">
            <Shield className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Privacy Guard</h3>
          <p className="text-zinc-500 text-sm italic leading-relaxed">
            Enterprise-grade PII redaction at the edge. Your raw data never leaves the routing layer, ensuring GDPR and SOC2 compliance.
          </p>
        </div>

      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 text-center bg-black">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          © 2026 NeuralRoute Global | Developed in Virasoro, Argentina
        </p>
        <div className="flex justify-center gap-8 text-[10px] font-black italic text-zinc-800 uppercase tracking-widest">
           <span>Infrastructure</span>
           <span>•</span>
           <span>Efficiency</span>
           <span>•</span>
           <span>Sustainability</span>
        </div>
      </footer>

    </div>
  );
}