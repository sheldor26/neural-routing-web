// Server Component — pricing page is fully SSR'd for SEO.
// Only the CTA buttons require auth context → extracted into AuthCheckoutButton client island.
import type { Metadata } from 'next';
import { Check, X, Zap, Rocket, Crown, Sparkles } from 'lucide-react';
import { AuthCheckoutButton } from '@/components/AuthCheckoutButton';

export const metadata: Metadata = {
  title: "AI Gateway & LLM Router Pricing — Plans from $0/mo",
  description: "NeuralRouting AI gateway plans from $0/mo. Save up to 80% on OpenAI, Anthropic & Llama API costs. Free tier, no credit card required.",
  openGraph: {
    title: "AI Gateway Pricing That Pays Itself | NeuralRouting.io",
    description: "LLM router plans from $0/mo. Route every AI prompt to the cheapest model automatically.",
    url: "https://neuralrouting.io/pricing",
  },
  alternates: { canonical: "https://neuralrouting.io/pricing" },
};

const tiers = [
  {
    name: "Free", price: "0", period: "forever",
    description: "Test the power of NeuralRouting with zero commitment.",
    credits: "5,000 credits", creditsNote: "one-time", rateLimit: "3 RPM",
    savingLabel: "FREE", highlight: false, slug: "free", cta: "Start Free",
    icon: <Zap className="text-zinc-500" size={18} />,
    features: [
      { label: "5,000 credits (once)", included: true },
      { label: "Auto routing mode", included: true },
      { label: "3 requests / minute", included: true },
      { label: "Basic uptime guard", included: true },
      { label: "Cost & Speed modes", included: false },
      { label: "Smart Fallback", included: false },
    ],
  },
  {
    name: "Starter", price: "29", period: "/ mo",
    description: "Perfect for side projects and independent developers.",
    credits: "50,000 credits", creditsNote: "per month", rateLimit: "60 RPM",
    savingLabel: "SAVE $125 / MO", highlight: false, slug: "starter", cta: "Start Saving",
    icon: <Rocket className="text-zinc-500" size={18} />,
    features: [
      { label: "50,000 credits / month", included: true },
      { label: "Auto & Cost routing", included: true },
      { label: "60 requests / minute", included: true },
      { label: "Standard uptime guard", included: true },
      { label: "7-day savings history", included: true },
      { label: "Smart Fallback", included: false },
    ],
  },
  {
    name: "Growth", price: "89", period: "/ mo",
    description: "Scalable infrastructure for growing AI companies.",
    credits: "200,000 credits", creditsNote: "per month", rateLimit: "250 RPM",
    savingLabel: "SAVE $500 / MO", highlight: true, tag: "MOST POPULAR", slug: "growth", cta: "Get Started",
    icon: <Zap className="text-blue-500" size={18} />,
    features: [
      { label: "200,000 credits / month", included: true },
      { label: "All routing modes", included: true },
      { label: "250 requests / minute", included: true },
      { label: "Smart Fallback (auto-switch)", included: true },
      { label: "30-day logs + user filters", included: true },
      { label: "Advanced insights", included: true },
    ],
  },
  {
    name: "Business", price: "349", period: "/ mo",
    description: "Total control and maximum efficiency for enterprises.",
    credits: "1,000,000 credits", creditsNote: "per month", rateLimit: "1,000+ RPM",
    savingLabel: "MAX ROI", highlight: false, slug: "business", cta: "Get Started",
    icon: <Crown className="text-zinc-500" size={18} />,
    features: [
      { label: "1,000,000 credits / month", included: true },
      { label: "Custom routing rules", included: true },
      { label: "1,000+ requests / minute", included: true },
      { label: "Priority Edge infrastructure", included: true },
      { label: "Predictive insights & alerts", included: true },
      { label: "Dedicated Slack channel", included: true },
    ],
  },
];

