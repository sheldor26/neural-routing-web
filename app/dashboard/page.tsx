"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { Zap, TrendingUp, ShieldCheck, Key } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* --- DASHBOARD NAV --- */}
      <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter">
            NEURAL<span className="text-blue-600">DASH</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 font-medium hidden md:block">
              Welcome, {user?.firstName}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        {/* --- HEADER --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Overview</h1>
          <p className="text-zinc-500 mt-1">Real-time savings and infrastructure performance.</p>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Savings" 
            value="$1,284.45" 
            sub="Avg. 84% reduction" 
            icon={<TrendingUp className="text-green-500" />} 
          />
          <StatCard 
            title="Routed Tokens" 
            value="45.2M" 
            sub="Economy Tier priority" 
            icon={<Zap className="text-blue-500" />} 
          />
          <StatCard 
            title="Active Keys" 
            value="3 / 10" 
            sub="Pro Plan Limit" 
            icon={<Key className="text-purple-500" />} 
          />
        </div>

        {/* --- API KEY SECTION --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-blue-500" size={24} /> 
                Production API Key
              </h2>
              <p className="text-zinc-500 text-sm mt-1 italic">Use this key to authenticate your requests from your backend.</p>
            </div>
            <div className="w-full md:w-auto flex bg-black border border-zinc-700 rounded-xl p-2 pl-4 items-center justify-between gap-4">
              <code className="text-blue-400 font-mono text-sm tracking-widest">nr_prod_••••••••••••x7z9</code>
              <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-xs font-bold transition">
                Copy
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- STAT CARD HELPER ---
function StatCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl hover:border-blue-500/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-black rounded-xl border border-zinc-800">{icon}</div>
      </div>
      <h3 className="text-zinc-500 text-sm font-medium">{title}</h3>
      <div className="text-3xl font-black mt-1">{value}</div>
      <div className="text-xs text-zinc-600 mt-2 font-medium uppercase tracking-wider">{sub}</div>
    </div>
  );
}