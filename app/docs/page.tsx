import React from 'react';
import { ChevronRight, ArrowRightCircle, Copy } from 'lucide-react';

export default function DocsPage() {
  const codeSnippet = `curl -X POST https://api.neuralrouting.io/v1/route \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Routing-Version: 2026-04-01" \\
  -d '{
    "origin": "aws-us-east-1",
    "destination": "edge-buenos-aires",
    "priority": "latency"
  }'`;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Decor - Sutil logo de fondo */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
        <img src="/logo.png" alt="" className="w-96 h-96 object-contain" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center p-2 shadow-inner">
              <img src="/logo.png" alt="NeuralRouting Logo" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>
            <span className="font-bold text-white tracking-tighter text-2xl italic">NeuralRouting<span className="text-blue-500">.io</span></span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row gap-20 relative z-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-10">
            <section>
              <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6">Introduction</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li className="text-blue-500 flex items-center gap-2 italic cursor-pointer">Quickstart <ChevronRight className="w-3 h-3" /></li>
                <li className="hover:text-white cursor-pointer transition-all">Core Concepts</li>
                <li className="hover:text-white cursor-pointer transition-all">Global Nodes</li>
              </ul>
            </section>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <header className="mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
              The Decision Layer <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">for Global Traffic</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed italic">
              NeuralRouting automatically optimizes every request across providers, reducing latency and cost in real-time.
            </p>
          </header>

          {/* Visualizer con Integración de Logo */}
          <section className="mb-12">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-10 flex items-center justify-around text-center relative overflow-hidden group">
              {/* Animación de escaneo de fondo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative z-10">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-3">Origin</div>
                <div className="font-mono text-xs bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white italic">aws-us-east-1</div>
              </div>

              <ArrowRightCircle className="text-blue-500/30 animate-pulse" size={20} />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <img src="/logo.png" alt="Optimizer Core" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                <div>
                  <div className="text-[10px] font-black text-blue-400 uppercase italic leading-none">Neural Optimizer</div>
                  <div className="font-mono text-[10px] text-blue-400/50 mt-1 uppercase font-bold">relay-miami-core</div>
                </div>
              </div>

              <ArrowRightCircle className="text-blue-500/30 animate-pulse" size={20} />

              <div className="relative z-10">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-3">Destination</div>
                <div className="font-mono text-xs bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white italic">edge-buenos-aires</div>
              </div>
            </div>
          </section>

          {/* Code Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded tracking-tighter shadow-lg shadow-blue-500/20">POST</span>
                <code className="text-white font-bold text-lg font-mono tracking-tight">/v1/route</code>
              </div>
              <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-2xl overflow-hidden relative group">
                <Copy className="absolute top-4 right-4 w-4 h-4 text-slate-600 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                <pre className="font-mono text-sm leading-relaxed text-blue-300 whitespace-pre-wrap italic">
                  {codeSnippet}
                </pre>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest italic">Expected Response</span>
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">118ms latency</span>
              </div>
              <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 shadow-inner">
                <pre className="font-mono text-[13px] leading-relaxed text-emerald-400/90 italic">
{`{
  "status": "success",
  "data": {
    "route_id": "rt_987654321",
    "metrics": {
      "latency_ms": 118,
      "cost_savings": "15%"
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}