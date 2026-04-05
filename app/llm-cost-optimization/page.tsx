import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Zap, TrendingDown, Shield, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "LLM Cost Optimization — Cut AI Inference Costs by 97%",
  description: "LLM cost optimization through intelligent model routing. Automatically select the cheapest LLM for every task. Works with GPT-4, Claude, Llama, and Mistral. Save 70-97% on inference costs.",
  keywords: ["llm cost optimization", "llm routing", "reduce llm costs", "ai inference cost", "model routing", "gpt-4 cost optimization", "llm api cost"],
  openGraph: {
    title: "LLM Cost Optimization — Cut AI Inference Costs by 97%",
    description: "Intelligent LLM routing that selects the cheapest model for every task automatically.",
    url: "https://neuralrouting.io/llm-cost-optimization",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "LLM Cost Optimization: How to Cut AI Inference Costs by 97%",
  description: "A technical guide to LLM cost optimization using intelligent model routing.",
  author: { "@type": "Organization", name: "NeuralRouting.io" },
};

const STRATEGIES = [
  {
    icon: <TrendingDown size={20} className="text-blue-400" />,
    title: "Model Tiering",
    desc: "Route by complexity. Simple tasks go to $0.06/M token models. Complex reasoning goes to $5/M token models. 80% of tasks qualify for economy tier.",
  },
  {
    icon: <Database size={20} className="text-yellow-400" />,
    title: "Semantic Cache",
    desc: "Vector-embed every response. Similar future requests return cached answers instantly — zero inference cost. Typical hit rate: 25-40% after 7 days.",
  },
  {
    icon: <Shield size={20} className="text-violet-400" />,
    title: "Smart Fallback",
    desc: "When premium models are slow or unavailable, automatically fall back to equivalent alternatives. 99.9% uptime without paying for redundancy.",
  },
];

export default function LLMCostOptimizationPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="text-base font-black italic uppercase tracking-tighter">Neuralrouting.io</span>
        </Link>
        <Link href="/sign-up" className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all">
          Start Free
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-6 inline-block px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">LLM Engineering</p>
        </div>

        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">
          LLM Cost Optimization:<br /><span className="text-blue-500">The Complete Guide</span>
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-16 max-w-2xl">
          AI inference costs are the fastest-growing line item for SaaS companies in 2025.
          This guide covers every technique to reduce LLM costs without sacrificing output quality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {STRATEGIES.map((s) => (
            <div key={s.title} className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all">
              <div className="p-2.5 bg-white/5 rounded-xl w-fit mb-4">{s.icon}</div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">{s.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <article className="prose prose-invert prose-zinc max-w-none mb-16
          prose-h2:font-black prose-h2:italic prose-h2:uppercase prose-h2:tracking-tighter prose-h2:text-white
          prose-h3:font-black prose-h3:text-white
          prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-white
          prose-li:text-zinc-400 prose-code:text-blue-400 prose-code:bg-blue-500/10 prose-code:rounded prose-code:px-1
          prose-table:text-zinc-400 prose-th:text-white prose-th:font-black">

          <h2>The LLM Cost Problem</h2>
          <p>
            Frontier models like GPT-4o, Claude 3.5 Sonnet, and Gemini Ultra are extraordinarily capable —
            and extraordinarily expensive when used for every single inference. Yet most production systems
            default to a single model for all tasks. This is the root cause of inflated AI bills.
          </p>

          <h2>Strategy 1: Classify Before You Route</h2>
          <p>
            The first step is understanding what your prompts actually need. Most workloads break down as:
          </p>
          <ul>
            <li><strong>Simple tasks (60-70%):</strong> summarization, classification, extraction, short Q&A — Llama 3.1 8B handles these perfectly at $0.06/M tokens</li>
            <li><strong>Medium tasks (20-25%):</strong> multi-step reasoning, code generation, analysis — GPT-4o Mini at $0.15/M tokens</li>
            <li><strong>Complex tasks (5-15%):</strong> legal/medical analysis, complex coding, nuanced generation — GPT-4o at $5/M tokens</li>
          </ul>
          <p>
            Routing intelligently across these tiers yields 70-90% cost reduction on typical workloads.
          </p>

          <h2>Strategy 2: Semantic Caching</h2>
          <p>
            Many LLM applications process similar or identical prompts repeatedly. Customer support bots,
            search assistants, and FAQ systems all see high query repetition. Semantic caching stores embeddings
            of previous prompts and returns cached responses when similarity exceeds a threshold (typically cosine similarity {'>'} 0.92).
          </p>
          <p>
            The economics are compelling: a cached response costs ~$0.0001 to serve vs $0.002–0.05 for a live inference call.
          </p>

          <h2>Strategy 3: Request Batching & Prompt Compression</h2>
          <p>
            For non-latency-sensitive workloads, batch multiple small requests into a single API call.
            Combine this with prompt compression techniques — removing redundant instructions and verbose context —
            to reduce token count by 20-40% before the request even hits the model.
          </p>

          <h2>How NeuralRouting Implements All Three</h2>
          <p>
            NeuralRouting is a drop-in proxy that sits between your application and any LLM provider.
            On every request it runs a 5ms classification pass, checks the semantic cache, and routes to
            the optimal model. All in a single API call that's fully compatible with the OpenAI SDK.
          </p>
        </article>

        <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-sm mb-16">
          <p className="text-zinc-500 mb-2 text-xs"># Python — works with any OpenAI-compatible client</p>
          <pre className="text-blue-400 overflow-x-auto">{`from openai import OpenAI

client = OpenAI(
    base_url="https://neuralrouting.io/v1",
    api_key="nr_live_your_key_here",
)

# Every request is now automatically optimized
response = client.chat.completions.create(
    model="auto",  # NeuralRouting picks the best model
    messages=[{"role": "user", "content": "..."}]
)`}</pre>
        </div>

        <div className="space-y-3 mb-16">
          {[
            "Compatible with OpenAI, Anthropic, Llama, Mistral",
            "Semantic cache with pgvector — hits return in <10ms",
            "Prompt injection shield included at no extra cost",
            "FinOps dashboard: see exactly where every dollar goes",
            "Free tier: 5,000 credits, no credit card",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span className="text-zinc-400 text-sm">{f}</span>
            </div>
          ))}
        </div>

        <div className="p-10 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-3">
            Optimize Your LLM Costs Now
          </h2>
          <p className="text-zinc-500 text-sm mb-8">Free to start · Setup in 30 seconds · No credit card</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
          >
            Get Free API Key <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-900 text-center">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">
          © 2026 NeuralRouting.io · <Link href="/" className="hover:text-zinc-500">Home</Link> · <Link href="/pricing" className="hover:text-zinc-500">Pricing</Link> · <Link href="/docs" className="hover:text-zinc-500">Docs</Link> · <Link href="/blog" className="hover:text-zinc-500">Blog</Link>
        </p>
      </footer>
    </div>
  );
}
