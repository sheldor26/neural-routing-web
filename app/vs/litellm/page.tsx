import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Shield, Server, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: "NeuralRouting vs LiteLLM — LiteLLM Alternative 2026" },
  description: "Comparing NeuralRouting and LiteLLM across cost optimization, setup complexity, security, and managed vs self-hosted. Find the right AI gateway for your team.",
  keywords: [
    "litellm alternative", "neuralrouting vs litellm", "litellm alternative 2026",
    "litellm security", "litellm supply chain attack", "managed ai gateway",
  ],
  alternates: { canonical: "https://neuralrouting.io/vs/litellm" },
};

const Y = () => <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
const N = () => <XCircle size={16} className="text-zinc-600 shrink-0" />;

export default function VsLitellm() {
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
          NeuralRouting vs <span className="text-blue-400">LiteLLM</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          LiteLLM is an open-source LLM proxy server with massive provider support. NeuralRouting is a managed AI gateway with intelligent model selection and LLM semantic caching. Different approaches to the same multi-provider LLM API problem.
        </p>
      </section>

      {/* Security Alert */}
      <section className="px-6 max-w-4xl mx-auto pb-12">
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-black text-amber-400 uppercase mb-1">March 2026 Security Incident</h3>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              LiteLLM versions 1.82.7 and 1.82.8 on PyPI were compromised with malware that stole SSH keys, AWS/GCP/Azure credentials, Kubernetes secrets, and crypto wallets. Projects affected included Microsoft GraphRAG, Google ADK, DSPy, and CrewAI. The team has since recovered, but this is a consideration for regulated environments.
            </p>
          </div>
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
                <th className="p-4 text-center text-zinc-400">LiteLLM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Deployment model", "Managed SaaS", "Self-hosted (Redis + PostgreSQL)", "", "Requires DevOps setup"],
                ["Setup time", "2 minutes", "2-4 weeks", "", "Infrastructure provisioning needed"],
                ["Intelligent routing", true, false, "Per-query complexity classification", "Basic fallback/cooldown only"],
                ["Model Cascading", true, false, "Auto cheap → mid → premium", "Not available"],
                ["Semantic caching", true, false, "Built-in, all tiers", "Not native (requires external)"],
                ["Quality validation", true, false, "Shadow Engine", "Not available"],
                ["Prompt security", true, true, "Built-in shield", "Enterprise only"],
                ["Models supported", "5 (growing)", "100+", "", "Broadest provider coverage"],
                ["OpenAI SDK compatible", true, true, "", ""],
                ["Self-hosting", false, true, "Managed only", "Core feature"],
                ["Infrastructure cost", "$0", "$200-$500/mo", "Included in plan", "Redis + PostgreSQL + compute"],
                ["Maintenance burden", "Zero", "Ongoing", "Managed for you", "Updates, patches, monitoring"],
                ["Supply chain risk", "Low", "Elevated", "Managed dependencies", "March 2026 incident"],
                ["Free tier", "5K credits", "Open source", "", "Free but requires infra"],
                ["Paid plans", "From $29/mo", "From $250/mo", "", "Enterprise pricing"],
              ].map(([feature, nr, lm, nrNote, lmNote], i) => (
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
                      {typeof lm === 'boolean' ? (lm ? <Y /> : <N />) : <span className="text-white font-bold text-xs">{lm as string}</span>}
                      {lmNote && <span className="text-[10px] text-zinc-600">{lmNote as string}</span>}
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
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-10 text-center">The core trade-off</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Server, title: "Managed vs Self-Hosted", desc: "LiteLLM gives you full control but requires Redis, PostgreSQL, and ongoing DevOps. NeuralRouting is managed — you change 2 lines of code and it works." },
            { icon: Shield, title: "Security Posture", desc: "LiteLLM's supply chain attack exposed credentials in production environments. NeuralRouting has a smaller dependency surface and managed security updates." },
            { icon: AlertTriangle, title: "Provider Breadth", desc: "LiteLLM supports 100+ providers — its biggest strength. NeuralRouting supports 5 models today but routes between them intelligently. Breadth vs depth." },
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
              <li>You want to be <strong className="text-white">up and running in minutes</strong>, not weeks</li>
              <li>You don't have <strong className="text-white">DevOps capacity</strong> for self-hosting</li>
              <li>You want <strong className="text-white">automatic cost optimization</strong> without configuring routing rules</li>
              <li>You need <strong className="text-white">quality validation</strong> on routed responses</li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4">
            <h3 className="text-sm font-black uppercase text-zinc-400">Choose LiteLLM if:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>You need <strong className="text-white">100+ model support</strong> across all providers</li>
              <li>You require <strong className="text-white">full data sovereignty</strong> (self-hosted)</li>
              <li>You have <strong className="text-white">DevOps resources</strong> for ongoing maintenance</li>
              <li>You want <strong className="text-white">open-source flexibility</strong> to customize</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 max-w-3xl mx-auto pb-20 text-center space-y-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Skip the infrastructure. Start routing.</h2>
        <p className="text-zinc-500">Free tier available. No credit card, no Redis, no PostgreSQL. Just change your base_url.</p>
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
