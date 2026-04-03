import React from 'react';
import { Cpu, Globe, Zap, Shield, ChevronRight, ArrowRightCircle, Copy } from 'lucide-react';

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
    <div className="min-h-screen bg-[#050505] text-slate-400 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-white tracking-tighter text-2xl">NeuralRouting<span className="text-blue-500">.io</span></span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row gap-20">
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
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              NeuralRouting automatically optimizes every request across providers, reducing latency and cost in real-time.
            </p>
          </header>

          {/* Visualizer */}
          <section className="mb-12">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-10 flex items-center justify-around text-center relative overflow-hidden group">
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase mb-3">Origin</div>
                <div className="font-mono text-xs bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white italic">aws-us-east-1</div>
              </div>
              <ArrowRightCircle className="text-blue-500 animate-pulse" />
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase mb-3 italic">Neural Optimizer</div>
                <div className="font-mono text-xs bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/30 text-blue-400 font-bold">relay-miami-core</div>
              </div>
              <ArrowRightCircle className="text-blue-500 animate-pulse" />
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase mb-3">Destination</div>
                <div className="font-mono text-xs bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white italic">edge-buenos-aires</div>
              </div>
            </div>
          </section>

          {/* Code Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded tracking-tighter">POST</span>
                <code className="text-white font-bold text-lg font-mono">/v1/route</code>
              </div>
              <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-2xl overflow-hidden">
                <pre className="font-mono text-sm leading-relaxed text-blue-300 whitespace-pre-wrap">
                  {codeSnippet}
                </pre>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest italic">Expected Response</span>
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20">118ms latency</span>
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