"use client";

import React from 'react';
import { Check, Zap, Rocket, Crown, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Instant access",
    outcome: "Run ~500 requests free", // ✅ FIXED: Consistency
    savingLabel: "FREE $5 CREDIT",
    comparison: "Try Neural Routing Free", // ✅ FIXED: Action-oriented
    timeToValue: "Live in <30 seconds",
    features: [
      "1 API Key",
      "Standard Routing",
      "No Credit Card Required"
    ],
    cta: "Start Free",
    highlight: false,
    icon: <Zap className="text-zinc-500" size={20} />
  },
  {
    name: "Starter",
    price: "29",
    description: "For indie apps",
    outcome: "Handle ~15k requests/mo",
    savingLabel: "SAVE $110/MO",
    comparison: "5x cheaper than GPT-4",
    timeToValue: "Live in <2 minutes",
    features: [
      "1.5M Tokens included",
      "90% Cost Reduction",
      "Upgrade → Save 3x more" // 💰 REVENUE BOOST: Upgrade hint
    ],
    cta: "Start Saving",
    highlight: false,
    icon: <Rocket className="text-zinc-500" size={20} />
  },
  {
    name: "Growth",
    price: "89",
    description: "Scaling production",
    outcome: "Handle ~60k requests/mo",
    savingLabel: "SAVE $420/MO",
    comparison: "7x cheaper than GPT-4",
    timeToValue: "Best for most apps", // 🧠 PSYCHOLOGY: Decision reinforcement
    features: [
      "5M Tokens included",
      "Priority Routing Nodes",
      "+ $12/1M extra tokens"
    ],
    cta: "Get Started",
    highlight: true,
    tag: "MOST POPULAR",
    icon: <Zap className="text-blue-500" size={20} />
  },
  {
    name: "Business",
    price: "249",
    description: "Enterprise grade",
    outcome: "For >250k requests/mo",
    savingLabel: "MAX ROI",
    comparison: "Up to 95% cheaper than GPT-4",
    timeToValue: "Dedicated Support",
    features: [
      "Unlimited API Keys",
      "Dedicated Infrastructure",
      "Volume-based rates",
      "Custom SLA Agreements"
    ],
    cta: "Contact Sales", // ⚡ B2B STANDARD: More trust
    highlight: false,
    icon: <Crown className="text-zinc-500" size={20} />
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-[#050505] text-white relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="mb-6 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full inline-block">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">
                Teams save up to 90% on AI costs
            </p>
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
            Pay Less for AI <br/> <span className="text-blue-600 font-black italic text-6xl md:text-8xl">At Any Scale</span>
          </h2>
          <p className="text-zinc-500 font-bold italic text-lg max-w-xl mx-auto tracking-tight opacity-80 uppercase leading-tight">
              Stop the GPT-4 Tax. Get identical quality for a fraction of the price.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`relative p-8 rounded-[3.5rem] border transition-all duration-700 group flex flex-col ${
                tier.highlight 
                ? "bg-blue-600/5 border-blue-500 ring-1 ring-blue-500/50 shadow-[0_0_120px_-20px_rgba(37,99,235,0.4)] md:scale-110 z-20 pb-12" 
                : "bg-zinc-900/20 border-white/5 hover:border-white/10 pb-10"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] font-black uppercase px-6 py-1.5 rounded-full tracking-[0.2em] italic shadow-2xl flex items-center gap-2 whitespace-nowrap">
                  <Sparkles size={10} /> {tier.tag}
                </div>
              )}

              <div className="mb-6 flex justify-between items-start">
                <div className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 group-hover:bg-blue-600/10 transition-colors">
                  {tier.icon}
                </div>
                <div className="text-right">
                  <p className="text-emerald-500 text-lg font-black italic tracking-tighter uppercase">
                    {tier.savingLabel}
                  </p>
                </div>
              </div>

              <div className="mb-1">
                <h3 className="text-xl font-black italic uppercase text-zinc-400 tracking-tighter">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black italic tracking-tighter text-white">
                        ${tier.price}
                    </span>
                    <span className="text-zinc-600 text-[9px] font-black uppercase">/ mo</span>
                </div>
              </div>

              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 italic opacity-90">
                {tier.outcome}
              </p>

              <div className="mb-8 p-4 bg-black/40 rounded-[1.5rem] border border-white/5 flex items-center justify-between group/info cursor-help">
                <p className="text-zinc-200 text-[10px] font-black uppercase tracking-tight italic">
                  {tier.comparison}
                </p>
                <div className="relative">
                    <HelpCircle size={12} className="text-zinc-600 group-hover/info:text-blue-500 transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-[8px] font-bold uppercase tracking-widest text-zinc-400 opacity-0 group-hover/info:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-2xl">
                        Based on GPT-4 avg pricing ($0.01/req)
                    </div>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-tight leading-tight">
                    <Check size={12} className={tier.highlight ? "text-blue-500" : "text-zinc-700"} />
                    <span className={feature.includes("Upgrade") ? "text-emerald-500/80" : ""}>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-center mt-auto">
                <button 
                    className={`w-full py-5 rounded-2xl font-black uppercase italic text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    tier.highlight 
                    ? "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 active:scale-95" 
                    : tier.name === "Business"
                    ? "bg-zinc-800 text-white border border-white/20 hover:bg-zinc-700 shadow-xl active:scale-95"
                    : "bg-white text-black hover:bg-zinc-200 shadow-xl active:scale-95"
                    }`}
                >
                    {tier.cta} <ArrowRight size={14} />
                </button>
                <p className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.4em] italic flex items-center justify-center gap-2">
                   {tier.highlight && <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />}
                   {tier.timeToValue}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center gap-6 text-center">
            <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale contrast-125">
                <span className="text-xs font-black italic uppercase tracking-widest">LangChain</span>
                <span className="text-xs font-black italic uppercase tracking-widest">OpenAI</span>
                <span className="text-xs font-black italic uppercase tracking-widest">Anthropic</span>
                <span className="text-xs font-black italic uppercase tracking-widest">Llama-3</span>
            </div>
            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">
                NeuralRouting Engine v2.4 • High Performance Guaranteed • PCI Compliant
            </p>
        </div>
      </div>
    </section>
  );
}
