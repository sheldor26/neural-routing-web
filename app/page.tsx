"use client";

import React, { useState } from 'react';
import { Zap, ChevronRight, Activity, Terminal } from 'lucide-react';

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<'idle' | 'routing' | 'completed'>('idle');
  const [selectedNode, setSelectedNode] = useState<null | 'economy' | 'premium'>(null);
  const [resultText, setResultText] = useState("");

  const handleDispatch = () => {
    if (!prompt) return;
    setStatus('routing');
    setSelectedNode(null);
    setResultText("");

    setTimeout(() => {
      // Lógica de ruteo simplificada
      const isComplex = prompt.length > 50 || prompt.includes("?") || prompt.includes("solve");
      const node = isComplex ? 'premium' : 'economy';
      
      setSelectedNode(node);
      setStatus('completed');
      
      // Respuesta simulada según el nodo
      setResultText(node === 'premium' 
        ? "Analysis complete: High-reasoning path utilized for precise output." 
        : "Optimization successful: Prompt resolved via efficient Economy Node.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 px-6">
      <section className="max-w-5xl mx-auto">
        <div className="relative bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl rounded-[3rem] p-1 shadow-2xl">
          <div className="bg-black/60 rounded-[2.9rem] p-8 md:p-14">
            
            {/* Header del Simulador */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <Activity size={18} className={status === 'routing' ? 'text-blue-500 animate-spin' : 'text-zinc-600'} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Neural Gateway Alpha v2</span>
              </div>
              <div className="px-4 py-1.5 bg-zinc-900/80 rounded-full border border-zinc-800">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Node: Virasoro_Core</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Columna Izquierda: Input y Resultado */}
              <div className="lg:col-span-7 flex flex-col justify-between min-h-[300px]">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="text-blue-500 font-mono text-2xl pt-1">{">"}</span>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter prompt..."
                      className="w-full bg-transparent text-3xl md:text-4xl font-black italic text-white placeholder:text-zinc-800 focus:outline-none resize-none"
                      rows={2}
                    />
                  </div>

                  {/* CAJA DE RESULTADO (Aparece cuando termina el ruteo) */}
                  {status === 'completed' && (
                    <div className="pl-8 animate-in fade-in slide-in-from-left-4 duration-700">
                      <p className="text-blue-500 font-black uppercase text-[10px] tracking-widest mb-2">Output:</p>
                      <p className="text-zinc-400 text-lg italic font-medium leading-tight">
                        {resultText}
                      </p>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleDispatch}
                  disabled={status === 'routing' || !prompt}
                  className="w-full md:w-fit mt-8 px-10 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {status === 'routing' ? 'Analyzing Path...' : 'Dispatch Prompt'} 
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Columna Derecha: Nodos Limpios */}
              <div className="lg:col-span-5 space-y-4">
                {[
                  { id: 'economy', label: 'Economy Node', sub: 'Llama 3.1 Optimized' },
                  { id: 'premium', label: 'Premium Node', sub: 'O-Tier Intelligence' }
                ].map((node) => (
                  <div 
                    key={node.id}
                    className={`p-8 rounded-[2rem] border transition-all duration-700 ${
                      selectedNode === node.id 
                      ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-[1.05]' 
                      : 'bg-zinc-900/50 border-zinc-800 opacity-20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedNode === node.id ? 'text-blue-400' : 'text-zinc-600'}`}>
                        {node.label}
                      </p>
                      {selectedNode === node.id && <Zap size={14} className="text-blue-500 fill-blue-500" />}
                    </div>
                    <p className="text-xl font-black italic text-white uppercase tracking-tight">{node.sub}</p>
                    
                    {/* Barra de progreso visual cuando está seleccionado */}
                    {selectedNode === node.id && (
                      <div className="mt-4 h-[2px] w-full bg-blue-500/20 overflow-hidden">
                        <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out]"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}