"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Loader2, ShieldCheck, AlertTriangle, Activity, Eye,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase";
import DashboardShell from '@/components/DashboardShell';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface QualitySummary {
  total_audits:  number;
  avg_quality:   number | null;
  at_risk_count: number;
  at_risk_pct:   number;
  anomaly_count: number;
}

interface DailyQuality {
  date:        string;
  avg_quality: number | null;
  audits:      number;
  at_risk:     number;
}

interface Audit {
  id:                string;
  created_at:        string;
  prompt_preview:    string;
  final_quality:     number;
  raw_similarity:    number;
  penalty_score:     number;
  is_at_risk:        boolean;
  anomaly_detected:  boolean;
  cheap_cost:        number;
  premium_cost:      number;
  cost_delta:        number;
  router_confidence: number;
}

interface QualityData {
  summary:       QualitySummary;
  daily:         DailyQuality[];
  recent_audits: Audit[];
  days:          number;
}

import { API_BASE } from '@/lib/config';

const RANGE_OPTIONS = [
  { label: "7d",  days: 7  },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function shortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function qualityColor(q: number | null): string {
  if (q === null) return "text-zinc-600";
  if (q >= 0.85) return "text-emerald-400";
  if (q >= 0.70) return "text-yellow-400";
  return "text-red-400";
}

function qualityBg(q: number | null): string {
  if (q === null) return "bg-zinc-800 border-zinc-700";
  if (q >= 0.85) return "bg-emerald-500/10 border-emerald-500/20";
  if (q >= 0.70) return "bg-yellow-500/10 border-yellow-500/20";
  return "bg-red-500/10 border-red-500/20";
}

function qualityLabel(q: number | null): string {
  if (q === null) return "—";
  if (q >= 0.85) return "Good";
  if (q >= 0.70) return "Warn";
  return "Risk";
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs shadow-xl space-y-1">
      <p className="text-zinc-400 font-bold mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="text-zinc-500">{p.name}</span>
          <span className="font-black" style={{ color: p.color }}>
            {p.value !== null && p.value !== undefined ? p.value : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function QualityPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [apiKey,  setApiKey]  = useState<string | null>(null);
  const [data,    setData]    = useState<QualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range,   setRange]   = useState(30);

  const load = useCallback(async (key: string, days: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/account/quality/${user!.id}?days=${days}`, {
        headers: { "X-API-KEY": key },
      });
      if (!res.ok) throw new Error("Failed to load quality data");
      setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      const token = await getToken({ template: "supabase" });
      const sb = createAuthClient(token!);
      const { data: keyData } = await sb.from("api_keys").select("key").eq("user_id", user.id).maybeSingle();
      const key = keyData?.key ?? null;
      setApiKey(key);
      if (key) await load(key, range);
    })();
  }, [isLoaded, user?.id]);

  const handleRangeChange = async (days: number) => {
    setRange(days);
    if (apiKey) await load(apiKey, days);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const s = data?.summary;
  const hasData = (s?.total_audits ?? 0) > 0;

  return (
    <DashboardShell>
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24 selection:bg-blue-500/30">

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 italic">Shadow Engine</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mt-1">
              Quality <span className="text-blue-600">Monitor</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Async audits comparing cheap vs premium model responses.
            </p>
          </div>

          {/* Range selector */}
          <div className="flex items-center gap-1 bg-zinc-900/60 border border-white/5 rounded-2xl p-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => handleRangeChange(opt.days)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  range === opt.days
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Loading quality data...</span>
          </div>
        ) : !hasData ? (
          /* EMPTY STATE */
          <div className="text-center py-28 space-y-4">
            <ShieldCheck size={52} className="text-zinc-800 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
              No shadow audits yet
            </p>
            <p className="text-zinc-700 text-xs max-w-sm mx-auto leading-relaxed">
              The Shadow Engine runs automatically in the background for every
              economy-tier request in <span className="text-blue-400">auto</span> routing mode.
              Make a few requests to see quality scores appear here.
            </p>
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Avg Quality",
                  value: s?.avg_quality !== null && s?.avg_quality !== undefined
                    ? `${(s.avg_quality * 100).toFixed(1)}%`
                    : "—",
                  sub: "semantic similarity score",
                  icon: <ShieldCheck size={18} />,
                  color: qualityColor(s?.avg_quality ?? null),
                  bg: qualityBg(s?.avg_quality ?? null),
                },
                {
                  label: "At-Risk Requests",
                  value: `${s?.at_risk_count ?? 0}`,
                  sub: `${s?.at_risk_pct ?? 0}% of audited`,
                  icon: <AlertTriangle size={18} />,
                  color: (s?.at_risk_count ?? 0) > 0 ? "text-yellow-400" : "text-zinc-500",
                  bg: (s?.at_risk_count ?? 0) > 0 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-white/5 border-white/10",
                },
                {
                  label: "Anomalies",
                  value: `${s?.anomaly_count ?? 0}`,
                  sub: "high confidence + low quality",
                  icon: <AlertTriangle size={18} />,
                  color: (s?.anomaly_count ?? 0) > 0 ? "text-red-400" : "text-zinc-500",
                  bg: (s?.anomaly_count ?? 0) > 0 ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10",
                },
                {
                  label: "Total Audited",
                  value: (s?.total_audits ?? 0).toLocaleString(),
                  sub: `last ${range} days`,
                  icon: <Activity size={18} />,
                  color: "text-blue-400",
                  bg: "bg-blue-500/10 border-blue-500/20",
                },
              ].map((card) => (
                <div key={card.label} className={`rounded-[2rem] p-6 border ${card.bg} space-y-3`}>
                  <div className={card.color}>{card.icon}</div>
                  <div>
                    <p className={`text-2xl font-black italic tracking-tighter ${card.color}`}>{card.value}</p>
                    <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mt-0.5">{card.sub}</p>
                  </div>
                  <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{card.label}</p>
                </div>
              ))}
            </div>

            {/* QUALITY TREND */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-400" />
                <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                  Quality Score Over Time
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data?.daily ?? []} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fill: "#52525b", fontSize: 9, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0.5, 1]}
                    tick={{ fill: "#52525b", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    width={36}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  {/* Threshold reference line at 80% */}
                  <Line
                    type="monotone"
                    dataKey="avg_quality"
                    name="Avg Quality"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" /> Quality Score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-yellow-500/50 inline-block rounded border-dashed border-b border-yellow-500" /> 80% threshold
                </span>
              </div>
            </div>

            {/* AUDIT VOLUME */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-blue-400" />
                <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                  Audits per Day
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={data?.daily ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fill: "#52525b", fontSize: 9, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="audits"   name="Audits"   fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} stackId="a" />
                  <Bar dataKey="at_risk"  name="At-Risk"  fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={20} stackId="b" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" /> Audits</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-yellow-500 inline-block rounded" /> At-Risk</span>
              </div>
            </div>

            {/* RECENT AUDITS TABLE */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden">
              <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                <Eye size={14} className="text-zinc-500" />
                <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">Recent Audits</h2>
              </div>

              {/* Header */}
              <div className="grid grid-cols-12 gap-3 px-6 py-3 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <span className="col-span-4">Prompt Preview</span>
                <span className="col-span-2">Quality</span>
                <span className="col-span-2">Similarity</span>
                <span className="col-span-2">Cost Delta</span>
                <span className="col-span-2">Time</span>
              </div>

              {(data?.recent_audits ?? []).length === 0 ? (
                <div className="text-center py-16 text-zinc-700 text-[10px] font-black uppercase">
                  No audits in this period
                </div>
              ) : (
                (data?.recent_audits ?? []).map((audit) => (
                  <div
                    key={audit.id}
                    className={`grid grid-cols-12 gap-3 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center ${
                      audit.anomaly_detected ? "border-l-2 border-l-red-500/50" : audit.is_at_risk ? "border-l-2 border-l-yellow-500/40" : ""
                    }`}
                  >
                    {/* Prompt preview */}
                    <div className="col-span-4">
                      <p className="text-[11px] text-zinc-400 truncate font-mono" title={audit.prompt_preview}>
                        {audit.prompt_preview || "—"}
                      </p>
                    </div>

                    {/* Quality score */}
                    <div className="col-span-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${qualityBg(audit.final_quality)} ${qualityColor(audit.final_quality)}`}>
                        {qualityLabel(audit.final_quality)} {audit.final_quality != null ? `${(audit.final_quality * 100).toFixed(0)}%` : ""}
                      </span>
                      {audit.anomaly_detected && (
                        <span className="ml-1 text-[8px] font-black text-red-400 uppercase">anomaly</span>
                      )}
                    </div>

                    {/* Raw similarity */}
                    <div className="col-span-2">
                      <p className={`text-[11px] font-bold ${qualityColor(audit.raw_similarity)}`}>
                        {audit.raw_similarity != null ? `${(audit.raw_similarity * 100).toFixed(0)}%` : "—"}
                      </p>
                      {audit.penalty_score > 0 && (
                        <p className="text-[9px] text-zinc-600 font-bold">-{(audit.penalty_score * 100).toFixed(0)}% penalty</p>
                      )}
                    </div>

                    {/* Cost delta */}
                    <div className="col-span-2">
                      <p className="text-[11px] text-zinc-400 font-bold">
                        +${(audit.cost_delta ?? 0).toFixed(5)}
                      </p>
                      <p className="text-[9px] text-zinc-600 font-bold">premium overhead</p>
                    </div>

                    {/* Time */}
                    <div className="col-span-2">
                      <p className="text-[10px] text-zinc-600 font-bold">{fmtDate(audit.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* HOW IT WORKS */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] p-6 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">How the Shadow Engine works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "Economy response", desc: "A budget model answers the user instantly." },
                  { step: "2", title: "Shadow audit", desc: "Async: the same prompt is sent to GPT-4o. Responses are compared via semantic embeddings." },
                  { step: "3", title: "Quality score", desc: "Cosine similarity + heuristic penalties = final quality. Below threshold → flagged as at-risk." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="text-[10px] font-black text-blue-500 w-4 shrink-0">{item.step}.</span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">{item.title}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
    </DashboardShell>
  );
}
