"use client";
import { useState } from 'react';
import { Zap, Shield, BarChart3, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
// Importación corregida para Next.js 15
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRoute = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://web-production-4f439.app.railway.app/v1/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "key_demo_user" 
        },
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
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#playground" className="hover:text-white transition">Playground</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
        </div>
        
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4 bg-zinc-900/50 p-1 pl-4 rounded-full border border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Dashboard</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 border border-blue-500/30 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase">
          Now in Private Beta
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Stop Overpaying for <br/>AI Infrastructure.
        </h1>
        <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Intelligent prompt routing in milliseconds. Save up to 85% on token costs by automatically switching between Economy and Premium models.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-2">
                Try Live Demo <ArrowRight size={20} />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <a href="#playground" className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-2">
              Launch Simulator <ArrowRight size={20} />
            </a>
          </SignedIn>
          
          <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-10 py-5 rounded-2xl font-bold text-lg transition">
            Book a Demo
          </button>
        </div>
      </header>

      {/* --- LIVE PLAYGROUND SECTION --- */}
      <section id="playground" className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Live Routing Simulator</h2>
            <p className="text-zinc-500">Experience how our neural engine selects the most cost-effective model for your prompt.</p>
          </div>
          
          <div className="space-y-4">
            <textarea 
              className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-white focus:border-blue-500 outline-none transition placeholder:text-zinc-700 text-lg"
              rows={3}
              placeholder="e.g., 'Summarize this text'..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={testRoute}
              disabled={loading || !prompt}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "DISPATCH PROMPT"}
            </button>
          </div>

          {result && (
            <div className="mt-10 p-8 bg-black border border-blue-500/20 rounded-[2rem] animate-in fade-in zoom-in duration-500">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="font-bold tracking-tight">Status: <span className="text-green-500">Optimized</span></span>
                </div>
                <div className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-black uppercase">
                  Tier: {result.routing.selected_tier}
                </div>
              </div>
              <div className="p-5 bg-zinc-900/50 rounded-xl text-zinc-400 text-sm border border-zinc-800">
                {result.output.ai_answer}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-10">
        <FeatureCard 
          icon={<Zap className="text-blue-500" size={32} />}
          title="Ultra-Low Latency"
          desc="P95 latency under 200ms. Our global edge network routes your requests instantly."
        />
        <FeatureCard 
          icon={<Shield className="text-blue-500" size={32} />}
          title="Enterprise Privacy"
          desc="Automatic PII filtering locally before it ever touches external LLM providers."
        />
        <FeatureCard 
          icon={<BarChart3 className="text-blue-500" size={32} />}
          title="Multi-Tenant Analytics"
          desc="Real-time ROI insights. Track savings and performance per client or individual API key."
        />
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Scalable Pricing.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <PriceCard tier="Starter" price="49" desc="For startups." features={["5M Tokens", "Standard Support"]} />
          <PriceCard tier="Pro" price="199" desc="For growing businesses." features={["50M Tokens", "Priority Support"]} highlight={true} />
          <PriceCard tier="Enterprise" price="Custom" desc="Full-scale optimization." features={["Unlimited Tokens", "SLA Guarantee"]} />
        </div>
      </section>

      <footer className="py-20 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        © 2026 NeuralRouting.io
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/30 hover:border-blue-500/50 transition-all">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-500">{desc}</p>
    </div>
  );
}

function PriceCard({ tier, price, desc, features, highlight = false }: { tier: string, price: string, desc: string, features: string[], highlight?: boolean }) {
  return (
    <div className={`p-10 rounded-[2.5rem] border ${highlight ? 'border-blue-600 bg-blue-600/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
      <h3 className="text-xl font-bold mb-2">{tier}</h3>
      <div className="mb-6">
        <span className="text-4xl font-black">${price}</span>
      </div>
      <ul className="space-y-4 mb-10">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
            <CheckCircle2 size={16} className="text-blue-500" /> {f}
          </li>
        ))}
      </ul>
      <SignedOut>
        <SignInButton mode="modal">
          <button className={`w-full py-4 rounded-2xl font-bold ${highlight ? 'bg-blue-600' : 'bg-zinc-800'}`}>
            Get Started
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <button className={`w-full py-4 rounded-2xl font-bold ${highlight ? 'bg-blue-600' : 'bg-zinc-800'}`}>
          Manage Plan
        </button>
      </SignedIn>
    </div>
  );
}