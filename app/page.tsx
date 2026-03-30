"use client";
import { useState } from 'react';
import { Zap, Shield, BarChart3, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

// IMPORTACIÓN POR NAMESPACE: Esto ignora el error de "export not found"
import * as Clerk from "@clerk/nextjs";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ... (tu función testRoute igual) ...

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Usamos Clerk.Componente en lugar del componente directo */}
          <Clerk.SignedOut>
            <Clerk.SignInButton mode="modal">
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition">
                Get Started
              </button>
            </Clerk.SignInButton>
          </Clerk.SignedOut>
          
          <Clerk.SignedIn>
            <div className="flex items-center gap-4 bg-zinc-900/50 p-1 pl-4 rounded-full border border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Dashboard</span>
              <Clerk.UserButton afterSignOutUrl="/" />
            </div>
          </Clerk.SignedIn>
        </div>
      </nav>

      {/* --- IMPORTANTE: También cambiar en el HERO y PRICING --- */}
      {/* Hero Section Buttons */}
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <Clerk.SignedOut>
          <Clerk.SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2">
              Try Live Demo <ArrowRight size={20} />
            </button>
          </Clerk.SignInButton>
        </Clerk.SignedOut>
        <Clerk.SignedIn>
          <a href="#playground" className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2">
            Launch Simulator <ArrowRight size={20} />
          </a>
        </Clerk.SignedIn>
      </div>

      {/* ... el resto del simulador queda igual ... */}
    </div>
  );
}