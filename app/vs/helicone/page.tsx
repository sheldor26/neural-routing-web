import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Eye, DollarSign, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: "NeuralRouting vs Helicone — Helicone Alternative 2026" },
  description: "Comparing NeuralRouting and Helicone across cost optimization, observability, routing intelligence, and pricing. Helicone is observability-first; NeuralRouting is cost-first.",
  keywords: [
    "helicone alternative", "neuralrouting vs helicone", "helicone.ai alternative",
    "ai gateway comparison", "llm observability", "llm cost optimization",
    "helicone pricing", "openai proxy",
  ],
  alternates: { canonical: "https://neuralrouting.io/vs/helicone" },
  openGraph: {
    title: "NeuralRouting vs Helicone — Helicone Alternative 2026",
    description: "Helicone logs and evaluates. NeuralRouting routes and saves. Here's when each one fits.",
    url: "https://neuralrouting.io/vs/helicone",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuralRouting vs Helicone — Helicone Alternative 2026",
    description: "Helicone logs and evaluates. NeuralRouting routes and saves. Here's when each one fits.",
  },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "NeuralRouting vs Helicone — Helicone Alternative 2026",
  description:
    "In-depth comparison of NeuralRouting and Helicone across cost optimization, observability, routing intelligence, and pricing.",
  author: { "@type": "Organization", name: "NeuralRouting.io", url: "https://neuralrouting.io" },
  publisher: {
    "@type": "Organization",
    name: "NeuralRouting.io",
    logo: { "@type": "ImageObject", url: "https://neuralrouting.io/logo.png" },
  },
  about: ["NeuralRouting.io", "Helicone.ai"],
  url: "https://neuralrouting.io/vs/helicone",
  mainEntityOfPage: "https://neuralrouting.io/vs/helicone",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://neuralrouting.io" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://neuralrouting.io/vs/portkey" },
    { "@type": "ListItem", position: 3, name: "vs Helicone", item: "https://neuralrouting.io/vs/helicone" },
  ],
};

const Y = () => <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
const N = () => <XCircle size={16} className="text-zinc-600 shrink-0" />;

