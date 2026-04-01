"use client";

import { Check, Zap, Rocket, Crown, ArrowRight, TrendingDown, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      savings: "Save ~$110/mo*",
      tokens: "1.5M tokens",
      equivalence: "≈ $140 GPT-4 Value", // Claridad absoluta
      description: "Perfect for indie hackers & side projects.",
      features: ["90% Cost Reduction", "Standard Neural Routing", "Economy Node Access", "Setup in 30 seconds"],
      icon: <Rocket className="text-zinc-400" size={24} />,
      buttonText: "Analyze My Savings", // CTA de Onboarding
      highlight: false
    },
    {
      name: "Growth",
      price: "$89",
      savings: "Save ~$420/mo*",
      tokens: "5M tokens",
      equivalence: "≈ $510 GPT-4 Value", // Claridad absoluta
      description: "Scaling startups needing maximum margin.",
      features: ["Priority Neural Routing", "Premium Node Access", "Real-time Cost Optimization", "Guaranteed Savings SLA"],
      icon: <Zap className="text-blue-500" size={24} />,
      buttonText: "Claim My Margin", // CTA Agresivo
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      savings: "Unlimited ROI",
      tokens: "20M+ tokens",
      equivalence: "Volume-based pricing",
      description: "High-volume teams with custom needs.",
      features: ["Custom Model Training", "Dedicated Node Location", "Volume Discounts", "Unlimited API Keys"],
      icon: <Crown className="text-white" size={24} />,
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none"></div>

      {/* Header con Urgencia y Anclaje */}
      <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Free tier available // <span className="text-white">Active Nodes: 124</span>
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 leading-none">
          It's Costing You <br/> <span className="text-zinc-800 text-outline underline decoration-blue-600/30">Not To Switch</span>
        </h1>
        
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto italic font-medium">
          Your current GPT-4 bill is inflated by 90%. Our neural nodes route your traffic for maximum efficiency. 
          <span className="text-white font-bold block mt-2">Intelligence is a commodity. Margin is your edge.</span>
        </p>
      </div>

      {/* Grid de Planes */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${
              plan.highlight 
              ? 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_50px_rgba(59,130,246,0.1)] scale-105' 
              : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[9px] font-black px-6 py-1.5 rounded-full uppercase tracking-[0.2em] italic">
                Max Efficiency Node
              </div>
            )}
            
            <div className="mb-10">
              <div className="p-4 bg-zinc-900/80 w-fit rounded-2xl border border-zinc-800 mb-8 shadow-inner">
                {plan.icon}
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">{plan.name}</h3>
              
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white italic tracking-tighter">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-zinc-600 font-bold text-sm">/ MO</span>}
              </div>
              
              {/* ROI Check & Mental Calculator */}
              <div className="flex flex-col gap-1 mb-6">
                <p className="text-green-500 font-black text-xs uppercase italic">{plan.savings}</p>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-tight">{plan.equivalence}</p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg w-fit">
                <Calculator size={12} className="text-blue-400" />
                <p className="text-blue-400 font-black uppercase text-[9px] tracking-widest">{plan.tokens} Included</p>
              </div>
            </div>

            <div className="space-y-5 mb-12 flex-grow">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-medium italic text-zinc-400">
                  <div className="p-1 bg-zinc-800 rounded-full">
                    <Check size={10} className="text-white" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA CONECTADO AL ONBOARDING / CLERK */}
            <Link 
              href="/onboarding" 
              className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-tighter text-center transition-all active:scale-95 flex items-center justify-center gap-2 ${
                plan.highlight 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_20px_40px_rgba(37,99,235,0.25)]' 
                : 'bg-white text-black hover:bg-zinc-200 shadow-xl'
              }`}
            >
              {plan.buttonText} <ChevronRight size={18} />
            </Link>
          </div>
        ))}
      </div>
      
      {/* Disclaimer para evitar el "Humo" */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <p className="text-[10px] text-zinc-700 uppercase font-bold tracking-widest leading-relaxed">
          *Savings based on typical GPT-4 usage patterns and real-time Neural Routing efficiency data. 
          Actual results may vary based on prompt complexity and model availability.
        </p>
      </div>

      <div className="mt-24 flex flex-col items-center">
        <div className="flex gap-12 opacity-20 grayscale filter brightness-200">
          <span className="text-white font-black italic">CLERK</span>
          <span className="text-white font-black italic">SUPABASE</span>
          <span className="text-white font-black italic">LEMON SQUEEZY</span>
          <span className="text-white font-black italic">GROQ</span>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}