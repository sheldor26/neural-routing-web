"use client";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Droplets, DollarSign, ArrowRight, Zap, Shield, Info } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import FAQ from '@/components/FAQ'; 
import SavingsCalculator from '@/components/SavingsCalculator';

const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const HeroAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.HeroAuth), { ssr: false });
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-50">
        <div className="text-2xl font-black tracking-tighter">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        
        <div className="flex items-center gap-8">
          <Link 
            href="/blog" 
            className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all duration-300"
          >
            Engineering
          </Link>
          <Link 
            href="/pricing" 
            className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all duration-300"
          >
            Pricing
          </Link>
          <NavAuth />
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative py-24 px-6 text-center max-w-6xl mx-auto flex flex-col items-center z-10">
        {/* BADGES CONTAINER - Actualizado para ser responsivo y mostrar el agua */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-10 p-2 bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-2xl sm:rounded-full">
          <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] sm:text-[10px] font-black tracking-widest uppercase">
            Private Beta
          </div>
          
          <div className="flex items-center gap-2 px-3 border-l border-zinc-800/50">
            <DollarSign size={14} className="text-green-500" />
            <span className="text-[10px] sm:text-[11px] font-black italic text-white tracking-tight">
              $145,280.40 <span className="text-zinc-600 uppercase not-italic ml-1">Saved</span>
            </span>
          </div>

          {/* Badge de Agua: Ahora visible en móvil y con ajuste de fuente */}
          <div className="flex items-center gap-2 px-3 border-l border-zinc-800/50">
            <Droplets size={14} className="text-blue-500" />
            <span className="text-[10px] sm:text-[11px] font-black italic text-white tracking-tight">
              1,816,005L <span className="text-zinc-600 uppercase not-italic ml-1">Conserved</span>
            </span>
          </div>
        </div>

        <h1 className="relative z-10 text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Stop Overpaying for <br/>AI Infrastructure.
        </h1>

        <p className="relative z-10 text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed italic font-medium">
          Intelligent prompt routing in milliseconds. Save up to 85% on token costs by automatically switching between Economy and Premium models.
        </p>
        
        <div className="relative z-20 flex flex-col sm:flex-row items-center gap-6">
          <HeroAuth />
          <Link 
            href="/pricing" 
            className="group relative px-8 py-4 flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30 text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:border-blue-500/50 hover:text-white hover:bg-blue-500/10 shadow-2xl"
          >
             <DollarSign size={14} className="text-blue-500 transition-transform group-hover:scale-125 group-hover:rotate-12" />
             <span>View Pricing</span>
          </Link>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full -z-10 pointer-events-none"></div>
      </header>

      {/* --- SAVINGS CALCULATOR SECTION --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 text-center">Neural ROI Analysis</h2>
          <p className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white">Calculate Your Infrastructure <br/> <span className="text-zinc-800 text-4xl">Leakage</span></p>
        </div>
        <SavingsCalculator />
      </section>

      {/* --- PLAYGROUND SECTION (GATED) --- */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SignedIn>
            <div className="text-center mb-12">
              <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Neural Console</h2>
              <p className="text-3xl font-black italic tracking-tighter uppercase text-white">Interactive <span className="text-blue-600">Playground</span></p>
            </div>
            <Playground />
          </SignedIn>

          <SignedOut>
            <div className="relative group p-1 bg-gradient-to-b from-blue-600/20 to-transparent rounded-[3rem] overflow-hidden">
              <div className="bg-[#09090b]/80 backdrop-blur-2xl rounded-[2.9rem] p-16 text-center border border-zinc-800/50 relative z-10">
                <div className="inline-flex p-5 bg-blue-600/10 rounded-2xl mb-8 border border-blue-500/20">
                  <Zap className="text-blue-500 animate-pulse" size={32} />
                </div>
                <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-6 text-white leading-none">
                  Unlock <span className="text-blue-500">Neural Access</span>
                </h2>
                <p className="text-zinc-500 text-lg mb-12 max-w-md mx-auto italic font-medium leading-relaxed">
                  Authentication required to prevent token abuse. Join the beta to test our sub-200ms routing engine.
                </p>
                <SignInButton mode="modal">
                  <button className="px-12 py-6 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-[0_20px_60px_rgba(37,99,235,0.2)] active:scale-95">
                    Get Instant Access
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-10 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 text-center md:text-left">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
              <DollarSign className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-4">
              Cost <span className="text-blue-500 text-sm block not-italic font-sans">Arbitrage</span>
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed italic font-medium">
              Reduce LLM spend by up to 85%. Our engine routes basic tasks to efficient nodes while reserving premium models for complex reasoning.
            </p>
          </div>

          <div className="group p-10 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 text-center md:text-left">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
              <Droplets className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-4">
              Eco <span className="text-blue-500 text-sm block not-italic font-sans">Sustainability</span>
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed italic font-medium">
              For every dollar saved, we prevent the evaporation of 12.5L of water in data center cooling. Infrastructure that respects the planet.
            </p>
          </div>

          <div className="group p-10 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 text-center md:text-left">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
              <Shield className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-4">
              Privacy <span className="text-blue-500 text-sm block not-italic font-sans">Infrastructure</span>
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed italic font-medium">
              On-edge PII redaction. Your sensitive data is filtered before it reaches LLM providers. Enterprise-grade security from Neural.
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="relative z-10 border-t border-zinc-900/50">
        <FAQ />
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-zinc-900/50 text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] italic bg-[#09090b]">
        © 2026 NeuralRouting.io — Built for the Intelligent Enterprise.
      </footer>
    </div>
  );
}
