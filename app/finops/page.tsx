"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Loader2, TrendingUp, DollarSign, Zap, Target, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase";
import DashboardNav from "@/components/DashboardNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ROISummary {
  roi_multiplier:        number | null;
  roi_pct:               number | null;
  benchmark_cost_usd:    number;
  actual_cost_usd:       number;
  subscription_cost_usd: number;
  gross_savings_usd:     number;
  net_savings_usd:       number;
}

interface DayBucket {
  date:                      string;
  actual_usd:                number;
  benchmark_usd:             number;
  requests:                  number;
  cumulative_actual_usd:     number;
  cumulative_benchmark_usd:  number;
  budget_usd?:               number;
  cumulative_budget_usd?:    number;
}

interface OptimizationOpp {
  total_requests:              number;
  economy_requests:            number;
  premium_requests:            number;
  economy_pct:                 number;
  potential_extra_savings_usd: number;
}

interface Meta {
  plan:                   string;
  monthly_plan_price_usd: number;
  monthly_budget_usd:     number | null;
  period_days:            number;
}

interface FinOpsData {
  roi:                     ROISummary;
  budget_vs_actual:        DayBucket[];
  optimization_opportunity: OptimizationOpp;
  meta:                    Meta;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
import { API_BASE } from '@/lib/config';

const RANGE_OPTIONS = [
  { label: "7d",  days: 7  },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function usd(n: number | null | undefined, decimals = 2) {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function pct(n: number | null | undefined) {
  if (n == null) return "—";
  return `${n.toFixed(1)}%`;
}

function roiColor(roi: number | null) {
  if (roi == null) return "text-zinc-400";
  if (roi > 0)  return "text-emerald-400";
  if (roi === 0) return "text-zinc-400";
  return "text-red-400";
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs shadow-xl space-y-1.5">
      <p className="text-zinc-400 font-bold mb-2">{shortDate(label)}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6">
          <span className="text-zinc-500">{p.name}</span>
          <span className="font-black" style={{ color: p.color }}>
            {typeof p.value === "number" ? usd(p.value, 4) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function FinOpsPage() {
  const { user, isLoaded } = useUser();
  const { getToken }       = useAuth();

  const [apiKey,  setApiKey]  = useState<string | null>(null);
  const [data,    setData]    = useState<FinOpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range,   setRange]   = useState(30);

  const load = useCallback(async (key: string, days: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/account/finops/${user!.id}?days=${days}`, {
        headers: { "X-API-KEY": key },
      });
      if (!res.ok) throw new Error("Failed to load FinOps data");
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

  const roi  = data?.roi;
  const opp  = data?.optimization_opportunity;
  const meta = data?.meta;
  const hasBudget = (data?.budget_vs_actual ?? []).some(d => d.budget_usd != null);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24 selection:bg-blue-500/30">

      <DashboardNav />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <ErrorBoundary section="FinOps">

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 italic">AI FinOps</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mt-1">
              ROI <span className="text-emerald-500">Report</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Cost attribution, savings vs benchmark, and optimization opportunities.
            </p>
            <a
              href="/report"
              target="_blank"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 border border-white/10 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Download Monthly PDF
            </a>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900/60 border border-white/5 rounded-2xl p-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => handleRangeChange(opt.days)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  range === opt.days
                    ? "bg-emerald-600 text-white shadow-lg"
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
            <Loader2 className="animate-spin text-emerald-600" size={36} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
              Calculating ROI…
            </span>
          </div>
        ) : (
          <>
            {/* ── ROI HERO ────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-emerald-950/60 to-zinc-900/60 border border-emerald-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
              {/* Big ROI number */}
              <div className="text-center md:text-left shrink-0">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic mb-2">
                  {range}-day ROI vs Direct OpenAI
                </p>
                {roi?.roi_pct != null ? (
                  <p className={`text-7xl font-black italic tracking-tighter ${roiColor(roi.roi_multiplier)}`}>
                    {roi.roi_pct > 0 ? "+" : ""}{roi.roi_pct.toFixed(0)}
                    <span className="text-3xl text-emerald-400/70">%</span>
                  </p>
                ) : (
                  <p className="text-5xl font-black italic text-zinc-400">Free Plan</p>
                )}
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-2">
                  {roi?.roi_multiplier != null
                    ? `${roi.roi_multiplier.toFixed(1)}× return on subscription cost`
                    : "ROI unlocked on paid plans"}
                </p>
              </div>

              {/* ROI formula breakdown */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {[
                  {
                    label: "GPT-4o Benchmark",
                    value: usd(roi?.benchmark_cost_usd),
                    sub:   "what direct OpenAI would cost",
                    color: "text-red-400",
                    bg:    "bg-red-500/10 border-red-500/20",
                    icon:  <DollarSign size={16} />,
                  },
                  {
                    label: "Actual Spend",
                    value: usd(roi?.actual_cost_usd),
                    sub:   `incl. ${usd(roi?.subscription_cost_usd)} subscription`,
                    color: "text-blue-400",
                    bg:    "bg-blue-500/10 border-blue-500/20",
                    icon:  <Zap size={16} />,
                  },
                  {
                    label: "Net Savings",
                    value: usd(roi?.net_savings_usd),
                    sub:   `${usd(roi?.gross_savings_usd)} gross, after sub fee`,
                    color: "text-emerald-400",
                    bg:    "bg-emerald-500/10 border-emerald-500/20",
                    icon:  <TrendingUp size={16} />,
                  },
                ].map((card) => (
                  <div key={card.label} className={`rounded-2xl border p-5 space-y-3 ${card.bg}`}>
                    <div className={card.color}>{card.icon}</div>
                    <p className={`text-xl font-black italic tracking-tight ${card.color}`}>{card.value}</p>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{card.label}</p>
                      <p className="text-[9px] text-zinc-600 mt-0.5">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ROI FORMULA NOTE ─────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-6 py-4 bg-zinc-900/30 border border-white/5 rounded-2xl text-[10px] text-zinc-500 font-mono">
              <span className="text-zinc-700">ROI =</span>
              <span className="text-white">(Benchmark − Actual − Subscription) ÷ Subscription</span>
              <span className="text-zinc-700 ml-auto italic">
                Plan: <span className="text-zinc-400 uppercase">{meta?.plan ?? "—"}</span>
                {meta?.monthly_plan_price_usd != null && meta.monthly_plan_price_usd > 0 &&
                  <span> · ${meta.monthly_plan_price_usd}/mo</span>}
              </span>
            </div>

            {/* ── BUDGET VS ACTUAL CHART ────────────────────────────────── */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target size={16} className="text-emerald-400" />
                  <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                    Budget vs. Actual (Cumulative)
                  </h2>
                </div>
                {!hasBudget && (
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                    Set a budget cap in account settings to enable budget line
                  </p>
                )}
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data?.budget_vs_actual ?? []} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradBenchmark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f87171" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.20} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fill: "#52525b", fontSize: 9, fontWeight: 700 }}
                    axisLine={false} tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#52525b", fontSize: 9 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `$${v.toFixed(2)}`}
                    width={52}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cumulative_benchmark_usd"
                    name="GPT-4o Benchmark"
                    stroke="#f87171"
                    strokeWidth={2}
                    fill="url(#gradBenchmark)"
                    dot={false}
                    strokeDasharray="5 3"
                  />
                  {hasBudget && (
                    <Area
                      type="monotone"
                      dataKey="cumulative_budget_usd"
                      name="Budget Cap"
                      stroke="#3b82f6"
                      strokeWidth={1.5}
                      fill="url(#gradBudget)"
                      dot={false}
                      strokeDasharray="3 3"
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="cumulative_actual_usd"
                    name="Actual Spend"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#gradActual)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap items-center gap-6 text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-[2px] bg-red-400 inline-block rounded opacity-70" style={{ borderStyle: "dashed" }} />
                  GPT-4o Benchmark (what you'd pay without NR)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-[2.5px] bg-emerald-400 inline-block rounded" />
                  Actual Spend
                </span>
                {hasBudget && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-[1.5px] bg-blue-400 inline-block rounded" />
                    Budget Cap
                  </span>
                )}
              </div>
            </div>

            {/* ── DAILY BAR CHART ──────────────────────────────────────── */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <DollarSign size={16} className="text-blue-400" />
                <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                  Daily Spend vs. GPT-4o Cost
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.budget_vs_actual ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fill: "#52525b", fontSize: 9, fontWeight: 700 }}
                    axisLine={false} tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#52525b", fontSize: 9 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `$${v.toFixed(3)}`}
                    width={52}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="benchmark_usd" name="GPT-4o Benchmark" fill="#f87171" opacity={0.5} radius={[3, 3, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="actual_usd"    name="Actual Spend"     fill="#10b981"         radius={[3, 3, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 bg-red-400/50 inline-block rounded-sm" /> GPT-4o Benchmark
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 bg-emerald-400 inline-block rounded-sm" /> Actual Spend
                </span>
              </div>
            </div>

            {/* ── OPTIMIZATION OPPORTUNITY ─────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Routing distribution */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-yellow-400" />
                  <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                    Routing Distribution
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Economy bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-emerald-400">Economy</span>
                      <span className="text-zinc-400">{opp?.economy_requests ?? 0} req · {pct(opp?.economy_pct)}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${opp?.economy_pct ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Premium bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-blue-400">Premium</span>
                      <span className="text-zinc-400">{opp?.premium_requests ?? 0} req · {pct(100 - (opp?.economy_pct ?? 0))}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${100 - (opp?.economy_pct ?? 0)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[9px] text-zinc-600 leading-relaxed">
                  Economy-tier requests use Llama (avg ~95% cheaper than GPT-4o).
                  Premium requests use GPT-4o for high-complexity tasks.
                </p>
              </div>

              {/* Optimization opportunity */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <Target size={16} className="text-purple-400" />
                  <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                    Optimization Opportunity
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* What NR already saved */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Savings Captured</p>
                      <p className="text-lg font-black italic text-white">{usd(roi?.gross_savings_usd)}</p>
                      <p className="text-[9px] text-zinc-600 mt-0.5">
                        Gross savings vs direct OpenAI GPT-4o pricing.
                      </p>
                    </div>
                  </div>

                  {/* Potential additional savings */}
                  {(opp?.potential_extra_savings_usd ?? 0) > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                      <AlertCircle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                          Potential Additional
                        </p>
                        <p className="text-lg font-black italic text-white">
                          ~{usd(opp?.potential_extra_savings_usd)}
                        </p>
                        <p className="text-[9px] text-zinc-600 mt-0.5">
                          Estimated if {opp?.premium_requests} premium requests were
                          routed to economy. Only viable for non-critical tasks.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── SUMMARY TABLE ─────────────────────────────────────────── */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden">
              <div className="px-6 py-5 border-b border-white/5">
                <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">Period Summary</h2>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { label: "Period",              value: `Last ${range} days` },
                  { label: "Total Requests",       value: (opp?.total_requests ?? 0).toLocaleString() },
                  { label: "Economy Requests",     value: `${opp?.economy_requests ?? 0} (${pct(opp?.economy_pct)})` },
                  { label: "Premium Requests",     value: `${opp?.premium_requests ?? 0} (${pct(100 - (opp?.economy_pct ?? 0))})` },
                  { label: "GPT-4o Benchmark",     value: usd(roi?.benchmark_cost_usd, 4) },
                  { label: "Actual Cost",          value: usd(roi?.actual_cost_usd, 4) },
                  { label: "Subscription Cost",    value: usd(roi?.subscription_cost_usd, 2) },
                  { label: "Gross Savings",        value: usd(roi?.gross_savings_usd, 4), highlight: true },
                  { label: "Net Savings",          value: usd(roi?.net_savings_usd, 4), highlight: true },
                  { label: "ROI",                  value: roi?.roi_pct != null ? `${roi.roi_pct.toFixed(1)}%` : "N/A (Free Plan)", highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between items-center px-6 py-3 hover:bg-white/[0.02] transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
                    <span className={`text-sm font-black ${highlight ? "text-emerald-400" : "text-zinc-300"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
