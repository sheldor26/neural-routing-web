"use client";
import dynamic from 'next/dynamic';

// Dynamic Imports for Performance & SSR safety
const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false });
const PricingPage = dynamic(() => import('@/components/PricingPage'), { ssr: false });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false });
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto left-0 right-0 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-900/50">
        <div className="text-2xl font-black italic tracking-tighter uppercase">
          NEURAL<span className="text-blue-500">ROUTE</span><span className="text-zinc-700">.IO</span>
        </div>
        
        <NavAuth />
      </nav>

      <main>
        {/* HERO SECTION */}
        <Hero />

        {/* LIVE SIMULATOR (Playground) */}
        <section className="py-20 bg-black/50">
          <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Live Demo</h2>
            <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">Test the <span className="text-zinc-600">Neural Node</span></h3>
          </div>
          <div className="max-w-7xl mx-auto">
            <Playground />
          </div>
        </section>

        {/* FEATURES & INFO */}
        <HowItWorks />
        <PricingPage />
        <FAQ />
      </main>

      {/* FOOTER */}
      <footer className="py-20 border-t border-zinc-900 bg-black text-center">
        <div className="mb-8 opacity-20 grayscale inline-block">
          <div className="text-xl font-black italic tracking-tighter uppercase text-white">
            NEURAL<span className="text-blue-500">ROUTE</span>
          </div>
        </div>
        <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.2em]">
          © 2026 NeuralRoute.io — Engineered via Neural Nodes | Virasoro-Node Infrastructure.
        </p>
      </footer>
    </div>
  );
}