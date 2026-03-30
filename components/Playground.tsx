"use client";
import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs'; // Importamos el hook de usuario

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
  const { user } = useUser(); // Obtenemos el usuario actual
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testRoute = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://web-production-4f439.app.railway.app/v1/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "key_demo_user" 
        },
        // --- CAMBIO CLAVE: Enviamos el user_id real ---
        body: JSON.stringify({ 
          prompt: prompt,
          user_id: user?.id || "guest_user" 
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Routing error:", error);
    }
    setLoading(false);
  };

  return (
    <section id="playground" className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 italic">Live Routing Simulator</h2>
          <p className="text-zinc-500">Experience how our neural engine selects the most cost-effective model for your prompt.</p>
        </div>
        
        <div className="space-y-4">
          <textarea 
            className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-white focus:border-blue-500 outline-none transition placeholder:text-zinc-700 text-lg"
            rows={3}
            placeholder="e.g., &quot;Summarize this text&quot; or &quot;Write complex code&quot;..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={testRoute}
            disabled={loading || !prompt}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : "DISPATCH PROMPT"}
          </button>
        </div>

        {result && (
          <div className="mt-10 p-8 bg-black border border-blue-500/20 rounded-[2rem] animate-in fade-in zoom-in duration-500">
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-green-500" size={20} />
                 <span className="font-bold tracking-tight italic text-zinc-300">
                   STATUS: <span className="text-green-500 font-black">NEURAL OPTIMIZED</span>
                 </span>
               </div>
               <div className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest">
                 Tier: {result.routing.selected_tier}
               </div>
             </div>
             <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Deployment Source</p>
               <p className="text-white font-mono bg-zinc-900/50 w-fit px-3 py-1 rounded-md text-sm">{result.routing.model_used}</p>
               <div className="p-6 bg-zinc-900/50 rounded-2xl text-zinc-300 text-sm leading-relaxed border border-zinc-800 font-medium">
                 {result.output.ai_answer}
               </div>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}