"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Copy, CheckCircle2, Eye, EyeOff, ArrowLeft, Terminal, Code, ExternalLink, Loader2 } from 'lucide-react';
import { useUser, UserButton, useAuth } from '@clerk/nextjs';
import { createAuthClient } from '@/lib/supabase';

const ENDPOINT = "https://web-production-4f439.up.railway.app";

export default function SetupPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isLoaded || !user) return;
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = createAuthClient(token!);
        const { data } = await supabase
          .from('api_keys')
          .select('key')
          .eq('user_id', String(user.id))
          .maybeSingle();
        if (data?.key) setApiKey(data.key);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoaded, user?.id, getToken]);

  const copyTo = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'•'.repeat(24)}${apiKey.slice(-4)}` : '•'.repeat(36);

  const curlExample = `curl -X POST ${ENDPOINT}/v1/dispatch \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: ${apiKey || 'YOUR_API_KEY'}" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "session_id": "my-app"
  }'`;

  const fetchExample = `const res = await fetch("${ENDPOINT}/v1/dispatch", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "${apiKey || 'YOUR_API_KEY'}"
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: prompt }],
    session_id: "my-app"
  })
});
const data = await res.json();
console.log(data.output.ai_answer);`;

  const pythonExample = `import requests

response = requests.post(
    "${ENDPOINT}/v1/dispatch",
    headers={"X-API-KEY": "${apiKey || 'YOUR_API_KEY'}"},
    json={
        "messages": [{"role": "user", "content": "Hello!"}],
        "session_id": "my-app"
    }
)
print(response.json()["output"]["ai_answer"])`;

  const [activeTab, setActiveTab] = useState<'curl' | 'fetch' | 'python'>('curl');
  const codeMap = { curl: curlExample, fetch: fetchExample, python: pythonExample };

  if (!isLoaded || loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24">
      {/* NAV */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <Link href="/" className="flex items-center gap-2">
            <Zap size={18} className="text-blue-500 fill-blue-500" />
            <span className="text-lg font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
          </Link>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-14 space-y-10">
        {/* HEADER */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em]">Step 1: Production Setup</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Your API is <span className="text-blue-600">Ready</span>
          </h1>
          <p className="text-zinc-500 text-sm font-bold">Replace any OpenAI call with the endpoint below. Same interface, automatic cost optimization.</p>
        </div>

        {/* ENDPOINT URL */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 space-y-3">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Production Endpoint</span>
          <div className="flex items-center justify-between bg-black/60 border border-zinc-800 rounded-xl px-5 py-4 gap-4">
            <span className="font-mono text-sm text-emerald-400 truncate">{ENDPOINT}/v1/dispatch</span>
            <button
              onClick={() => copyTo(`${ENDPOINT}/v1/dispatch`, 'url')}
              className={`shrink-0 p-2 rounded-lg transition-all ${copied === 'url' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              {copied === 'url' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* API KEY */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Secret API Key</span>
            <span className="text-[9px] font-black uppercase text-red-500/70 tracking-widest">Never share this</span>
          </div>
          <div className="flex items-center justify-between bg-black/60 border border-zinc-800 rounded-xl px-5 py-4 gap-4">
            <span className="font-mono text-sm text-zinc-200 tracking-widest truncate">
              {showKey ? (apiKey || 'No key found') : maskedKey}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowKey(!showKey)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => copyTo(apiKey || '', 'key')}
                className={`p-2 rounded-lg transition-all ${copied === 'key' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                {copied === 'key' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* CODE EXAMPLES */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Integration Example</span>
            <div className="flex gap-1">
              {(['curl', 'fetch', 'python'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="bg-black/60 border border-zinc-800 rounded-xl p-6 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">
              {codeMap[activeTab]}
            </pre>
            <button
              onClick={() => copyTo(codeMap[activeTab], 'code')}
              className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${copied === 'code' ? 'bg-emerald-500 text-black' : 'bg-zinc-800/80 text-zinc-400 hover:text-white'}`}
            >
              {copied === 'code' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* RESPONSE SHAPE */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 space-y-4">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Response Shape</span>
          <pre className="bg-black/60 border border-zinc-800 rounded-xl p-6 text-xs font-mono text-zinc-400 overflow-x-auto leading-relaxed whitespace-pre">{`{
  "status": "success",
  "model_used": "gpt-4o-mini",         // model selected by the router
  "output": {
    "ai_answer": "..."                  // the response text
  },
  "business_metrics": {
    "cost_usd": 0.000042,              // what you paid
    "estimated_gpt4_cost": 0.000280,   // what GPT-4o would have cost
    "savings_percentage": 85.0         // savings this request
  }
}`}</pre>
        </div>

        {/* NEXT STEPS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="flex-1 py-4 bg-zinc-900 border border-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all text-center"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/docs"
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all text-center flex items-center justify-center gap-2"
          >
            Full API Docs <ExternalLink size={12} />
          </Link>
        </div>
      </main>
    </div>
  );
}
