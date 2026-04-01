"use client";
import React, { useState, useEffect } from 'react';
import { DollarSign, Droplets, Zap, TrendingDown } from 'lucide-react';

export default function SavingsCalculator() {
  const [tokens, setTokens] = useState(5000000); // 5M tokens default
  const [premiumPercent, setPremiumPercent] = useState(100); // % actual en modelos caros

  // Lógica de cálculo (Promedio: $15 por 1M tokens Premium vs $2 ruteado por Neural)
  const currentCost = (tokens / 1000000) * 15;
  const neuralCost = (tokens / 1000000) * 2.5; 
  const savings = currentCost - neuralCost;
  const waterSaved = (savings / 10) * 12.5; // Basado en tu métrica de 12.5L por cada ahorro

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-[3rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-700">
      
      {/* Background Effect */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Lado Izquierdo: Inputs */}
        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500 mb-8 italic">Infrastructure Audit</h3>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Monthly Token Volume: <span className="text-white ml-2">{(tokens / 1000000).toFixed(1)}M</span>
            </label>
            <input 
              type="range" min="1000000" max="100000000" step="1000000"
              value={tokens}
              onChange={(e) => setTokens(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4">
            <div className="p-3 bg-blue-600/10 rounded-xl">
              <TrendingDown className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-xs text-zinc-400 italic leading-relaxed">
                Neural Routing automatically shifts <span className="text-white font-bold">85%</span> of your non-reasoning tasks to optimized economy nodes.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Resultados */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_20px_50px_rgba(37,99,235,0.3)] transform hover:scale-[1.02] transition-transform duration-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-2">Annual Projected Savings</p>
            <div className="flex items-baseline gap-1 text-5xl font-black italic tracking-tighter text-white">
              <span className="text-2xl">$</span>
              {(savings * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="mt-6 flex items-center gap-2 py-2 px-4 bg-white/10 rounded-full w-fit border border-white/10">
              <Droplets size={14} className="text-blue-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {waterSaved.toLocaleString()}L Water Conserved
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-[2rem] bg-zinc-900/80 border border-zinc-800 text-center">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cost Reduction</p>
              <p className="text-2xl font-black italic text-green-500">-83%</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-zinc-900/80 border border-zinc-800 text-center">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Efficiency Gain</p>
              <p className="text-2xl font-black italic text-blue-500">12.5x</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}