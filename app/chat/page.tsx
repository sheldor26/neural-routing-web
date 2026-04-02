"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  Plus, Send, User, Bot, History, Home, Zap, DollarSign, Loader2, 
  Trash2, Edit3, Check, X, Menu, LayoutDashboard, Sparkles, 
  ArrowUpRight, Copy, RefreshCcw, ShieldCheck, Info, Target, Share2, Rocket, TrendingUp
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
    isOverdrive?: boolean;
  };
}

interface ChatSession {
  session_id: string;
  created_at: string;
  custom_title?: string;
  session_savings?: number;
}

export default function FullChatPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // ✅ STATS INICIALIZADAS EN CERO REAL
  const [stats, setStats] = useState({ daily: 0, weekly: 0, total: 0 });
  const WEEKLY_GOAL = 100;

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_BASE = "https://web-production-4f439.up.railway.app";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // 1. CARGA DE CREDENCIALES, SESIONES Y STATS REALES
  useEffect(() => {
    async function initChat() {
      if (!isLoaded || !user) return;
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: { Authorization: `Bearer ${token}` } } });
        
        const { data } = await supabase.from('api_keys').select('key').eq('user_id', user.id).maybeSingle();
        if (data?.key) {
          setUserApiKey(data.key);
          fetchSessions(data.key);
        }

        const res = await fetch(`${API_BASE}/v1/user-stats/${user.id}`);
        if (res.ok) {
          const d = await res.json();
          setStats({ 
            daily: Number(d.total_savings || 0), 
            weekly: Number(d.weekly_savings || 0), 
            total: Number(d.total_savings || 0) 
          });
        }
      } catch (e) { console.error("Init Error", e); }
    }
    initChat();
  }, [isLoaded, user]);

  const fetchSessions = async (keyOverride?: string) => {
    const key = keyOverride || userApiKey;
    if (!user?.id || !key) return;
    try {
      const res = await fetch(`${API_BASE}/v1/sessions/${user.id}`, { headers: { 'X-API-KEY': key } });
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (e) { console.error("Sessions Fetch Error", e); }
  };

  // 2. CARGAR HISTORIAL DE SESIÓN
  const loadChatHistory = async (sId: string) => {
    if (!sId || !userApiKey) return;
    setIsTyping(true);
    setSessionId(sId);
    setMessages([]);
    setIsSidebarOpen(false);
    try {
      const res = await fetch(`${API_BASE}/v1/messages/${sId}`, { headers: { 'X-API-KEY': userApiKey } });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) { console.error("Load History Error", e); }
    finally { setIsTyping(false); }
  };

  const handleNewSession = () => {
    setSessionId(crypto.randomUUID());
    setMessages([]);
    setInput("");
    setIsSidebarOpen(false);
  };

  const renameSession = async (sId: string, title: string) => {
    if (!userApiKey) return;
    try {
      await fetch(`${API_BASE}/v1/sessions/${sId}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': userApiKey },
        body: JSON.stringify({ new_title: title.substring(0, 30) + "..." })
      });
      fetchSessions();
    } catch (e) { console.error("Rename Error", e); }
  };

  // 3. ENVÍO DE MENSAJES Y GUARDADO AUTOMÁTICO
  const handleSendMessage = async (overridePrompt?: string) => {
    const p = overridePrompt || input;
    if (!p.trim() || isTyping || !userApiKey) return;

    // Aseguramos que haya un sessionId
    const currentSessionId = sessionId || crypto.randomUUID();
    if (!sessionId) setSessionId(currentSessionId);

    const userMsg: ChatMessage = { role: 'user', content: p };
    const historyContext = messages.map(m => ({ role: m.role, content: m.content }));
    
    // Guardamos estado de si es el primer mensaje antes de actualizar el array
    const isFirstMessage = messages.length === 0;

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/v1/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': userApiKey },
        body: JSON.stringify({ 
          messages: [...historyContext, userMsg], 
          user_id: user.id, 
          session_id: currentSessionId 
        }),
      });

      const data = await response.json();
      if (response.status === 402) {
        setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ **Limit Reached.** Staying on Free is costing you money. Upgrade to continue." }]);
        return;
      }

      if (data.output?.ai_answer) {
        const cost = data.business_metrics?.cost_usd || 0;
        const gpt4Cost = data.business_metrics?.estimated_gpt4_cost || 0.01;
        const isOverdrive = cost > gpt4Cost;

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.output.ai_answer,
          stats: {
            model: data.business_metrics?.model_used || "Neural Node",
            cost: cost,
            gpt4_cost: gpt4Cost,
            savings_pct: isOverdrive ? 0 : data.business_metrics?.savings_percentage || 90,
            isOverdrive: isOverdrive,
            reasoning: isOverdrive ? "Complexity node engaged for precision." : (data.routing_decision?.reason || "Cost-optimized route.")
          }
        }]);

        // Actualizamos stats locales
        const newSavings = data.business_metrics?.savings_usd || 0;
        setStats(prev => ({ 
          daily: prev.daily + newSavings, 
          weekly: prev.weekly + newSavings, 
          total: prev.total + newSavings 
        }));

        // Si es el primer mensaje, renombramos el log
        if (isFirstMessage) {
          await renameSession(currentSessionId, p);
        } else {
          fetchSessions();
        }
      }
    } catch (e) { console.error("Dispatch Error", e); }
    finally { setIsTyping(false); }
  };

  const shareSavings = (pct: number, overdrive: boolean) => {
    const text = overdrive ? `Neural Overdrive engaged ⚡` : `Saved ${pct.toFixed(0)}% using NeuralRouting.io 🚀`;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="flex h-screen bg-[#050506] text-zinc-300 overflow-hidden font-sans relative text-white">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[50] w-72 bg-[#050505] border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-80`}>
        <div className="p-6 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
            <LayoutDashboard size={12} /> Dashboard
          </Link>
          <button onClick={handleNewSession} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
            <Plus size={14} /> New Routing Node
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 pb-10">
          <p className="text-[9px] font-black uppercase text-zinc-600 px-2 mb-4 tracking-widest italic font-bold">Optimization History</p>
          {sessions.map((sess) => (
            <div 
              key={sess.session_id} 
              onClick={() => loadChatHistory(sess.session_id)}
              className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${sessionId === sess.session_id ? 'bg-blue-600/10 border-blue-500/40 text-white' : 'bg-zinc-900/20 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/40'}`}
            >
              <div className="text-[10px] font-black uppercase italic truncate">{sess.custom_title || "Neural Session"}</div>
              <div className="text-[8px] text-emerald-500 mt-1 font-bold">LOG SECURED</div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* HEADER ADICTIVO */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#050506]/80 backdrop-blur-xl z-10">
           <div className="flex items-center gap-6">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 md:hidden hover:text-white transition-colors"><Menu size={20} /></button>
             <div className="flex flex-col gap-2">
               <div className="flex items-center gap-5">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Weekly Savings</span>
                    <span className="text-sm font-black italic text-white leading-none">${stats.weekly.toFixed(2)} / <span className="text-zinc-600">${WEEKLY_GOAL}</span></span>
                  </div>
                  <div className="w-[1px] h-6 bg-white/5" />
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Impact Total</span>
                    <span className="text-sm font-black italic text-emerald-500 leading-none">${stats.total.toFixed(2)}</span>
                  </div>
               </div>
               <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000" style={{ width: `${Math.min((stats.weekly / WEEKLY_GOAL) * 100, 100)}%` }} />
               </div>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-blue-600/20">
                Apply to my App <Rocket size={14} />
             </Link>
             <UserButton afterSignOutUrl="/" />
           </div>
        </header>

        {/* CHAT AREA */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 max-w-4xl mx-auto w-full pt-10 scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in-95">
               <Target className="text-blue-500" size={40} />
               <div className="space-y-2">
                 <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Stop Burning Cash</h1>
                 <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Neuralrouting automatically engages the most cost-efficient route.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                  {["Audit technical code", "Extract market insights"].map((t, idx) => (
                    <button key={idx} onClick={() => handleSendMessage(t)} className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-blue-600 hover:text-white transition-all text-left">
                      {t}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-4 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in`}>
              <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-5 md:p-6 rounded-[2rem] ${m.role === 'user' ? 'bg-zinc-900 border border-white/10 text-white rounded-tr-none' : 'bg-zinc-900/30 border border-white/5 text-zinc-200 rounded-tl-none backdrop-blur-md shadow-2xl'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm leading-relaxed prose prose-invert max-none">{m.content}</ReactMarkdown>
                  {m.role === 'assistant' && m.stats && (
                    <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                      <div className="flex flex-col gap-1">
                        <h4 className={`text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 ${m.stats.isOverdrive ? 'text-blue-500' : 'text-emerald-500'}`}>
                           {m.stats.isOverdrive ? <Zap size={14} /> : <Sparkles size={14} />} 
                           {m.stats.isOverdrive ? "Neural Overdrive: Maximum Precision" : `Saved ${m.stats.savings_pct.toFixed(0)}% vs GPT-4`}
                        </h4>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Actual: ${m.stats.cost.toFixed(5)} vs ${m.stats.gpt4_cost.toFixed(5)} on GPT-4</p>
                      </div>
                      <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                         <p className="text-[10px] text-zinc-400 font-medium italic">{m.stats.reasoning}</p>
                         <span className={`px-2 py-1 border rounded text-[8px] font-black uppercase ${m.stats.isOverdrive ? 'text-blue-500 border-blue-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>{m.stats.model}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => shareSavings(m.stats?.savings_pct || 0, m.stats?.isOverdrive || false)} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all"><Share2 size={12}/> Share</button>
                         <button onClick={() => handleSendMessage(`Analyze and make it cheaper`)} className="flex-1 py-3 bg-zinc-800 hover:bg-emerald-600 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all"><DollarSign size={12}/> Make Cheaper</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <div className="ml-12 text-blue-500/50 text-[10px] font-black uppercase tracking-widest animate-pulse">Neural Routing Active...</div>}
          <div className="h-40 flex-shrink-0" /> 
        </div>

        {/* INPUT */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#050506] via-[#050506] to-transparent z-10">
          <div className="max-w-3xl mx-auto relative group">
            <textarea 
              ref={textareaRef} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} 
              placeholder="Paste prompt and see how much you save..." 
              className="w-full bg-zinc-950 border border-white/10 rounded-[1.8rem] md:rounded-[2.2rem] p-5 md:p-6 pr-16 text-xs md:text-sm focus:border-blue-500 outline-none resize-none shadow-2xl backdrop-blur-2xl transition-all max-h-[200px]" 
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