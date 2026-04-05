import type { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import { Terminal, Zap, ArrowRight, CheckCircle2, Shield, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: "Docs — API Reference & Integration Guide",
  description: "Integrate NeuralRouting in under 2 minutes. OpenAI SDK compatible. Full reference for routing modes, semantic cache, security shield, and user attribution.",
  openGraph: {
    title: "NeuralRouting Docs — API Reference",
    description: "OpenAI SDK compatible. Integrate in 2 minutes. Full API reference.",
    url: "https://neuralrouting.io/docs",
  },
};

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

      {/* 5b. Streaming */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="text-blue-400" size={24} /> Streaming Responses
        </h2>
        <p className="mb-6 text-slate-400">
          Use <code className="text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded text-sm">/v1/dispatch/stream</code> to receive tokens as they are generated — ideal for chat UIs and real-time applications. Returns standard SSE (Server-Sent Events) in OpenAI-compatible format.
        </p>

        <div className="bg-[#0f1117] p-6 rounded-t-2xl border-x border-t border-slate-800 font-mono text-sm shadow-2xl">
          <p className="text-slate-500 text-xs mb-3 uppercase tracking-widest font-bold">JavaScript / TypeScript</p>
          <pre className="text-emerald-500 whitespace-pre-wrap overflow-x-auto">
{`const res = await fetch("https://web-production-4f439.up.railway.app/v1/dispatch/stream", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "nr_live_your_api_key",
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Explain streaming in one paragraph." }],
    session_id: "my-session-01",
  }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  for (const line of decoder.decode(value).split("\\n")) {
    if (!line.startsWith("data: ")) continue;
    const raw = line.slice(6).trim();
    if (raw === "[DONE]") break;

    const chunk = JSON.parse(raw);

    // Standard token chunks
    if (chunk.object === "chat.completion.chunk") {
      const token = chunk.choices?.[0]?.delta?.content;
      if (token) process.stdout.write(token);
    }

    // NeuralRouting billing event (last event before [DONE])
    if (chunk.object === "nr.billing") {
      console.log("Model:", chunk.model_used);
      console.log("Cost: $" + chunk.financials.billed_price.toFixed(6));
    }
  }
}`}
          </pre>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-b-2xl border border-slate-800 shadow-inner">
          <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">SSE Event Types</p>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex gap-4">
              <span className="text-blue-400 w-48 shrink-0">chat.completion.chunk</span>
              <span className="text-slate-400">Token delta — same format as OpenAI streaming</span>
            </div>
            <div className="flex gap-4">
              <span className="text-emerald-400 w-48 shrink-0">nr.billing</span>
              <span className="text-slate-400">Final event with model, cost, savings, and token usage</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-500 w-48 shrink-0">[DONE]</span>
              <span className="text-slate-400">Stream complete</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5c. Agent Integration */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="text-purple-400" size={24} /> AI Agent Integration
        </h2>
        <p className="mb-2 text-slate-400">
          NeuralRouting exposes a fully OpenAI-compatible <code className="text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded text-sm">/v1/chat/completions</code> endpoint — including tool/function calling. Point any agent framework at NeuralRouting and every step in your loop gets routed to the cheapest model that can handle it.
        </p>
        <p className="mb-6 text-slate-500 text-sm">
          Complex reasoning steps → GPT-4o. Simple decisions and summaries → Llama (budget). Automatically, per request.
        </p>

        <div className="bg-[#0f1117] p-6 rounded-t-2xl border-x border-t border-slate-800 font-mono text-sm shadow-2xl">
          <p className="text-slate-500 text-xs mb-3 uppercase tracking-widest font-bold">LangChain / Python</p>
          <pre className="text-emerald-500 whitespace-pre-wrap overflow-x-auto">
{`from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.prompts import ChatPromptTemplate

# Just change the base_url — everything else stays the same
llm = ChatOpenAI(
    base_url="https://web-production-4f439.up.railway.app/v1",
    api_key="nr_live_your_api_key",
    model="neural-optimizer",
)

# Your tools, prompts, and agent logic — unchanged
agent = create_openai_tools_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)
result = executor.invoke({"input": "Research and summarize AI pricing trends"})`}
          </pre>
        </div>

        <div className="bg-[#0f1117] p-6 border-x border-t border-slate-800 font-mono text-sm">
          <p className="text-slate-500 text-xs mb-3 uppercase tracking-widest font-bold">OpenAI SDK (any framework)</p>
          <pre className="text-emerald-500 whitespace-pre-wrap overflow-x-auto">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://web-production-4f439.up.railway.app/v1",
    api_key="nr_live_your_api_key",
)

# Full tool/function calling support
response = client.chat.completions.create(
    model="neural-optimizer",
    messages=[{"role": "user", "content": "What is 15% of 2400?"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Evaluate a math expression",
            "parameters": {
                "type": "object",
                "properties": {"expression": {"type": "string"}},
                "required": ["expression"]
            }
        }
    }],
    tool_choice="auto",
)`}
          </pre>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-b-2xl border border-slate-800 shadow-inner">
          <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Why this matters for agents</p>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-white font-bold mb-1">Agent loops are expensive</p>
              <p className="text-slate-500">A typical research agent makes 10–30 LLM calls per task. Sending all of them to GPT-4o is wasteful.</p>
            </div>
            <div>
              <p className="text-white font-bold mb-1">Not every step needs GPT-4o</p>
              <p className="text-slate-500">Tool selection, intermediate summaries, and simple decisions route to budget models automatically.</p>
            </div>
            <div>
              <p className="text-white font-bold mb-1">10x cost reduction</p>
              <p className="text-slate-500">An agent that costs $0.50/task with GPT-4o can drop to $0.05 with intelligent per-step routing.</p>
            </div>
          </div>
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

      {/* 7b. Semantic Cache */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Database className="text-yellow-400" size={24} /> Semantic Cache
        </h2>
        <p className="mb-4 text-slate-400">
          Every prompt that passes through NeuralRouting is embedded and stored. Future requests that are semantically similar (not just identical) hit the cache and are returned instantly — no model call, no credit deduction.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
          {[
            { label: "Level 1 — Exact match", desc: "SHA-256 hash lookup. Zero cost, < 1ms.", color: "text-emerald-400" },
            { label: "Level 2 — Semantic match", desc: "Cosine similarity via pgvector. Threshold: 0.92.", color: "text-blue-400" },
            { label: "Cache miss", desc: "Routes normally, stores result async. No latency added.", color: "text-slate-400" },
          ].map((item) => (
            <div key={item.label} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className={`font-bold text-xs mb-1 ${item.color}`}>{item.label}</p>
              <p className="text-slate-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-sm mb-4">When a cache hit occurs, the response includes two extra fields:</p>
        <div className="bg-[#0f1117] p-5 rounded-2xl border border-slate-800 font-mono text-sm">
          <pre className="text-blue-400 whitespace-pre-wrap">
{`{
  "status": "success",
  "model_used": "claude-3.5-sonnet",
  "output": { "ai_answer": "..." },
  "cache_hit": true,           // ← served from semantic cache
  "cache_exact": false,        // ← exact hash (true) or semantic match (false)
  "cache_similarity": 0.9541,  // ← cosine similarity score
  "business_metrics": { ... }
}`}
          </pre>
        </div>
        <p className="text-slate-600 text-xs mt-3">
          Configure via env: <code className="text-slate-400">SEMANTIC_CACHE_ENABLED</code>, <code className="text-slate-400">CACHE_SIMILARITY_THRESHOLD</code> (default: 0.92), <code className="text-slate-400">CACHE_TTL_DAYS</code> (default: 7).
        </p>
      </section>

      {/* 7c. Security Shield */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="text-violet-400" size={24} /> Prompt Injection Shield
        </h2>
        <p className="mb-4 text-slate-400">
          Every request is scanned by a real-time heuristic engine before any model call or credit deduction. It detects and blocks prompt injection attempts, jailbreaks, DAN patterns, and system-prompt extraction — in under 1ms with no LLM calls.
        </p>
        <div className="space-y-3 mb-6">
          {[
            { tier: "CRITICAL (blocked)", examples: "DAN jailbreaks, ignore-all-instructions, token smuggling, bypass-safety patterns", color: "text-red-400 border-red-500/20 bg-red-500/5" },
            { tier: "HIGH (blocked)", examples: "System-tag injection ([INST], <system>, [[SYSTEM]]), role override, prompt extraction requests", color: "text-orange-400 border-orange-500/20 bg-orange-500/5" },
            { tier: "MEDIUM (flagged)", examples: "Compound ignore-above constructs, base64 encoded payloads", color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5" },
          ].map((item) => (
            <div key={item.tier} className={`p-4 border rounded-xl text-sm ${item.color}`}>
              <p className="font-bold text-xs mb-1">{item.tier}</p>
              <p className="text-slate-400">{item.examples}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-sm mb-4">Blocked requests return HTTP <code className="text-slate-300">403</code>:</p>
        <div className="bg-[#0f1117] p-5 rounded-2xl border border-slate-800 font-mono text-sm">
          <pre className="text-red-400 whitespace-pre-wrap">
{`HTTP 403 Forbidden

