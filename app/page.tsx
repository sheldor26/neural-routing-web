"use client";

import React, { useState } from 'react';
import { Zap, Droplets, Shield, ChevronRight, Cpu, Activity, Globe, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<'idle' | 'routing' | 'completed' | 'error'>('idle');
  const [selectedNode, setSelectedNode] = useState<null | 'economy' | 'premium'>(null);
  const [resultText, setResultText] = useState("");

  // --- DATOS GLOBALES (Aquí irían tus constantes de la DB) ---
  const globalDollarsSaved = 12450.85;
  const globalWaterSaved = (globalDollarsSaved * 12.5).toLocaleString(); // 12.5L por cada USD

  const handleDispatch = async () => {
    if (!prompt || status === 'routing') return;
    setStatus('routing');
    setSelectedNode(null);
    setResultText("");

    try {
      // Conexión con tu motor de Python en Railway
      const response = await fetch('https://tu-api-python.railway.app/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });
      if (!response.ok) throw new Error("Gateway Timeout");
      const data = await response.json();
      setSelectedNode(data.node); 
      setResultText(data.response);
      setStatus('completed');
    } catch (error) {
      setStatus('error');
      setResultText("Error connecting to Neural Engine. Ensure Python API is live.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
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
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Pricing</Link>
            <Link href="/sign-up" className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-500 hover:text-white transition-all">
              API Access
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-12 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-600/5 blur-[180px] rounded-full pointer-events-none"></div>
        <h1 className="text-7xl md:text-[130px] font-black italic tracking-tighter uppercase mb-6 leading-[0.75] text-white">
          Scale <br /> Intelligence
        </h1>
        
        {/* --- GLOBAL SAVINGS TICKER (NUEVA SECCIÓN) --- */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 mb-12 animate-in fade-in zoom-in duration-1000">
            <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg"><DollarSign size={16} className="text-green-500" /></div>
                <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 text-left leading-none">Total Dollars Saved</p>
                    <p className="text-xl font-black italic text-white leading-none mt-1">${globalDollarsSaved.toLocaleString()}</p>
                </div>
            </div>
            <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Droplets size={16} className="text-blue-500" /></div>
                <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 text-left leading-none">Total Water Saved</p>
                    <p className="text-xl font-black italic text-white leading-none mt-1">{globalWaterSaved} Liters</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- EL SIMULADOR FUNCIONAL (TU CÓDIGO FAVORITO MEJORADO) --- */}
      <section className="max-w-5xl mx-auto px-6 pb-40">
        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r ${status === 'routing' ? 'from-blue-600 to-cyan-500 animate-pulse' : 'from-zinc-800 to-zinc-900'} rounded-[3rem] blur opacity-20 transition-all duration-1000`}></div>
          <div className="relative bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl rounded-[3rem] p-1">
            <div className="bg-black/60 rounded-[2.9rem] p-8 md:p-14">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <Activity size={18} className={status === 'routing' ? 'text-blue-500 animate-spin' : 'text-zinc-600'} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Neural Gateway Alpha v2</span>
                </div>
                <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-zinc-900/80 rounded-full border border-zinc-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Node: Neural_Core</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 flex flex-col justify-between min-h-[380px]">
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="absolute -left-6 top-1 text-blue-500/30 font-mono text-xl">{">"}</div>
                      <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Analyze routing efficiency..."
                        className="w-full bg-transparent text-2xl md:text-3xl font-bold italic text-white placeholder:text-zinc-800 focus:outline-none resize-none h-32 tracking-tighter"
                      />
                    </div>
                    {(status === 'completed' || status === 'error') && (
                      <div className="pl-8 animate-in fade-in slide-in-from-left-4 duration-700">
                        <p className={`font-black uppercase text-[10px] tracking-widest mb-2 ${status === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
                          {status === 'error' ? 'System Error:' : 'Neural Output:'}
                        </p>
                        <p className="text-zinc-400 text-lg italic font-medium leading-tight max-h-40 overflow-y-auto pr-4">
                          {resultText}
                        </p>
                      </div>
                    )}
                  </div>
                  <button onClick={handleDispatch} disabled={status === 'routing' || !prompt}
                    className="group relative flex items-center gap-4 px-8 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all active:scale-95 disabled:opacity-30 overflow-hidden w-full md:w-fit">
                    <span className="relative z-10">{status === 'routing' ? 'Consulting Neural Engine...' : 'Dispatch Prompt'}</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  {[
                    { id: 'economy', label: 'Economy Node', model: 'Llama 3.1 Efficient' },
                    { id: 'premium', label: 'Premium Node', model: 'GPT-4o Reasoning' }
                  ].map((node) => (
                    <div key={node.id} className={`p-6 rounded-2xl border transition-all duration-700 ${selectedNode === node.id ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)] scale-[1.05]' : 'bg-zinc-900/50 border-zinc-800 opacity-20 scale-95'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedNode === node.id ? 'text-blue-400' : 'text-zinc-600'}`}>{node.label}</p>
                        {selectedNode === node.id && <Zap size={14} className="text-blue-500 animate-bounce fill-blue-500" />}
                      </div>
                      <p className="text-xl font-black italic text-white uppercase tracking-tight">{node.model}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 text-center bg-black">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">
          NeuralRoute Global // 2026 // Virasoro, Argentina
        </p>
      </footer>
    </div>
  );
}