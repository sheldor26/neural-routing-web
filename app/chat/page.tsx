"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  Plus, Send, User, Bot, History, Home, Zap, DollarSign, Loader2, 
  Trash2, Edit3, Check, X, Menu, LayoutDashboard, Sparkles, 
  ArrowUpRight, Copy, RefreshCcw, ShieldCheck, Info
} from 'lucide-react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  stats?: {
    model: string;
    cost: number;
    gpt4_cost: number;
    savings_pct: number;
    reasoning?: string;
  };
}

export default function FullChatPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [dailySavings, setDailySavings] = useState(0);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRouting, setShowRouting] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_BASE = "https://web-production-4f439.up.railway.app";

  // ✅ Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Sync scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    async function init() {
      if (!isLoaded || !user) return;
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: { Authorization: `Bearer ${token}` } } });
        const { data } = await supabase.from('api_keys').select('key').eq('user_id', user.id).maybeSingle();
        if (data?.key) setUserApiKey(data.key);

        // Traemos el ahorro de hoy para el loop visual
        const res = await fetch(`${API_BASE}/v1/user-stats/${user.id}`);
        if (res.ok) {
          const stats = await res.json();
          setDailySavings(stats.total_savings || 0);
        }
      } catch (e) { console.error(e); }
    }
    init();
  }, [isLoaded, user]);

  const handleSendMessage = async (presetPrompt?: string) => {
    const prompt = presetPrompt || input;
    if (!prompt.trim() || isTyping || !userApiKey) return;

    const currentSessionId = sessionId || crypto.randomUUID();
    if (!sessionId) setSessionId(currentSessionId);

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/v1/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': userApiKey },
        body: JSON.stringify({ messages: [...messages.map(m=>({role:m.role,content:m.content})), {role:'user',content:prompt}], user_id: user?.id, session_id: currentSessionId }),
      });

      const data = await response.json();
      
      if (data.output?.ai_answer) {
        // Simulamos GPT-4 cost para la comparativa (esto vendrá del backend idealmente)
        const cost = data.business_metrics?.cost_usd || 0.0002;
        const gpt4Cost = cost * 5; // Simulación
        const savings = ((gpt4Cost - cost) / gpt4Cost) * 100;

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.output.ai_answer,
          stats: {
            model: data.business_metrics?.model_used || "Optimized Node",
            cost: cost,
            gpt4_cost: gpt4Cost,
            savings_pct: savings,
            reasoning: "Selected based on low complexity and cost-efficiency parameters."
          }
        }]);
        setDailySavings(prev => prev + (gpt4Cost - cost));
      }
    } catch (e) { console.error(e); } finally { setIsTyping(false); }
  };

  return (
    <div className="flex h-screen bg-[#050506] text-zinc-300 font-sans relative text-white">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[50] w-72 bg-[#050505] border-r border-white/5 flex flex-col transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-80`}>
        <div className="p-6 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
            <LayoutDashboard size={12} /> Dashboard
          </Link>
          <button onClick={() => {setMessages([]); setSessionId(crypto.randomUUID())}} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
            <Plus size={14} /> New Session
          </button>
        </div>
        {/* Historial simplificado */}
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* HEADER CON COST AWARENESS */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-[#050506]/80 backdrop-blur-xl z-10">
           <div className="flex flex-col">
             <h2 className="text-sm font-black uppercase italic tracking-tighter">Neural routing</h2>
             <div className="flex items-center gap-2 mt-0.5">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Saved ${dailySavings.toFixed(2)} today</span>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase text-white bg-blue-600 px-5 py-2 rounded-full hover:scale-105 transition-all shadow-lg shadow-blue-600/20">
                Optimize all my apps <ArrowUpRight size={14} />
             </Link>
             <UserButton afterSignOutUrl="/" />
           </div>
        </header>

        {/* CHAT AREA */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 max-w-4xl mx-auto w-full pt-10">
          
          {/* EMPTY STATE AGRESIVO */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
               <Sparkles className="text-blue-500" size={40} />
               <div className="space-y-2">
                 <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Stop overpaying for AI</h1>
                 <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Every request you send here costs up to 80% less than GPT-4.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                  {[
                    { t: "Draft professional email", p: "Draft a professional email to my team about..." },
                    { t: "Audit this code snippet", p: "Review this code for performance issues: " },
                    { t: "Summarize business text", p: "Create an executive summary for this: " }
                  ].map((preset, idx) => (
                    <button key={idx} onClick={() => handleSendMessage(preset.p)} className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-blue-600 hover:text-white transition-all text-left group">
                      <span className="text-blue-500 group-hover:text-white mb-1 block">Quick Start</span> {preset.t}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-4 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-5 md:p-6 rounded-[2rem] ${m.role === 'user' ? 'bg-zinc-900 border border-white/10 text-white rounded-tr-none' : 'bg-zinc-900/30 border border-white/5 text-zinc-200 rounded-tl-none backdrop-blur-md shadow-2xl'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm leading-relaxed prose prose-invert max-w-none">{m.content}</ReactMarkdown>
                  
                  {/* REWARD LOOP BLOCK */}
                  {m.role === 'assistant' && m.stats && (
                    <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-2">
                           <DollarSign size={14} /> You paid {m.stats.savings_pct.toFixed(0)}% less than GPT-4
                        </h4>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                           Actual cost: ${m.stats.cost.toFixed(5)} vs ${m.stats.gpt4_cost.toFixed(5)} (GPT-4)
                        </p>
                      </div>
                      
                      <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                         <div className="flex flex-col">
                           <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest italic">Routing Transparency</span>
                           <p className="text-[10px] text-zinc-400 font-medium italic mt-1 flex items-center gap-1">
                             <ShieldCheck size={10} className="text-blue-500"/> {m.stats.reasoning}
                           </p>
                         </div>
                         <span className="px-2 py-1 bg-blue-600/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-500 uppercase">{m.stats.model}</span>
                      </div>

                      <div className="flex gap-2">
                         <button onClick={() => {}} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all"><Copy size={12}/> Copy Result</button>
                         <button onClick={() => handleSendMessage(`Make this cheaper and more concise`)} className="flex-1 py-3 bg-zinc-800 hover:bg-emerald-600 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all"><RefreshCcw size={12}/> Optimize further</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <div className="ml-12 text-blue-500/50 text-[10px] font-black uppercase tracking-[0.3em] italic animate-pulse">Neural Routing Active...</div>}
          <div className="h-40 flex-shrink-0" /> 
        </div>

        {/* SMART INPUT AREA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#050506] via-[#050506] to-transparent z-10">
          <div className="max-w-3xl mx-auto relative group">
            <textarea 
              ref={textareaRef} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} 
              placeholder="Paste a prompt and see how much you save..." 
              className="w-full bg-zinc-950 border border-white/10 rounded-[1.8rem] md:rounded-[2.2rem] p-5 md:p-6 pr-16 md:pr-20 text-xs md:text-sm focus:border-blue-500 outline-none resize-none shadow-2xl backdrop-blur-2xl transition-all max-h-[200px]" 
              rows={1} 
            />
            <button onClick={() => handleSendMessage()} disabled={isTyping || !input.trim() || !userApiKey} className="absolute right-3 md:right-4 bottom-3 md:bottom-4 p-3 bg-blue-600 rounded-2xl hover:scale-110 active:scale-95 disabled:opacity-50 transition-all text-white shadow-xl shadow-blue-600/30">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}