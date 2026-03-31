"use client";

import { Check, Zap, Rocket, Crown } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      tokens: "1.5M",
      description: "Ideal for individual developers and side projects.",
      features: ["Standard Routing", "Economy Node Access", "1.5M Tokens/mo", "Community Support"],
      icon: <Rocket className="text-zinc-400" size={24} />,
      buttonText: "Get Started",
      highlight: false
    },
    {
      name: "Growth",
      price: "$89",
      tokens: "5M",
      description: "Perfect for scaling startups needing efficiency.",
      features: ["Priority Routing", "Premium Node Access", "5M Tokens/mo", "Advanced Analytics", "Eco-Impact Reports"],
      icon: <Zap className="text-blue-500" size={24} />,
      buttonText: "Upgrade to Growth",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$249",
      tokens: "20M",
      description: "For high-volume companies with custom needs.",
      features: ["Custom Model Training", "Dedicated Manager", "20M Tokens/mo", "Unlimited API Keys", "Custom Node Location"],
      icon: <Crown className="text-white" size={24} />,
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-32 px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
        <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Neural Capacity Plans</h2>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 leading-none">
          Scale Intelligence <br/> <span className="text-zinc-800">Not Your Costs</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto italic font-medium">
          Choose the neural tier that fits your volume. Save up to <span className="text-white font-bold">90%</span> on API costs via Neural-optimized nodes.
        </p>
      </div>

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
                Most Efficient
              </div>
            )}
            
            <div className="mb-10">
              <div className="p-4 bg-zinc-900/80 w-fit rounded-2xl border border-zinc-800 mb-8 shadow-inner">
                {plan.icon}
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">{plan.name}</h3>
              <p className="text-zinc-500 text-xs italic mb-6 leading-tight">{plan.description}</p>
              
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white italic tracking-tighter">{plan.price}</span>
                <span className="text-zinc-600 font-bold text-sm">/ MONTH</span>
              </div>
              <div className="mt-4 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg w-fit">
                <p className="text-blue-400 font-black uppercase text-[9px] tracking-widest">{plan.tokens} Neural Tokens Included</p>
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

            <Link 
              href="/sign-up" 
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
      
      <div className="mt-24 flex flex-col items-center">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] mb-6">
          Enterprise Security // Neural Node Redundancy // 2026
        </p>
        <div className="flex gap-12 opacity-20 grayscale">
          <span className="text-white font-black italic">CLERK</span>
          <span className="text-white font-black italic">STRIPE</span>
          <span className="text-white font-black italic">LEMON SQUEEZY</span>
        </div>
      </div>
    </div>
  );
}

// Icono extra para el botón
function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}