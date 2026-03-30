"use client";
import { useEffect, useState } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { TrendingUp, Loader2 } from 'lucide-react'; // Quitamos Zap y Key
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
          <div className="text-xl font-black tracking-tighter italic">
            NEURAL<span className="text-blue-600">DASH</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Overview</h1>
          <p className="text-zinc-500 mt-1 italic">Welcome back, {user?.firstName}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card de Ahorros Totales */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl">
            <div className="p-2 bg-black w-fit rounded-xl border border-zinc-800 mb-4">
               <TrendingUp className="text-green-500" />
            </div>
            <h3 className="text-zinc-500 text-sm font-medium italic">Total Savings</h3>
            <div className="text-4xl font-black mt-1 text-green-400">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                `$${totalSaved.toFixed(2)}`
              )}
            </div>
          </div>

          {/* Puedes agregar más cards aquí luego */}
        </div>
      </main>
    </div>
  );
}
