"use client";

import React from 'react';
import { Zap, Droplets, Shield, ArrowRight, Globe, Cpu, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap size={22} className="text-blue-500 fill-blue-500/20" />
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">
              NeuralRoute<span className="text-blue-500">.io</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Login</Link>
            <Link href="/sign-up" className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Neural Node Framework v2.2</span>
          </div>

          <h1 className="text-6xl md:text-[120px] font-black italic tracking-tighter uppercase mb-8 leading-[0.8] text-white">
            Scale <br /> Intelligence
          </h1>

          <p className="text-zinc-500 text-xl md:text-2xl max-w-2xl mx-auto italic font-medium mb-12 leading-tight">
            The world's first AI Router that optimizes for cost, speed, and <span className="text-blue-400">water consumption</span>. 
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="w-full md:w-auto px-12 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.2)]">
              Deploy Your First Node
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES / ECO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <div className="p-10 rounded-[3rem] bg-zinc-900/20 border border-zinc-900 hover:border-blue-500/30 transition-all group">
          <div className="p-3 bg-blue-500/10 w-fit rounded-2xl mb-8 group-hover:bg-blue-500/20 transition-colors">
            <Zap className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">90% Cost Reduction</h3>
          <p className="text-zinc-500 text-sm italic leading-relaxed">Automatically route 80% of your traffic to efficient Llama 3.1 nodes while keeping GPT-4o only for high-reasoning tasks.</p>
        </div>

        <div className="p-10 rounded-[3rem] bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 transition-all group">
          <div className="p-3 bg-blue-500/20 w-fit rounded-2xl mb-8">
            <Droplets className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">Eco-Logic Routing</h3>
          <p className="text-zinc-500 text-sm italic leading-relaxed">By reducing GPU heat dissipation, every request saves up to <span className="text-blue-400 font-bold">12L of water</span> per dollar optimized. AI that loves the planet.</p>
        </div>

        <div className="p-10 rounded-[3rem] bg-zinc-900/20 border border-zinc-900 hover:border-blue-500/30 transition-all group">
          <div className="p-3 bg-blue-500/10 w-fit rounded-2xl mb-8 group-hover:bg-blue-500/20 transition-colors">
            <Shield className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">Neural Privacy</h3>
          <p className="text-zinc-500 text-sm italic leading-relaxed">On-edge PII redaction. Your sensitive data never reaches the LLM providers. Secure, compliant, and lightning fast.</p>
        </div>

      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          © 2026 NeuralRoute Global | Infrastructure by Neural Nodes
        </p>
      </footer>

    </div>
  );
}