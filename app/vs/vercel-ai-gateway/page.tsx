import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Cpu, DollarSign, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: "NeuralRouting vs Vercel AI Gateway — Vercel AI Gateway Alternative 2026" },
  description: "Comparing NeuralRouting and the Vercel AI Gateway across cost optimization, routing intelligence, lock-in, and multi-cloud support. Provider-agnostic router vs Vercel-bundled gateway.",
  keywords: [
    "vercel ai gateway alternative", "neuralrouting vs vercel ai gateway",
    "vercel ai sdk", "ai gateway comparison", "llm router",
    "vercel ai gateway pricing", "multi-cloud llm gateway",
  ],
  alternates: { canonical: "https://neuralrouting.io/vs/vercel-ai-gateway" },
  openGraph: {
    title: "NeuralRouting vs Vercel AI Gateway — Alternative 2026",
    description: "Provider-agnostic routing vs a gateway bundled with Vercel. Here's when each fits.",
    url: "https://neuralrouting.io/vs/vercel-ai-gateway",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuralRouting vs Vercel AI Gateway — Alternative 2026",
    description: "Provider-agnostic routing vs a gateway bundled with Vercel. Here's when each fits.",
  },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "NeuralRouting vs Vercel AI Gateway — Vercel AI Gateway Alternative 2026",
  description:
    "In-depth comparison of NeuralRouting and the Vercel AI Gateway across cost optimization, routing intelligence, and lock-in.",
  author: { "@type": "Organization", name: "NeuralRouting.io", url: "https://neuralrouting.io" },
  publisher: {
    "@type": "Organization",
    name: "NeuralRouting.io",
    logo: { "@type": "ImageObject", url: "https://neuralrouting.io/logo.png" },
  },
  about: ["NeuralRouting.io", "Vercel AI Gateway"],
  url: "https://neuralrouting.io/vs/vercel-ai-gateway",
  mainEntityOfPage: "https://neuralrouting.io/vs/vercel-ai-gateway",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://neuralrouting.io" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://neuralrouting.io/vs/portkey" },
    { "@type": "ListItem", position: 3, name: "vs Vercel AI Gateway", item: "https://neuralrouting.io/vs/vercel-ai-gateway" },
  ],
};

const Y = () => <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
const N = () => <XCircle size={16} className="text-zinc-600 shrink-0" />;

export default function VsVercelAIGateway() {
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
          NeuralRouting vs <span className="text-blue-400">Vercel AI Gateway</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Vercel&apos;s AI Gateway is a convenience layer for the Vercel AI SDK — unified provider auth, basic failover, and simple proxying. NeuralRouting is a provider-agnostic intelligent router that classifies prompts and picks the cheapest capable model automatically. They overlap on the proxy surface and diverge on everything else.
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
                <th className="p-4 text-center text-zinc-400">Vercel AI Gateway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Primary job", "Cut LLM cost per request", "Unify provider auth + failover"],
                ["Routing intelligence", "Automatic, per-prompt", "Manual model choice"],
                ["Cost reduction", "60–85% out of the box", "Minimal (routing not cost-aware)"],
                ["Platform coupling", "Any runtime, any cloud", "Tied to Vercel + AI SDK DX"],
                ["SDK surface", "OpenAI SDK compatible", "Vercel AI SDK native"],
              ].map(([dim, nr, vc], i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-zinc-300">{dim}</td>
                  <td className="p-4 text-center text-white text-xs font-bold">{nr}</td>
                  <td className="p-4 text-center text-zinc-400 text-xs">{vc}</td>
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
                <th className="p-4 text-center text-zinc-400">Vercel AI Gateway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Intelligent per-query routing", true, false, "Automatic classification + routing", "Pick provider per request"],
                ["Model Cascading", true, false, "Cheap → mid → premium escalation", "Not available"],
                ["Semantic caching", true, false, "Meaning-based dedup, all tiers", "Not core offering"],
                ["Quality validation (Shadow)", true, false, "Every economy response validated", "Not available"],
                ["Prompt security / guardrails", true, false, "Built-in shield, all tiers", "Not core offering"],
                ["Multi-provider failover", true, true, "Automatic", "Configurable"],
                ["Unified billing (one invoice)", false, true, "BYOK per provider", "Single Vercel invoice"],
                ["Runs anywhere (any host)", true, false, "Any cloud, any runtime", "Best on Vercel infra"],
                ["OpenAI SDK compatible", true, false, "", "Vercel AI SDK–first"],
                ["Free tier", "5K credits", "Included in Vercel plan", "", ""],
                ["Starter price", "$29/mo", "Usage + Vercel plan", "", ""],
              ].map(([feature, nr, vc, nrNote, vcNote], i) => (
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
                      {typeof vc === 'boolean' ? (vc ? <Y /> : <N />) : <span className="text-white font-bold text-xs">{vc as string}</span>}
                      {vcNote ? <span className="text-[10px] text-zinc-600">{vcNote as string}</span> : null}
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
            { icon: DollarSign, title: "Cost-aware vs cost-neutral", desc: "NeuralRouting is built to minimize cost per correct output — classification, cascading, caching. The Vercel AI Gateway is cost-neutral: it passes your prompt to the model you specified, nothing more." },
            { icon: Cpu, title: "Provider-agnostic vs bundled", desc: "NeuralRouting runs anywhere. The Vercel AI Gateway's sweet spot is Vercel-hosted apps using the AI SDK — great DX there, more friction elsewhere." },
            { icon: Layers, title: "Unified billing vs BYOK", desc: "Vercel's pitch is one invoice for everything. NeuralRouting keeps you on BYOK per provider so you retain your credits, discounts, and negotiated rates." },
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
              <li>Your primary goal is <strong className="text-white">reducing LLM spend</strong> automatically</li>
              <li>You run <strong className="text-white">outside Vercel</strong> or on multiple clouds</li>
              <li>You want <strong className="text-white">OpenAI SDK compatibility</strong> without SDK lock-in</li>
              <li>You need <strong className="text-white">semantic caching + quality validation</strong> built in</li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4">
            <h3 className="text-sm font-black uppercase text-zinc-400">Choose Vercel AI Gateway if:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>You&apos;re already <strong className="text-white">deep in the Vercel AI SDK</strong> and Vercel hosting</li>
              <li>You value <strong className="text-white">unified billing</strong> across providers</li>
              <li>You don&apos;t need per-prompt <strong className="text-white">cost routing</strong>, just unified auth</li>
              <li>Simplicity beats optimization for your current stage</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          Honest take: if you&apos;re shipping a weekend Vercel app, their gateway is the fastest path. If you&apos;re running production traffic and your bill is meaningful, cost routing isn&apos;t optional.
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
