"use client";
import React, { useState } from 'react';
import { ArrowRight, Zap, Cpu, Loader2, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

// --- Local classifier (mirrors router_logic.py _classify_local) ---
function classifyPrompt(prompt: string): { task: string; complexity: number; risk: string; model: string; tier: string; costPer1M: number } {
  const p = prompt.toLowerCase();
  const tokens = prompt.split(/\s+/).length;

  const CODING = /\b(def |function |class |import |export |const |var |let |#include|<\?php|write (a |the )?(function|class|script|code|program|api|endpoint)|debug|refactor|implement|fix (this|the|my)|unit test|sql query|dockerfile|terraform|bash script)\b|```/;
  const MATH = /\b(calculate|compute|solve|equation|integral|derivative|matrix|eigenvalue|probability|statistic|proof|theorem|algebra|calculus|geometry|factorial)\b/;
  const ANALYSIS = /\b(analyze|analyse|compare|contrast|evaluate|assess|critique|implications|trade.?off|pros and cons|difference between|explain why|how does .{0,30} work|what (causes|makes|drives|affects)|deep dive|breakdown|examine)\b/;
  const CREATIVE = /\b(write (a |an )?(story|poem|essay|blog|article|email|letter|speech|script)|creative|fiction|narrative|character|plot|brainstorm|generate ideas)\b/;
  const SUMMARY = /\b(summarize|summarise|tldr|tl;dr|brief|overview|key points|main points)\b/;
  const TRANSLATE = /\b(translate|translation|en español|in french|auf deutsch|en français|em português)\b/;
  const CASUAL = /^(hi|hello|hey|hola|what is|who is|what are|when did|where is|capital of|how are you)/;

  let task: string, baseComplexity: number;

  if (CODING.test(p)) { task = "coding"; baseComplexity = 7; }
  else if (MATH.test(p)) { task = "math"; baseComplexity = 8; }
  else if (ANALYSIS.test(p)) { task = "analysis"; baseComplexity = 6; }
  else if (CREATIVE.test(p)) { task = "creative"; baseComplexity = 5; }
  else if (SUMMARY.test(p)) { task = "summary"; baseComplexity = 4; }
  else if (TRANSLATE.test(p)) { task = "translation"; baseComplexity = 3; }
  else if (CASUAL.test(p)) { task = "casual"; baseComplexity = 2; }
  else { task = "question"; baseComplexity = 4; }

  let complexity = baseComplexity;
  if (tokens > 100) complexity = Math.min(10, complexity + 2);
  else if (tokens > 40) complexity = Math.min(10, complexity + 1);
  else if (tokens < 8) complexity = Math.max(1, complexity - 2);

  if (/\b(step by step|multiple|several|list (all|every)|comprehensive|detailed|in depth)\b/.test(p)) {
    complexity = Math.min(10, complexity + 1);
  }

  const HIGH_RISK = /\b(medical diagnosis|legal advice|prescribe|invest (my|all)|confidential|password|credit card|social security|ssn)\b/;
  let risk = HIGH_RISK.test(p) ? "high" : "low";
  if (complexity >= 8) risk = "high";

  const needsPremium = complexity > 6 || risk === "high";
  const model = needsPremium ? "GPT-4o" : "Llama 3.1 8B";
  const tier = needsPremium ? "PREMIUM" : "ECONOMY";
  const costPer1M = needsPremium ? 12.50 : 0.20;

  return { task, complexity, risk, model, tier, costPer1M };
}

const TASK_COLORS: Record<string, string> = {
  coding: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  math: "text-red-400 bg-red-500/10 border-red-500/20",
  analysis: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  creative: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  summary: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  translation: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  casual: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  question: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

const EXAMPLE_PROMPTS = [
  "What is the capital of France?",
  "Write a Python function that sorts a list of dictionaries by a given key",
  "Summarize this article in 3 bullet points",
  "Translate this paragraph to Spanish",
  "Analyze the trade-offs between microservices and monolithic architecture for a startup with 5 engineers",
  "Calculate the compound interest on $10,000 at 5% annual rate over 10 years",
  "Write a creative short story about a robot learning to paint",
  "Hey, how are you?",
  "Debug this React component — it renders twice on mount",
  "Explain step by step how transformer attention mechanisms work",
];

interface AnalyzedPrompt {
  text: string;
  task: string;
  complexity: number;
  risk: string;
  model: string;
  tier: string;
  costPer1M: number;
}

export default function PromptAnalyzer() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AnalyzedPrompt[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = () => {
    const prompts = input.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (prompts.length === 0) return;

    setAnalyzing(true);
    // Simulate brief analysis time for UX
    setTimeout(() => {
      const analyzed = prompts.map(text => ({
        text,
        ...classifyPrompt(text),
      }));
      setResults(analyzed);
      setAnalyzing(false);
    }, 800);
  };

  const loadExamples = () => {
    setInput(EXAMPLE_PROMPTS.join("\n"));
    setResults([]);
  };

  const clear = () => {
    setInput("");
    setResults([]);
  };

  const economyCount = results.filter(r => r.tier === "ECONOMY").length;
  const premiumCount = results.filter(r => r.tier === "PREMIUM").length;
  const totalCount = results.length;
  const economyPct = totalCount > 0 ? Math.round((economyCount / totalCount) * 100) : 0;

  // Cost comparison assuming 500 tokens avg per prompt, 10K requests/month
  const avgCostAllPremium = 12.50; // $/1M tokens
  const avgCostRouted = totalCount > 0
    ? results.reduce((sum, r) => sum + r.costPer1M, 0) / totalCount
    : 0;
  const savingsPct = avgCostAllPremium > 0 && avgCostRouted > 0
    ? Math.round(((avgCostAllPremium - avgCostRouted) / avgCostAllPremium) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto rounded-[3rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 p-8 md:p-12 space-y-8">

        {/* Header */}
        <div>
          <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Prompt Complexity Analyzer</p>
          <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white leading-tight">
            Paste your prompts. See which ones <span className="text-purple-400">actually need GPT-4o.</span>
          </h3>
          <p className="text-[11px] text-zinc-500 mt-2 max-w-2xl">
            Our LLM router classifier analyzes each prompt for task type, complexity, and risk — then tells you the cheapest model that can handle it. Same classifier used in production. Zero API cost.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              Paste prompts (one per line)
            </label>
            <div className="flex gap-2">
              <button
                onClick={loadExamples}
                className="text-[8px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <Plus size={10} /> Load examples
              </button>
              {input && (
                <button
                  onClick={clear}
                  className="text-[8px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={10} /> Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setResults([]); }}
            placeholder={"What is machine learning?\nWrite a Python function to merge two sorted lists\nSummarize this research paper in 3 points\nAnalyze the pros and cons of serverless architecture"}
            rows={6}
            className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-white placeholder:text-zinc-800 focus:border-purple-500/50 outline-none resize-none font-mono"
          />
          <button
            onClick={analyze}
            disabled={analyzing || !input.trim()}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 rounded-2xl font-black text-sm text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <><Loader2 size={16} className="animate-spin" /> Analyzing prompts...</>
            ) : (
              <><Cpu size={16} /> Analyze {input.split("\n").filter(l => l.trim()).length} prompts</>
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-500">

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                <p className="text-3xl font-black text-emerald-400">{economyCount}</p>
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Economy (Llama 3)</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
                <p className="text-3xl font-black text-purple-400">{premiumCount}</p>
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Premium (GPT-4o)</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                <p className="text-3xl font-black text-blue-400">{economyPct}%</p>
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Routable to cheap</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/20 text-center">
                <p className="text-3xl font-black text-white">{savingsPct}%</p>
                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1">Estimated savings</p>
              </div>
            </div>

            {/* Results table */}
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-zinc-900 text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span className="col-span-5">Prompt</span>
                <span className="col-span-2">Task</span>
                <span>Score</span>
                <span className="col-span-2">Model</span>
                <span className="col-span-2">Cost/1M tokens</span>
              </div>
              {results.map((r, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-white/5 hover:bg-white/[0.02] items-center">
                  <p className="col-span-5 text-[11px] text-zinc-400 truncate" title={r.text}>{r.text}</p>
                  <span className="col-span-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${TASK_COLORS[r.task] || "text-zinc-400 bg-zinc-800 border-zinc-700"}`}>
                      {r.task}
                    </span>
                  </span>
                  <span className={`text-[11px] font-black ${r.complexity > 6 ? "text-red-400" : r.complexity > 4 ? "text-yellow-400" : "text-emerald-400"}`}>
                    {r.complexity}/10
                  </span>
                  <span className={`col-span-2 text-[11px] font-bold ${r.tier === "PREMIUM" ? "text-purple-400" : "text-emerald-400"}`}>
                    {r.model}
                  </span>
                  <span className={`col-span-2 text-[11px] font-bold ${r.tier === "PREMIUM" ? "text-red-400" : "text-emerald-400"}`}>
                    ${r.costPer1M.toFixed(2)}
                    {r.tier === "ECONOMY" && <span className="text-[8px] text-emerald-600 ml-1">(-98%)</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* Savings bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                <span className="text-zinc-600">Routing Distribution</span>
                <span className="text-emerald-400">{economyPct}% to economy models</span>
              </div>
              <div className="h-3 w-full bg-purple-500/20 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-1000"
                  style={{ width: `${economyPct}%` }}
                />
                <div className="bg-purple-500 h-full rounded-r-full transition-all duration-1000 flex-1" />
              </div>
              <div className="flex justify-between text-[8px] font-bold">
                <span className="text-emerald-400">Llama 3 — $0.20/1M tokens</span>
                <span className="text-purple-400">GPT-4o — $12.50/1M tokens</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-purple-600/5 border border-purple-500/20">
              <div>
                <p className="text-sm font-black text-white uppercase italic tracking-tight">
                  Want this to happen automatically on every request?
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  NeuralRouting applies this exact classification in production — plus quality validation and semantic caching.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap shadow-xl"
              >
                Start Free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
