"use client";
import React, { useState } from 'react';
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';

const PROVIDERS = [
  { name: "OpenAI (GPT-4o)", costPer1M: 12.50 },
  { name: "Anthropic (Claude Sonnet)", costPer1M: 9.00 },
  { name: "Google (Gemini Pro)", costPer1M: 7.00 },
  { name: "Mixed / Multi-provider", costPer1M: 10.00 },
];

const USAGE_PRESETS = [
  { label: "Startup", tokens: 5_000_000, desc: "Early stage, < 1K users" },
  { label: "Growth", tokens: 25_000_000, desc: "Scaling, 1K–10K users" },
  { label: "Scale", tokens: 100_000_000, desc: "Production, 10K+ users" },
  { label: "Enterprise", tokens: 500_000_000, desc: "High volume, 100K+ users" },
];

export default function SavingsCalculator() {
  const [tokens, setTokens] = useState(25_000_000);
  const [providerIdx, setProviderIdx] = useState(0);
  const [complexMix, setComplexMix] = useState(20); // % of requests that NEED premium

  const provider = PROVIDERS[providerIdx];

  // Model Tax = cost of sending ALL requests to premium when only `complexMix`% need it
  const monthlyCostAllPremium = (tokens / 1_000_000) * provider.costPer1M;

  // NeuralRouting: only complexMix% goes to premium, rest goes to economy ($0.20/1M avg)
  const premiumTokens = tokens * (complexMix / 100);
  const economyTokens = tokens * (1 - complexMix / 100);
  const neuralCost = (premiumTokens / 1_000_000) * provider.costPer1M + (economyTokens / 1_000_000) * 0.20;

  // Cache savings (assume 25% cache hit rate on economy)
  const cacheSavings = (economyTokens * 0.25 / 1_000_000) * 0.20;
  const finalNeuralCost = Math.max(neuralCost - cacheSavings, 0.01);

  const monthlySavings = monthlyCostAllPremium - finalNeuralCost;
  const annualSavings = monthlySavings * 12;
  const savingsPct = monthlyCostAllPremium > 0 ? (monthlySavings / monthlyCostAllPremium) * 100 : 0;
  const modelTax = monthlyCostAllPremium - (premiumTokens / 1_000_000) * provider.costPer1M;

  const currentCostRef = useAnimatedValue(monthlyCostAllPremium);
  const modelTaxRef = useAnimatedValue(modelTax);
  const neuralCostRef = useAnimatedValue(finalNeuralCost);
  const annualRef = useAnimatedValue(annualSavings);

  return (
    <div className="max-w-5xl mx-auto rounded-[3rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-700">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700" />

      <div className="relative z-10 p-8 md:p-12 space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.3em] mb-2">The Model Tax</p>
            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white leading-tight">
              You&apos;re overpaying <span className="text-red-400">${modelTax.toFixed(0)}/mo</span> on simple tasks
            </h3>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase max-w-xs">
            The Model Tax is what you pay sending every request to a premium model when most don&apos;t need it.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Provider */}
          <div className="space-y-3">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Current Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setProviderIdx(i)}
                  className={`px-3 py-2.5 rounded-xl text-[9px] font-bold border transition-all text-left ${
                    providerIdx === i
                      ? 'bg-blue-600/10 border-blue-500/30 text-white'
                      : 'border-white/5 text-zinc-600 hover:border-white/10'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly volume */}
          <div className="space-y-3">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              Monthly Volume: <span className="text-white ml-1">{(tokens / 1_000_000).toFixed(0)}M tokens</span>
            </label>
            <input
              type="range" min={1_000_000} max={1_000_000_000} step={1_000_000}
              value={tokens}
              onChange={(e) => setTokens(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex gap-2">
              {USAGE_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setTokens(p.tokens)}
                  className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border transition-all ${
                    tokens === p.tokens ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-white/5 text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity mix */}
          <div className="space-y-3">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              Premium-needed requests: <span className="text-white ml-1">{complexMix}%</span>
            </label>
            <input
              type="range" min={5} max={80} step={5}
              value={complexMix}
              onChange={(e) => setComplexMix(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[8px] text-zinc-600 font-bold">
              {complexMix <= 20 ? "Most apps: 80% of requests are simple (Q&A, classification, extraction)" :
               complexMix <= 40 ? "Moderate complexity: mix of reasoning + simple tasks" :
               "High complexity: heavy reasoning, code gen, multi-step analysis"}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Current cost */}
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
            <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-2">Current Cost</p>
            <p className="text-3xl font-black italic text-red-400 tracking-tighter">
              <span ref={currentCostRef}>${Math.round(monthlyCostAllPremium).toLocaleString()}</span><span className="text-sm">/mo</span>
            </p>
            <p className="text-[8px] text-zinc-600 mt-1">100% premium model</p>
          </div>

          {/* Model Tax */}
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center">
            <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest mb-2">Model Tax</p>
            <p className="text-3xl font-black italic text-amber-400 tracking-tighter">
              <span ref={modelTaxRef}>${Math.round(modelTax).toLocaleString()}</span><span className="text-sm">/mo</span>
            </p>
            <p className="text-[8px] text-zinc-600 mt-1">Wasted on simple tasks</p>
          </div>

          {/* Neural cost */}
          <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center">
            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2">With NeuralRouting</p>
            <p className="text-3xl font-black italic text-blue-400 tracking-tighter">
              <span ref={neuralCostRef}>${Math.round(finalNeuralCost).toLocaleString()}</span><span className="text-sm">/mo</span>
            </p>
            <p className="text-[8px] text-zinc-600 mt-1">Routing + caching</p>
          </div>

          {/* Annual savings */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-center shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
            <p className="text-[8px] font-black text-emerald-200 uppercase tracking-widest mb-2">Annual Savings</p>
            <p className="text-3xl font-black italic text-white tracking-tighter">
              <span ref={annualRef}>${Math.round(annualSavings).toLocaleString()}</span>
            </p>
            <p className="text-[8px] text-emerald-200 mt-1 font-bold">{savingsPct.toFixed(0)}% cost reduction</p>
          </div>
        </div>

        {/* Savings breakdown bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
            <span className="text-zinc-600">Cost Breakdown</span>
            <span className="text-emerald-400">{savingsPct.toFixed(0)}% saved</span>
          </div>
          <div className="h-3 w-full bg-red-500/20 rounded-full overflow-hidden flex">
            <div className="bg-blue-500 h-full rounded-l-full transition-all duration-500" style={{ width: `${(finalNeuralCost / monthlyCostAllPremium) * 100}%` }} />
            <div className="bg-emerald-500 h-full rounded-r-full transition-all duration-500 flex-1" />
          </div>
          <div className="flex justify-between text-[8px] font-bold">
            <span className="text-blue-400">NeuralRouting cost</span>
            <span className="text-emerald-400">Your savings</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-blue-600/5 border border-blue-500/20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400">
              <Shield size={14} className="text-blue-400" /> Quality guaranteed
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400">
              <Zap size={14} className="text-blue-400" /> 2 lines to integrate
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400">
              <BarChart3 size={14} className="text-blue-400" /> Free tier available
            </div>
          </div>
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shadow-xl"
          >
            Eliminate Your Model Tax <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
