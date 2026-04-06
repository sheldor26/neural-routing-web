"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Loader2, TrendingUp, DollarSign, Activity, Cpu, BarChart2,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase";
import DashboardNav from "@/components/DashboardNav";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DailyPoint {
  date: string;
  savings_usd: number;
  cost_usd: number;
  requests: number;
  credits_used: number;
}

interface TierSlice {
  tier: string;
  count: number;
  pct: number;
}

interface TopModel {
  model: string;
  count: number;
}

interface AnalyticsData {
  daily: DailyPoint[];
  model_distribution: TierSlice[];
  top_models: TopModel[];
  total_requests: number;
}

import { API_BASE } from '@/lib/config';

const TIER_COLORS: Record<string, string> = {
  budget:  "#10b981",
  medium:  "#3b82f6",
  premium: "#a855f7",
};

const RANGE_OPTIONS = [
  { label: "7d",  days: 7  },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

// Short date label for x-axis
function shortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Custom tooltip shared by all charts
function ChartTooltip({ active, payload, label, valueFormatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs shadow-xl space-y-1">
      <p className="text-zinc-400 font-bold mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="text-zinc-500">{p.name}</span>
          <span className="font-black" style={{ color: p.color }}>
            {valueFormatter ? valueFormatter(p.value, p.dataKey) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------
  const load = useCallback(async (key: string, days: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/account/analytics/${user!.id}?days=${days}`, {
        headers: { "X-API-KEY": key },
      });
      if (!res.ok) throw new Error("Failed to load analytics");
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

  // ---------------------------------------------------------------------------
  // Derived stats
  // ---------------------------------------------------------------------------
  const totalSavings  = data?.daily.reduce((s, d) => s + d.savings_usd,  0) ?? 0;
  const totalCost     = data?.daily.reduce((s, d) => s + d.cost_usd,     0) ?? 0;
  const totalRequests = data?.daily.reduce((s, d) => s + d.requests,     0) ?? 0;
  const totalCredits  = data?.daily.reduce((s, d) => s + d.credits_used, 0) ?? 0;
  const avgSavingsPct = totalCost + totalSavings > 0
    ? Math.round((totalSavings / (totalCost + totalSavings)) * 100)
    : 0;

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24 selection:bg-blue-500/30">
      <DashboardNav />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 italic">Insights</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mt-1">
              Usage <span className="text-blue-600">Analytics</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2">Your AI cost savings over time.</p>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Loading analytics...</span>
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Saved",    value: `$${totalSavings.toFixed(4)}`,   sub: `${avgSavingsPct}% avg off GPT-4o`, icon: <TrendingUp size={18} />, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { label: "Total Spent",    value: `$${totalCost.toFixed(4)}`,       sub: "actual billed cost",               icon: <DollarSign size={18} />, color: "text-white",       bg: "bg-white/5 border-white/10" },
                { label: "Requests",       value: totalRequests.toLocaleString(),   sub: `last ${range} days`,               icon: <Activity size={18} />,   color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
                { label: "Credits Used",   value: totalCredits.toLocaleString(),    sub: "across all tiers",                 icon: <Cpu size={18} />,        color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
              ].map((card) => (
                <div key={card.label} className={`rounded-[2rem] p-6 border ${card.bg} space-y-3`}>
                  <div className={`${card.color}`}>{card.icon}</div>
                  <div>
                    <p className={`text-2xl font-black italic tracking-tighter ${card.color}`}>{card.value}</p>
                    <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mt-0.5">{card.sub}</p>
                  </div>
                  <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{card.label}</p>
                </div>
              ))}
            </div>

            {/* SAVINGS OVER TIME */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-emerald-400" />
                <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                  Savings Over Time
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data?.daily ?? []} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fill: "#52525b", fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(3)}`} width={56} />
                  <Tooltip content={<ChartTooltip valueFormatter={(v: number) => `$${v.toFixed(5)}`} />} />
                  <Area type="monotone" dataKey="savings_usd" name="Saved"  stroke="#10b981" strokeWidth={2} fill="url(#savingsGrad)" dot={false} />
                  <Area type="monotone" dataKey="cost_usd"    name="Spent"  stroke="#3b82f6" strokeWidth={2} fill="url(#costGrad)"    dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" /> Saved</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" /> Spent</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* REQUESTS PER DAY */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <BarChart2 size={16} className="text-blue-400" />
                  <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">Requests per Day</h2>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data?.daily ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fill: "#52525b", fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                    <Tooltip content={<ChartTooltip valueFormatter={(v: number) => `${v} req`} />} />
                    <Bar dataKey="requests" name="Requests" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* MODEL TIER DISTRIBUTION */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Cpu size={16} className="text-purple-400" />
                  <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">Model Tier Distribution</h2>
                </div>

                {data?.model_distribution?.length ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={data.model_distribution}
                          dataKey="count"
                          nameKey="tier"
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={64}
                          paddingAngle={3}
                          strokeWidth={0}
                        >
                          {data.model_distribution.map((entry) => (
                            <Cell key={entry.tier} fill={TIER_COLORS[entry.tier] ?? "#71717a"} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip valueFormatter={(v: number) => `${v} req`} />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3 flex-1">
                      {data.model_distribution.map((t) => (
                        <div key={t.tier} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full inline-block" style={{ background: TIER_COLORS[t.tier] ?? "#71717a" }} />
                              <span className="text-[9px] font-black uppercase text-white">{t.tier}</span>
                            </div>
                            <span className="text-[9px] font-black text-zinc-400">{t.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: TIER_COLORS[t.tier] ?? "#71717a" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-600 font-black italic uppercase py-8 text-center">No data yet for this period.</p>
                )}
              </div>
            </div>

            {/* TOP MODELS */}
            {(data?.top_models?.length ?? 0) > 0 && (
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-5 backdrop-blur-md">
                <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">
                  Top <span className="text-blue-600">Models Used</span>
                </h2>
                <div className="space-y-3">
                  {data!.top_models.map((m, i) => {
                    const pct = totalRequests > 0 ? Math.round((m.count / totalRequests) * 100) : 0;
                    return (
                      <div key={m.model} className="flex items-center gap-4">
                        <span className="text-[8px] font-black text-zinc-600 w-4">{i + 1}</span>
                        <span className="text-xs font-mono text-zinc-300 w-40 truncate">{m.model}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-black text-zinc-500 w-12 text-right">{m.count} req</span>
                        <span className="text-[9px] font-black text-blue-400 w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NO DATA STATE */}
            {totalRequests === 0 && (
              <div className="text-center py-20 space-y-3">
                <BarChart2 size={48} className="text-zinc-800 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
                  No requests in the last {range} days. Start using the API to see your analytics here.
                </p>
                <Link href="/setup" className="inline-block mt-2 text-blue-500 text-xs font-black underline">
                  View integration guide →
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
