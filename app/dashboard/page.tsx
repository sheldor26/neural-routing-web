"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Cpu, Sliders, TrendingUp, Home, Loader2, Globe, Target, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const [simulation, setSimulation] = useState({
    qImp: "0.0%",
    sImp: "0.0%",
    label: "System Nominal",
    loading: false
  });

  const [loading, setLoading] = useState(true);

  const API_BASE = "https://web-production-4f439.up.railway.app";
  const API_KEY = "nr-dev-secret-123";

  const getGlobalConfidenceLevel = (score) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  // 🧠 SIMULADOR
  const runSimulation = async (targetMode) => {
    setSimulation({
      qImp: targetMode === 'Conservative' ? "+2.1%" : "-1.5%",
      sImp: targetMode === 'Aggressive' ? "+18.4%" : "+5.2%",
      label: targetMode === 'Conservative'
        ? 'Mitigación de Riesgo'
        : 'Optimización de Costos',
      loading: false
    });
  };

  const updateRoutingPolicy = (mode) => {
    setRoutingMode(mode);
    runSimulation(mode);
  };

  // 🔥 CONEXIÓN REAL + DEBUG
  useEffect(() => {
    async function loadDashboardData() {
      console.log("🔥 useEffect triggered");
      console.log("👤 user:", user);
      console.log("📦 isLoaded:", isLoaded);

      if (!isLoaded) {
        console.log("⏳ Clerk not ready");
        return;
      }

      // 🔥 fallback para probar aunque user falle
      const userId = user?.id || "test-user-123";

      console.log("🚀 Fetching stats for:", userId);

      try {
        const response = await fetch(`${API_BASE}/v1/user-stats/${userId}`, {
          headers: { 'X-API-KEY': API_KEY }
        });

        console.log("📡 Status:", response.status);

        const data = await response.json();
        console.log("📊 Data:", data);

        if (data && !data.error) {
          setStats({
            savings: Number(data.total_savings || 0),
            requests: Number(data.requests_count || 0),
            quality: data.quality_score ?? null,
            global_confidence: data.global_confidence || 0,
            risk: data.at_risk_percent || 0,
            validated_samples: data.validated_samples || 0,
            opt_opportunity_usd: data.optimization_opportunity_usd || 0,
            recommended_threshold: data.recommended_threshold_increase || 5
          });

          setChartData([
            {
              name: "Now",
              savings: Number(data.total_savings || 0),
              quality: Number(data.quality_score || 0) * 100
            }
          ]);

          setDecisions([]);
        }

      } catch (e) {
        console.error("❌ Dashboard Error:", e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40}/>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
        Estableciendo vínculo con Nodo Neural...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300">

      {/* NAV */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-3">
            <Zap className="text-blue-500"/>
            <span className="font-black">Neuralrouting.io</span>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* GANANCIA */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-2">
            Oportunidad Detectada
          </h2>
          <p className="text-emerald-500 text-3xl font-black">
            +${Number(stats.opt_opportunity_usd || 0).toFixed(2)}
          </p>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

          <div>
            <p>Ahorro</p>
            <h2>${Number(stats.savings).toFixed(3)}</h2>
          </div>

          <div>
            <p>Calidad</p>
            {stats.quality !== null ? (
              <h2>{Number(stats.quality).toFixed(2)}</h2>
            ) : (
              <p>Sin datos</p>
            )}
          </div>

          <div>
            <p>Confianza</p>
            <h2 className={getGlobalConfidenceLevel(stats.global_confidence)}>
              {stats.global_confidence}%
            </h2>
          </div>

          <div>
            <p>Riesgo</p>
            <h2>{Number(stats.risk).toFixed(1)}%</h2>
          </div>

        </div>

        {/* GRÁFICO */}
        <div className="h-[300px] mb-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid stroke="#18181b" />
              <XAxis dataKey="name" />
              <Tooltip />
              <Area dataKey="savings" stroke="#3b82f6" fill="#3b82f6" />
              <Area dataKey="quality" stroke="#10b981" fill="#10b981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SIMULADOR */}
        <div className="mb-12">
          <h3 className="text-white mb-4">Simulación</h3>

          <p>Calidad: {simulation.qImp}</p>
          <p>Ahorro: {simulation.sImp}</p>

          <button
            onClick={() => runSimulation(routingMode)}
            className="mt-4 bg-blue-600 px-4 py-2 rounded"
          >
            Simular
          </button>
        </div>

        {/* POLICY */}
        <div className="flex gap-4">
          {['Conservative', 'Balanced', 'Aggressive'].map((mode) => (
            <button
              key={mode}
              onClick={() => updateRoutingPolicy(mode)}
              className="bg-zinc-800 px-4 py-2 rounded"
            >
              {mode}
            </button>
          ))}
        </div>

      </main>
    </div>
  );
}