const comparisonRows = [
  { label: "Monthly Price",        values: ["$0", "$29", "$89", "$349"] },
  { label: "Included Credits",     values: ["5,000 (once)", "50,000 /mo", "200,000 /mo", "1,000,000 /mo"] },
  { label: "Routing Modes",        values: ["Auto Only", "Auto & Cost", "All Modes", "Custom Rules"] },
  { label: "Rate Limit",           values: ["3 RPM", "60 RPM", "250 RPM", "1,000+ RPM"] },
  { label: "Uptime Guard",         values: ["Basic", "Standard", "Smart Fallback", "Priority Edge"] },
  { label: "Semantic Cache",       values: ["✓", "✓", "✓", "✓"] },
  { label: "Security Shield",      values: ["✓", "✓", "✓", "✓"] },
  { label: "Analytics & Logs",     values: ["—", "7 days", "30 days", "90 days"] },
  { label: "FinOps ROI Dashboard", values: ["—", "—", "✓", "✓"] },
  { label: "User Attribution",     values: ["—", "✓", "✓", "✓"] },
  { label: "Support",              values: ["Community", "Email", "Priority", "Dedicated Slack"] },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "NeuralRouting AI Gateway",
      description: "AI gateway and LLM router that automatically routes every prompt to the cheapest capable model. Save up to 80% on OpenAI, Anthropic and Llama API costs.",
      brand: { "@type": "Brand", name: "NeuralRouting.io" },
      offers: tiers.map(t => ({
        "@type": "Offer",
        name: `${t.name} Plan`,
        price: t.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://neuralrouting.io/pricing",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: t.price,
          priceCurrency: "USD",
          billingIncrement: 1,
          unitCode: "MON",
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is there a free AI gateway plan?", acceptedAnswer: { "@type": "Answer", text: "Yes. The Free Tier includes 5,000 credits with no credit card required." } },
        { "@type": "Question", name: "How does LLM router pricing compare to direct OpenAI API?", acceptedAnswer: { "@type": "Answer", text: "At 100K requests/month, direct GPT-4o costs $150–300. With NeuralRouting's intelligent routing, the same workload typically costs $30–80 — a 60–80% reduction." } },
        { "@type": "Question", name: "Can I upgrade or downgrade my AI gateway plan anytime?", acceptedAnswer: { "@type": "Answer", text: "Yes. Plans are billed monthly with no lock-in. Upgrade, downgrade or cancel anytime." } },
      ],
    },
  ],
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-[#050505] text-white relative overflow-hidden font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-24">
          <div className="mb-6 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full inline-block">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">AI Gateway &amp; LLM Router Pricing</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
            AI Gateway Pricing <br />
            <span className="text-blue-600 font-black italic text-6xl md:text-8xl">That Pays Itself</span>
          </h1>
          <p className="text-zinc-500 font-bold italic text-lg max-w-xl mx-auto tracking-tight opacity-80 uppercase leading-tight">
            LLM router plans from $0/mo. Save up to 80% on OpenAI, Anthropic &amp; Llama costs.
          </p>
        </div>

        {/* TIER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-24">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-[3.5rem] border transition-all duration-700 group flex flex-col ${
                tier.highlight
                  ? "bg-blue-600/5 border-blue-500 ring-1 ring-blue-500/50 shadow-[0_0_120px_-20px_rgba(37,99,235,0.4)] md:scale-110 z-20 pb-12"
                  : "bg-zinc-900/20 border-white/5 hover:border-white/10 pb-10"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] font-black uppercase px-6 py-1.5 rounded-full tracking-[0.2em] italic shadow-2xl flex items-center gap-2 whitespace-nowrap">
                  <Sparkles size={10} /> {(tier as any).tag}
                </div>
              )}

              <div className="mb-6 flex justify-between items-start">
                <div className="p-3 bg-zinc-800/50 rounded-xl border border-white/5 group-hover:bg-blue-600/10 transition-colors">{tier.icon}</div>
                <span className="text-emerald-500 text-sm font-black italic tracking-tighter uppercase">{tier.savingLabel}</span>
              </div>

              <div className="mb-1">
                <h3 className="text-xl font-black italic uppercase text-zinc-400 tracking-tighter">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black italic tracking-tighter text-white">${tier.price}</span>
                  <span className="text-zinc-600 text-[9px] font-black uppercase">{tier.period}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.15em] italic">
                  {tier.credits} <span className="text-zinc-600">{tier.creditsNote}</span>
                </span>
              </div>

              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-tight mb-6 leading-relaxed">{tier.description}</p>

              <div className="space-y-3 mb-10 flex-grow">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight">
                    {f.included
                      ? <Check size={12} className={tier.highlight ? "text-blue-500 shrink-0" : "text-zinc-500 shrink-0"} />
                      : <X size={12} className="text-zinc-800 shrink-0" />}
                    <span className={f.included ? "text-zinc-400" : "text-zinc-700"}>{f.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <AuthCheckoutButton slug={tier.slug} cta={tier.cta} highlight={tier.highlight} />
              </div>
            </div>
          ))}
        </div>

        {/* COMPARISON TABLE */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] overflow-hidden mb-24">
          <div className="p-10 border-b border-white/5">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Full Plan Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest w-1/3">Feature</th>
                  {tiers.map((t, i) => (
                    <th key={i} className={`p-6 text-center text-[10px] font-black uppercase tracking-wider ${t.highlight ? "text-blue-400" : "text-zinc-500"}`}>
                      {t.name}{t.highlight && <span className="ml-1 text-blue-500">★</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                    <td className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className={`p-6 text-center text-[10px] font-bold ${tiers[j].highlight ? "text-blue-300" : "text-zinc-400"}`}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO SECTION */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">AI Gateway Pricing That Scales With You</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                NeuralRouting is an <strong className="text-zinc-300">AI gateway</strong> that sits between your application and any LLM provider — OpenAI, Anthropic, Llama, Mistral. Every request is analyzed, routed to the cheapest capable model, and optionally served from the semantic cache at zero cost.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed mt-3">
                Unlike traditional AI gateway pricing that charges per request or per seat, NeuralRouting charges by credits — and every routing decision saves you money. Most teams recover their plan cost within the first 48 hours of traffic.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">LLM Router Pricing Explained</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Our <strong className="text-zinc-300">LLM router</strong> pricing is based on credits — 1 credit = 1K tokens routed. Economy tier (Llama, Mistral) costs 1 credit/1K. Medium tier (GPT-4o Mini) costs 10 credits/1K. Premium tier (GPT-4o, Claude) costs 100 credits/1K.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed mt-3">
                Because the router automatically sends 60–80% of requests to economy models, your effective cost per 1K tokens is dramatically lower than going direct to OpenAI — even before the semantic cache cuts another 20–40% off your bill.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: "Is there a free AI gateway plan?", a: "Yes. The Free Tier includes 5,000 credits with no credit card required. It supports Auto routing mode and gives you access to all routing tiers." },
              { q: "How does LLM router pricing compare to direct API?", a: "At 100K requests/month, direct GPT-4o costs ~$150–300. With NeuralRouting's LLM router, the same workload typically costs $30–80 — a 60–80% reduction." },
              { q: "Can I upgrade or downgrade anytime?", a: "Yes. Plans are billed monthly with no lock-in. Upgrade when you need more credits or advanced routing modes, downgrade or cancel anytime." },
            ].map((item) => (
              <div key={item.q} className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5">
                <p className="text-[11px] font-black uppercase tracking-tight text-white mb-2">{item.q}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-16 flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale contrast-125">
            {["LangChain", "OpenAI", "Anthropic", "Llama-3"].map(b => (
              <span key={b} className="text-xs font-black italic uppercase tracking-widest">{b}</span>
            ))}
          </div>
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">
            NeuralRouting Engine v2.4 • High Performance Guaranteed • PCI Compliant
          </p>
        </div>
      </div>
    </section>
  );
}
