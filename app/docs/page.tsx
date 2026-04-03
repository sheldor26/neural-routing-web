import React from 'react';
import Link from 'next/link';
import { Terminal, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050505] max-w-4xl mx-auto py-16 px-6 text-slate-300 font-sans selection:bg-blue-500/30">

      {/* 1. Header - The Hook */}
      <section className="mb-20 text-center md:text-left">
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
          Route smarter. <span className="text-blue-500">Spend less.</span> Scale faster.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl">
          Cut your AI costs from your first request with our intelligent multi-provider gateway.
        </p>

        {/* 2. Barra de CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-6 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit">
          <Link href="#quickstart" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">
            Start in 30s <ArrowRight size={16}/>
          </Link>
          <div className="flex gap-6 px-4">
            <Link href="/setup" className="text-slate-400 hover:text-white font-medium transition-colors">Get API Key</Link>
            <Link href="/dashboard" className="text-slate-400 hover:text-white font-medium transition-colors">Dashboard</Link>
          </div>
        </div>
      </section>

      {/* 3. How it works */}
      <section className="mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: "1. Request", desc: "Unified API" },
            { step: "2. Optimize", desc: "Cost/Latency" },
            { step: "3. Route", desc: "Best Provider" },
            { step: "4. Fallback", desc: "100% Uptime" }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl text-center">
              <p className="text-blue-400 font-bold text-sm mb-1">{item.step}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why NeuralRouting */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Zap className="text-yellow-400" size={24} /> Why NeuralRouting?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-950 border border-slate-900 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
            <h3 className="text-red-400 font-bold text-lg mb-3">Legacy Approach</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Single provider, fixed high costs, and a single point of failure. If OpenAI goes down, your business stops.
            </p>
          </div>
          <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <h3 className="text-blue-400 font-bold text-lg mb-3">NeuralRouting</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Multi-cloud resilience with real-time cost optimization. We pick the best model for every single prompt.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-center italic text-slate-300 font-medium text-lg">
            &quot;You don&apos;t pick the model. The best model is picked for you.&quot;
          </p>
          <p className="text-center text-sm text-slate-500 mt-2">
            Zero config. Real-time optimization per request.
          </p>
        </div>
      </section>

      {/* 5. Quickstart */}
      <section id="quickstart" className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Terminal className="text-emerald-400" size={24} /> Drop-in Integration
        </h2>
        <p className="mb-6 text-slate-400">Replace your OpenAI baseURL and start saving. No refactoring needed.</p>

        <div className="bg-[#0f1117] p-6 rounded-t-2xl border-x border-t border-slate-800 font-mono text-sm shadow-2xl">
          <pre className="text-emerald-500 whitespace-pre-wrap">
{`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://web-production-4f439.up.railway.app/v1",
  apiKey: "nr_live_your_api_key"
});

const response = await client.chat.completions.create({
  model: "neural-router-v2",
  messages: [{ role: "user", content: "Analyze this data" }]
});`}
          </pre>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-b-2xl border border-slate-800 shadow-inner">
          <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Example Response</p>
          <pre className="text-sm font-mono text-blue-400 whitespace-pre-wrap">
{`{
  "status": "success",
  "model_used": "claude-3.5-sonnet",
  "output": { "ai_answer": "..." },
  "business_metrics": {
    "cost_usd": 0.0020,
    "estimated_gpt4_cost": 0.0052,
    "savings_percentage": 61.5
  }
}`}
          </pre>
        </div>

        <div className="mt-8 flex items-center gap-8">
          <Link href="/setup" className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors group">
            <Zap size={18} className="text-blue-400 fill-blue-400" />
            Get Production Key
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard" className="text-slate-500 hover:text-white font-medium transition-colors">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* 6. Use Cases */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-10">Scale with confidence</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Reduce Costs", value: "70%", desc: "Instantly offload simple tasks to economical models." },
            { title: "Increase Uptime", value: "99.9%+", desc: "Achieve total resilience without multi-provider complexity." },
            { title: "Deploy Global", value: "0ms", desc: "Zero infrastructure setup. Global availability from day one." }
          ].map((card, i) => (
            <div key={i} className="space-y-3">
              <div className="text-4xl font-black text-white">{card.value}</div>
              <div className="text-blue-400 font-bold uppercase text-xs tracking-widest">{card.title}</div>
              <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Dashboard */}
      <section className="mb-24 p-8 bg-slate-900/20 border border-slate-800 rounded-3xl">
        <h2 className="text-2xl font-bold text-white mb-6">Financial Control Center</h2>
        <ul className="space-y-4">
          {[
            "Pinpoint cost leaks by filtering by endpoint, user, or feature.",
            "Detect expensive requests that don't require high-tier models.",
            "Real-time audit logs for every cent spent and saved."
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-400">
              <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. Final CTA */}
      <section className="mt-32 p-16 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[3rem] text-center shadow-2xl shadow-blue-500/20">
        <h2 className="text-4xl font-black text-white mb-6">Start saving on every AI request.</h2>
        <p className="text-blue-100 mb-10 text-lg max-w-xl mx-auto">
          Join the teams optimizing their AI infrastructure. No credit card required to start.
        </p>
        <Link href="/setup" className="inline-block bg-white text-blue-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl">
          Get Started Now
        </Link>
      </section>
    </div>
  );
}
