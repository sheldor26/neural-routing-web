"use client";
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Zap, Lock, ChevronRight } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';

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
  const { user, isLoaded, isSignedIn } = useUser();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRoute = async () => {
    if (!prompt || !isLoaded || !isSignedIn) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://web-production-4f439.up.railway.app/v1/dispatch?t=${Date.now()}`, {
        method: "POST",
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message === "Failed to fetch" 
        ? "Connection Error. Please ensure the Railway backend is live." 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="playground" className="max-w-4xl mx-auto px-6 py-20 relative z-30">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden">
        
        {/* --- OVERLAY DE BLOQUEO (Solo si NO está logueado) --- */}
        {!isSignedIn && isLoaded && (
          <div className="absolute inset-0 z-50 bg-[#09090b]/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <Lock className="text-blue-500" size={32} />
            </div>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Terminal Locked</h3>
            <p className="text-zinc-500 text-sm max-w-sm mb-8 font-medium italic">
              Experience the neural engine. Create a free account to test live routing and cost optimization.
            </p>
            <SignInButton mode="modal">
              <button className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-black uppercase italic tracking-tighter text-sm hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl active:scale-95">
                Authenticate Access <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </SignInButton>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap size={12} fill="currentColor" /> Neural Core v1.0
          </div>
          <h2 className="text-3xl font-bold mb-4 italic tracking-tight uppercase">Live Routing Simulator</h2>
          <p className="text-zinc-500 max-w-md mx-auto italic text-sm font-medium">
            Experience how our neural engine selects the best model for your prompt in real-time.
          </p>
        </div>
        
        <div className="space-y-4">
          <textarea 
            className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-white focus:border-blue-500 outline-none transition placeholder:text-zinc-800 text-lg resize-none shadow-inner"
            rows={3}
            placeholder={isSignedIn ? "Type a complex prompt here..." : "Login to interact..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!isSignedIn}
          />
          
          <button 
            onClick={(e) => { e.preventDefault(); testRoute(); }}
            disabled={loading || !prompt || !isSignedIn}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-30 py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span className="tracking-widest uppercase">Processing...</span>
              </>
            ) : (
              "DISPATCH PROMPT"
            )}
          </button>
        </div>

        {/* ... Resultados y Errores (se mantienen igual pero solo se activan con Sign In) ... */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-pulse">
            <AlertCircle size={18} /> 
            <span className="font-mono">{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-10 p-8 bg-black border border-blue-500/20 rounded-[2rem] animate-in fade-in zoom-in duration-500 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} className="text-blue-500" />
             </div>
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-zinc-800 relative z-10">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-green-500" size={20} />
                 <span className="font-bold tracking-tighter italic text-zinc-300 uppercase text-xs">
                   Status: <span className="text-green-500">Neural Optimized</span>
                 </span>
               </div>
               <div className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase">
                 Tier: {result.routing.selected_tier}
               </div>
             </div>
             <div className="space-y-4 relative z-10">
               <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Model Deployed</p>
                  <p className="text-blue-400 font-mono bg-blue-500/5 w-fit px-3 py-1 rounded-md text-[11px] border border-blue-500/20">
                    {result.routing.model_used}
                  </p>
               </div>
               <div className="p-6 bg-zinc-900/30 rounded-2xl text-zinc-300 text-sm leading-relaxed border border-zinc-800/50 font-medium italic text-center">
                 "{result.output.ai_answer}"
               </div>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
