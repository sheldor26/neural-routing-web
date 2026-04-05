"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Zap, Shield, BarChart3, ArrowRight, CheckCircle2, Code, Cpu, TrendingDown, Lock, Timer, Activity, GitMerge, DollarSign, RefreshCw } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import FAQ from '@/components/FAQ';
import SavingsCalculator from '@/components/SavingsCalculator';

const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const HeroAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.HeroAuth), { ssr: false });
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

export default function LandingPage() {
  const [globalStats, setGlobalStats] = useState({
    savings: 0,
    requests: 0,
    avgLatency: 118,
    loading: true,
  });

  useEffect(() => {
    fetch('https://web-production-4f439.up.railway.app/v1/public/stats')
      .then((r) => r.json())
      .then((d) => setGlobalStats({
        savings: d.total_savings_usd ?? 0,
        requests: d.total_requests ?? 0,
        avgLatency: 118,
        loading: false,
      }))
      .catch(() => setGlobalStats(prev => ({ ...prev, loading: false })));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">

      {/* --- NAV --- */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-50">
        <div className="text-2xl font-black tracking-tighter italic">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">Docs</Link>
          <Link href="/blog" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">Blog</Link>
          <Link href="/pricing" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">Pricing</Link>
          <NavAuth />
        </div>
      </nav>

      {/* --- HERO --- */}
      <header className="relative pt-16 pb-12 px-6 text-center max-w-6xl mx-auto flex flex-col items-center z-10">
        {!globalStats.loading && globalStats.savings > 0 && (
          <div className="inline-flex items-center gap-3 mb-10 p-1 pr-4 bg-red-500/5 border border-red-500/20 backdrop-blur-md rounded-full">
            <div className="px-3 py-1 rounded-full bg-red-600 text-white text-[9px] font-black tracking-widest uppercase italic animate-pulse">Efficiency Leak</div>
            <span className="text-[10px] font-bold text-red-100 uppercase tracking-tight">
              Neural Node: ${globalStats.savings.toLocaleString()} saved since launch.
            </span>
          </div>
        )}
        {(globalStats.loading || globalStats.savings === 0) && (
          <div className="inline-flex items-center gap-3 mb-10 p-1 pr-4 bg-blue-500/5 border border-blue-500/20 backdrop-blur-md rounded-full">
            <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase italic">Live</div>
            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-tight">
              Intelligent routing · 450+ dev teams · Free tier available
            </span>
          </div>
        )}

        <h1 className="relative z-10 text-5xl md:text-[5.5rem] font-black tracking-tighter mb-6 leading-[0.9] bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent italic uppercase">
          Stop sending every <br/> AI request to GPT-4.
        </h1>

        <p className="relative z-10 text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Route every prompt to the cheapest model automatically.
          <span className="text-white font-bold ml-2 underline decoration-blue-500 underline-offset-4">Free Tier available — stop wasting money today.</span>
        </p>

        <div className="relative z-20 flex flex-col items-center gap-6">
          <HeroAuth />
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-6 items-center border border-white/5 bg-white/5 px-6 py-2 rounded-2xl backdrop-blur-sm">
              <div className="text-center">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Avg Latency</p>
                <p className="text-xs font-bold text-blue-500">{globalStats.avgLatency}ms</p>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="text-center">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Dev Teams</p>
                <p className="text-xs font-bold text-white">450+</p>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="text-center">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Integration</p>
                <p className="text-xs font-bold text-emerald-500">30s</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">How it works</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Three steps. Zero friction.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />

            {[
              {
                step: "01",
                icon: <Code size={22} className="text-blue-400" />,
                title: "Send your request",
                desc: "Point your existing OpenAI calls at neuralrouting.io/v1. Drop in your API key — nothing else changes.",
              },
              {
                step: "02",
                icon: <Cpu size={22} className="text-blue-400" />,
                title: "Analyze the prompt",
                desc: "Our engine classifies task type, complexity, and urgency in under 5ms using a lightweight intent model.",
              },
              {
                step: "03",
                icon: <TrendingDown size={22} className="text-emerald-400" />,
                title: "Route to cheapest fit",
                desc: "The prompt is dispatched to the optimal model. You get the same quality at a fraction of the cost.",
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-zinc-900/30 border border-white/5 rounded-3xl p-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black text-zinc-700 tracking-widest">{item.step}</span>
                  <div className="p-2.5 bg-white/5 rounded-xl">{item.icon}</div>
                </div>
                <h3 className="text-lg font-black italic uppercase tracking-tight text-white">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 px-6 relative z-10 bg-zinc-950/60 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">What's inside</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Enterprise-grade infrastructure.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <GitMerge size={18} className="text-blue-400" />,
                title: "Smart Routing Modes",
                desc: "Auto, Cost, Speed, Quality, and Custom modes. One flag switches your entire strategy.",
              },
              {
                icon: <Shield size={18} className="text-violet-400" />,
                title: "Prompt Injection Shield",
                desc: "Real-time heuristic scanner blocks jailbreaks, DAN attempts, and system-prompt extraction before they reach your model.",
              },
              {
                icon: <Activity size={18} className="text-emerald-400" />,
                title: "Shadow Quality Engine",
                desc: "Runs silent A/B comparisons to validate economy-model responses before committing to routing decisions.",
              },
              {
                icon: <RefreshCw size={18} className="text-orange-400" />,
                title: "Feedback Loop",
                desc: "Confidence matrix learns from quality audits and auto-escalates poor-performing model/task pairs.",
              },
              {
                icon: <DollarSign size={18} className="text-yellow-400" />,
                title: "Budget Caps & FinOps",
                desc: "Set per-user or global spend limits. Get real ROI dashboards showing savings vs benchmark cost.",
              },
              {
                icon: <Timer size={18} className="text-red-400" />,
                title: "Loop Detection",
                desc: "Detects runaway agent loops and kills cycles before they drain your budget silently.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:bg-zinc-900/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/5 rounded-xl">{f.icon}</div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">{f.title}</h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BEFORE VS AFTER --- */}
      <section className="py-20 max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-8 rounded-3xl bg-zinc-900/20 border border-red-500/10 grayscale opacity-60">
            <p className="text-[9px] font-black uppercase text-red-500 mb-4 tracking-widest">Standard API usage</p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-500">Summary</span> <span className="text-white">GPT-4o ($0.0100)</span></div>
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-500">Simple Reply</span> <span className="text-white">GPT-4o ($0.0150)</span></div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-black italic uppercase text-red-500"><span>Budget Burn</span> <span>$0.0125 / req</span></div>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <p className="text-[9px] font-black uppercase text-blue-500 mb-4 tracking-widest">Neural Routing</p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-400">Summary</span> <span className="text-emerald-500">Llama 3 ($0.0008)</span></div>
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-400">Simple Reply</span> <span className="text-emerald-500">Mini ($0.0002)</span></div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-black italic uppercase text-emerald-500"><span>Target Cost</span> <span>$0.0005 (96% Saved)</span></div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <SignInButton mode="modal">
            <button className="px-12 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
              Get Your API Key Now
            </button>
          </SignInButton>
        </div>
      </section>

      {/* --- PLAYGROUND (LIVE PROOF) --- */}
      <section id="playground" className="relative z-30 py-16 px-6 bg-zinc-950/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Live Demo</p>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8">Try it now</h2>
          <SignedIn>
            <Playground />
          </SignedIn>
          <SignedOut>
            <div className="p-10 rounded-[2rem] bg-zinc-900/30 border border-white/5 flex flex-col items-center gap-6">
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Sign in to run a live routing request</p>
              <SignInButton mode="modal">
                <button className="px-8 py-4 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                  Sign In to Try Live
                </button>
              </SignInButton>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Free tier · No credit card required</p>
            </div>
          </SignedOut>
        </div>
      </section>

      {/* --- CODE SHOWCASE --- */}
      <section className="py-24 px-6 relative z-10 bg-zinc-950/50 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 italic">Change one line</h2>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-6">Built for SaaS Builders. <br/> Integrated in seconds.</h3>
            <ul className="space-y-4 mb-10">
              <li className="flex gap-3 text-sm text-zinc-400 font-bold uppercase"><CheckCircle2 size={16} className="text-blue-600" /> OpenAI SDK Compatible</li>
              <li className="flex gap-3 text-sm text-zinc-400 font-bold uppercase"><CheckCircle2 size={16} className="text-blue-600" /> Distributed Node Latency</li>
              <li className="flex gap-3 text-sm text-zinc-400 font-bold uppercase"><CheckCircle2 size={16} className="text-blue-600" /> Free Tier Available</li>
            </ul>
            <Link href="/docs" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
              Read the docs <ArrowRight size={12} />
            </Link>
          </div>
          <div className="bg-black border border-zinc-800 rounded-3xl p-6 font-mono text-[11px] shadow-2xl relative">
            <div className="flex gap-1.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
            </div>
            <pre className="text-blue-400 overflow-x-auto">
{`// Integration Example
const response = await fetch("https://neuralrouting.io/v1/dispatch", {
  method: "POST",
  headers: { "X-API-KEY": "sk_nr_live_..." },
  body: JSON.stringify({
    messages: [{ role: "user", content: "..." }],
    user_id: "your_app_01"
  })
});`}
            </pre>
          </div>
        </div>
      </section>

      {/* --- SAVINGS CALCULATOR --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">ROI Calculator</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">How much will you save?</h2>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* --- PRICING TEASER --- */}
      <section className="py-24 px-6 relative z-10 bg-zinc-950/60 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Pricing</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Start free. Scale when ready.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { name: "Free", price: "$0", note: "forever", credits: "5K credits", highlight: false, tag: null },
              { name: "Starter", price: "$29", note: "/ mo", credits: "50K credits", highlight: false, tag: null },
              { name: "Growth", price: "$89", note: "/ mo", credits: "200K credits", highlight: true, tag: "Most Popular" },
              { name: "Business", price: "$349", note: "/ mo", credits: "1M credits", highlight: false, tag: null },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col gap-3 border transition-all ${
                  plan.highlight
                    ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.15)]"
                    : "bg-zinc-900/20 border-white/5"
                }`}
              >
                {plan.tag && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                    {plan.tag}
                  </span>
                )}
                <p className={`text-[10px] font-black uppercase tracking-widest ${plan.highlight ? "text-blue-400" : "text-zinc-500"}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black italic text-white">{plan.price}</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{plan.note}</span>
                </div>
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">{plan.credits} / mo</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all"
            >
              See full pricing & features <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-zinc-900/40 border border-zinc-800">
          <h2 className="text-4xl font-black italic uppercase text-white mb-8">Ready to cut your bills?</h2>
          <SignInButton mode="modal">
            <button className="px-16 py-8 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
              Start Saving Now — Free
            </button>
          </SignInButton>
          <p className="mt-6 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">No credit card required for free tier.</p>
        </div>
      </section>

      <FAQ />

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="text-xl font-black tracking-tighter italic">
            NEURAL<span className="text-blue-600">ROUTING</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[9px] font-black uppercase tracking-widest">
            <Link href="/docs" className="text-zinc-600 hover:text-zinc-400 transition-colors">Docs</Link>
            <Link href="/blog" className="text-zinc-600 hover:text-zinc-400 transition-colors">Blog</Link>
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-400 transition-colors">Pricing</Link>
            <Link href="/terms" className="text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
          </div>
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] italic text-center">
            © 2026 NeuralRouting.io — Built for the Intelligent Enterprise.
          </p>
        </div>
      </footer>
    </div>
  );
}
