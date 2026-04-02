"use client";
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Zap, DollarSign, TrendingUp } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface RoutingResult {
  status: string;
  model_used: string;
  output: {
    ai_answer: string;
  };
  business_metrics: {
    latency_ms: number;
    cost_usd: number;
    estimated_gpt4_cost: number;
    savings_percentage: number;
  };
}

export default function Playground() {
  const { isLoaded, user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "https://web-production-4f439.up.railway.app";

  // ✅ CONSTANTES DE VOLUMEN FIJAS PARA EVITAR INCONSISTENCIAS
  const ESTIMATED_MONTHLY_VOLUME = 1000000; 

  // ✅ CÁLCULOS NORMALIZADOS (Se ejecutan solo cuando hay un result)
  const getMetrics = () => {
    if (!result) return { yearly: 0, efficiency: "0.0" };

    const gpt4Cost = Number(result.business_metrics.estimated_gpt4_cost || 0);
    const actualCost = Number(result.business_metrics.cost_usd || 0);
    
    // Calculamos el ahorro real por request
    const savingsPerRequest = Math.max(0, gpt4Cost - actualCost);
    const yearly = savingsPerRequest * ESTIMATED_MONTHLY_VOLUME * 12;

    // Calculamos eficiencia real (Si el backend falla o manda 0)
    let efficiency = Number(result.business_metrics.savings_percentage || 0);
    if (efficiency <= 0 && gpt4Cost > 0) {
      efficiency = ((gpt4Cost - actualCost) / gpt4Cost) * 100;
    }

    return { 
      yearly: Math.floor(yearly), 
      efficiency: efficiency > 0 && efficiency < 0.1 ? "0.1" : efficiency.toFixed(1) 
    };
  };

  const metrics = getMetrics();

  const testRoute = async () => {
    if (!prompt || !isLoaded) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/v1/dispatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "nr-dev-secret-123" 
        },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: prompt.trim() }],
          user_id: user?.id || "juan_dev_34", 
          session_id: "playground_live_session" 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || `Error: ${response.status}`);
      setResult(data);
    } catch (err: any) {
      console.error("❌ Dispatch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="playground" className="max-w-4xl mx-auto px-6 py-20 relative z-30">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 italic tracking-tight uppercase text-white">Live Routing Simulator</h2>
          <p className="text-zinc-500 max-w-md mx-auto italic text-sm">
            Experience how the engine selects the most efficient model for your query in real-time.
          </p>
        </div>
        
        <div className="space-y-4">
          <textarea 
            className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-white focus:border-blue-500 outline-none transition placeholder:text-zinc-800 text-lg resize-none shadow-inner"
            rows={3}
            placeholder="Type something complex..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button 
            onClick={(e) => { e.preventDefault(); testRoute(); }}
            disabled={loading || !prompt || !isLoaded}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-30 py-5 rounded-2xl font-black text-xl text-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span className="tracking-widest uppercase text-sm">Neural Routing...</span>
              </>
            ) : (
              "DISPATCH PROMPT"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3">
            <AlertCircle size={14} /> 
            <span className="font-mono uppercase tracking-tighter">{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-10 space-y-8 animate-in fade-in zoom-in duration-500">
            
            {/* BIG IMPACT CARD */}
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-[2.5rem] p-10 text-center relative overflow-hidden group shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)]">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign size={120} className="text-blue-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-4">Estimated Enterprise Impact</p>
              <h3 className="text-6xl font-black italic text-white tracking-tighter mb-4">
                ${metrics.yearly.toLocaleString()}
                <span className="text-blue-600">/yr</span>
              </h3>
              <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <TrendingUp size={14} className="text-emerald-500" />
                Potential annual savings based on 1M requests/mo
              </div>
            </div>

            {/* MÉTRICAS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-3xl text-center group hover:border-blue-500/30 transition-colors">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Latency</p>
                <p className="text-xl font-black text-white italic">{result.business_metrics.latency_ms}<span className="text-blue-500 text-xs ml-1">ms</span></p>
              </div>
              
              <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-3xl text-center group hover:border-emerald-500/30 transition-colors">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Efficiency</p>
                <p className="text-xl font-black text-emerald-500 italic">+{metrics.efficiency}%</p>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-3xl text-center group hover:border-blue-500/30 transition-colors">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Model Selected</p>
                <p className="text-[11px] font-mono text-blue-400 truncate uppercase">{result.model_used}</p>
              </div>
            </div>

            {/* ENGINE OUTPUT */}
            <div className="p-8 bg-zinc-900/30 rounded-[2rem] border border-zinc-800/50 relative">
               <div className="absolute -top-3 left-10 px-4 py-1 bg-zinc-800 rounded-full border border-zinc-700">
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Engine Response</p>
               </div>
               <p className="text-zinc-300 text-sm italic leading-relaxed text-center">
                 "{result.output.ai_answer}"
               </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
