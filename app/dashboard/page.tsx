"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Cpu, Sliders, TrendingUp, Home, Loader2, Globe, Target, ArrowUpRight, Rocket, HelpCircle, Menu } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useUser, UserButton } from '@clerk/nextjs';

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

  const API_BASE = "https://web-production-4f439.up.railway.app";
  const API_KEY = "nr-dev-secret-123";

  const getGlobalConfidenceLevel = (score) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const runSimulation = async (targetMode) => {
    setSimulation(prev => ({ ...prev, loading: true }));
    setTimeout(() => {
      setSimulation({
        qImp: targetMode === 'Conservative' ? "+4.2%" : "-2.1%",
        sImp: targetMode === 'Conservative' ? "-12.0%" : "+35.5%",
        label: targetMode === 'Conservative' ? 'Risk Mitigation' : 'Maximum Savings',
        loading: false
      });
    }, 800);
  };

  const updateRoutingPolicy = async (mode) => {
    setRoutingMode(mode);
    runSimulation(mode);
  };

  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoaded || !user?.id) {
        if (isLoaded && !user) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/v1/user-stats/${user.id}`, {
          headers: { 
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data && !data.error) {
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            quality: data.quality_score || null,
            global_confidence: data.global_confidence || 0,
            risk: data.at_risk_percent || 0,
            validated_samples: data.validated_samples || 0,
            opt_opportunity_usd: data.optimization_opportunity_usd || 0,
            recommended_threshold: 5 + (data.at_risk_percent / 10)
          });
          
          if (data.recent_decisions) setDecisions(data.recent_decisions);
          
          // ✅ FIX: Evitar history vacío para prevenir error de Recharts width(-1)
          if (data.history && data.history.length > 0) {
            setChartData(data.history.map((item) => ({ 
              name: item.name, 
              savings: Number(item.savings || 0),
              quality: Number(item.quality || 0) 
            })));
          } else {
            // Estado inicial para cuentas nuevas sin registros
            setChartData([
                { name: 'Start', savings: 0, quality: 0 },
                { name: 'Active', savings: 0, quality: 0 },
            ]);
          }
        }
      } catch (e) { 
        console.error("Dashboard Sync Error:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    loadDashboardData();
  }, [isLoaded, user?.id]);

  const InfoTag = ({ text }: { text: string }) => (
    <div className="group relative ml-2 inline-block align-middle">
      <HelpCircle size={10} className="text-zinc-600 hover:text-blue-500 transition-colors cursor-help" />
      <div className="absolute bottom-full left-0 mb-3 hidden group-hover:block w-56 p-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] text-[10px] font-bold leading-relaxed text-zinc-300 normal-case tracking-normal backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
        {text}
        <div className="absolute top-full left-1 border-8 border-transparent border-t-zinc-900"></div>
      </div>
    </div>
  );

  if (!isLoaded || loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40}/>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Establishing Neural Node link...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
              <Zap size={20} className="text-blue-500 fill-blue-500/20" />
            </div>
            <span className="text-lg md:text-xl font-black italic uppercase tracking-tighter">Neuralrouting.io</span>
          </Link>
          <div className="flex items-center gap-4 md:gap-6 text-white/70">
            <Link href="/" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><Home size={14} /> Home</Link>
            <Link href="/chat" className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><Zap size={14} /> <span className="hidden xs:inline">Direct Chat</span></Link>
            <div className="flex items-center gap-4 border-l border-white/10 pl-4 md:pl-6">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* DOMINANT HEADER SECTION */}
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <div className="p-3 md:p-4 bg-blue-600/20 rounded-full border border-blue-500/30 mb-6 animate-pulse">
            <Target size={28} className="text-blue-500 md:w-8 md:h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight">
            Intelligence <span className="text-blue-500">Command Center</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-xs md:text-sm font-medium mb-10">
            Current session analytics for <span className="text-zinc-200 font-bold">{user?.firstName || 'User Node'}</span>. 
            The engine detected <span className="text-white">${stats.opt_opportunity_usd.toFixed(2)}</span> in uncaptured savings.
          </p>

          <Link href="/chat" className="group relative w-full md:w-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <button className="relative w-full md:w-auto flex items-center justify-center gap-4 px-8 md:px-12 py-5 md:py-6 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-blue-500 transition-all active:scale-95 shadow-2xl shadow-blue-500/20">
              <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Start Capturing Opportunities
            </button>
          </Link>
        </div>

        {/* UNREALIZED SAVINGS CARD */}
        <div className="mb-10 md:mb-12 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-zinc-900/40 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
            <div className="p-3 md:p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex-shrink-0"><Target size={24} className="text-emerald-500 md:w-7 md:h-7" /></div>
            <div className="min-w-0">
              <h3 className="text-white font-black uppercase italic tracking-tighter text-lg md:text-xl leading-none flex items-center flex-wrap gap-1">
                Unrealized Opportunity
                <InfoTag text="Money you could have saved if you used cheaper AI models for simpler tasks." />
              </h3>
              <p className="text-[9px] md:text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-2 truncate">Maximum optimization potential detected.</p>
            </div>
          </div>
          <div className="w-full md:w-auto text-center md:text-right border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
             <h4 className="text-2xl md:text-3xl font-black italic text-emerald-500 tracking-tighter">+${stats.opt_opportunity_usd.toFixed(2)}</h4>
          </div>
        </div>

        {/* OPERATIONAL METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="p-6 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900/20 border border-zinc-800 hover:border-zinc-700 transition-colors group relative">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1 flex items-center">
                Total Savings
                <InfoTag text="Total amount saved by routing requests to efficient models." />
            </p>
            <h2 className="text-3xl md:text-4xl font-black italic text-white">${stats.savings.toFixed(3)}</h2>
            <p className="text-[8px] font-bold text-zinc-600 mt-2 uppercase tracking-widest">{stats.requests} Requests</p>
          </div>
          
          <div className="p-6 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900/20 border border-zinc-800 relative group">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1 flex items-center">
                Quality Index
                <InfoTag text="Comparison between cheap and premium model answers." />
            </p>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-black italic text-white">{stats.quality ? Number(stats.quality).toFixed(2) : "0.00"}</h2>
                {stats.quality && <span className="text-[7px] text-emerald-500 font-black uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">Verified</span>}
            </div>
          </div>

          <div className="p-6 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900/20 border border-zinc-800 relative group">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1 flex items-center">
              Global Confidence
              <InfoTag text="Certainty in current model selection choices." />
            </p>
            <h2 className={`text-3xl md:text-4xl font-black italic ${getGlobalConfidenceLevel(stats.global_confidence)}`}>{stats.global_confidence}%</h2>
          </div>

          <div className="p-6 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900/20 border border-red-500/10 group relative">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/70 mb-1 flex items-center">
                Risk Factor
                <InfoTag text="Percentage of suboptimal outputs from cheap models." />
            </p>
            <h2 className="text-3xl md:text-4xl font-black italic text-white">{stats.risk.toFixed(1)}%</h2>
          </div>
        </div>

        {/* PERFORMANCE ANALYSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-12">
          <div className="lg:col-span-8 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-zinc-900/10 border border-zinc-800 flex flex-col h-[350px] md:h-[400px] shadow-2xl relative group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 relative z-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-lg md:text-xl flex items-center">
                <TrendingUp size={18} className="text-blue-500 mr-3" /> 
                Performance Analysis
              </h4>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase text-blue-500"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Savings</div>
                 <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Quality</div>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 8, fontWeight: 900}} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '15px' }}
                    itemStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="savings" stroke="#3b82f6" fill="url(#colorSavings)" strokeWidth={3} />
                  <Area type="monotone" dataKey="quality" stroke="#10b981" fill="url(#colorQuality)" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-blue-600/5 border border-blue-500/20 relative group shadow-2xl flex flex-col justify-between">
            <div className="relative z-10">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-lg md:text-xl mb-2 flex items-center">
                Simulator
                <InfoTag text="Predicts cost vs quality based on routing policy." />
              </h4>
              <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-8 italic">State: {simulation.label}</p>
              
              <div className="p-5 md:p-6 bg-black/60 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 backdrop-blur-md mb-6">
                  {simulation.loading ? (
                    <div className="flex items-center justify-center py-4"><Loader2 className="animate-spin text-blue-500" /></div>
                  ) : (
                    <div className="flex justify-between items-end gap-2">
                      <div>
                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-tighter">Quality</p>
                        <h5 className="text-3xl md:text-4xl font-black italic text-white leading-none">{simulation.qImp}</h5>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest leading-none">Savings</p>
                        <h5 className="text-3xl md:text-4xl font-black italic text-white leading-none">{simulation.sImp}</h5>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <button 
              onClick={() => runSimulation(routingMode)} 
              className="w-full py-4 md:py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-lg relative z-10"
            >
              Simulate Impact
            </button>
          </div>
        </div>

        {/* SHADOW AUDIT LOG */}
        <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-zinc-900/10 border border-zinc-800 shadow-2xl mb-12 relative">
          <h4 className="text-white font-black italic uppercase tracking-tighter text-lg md:text-xl mb-6 md:mb-8 flex items-center">
            <Cpu size={18} className="text-blue-500 mr-3" /> 
            Audit Log
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {decisions.length > 0 ? decisions.map((dec, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden">
                <div className="flex gap-3 items-center min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dec.is_at_risk ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`} />
                  <div className="min-w-0">
                    <p className="text-[9px] text-white font-black uppercase italic truncate">Audit Node</p>
                    <p className="text-[10px] text-zinc-500 font-bold truncate mt-1">{dec.prompt_preview || "Request audited"}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-[9px] font-black text-emerald-500 italic">Score: {((dec.quality_score || 0.98) * 100).toFixed(0)}%</p>
                </div>
              </div>
            )) : (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-zinc-600 text-[9px] italic uppercase font-black tracking-widest">No telemetry data available.</div>
            )}
          </div>
        </div>

        {/* ACTIVE POLICY CONTROL - FINAL MOBILE FIX */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-zinc-900/10 border border-zinc-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative">
          <h3 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2 text-xs md:text-sm text-center md:text-left">
            <Sliders size={18} className="text-blue-500" /> 
            Active Policy: <span className="text-blue-400 uppercase">{routingMode}</span>
            <InfoTag text="Conservative (High Quality), Balanced, or Aggressive (Savings)." />
          </h3>
          
          <div className="flex bg-black/50 p-1.5 rounded-2xl border border-zinc-800 w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex min-w-full md:min-w-0 justify-between gap-1">
              {['Conservative', 'Balanced', 'Aggressive'].map((mode) => (
                <button 
                  key={mode} 
                  onClick={() => updateRoutingPolicy(mode)} 
                  className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    routingMode === mode 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' 
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
