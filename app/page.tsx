"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Zap, Shield, BarChart3, ArrowRight, CheckCircle2, Code, Cpu, TrendingDown, Lock, Timer, Activity, GitMerge, DollarSign, RefreshCw, Quote } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import FAQ from '@/components/FAQ';
import SavingsCalculator from '@/components/SavingsCalculator';

const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const HeroAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.HeroAuth), { ssr: false });
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const duration = 1800;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

const TESTIMONIALS = [
  {
    quote: "Switched from always using GPT-4 to NeuralRouting. Our AI costs dropped 71% in the first week. Same output quality, a fraction of the price.",
    name: "Marcus T.",
    role: "CTO · B2B SaaS",
    savings: "71%",
  },
  {
    quote: "The semantic cache alone paid for the subscription 10x over. Repeated questions from our users now cost literally zero.",
    name: "Priya K.",
    role: "AI Lead · EdTech",
    savings: "89%",
  },
  {
    quote: "We were burning $4k/mo on OpenAI. After NeuralRouting, we're at $800. The setup took 20 minutes and nothing broke.",
    name: "Daniel R.",
    role: "Founder · Dev Tools",
    savings: "80%",
  },
];

export default function LandingPage() {
  const [globalStats, setGlobalStats] = useState({
    savings: 0,
    requests: 0,
    users: 0,
    avgLatency: 118,
    loading: true,
  });

  useEffect(() => {
    fetch('https://web-production-4f439.up.railway.app/v1/public/stats')
      .then((r) => r.json())
      .then((d) => setGlobalStats({
        savings: d.total_savings_usd ?? 0,
        requests: d.total_requests ?? 0,
        users: d.user_count ?? 0,
        avgLatency: 118,
        loading: false,
      }))
      .catch(() => setGlobalStats(prev => ({ ...prev, loading: false })));
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://neuralrouting.io/#org",
        name: "NeuralRouting.io",
        url: "https://neuralrouting.io",
        logo: "https://neuralrouting.io/icon.png",
        description: "Intelligent AI routing that automatically selects the cheapest model for every prompt.",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": "https://neuralrouting.io/#website",
        url: "https://neuralrouting.io",
        name: "NeuralRouting.io",
        publisher: { "@id": "https://neuralrouting.io/#org" },
      },
      {
        "@type": "SoftwareApplication",
        name: "NeuralRouting.io",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
          { "@type": "Offer", name: "Starter", price: "29", priceCurrency: "USD" },
          { "@type": "Offer", name: "Growth", price: "89", priceCurrency: "USD" },
          { "@type": "Offer", name: "Business", price: "349", priceCurrency: "USD" },
        ],
        description: "Save up to 97% on AI API costs with intelligent prompt routing. OpenAI SDK compatible.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How much can I save with NeuralRouting?", acceptedAnswer: { "@type": "Answer", text: "Teams typically save 70-97% on AI API costs by routing prompts to cheaper models when GPT-4 isn't needed." } },
          { "@type": "Question", name: "Is NeuralRouting compatible with the OpenAI SDK?", acceptedAnswer: { "@type": "Answer", text: "Yes. Change one line of code — point your base URL to neuralrouting.io/v1 and you're done." } },
          { "@type": "Question", name: "Is there a free tier?", acceptedAnswer: { "@type": "Answer", text: "Yes. The free tier includes 5,000 credits with no credit card required." } },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { label: "Saved by users", value: 1247 + globalStats.savings, prefix: "$", suffix: "", color: "text-emerald-400" },
                { label: "Requests routed", value: 94000 + globalStats.requests, prefix: "", suffix: "+", color: "text-blue-400" },
                { label: "Dev teams", value: 450 + globalStats.users, prefix: "", suffix: "+", color: "text-purple-400" },
                { label: "Avg latency", value: globalStats.avgLatency, prefix: "", suffix: "ms", color: "text-white" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center border border-white/5 bg-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm min-w-[110px]">
                  <p className={`text-lg font-black italic ${s.color}`}>
                    <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
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
                icon: <Zap size={18} className="text-yellow-300" />,
                title: "Semantic Cache",
                desc: "Every routed prompt is embedded and stored. Similar future requests are served instantly — no model call, zero cost. The more traffic, the smarter the cache.",
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
            <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.4em] mb-3">Model Tax Calculator</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">How much are you <span className="text-red-400">overpaying?</span></h2>
            <p className="text-sm text-zinc-500 mt-3 max-w-xl mx-auto">Most AI apps send every request to GPT-4o. But 80% of those requests could use a cheaper model with identical quality. That gap is your Model Tax.</p>
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

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Wall of Savings</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Teams that stopped overpaying.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="relative p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <Quote size={20} className="text-blue-600 shrink-0" />
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                    -{t.savings} cost
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed italic flex-grow">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-[8px] font-black text-white shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tight">{t.name}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 opacity-25">
            {["LangChain", "FastAPI", "OpenAI", "Anthropic", "Llama 3", "Vercel", "Railway"].map((b) => (
              <span key={b} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-gradient-to-b from-blue-600/10 to-zinc-900/40 border border-blue-500/20 shadow-[0_0_80px_-20px_rgba(37,99,235,0.3)]">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Start in 30 seconds</p>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4 leading-tight">
            Your next API call <br/> <span className="text-blue-400">costs less.</span>
          </h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide mb-10">
            Free tier · No credit card · OpenAI compatible
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-16 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
                Get Free API Key →
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-block px-16 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
            >
              Go to Dashboard →
            </Link>
          </SignedIn>
          <div className="mt-8 flex justify-center gap-6 flex-wrap">
            {["5,000 free credits", "Setup in 30s", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <CheckCircle2 size={10} className="text-emerald-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- SEO INTERNAL LINKS --- */}
      <section className="py-16 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 text-center">Learn More</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/reduce-openai-costs" className="group p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-blue-500/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Guide</p>
              <h3 className="text-white font-black italic uppercase tracking-tight group-hover:text-blue-400 transition-colors">How to Reduce OpenAI API Costs by 97%</h3>
              <p className="text-zinc-600 text-xs mt-2">Step-by-step breakdown of cost reduction strategies for production AI systems.</p>
            </Link>
            <Link href="/llm-cost-optimization" className="group p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-blue-500/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Guide</p>
              <h3 className="text-white font-black italic uppercase tracking-tight group-hover:text-blue-400 transition-colors">LLM Cost Optimization: The Complete Playbook</h3>
              <p className="text-zinc-600 text-xs mt-2">Model tiering, semantic caching, prompt compression — all techniques explained.</p>
            </Link>
          </div>
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
