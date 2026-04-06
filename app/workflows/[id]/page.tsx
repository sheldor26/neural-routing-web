"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Zap, Play, Loader2, ArrowLeft, CheckCircle2, AlertCircle,
  Clock, DollarSign, Layers, ChevronDown, ChevronUp, Cpu, Copy,
} from "lucide-react";
import { useUser, UserButton, useAuth } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface WorkflowStep {
  name: string;
  prompt_template: string;
  routing_mode: string;
  output_key: string;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string | null;
  steps: WorkflowStep[];
}

interface StepResult {
  name: string;
  output_key: string;
  model_used: string;
  routing_mode: string;
  output: string;
  cost_usd: number;
  savings_usd: number;
  credits_used: number;
  latency_ms: number;
}

interface RunResult {
  run_id: string;
  status: string;
  output: Record<string, string>;
  steps: StepResult[];
  summary: {
    total_cost_usd: number;
    total_credits_used: number;
    total_savings_usd: number;
    steps_count: number;
  };
}

interface RunHistoryEntry {
  id: string;
  status: string;
  total_cost_usd: number;
  total_savings_usd: number;
  total_credits_used: number;
  created_at: string;
  completed_at: string | null;
}

import { API_BASE } from '@/lib/config';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract {{input.varName}} variable names from all step templates */
function extractInputVars(steps: WorkflowStep[]): string[] {
  const vars = new Set<string>();
  for (const step of steps) {
    const matches = step.prompt_template.matchAll(/\{\{input\.(\w+)\}\}/g);
    for (const m of matches) vars.add(m[1]);
  }
  return [...vars];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
  const [history, setHistory] = useState<RunHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Run state
  const [inputVars, setInputVars] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const [notification, setNotification] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      try {
        const token = await getToken({ template: "supabase" });
        const sb = createAuthClient(token!);
        const { data: keyData } = await sb
          .from("api_keys")
          .select("key")
          .eq("user_id", user.id)
          .maybeSingle();
        const key = keyData?.key ?? null;
        setApiKey(key);
        if (!key) return;

        const [wfRes, histRes] = await Promise.all([
          fetch(`${API_BASE}/v1/workflows/${id}`, { headers: { "X-API-KEY": key } }),
          fetch(`${API_BASE}/v1/workflows/${id}/runs`, { headers: { "X-API-KEY": key } }),
        ]);

        if (!wfRes.ok) throw new Error("Workflow not found");
        const wf: WorkflowDefinition = await wfRes.json();
        setWorkflow(wf);

        // Pre-populate input keys
        const vars = extractInputVars(wf.steps);
        setInputVars(Object.fromEntries(vars.map((v) => [v, ""])));

        if (histRes.ok) setHistory(await histRes.json());
      } catch (e: any) {
        notify(e.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, user?.id, id]);

  // ---------------------------------------------------------------------------
  // Run
  // ---------------------------------------------------------------------------
  const handleRun = async () => {
    if (!apiKey || !workflow) return;
    const emptyVars = Object.entries(inputVars).filter(([, v]) => !v.trim());
    if (emptyVars.length > 0)
      return notify(`Fill in: ${emptyVars.map(([k]) => k).join(", ")}`, "error");

    setRunning(true);
    setRunResult(null);
    setExpandedStep(null);

    try {
      const res = await fetch(`${API_BASE}/v1/workflows/${id}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
        body: JSON.stringify({ input: inputVars }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Workflow run failed");
      setRunResult(data);
      setExpandedStep(0);
      notify("Workflow completed successfully!", "success");

      // Prepend to history
      setHistory((prev) => [
        {
          id: data.run_id,
          status: data.status,
          total_cost_usd: data.summary.total_cost_usd,
          total_savings_usd: data.summary.total_savings_usd,
          total_credits_used: data.summary.total_credits_used,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (e: any) {
      notify(e.message, "error");
    } finally {
      setRunning(false);
    }
  };

  const notify = (msg: string, type: "error" | "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // ---------------------------------------------------------------------------
  // Loading / Not found
  // ---------------------------------------------------------------------------
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
          Loading Workflow...
        </span>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500 font-black italic uppercase">Workflow not found.</p>
        <Link href="/workflows" className="text-blue-500 text-sm font-bold hover:underline">
          ← Back to Workflows
        </Link>
      </div>
    );
  }

  const inputVarKeys = Object.keys(inputVars);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24 selection:bg-blue-500/30">
      {/* NAV */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Zap size={20} className="text-blue-500 fill-blue-500" />
          <span className="text-xl font-black italic uppercase tracking-tighter text-white">
            Neuralrouting.io
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/workflows"
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all flex items-center gap-2"
          >
            <ArrowLeft size={12} /> Workflows
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* HEADER */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 italic">
            {workflow.steps.length} step{workflow.steps.length !== 1 ? "s" : ""}
          </p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mt-1">
            {workflow.name}
          </h1>
          {workflow.description && (
            <p className="text-sm text-zinc-500 mt-2">{workflow.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT — Pipeline + Run form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Steps overview */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 space-y-3 backdrop-blur-md">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Pipeline
              </p>
              {workflow.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-black text-blue-400">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate">{s.name}</p>
                    <p className="text-[8px] text-zinc-600 uppercase font-bold">{s.routing_mode}</p>
                  </div>
                  {i < workflow.steps.length - 1 && (
                    <div className="absolute left-[2.75rem] mt-6 w-px h-4 bg-zinc-800" />
                  )}
                </div>
              ))}
            </div>

            {/* Input form */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 space-y-5 backdrop-blur-md">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Input Variables
              </p>

              {inputVarKeys.length === 0 ? (
                <p className="text-[10px] text-zinc-600 font-bold italic">
                  No input variables detected. This workflow uses no{" "}
                  <code className="text-blue-500">{"{{input.*}}"}</code> placeholders.
                </p>
              ) : (
                inputVarKeys.map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      {key}
                    </label>
                    <textarea
                      rows={3}
                      value={inputVars[key]}
                      onChange={(e) =>
                        setInputVars((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={`Value for {{input.${key}}}`}
                      className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-4 py-3 text-sm font-mono focus:border-blue-500/50 outline-none resize-none transition-all"
                    />
                  </div>
                ))
              )}

              <button
                onClick={handleRun}
                disabled={running}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {running ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Running...
                  </>
                ) : (
                  <>
                    <Play size={14} /> Run Workflow
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-3 space-y-6">
            {running && (
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 min-h-[200px]">
                <Loader2 size={36} className="animate-spin text-blue-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 italic">
                  Executing pipeline...
                </p>
              </div>
            )}

            {runResult && !running && (
              <>
                {/* Summary bar */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Total Cost",
                      value: `$${runResult.summary.total_cost_usd.toFixed(5)}`,
                      icon: <DollarSign size={14} />,
                      color: "text-white",
                    },
                    {
                      label: "Saved",
                      value: `$${runResult.summary.total_savings_usd.toFixed(5)}`,
                      icon: <CheckCircle2 size={14} />,
                      color: "text-emerald-400",
                    },
                    {
                      label: "Credits",
                      value: runResult.summary.total_credits_used,
                      icon: <Cpu size={14} />,
                      color: "text-blue-400",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 text-center space-y-1"
                    >
                      <div className={`flex items-center justify-center gap-1 ${s.color}`}>
                        {s.icon}
                        <span className="text-sm font-black">{s.value}</span>
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Step results */}
                <div className="space-y-3">
                  {runResult.steps.map((step, i) => (
                    <div
                      key={i}
                      className="bg-zinc-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-blue-500/20 transition-all"
                    >
                      <button
                        onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-[8px] font-black text-blue-400">{i + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{step.name}</p>
                            <p className="text-[8px] text-zinc-600 uppercase font-bold">
                              {step.model_used} · {step.latency_ms}ms · {step.credits_used} cr
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-emerald-400">
                            saved ${step.savings_usd.toFixed(5)}
                          </span>
                          {expandedStep === i ? (
                            <ChevronUp size={14} className="text-zinc-600" />
                          ) : (
                            <ChevronDown size={14} className="text-zinc-600" />
                          )}
                        </div>
                      </button>

                      {expandedStep === i && (
                        <div className="px-6 pb-6 space-y-2 border-t border-white/5 pt-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                              Output — stored as{" "}
                              <code className="text-blue-400">{"{{steps." + step.output_key + "}}"}</code>
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(step.output);
                                setCopiedStep(i);
                                setTimeout(() => setCopiedStep(null), 2000);
                              }}
                              className={`flex items-center gap-1 text-[8px] font-black uppercase px-2 py-1 rounded-lg transition-all ${copiedStep === i ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-zinc-600 hover:text-zinc-400 border border-zinc-800 hover:border-zinc-600"}`}
                            >
                              {copiedStep === i ? <CheckCircle2 size={10} /> : <Copy size={10} />}
                              {copiedStep === i ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 text-sm font-mono text-zinc-300 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
                            {step.output}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {!runResult && !running && (
              <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Layers size={40} className="text-zinc-800" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic text-center">
                  Fill in the inputs and run the workflow to see results here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RUN HISTORY */}
        {history.length > 0 && (
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-[2.5rem] p-8 space-y-5">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-blue-600" />
              <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">
                Run <span className="text-blue-600">History</span>
              </h3>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between bg-black/30 border border-white/5 rounded-2xl px-5 py-3 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        run.status === "completed"
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : run.status === "failed"
                          ? "text-red-400 border-red-500/30 bg-red-500/10"
                          : "text-zinc-400 border-zinc-700 bg-zinc-800/50"
                      }`}
                    >
                      {run.status}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {formatDate(run.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-[8px] text-zinc-600 uppercase font-black">Cost</p>
                      <p className="text-xs font-black text-white">
                        ${run.total_cost_usd.toFixed(5)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] text-zinc-600 uppercase font-black">Saved</p>
                      <p className="text-xs font-black text-emerald-400">
                        ${run.total_savings_usd.toFixed(5)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] text-zinc-600 uppercase font-black">Credits</p>
                      <p className="text-xs font-black text-blue-400">{run.total_credits_used}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-right-10 duration-500">
          <div
            className={`relative p-[1.5px] rounded-2xl bg-gradient-to-br ${
              notification.type === "error"
                ? "from-red-500/80 via-red-500/20 to-transparent shadow-[0_0_30px_-10px_rgba(239,68,68,0.5)]"
                : "from-blue-600/80 via-blue-400/20 to-transparent shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)]"
            }`}
          >
            <div className="bg-[#080808]/90 backdrop-blur-xl rounded-2xl px-8 py-5 flex items-center gap-5 border border-white/5">
              <div
                className={`p-3 rounded-full ${
                  notification.type === "error"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {notification.type === "error" ? (
                  <AlertCircle size={22} className="animate-pulse" />
                ) : (
                  <CheckCircle2 size={22} className="animate-pulse" />
                )}
              </div>
              <span className="text-sm font-bold text-white">{notification.msg}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
