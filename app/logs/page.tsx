"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Loader2, Zap, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

const API_BASE = "https://web-production-4f439.up.railway.app";

const TIER_COLORS: Record<string, string> = {
  budget:  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium:  "text-blue-400 bg-blue-500/10 border-blue-500/20",
  premium: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const TIER_LABELS: Record<string, string> = {
  budget: "Budget", medium: "Medium", premium: "Premium",
};

function fmt(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function LogsPage() {
  const { user, isLoaded } = useUser();
  const [apiKey, setApiKey]     = useState<string | null>(null);
  const [logs, setLogs]         = useState<any[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(0);
  const [tierFilter, setTierFilter] = useState("");
  const LIMIT = 25;

  // Load API key from Supabase
  useEffect(() => {
    if (!isLoaded || !user) return;
    import('@/lib/supabase').then(({ createAuthClient }) => {
      import('@clerk/nextjs').then(async ({ useAuth }) => {
        // fallback: fetch key via backend
        fetch(`${API_BASE}/v1/account/keys/${user.id}`)
          .then(r => r.json())
          .then(data => {
            const key = Array.isArray(data) ? data[0]?.key : data?.key;
            if (key) setApiKey(key);
          })
          .catch(() => {});
      });
    });
  }, [isLoaded, user]);

  const loadLogs = useCallback(async () => {
    if (!user || !apiKey) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(LIMIT),
        offset: String(page * LIMIT),
        ...(tierFilter ? { tier: tierFilter } : {}),
      });
      const res = await fetch(
        `${API_BASE}/v1/account/logs/${user.id}?${params}`,
        { headers: { "X-API-KEY": apiKey } }
      );
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [user, apiKey, page, tierFilter]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  // Reset page when filter changes
  useEffect(() => { setPage(0); }, [tierFilter]);

  if (!isLoaded) return null;

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 pb-24">

      {/* Nav */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <Zap size={18} className="text-blue-500 fill-blue-500" />
            <span className="text-lg font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Dashboard</Link>
          <Link href="/analytics" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Analytics</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-12">

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Request History</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Request <span className="text-blue-600">Logs</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              {total > 0 ? `${total.toLocaleString()} total requests` : "No requests yet"}
            </p>
          </div>

          {/* Tier filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-zinc-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Filter:</span>
            {["", "budget", "medium", "premium"].map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  tierFilter === t
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                }`}
              >
                {t || "All"}
              </button>
            ))}
            {tierFilter && (
              <button onClick={() => setTierFilter("")} className="text-zinc-600 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No requests found</p>
              <p className="text-zinc-700 text-xs mt-2">Make your first API call to see logs here</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <span className="col-span-2">Time</span>
                <span>Model</span>
                <span>Tier</span>
                <span>Cost</span>
                <span>Credits</span>
              </div>

              {/* Rows */}
              {logs.map((log, i) => (
                <div
                  key={log.id || i}
                  className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="col-span-2 text-[11px] text-zinc-400 font-mono">
                    {fmt(log.created_at)}
                  </span>
                  <span className="text-[11px] text-zinc-300 font-bold truncate" title={log.model_used}>
                    {log.model_used || "—"}
                  </span>
                  <span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${TIER_COLORS[log.credit_tier] || "text-zinc-500 bg-zinc-800 border-zinc-700"}`}>
                      {TIER_LABELS[log.credit_tier] || log.credit_tier || "—"}
                    </span>
                  </span>
                  <div>
                    <p className="text-[11px] text-white font-bold">${(log.cost_usd || 0).toFixed(6)}</p>
                    {log.savings_usd > 0 && (
                      <p className="text-[9px] text-emerald-500 font-bold">
                        saved ${log.savings_usd.toFixed(6)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-300 font-bold">{log.credits_used || 1}</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">cr</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-xl border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-xl border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
