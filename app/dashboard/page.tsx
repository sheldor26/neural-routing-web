"use client";
import { useEffect, useState } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { TrendingUp, Loader2, Copy, ShieldCheck, Globe, Activity, Zap, Server, Database } from 'lucide-react'; 
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const { user } = useUser();
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavings() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('routing_logs')
        .select('cost_saved')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching savings:", error);
      } else {
        const total = data.reduce((acc, curr) => acc + (curr.cost_saved || 0), 0);
        setTotalSaved(total);
      }
      setLoading(false);
    }

    fetchSavings();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter italic uppercase">
            NEURAL<span className="text-blue-600">DASH</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Enterprise Overview</h1>
            <p className="text-zinc-500 mt-1 italic font-medium">Welcome back, {user?.firstName}. Your neural engine is active.</p>
          </div>
          <div className="px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
            System Live: Virasoro Node
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Total Savings */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl group-hover:bg-green-500/10 transition-all"></div>
            <div className="p-3 bg-black w-fit rounded-2xl border border-zinc-800 mb-6 shadow-inner">
               <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest italic">Total Savings</h3>
            <div className="text-5xl font-black mt-2 text-green-400 tracking-tighter">
              {loading ? (
                <Loader2 className="animate-spin text-zinc-700" size={32} />
              ) : (
                `$${totalSaved.toFixed(2)}`
              )}
            </div>
          </div>

          {/* Card: API Developer Access */}
          <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-blue-500" size={16} />
                  <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Secure Access</h3>
                </div>
                <p className="text-white text-xl font-bold italic uppercase tracking-tighter">Production API Key</p>
              </div>
              
              <div className="w-full md:w-auto flex items-center gap-3 bg-black border border-zinc-800 p-2 rounded-2xl shadow-inner group-hover:border-blue-500/30 transition-all">
                <code className="px-4 py-2 font-mono text-xs text-blue-400 truncate max-w-[180px] md:max-w-none">
                  nr_live_••••••••••••3a9c
                </code>
                <button 
                  onClick={() => alert('Key copied to clipboard!')}
                  className="bg-zinc-800 hover:bg-blue-600 p-3 rounded-xl transition-all active:scale-90 group/btn"
                >
                  <Copy className="text-zinc-400 group-hover/btn:text-white" size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-zinc-800/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Activity size={12} />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Rate Limit</p>
                </div>
                <p className="text-white font-mono text-lg font-black">60 req/m</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Globe size={12} />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Edge Status</p>
                </div>
                <p className="text-green-500 font-mono text-lg font-black italic">GLOBAL</p>
              </div>
              <div className="space-y-1 hidden md:block">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Zap size={12} />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Current Tier</p>
                </div>
                <p className="text-blue-400 font-mono text-lg font-black italic uppercase">Pro</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Infrastructure Section */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Infrastructure Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Groq Node */}
            <div className="flex justify-between items-center p-5 bg-black/40 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-all">
                  <Server className="text-orange-500" size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-tight">Groq Llama 3.1</p>
                  <p className="text-zinc-600 text-[10px] font-medium italic">Economy Engine</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-500 text-[10px] font-black uppercase tracking-tighter">Operational</p>
                <p className="text-zinc-500 font-mono text-[10px] mt-0.5">120ms</p>
              </div>
            </div>

            {/* OpenAI Node */}
            <div className="flex justify-between items-center p-5 bg-black/40 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-all">
                  <Zap className="text-blue-500" size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-tight">OpenAI GPT-4o</p>
                  <p className="text-zinc-600 text-[10px] font-medium italic">Premium Engine</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-500 text-[10px] font-black uppercase tracking-tighter">Operational</p>
                <p className="text-zinc-500 font-mono text-[10px] mt-0.5">450ms</p>
              </div>
            </div>

            {/* Supabase Node */}
            <div className="flex justify-between items-center p-5 bg-black/40 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-all">
                  <Database className="text-emerald-500" size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-tight">Supabase Cloud</p>
                  <p className="text-zinc-600 text-[10px] font-medium italic">Routing Logs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-500 text-[10px] font-black uppercase tracking-tighter">Operational</p>
                <p className="text-zinc-500 font-mono text-[10px] mt-0.5">25ms</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
