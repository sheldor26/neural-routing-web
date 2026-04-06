import { Metadata } from 'next';
import Link from 'next/link';
import SavingsCalculator from '@/components/SavingsCalculator';

export const metadata: Metadata = {
  title: { absolute: "The Model Tax — Stop Overpaying for AI | NeuralRouting" },
  description: "The Model Tax is the invisible cost of sending every LLM request to a premium model. 80% of AI tasks don't need GPT-4o. Calculate your waste and eliminate it with intelligent model routing.",
  keywords: [
    "model tax", "LLM cost optimization", "reduce openai costs", "reduce AI costs",
    "LLM router", "AI gateway", "GPT-4o cost per token", "model cascading",
    "intelligent model selection", "AI token cost optimization", "cheapest LLM router",
    "how to reduce LLM costs", "LLM semantic caching", "multi-provider LLM API",
  ],
};

export default function ModelTaxPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-sm font-black italic uppercase tracking-tighter text-white">NeuralRouting<span className="text-blue-500">.</span></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-up" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-24 px-6 text-center max-w-4xl mx-auto">
        <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.4em] mb-6">The Hidden Cost of AI</p>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mb-6">
          The Model Tax is <span className="text-red-400">eating your budget.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Every time you send a simple question to GPT-4o, you're paying 60x more than you need to.
          That's the <strong className="text-white">Model Tax</strong> — the invisible cost of not routing by complexity.
        </p>
      </section>

      {/* What is the Model Tax */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">What is the Model Tax?</h2>
            <p className="text-zinc-400 leading-relaxed">
              The Model Tax is the difference between what you pay by sending every request to a premium model (GPT-4o, Claude Sonnet) and what you'd pay by using the cheapest model that delivers the same quality for each task.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Research from UC Berkeley shows that <strong className="text-white">up to 80% of typical LLM requests</strong> can be handled by smaller, cheaper models with no measurable quality loss. The Model Tax is the cost of ignoring this.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Without routing</span>
                <span className="text-[9px] font-black text-zinc-600 uppercase">100% GPT-4o</span>
              </div>
              <div className="h-3 bg-red-500/30 rounded-full">
                <div className="h-full bg-red-500 rounded-full w-full" />
              </div>
              <p className="text-right text-xs font-black text-red-400 mt-2">$12.50 / 1M tokens</p>
            </div>
            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">With NeuralRouting</span>
                <span className="text-[9px] font-black text-zinc-600 uppercase">Smart routing</span>
              </div>
              <div className="h-3 bg-blue-500/10 rounded-full flex overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '80%' }} />
                <div className="h-full bg-blue-500 rounded-r-full" style={{ width: '20%' }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] font-bold text-emerald-400">80% economy ($0.20/1M)</span>
                <span className="text-[9px] font-bold text-blue-400">20% premium ($12.50/1M)</span>
              </div>
              <p className="text-right text-xs font-black text-blue-400 mt-1">$2.66 / 1M tokens avg</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center mb-16">How Model Cascading eliminates the tax</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Classify", desc: "Every request is analyzed for complexity in < 1ms using a local heuristic classifier. Zero API cost, zero latency." },
            { step: "02", title: "Route", desc: "Simple tasks go to Llama 3 (60x cheaper). Complex tasks go to GPT-4o. You only pay premium prices for premium needs." },
            { step: "03", title: "Validate", desc: "Our Shadow Engine runs quality checks against premium models in the background, ensuring the cheap model's answer was good enough." },
          ].map(s => (
            <div key={s.step} className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4">
              <span className="text-5xl font-black italic text-blue-600/20">{s.step}</span>
              <h3 className="text-lg font-black italic uppercase text-white">{s.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Calculate your Model Tax</h2>
            <p className="text-sm text-zinc-500 mt-3">See exactly how much you're overpaying and what NeuralRouting saves you.</p>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* Real savings examples */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center mb-4">Real LLM cost optimization examples</h2>
        <p className="text-sm text-zinc-500 text-center mb-12 max-w-2xl mx-auto">These scenarios show how intelligent model routing reduces AI costs across different application types — without sacrificing output quality.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "SaaS Support Bot",
              before: "$9,000/mo",
              after: "$2,700/mo",
              saved: "$75,600/yr",
              detail: "50K daily requests. 70% are FAQ lookups and status checks routed to economy models. Complex escalations stay on GPT-4o.",
            },
            {
              title: "Code Generation Platform",
              before: "$12,000/mo",
              after: "$3,900/mo",
              saved: "$97,200/yr",
              detail: "100K daily requests. Shadow Engine validates that 70% of simple code tasks (bugfixes, templates) work on economy tier.",
            },
            {
              title: "Internal AI Assistant",
              before: "$4,000/mo",
              after: "$1,500/mo",
              saved: "$30,000/yr",
              detail: "10K daily requests + 40% semantic cache hit rate. Repeat analysis and FAQs served from cache at zero cost.",
            },
          ].map(ex => (
            <div key={ex.title} className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4">
              <h3 className="text-sm font-black uppercase text-white">{ex.title}</h3>
              <div className="flex items-center gap-3">
                <span className="text-red-400 line-through text-sm font-bold">{ex.before}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-emerald-400 text-sm font-bold">{ex.after}</span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg inline-block">
                <span className="text-[10px] font-black text-emerald-400 uppercase">Saves {ex.saved}</span>
              </div>
              <p className="text-[12px] text-zinc-500 leading-relaxed">{ex.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality guarantee */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5 text-center space-y-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">"But what about quality?"</h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          NeuralRouting never sacrifices quality. The Shadow Engine validates every economy response against a premium model in the background.
          If quality drops below threshold, the system <strong className="text-white">automatically escalates to GPT-4o</strong> — transparently, in the same request.
        </p>
        <p className="text-zinc-500">
          The Confidence Matrix learns from every validated response, getting smarter over time. It's a self-improving quality guarantee that no other AI gateway offers.
        </p>
        <Link href="/sign-up" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
          Eliminate Your Model Tax — Start Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
          NeuralRouting.io — Intelligent AI routing infrastructure
        </p>
      </footer>
    </div>
  );
}
