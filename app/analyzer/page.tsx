import { Metadata } from 'next';
import Link from 'next/link';
import PromptAnalyzer from '@/components/PromptAnalyzer';

export const metadata: Metadata = {
  title: { absolute: "LLM Prompt Analyzer — Which Prompts Need GPT-4o? | NeuralRouting" },
  description: "Paste your prompts and see which ones actually need GPT-4o vs a 60x cheaper model. Free prompt complexity analyzer powered by the same classifier used in NeuralRouting production.",
  keywords: [
    "llm cost optimization", "GPT-4o cost per token", "reduce openai costs",
    "AI API cost calculator", "LLM router", "prompt complexity",
    "intelligent model selection", "model tax", "AI token cost optimization",
  ],
  openGraph: {
    title: "LLM Prompt Analyzer — Which Prompts Need GPT-4o?",
    description: "Paste your prompts and see which ones actually need GPT-4o vs a 60x cheaper model. Free tool by NeuralRouting.",
    url: "https://neuralrouting.io/analyzer",
    siteName: "NeuralRouting",
    type: "website",
    images: [{ url: "https://neuralrouting.io/og/analyzer.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Which of your prompts actually need GPT-4o?",
    description: "Free tool: paste your prompts, see which ones can use a model that costs 60x less.",
  },
};

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-sm font-black italic uppercase tracking-tighter text-white">NeuralRouting<span className="text-blue-500">.</span></Link>
        <div className="flex items-center gap-4">
          <Link href="/model-tax" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Model Tax</Link>
          <Link href="/sign-up" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Get Started Free</Link>
        </div>
      </nav>

      <section className="pt-12 pb-8 px-6 text-center max-w-4xl mx-auto">
        <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em] mb-6">Free Tool</p>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mb-6">
          Which of your prompts <span className="text-purple-400">actually need GPT-4o?</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Paste your real prompts below. Our classifier analyzes each one for task type and complexity — then shows you which can use a model that costs <strong className="text-white">60x less</strong> with no quality loss.
        </p>
      </section>

      <section className="px-6 pb-20">
        <PromptAnalyzer />
        <p className="text-center mt-8 text-sm text-zinc-600">
          Not sure what the Model Tax is? <Link href="/model-tax" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">See how much you&#39;re overpaying →</Link>
        </p>
      </section>

      <section className="py-16 px-6 border-t border-white/5 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { stat: "0ms", label: "Classification time", desc: "Runs locally, no API calls" },
            { stat: "8", label: "Task types detected", desc: "Coding, math, analysis, creative, summary, translation, casual, Q&A" },
            { stat: "60x", label: "Price difference", desc: "GPT-4o: $12.50/1M tokens vs Llama 3: $0.20/1M" },
          ].map(s => (
            <div key={s.label} className="space-y-2">
              <p className="text-3xl font-black text-white italic">{s.stat}</p>
              <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-[11px] text-zinc-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
          NeuralRouting.io — Intelligent LLM routing infrastructure
        </p>
      </footer>
    </div>
  );
}
