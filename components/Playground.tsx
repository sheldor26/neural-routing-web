"use client";
import { useState } from 'react';

export default function Playground() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRoute = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://web-production-xxxx.up.railway.app/v1/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "key_demo_user" // Use the demo key we set in main.py
        },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Routing error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Try NeuralRouting Live</h2>
      <textarea 
        className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition"
        rows={3}
        placeholder="Type a complex or simple prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button 
        onClick={testRoute}
        disabled={loading || !prompt}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-xl font-bold transition"
      >
        {loading ? "Routing..." : "Route Prompt"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-black/50 border border-blue-500/30 rounded-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Decision: {result.routing.selected_tier}</span>
            <span className="text-xs text-zinc-500">{result.routing.latency_ms}ms</span>
          </div>
          <p className="text-sm text-zinc-300 italic">"Model used: {result.routing.model_used}"</p>
          <div className="mt-4 p-3 bg-zinc-900 rounded-lg text-sm text-zinc-400">
            {result.output.ai_answer.substring(0, 150)}...
          </div>
        </div>
      )}
    </div>
  );
}