"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Loader2, Users, DollarSign, TrendingDown } from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';

import { API_BASE } from '@/lib/config';

const DAYS_OPTIONS = [7, 14, 30, 60, 90];

function fmt(n: number, decimals = 4) {
  return n.toFixed(decimals);
}

export default function AttributionPage() {
  const { user, isLoaded } = useUser();
  const [apiKey, setApiKey]           = useState<string | null>(null);
  const [attribution, setAttribution] = useState<any[]>([]);
  const [totalEndUsers, setTotalEndUsers] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [days, setDays]               = useState(30);

  // Load API key
  useEffect(() => {
    if (!isLoaded || !user) return;
    fetch(`${API_BASE}/v1/account/keys/${user.id}`)
      .then(r => r.json())
      .then(data => {
        const key = Array.isArray(data) ? data[0]?.key : data?.key;
        if (key) setApiKey(key);
      })
      .catch(() => {});
  }, [isLoaded, user]);

  const load = useCallback(async () => {
    if (!user || !apiKey) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/v1/account/attribution/${user.id}?days=${days}`,
        { headers: { "X-API-KEY": apiKey } }
      );
      if (res.ok) {
        const data = await res.json();
        setAttribution(data.attribution || []);
        setTotalEndUsers(data.total_end_users || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [user, apiKey, days]);

  useEffect(() => { load(); }, [load]);

  if (!isLoaded) return null;

  const tagged    = attribution.filter(r => r.end_user_id !== "__untagged__");
  const untagged  = attribution.find(r => r.end_user_id === "__untagged__");
  const totalCost = attribution.reduce((s, r) => s + r.cost_usd, 0);
  const totalSaved = attribution.reduce((s, r) => s + r.savings_usd, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 pb-24">

      <DashboardNav />

      <div className="max-w-6xl mx-auto px-6 pt-12">

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Cost Breakdown</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              User <span className="text-blue-600">Attribution</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              {totalEndUsers > 0
                ? `${totalEndUsers} tagged end-user${totalEndUsers !== 1 ? 's' : ''}`
                : "Tag requests with the 'user' field to see breakdown"}
            </p>
          </div>

          {/* Days selector */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Period:</span>
            {DAYS_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  days === d
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">End Users</span>
            </div>
            <p className="text-3xl font-black text-white">{totalEndUsers}</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase">tagged in period</p>
          </div>
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={14} className="text-red-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Total Cost</span>
            </div>
            <p className="text-3xl font-black text-white">${fmt(totalCost, 4)}</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase">last {days} days</p>
          </div>
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={14} className="text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Savings</span>
            </div>
            <p className="text-3xl font-black text-emerald-400">${fmt(totalSaved, 4)}</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase">vs GPT-4o</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : attribution.length === 0 ? (
            <div className="text-center py-24 px-8">
              <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest mb-4">No attribution data yet</p>
              <p className="text-zinc-700 text-xs max-w-md mx-auto leading-relaxed">
                Tag your requests by passing a <code className="text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded text-[11px]">user</code> field in your API calls:
              </p>
              <pre className="mt-4 text-left mx-auto max-w-sm bg-zinc-900 border border-white/5 rounded-xl p-4 text-[11px] text-zinc-400 font-mono">
{`{
  "messages": [...],
  "user": "your-end-user-id"
}`}
              </pre>
            </div>
          ) : (
            <>
              {/* Table header — hidden on mobile */}
              <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <span className="col-span-2">End User ID</span>
                <span>Requests</span>
                <span>Cost</span>
                <span>Savings</span>
              </div>

              {/* Tagged rows */}
              {tagged.map((row, i) => (
                <div
                  key={row.end_user_id || i}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors px-6 py-4"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden space-y-2">
                    <p className="text-[11px] text-zinc-300 font-mono truncate" title={row.end_user_id}>{row.end_user_id}</p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-bold">{row.requests.toLocaleString()} req · {row.credits_used.toLocaleString()} cr</span>
                      <div className="text-right">
                        <p className="text-white font-bold">${fmt(row.cost_usd, 6)}</p>
                        <p className="text-emerald-500 font-bold">${fmt(row.savings_usd, 6)} saved</p>
                      </div>
                    </div>
                  </div>
                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-5 gap-4 items-center">
                    <span className="col-span-2 text-[11px] text-zinc-300 font-mono truncate" title={row.end_user_id}>{row.end_user_id}</span>
                    <span className="text-[11px] text-zinc-400 font-bold">{row.requests.toLocaleString()}</span>
                    <div>
                      <p className="text-[11px] text-white font-bold">${fmt(row.cost_usd, 6)}</p>
                      <p className="text-[9px] text-zinc-600 font-bold">{row.credits_used.toLocaleString()} cr</p>
                    </div>
                    <p className="text-[11px] text-emerald-500 font-bold">${fmt(row.savings_usd, 6)}</p>
                  </div>
                </div>
              ))}

              {/* Untagged row */}
              {untagged && (
                <div className="border-b border-white/5 hover:bg-white/[0.02] transition-colors px-6 py-4 opacity-50">
                  {/* Mobile layout */}
                  <div className="sm:hidden space-y-2">
                    <p className="text-[11px] text-zinc-500 font-mono italic">untagged requests</p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-bold">{untagged.requests.toLocaleString()} req</span>
                      <div className="text-right">
                        <p className="text-zinc-400 font-bold">${fmt(untagged.cost_usd, 6)}</p>
                        <p className="text-zinc-500 font-bold">${fmt(untagged.savings_usd, 6)} saved</p>
                      </div>
                    </div>
                  </div>
                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-5 gap-4 items-center">
                    <span className="col-span-2 text-[11px] text-zinc-500 font-mono italic">untagged requests</span>
                    <span className="text-[11px] text-zinc-500 font-bold">{untagged.requests.toLocaleString()}</span>
                    <p className="text-[11px] text-zinc-400 font-bold">${fmt(untagged.cost_usd, 6)}</p>
                    <p className="text-[11px] text-zinc-500 font-bold">${fmt(untagged.savings_usd, 6)}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Docs tip */}
        {attribution.length > 0 && (
          <p className="mt-6 text-[10px] text-zinc-600 text-center">
            Pass <code className="text-blue-400">"user": "id"</code> in your request body to tag end-users.{" "}
            <Link href="/docs" className="text-blue-500 hover:text-blue-400 transition-colors">See docs →</Link>
          </p>
        )}
      </div>
    </div>
  );
}
