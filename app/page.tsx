// Server Component — static HTML is rendered on the server for full SEO & Core Web Vitals.
// Interactive client islands are imported directly (they have "use client" directives).
import Link from 'next/link';
import {
  Zap, Shield, BarChart3, ArrowRight, CheckCircle2, Code, Cpu, TrendingDown,
  Lock, Timer, Activity, GitMerge, DollarSign, RefreshCw, Quote
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import FAQ from '@/components/FAQ';
import SavingsCalculator from '@/components/LazySavingsCalculator';
import { API_BASE } from '@/lib/config';
import Playground from '@/components/LazyPlayground';
import MobileNav from '@/components/MobileNav';
import CodeShowcase from '@/components/CodeShowcase';
import ScrollReveal from '@/components/ScrollReveal';
import HeroSection from '@/components/HeroSection';

const TESTIMONIALS = [
  {
    quote: "Switched from always using GPT-4 to NeuralRouting. Our AI costs dropped 71% in the first week. Same output quality, a fraction of the price.",
    name: "Marcus T.", role: "CTO · B2B SaaS", savings: "71%",
  },
  {
    quote: "The semantic cache alone paid for the subscription 10x over. Repeated questions from our users now cost literally zero.",
    name: "Priya K.", role: "AI Lead · EdTech", savings: "89%",
  },
  {
    quote: "We were burning $4k/mo on OpenAI. After NeuralRouting, we're at $800. The setup took 20 minutes and nothing broke.",
    name: "Daniel R.", role: "Founder · Dev Tools", savings: "80%",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://neuralrouting.io/#org",
      name: "NeuralRouting.io",
      url: "https://neuralrouting.io",
      logo: "https://neuralrouting.io/icon.png",
      description: "Intelligent LLM router and AI gateway that automatically routes each request to the cheapest model that can handle it. Reduces LLM costs 60-85% with Model Cascading, Shadow Engine quality validation, and semantic caching.",
      foundingDate: "2025",
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
        { "@type": "Offer", name: "Free",     price: "0",   priceCurrency: "USD" },
        { "@type": "Offer", name: "Starter",  price: "29",  priceCurrency: "USD" },
        { "@type": "Offer", name: "Growth",   price: "89",  priceCurrency: "USD" },
        { "@type": "Offer", name: "Business", price: "349", priceCurrency: "USD" },
      ],
      description: "Save up to 80% on AI API costs with intelligent prompt routing. OpenAI SDK compatible. Free tier available.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How much can an LLM router save on AI costs?", acceptedAnswer: { "@type": "Answer", text: "Most teams overpay 60-85% on LLM costs by sending every request to GPT-4o. NeuralRouting eliminates this Model Tax by routing simple tasks to economy models automatically, reducing AI costs by 60-85%." } },
        { "@type": "Question", name: "Is NeuralRouting compatible with the OpenAI SDK?", acceptedAnswer: { "@type": "Answer", text: "Yes. NeuralRouting is a drop-in OpenAI alternative API. Change your base_url and API key — works with any OpenAI SDK, LangChain, or custom integration." } },
        { "@type": "Question", name: "What happens when a provider goes down?", acceptedAnswer: { "@type": "Answer", text: "NeuralRouting provides automatic LLM failover. If OpenAI goes down, requests reroute to backup providers transparently. Your users never notice." } },
        { "@type": "Question", name: "How fast is LLM semantic caching?", acceptedAnswer: { "@type": "Answer", text: "Cache hits return in under 1ms at zero cost. The 2-level semantic cache matches both identical and similar queries, with typical 30-40% hit rates." } },
      ],
    },
  ],
};

