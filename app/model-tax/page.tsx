import { Metadata } from 'next';
import Link from 'next/link';
import SavingsCalculator from '@/components/LazySavingsCalculator';
import PromptAnalyzer from '@/components/PromptAnalyzer';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: { absolute: "Model Tax Calculator — How Much Are You Overpaying for AI? | NeuralRouting" },
  description: "Calculate your Model Tax — the hidden cost of sending every LLM request to GPT-4o. 80% of AI tasks can use models that cost 60x less. Free LLM cost calculator by NeuralRouting.",
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
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "NeuralRouting Model Tax Calculator",
        url: "https://neuralrouting.io/model-tax",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description: "Calculate how much you overpay on LLM costs. See your Model Tax and how intelligent routing reduces it by 60-85%.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is the Model Tax?", acceptedAnswer: { "@type": "Answer", text: "The Model Tax is the invisible cost of sending every LLM request to the same expensive model. Most teams overpay 60-85% because they route simple tasks to GPT-4o when a cheaper model would return the same quality response." } },
          { "@type": "Question", name: "How does intelligent LLM routing reduce costs?", acceptedAnswer: { "@type": "Answer", text: "A local classifier scores each request by complexity in under 1ms. Simple tasks route to economy models that are 60x cheaper, while complex reasoning stays on premium models. Quality is validated by a Shadow Engine that checks economy responses against premium models in the background." } },
          { "@type": "Question", name: "How much can I save with NeuralRouting?", acceptedAnswer: { "@type": "Answer", text: "Teams typically save 60-85% on LLM costs. If you spend $1,000/month on OpenAI, intelligent routing brings that to $150-400 without sacrificing response quality." } },
          { "@type": "Question", name: "Do I need to change my code to use NeuralRouting?", acceptedAnswer: { "@type": "Answer", text: "No. NeuralRouting is a drop-in replacement. Change your base_url to neuralrouting.io/v1 and your API key. It works with any OpenAI SDK, LangChain, or custom integration." } },
          { "@type": "Question", name: "What is the Shadow Engine?", acceptedAnswer: { "@type": "Answer", text: "The Shadow Engine validates every economy response by running the same request against a premium model in the background. If quality drops below threshold, the system auto-escalates future similar requests to the premium model." } },
        ],
      }} />

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
          The Model Tax is <span className="text-red-400">eating your AI budget.</span>
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
              Research from UC Berkeley (RouteLLM, ICLR 2025) demonstrated that <strong className="text-white">up to 80% of typical LLM requests</strong> can be handled by smaller, cheaper models with no measurable quality loss. The Model Tax is the cost of ignoring this.
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

      {/* GPT-4o vs Economy Models */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center mb-4">GPT-4o vs Economy Models: The Real Cost Difference</h2>
        <p className="text-sm text-zinc-500 text-center mb-10 max-w-2xl mx-auto">The price gap between premium and economy LLMs is massive. For simple tasks like classification, summarization, and translation, the output quality is functionally identical.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-[9px] font-black uppercase tracking-widest text-zinc-500 border-b border-white/10">
                <th className="text-left p-3">Model</th>
                <th className="p-3 text-center">Input $/1M tokens</th>
                <th className="p-3 text-center">Output $/1M tokens</th>
                <th className="p-3 text-center">Tier</th>
                <th className="p-3 text-center">vs GPT-4o</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { model: "GPT-4o", input: "$2.50", output: "$10.00", tier: "Premium", vs: "Baseline", color: "text-purple-400" },
                { model: "GPT-4o Mini", input: "$0.15", output: "$0.60", tier: "Medium", vs: "17x cheaper", color: "text-blue-400" },
                { model: "Claude 3.5 Sonnet", input: "$3.00", output: "$15.00", tier: "Premium", vs: "~1x", color: "text-purple-400" },
                { model: "Claude 3.5 Haiku", input: "$0.25", output: "$1.25", tier: "Medium", vs: "10x cheaper", color: "text-blue-400" },
                { model: "Llama 3.1 70B", input: "$0.59", output: "$0.79", tier: "Economy+", vs: "13x cheaper", color: "text-emerald-400" },
                { model: "Llama 3.1 8B", input: "$0.05", output: "$0.05", tier: "Economy", vs: "60x cheaper", color: "text-emerald-400" },
                { model: "Mistral Small", input: "$0.10", output: "$0.30", tier: "Economy", vs: "33x cheaper", color: "text-emerald-400" },
                { model: "Gemini Flash", input: "$0.075", output: "$0.30", tier: "Economy", vs: "33x cheaper", color: "text-emerald-400" },
              ].map(m => (
                <tr key={m.model} className="hover:bg-white/[0.02]">
                  <td className={`p-3 font-bold ${m.color}`}>{m.model}</td>
                  <td className="p-3 text-center text-zinc-400">{m.input}</td>
                  <td className="p-3 text-center text-zinc-400">{m.output}</td>
                  <td className="p-3 text-center"><span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${m.tier === "Premium" ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : m.tier === "Medium" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>{m.tier}</span></td>
                  <td className={`p-3 text-center font-bold ${m.vs === "Baseline" ? "text-zinc-600" : "text-emerald-400"}`}>{m.vs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-zinc-600 text-center mt-4">Prices as of April 2026. NeuralRouting automatically routes to the cheapest model that handles each prompt.</p>
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

      {/* How to Calculate */}
      <section className="py-16 px-6 max-w-4xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center mb-8">How to Calculate Your Model Tax</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">Step 1</p>
            <p className="text-sm text-zinc-400">Your current monthly LLM spend (all requests to premium model)</p>
            <p className="text-2xl font-black text-red-400 mt-2">$X/mo</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 flex items-center justify-center">
            <p className="text-3xl font-black text-zinc-600">minus</p>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Step 2</p>
            <p className="text-sm text-zinc-400">What you&apos;d spend with intelligent routing (60-85% less)</p>
            <p className="text-2xl font-black text-emerald-400 mt-2">$Y/mo</p>
          </div>
        </div>
        <p className="text-center mt-6 text-sm text-zinc-500">The difference is your <strong className="text-white">Model Tax</strong> — the money you&apos;re wasting on simple tasks that don&apos;t need GPT-4o. Use the calculator below to see your exact number.</p>
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

      {/* Prompt Analyzer */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Analyze your actual prompts</h2>
            <p className="text-sm text-zinc-500 mt-3 max-w-2xl mx-auto">Paste your real prompts below. Our LLM router classifier will show you exactly which ones need GPT-4o and which can use a model that costs 60x less.</p>
          </div>
          <PromptAnalyzer />
        </div>
      </section>

      {/* Real savings examples */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center mb-4">Real LLM cost optimization examples</h2>
        <p className="text-sm text-zinc-500 text-center mb-2 max-w-2xl mx-auto">These scenarios show how intelligent model routing reduces AI costs across different application types — without sacrificing output quality.</p>
        <p className="text-[10px] text-zinc-600 text-center mb-12">Estimated savings based on typical usage patterns. Actual results depend on your prompt distribution.</p>
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

      {/* FAQ: LLM Cost Optimization */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center mb-12">FAQ: LLM Cost Optimization</h2>
        <div className="space-y-4">
          {[
            { q: "What is the Model Tax?", a: "The Model Tax is the difference between what you pay sending every LLM request to a premium model like GPT-4o and what you'd pay using intelligent routing to send simple tasks to cheaper models. Research from UC Berkeley (RouteLLM, ICLR 2025) shows up to 80% of requests can use economy models with no quality loss." },
            { q: "How much does GPT-4o cost per token?", a: "GPT-4o costs $2.50 per million input tokens and $10.00 per million output tokens. By comparison, Llama 3.1 8B costs $0.05/$0.05 — that's 60x cheaper for input tokens. For most simple tasks, the output quality is identical." },
            { q: "Can smaller models really match GPT-4o quality?", a: "For 60-80% of typical production requests — yes. Tasks like classification, summarization, translation, simple Q&A, and data extraction produce functionally identical results on economy models. NeuralRouting's Shadow Engine validates this continuously in production." },
            { q: "How does model routing work?", a: "An LLM router analyzes each incoming prompt for task type (coding, math, analysis, creative, etc.) and complexity (1-10 scale). Simple tasks route to economy models like Llama 3. Complex reasoning routes to GPT-4o. This happens in under 1ms with zero API cost." },
            { q: "How much can I save with model routing?", a: "Typical savings range from 60-85% depending on your prompt distribution. Applications with many simple, repetitive queries (support bots, data extraction, classification) save the most. Use the calculator above to estimate your specific savings." },
            { q: "What is Model Cascading?", a: "Model Cascading is NeuralRouting's routing strategy: every request starts at the cheapest model tier. If the local classifier detects high complexity or risk, it escalates to a more capable model. If the Shadow Engine detects quality issues, it auto-escalates on future similar requests via the Confidence Matrix." },
            { q: "Is NeuralRouting free to try?", a: "Yes. The free tier includes 5,000 credits with no credit card required. Integration takes 2 lines of code — change your base_url and API key. Paid plans start at $29/month." },
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2">{faq.q}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Stop paying the Model Tax.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
            Eliminate Your Model Tax — Start Free
          </Link>
          <Link href="/analyzer" className="inline-flex items-center gap-2 px-8 py-5 border border-purple-500/20 text-purple-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/10 transition-all">
            Analyze Your Prompts Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
          NeuralRouting.io — Intelligent LLM routing infrastructure
        </p>
      </footer>
    </div>
  );
}
