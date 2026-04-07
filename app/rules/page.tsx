"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Plus, Trash2, ToggleLeft, ToggleRight, GitMerge, ChevronDown } from "lucide-react";
import DashboardShell from '@/components/DashboardShell';

import { API_BASE } from '@/lib/config';

const MODELS = [
  "gpt-4o", "gpt-4o-mini", "gpt-4-turbo",
  "claude-3.5-sonnet", "claude-3-haiku",
  "llama-3.1-8b-instant", "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768",
];
const TASK_TYPES = ["coding", "summarization", "chat", "reasoning", "translation", "extraction", "classification"];

const BLANK = {
  name: "", priority: 0, enabled: true,
  cond_task_type: "", cond_min_complexity: "", cond_max_complexity: "",
  cond_session_prefix: "", force_model: "gpt-4o", force_tier: "PREMIUM",
};

type Rule = {
  id: string; name: string; enabled: boolean; priority: number;
  cond_task_type?: string; cond_min_complexity?: number; cond_max_complexity?: number;
  cond_session_prefix?: string; force_model: string; force_tier: string;
};

export default function RulesPage() {
  const { user, isLoaded } = useUser();
  const [rules, setRules]       = useState<Rule[]>([]);
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ ...BLANK });
  const [err, setErr]           = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    loadRules();
  }, [isLoaded, user]);

  const loadRules = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/v1/account/rules/${user!.id}`);
      const data = await res.json();
      setRules(data.rules || []);
    } catch { setErr("Could not load rules."); }
    finally { setLoading(false); }
  };

  const createRule = async () => {
    if (!form.name || !form.force_model || !user) return;
    setCreating(true); setErr(null);
    try {
      const payload: any = {
        user_id: user.id, name: form.name,
        priority: Number(form.priority) || 0,
        enabled: form.enabled,
        force_model: form.force_model,
        force_tier: form.force_tier,
      };
      if (form.cond_task_type)       payload.cond_task_type       = form.cond_task_type;
      if (form.cond_min_complexity)  payload.cond_min_complexity  = parseFloat(form.cond_min_complexity as any);
      if (form.cond_max_complexity)  payload.cond_max_complexity  = parseFloat(form.cond_max_complexity as any);
      if (form.cond_session_prefix)  payload.cond_session_prefix  = form.cond_session_prefix;

      const res = await fetch(`${API_BASE}/v1/account/rules`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Failed"); }
      setForm({ ...BLANK }); setShowForm(false);
      await loadRules();
    } catch (e: any) { setErr(e.message); }
    finally { setCreating(false); }
  };

  const toggleRule = async (rule: Rule) => {
    setToggling(rule.id);
    try {
      await fetch(`${API_BASE}/v1/account/rules/${rule.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !rule.enabled }),
      });
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
    } catch { setErr("Could not toggle rule."); }
    finally { setToggling(null); }
  };

  const deleteRule = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`${API_BASE}/v1/account/rules/${id}?user_id=${user!.id}`, { method: "DELETE" });
      setRules(prev => prev.filter(r => r.id !== id));
    } catch { setErr("Could not delete rule."); }
    finally { setDeleting(null); }
  };

  const field = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </div>
    );
  }

  return (
    <DashboardShell>
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24">
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Power User</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Custom Routing Rules</h1>
            <p className="text-zinc-600 text-sm mt-1">
              Rules are evaluated before auto-routing. Highest priority wins. Leave conditions blank to match any prompt.
            </p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shrink-0"
          >
            <Plus size={13} /> New Rule
          </button>
        </div>

        {err && <div className="px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">{err}</div>}

        {/* Create form */}
        {showForm && (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-blue-500/20 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">New Rule</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Rule Name *</label>
                <input value={form.name} onChange={e => field("name", e.target.value)}
                  placeholder="e.g. Force GPT-4 for code"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Priority (higher = first)</label>
                <input type="number" value={form.priority} onChange={e => field("priority", e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-3">Conditions (leave blank = match all)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Task Type</label>
                  <select value={form.cond_task_type} onChange={e => field("cond_task_type", e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
                    <option value="">Any</option>
                    {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Min Complexity (0–1)</label>
                  <input type="number" step="0.1" min="0" max="1" value={form.cond_min_complexity}
                    onChange={e => field("cond_min_complexity", e.target.value)} placeholder="e.g. 0.7"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Max Complexity (0–1)</label>
                  <input type="number" step="0.1" min="0" max="1" value={form.cond_max_complexity}
                    onChange={e => field("cond_max_complexity", e.target.value)} placeholder="e.g. 1.0"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-3">Action</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Force Model *</label>
                  <select value={form.force_model} onChange={e => field("force_model", e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
                    {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Tier</label>
                  <select value={form.force_tier} onChange={e => field("force_tier", e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="ECONOMY">ECONOMY</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={createRule} disabled={creating || !form.name}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center gap-2">
                {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Save Rule
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-zinc-800 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rules list */}
        {rules.length === 0 && !showForm ? (
          <div className="p-10 rounded-2xl bg-zinc-900/20 border border-white/5 text-center space-y-3">
            <GitMerge size={32} className="text-zinc-700 mx-auto" />
            <p className="text-zinc-500 text-sm font-bold">No custom rules yet.</p>
            <p className="text-zinc-700 text-xs">
              Example: <span className="text-zinc-500">if task=coding AND complexity≥0.8 → force gpt-4o</span>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id}
                className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                  rule.enabled ? "bg-zinc-900/30 border-white/5" : "bg-zinc-950/30 border-white/5 opacity-50"
                }`}>

                {/* Priority badge */}
                <div className="text-center shrink-0 w-8">
                  <p className="text-[9px] font-black text-zinc-700 uppercase">P</p>
                  <p className="text-sm font-black text-zinc-400">{rule.priority}</p>
                </div>

                {/* Name + conditions */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white truncate">{rule.name}</p>
                  <p className="text-[10px] text-zinc-600 font-bold mt-0.5">
                    {[
                      rule.cond_task_type && `task=${rule.cond_task_type}`,
                      rule.cond_min_complexity != null && `complexity≥${rule.cond_min_complexity}`,
                      rule.cond_max_complexity != null && `complexity≤${rule.cond_max_complexity}`,
                    ].filter(Boolean).join(" AND ") || "Matches all prompts"}
                    <span className="text-zinc-500 mx-2">→</span>
                    <span className="text-blue-400">{rule.force_model}</span>
                    <span className="text-zinc-700 ml-1">({rule.force_tier})</span>
                  </p>
                </div>

                {/* Toggle */}
                <button onClick={() => toggleRule(rule)} disabled={toggling === rule.id}
                  className="text-zinc-500 hover:text-white transition-colors shrink-0">
                  {toggling === rule.id
                    ? <Loader2 size={18} className="animate-spin" />
                    : rule.enabled
                      ? <ToggleRight size={22} className="text-blue-500" />
                      : <ToggleLeft size={22} />}
                </button>

                {/* Delete */}
                <button onClick={() => deleteRule(rule.id)} disabled={deleting === rule.id}
                  className="p-2 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
                  {deleting === rule.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Explainer */}
        <div className="p-5 rounded-xl bg-zinc-900/20 border border-white/5 text-xs text-zinc-600 space-y-1 font-bold">
          <p className="text-zinc-500 font-black uppercase tracking-widest text-[9px] mb-2">How rules work</p>
          <p>• Rules are evaluated before auto-routing, highest priority first.</p>
          <p>• All specified conditions must match (AND logic). Blank = any value.</p>
          <p>• Complexity is normalized 0–1 (0 = simple chat, 1 = hard reasoning/code).</p>
          <p>• Only available on <span className="text-blue-400">Business</span> plan. Custom rules require a whitelisted model.</p>
        </div>
      </main>
    </div>
    </DashboardShell>
  );
}
