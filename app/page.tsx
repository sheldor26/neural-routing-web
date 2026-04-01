"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Droplets, DollarSign, Zap, Shield, BarChart3, ArrowRight, MousePointer2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import FAQ from '@/components/FAQ'; 
import SavingsCalculator from '@/components/SavingsCalculator';

const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const HeroAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.HeroAuth), { ssr: false });
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

export default function LandingPage() {
  const [globalStats, setGlobalStats] = useState({ 
    savings: 145280.40, 
    water: 1816005, 
    loading: true 
  });

  useEffect(() => {
    async function fetchGlobalStats() {
      try {
        const response = await fetch('https://web-production-4f439.up.railway.app/v1/user-stats/global_stats', {
           headers: { 'X-API-KEY': 'nr-dev-secret-123' }
        });
        const data = await response.json();
        if (data && data.total_savings) {
          setGlobalStats({
            savings: Number(data.total_savings),
            water: Number(data.total_savings) * 12.5,
            loading: false
          });
        }
      } catch (error) {
        setGlobalStats(prev => ({ ...prev, loading: false }));
      }
    }
    fetchGlobalStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden italic-none">
      
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-50">
        <div className="text-2xl font-black tracking-tighter italic">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/pricing" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">Pricing</Link>
          <NavAuth />
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative py-20 px-6 text-center max-w-6xl mx-auto flex flex-col items-center z-10">
        
        <div className="inline-flex items-center gap-3 mb-10 p-1 pr-4 bg-blue-500/5 border border-blue-500/20 backdrop-blur-md rounded-full">
          <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase italic">Live Proof</div>
          <span className="text-[10px] font-bold text-blue-100 uppercase tracking-tight">
             ${globalStats.savings.toLocaleString()} already saved by our users
          </span>
        </div>

        <h1 className="relative z-10 text-6xl md:text-[5.5rem] font-black tracking-tighter mb-8 leading-[0.85] bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent italic">
          CUT YOUR AI COSTS <br/> IN SECONDS.
        </h1>

        <p className="relative z-10 text-zinc-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Automatically use the <span className="text-white">cheapest AI model for every request</span>—without sacrificing quality. Slashing bills by <span className="text-blue-500 font-bold italic">85%</span>.
        </p>
        
        <div className="relative z-20 flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase text-blue-400 flex items-center gap-2 mb-1 tracking-widest">
            <AlertCircle size={12} /> You are overpaying on every request you send today.
          </p>
          <HeroAuth /> 
          <div className="space-y-1 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center justify-center gap-2">
              No setup. See results in under 30 seconds.
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-800">
              No lock-in. Works with your existing setup.
            </p>
          </div>
        </div>
      </header>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-y border-white/5 bg-zinc-900/10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
               <div className="text-blue-600 font-black text-4xl italic">01</div>
               <h4 className="text-lg font-black uppercase italic">One-Line Change</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">Point your existing AI requests to our endpoint. No complex code logic.</p>
            </div>
            <div className="space-y-4 md:border-l md:border-white/5 md:pl-12">
               <div className="text-blue-600 font-black text-4xl italic">02</div>
               <h4 className="text-lg font-black uppercase italic">Smart Analysis</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">We automatically detect the minimum "brain power" needed for each prompt.</p>
            </div>
            <div className="space-y-4 md:border-l md:border-white/5 md:pl-12">
               <div className="text-blue-600 font-black text-4xl italic">03</div>
               <h4 className="text-lg font-black uppercase italic">Instant Savings</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">We route to the cheapest model (Llama 3 vs GPT-4o) in milliseconds.</p>
            </div>
         </div>
      </section>

      {/* --- WHO IS THIS FOR --- */}
      <section className="py-32 max-w-5xl mx-auto px-6 relative z-10 text-center">
         <div className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-[3rem]">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-8 italic">Ecosystem Fit</h2>
            <h3 className="text-3xl font-black italic uppercase text-white mb-10 tracking-tighter">Who is this for?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
               <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 size={20} className="text-blue-600" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-300">SaaS Products</p>
               </div>
               <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 size={20} className="text-blue-600" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-300">AI Startups</p>
               </div>
               <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 size={20} className="text-blue-600" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-300">Enterprise Teams</p>
               </div>
            </div>
            
            <SignInButton mode="modal">
               <button className="px-10 py-5 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20">
                  Start Saving Now
               </button>
            </SignInButton>
         </div>
      </section>

      {/* --- SAVINGS CALCULATOR --- */}
      <section className="py-24 px-6 relative z-10 bg-zinc-950">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 italic">ROI Report</h2>
          <p className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">Stop Your Infrastructure <br/> <span className="text-blue-600 italic">Money Leakage</span></p>
        </div>
        <SavingsCalculator />
      </section>

      {/* --- PLAYGROUND --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 italic">Internal Workflow</h2>
            <p className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">See It <span className="text-blue-600">Work</span></p>
          </div>
          
          <SignedIn>
            <Playground />
          </SignedIn>
          
          <SignedOut>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
              <div className="bg-black border border-zinc-800 rounded-3xl p-8 font-mono text-xs shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent opacity-50" />
                <div className="flex gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-zinc-600 mb-2 font-black uppercase text-[9px]">01 // Incoming Request</p>
                    <p className="text-blue-400 italic">"Draft a professional reply to this client..."</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 mb-2 font-black uppercase text-[9px]">02 // Smart Audit</p>
                    <p className="text-emerald-500 italic">Complexity: MEDIUM (Routing to Economy model)</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 mb-2 font-black uppercase text-[9px]">03 // Result</p>
                    <p className="text-white font-bold">Using Llama-3... <span className="text-emerald-500 font-black uppercase tracking-tighter ml-2 bg-emerald-500/10 px-2 py-0.5 rounded">Saved $0.0124</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] italic">Step-by-step Demo</p>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-[1.1]">
                  HERE'S WHAT HAPPENS <br/><span className="text-blue-500">EVERY TIME YOU SEND A REQUEST.</span>
                </h2>
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto px-12 py-6 bg-white text-black font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl flex items-center justify-center gap-4 group">
                    Start Saving Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
                {/* ✅ UPDATED MICRO-COPY */}
                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Sub-200ms latency. Test it yourself in seconds.</p>
              </div>
            </div>
          </SignedOut>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 italic">
          <FeatureCard 
            icon={<BarChart3 size={24} className="text-emerald-500" />} 
            title="85%" subtitle="Reduction" 
            desc="Automatically scale down costs by using efficient models for non-critical tasks." />
          <FeatureCard 
            icon={<Zap size={24} className="text-blue-500" />} 
            title="15ms" subtitle="Overhead" 
            desc="Our routing layer is nearly invisible. Same speed, significantly cheaper." />
          <FeatureCard 
            icon={<Shield size={24} className="text-white" />} 
            title="100%" subtitle="PII Privacy" 
            desc="Scrub sensitive data before it ever hits a third-party AI provider." />
        </div>
      </section>

      <FAQ />

      <footer className="py-20 border-t border-zinc-900 text-center opacity-40">
        <div className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] italic">
          © 2026 NeuralRouting.io — Built for the Intelligent Enterprise.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, subtitle, desc }: { icon: any, title: string, subtitle: string, desc: string }) {
  return (
    <div className="group p-12 rounded-[2.5rem] bg-zinc-900/10 border border-zinc-800/40 hover:border-blue-500/30 transition-all duration-500 relative">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">{icon}</div>
      <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2 relative z-10">
        {title} <span className="text-blue-500 text-[10px] block not-italic font-sans tracking-[0.2em] mt-1 uppercase">{subtitle}</span>
      </h3>
      <p className="text-zinc-600 text-sm leading-relaxed font-medium italic relative z-10 group-hover:text-zinc-400 transition-colors">{desc}</p>
    </div>
  );
}
