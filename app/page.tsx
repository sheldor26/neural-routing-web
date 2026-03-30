"use client";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Importamos los componentes de forma dinámica para evitar errores de SSR y Build
const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const HeroAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.HeroAuth), { ssr: false });
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter italic uppercase">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        
        <div className="flex items-center gap-8">
          <Link href="/pricing" className="hidden md:block text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
            Pricing
          </Link>
          <NavAuth />
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto mb-16">
        <div className="inline-block px-4 py-1.5 mb-8 border border-blue-500/30 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase animate-pulse">
          Now in Private Beta: Neural Node Online
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent italic uppercase">
          Stop Overpaying <br/> for AI.
        </h1>
        
        <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed italic font-medium">
          Intelligent prompt routing in milliseconds. Save up to 85% on token costs by automatically switching between Economy and Premium models.
        </p>
        
        {/* --- CTAs --- */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <HeroAuth />
          
          <Link 
            href="/pricing" 
            className="group flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-tighter rounded-2xl hover:bg-zinc-800 hover:text-white transition-all active:scale-95 italic shadow-xl"
          >
            View Pricing
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* --- PLAYGROUND SECTION (SIMULADOR) --- */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-10">
          <h2 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Live Infrastructure</h2>
          <p className="text-3xl font-black italic uppercase tracking-tighter">Test the Neural Router</p>
        </div>
        <div className="bg-zinc-900/20 p-4 md:p-8 rounded-[3rem] border border-zinc-800/50 backdrop-blur-sm shadow-2xl hover:border-zinc-700/50 transition-all">
          <Playground />
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-zinc-900 text-center">
        <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic mb-2">
          © 2026 NeuralRouting.io — Built for the Intelligent Enterprise.
        </div>
        <p className="text-zinc-800 text-[9px] uppercase font-black tracking-[0.3em]">
          Powered by Neural Infrastructure Strategy
        </p>
      </footer>
    </div>
  );
}
