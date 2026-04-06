"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Zap, Plus, Trash2, ArrowRight, Loader2, AlertCircle,
  CheckCircle2, Layers, ChevronDown, ChevronUp, X, Play,
  Sparkles, Info, Copy,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase";
import DashboardNav from "@/components/DashboardNav";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface WorkflowStep {
  name: string;
  prompt_template: string;
  routing_mode: "auto" | "cost" | "quality" | "speed";
  output_key: string;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string | null;
  steps: WorkflowStep[];
  created_at: string;
}

const ROUTING_MODES: { value: WorkflowStep["routing_mode"]; label: string; hint: string }[] = [
  { value: "auto",    label: "Auto",    hint: "NeuralRouter picks the best model for this step" },
  { value: "cost",    label: "Cost",    hint: "Always use the cheapest capable model" },
  { value: "quality", label: "Quality", hint: "Use the highest-quality model (GPT-4o)" },
  { value: "speed",   label: "Speed",   hint: "Optimize for lowest latency" },
];

import { API_BASE } from '@/lib/config';

const emptyStep = (): WorkflowStep => ({
  name: "", prompt_template: "", routing_mode: "auto", output_key: "",
});

// ---------------------------------------------------------------------------
// Built-in templates
// ---------------------------------------------------------------------------
const TEMPLATES: { name: string; description: string; emoji: string; steps: WorkflowStep[] }[] = [
  {
    name: "Research & Summarize",
    description: "Research a topic in depth, then produce a concise executive summary.",
    emoji: "🔬",
    steps: [
      {
        name: "Research",
        prompt_template: "You are a research analyst. Provide a thorough analysis of the following topic, covering key facts, recent developments, and important nuances:\n\n{{input.topic}}",
        routing_mode: "quality",
        output_key: "research",
      },
      {
        name: "Summarize",
        prompt_template: "Based on the research below, write a concise 3-paragraph executive summary suitable for a busy decision-maker:\n\n{{steps.research}}",
        routing_mode: "cost",
        output_key: "summary",
      },
    ],
  },
  {
    name: "Support Ticket Triage",
    description: "Classify a support ticket by priority and sentiment, then draft a reply.",
    emoji: "🎫",
    steps: [
      {
        name: "Classify",
        prompt_template: "Analyze the following customer support ticket. Return a JSON object with: priority (low/medium/high/critical), sentiment (positive/neutral/negative/angry), category (billing/technical/account/other), and a one-sentence summary.\n\nTicket:\n{{input.ticket}}",
        routing_mode: "cost",
        output_key: "classification",
      },
      {
        name: "Draft Reply",
        prompt_template: "You are a senior support agent. Using the classification below, write a professional, empathetic reply to the customer. Acknowledge their issue and provide clear next steps.\n\nClassification:\n{{steps.classification}}\n\nOriginal ticket:\n{{input.ticket}}",
        routing_mode: "auto",
        output_key: "reply",
      },
    ],
  },
  {
    name: "SEO Blog Post",
    description: "Generate a keyword-rich outline, then write a full blog post section by section.",
    emoji: "✍️",
    steps: [
      {
        name: "Outline",
        prompt_template: "Create a detailed SEO-optimized blog post outline for the keyword: \"{{input.keyword}}\". Include H2/H3 headings, target word count per section, and LSI keywords to include.",
        routing_mode: "auto",
        output_key: "outline",
      },
      {
        name: "Write Post",
        prompt_template: "Write a complete, engaging blog post following this outline. Use natural language, include the keyword \"{{input.keyword}}\" organically, and end with a clear call to action.\n\nOutline:\n{{steps.outline}}",
        routing_mode: "quality",
        output_key: "post",
      },
    ],
  },
  {
    name: "Code Review Pipeline",
    description: "Review code for bugs and security issues, then suggest refactored version.",
    emoji: "🛡️",
    steps: [
      {
        name: "Review",
        prompt_template: "You are a senior software engineer. Review the following code for bugs, security vulnerabilities, performance issues, and code quality. Be specific about line-level concerns.\n\n```\n{{input.code}}\n```",
        routing_mode: "quality",
        output_key: "review",
      },
      {
        name: "Refactor",
        prompt_template: "Based on the review below, provide a refactored version of the code that addresses all identified issues. Include inline comments explaining key changes.\n\nReview:\n{{steps.review}}\n\nOriginal code:\n```\n{{input.code}}\n```",
        routing_mode: "quality",
        output_key: "refactored",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract {{input.X}} vars from a template string */
function detectInputVars(template: string): string[] {
  return [...new Set([...template.matchAll(/\{\{input\.(\w+)\}\}/g)].map((m) => m[1]))];
}

/** Extract {{steps.X}} refs from a template string */
function detectStepRefs(template: string): string[] {
  return [...new Set([...template.matchAll(/\{\{steps\.(\w+)\}\}/g)].map((m) => m[1]))];
}

/** Collect output_keys available from steps before index i */
function availableKeys(steps: WorkflowStep[], beforeIndex: number): string[] {
  return steps.slice(0, beforeIndex).map((s) => s.output_key).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function WorkflowsPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  // Create form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([emptyStep()]);
  const [creating, setCreating] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------
  const loadApiKey = useCallback(async () => {
    if (!user) return null;
    const token = await getToken({ template: "supabase" });
    const sb = createAuthClient(token!);
    const { data } = await sb.from("api_keys").select("key").eq("user_id", user.id).maybeSingle();
    return data?.key ?? null;
  }, [user, getToken]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      try {
        const key = await loadApiKey();
        setApiKey(key);
        if (key) {
          const res = await fetch(`${API_BASE}/v1/workflows`, { headers: { "X-API-KEY": key } });
          if (res.ok) setWorkflows(await res.json());
        }
      } catch (e: any) {
        notify(e.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, user?.id]);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const notify = (msg: string, type: "error" | "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const resetForm = () => {
    setName(""); setDescription(""); setSteps([emptyStep()]); setShowCreate(false);
  };

  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setName(tpl.name);
    setDescription(tpl.description);
    setSteps(tpl.steps.map((s) => ({ ...s })));
    setShowCreate(true);
    setTimeout(() => document.getElementById("create-panel")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // ---------------------------------------------------------------------------
  // Step management
  // ---------------------------------------------------------------------------
  const updateStep = (i: number, field: keyof WorkflowStep, value: string) =>
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
  const removeStep = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i));
  const duplicateStep = (i: number) =>
    setSteps((prev) => [
      ...prev.slice(0, i + 1),
      { ...prev[i], name: prev[i].name + " (copy)", output_key: prev[i].output_key + "_copy" },
      ...prev.slice(i + 1),
    ]);

  // ---------------------------------------------------------------------------
  // Create / Delete
  // ---------------------------------------------------------------------------
  const handleCreate = async () => {
    if (!apiKey) return;
    if (!name.trim()) return notify("Workflow name is required.", "error");
    if (steps.some((s) => !s.name || !s.prompt_template || !s.output_key))
      return notify("All step fields are required.", "error");

    // Duplicate output_key check
    const keys = steps.map((s) => s.output_key);
    if (new Set(keys).size !== keys.length)
      return notify("Each step must have a unique output key.", "error");

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/v1/workflows`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
        body: JSON.stringify({ name, description: description || null, steps }),
      });
      if (!res.ok) throw new Error("Could not create workflow");
      const created: WorkflowDefinition = await res.json();
      setWorkflows((prev) => [created, ...prev]);
      notify("Workflow created!", "success");
      resetForm();
    } catch (e: any) {
      notify(e.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!apiKey) return;
    try {
      await fetch(`${API_BASE}/v1/workflows/${id}`, { method: "DELETE", headers: { "X-API-KEY": apiKey } });
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
      notify("Workflow deleted.", "success");
    } catch {
      notify("Could not delete workflow.", "error");
    }
  };

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Loading Workflows...</span>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24 selection:bg-blue-500/30">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 italic">Automation</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mt-1">
              AI <span className="text-blue-600">Workflows</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2 font-medium max-w-lg">
              Chain multiple AI steps together. Each step is routed intelligently to maximize savings across the full pipeline.
            </p>
          </div>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/30"
          >
            {showCreate ? <X size={14} /> : <Plus size={14} />}
            {showCreate ? "Cancel" : "New Workflow"}
          </button>
        </div>

        {/* TEMPLATES */}
        {!showCreate && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500" />
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Start from a template
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  onClick={() => applyTemplate(tpl)}
                  className="text-left bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-2 hover:border-blue-500/30 hover:bg-zinc-900/70 transition-all group"
                >
                  <span className="text-2xl">{tpl.emoji}</span>
                  <p className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">
                    {tpl.name}
                  </p>
                  <p className="text-[9px] text-zinc-600 leading-relaxed">{tpl.description}</p>
                  <p className="text-[8px] font-black uppercase text-blue-600 tracking-widest">
                    {tpl.steps.length} steps →
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CREATE PANEL */}
        {showCreate && (
          <div id="create-panel" className="bg-zinc-900/60 border border-blue-500/20 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">Define Workflow</h2>
              {/* Quick-apply template */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    onClick={() => applyTemplate(tpl)}
                    className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-zinc-700 text-zinc-500 hover:border-blue-500/50 hover:text-blue-400 transition-all"
                  >
                    {tpl.emoji} {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Workflow Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Research & Summarize"
                  className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-3 text-sm font-mono focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-3 text-sm font-mono focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Steps</p>
                  <div className="relative group">
                    <Info size={11} className="text-zinc-700 cursor-help" />
                    <div className="absolute left-0 bottom-5 w-64 bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-[9px] text-zinc-400 leading-relaxed hidden group-hover:block z-10 shadow-xl">
                      Use <code className="text-blue-400">{"{{input.key}}"}</code> to inject initial inputs.<br />
                      Use <code className="text-blue-400">{"{{steps.output_key}}"}</code> to pass a previous step's output into this step's prompt.
                    </div>
                  </div>
                </div>
                <button
                  onClick={addStep}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Plus size={12} /> Add Step
                </button>
              </div>

              {steps.map((step, i) => {
                const detectedInputVars = detectInputVars(step.prompt_template);
                const detectedStepRefs = detectStepRefs(step.prompt_template);
                const available = availableKeys(steps, i);
                const unusedRefs = detectedStepRefs.filter((r) => !available.includes(r));
                const tooltipKey = `mode-${i}`;

                return (
                  <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                    {/* Step header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                          <span className="text-[8px] font-black text-blue-400">{i + 1}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest">Step {i + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => duplicateStep(i)}
                          title="Duplicate step"
                          className="text-zinc-700 hover:text-zinc-400 transition-colors"
                        >
                          <Copy size={13} />
                        </button>
                        {steps.length > 1 && (
                          <button onClick={() => removeStep(i)} className="text-zinc-700 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Fields row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        value={step.name}
                        onChange={(e) => updateStep(i, "name", e.target.value)}
                        placeholder="Step name *"
                        className="bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-500/50 outline-none"
                      />
                      <input
                        value={step.output_key}
                        onChange={(e) => updateStep(i, "output_key", e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                        placeholder="Output key * (e.g. research)"
                        className="bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-500/50 outline-none"
                      />
                      {/* Routing mode with tooltip */}
                      <div className="relative">
                        <select
                          value={step.routing_mode}
                          onChange={(e) => updateStep(i, "routing_mode", e.target.value)}
                          className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-500/50 outline-none pr-8"
                        >
                          {ROUTING_MODES.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-400"
                          onMouseEnter={() => setActiveTooltip(tooltipKey)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <Info size={12} />
                        </button>
                        {activeTooltip === tooltipKey && (
                          <div className="absolute right-0 bottom-10 w-56 bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-[9px] text-zinc-400 z-10 shadow-xl leading-relaxed">
                            {ROUTING_MODES.find((m) => m.value === step.routing_mode)?.hint}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Prompt template */}
                    <div className="space-y-2">
                      <textarea
                        value={step.prompt_template}
                        onChange={(e) => updateStep(i, "prompt_template", e.target.value)}
                        placeholder={`Prompt template *\nUse {{input.topic}} for initial inputs or {{steps.research}} for a previous step's output.`}
                        rows={4}
                        className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:border-blue-500/50 outline-none resize-none transition-all"
                      />

                      {/* Live variable detection */}
                      <div className="flex flex-wrap gap-2 min-h-[1.5rem]">
                        {detectedInputVars.map((v) => (
                          <span key={v} className="inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            📥 input.{v}
                          </span>
                        ))}
                        {detectedStepRefs.map((v) => (
                          <span
                            key={v}
                            className={`inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-1 rounded-lg border ${
                              available.includes(v)
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                          >
                            {available.includes(v) ? "✓" : "✗"} steps.{v}
                          </span>
                        ))}
                        {unusedRefs.length > 0 && (
                          <span className="text-[8px] text-red-400 font-bold self-center">
                            ↑ key not defined by a previous step
                          </span>
                        )}
                      </div>

                      {/* Available keys from prior steps */}
                      {available.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[8px] font-black uppercase text-zinc-600">Available:</span>
                          {available.map((k) => (
                            <button
                              key={k}
                              onClick={() => updateStep(i, "prompt_template", step.prompt_template + `{{steps.${k}}}`)}
                              title="Click to insert"
                              className="text-[8px] font-black uppercase px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                            >
                              + steps.{k}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-blue-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {creating ? "Creating..." : "Create Workflow"}
            </button>
          </div>
        )}

        {/* WORKFLOW LIST */}
        {workflows.length === 0 && !showCreate ? (
          <div className="text-center py-20 space-y-4">
            <Layers size={48} className="text-zinc-800 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
              No workflows yet — pick a template above or create one from scratch.
            </p>
          </div>
        ) : workflows.length > 0 ? (
          <div className="space-y-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Your Workflows</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflows.map((wf) => (
                <WorkflowCard key={wf.id} workflow={wf} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        ) : null}
      </main>

      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-right-10 duration-500">
          <div className={`relative p-[1.5px] rounded-2xl bg-gradient-to-br ${notification.type === "error" ? "from-red-500/80 via-red-500/20 to-transparent shadow-[0_0_30px_-10px_rgba(239,68,68,0.5)]" : "from-blue-600/80 via-blue-400/20 to-transparent shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)]"}`}>
            <div className="bg-[#080808]/90 backdrop-blur-xl rounded-2xl px-8 py-5 flex items-center gap-5 border border-white/5">
              <div className={`p-3 rounded-full ${notification.type === "error" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-400"}`}>
                {notification.type === "error" ? <AlertCircle size={22} className="animate-pulse" /> : <CheckCircle2 size={22} className="animate-pulse" />}
              </div>
              <span className="text-sm font-bold text-white">{notification.msg}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Workflow Card
// ---------------------------------------------------------------------------
function WorkflowCard({ workflow, onDelete }: { workflow: WorkflowDefinition; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 space-y-5 hover:border-blue-500/20 transition-all backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 italic">
            {workflow.steps.length} step{workflow.steps.length !== 1 ? "s" : ""}
          </p>
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-white truncate">{workflow.name}</h3>
          {workflow.description && <p className="text-xs text-zinc-500 font-medium">{workflow.description}</p>}
        </div>
        <button onClick={() => onDelete(workflow.id)} className="text-zinc-700 hover:text-red-500 transition-colors flex-shrink-0 mt-1">
          <Trash2 size={16} />
        </button>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? "Hide Steps" : "Show Steps"}
      </button>

      {expanded && (
        <div className="space-y-2">
          {workflow.steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-2.5 border border-white/5">
              <span className="text-[8px] font-black text-blue-500 w-5 text-center">{i + 1}</span>
              <span className="text-xs font-bold text-white flex-1 truncate">{s.name}</span>
              <span className="text-[8px] font-black uppercase text-zinc-600 border border-zinc-800 rounded-lg px-2 py-0.5">{s.routing_mode}</span>
              {s.output_key && (
                <code className="text-[7px] text-blue-500/60 font-mono">→ {s.output_key}</code>
              )}
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/workflows/${workflow.id}`}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-transparent transition-all"
      >
        <Play size={12} /> Run Workflow <ArrowRight size={12} />
      </Link>
    </div>
  );
}