// Fetch public stats server-side — available on first paint, good for LCP
async function getPublicStats() {
  try {
    const res = await fetch(`${API_BASE}/v1/public/stats`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("stats fetch failed");
    const d = await res.json();
    return { savings: d.total_savings_usd ?? 0, requests: d.total_requests ?? 0, users: d.user_count ?? 0 };
  } catch {
    return { savings: 0, requests: 0, users: 0 };
  }
}

export default async function LandingPage() {
  const globalStats = await getPublicStats();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* --- NAV --- */}
      <MobileNav />

      {/* --- HERO --- */}
      <HeroSection savings={globalStats.savings} stats={globalStats} />

      {/* --- HOW IT WORKS --- */}
      <ScrollReveal>
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Intelligent model routing pipeline</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white font-display">Four stages. Zero friction.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {[
              { step: "01", icon: <Code size={22} className="text-blue-400" />, title: "Classify & score", desc: "Our zero-cost local classifier detects task type (coding, math, analysis, creative, summary, translation) and scores complexity 1–10 in under 1ms. No API call — intelligent model selection happens locally." },
              { step: "02", icon: <Shield size={22} className="text-violet-400" />, title: "Security & cache", desc: "Prompt injection detection blocks threats across 6 categories. PII auto-redaction protects user data. Then our 2-level semantic cache checks for exact and similar matches — 30-40% of requests answered instantly at zero cost." },
              { step: "03", icon: <Cpu size={22} className="text-emerald-400" />, title: "Smart route & failover", desc: "Simple tasks route to economy models (60x cheaper). Complex reasoning goes to GPT-4o. If a provider fails, automatic multi-provider failover reroutes transparently — your users never notice LLM downtime." },
              { step: "04", icon: <RefreshCw size={22} className="text-orange-400" />, title: "Validate & learn", desc: "Shadow Engine runs the premium model in parallel to audit every economy response. Confidence Matrix learns which (task, model) pairs underperform and auto-escalates — your AI gateway gets smarter over time." },
            ].map((item) => (
              <div key={item.step} data-reveal className="relative bg-zinc-900/30 border border-white/5 rounded-3xl p-8 flex flex-col gap-4">
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
      </ScrollReveal>

      {/* --- FEATURES GRID --- */}
      <ScrollReveal>
      <section className="py-20 px-6 relative z-10 bg-zinc-950/60 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">AI gateway features</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white font-display">Enterprise-grade LLM infrastructure.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <GitMerge size={18} className="text-blue-400" />, title: "Intelligent Model Selection", desc: "Four routing modes: Auto, Cost, Speed, Quality. The LLM router classifies every prompt and selects the optimal model automatically." },
              { icon: <Shield size={18} className="text-violet-400" />, title: "Prompt Injection Shield", desc: "Zero-latency heuristic scanner blocks jailbreaks, DAN attempts, and system-prompt extraction before they reach the AI gateway." },
              { icon: <Activity size={18} className="text-emerald-400" />, title: "Shadow Quality Engine", desc: "Continuous quality auditing validates economy-model responses against premium. No other AI gateway offers this level of LLM cost optimization with quality proof." },
              { icon: <RefreshCw size={18} className="text-orange-400" />, title: "Self-Improving Router", desc: "The Confidence Matrix learns from every shadow audit. Underperforming model/task pairs auto-escalate. Your LLM router gets smarter over time." },
              { icon: <DollarSign size={18} className="text-yellow-400" />, title: "FinOps & Budget Caps", desc: "Per-user spend limits, ROI dashboards, and AI token cost optimization. See exactly how much you save vs direct OpenAI pricing." },
              { icon: <Zap size={18} className="text-yellow-300" />, title: "LLM Semantic Caching", desc: "2-level cache: exact hash + vector similarity matching. Similar prompts return cached responses instantly — reducing LLM latency to sub-millisecond at zero cost." },
            ].map((f) => (
              <div key={f.title} data-reveal className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:bg-zinc-900/40 transition-all">
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
      </ScrollReveal>

      <ScrollReveal>
      {/* --- BEFORE VS AFTER --- */}
      <section className="py-20 max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12" data-reveal>
          <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.4em] mb-3">The Model Tax in action</p>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white font-display">Same prompts. Dramatically different bills.</h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Savings badge — floating between cards */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-emerald-500 text-black font-black text-lg px-6 py-3 rounded-full shadow-2xl shadow-emerald-500/30 -rotate-3">
              85% SAVED
            </div>
          </div>

          {/* Before — desaturated, tilted */}
          <div data-reveal className="p-8 rounded-3xl bg-zinc-900/20 border border-red-500/15 opacity-70 md:-rotate-1 transition-transform hover:rotate-0">
            <p className="text-[9px] font-black uppercase text-red-500/60 mb-5 tracking-widest">Without routing — all GPT-4o</p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-600">Summary</span> <span className="text-zinc-400 line-through">GPT-4o ($0.0100)</span></div>
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-600">Classification</span> <span className="text-zinc-400 line-through">GPT-4o ($0.0080)</span></div>
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-600">Simple Reply</span> <span className="text-zinc-400 line-through">GPT-4o ($0.0150)</span></div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-black italic uppercase text-red-500/60"><span>Monthly waste</span> <span>$3,400/mo</span></div>
            </div>
          </div>

          {/* After — prominent, glowing */}
          <div data-reveal className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.15)] md:rotate-1 transition-transform hover:rotate-0">
            <p className="text-[9px] font-black uppercase text-blue-400 mb-5 tracking-widest">With NeuralRouting — auto-routed</p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-400">Summary</span> <span className="text-emerald-400">Llama 3 ($0.0003)</span></div>
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-400">Classification</span> <span className="text-emerald-400">Llama 3 ($0.0001)</span></div>
              <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-400">Complex Analysis</span> <span className="text-blue-400">GPT-4o ($0.0150)</span></div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-black italic uppercase text-emerald-400"><span>Monthly cost</span> <span>$510/mo</span></div>
            </div>
          </div>

          {/* Mobile savings badge */}
          <div className="md:hidden flex justify-center -mt-4">
            <div className="bg-emerald-500 text-black font-black text-sm px-5 py-2 rounded-full shadow-lg">
              85% SAVED
            </div>
          </div>
        </div>
        <div className="text-center">
          <SignInButton mode="modal">
            <button className="px-12 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
              Eliminate Your Model Tax
            </button>
          </SignInButton>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
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
      </ScrollReveal>

      <ScrollReveal>
      {/* --- CODE SHOWCASE --- */}
      <section className="py-24 px-6 relative z-10 bg-zinc-950/50 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 italic">Change one line</h2>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-6">OpenAI alternative API. <br/> Integrated in seconds.</h3>
            <ul className="space-y-4 mb-10">
              <li className="flex gap-3 text-sm text-zinc-400 font-bold uppercase"><CheckCircle2 size={16} className="text-blue-600" /> OpenAI SDK compatible — drop-in LLM proxy</li>
              <li className="flex gap-3 text-sm text-zinc-400 font-bold uppercase"><CheckCircle2 size={16} className="text-blue-600" /> Multi-provider LLM API with failover</li>
              <li className="flex gap-3 text-sm text-zinc-400 font-bold uppercase"><CheckCircle2 size={16} className="text-blue-600" /> Free tier — no credit card required</li>
            </ul>
            <Link href="/docs" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
              Read the docs <ArrowRight size={12} />
            </Link>
          </div>
          <CodeShowcase />
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      {/* --- SAVINGS CALCULATOR --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.4em] mb-3">Model Tax Calculator</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white font-display">How much are you <span className="text-red-400">overpaying?</span></h2>
            <p className="text-sm text-zinc-500 mt-3 max-w-xl mx-auto">Most AI apps send every request to GPT-4o. But 80% of those requests could use a cheaper model with identical quality. That gap is your Model Tax.</p>
          </div>
          <SavingsCalculator />
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      {/* --- PRICING TEASER --- */}
      <section className="py-24 px-6 relative z-10 bg-zinc-950/60 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Pricing</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white font-display">Start free. Scale when ready.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { name: "Free",     price: "$0",   note: "forever", credits: "5K credits",   highlight: false, tag: null },
              { name: "Starter",  price: "$29",  note: "/ mo",    credits: "50K credits",  highlight: false, tag: null },
              { name: "Growth",   price: "$89",  note: "/ mo",    credits: "200K credits", highlight: true,  tag: "Most Popular" },
              { name: "Business", price: "$349", note: "/ mo",    credits: "1M credits",   highlight: false, tag: null },
            ].map((plan) => (
              <div key={plan.name} data-reveal className={`relative rounded-2xl p-6 flex flex-col gap-3 border transition-all ${plan.highlight ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.15)]" : "bg-zinc-900/20 border-white/5"}`}>
                {plan.tag && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">{plan.tag}</span>}
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
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all">
              See full pricing &amp; features <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      {/* --- TESTIMONIALS --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Wall of Savings</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white font-display">Teams that stopped overpaying.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} data-reveal className="relative p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <Quote size={20} className="text-blue-600 shrink-0" />
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">-{t.savings} cost</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed italic flex-grow">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-[8px] font-black text-white shrink-0">{t.name[0]}</div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tight">{t.name}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 opacity-25">
            {["LangChain", "FastAPI", "OpenAI", "Anthropic", "Llama 3", "Vercel", "Railway"].map((b) => (
              <span key={b} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{b}</span>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-gradient-to-b from-blue-600/10 to-zinc-900/40 border border-blue-500/20 shadow-[0_0_80px_-20px_rgba(37,99,235,0.3)]">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Start in 30 seconds</p>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4 leading-tight">Your next API call <br/> <span className="text-blue-400">costs less.</span></h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide mb-10">Free tier · No credit card · OpenAI compatible</p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-16 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
                Get Free API Key →
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="inline-block px-16 py-6 bg-blue-600 text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
              Go to Dashboard →
            </Link>
          </SignedIn>
          <div className="mt-8 flex justify-center gap-6 flex-wrap">
            {["5,000 free credits", "Setup in 30s", "Cancel anytime"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <CheckCircle2 size={10} className="text-emerald-600" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* --- SEO INTERNAL LINKS --- */}
      <section className="py-16 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 text-center">Learn More</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/reduce-openai-costs" className="group p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-blue-500/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Guide</p>
              <h3 className="text-white font-black italic uppercase tracking-tight group-hover:text-blue-400 transition-colors">How to Reduce OpenAI API Costs by 85%</h3>
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
          <div className="text-xl font-black tracking-tighter italic">NEURAL<span className="text-blue-600">ROUTING</span></div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[9px] font-black uppercase tracking-widest">
            <Link href="/docs"    className="text-zinc-600 hover:text-zinc-400 transition-colors">Docs</Link>
            <Link href="/blog"    className="text-zinc-600 hover:text-zinc-400 transition-colors">Blog</Link>
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-400 transition-colors">Pricing</Link>
            <Link href="/terms"   className="text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
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
