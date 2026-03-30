"use client";
import { useState } from 'react';
import { Zap, Shield, BarChart3, Loader2, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Cargamos los componentes de Auth solo en el cliente, saltando el error de build
const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const HeroAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.HeroAuth), { ssr: false });

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRoute = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://web-production-4f439.app.railway.app/v1/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": "key_demo_user" },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Routing error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        <NavAuth />
      </nav>

      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Stop Overpaying for <br/>AI Infrastructure.
        </h1>
        <HeroAuth />
      </header>

      {/* Tu simulador y resto de secciones aquí abajo igual... */}
    </div>
  );
}