import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, DollarSign, Cpu, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: "NeuralRouting vs OpenRouter — OpenRouter Alternative 2026" },
  description: "Comparing NeuralRouting and OpenRouter across cost optimization, routing intelligence, caching, and pricing models. See why a 5.5% markup adds up fast.",
  keywords: [
    "openrouter alternative", "neuralrouting vs openrouter", "openrouter pricing",
    "openrouter markup", "cheapest llm router", "llm router pricing",
  ],
};

const Y = () => <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
const N = () => <XCircle size={16} className="text-zinc-600 shrink-0" />;

export default function VsOpenRouter() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-sm font-black italic uppercase tracking-tighter text-white">NeuralRouting<span className="text-blue-500">.</span></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-up" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-12 pb-20 px-6 text-center max-w-4xl mx-auto">
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">Comparison</p>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mb-6">
          NeuralRouting vs <span className="text-blue-400">OpenRouter</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          OpenRouter is a model marketplace with 400+ models and a 5.5% markup. NeuralRouting is an intelligent LLM router that picks the cheapest model for each request with quality guarantees. One gives you access — the other delivers LLM cost optimization automatically.
        </p>
      </section>

      {/* Cost Reality */}
      <section className="px-6 max-w-4xl mx-auto pb-16">
        <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20">
          <h3 className="text-sm font-black text-red-400 uppercase mb-4">The 5.5% markup problem</h3>
          <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
            OpenRouter charges a 5.5% markup on every model call. That sounds small — until you scale:
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { spend: "$1K/mo", tax: "$55/mo", annual: "$660/yr" },
              { spend: "$10K/mo", tax: "$550/mo", annual: "$6,600/yr" },
              { spend: "$50K/mo", tax: "$2,750/mo", annual: "$33,000/yr" },
            ].map(({ spend, tax, annual }) => (
              <div key={spend} className="p-4 rounded-xl bg-black/30 border border-white/5">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">At {spend} spend</p>
                <p className="text-lg font-black text-red-400">{tax}</p>
                <p className="text-[10px] text-zinc-600">{annual}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-zinc-500 mt-4">
            NeuralRouting doesn't mark up model costs. Instead, it <strong className="text-white">reduces</strong> them by routing to cheaper models when premium isn't needed.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 max-w-4xl mx-auto pb-20">
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 text-[10px] font-black uppercase tracking-widest">
                <th className="text-left p-4 text-zinc-500">Feature</th>
                <th className="p-4 text-center text-blue-400">NeuralRouting</th>
                <th className="p-4 text-center text-zinc-400">OpenRouter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Pricing model", "Flat monthly + no markup", "5.5% markup on all calls", "", "Scales linearly with spend"],
                ["Intelligent routing", true, false, "Per-query complexity classification", "You pick the model manually"],
                ["Model Cascading", true, false, "Auto cheap → premium escalation", "Not available"],
                ["Semantic caching", true, false, "Meaning-based dedup, all tiers", "Basic prompt caching only"],
                ["Quality validation", true, false, "Shadow Engine", "Not available"],
                ["Self-healing routing", true, false, "Confidence Matrix", "Not available"],
                ["Multi-provider failover", true, true, "Automatic", "Built-in for listed models"],
                ["Models supported", "5 (growing)", "400+", "", "Largest marketplace"],
                ["OpenAI SDK compatible", true, true, "", ""],
                ["Cost optimization", true, false, "60-85% automatic savings", "No optimization — pass-through"],
                ["Spend analytics", true, false, "Per-model, per-request dashboard", "Basic usage stats"],
                ["Free tier", "5K credits", "Free (pay per use)", "", "No gateway fee, just markup"],
              ].map(([feature, nr, or_, nrNote, orNote], i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-zinc-300">{feature as string}</td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {typeof nr === 'boolean' ? (nr ? <Y /> : <N />) : <span className="text-white font-bold text-xs">{nr as string}</span>}
                      {nrNote && <span className="text-[10px] text-zinc-600">{nrNote as string}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {typeof or_ === 'boolean' ? (or_ ? <Y /> : <N />) : <span className="text-white font-bold text-xs">{or_ as string}</span>}
                      {orNote && <span className="text-[10px] text-zinc-600">{orNote as string}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Differences */}
      <section className="px-6 max-w-4xl mx-auto pb-20">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-10 text-center">Fundamentally different approaches</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, title: "Marketplace vs Router", desc: "OpenRouter is a marketplace: you pick a model, they proxy the call. NeuralRouting is a router: it picks the optimal model for you based on prompt complexity." },
            { icon: Cpu, title: "Access vs Optimization", desc: "OpenRouter's value is access to 400+ models through one API. NeuralRouting's value is making 5 models work like 400 by routing intelligently." },
            { icon: BarChart3, title: "Markup vs Savings", desc: "OpenRouter adds 5.5% to your bill. NeuralRouting removes 60-85% from it. At scale, this is the difference between paying more and paying less." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-3">
              <Icon size={20} className="text-blue-400" />
              <h3 className="text-sm font-black italic uppercase text-white">{title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* When to choose */}
      <section className="px-6 max-w-4xl mx-auto pb-20 border-t border-white/5 pt-16">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8 text-center">Which one should you pick?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-4">
            <h3 className="text-sm font-black uppercase text-blue-400">Choose NeuralRouting if:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>You want to <strong className="text-white">reduce costs, not just unify APIs</strong></li>
              <li>You don't want to <strong className="text-white">manually pick models</strong> per feature</li>
              <li>You value <strong className="text-white">quality guarantees</strong> on cheaper responses</li>
              <li>Your monthly AI spend is <strong className="text-white">&gt; $500</strong> (savings compound)</li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4">
            <h3 className="text-sm font-black uppercase text-zinc-400">Choose OpenRouter if:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>You need access to <strong className="text-white">400+ models</strong> through one API</li>
              <li>You want to <strong className="text-white">experiment with niche models</strong></li>
              <li>You prefer <strong className="text-white">pay-per-use</strong> with no monthly commitment</li>
              <li>Your AI spend is <strong className="text-white">&lt; $500/mo</strong> (markup is negligible)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 max-w-3xl mx-auto pb-20 text-center space-y-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Stop paying the markup. Start routing smart.</h2>
        <p className="text-zinc-500">Free tier available. No credit card required. OpenAI SDK compatible — migrate in 2 lines.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
          Start Free <ArrowRight size={14} />
        </Link>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">NeuralRouting.io — Intelligent AI routing infrastructure</p>
      </footer>
    </div>
  );
}