{
  "error": "Request blocked by NeuralRouting Security Shield",
  "category": "CRITICAL",
  "risk_score": 0.95
}`}
          </pre>
        </div>
        <p className="text-slate-600 text-xs mt-3">
          All blocked requests are logged in your security audit trail, accessible from the dashboard. Configure threshold via <code className="text-slate-400">SHIELD_BLOCK_THRESHOLD</code> (default: 0.85).
        </p>
      </section>

      {/* 7d. User Attribution */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="text-blue-400" size={24} /> User Attribution
        </h2>
        <p className="mb-4 text-slate-400">
          Pass a <code className="text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded text-sm">user</code> field in your request body to tag requests by end-user. This unlocks per-user cost breakdowns, savings attribution, and budget enforcement in the dashboard.
        </p>
        <div className="bg-[#0f1117] p-5 rounded-2xl border border-slate-800 font-mono text-sm">
          <pre className="text-emerald-500 whitespace-pre-wrap">
{`{
  "messages": [{ "role": "user", "content": "..." }],
  "user": "end-user-id-or-email",   // ← attribution tag
  "session_id": "optional-session"
}`}
          </pre>
        </div>
        <p className="text-slate-500 text-sm mt-4">
          View per-user spend, request counts, and savings at <Link href="/attribution" className="text-blue-400 hover:text-blue-300 transition-colors">neuralrouting.io/attribution</Link>.
        </p>
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
