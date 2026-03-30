"use client";
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface RoutingResult {
  routing: {
    selected_tier: string;
    model_used: string;
    latency_ms: number;
  };
  output: {
    ai_answer: string;
  };
}

export default function Playground() {
  const { user, isLoaded } = useUser();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRoute = async () => {
    if (!prompt) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🚀 Despachando a Railway...");
      
      // Añadimos un timestamp para evitar caché del navegador
      const response = await fetch(`https://web-production-4f439.app.railway.app/v1/dispatch?t=${Date.now()}`, {
        method: "POST",
        mode: 'cors', // Forzamos modo CORS
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "key_demo_user" 
        },
        body: JSON.stringify({ 
          prompt: prompt,
          user_id: user?.id || "guest_user" 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Servidor respondió con ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error de conexión con el motor neuronal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="playground" className="max-w-4xl mx-auto px-6 py-20 relative z-50">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 italic tracking-tight">Live Routing Simulator</h2>
          <p className="text-zinc-500 max-w-md mx-auto italic">
            El motor elegirá el modelo más eficiente para tu consulta.
          </p>
        </div>
        
        <div className="space-y-4">
          <textarea 
            className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-white focus:border-blue-500 outline-none transition placeholder:text-zinc-800 text-lg resize-none"
            rows={3}
            placeholder="Escribe algo complejo..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              testRoute();
            }}
            disabled={loading || !prompt || !isLoaded}
            style={{ touchAction: 'manipulation' }}
            className="relative z-[60] w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.97] disabled:opacity-30 py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>OPTIMIZANDO...</span>
              </>
            ) : (
              "DISPATCH PROMPT"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle size={18} /> 
            <span className="font-medium">{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-10 p-8 bg-black border border-blue-500/20 rounded-[2rem] animate-in fade-in zoom-in duration-500">
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-green-500" size={20} />
                 <span className="font-bold tracking-tight italic text-zinc-300 uppercase text-sm">
                   Status: <span className="text-green-500">Neural Optimized</span>
                 </span>
               </div>
               <div className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase">
                 Tier: {result.routing.selected_tier}
               </div>
             </div>
             <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Deployment Source</p>
               <p className="text-white font-mono bg-zinc-900/50 w-fit px-3 py-1 rounded-md text-xs border border-zinc-800">
                 {result.routing.model_used}
               </p>
               <div className="p-6 bg-zinc-900/50 rounded-2xl text-zinc-300 text-sm leading-relaxed border border-zinc-800 font-medium italic">
                 "{result.output.ai_answer}"
               </div>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
