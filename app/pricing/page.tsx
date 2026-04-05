"use client";

import React from 'react';
import { Check, X, Zap, Rocket, Crown, ArrowRight, Sparkles } from 'lucide-react';

const tiers = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Test the power of NeuralRouting with zero commitment.",
    credits: "5,000 credits",
    creditsNote: "one-time",
    rateLimit: "3 RPM",
    routingModes: "Auto Only",
    uptimeGuard: "Basic",
    insights: "Basic",
    support: "Community",
    savingLabel: "FREE",
    highlight: false,
    cta: "Start Free",
    icon: <Zap className="text-zinc-500" size={18} />,
    features: [
      { label: "5,000 credits (once)", included: true },
      { label: "Auto routing mode", included: true },
      { label: "3 requests / minute", included: true },
      { label: "Basic uptime guard", included: true },
      { label: "Cost & Speed modes", included: false },
      { label: "Smart Fallback", included: false },
    ]
  },
  {
    name: "Starter",
    price: "29",
    period: "/ mo",
    description: "Perfect for side projects and independent developers.",
    credits: "50,000 credits",
    creditsNote: "per month",
    rateLimit: "60 RPM",
    routingModes: "Auto & Cost",
    uptimeGuard: "Standard",
    insights: "Basic",
    support: "Email",
    savingLabel: "SAVE $125 / MO",
    highlight: false,
    cta: "Start Saving",
    icon: <Rocket className="text-zinc-500" size={18} />,
    features: [
      { label: "50,000 credits / month", included: true },
      { label: "Auto & Cost routing", included: true },
      { label: "60 requests / minute", included: true },
      { label: "Standard uptime guard", included: true },
      { label: "7-day savings history", included: true },
      { label: "Smart Fallback", included: false },
    ]
  },
  {
    name: "Growth",
    price: "89",
    period: "/ mo",
    description: "Scalable infrastructure for growing AI companies.",
    credits: "200,000 credits",
    creditsNote: "per month",
    rateLimit: "250 RPM",
    routingModes: "All Modes",
    uptimeGuard: "Smart Fallback",
    insights: "Advanced",
    support: "Priority",
    savingLabel: "SAVE $500 / MO",
    highlight: true,
    tag: "MOST POPULAR",
    cta: "Get Started",
    icon: <Zap className="text-blue-500" size={18} />,
    features: [
      { label: "200,000 credits / month", included: true },
      { label: "All routing modes", included: true },
      { label: "250 requests / minute", included: true },
      { label: "Smart Fallback (auto-switch)", included: true },
      { label: "30-day logs + user filters", included: true },
      { label: "Advanced insights", included: true },
    ]
  },
  {
    name: "Business",
    price: "349",
    period: "/ mo",
    description: "Total control and maximum efficiency for enterprises.",
    credits: "1,000,000 credits",
    creditsNote: "per month",
    rateLimit: "1,000+ RPM",
    routingModes: "Custom Rules",
    uptimeGuard: "Priority Edge",
    insights: "Predictive",
    support: "Dedicated Slack",
    savingLabel: "MAX ROI",
    highlight: false,
    cta: "Get Started",
    icon: <Crown className="text-zinc-500" size={18} />,
    features: [
      { label: "1,000,000 credits / month", included: true },
      { label: "Custom routing rules", included: true },
      { label: "1,000+ requests / minute", included: true },
      { label: "Priority Edge infrastructure", included: true },
      { label: "Predictive insights & alerts", included: true },
      { label: "Dedicated Slack channel", included: true },
    ]
  }
];

const comparisonRows = [
  { label: "Monthly Price",        values: ["$0", "$29", "$89", "$349"] },
  { label: "Included Credits",     values: ["5,000 (once)", "50,000 /mo", "200,000 /mo", "1,000,000 /mo"] },
  { label: "Routing Modes",        values: ["Auto Only", "Auto & Cost", "All Modes", "Custom Rules"] },
  { label: "Rate Limit",           values: ["3 RPM", "60 RPM", "250 RPM", "1,000+ RPM"] },
  { label: "Uptime Guard",         values: ["Basic", "Standard", "Smart Fallback", "Priority Edge"] },
  { label: "Semantic Cache",       values: ["✓", "✓", "✓", "✓"] },
  { label: "Security Shield",      values: ["✓", "✓", "✓", "✓"] },
  { label: "Analytics & Logs",     values: ["—", "7 days", "30 days", "90 days"] },
  { label: "FinOps ROI Dashboard", values: ["—", "—", "✓", "✓"] },
  { label: "User Attribution",     values: ["—", "✓", "✓", "✓"] },
  { label: "Support",              values: ["Community", "Email", "Priority", "Dedicated Slack"] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-[#050505] text-white relative overflow-hidden font-sans">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-24">
          <div className="mb-6 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full inline-block">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">
              Teams save up to 97% on AI costs
            </p>
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
            Pay Less for AI <br />
            <span className="text-blue-600 font-black italic text-6xl md:text-8xl">At Any Scale</span>
          </h2>
          <p className="text-zinc-500 font-bold italic text-lg max-w-xl mx-auto tracking-tight opacity-80 uppercase leading-tight">
            Stop the GPT-4 Tax. Get identical quality for a fraction of the price.
          </p>
        </div>

        {/* TIER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-24">
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

              {/* Icon + saving label */}
              <div className="mb-6 flex justify-between items-start">
                <div className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 group-hover:bg-blue-600/10 transition-colors">
                  {tier.icon}
                </div>
                <span className="text-emerald-500 text-sm font-black italic tracking-tighter uppercase">
                  {tier.savingLabel}
                </span>
              </div>

              {/* Name + price */}
              <div className="mb-1">
                <h3 className="text-xl font-black italic uppercase text-zinc-400 tracking-tighter">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black italic tracking-tighter text-white">${tier.price}</span>
                  <span className="text-zinc-600 text-[9px] font-black uppercase">{tier.period}</span>
                </div>
              </div>

              {/* Credits badge */}
              <div className="mb-4">
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.15em] italic">
                  {tier.credits} <span className="text-zinc-600">{tier.creditsNote}</span>
                </span>
              </div>

              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-tight mb-6 leading-relaxed">
                {tier.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-10 flex-grow">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight">
                    {f.included
                      ? <Check size={12} className={tier.highlight ? "text-blue-500 shrink-0" : "text-zinc-500 shrink-0"} />
                      : <X size={12} className="text-zinc-800 shrink-0" />
                    }
                    <span className={f.included ? "text-zinc-400" : "text-zinc-700"}>{f.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <button
                  className={`w-full py-5 rounded-2xl font-black uppercase italic text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    tier.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 active:scale-95"
                      : "bg-white text-black hover:bg-zinc-200 shadow-xl active:scale-95"
                  }`}
                >
                  {tier.cta} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COMPARISON TABLE */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] overflow-hidden mb-24">
          <div className="p-10 border-b border-white/5">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Full Plan Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest w-1/3">Feature</th>
                  {tiers.map((t, i) => (
                    <th key={i} className={`p-6 text-center text-[10px] font-black uppercase tracking-wider ${t.highlight ? "text-blue-400" : "text-zinc-500"}`}>
                      {t.name}
                      {t.highlight && <span className="ml-1 text-blue-500">★</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                    <td className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className={`p-6 text-center text-[10px] font-bold ${tiers[j].highlight ? "text-blue-300" : "text-zinc-400"}`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 flex flex-col items-center gap-6 text-center">
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
