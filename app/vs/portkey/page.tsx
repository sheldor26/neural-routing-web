import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Shield, Zap, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: "NeuralRouting vs Portkey — Portkey Alternative 2026" },
  description: "Comparing NeuralRouting and Portkey.ai across cost optimization, intelligent routing, semantic caching, and quality validation. See which AI gateway fits your needs.",
  keywords: [
    "portkey alternative", "neuralrouting vs portkey", "portkey.ai alternative",
    "ai gateway comparison", "llm router comparison", "portkey pricing",
  ],
};

const Y = () => <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
const N = () => <XCircle size={16} className="text-zinc-600 shrink-0" />;
const P = ({ children }: { children: React.ReactNode }) => <span className="text-amber-400 text-[11px] font-bold uppercase">{children}</span>;

export default function VsPortkey() {
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
          NeuralRouting vs <span className="text-blue-400">Portkey</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Portkey is a full observability platform. NeuralRouting is a cost optimization engine. Both are AI gateways — but they solve different problems. Here's how they compare.
        </p>
      </section>

      {/* Comparison Table */}
      <section className="px-6 max-w-4xl mx-auto pb-20">
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 text-[10px] font-black uppercase tracking-widest">
                <th className="text-left p-4 text-zinc-500">Feature</th>
                <th className="p-4 text-center text-blue-400">NeuralRouting</th>
                <th className="p-4 text-center text-zinc-400">Portkey</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Intelligent per-query routing", true, false, "Routes by prompt complexity automatically", "Basic fallback/load-balance only"],
                ["Model Cascading", true, false, "Cheap → mid → premium, auto-escalation", "Manual model selection"],
                ["Semantic caching", true, true, "All tiers, meaning-based dedup", "Production+ plan only"],
                ["Quality validation", true, false, "Shadow Engine validates every economy response", "Not available"],
                ["Self-healing routing", true, false, "Confidence Matrix learns from production data", "Not available"],
                ["Prompt security", true, true, "Built-in shield, all tiers", "Guardrails (Enterprise only)"],
                ["Observability / logging", true, true, "Dashboard + API", "Full observability stack"],
                ["Multi-provider failover", true, true, "Automatic", "Configurable"],
                ["Models supported", "5 (growing)", "250+", "", ""],
                ["OpenAI SDK compatible", true, true, "", ""],
                ["SOC2 / HIPAA", false, true, "Not yet", "Enterprise plan"],
                ["Self-hosting", false, true, "Managed only", "Enterprise only"],
                ["Free tier", "5K credits", "10K logs", "", ""],
                ["Starter price", "$29/mo", "$49/mo", "", ""],
              ].map(([feature, nr, pk, nrNote, pkNote], i) => (
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
                      {typeof pk === 'boolean' ? (pk ? <Y /> : <N />) : <span className="text-white font-bold text-xs">{pk as string}</span>}
                      {pkNote && <span className="text-[10px] text-zinc-600">{pkNote as string}</span>}
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
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-10 text-center">Where they differ</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, title: "Cost Optimization", desc: "NeuralRouting automatically routes simple tasks to cheap models. Portkey lets you pick models manually but doesn't optimize cost per-request. This is the core difference." },
            { icon: Shield, title: "Quality Guarantee", desc: "NeuralRouting's Shadow Engine validates every economy response against a premium model in the background. If quality drops, it auto-escalates. Portkey doesn't have this." },
            { icon: Zap, title: "Observability", desc: "Portkey's strength is full-stack observability: traces, metrics, logs, guardrails. NeuralRouting has basic analytics but doesn't match Portkey's depth here." },
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
              <li>Your primary goal is <strong className="text-white">reducing LLM costs</strong></li>
              <li>You want <strong className="text-white">automatic routing</strong> without manual model selection</li>
              <li>You value <strong className="text-white">quality guarantees</strong> on economy responses</li>
              <li>You want semantic caching <strong className="text-white">included at every tier</strong></li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4">
            <h3 className="text-sm font-black uppercase text-zinc-400">Choose Portkey if:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>You need <strong className="text-white">deep observability</strong> (traces, metrics, logs)</li>
              <li>You need <strong className="text-white">SOC2/HIPAA compliance</strong></li>
              <li>You want <strong className="text-white">250+ model support</strong> across all providers</li>
              <li>You have budget for <strong className="text-white">enterprise pricing</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 max-w-3xl mx-auto pb-20 text-center space-y-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Ready to eliminate your Model Tax?</h2>
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