export default function VsHelicone() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-sm font-black italic uppercase tracking-tighter text-white">
          NeuralRouting<span className="text-blue-500">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-up" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-12 pb-12 px-6 text-center max-w-4xl mx-auto">
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">Comparison</p>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mb-6">
          NeuralRouting vs <span className="text-blue-400">Helicone</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Helicone is an LLM observability platform — logs, traces, evals, session replay. NeuralRouting is an intelligent LLM router focused on automatic cost optimization with quality validation. They solve different problems, and honestly, many teams end up running both.
        </p>
      </section>

      {/* TL;DR table — 5 dimensions */}
      <section className="px-6 max-w-4xl mx-auto pb-16">
        <div className="mb-4 px-4 py-2 inline-block rounded-full border border-blue-500/30 bg-blue-500/10">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-300">TL;DR — 5 dimensions</p>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 text-[10px] font-black uppercase tracking-widest">
                <th className="text-left p-4 text-zinc-500">Dimension</th>
                <th className="p-4 text-center text-blue-400">NeuralRouting</th>
                <th className="p-4 text-center text-zinc-400">Helicone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Primary job", "Cut LLM cost per request", "Observe & evaluate LLM calls"],
                ["Routing intelligence", "Automatic, per-prompt", "None (proxy-only)"],
                ["Cost reduction", "60–85% out of the box", "Indirect (insights only)"],
                ["Observability depth", "Dashboard + per-request logs", "Full traces, sessions, evals"],
                ["Pricing posture", "Savings-aligned tiers", "Pay-per-log volume"],
              ].map(([dim, nr, hc], i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-zinc-300">{dim}</td>
                  <td className="p-4 text-center text-white text-xs font-bold">{nr}</td>
                  <td className="p-4 text-center text-zinc-400 text-xs">{hc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Full comparison */}
      <section className="px-6 max-w-4xl mx-auto pb-20">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-6 text-center">Feature-by-feature</h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 text-[10px] font-black uppercase tracking-widest">
                <th className="text-left p-4 text-zinc-500">Feature</th>
                <th className="p-4 text-center text-blue-400">NeuralRouting</th>
                <th className="p-4 text-center text-zinc-400">Helicone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Intelligent per-query routing", true, false, "Routes by prompt complexity automatically", "Proxy-through, no routing"],
                ["Model Cascading", true, false, "Cheap → mid → premium, auto-escalation", "Not available"],
                ["Semantic caching", true, true, "All tiers, meaning-based dedup", "Exact-match caching (Pro+)"],
                ["Quality validation (Shadow)", true, false, "Every economy response validated vs premium", "Evals framework (manual setup)"],
                ["Observability / traces", true, true, "Per-request logs + dashboard", "Full trace, session replay, evals"],
                ["Prompt experimentation", false, true, "Not the focus", "Prompts, playground, A/B"],
                ["Prompt security / guardrails", true, false, "Built-in shield, all tiers", "Not core product"],
                ["Multi-provider failover", true, false, "Automatic", "Not routing-aware"],
                ["OpenAI SDK compatible", true, true, "", ""],
                ["Self-hosting", false, true, "Managed only", "OSS self-hostable"],
                ["Free tier", "5K credits", "10K requests/mo", "", ""],
                ["Starter price", "$29/mo", "$20/mo (Pro)", "", ""],
              ].map(([feature, nr, hc, nrNote, hcNote], i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-zinc-300">{feature as string}</td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {typeof nr === 'boolean' ? (nr ? <Y /> : <N />) : <span className="text-white font-bold text-xs">{nr as string}</span>}
                      {nrNote ? <span className="text-[10px] text-zinc-600">{nrNote as string}</span> : null}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {typeof hc === 'boolean' ? (hc ? <Y /> : <N />) : <span className="text-white font-bold text-xs">{hc as string}</span>}
                      {hcNote ? <span className="text-[10px] text-zinc-600">{hcNote as string}</span> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key differences */}
      <section className="px-6 max-w-4xl mx-auto pb-20">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-10 text-center">Where they differ</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, title: "Cost vs Visibility", desc: "NeuralRouting lowers the bill automatically by sending simple prompts to cheap models. Helicone shows you the bill in exquisite detail — but acting on it is your job." },
            { icon: Eye, title: "Observability depth", desc: "Helicone's session replay, prompt experiments, and eval framework are genuinely best-in-class. NeuralRouting gives you per-request logs and savings analytics, not full trace tooling." },
            { icon: Zap, title: "Routing intelligence", desc: "NeuralRouting classifies every prompt and picks a model. Helicone proxies the request to whatever model you hard-coded. Different abstractions — both legitimate." },
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
              <li>Your pain is a <strong className="text-white">fast-growing LLM bill</strong>, not missing logs</li>
              <li>You want <strong className="text-white">automatic routing</strong> without writing classifiers</li>
              <li>You need <strong className="text-white">quality guarantees</strong> on cheap-model responses</li>
              <li>You prefer a <strong className="text-white">managed gateway</strong> to self-hosting infra</li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4">
            <h3 className="text-sm font-black uppercase text-zinc-400">Choose Helicone if:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>You need <strong className="text-white">deep observability</strong> — sessions, traces, replay</li>
              <li>You run <strong className="text-white">prompt experiments</strong> and evals as a workflow</li>
              <li>You want to <strong className="text-white">self-host</strong> the logging layer</li>
              <li>Cost is managed, and your bottleneck is <strong className="text-white">quality iteration</strong></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          Honest take: these products aren&apos;t mutually exclusive. Plenty of teams run Helicone for observability and NeuralRouting in front of it for cost routing. They address different layers.
        </p>
      </section>

      {/* CTA */}
      <section className="px-6 max-w-3xl mx-auto pb-20 text-center space-y-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Ready to eliminate your Model Tax?</h2>
        <p className="text-zinc-500">See NeuralRouting pricing. Free tier, no credit card, OpenAI SDK compatible.</p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
        >
          See pricing <ArrowRight size={14} />
        </Link>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">NeuralRouting.io — Intelligent AI routing infrastructure</p>
      </footer>
    </div>
  );
}
