"use client";

import React from 'react';
import { Zap, Shield, Cpu, BarChart3, ChevronRight, ArrowLeft, Database, RefreshCw, Lock, GitMerge } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    icon: <Database size={28} className="text-yellow-400" />,
    label: "Step 0",
    title: "Semantic Cache Check",
    description: "Before anything else, the prompt is hashed and matched against the semantic cache. If a similar prompt was routed before, the answer comes back instantly — no model call, zero cost.",
    insight: "Two-level lookup: exact SHA-256 hash (< 1ms, free) → cosine similarity via pgvector (threshold: 0.92). The cache grows smarter with every request.",
  },
  {
    icon: <Lock size={28} className="text-violet-400" />,
    label: "Step 1",
    title: "Security Shield Scan",
    description: "Every prompt is scanned by a real-time heuristic engine that detects prompt injection, DAN jailbreaks, system-prompt extraction, and token-smuggling attacks.",
    insight: "Pure regex/heuristic — no LLM call, under 1ms. Three tiers: CRITICAL and HIGH patterns are blocked (HTTP 403). MEDIUM patterns are flagged and logged.",
  },
  {
    icon: <Zap size={28} className="text-blue-400" />,
    label: "Step 2",
    title: "Prompt Analysis & Classification",
    description: "A lightweight intent model classifies the task type (coding, summarization, reasoning, chat...) and complexity score in real-time.",
    insight: "This classification drives all downstream decisions — routing mode, confidence matrix lookup, and shadow engine triggers.",
  },
  {
    icon: <GitMerge size={28} className="text-blue-400" />,
    label: "Step 3",
    title: "Confidence Matrix Lookup",
    description: "Before routing, the engine checks a live quality matrix: has this model/task-type combination historically produced poor results? If yes, it auto-escalates to a premium model.",
    insight: "Matrix is rebuilt from shadow audit data every 30 minutes. Pairs with < 20 samples are skipped to avoid cold-start false positives.",
  },
  {
    icon: <Cpu size={28} className="text-emerald-400" />,
    label: "Step 4",
    title: "Dynamic Model Routing",
    description: "The router selects the cheapest model capable of handling the task at the required quality level — Auto, Cost, Speed, Quality, or your Custom rules.",
    insight: "Why pay for GPT-4o if a 10x cheaper model handles summarization at 99.9% accuracy? The router makes that call per request, in milliseconds.",
  },
  {
    icon: <Shield size={28} className="text-orange-400" />,
    label: "Step 5",
    title: "Shadow Quality Validation",
    description: "For economy-tier responses, a silent A/B check runs in the background to validate quality before committing the routing decision to the confidence matrix.",
    insight: "If the shadow check flags a poor response, the result is escalated to a premium model automatically. This data feeds back into the confidence matrix.",
  },
  {
    icon: <RefreshCw size={28} className="text-emerald-400" />,
    label: "Step 6",
    title: "Feedback Loop & Learning",
    description: "Every shadow audit result updates the confidence matrix. Over time, routing decisions improve automatically without any manual configuration.",
    insight: "This is the data moat: a competitor running the same code today starts with zero historical quality data. Your routing gets better as your traffic grows.",
  },
  {
    icon: <BarChart3 size={28} className="text-blue-400" />,
    label: "Step 7",
    title: "FinOps Attribution & Reporting",
    description: "Every cent saved is recorded. Per-user attribution, daily cost series, and ROI vs GPT-4o benchmark are all tracked in real-time.",
    insight: "Use the User Attribution field to track spend per end-user, generate monthly PDF reports, and show your CFO exactly how much AI routing saves.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">

      {/* NAV */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </Link>
          <span className="text-lg font-black italic uppercase tracking-tighter text-white">
            NEURAL<span className="text-blue-500">ROUTING</span>
          </span>
          <Link href="/docs" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
            Docs →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Architecture</p>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-5 uppercase leading-none">
          How It <span className="text-blue-500">Works</span>
        </h1>
        <p className="text-zinc-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Every request passes through 8 layers — cache, security, classification, quality matrix, routing, validation, learning, and reporting.
        </p>
      </header>

      {/* STEPS */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-6">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/8 transition-colors">
                  {step.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">{step.label}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                <div className="bg-black/40 border border-white/5 px-5 py-3 rounded-xl">
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider leading-relaxed">
                    <span className="text-blue-500 mr-2">// Neural Insight:</span>
                    {step.insight}
                  </p>
                </div>
              </div>
            </div>

            {/* Connector line between steps */}
            {i < STEPS.length - 1 && (
              <div className="absolute -bottom-3 left-11 w-px h-6 bg-white/5" />
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <Link href="/dashboard">
          <div className="p-10 rounded-[2.5rem] bg-blue-600 text-white flex flex-col items-center justify-center text-center group hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/20">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
              Ready to route smarter?
            </h3>
            <div className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter text-sm flex items-center gap-3 group-hover:scale-105 transition-transform">
              Launch Dashboard <ChevronRight size={16} />
            </div>
          </div>
        </Link>
      </section>

      <footer className="py-10 text-center border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">
          © 2026 NeuralRouting.io
        </p>
      </footer>
    </div>
  );
}
