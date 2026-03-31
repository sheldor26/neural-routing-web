"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Droplets, Shield, ArrowRight, Terminal, ChevronRight, Cpu, Activity, Database } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<'idle' | 'routing' | 'completed'>('idle');
  const [selectedNode, setSelectedNode] = useState<null | 'economy' | 'premium'>(null);

  const handleDispatch = () => {
    if (!prompt) return;
    setStatus('routing');
    setSelectedNode(null);

    // Simulamos el algoritmo de scoring de Neural Node
    setTimeout(() => {
      // Si el prompt es muy largo o complejo, elegimos Premium
      const isComplex = prompt.length > 50 || prompt.toLowerCase().includes("logic") || prompt.toLowerCase().includes("code");
      setSelectedNode(isComplex ? 'premium' : 'economy');
      setStatus('completed');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
              <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                <path d="M30 70 L70 30" stroke="black" strokeWidth="15" strokeLinecap="round"/>
                <circle cx="30" cy="70" r="14" fill="#3b82f6"/> 
                <circle cx="70" cy="30" r="14" fill="#3f3f46"/>
              </svg>
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">
              NeuralRoute<span className="text-blue-500">.io</span>
            </span>
          </div>
          <Link href="/sign-up" className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-500 hover:text-white transition-all">
            Get API Access
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-12 flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-600/5 blur-[180px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-7xl md:text-[130px] font-black italic tracking-tighter uppercase mb-6 leading-[0.75] text-white">
            Scale <br /> Intelligence
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto italic font-medium mb-12 leading-tight">
            Stop overpaying for Tier-1 models. Route prompts with <span className="text-blue-400">Neural Node</span> efficiency.
          </p>
        </div>
      </section>

      {/* --- REDISEÑO DEL CUADRO DE PRUEBA (THE SIMULATOR) --- */}
      <section className="max-w-5xl mx-auto px-6 pb-40">
        <div className="relative group">
          {/* Background Glow dinámico */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${status === 'routing' ? 'from-blue-600 to-cyan-500 animate-pulse' : 'from-zinc-800 to-zinc-900'} rounded-[3rem] blur opacity-20 transition-all duration-1000`}></div>
          
          <div className="relative bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl rounded-[3rem] p-1">
            <div className="bg-black/60 rounded-[2.9rem] p-8 md:p-14">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <Activity size={18} className={`${status === 'routing' ? 'text-blue-500 animate-spin' : 'text-zinc-600'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Neural Gateway Alpha v2</span>
                </div>
                <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-zinc-900/80 rounded-full border border-zinc-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Node: Virasoro_Core</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Input Area */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-6 top-1 text-blue-500/30 font-mono text-xl">{">"}</div>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter a prompt to analyze routing cost..."
                      className="w-full bg-transparent text-2xl md:text-3xl font-bold italic text-white placeholder:text-zinc-800 focus:outline-none resize-none h-32 tracking-tighter"
                    />
                  </div>
                  
                  <button 
                    onClick={handleDispatch}
                    disabled={status === 'routing' || !prompt}
                    className="group relative flex items-center gap-4 px-8 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all active:scale-95 disabled:opacity-30 overflow-hidden"
                  >
                    <span className="relative z-10">{status === 'routing' ? 'Routing...' : 'Dispatch Prompt'}</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Visual Feedback Area */}
                <div className="lg:col-span-5 space-y-4">
                  {[
                    { id: 'economy', label: 'Economy Node', model: 'Llama 3.1 (Groq)', color: 'zinc' },
                    { id: 'premium', label: 'Premium Node', model: 'GPT-4o (Reasoning)', color: 'blue' }
                  ].map((node) => (
                    <div 
                      key={node.id}
                      className={`p-6 rounded-2xl border transition-all duration-700 ${
                        selectedNode === node.id 
                        ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)] scale-[1.02]' 
                        : 'bg-zinc-900/50 border-zinc-800 opacity-30 scale-95'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedNode === node.id ? 'text-blue-400' : 'text-zinc-600'}`}>
                          {node.label}
                        </p>
                        {selectedNode === node.id && <Zap size={14} className="text-blue-500 animate-bounce" />}
                      </div>
                      <p className="text-lg font-black italic text-white uppercase tracking-tight">{node.model}</p>
                      {selectedNode === node.id && (
                        <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out]" style={{width: '100%'}}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 bg-black">
        <div className="space-y-4">
          <Droplets className="text-blue-500" size={32} />
          <h4 className="text-xl font-black italic uppercase text-white tracking-tighter">Water Saved</h4>
          <p className="text-zinc-500 text-sm italic">Every optimized call reduces 12L of server cooling water.</p>
        </div>
        <div className="space-y-4">
          <Shield className="text-blue-500" size={32} />
          <h4 className="text-xl font-black italic uppercase text-white tracking-tighter">Privacy Guard</h4>
          <p className="text-zinc-500 text-sm italic">On-edge PII redaction before any model sees your data.</p>
        </div>
        <div className="space-y-4">
          <Cpu className="text-blue-500" size={32} />
          <h4 className="text-xl font-black italic uppercase text-white tracking-tighter">90% Efficiency</h4>
          <p className="text-zinc-500 text-sm italic">Hardware-level routing from the Virasoro Edge Node.</p>
        </div>
      </section>

      <footer className="py-20 text-center text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em]">
        NeuralRoute Global // 2026
      </footer>

    </div>
  );
}