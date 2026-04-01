"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Activity, Cpu, Sliders, TrendingUp, Home, Loader2, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser, UserButton } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [chartData, setChartData] = useState([]);
  const [routingMode, setRoutingMode] = useState('Balanced');
  const [decisions, setDecisions] = useState([]); 
  const [stats, setStats] = useState({ 
    savings: 0, 
    requests: 0, 
    quality: null, 
    risk: 0, 
    global_confidence: 0,
    validated_samples: 0,
    opt_opportunity_usd: 0,
    recommended_threshold: 5
  });
  const [simulation, setSimulation] = useState({ qImp: "0.0%", sImp: "0.0%", label: "System Nominal", loading: false });
  const [loading, setLoading] = useState(true);

  // Helper para color de confianza
  const getGlobalConfidenceLevel = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  // 1. Simulación (Predictive Analysis)
  const runSimulation = async (targetMode: string) => {
    setSimulation(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`https://neuralrouting.io/v1/simulate`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-API-KEY': 'nr-dev-secret-123' // Reemplazar por tu lógica de keys
        },
        body: JSON.stringify({ userId: user?.id, mode: targetMode })
      });
      const data = await response.json();
      setSimulation({
        qImp: data.quality_impact || "+0.0%",
        sImp: data.savings_impact || "+0.0%",
        label: targetMode === 'Conservative' ? 'Risk Mitigation' : 'Profit Max',
        loading: false
      });
    } catch (e) { 
      console.error("Simulation failed", e);
      setSimulation(prev => ({ ...prev, loading: false }));
    }
  };

  // 2. Actualización de Política (Persistent Update)
  const updateRoutingPolicy = async (mode: string) => {
    setRoutingMode(mode);
    try {
      await fetch(`https://neuralrouting.io/v1/update-policy`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-API-KEY': 'nr-dev-secret-123'
        },
        body: JSON.stringify({ userId: user?.id, mode })
      });
      runSimulation(mode);
    } catch (e) { console.error("Policy Sync Error", e); }
  };

  // 3. Carga de datos reales desde main.py
  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoaded || !user?.id) return;
      try {
        const response = await fetch(`https://neuralrouting.io/v1/user-stats/${user.id}`, {
            headers: { 'X-API-KEY': 'nr-dev-secret-123' }
        });
        const data = await response.json();
        
        if (data && !data.error) {
          // Mapeo directo de los campos de tu backend
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_analyzed || 0),
            quality: data.quality_index || null,
            global_confidence: data.global_confidence || 0,
            risk: data.at_risk_percent || 0,
            validated_samples: data.validated_samples || 0,
            opt_opportunity_usd: data.optimization_opportunity_usd || 0,
            recommended_threshold: data.recommended_threshold_increase || 5
          });
          
          setDecisions(data.recent_decisions || []);
          
          // Historial para el gráfico (Savings + Quality)
          if (data.history) {
            setChartData(data.history.map((item: any) => ({ 
              name: item.name, 
              savings: Number(item.savings || 0),
              quality: Number(item.quality || 0)
            })));
          }
        }
      } catch (e) { 
        console.error("Dashboard Load Error:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    loadDashboardData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
              <Zap size={20} className="text-blue-500 fill-blue-500/20" />
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"><Home size={14} /> Home</Link>
            <Link href="/chat" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"><Zap size={14} /> Open Chat</Link>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-zinc-800">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Total Savings</p>
            <h2 className="text-4xl font-black italic text-white">${stats.savings.toFixed(3)}</h2>
          </div>
          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-zinc-800">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Quality Index</p>
            <h2 className="text-4xl font-black italic text-white">{stats.quality ? Number(stats.quality).toFixed(2) : 'N/A'}</h2>
          </div>
          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-zinc-800">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">System Confidence</p>
              <Globe size={10} className="text-blue-500" />
            </div>
            <h2 className={`text-4xl font-black italic ${getGlobalConfidenceLevel(stats.global_confidence)}`}>{stats.global_confidence}%</h2>
          </div>
          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-red-500/10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/70 mb-1">Risk Factor</p>
            <h2 className="text-4xl font-black italic text-white">{stats.risk.toFixed(1)}%</h2>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 flex flex-col h-[400px] shadow-2xl mb-12">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl flex items-center gap-3">
              <TrendingUp size={20} className="text-blue-500" /> Performance Analysis
            </h4>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-blue-500"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Savings</div>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Quality</div>
            </div>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '15px' }} />
                <Area type="monotone" dataKey="savings" stroke="#3b82f6" fill="url(#colorSavings)" strokeWidth={3} />
                <Area type="monotone" dataKey="quality" stroke="#10b981" fill="url(#colorQuality)" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* SIMULATOR */}
          <div className="lg:col-span-5 p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/20 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-2">Next-Gen Simulator</h4>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-10 italic">Backend Target: {simulation.label}</p>
              <div className="p-6 bg-black/60 rounded-[2rem] border border-white/5 backdrop-blur-md">
                  {simulation.loading ? (
                    <div className="flex items-center justify-center py-4"><Loader2 className="animate-spin text-blue-500" /></div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">Quality Impact</p>
                        <h5 className={`text-4xl font-black italic leading-none ${simulation.qImp.startsWith('+') ? 'text-white' : 'text-red-400'}`}>{simulation.qImp}</h5>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Savings Impact</p>
                        <h5 className="text-4xl font-black italic text-white leading-none">{simulation.sImp}</h5>
                      </div>
                    </div>
                  )}
              </div>
              <button 
                onClick={() => runSimulation(routingMode)}
                className="w-full mt-6 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-lg"
              >
                Run Predictive Analysis
              </button>
            </div>
          </div>

          {/* LOGS */}
          <div className="lg:col-span-7 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 shadow-2xl overflow-hidden">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-8 flex items-center gap-3">
              <Cpu size={20} className="text-blue-500" /> Decision Engine Logs
            </h4>
            <div className="space-y-4">
              {decisions.length > 0 ? decisions.map((dec: any, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                  <div className="flex gap-4">
                    <div className={`w-1 h-10 rounded-full ${dec.model_used?.includes('Premium') ? 'bg-blue-500' : 'bg-zinc-700'}`} />
                    <div>
                      <p className="text-[10px] text-white font-black uppercase italic leading-none">{dec.model_used || "Node"}</p>
                      <p className="text-[11px] text-zinc-500 font-bold mt-1.5 line-clamp-1">{dec.prompt_preview || "Request processed"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-emerald-500 italic">Saved: ${dec.cost_saved?.toFixed(4) || '0.000'}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-zinc-600 text-xs italic uppercase font-black">No recent activity found</div>
              )}
            </div>
          </div>
        </div>

        {/* POLICY CONTROL */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-zinc-900/10 border border-zinc-800 p-8 rounded-[2.5rem]">
          <h3 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2 text-sm">
            <Sliders size={18} className="text-blue-500" /> Infrastructure Policy: <span className="text-blue-400">{routingMode}</span>
          </h3>
          <div className="flex bg-black/50 p-1.5 rounded-2xl border border-zinc-800">
            {['Conservative', 'Balanced', 'Aggressive'].map((mode) => (
              <button 
                key={mode} 
                onClick={() => updateRoutingPolicy(mode)} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${routingMode === mode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
