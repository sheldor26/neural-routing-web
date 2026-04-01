"use client";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Droplets, DollarSign, ArrowRight, Zap, Shield, Info } from 'lucide-react';
import FAQ from '@/components/FAQ'; 
import SavingsCalculator from '@/components/SavingsCalculator'; // Importamos el nuevo módulo

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
            href="/how-it-works" 
            className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all duration-300"
          >
            How it Works
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
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 p-2 bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-full">
          <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase">
            Private Beta
          </div>
          <div className="flex items-center gap-2 px-3 border-l border-zinc-800/50">
            <DollarSign size={14} className="text-green-500" />
            <span className="text-[11px] font-black italic text-white tracking-tight">
              $145,280.40 <span className="text-zinc-600 uppercase not-italic ml-1">Saved</span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 border-l border-zinc-800/50 hidden sm:flex">
            <Droplets size={14} className="text-blue-500" />
            <span className="text-[11px] font-black italic text-white tracking-tight">
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

      {/* --- RESTO DE LAS SECCIONES --- */}
      <section className="relative z-10">
        <Playground />
      </section>

      {/* ... (Features, FAQ, Footer) */}