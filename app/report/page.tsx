"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2, Printer, TrendingDown, Zap, DollarSign, Activity } from 'lucide-react';

const API_BASE = "https://web-production-4f439.up.railway.app";

function fmt(n: number, d = 4) { return n.toFixed(d); }

export default function ReportPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats]         = useState<any>(null);
  const [logs, setLogs]           = useState<any[]>([]);
  const [attribution, setAttribution] = useState<any[]>([]);
  const [apiKey, setApiKey]       = useState<string>("");
  const [loading, setLoading]     = useState(true);

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    if (!isLoaded || !user) return;

    const load = async () => {
      try {
        // 1. Get API key
        const keyRes = await fetch(`${API_BASE}/v1/account/keys/${user.id}`);
        const keyData = await keyRes.json();
        const key = Array.isArray(keyData) ? keyData[0]?.key : keyData?.key;
        if (!key) { setLoading(false); return; }
        setApiKey(key);

        const headers = { "X-API-KEY": key };

        // 2. Parallel fetch
        const [statsRes, logsRes, attrRes] = await Promise.all([
          fetch(`${API_BASE}/v1/user-stats/${user.id}`, { headers }),
          fetch(`${API_BASE}/v1/account/logs/${user.id}?days=30`, { headers }),
          fetch(`${API_BASE}/v1/account/attribution/${user.id}?days=30`, { headers }),
        ]);

        const [statsData, logsData, attrData] = await Promise.all([
          statsRes.json(),
          logsRes.json(),
          attrRes.json(),
        ]);

        setStats(statsData);
        setLogs((logsData.logs || logsData || []).slice(0, 20));
        setAttribution((attrData.attribution || []).filter((r: any) => r.end_user_id !== "__untagged__").slice(0, 10));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-bold">Sign in to view your report.</p>
        <a href="/sign-in" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all">Sign In</a>
      </div>
    );
  }

  const plan      = stats?.plan || "Free Tier";
  const credits   = stats?.credits ?? 0;
  const totalSavings = parseFloat(stats?.total_savings || 0);
  const reqCount  = stats?.requests_count ?? 0;

  // Compute 30-day cost from logs
  const totalCost = logs.reduce((s: number, r: any) => s + parseFloat(r.cost_usd || 0), 0);
  const totalRef  = logs.reduce((s: number, r: any) => s + parseFloat(r.gpt4_reference_cost || r.reference_cost || 0), 0);
  const savingsPct = totalRef > 0 ? ((totalRef - totalCost) / totalRef) * 100 : 0;

  // Model breakdown
  const modelMap: Record<string, { count: number; cost: number }> = {};
  logs.forEach((r: any) => {
    const m = r.model_used || "unknown";
    if (!modelMap[m]) modelMap[m] = { count: 0, cost: 0 };
    modelMap[m].count++;
    modelMap[m].cost += parseFloat(r.cost_usd || 0);
  });
  const models = Object.entries(modelMap).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">

      {/* Print button — hidden when printing */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg"
        >
          <Printer size={16} /> Save as PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-10 py-14">

        {/* Header */}
        <div className="flex justify-between items-start mb-12 pb-6 border-b border-gray-200">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">AI Cost Report</p>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">{monthName}</h1>
            <p className="text-gray-400 text-sm mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black tracking-tighter text-gray-900">NEURAL<span className="text-blue-600">ROUTING</span></p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Plan: {plan}</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Spend", value: `$${fmt(totalCost, 4)}`, sub: "last 30 days", color: "border-red-200 bg-red-50" },
            { label: "GPT-4 Equivalent", value: `$${fmt(totalRef, 4)}`, sub: "benchmark cost", color: "border-gray-200 bg-gray-50" },
            { label: "Total Saved", value: `$${fmt(Math.max(0, totalRef - totalCost), 4)}`, sub: `${fmt(savingsPct, 1)}% reduction`, color: "border-emerald-200 bg-emerald-50" },
            { label: "Requests", value: reqCount.toLocaleString(), sub: "lifetime total", color: "border-blue-200 bg-blue-50" },
          ].map((c) => (
            <div key={c.label} className={`p-5 rounded-2xl border ${c.color}`}>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">{c.label}</p>
              <p className="text-2xl font-black text-gray-900">{c.value}</p>
              <p className="text-[10px] text-gray-400 mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Savings highlight */}
        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-200 mb-2">ROI Summary</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-black">${fmt(Math.max(0, totalRef - totalCost), 2)}</p>
              <p className="text-blue-200 text-sm mt-1">saved vs sending everything to GPT-4o</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">{fmt(savingsPct, 1)}%</p>
              <p className="text-blue-200 text-sm mt-1">cost reduction</p>
            </div>
          </div>
        </div>

        {/* Model breakdown */}
        {models.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Model Distribution (last 30 days)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Model</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Requests</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Cost</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Share</th>
                </tr>
              </thead>
              <tbody>
                {models.map(([model, d]) => (
                  <tr key={model} className="border-b border-gray-100">
                    <td className="py-2.5 font-mono text-xs text-gray-700">{model}</td>
                    <td className="py-2.5 text-right text-gray-600">{d.count}</td>
                    <td className="py-2.5 text-right text-gray-600">${fmt(d.cost, 6)}</td>
                    <td className="py-2.5 text-right text-gray-500">{logs.length > 0 ? fmt((d.count / logs.length) * 100, 1) : "0"}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User attribution */}
        {attribution.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Top End Users by Cost</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">User ID</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Requests</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Cost</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Saved</th>
                </tr>
              </thead>
              <tbody>
                {attribution.map((r: any) => (
                  <tr key={r.end_user_id} className="border-b border-gray-100">
                    <td className="py-2.5 font-mono text-xs text-gray-700 truncate max-w-[200px]">{r.end_user_id}</td>
                    <td className="py-2.5 text-right text-gray-600">{r.requests}</td>
                    <td className="py-2.5 text-right text-gray-600">${fmt(r.cost_usd, 6)}</td>
                    <td className="py-2.5 text-right text-emerald-600">${fmt(r.savings_usd, 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent requests */}
        {logs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Recent Requests (last 20)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                  <th className="text-left py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Model</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Cost</th>
                  <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Saved %</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((r: any, i: number) => {
                  const cost = parseFloat(r.cost_usd || 0);
                  const ref  = parseFloat(r.gpt4_reference_cost || r.reference_cost || 0);
                  const pct  = ref > 0 ? ((ref - cost) / ref * 100) : 0;
                  return (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
                      <td className="py-2 font-mono text-xs text-gray-700">{r.model_used || "—"}</td>
                      <td className="py-2 text-right text-gray-600">${fmt(cost, 6)}</td>
                      <td className="py-2 text-right text-emerald-600">{fmt(Math.max(0, pct), 1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
          <span>Generated by NeuralRouting.io · {new Date().toLocaleDateString()}</span>
          <span>neuralrouting.io</span>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}
