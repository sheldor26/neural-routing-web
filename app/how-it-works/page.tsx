"use client";

import React from 'react';
import { Zap, Shield, Cpu, BarChart3, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Zap className="text-blue-500" size={32} />,
      title: "1. Prompt Ingestion",
      description: "Your request enters the Neural Gateway. We analyze the complexity, intent, and required reasoning level of your prompt in real-time.",
      detail: "Using lightweight NLP, we determine if the task requires 'Heavy Reasoning' (Math, Logic, Coding) or 'Fast Execution' (Chat, Summarization)."
    },
    {
      icon: <Cpu className="text-blue-500" size={32} />,
      title: "2. Dynamic Routing",
      description: "The Neural Router selects the most cost-effective AI model capable of solving your specific task without quality loss.",
      detail: "Why pay for GPT-4o if a 10x cheaper model can summarize a text with 99.9% accuracy? Our router handles that decision for you."
    },
    {
      icon: <Shield className="text-blue-500" size={32} />,
      title: "3. Execution & Validation",
      description: "The prompt is executed through our secure nodes. We ensure low latency and high availability across multiple providers.",
      detail: "Built-in redundancy means if one provider is down, the Neural Node automatically switches to a backup, ensuring 99.9% uptime."
    },
    {
      icon: <BarChart3 className="text-blue-500" size={32} />,
      title: "4. Arbitrage Reporting",
      description: "Every cent saved is recorded. You can track your real-time savings and environmental impact directly on your Dashboard.",
      detail: "We calculate the difference between the 'Premium Cost' and the 'Optimized Cost' to show you exactly how much your business is scaling."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- NAV --- */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Dash</span>
          </Link>
          <span className="text-xl font-black italic uppercase tracking-tighter text-white">
            NeuralDash<span className="text-blue-500">.io</span>
          </span>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-6 uppercase">
          How It <span className="text-blue-500 text-stroke-white">Works</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">
          The Neural Routing protocol optimizes AI expenses by dynamically switching between models based on task complexity. 
          Maximize intelligence, minimize waste.
        </p>
      </header>

      {/* --- STEPS GRID --- */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="group relative p-8 md:p-12 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 hover:border-blue-500/30 transition-all shadow-2xl overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                {step.icon}
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  {step.icon}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-lg font-medium mb-6 leading-snug">
                    {step.description}
                  </p>
                  <div className="bg-black/50 border border-white/5 p-6 rounded-2xl">
                    <p className="text-xs text-zinc-500 font-bold uppercase italic tracking-widest leading-relaxed">
                      <span className="text-blue-500 mr-2">// Neural Insight:</span>
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <Link href="/dashboard">
          <div className="p-12 rounded-[3.5rem] bg-blue-600 text-white flex flex-col items-center justify-center text-center group hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/20">
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-6">
              Ready to Optimize?
            </h3>
            <div className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter text-sm flex items-center gap-3 group-hover:scale-105 transition-transform">
              Launch Dashboard <ChevronRight size={20} />
            </div>
          </div>
        </Link>
      </section>

      <footer className="py-12 text-center opacity-30 border-t border-white/5 bg-black/20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">NeuralDash Protocol // Global Node // 2026</p>
      </footer>
    </div>
  );
}