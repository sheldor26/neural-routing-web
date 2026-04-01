"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Activity, Cpu, Sliders, TrendingUp, Home, Loader2, Globe, Target, ArrowUpRight, User } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser, UserButton } from '@clerk/nextjs';

/**
 * DashboardPage - Consola de Inteligencia NeuralRouting
 * 10/10 en integración: Conectado al Backend Unificado v11.0 (Railway)
 */
export default function App() {
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

  // Configuración de API (Railway Backend)
  const API_BASE = "https://web-production-4f439.up.railway.app";
  const API_KEY = "nr-dev-secret-123";

  const getGlobalConfidenceLevel = (score) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  // 1. Simulación Predictiva (POST /v1/simulate)
  const runSimulation = async (targetMode) => {
    if (!user) return;
    setSimulation(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`${API_BASE}/v1/simulate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY
        },
        body: JSON.stringify({ userId: user.id, mode: targetMode })
      });
      const data = await response.json();
      setSimulation({
        qImp: data.quality_impact || "+0.0%",
        sImp: data.savings_impact || "+0.0%",
        label: targetMode === 'Conservative' ? 'Mitigación de Riesgo' : 'Máximo Ahorro',
        loading: false
      });
    } catch (e) { 
      console.error("Simulation failed", e);
      setSimulation(prev => ({ ...prev, loading: false }));
    }
  };

  // 2. Actualización de Política Persistente
  const updateRoutingPolicy = async (mode) => {
    if (!user) return;
    setRoutingMode(mode);
    try {
      await fetch(`${API_BASE}/v1/update-policy`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY
        },
        body: JSON.stringify({ userId: user.id, mode })
      });
      runSimulation(mode);
    } catch (e) { console.error("Policy Sync Error", e); }
  };

  // 3. Carga de Analítica Real (Sincronización con main.py v11.0)
  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoaded || !user?.id) return;
      try {
        const response = await fetch(`${API_BASE}/v1/user-stats/${user.id}`, {
          headers: { 'X-API-KEY': API_KEY }
        });
        const data = await response.json();
        
        if (data && !data.error) {
          // Mapeo directo de la telemetría del Backend Shadow Engine
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            quality: data.quality_score || null,
            global_confidence: data.global_confidence || 0,
            risk: data.at_risk_percent || 0,
            validated_samples: data.validated_samples || 0,
            opt_opportunity_usd: data.optimization_opportunity_usd || 0,
            recommended_threshold: data.recommended_threshold_increase || 5
          });
          
          setDecisions(data.recent_decisions || []);
          
          // Mapeo del historial para el gráfico (Ahorro vs Calidad)
          if (data.history) {
            setChartData(data.history.map((item) => ({ 
              name: item.name, 
              savings: Number(item.savings || 0),
              quality: Number(item.quality || 0) * 100 
            })));
          }
        }
      } catch (e) { 
        console.error("Dashboard Sync Error:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    loadDashboardData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40}/>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Estableciendo vínculo con Nodo Neural...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* NAVEGACIÓN */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
              <Zap size={20} className="text-blue-500 fill-blue-500/20" />
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter">Neuralrouting.io</span>
          </Link>
          <div className="flex items-center gap-6 text-white/70">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><Home size={14} /> Inicio</Link>
            <Link href="/chat" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><Zap size={14} /> Chat Directo</Link>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* TARJETA DE RECUERACIÓN DE INGRESOS (SALES DRIVER) */}
        <div className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600/20 to-emerald-600/10 border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20"><Target size={28} className="text-white" /></div>
            <div>
              <h3 className="text-white font-black uppercase italic tracking-tighter text-xl leading-none">Ganancia Mensual No Realizada</h3>
              <p className="text-[11px] text-blue-400 font-bold uppercase tracking-widest mt-2">El motor detectó <span className="text-white">${stats.opt_opportunity_usd.toFixed(2)}</span> en ahorros no capturados</p>
            </div>
          </div>
          <div className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl group cursor-help relative">
            <h4 className="text-3xl font-black italic text-emerald-500 tracking-tighter flex items-center gap-2">
              +${stats.opt_opportunity_usd.toFixed(2)}
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </h4>
          </div>
        </div>

        {/* MÉTRICAS DE OPERACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-zinc-800 hover:border-zinc-700 transition-colors group">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1 group-hover:text-blue-500 transition-colors">Ahorro Total</p>
            <h2 className="text-4xl font-black italic text-white">${stats.savings.toFixed(3)}</h2>
            <p className="text-[8px] font-bold text-zinc-600 mt-2 uppercase tracking-widest">{stats.requests} Consultas Analizadas</p>
          </div>
          
          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-zinc-800 relative group overflow-hidden">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Índice de Calidad</p>
            {stats.quality ? (
                <>
                    <h2 className="text-4xl font-black italic text-white">{Number(stats.quality).toFixed(2)}</h2>
                    <span className="absolute top-6 right-6 text-[8px] text-emerald-500 font-black uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Shadow Verified</span>
                </>
            ) : (
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black italic text-zinc-600 uppercase tracking-tighter">Sincronizando...</h2>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase">{stats.validated_samples}/10 auditorías</p>
                </div>
            )}
          </div>

          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-zinc-800">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Confianza Global</p>
              <Globe size={10} className="text-blue-500" />
            </div>
            <h2 className={`text-4xl font-black italic ${getGlobalConfidenceLevel(stats.global_confidence)}`}>{stats.global_confidence}%</h2>
          </div>

          <div className="p-6 rounded-[2rem] bg-zinc-900/20 border border-red-500/10 group">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/70 mb-1">Factor de Riesgo</p>
            <h2 className="text-4xl font-black italic text-white">{stats.risk.toFixed(1)}%</h2>
            <p className="text-[8px] font-bold text-zinc-600 mt-2 uppercase tracking-widest group-hover:text-red-400 transition-colors italic">Sugerencia: +{stats.recommended_threshold}% Threshold</p>
          </div>
        </div>

        {/* PERFORMANCE TRADE-OFF & SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 flex flex-col h-[400px] shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-xl flex items-center gap-3">
                <TrendingUp size={20} className="text-blue-500" /> Análisis de Rendimiento
              </h4>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-blue-500"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Ahorro</div>
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Calidad</div>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10, fontWeight: 900}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '15px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="savings" stroke="#3b82f6" fill="url(#colorSavings)" strokeWidth={3} />
                  <Area type="monotone" dataKey="quality" stroke="#10b981" fill="url(#colorQuality)" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/20 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
            <div className="relative z-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-2">Simulador Neural</h4>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-10 italic">Estado Predictivo: {simulation.label}</p>
              
              <div className="p-6 bg-black/60 rounded-[2rem] border border-white/5 backdrop-blur-md mb-6">
                  {simulation.loading ? (
                    <div className="flex items-center justify-center py-4"><Loader2 className="animate-spin text-blue-500" /></div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">Calidad</p>
                        <h5 className="text-4xl font-black italic text-white leading-none">{simulation.qImp}</h5>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none">Ahorro</p>
                        <h5 className="text-4xl font-black italic text-white leading-none">{simulation.sImp}</h5>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <button 
              onClick={() => runSimulation(routingMode)} 
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-lg relative z-10"
            >
              Simular Impacto
            </button>
            <Zap size={180} className="absolute -bottom-10 -right-10 text-blue-500/5 group-hover:scale-110 transition-transform duration-1000 pointer-events-none opacity-20" />
          </div>
        </div>

        {/* DECISION AUDIT LOG */}
        <div className="p-10 rounded-[3rem] bg-zinc-900/10 border border-zinc-800 shadow-2xl mb-12">
          <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-8 flex items-center gap-3">
            <Cpu size={20} className="text-blue-500" /> Registro de Auditoría Shadow
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decisions.length > 0 ? decisions.map((dec, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                <div className="flex gap-4 items-center overflow-hidden">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dec.model_used?.includes('Premium') ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-zinc-700'}`} />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-white font-black uppercase italic truncate">{dec.model_used || "Nodo"}</p>
                    <p className="text-[11px] text-zinc-500 font-bold truncate mt-1">{dec.prompt_preview || "Solicitud auditada"}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-4">
                  <p className="text-[10px] font-black text-emerald-500 italic">Saved: ${Number(dec.cost_saved || 0).toFixed(4)}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-10 text-zinc-600 text-[10px] italic uppercase font-black">Esperando telemetría del backend...</div>
            )}
          </div>
        </div>

        {/* POLÍTICA ACTIVA */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-zinc-900/10 border border-zinc-800 p-8 rounded-[2.5rem]">
          <h3 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2 text-sm">
            <Sliders size={18} className="text-blue-500" /> Política Activa: <span className="text-blue-400 uppercase">{routingMode}</span>
          </h3>
          <div className="flex bg-black/50 p-1.5 rounded-2xl border border-zinc-800">
            {['Conservative', 'Balanced', 'Aggressive'].map((mode) => (
              <button 
                key={mode} 
                onClick={() => updateRoutingPolicy(mode)} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${routingMode === mode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                {mode === 'Conservative' ? 'Conservador' : mode === 'Balanced' ? 'Balanceado' : 'Agresivo'}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}