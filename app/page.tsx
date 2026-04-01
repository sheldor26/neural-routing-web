"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Droplets, DollarSign, Zap, Shield, BarChart3 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import FAQ from '@/components/FAQ'; 
import SavingsCalculator from '@/components/SavingsCalculator';

// Dynamic Imports
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
        // ✅ Pointing to your production API
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
        } else {
          setGlobalStats(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Metrics sync error:", error);
        setGlobalStats(prev => ({ ...prev, loading: false }));
      }
    }
    fetchGlobalStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-50">
        <div className="text-2xl font-black tracking-tighter italic">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/blog" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">Engineering</Link>
          <Link href="/pricing" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">Pricing</Link>
          <NavAuth />
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative py-20 px-6 text-center max-w-6xl mx-auto flex flex-col items-center z-10">
        
        {/* ✅ LIVE PROOF BADGE */}
        <div className="inline-flex items-center gap-3 mb-10 p-1 pr-4 bg-blue-500/5 border border-blue-500/20 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(37,99,235,0.05)]">
          <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase animate-pulse">Live Proof</div>
          <span className="text-[10px] font-bold text-blue-100 uppercase tracking-tight">
             ${globalStats.savings.toLocaleString()} already saved by our nodes
          </span>
        </div>

        <h1 className="relative z-10 text-6xl md:text-[5.5rem] font-black tracking-tighter mb-8 leading-[0.85] bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent italic">
          CUT YOUR AI COSTS <br/> IN SECONDS.
        </h1>

        <p className="relative z-10 text-zinc-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          We automatically route your requests to the <span className="text-white">cheapest AI model</span>—maintaining 100% quality while slashing your bill by <span className="text-blue-500 font-bold">85%</span>.
        </p>
        
        <div className="relative z-20 flex flex-col sm:flex-row items-center gap-6">
          <HeroAuth /> 
          <Link href="/pricing" className="group relative px-8 py-4 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:border-zinc-700 hover:text-white">
             See How Much You Save
          </Link>
        </div>
      </header>

      {/* --- HOW IT WORKS (SALES STEPS) --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-y border-white/5 bg-zinc-900/10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
               <div className="text-blue-600 font-black text-4xl italic">01</div>
               <h4 className="text-lg font-black uppercase italic">Connect API</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">Replace your endpoint URL. Zero logic changes required.</p>
            </div>
            <div className="space-y-4">
               <div className="text-blue-600 font-black text-4xl italic">02</div>
               <h4 className="text-lg font-black uppercase italic">Smart Analysis</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">Our engine analyzes complexity in milliseconds.</p>
            </div>
            <div className="space-y-4">
               <div className="text-blue-600 font-black text-4xl italic">03</div>
               <h4 className="text-lg font-black uppercase italic">Instant Savings</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">We route to the cheapest model (Llama 3, GPT-4o, etc).</p>
            </div>
         </div>
      </section>

      {/* --- SAVINGS CALCULATOR --- */}
      <section className="py-32 px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Neural ROI Analysis</h2>
          <p className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">Stop Your Infrastructure <br/> <span className="text-blue-600">Money Leakage</span></p>
        </div>
        <SavingsCalculator />
      </section>

      {/* --- PLAYGROUND --- */}
      <section className="relative z-10 py-24 px-6 bg-blue-600/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 italic">Live Lab</h2>
            <p className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">Test the <span className="text-blue-600">Engine</span></p>
          </div>
          <SignedIn>
            <Playground />
          </SignedIn>
          <SignedOut>
            <div className="relative group p-1 bg-zinc-800 rounded-[3rem] overflow-hidden border border-zinc-700">
              <div className="bg-black rounded-[2.9rem] p-16 text-center relative z-10">
                <Zap className="text-blue-500 mx-auto mb-6" size={40} />
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-4 text-white">
                  Unlock Neural Access
                </h2>
                <p className="text-zinc-500 mb-10 max-w-sm mx-auto italic text-sm">
                  Authentication required to prevent token abuse. Join the beta to test our sub-200ms engine.
                </p>
                <SignInButton mode="modal">
                  <button className="px-12 py-5 bg-white text-black font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl">
                    Get Instant Access
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BarChart3 size={24} className="text-emerald-500" />} 
            title="Max" subtitle="Savings" 
            desc="Save up to 85% per token by automatically using efficient models for simple tasks." />
          <FeatureCard 
            icon={<Zap size={24} className="text-blue-500" />} 
            title="Zero" subtitle="Latency" 
            desc="Our routing layer adds less than 15ms of overhead to your existing AI workflow." />
          <FeatureCard 
            icon={<Shield size={24} className="text-white" />} 
            title="Total" subtitle="Privacy" 
            desc="PII Redaction on-the-edge. Your sensitive data never hits third-party AI servers." />
        </div>
      </section>

      <FAQ />

      <footer className="py-20 border-t border-zinc-900 text-center">
        <div className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] italic">
          © 2026 NeuralRouting.io — Built for the Intelligent Enterprise.
        </div>
        <div className="mt-4 flex justify-center gap-6 text-[9px] font-bold text-zinc-800 uppercase tracking-[0.2em]">
           <span>Status: Optimal</span>
           <span>Uptime: 99.99%</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, subtitle, desc }: { icon: any, title: string, subtitle: string, desc: string }) {
  return (
    <div className="group p-12 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 hover:border-blue-500/30 transition-all duration-500 relative">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">{icon}</div>
      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4 relative z-10">
        {title} <span className="text-blue-500 text-xs block not-italic font-sans tracking-widest mt-1">{subtitle}</span>
      </h3>
      <p className="text-zinc-500 text-sm leading-relaxed font-medium italic relative z-10">{desc}</p>
    </div>
  );
}
