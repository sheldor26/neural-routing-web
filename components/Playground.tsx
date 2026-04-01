"use client";
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// ✅ REPARACIÓN 1: La interface debe coincidir con el JSON aplanado del Backend
interface RoutingResult {
  status: string;
  model_used: string;    // Antes estaba anidado en routing
  tier: string;          // Antes estaba anidado en routing
  latency_ms: number;    // Antes estaba anidado en routing
  confidence: number;    // Antes estaba anidado en routing
  output: {
    ai_answer: string;
  };
}

export default function Playground() {
  const { isLoaded, user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRoute = async () => {
    if (!prompt || !isLoaded) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/v1/dispatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "nr-dev-secret-123" 
        },
        body: JSON.stringify({ 
          messages: [
            { role: "user", content: prompt.trim() }
          ],
          // ✅ REPARACIÓN 2: Usamos el ID real del usuario si existe, sino el fallback
          user_id: user?.id || "juan_dev_34", 
          session_id: "playground_live_session" 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Neural Node Error: ${response.status}`);
      }
      
      const data = await response.json();
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

        {/* ✅ REPARACIÓN 3: Cambiamos result.routing.X por result.X */}
        {result && (
          <div className="mt-10 p-8 bg-black border border-blue-500/20 rounded-[2rem] animate-in fade-in zoom-in duration-500 shadow-2xl">
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-green-500" size={16} />
                 <span className="font-bold tracking-tighter italic text-zinc-300 uppercase text-[10px]">
                   Status: <span className="text-green-500">Neural Node Active</span>
                 </span>
               </div>
               <div className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[9px] font-black uppercase">
                 Tier: {result.tier}
               </div>
             </div>

             <div className="space-y-6">
               <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Zap size={10} className="fill-blue-500 text-blue-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Model Selected</p>
                  </div>
                  <p className="text-blue-400 font-mono bg-blue-500/5 w-fit px-3 py-1 rounded-md text-[11px] border border-blue-500/20 uppercase">
                    {result.model_used}
                  </p>
               </div>

               <div className="p-6 bg-zinc-900/30 rounded-2xl text-zinc-100 text-sm leading-relaxed border border-zinc-800/50 font-medium italic text-center">
                 "{result.output?.ai_answer}"
               </div>

               <div className="flex justify-center gap-8">
                 <p className="text-center text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
                   Latency: {result.latency_ms}ms
                 </p>
                 <p className="text-center text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
                   {/* ✅ Aquí se arregla el NaN% */}
                   Confidence: {(Number(result.confidence || 0) * 100).toFixed(0)}%
                 </p>
               </div>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}