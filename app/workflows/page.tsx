"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Zap, Plus, Trash2, ArrowRight, Loader2, AlertCircle,
  CheckCircle2, Layers, ChevronDown, ChevronUp, X, Play,
} from "lucide-react";
import { useUser, UserButton, useAuth } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase";

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

const ROUTING_MODES = ["auto", "cost", "quality", "speed"] as const;

const API_BASE = "https://web-production-4f439.up.railway.app";

const emptyStep = (): WorkflowStep => ({
  name: "",
  prompt_template: "",
  routing_mode: "auto",
  output_key: "",
});

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

  // Create form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([emptyStep()]);
  const [creating, setCreating] = useState(false);

  // ---------------------------------------------------------------------------
  // Bootstrap: load API key then workflows
  // ---------------------------------------------------------------------------
  const loadApiKey = useCallback(async () => {
    if (!user) return null;
    const token = await getToken({ template: "supabase" });
    const sb = createAuthClient(token!);
    const { data } = await sb
      .from("api_keys")
      .select("key")
      .eq("user_id", user.id)
      .maybeSingle();
    return data?.key ?? null;
  }, [user, getToken]);

  const fetchWorkflows = useCallback(async (key: string) => {
    const res = await fetch(`${API_BASE}/v1/workflows`, {
      headers: { "X-API-KEY": key },
    });
    if (!res.ok) throw new Error("Failed to load workflows");
    return res.json() as Promise<WorkflowDefinition[]>;
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      try {
        const key = await loadApiKey();
        setApiKey(key);
        if (key) {
          const data = await fetchWorkflows(key);
          setWorkflows(data);
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
    setName("");
    setDescription("");
    setSteps([emptyStep()]);
    setShowCreate(false);
  };

  // ---------------------------------------------------------------------------
  // Step management
  // ---------------------------------------------------------------------------
  const updateStep = (i: number, field: keyof WorkflowStep, value: string) =>
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
  const removeStep = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i));

  // ---------------------------------------------------------------------------
  // Create workflow
  // ---------------------------------------------------------------------------
  const handleCreate = async () => {
    if (!apiKey) return;
    if (!name.trim()) return notify("Workflow name is required.", "error");
    if (steps.some((s) => !s.name || !s.prompt_template || !s.output_key))
      return notify("All step fields are required.", "error");

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
      notify("Workflow created successfully!", "success");
      resetForm();
    } catch (e: any) {
      notify(e.message, "error");
    } finally {
      setCreating(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete workflow
  // ---------------------------------------------------------------------------
  const handleDelete = async (id: string) => {
    if (!apiKey) return;
    try {
      await fetch(`${API_BASE}/v1/workflows/${id}`, {
        method: "DELETE",
        headers: { "X-API-KEY": apiKey },
      });
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
      notify("Workflow deleted.", "success");
    } catch {
      notify("Could not delete workflow.", "error");
    }
  };

  // ---------------------------------------------------------------------------
  // Loading states
  // ---------------------------------------------------------------------------
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
          Loading Workflows...
        </span>
      </div>
    );
  }

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
            href="/dashboard"
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all"
          >
            Chat
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 italic">
              Automation
            </p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mt-1">
              AI <span className="text-blue-600">Workflows</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2 font-medium max-w-lg">
              Chain multiple AI steps together. Each step is routed intelligently
              to maximize savings across the full pipeline.
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

        {/* CREATE PANEL */}
        {showCreate && (
          <div className="bg-zinc-900/60 border border-blue-500/20 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-md">
            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
              Define Workflow
            </h2>

            {/* Name & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  Workflow Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Research & Summarize"
                  className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-3 text-sm font-mono focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-3 text-sm font-mono focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>

            {/* Steps builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  Steps — use {`{{input.key}}`} or {`{{steps.output_key}}`}
                </p>
                <button
                  onClick={addStep}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Plus size={12} /> Add Step
                </button>
              </div>

              {steps.map((step, i) => (
                <div
                  key={i}
                  className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest">
                      Step {i + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        onClick={() => removeStep(i)}
                        className="text-zinc-700 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      value={step.name}
                      onChange={(e) => updateStep(i, "name", e.target.value)}
                      placeholder="Step name *"
                      className="bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-500/50 outline-none"
                    />
                    <input
                      value={step.output_key}
                      onChange={(e) => updateStep(i, "output_key", e.target.value)}
                      placeholder="Output key * (e.g. research)"
                      className="bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-500/50 outline-none"
                    />
                    <select
                      value={step.routing_mode}
                      onChange={(e) =>
                        updateStep(i, "routing_mode", e.target.value)
                      }
                      className="bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-500/50 outline-none"
                    >
                      {ROUTING_MODES.map((m) => (
                        <option key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={step.prompt_template}
                    onChange={(e) =>
                      updateStep(i, "prompt_template", e.target.value)
                    }
                    placeholder={`Prompt template *\nE.g. Research the following topic: {{input.topic}}`}
                    rows={3}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-500/50 outline-none resize-none"
                  />
                </div>
              ))}
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
          <div className="text-center py-24 space-y-4">
            <Layers size={48} className="text-zinc-800 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
              No workflows yet — create one to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map((wf) => (
              <WorkflowCard key={wf.id} workflow={wf} onDelete={handleDelete} />
            ))}
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

// ---------------------------------------------------------------------------
// Workflow Card
// ---------------------------------------------------------------------------
function WorkflowCard({
  workflow,
  onDelete,
}: {
  workflow: WorkflowDefinition;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 space-y-5 hover:border-blue-500/20 transition-all backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 italic">
            {workflow.steps.length} step{workflow.steps.length !== 1 ? "s" : ""}
          </p>
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-white truncate">
            {workflow.name}
          </h3>
          {workflow.description && (
            <p className="text-xs text-zinc-500 font-medium">{workflow.description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(workflow.id)}
          className="text-zinc-700 hover:text-red-500 transition-colors flex-shrink-0 mt-1"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Steps preview toggle */}
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
            <div
              key={i}
              className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-2.5 border border-white/5"
            >
              <span className="text-[8px] font-black text-blue-500 w-5 text-center">
                {i + 1}
              </span>
              <span className="text-xs font-bold text-white flex-1 truncate">{s.name}</span>
              <span className="text-[8px] font-black uppercase text-zinc-600 border border-zinc-800 rounded-lg px-2 py-0.5">
                {s.routing_mode}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/workflows/${workflow.id}`}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-transparent transition-all"
      >
        <Play size={12} /> Run Workflow
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
