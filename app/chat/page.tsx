"use client";
import { useState, useRef, useEffect } from 'react';
import {
  Plus, Send, Zap, CheckCircle2, AlertCircle, TrendingDown, Lightbulb, MousePointerClick, Loader2,
  Trash2, Pencil, Check, X
} from 'lucide-react';
import Link from 'next/link';
import { useUser, UserButton, useAuth } from "@clerk/nextjs";
import { supabase as anonSupabaseClient, createAuthClient } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- TYPES ---
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  stats?: {
    model: string;
    cost: number;
    gpt4_cost_ref: number;
    savings_pct: number;
    credits_used: number;
    credits_saved: number;
    credit_tier: string;
    reasoning?: string;
    insight?: {
      recommended_mode: RoutingMode;
      extra_savings: number;
      reason: string;
    };
  };
}

type RoutingMode = 'Auto' | 'Cost' | 'Speed' | 'Quality';

export default function FullChatPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [routingMode, setRoutingMode] = useState<RoutingMode>('Auto');
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('Free Tier');

  const PLAN_ALLOWED_MODES: Record<string, RoutingMode[]> = {
    'Free Tier': ['Auto'],
    'free': ['Auto'],
    'Starter': ['Auto', 'Cost'],
    'starter': ['Auto', 'Cost'],
    'Growth': ['Auto', 'Cost', 'Speed', 'Quality'],
    'growth': ['Auto', 'Cost', 'Speed', 'Quality'],
    'Business': ['Auto', 'Cost', 'Speed', 'Quality'],
    'business': ['Auto', 'Cost', 'Speed', 'Quality'],
  };

  const FORCE_MODELS = [
    { label: 'Auto (Router decides)', value: '' },
    { label: 'GPT-4o (Premium)', value: 'gpt-4o' },
    { label: 'GPT-4o Mini (Medium)', value: 'gpt-4o-mini' },
    { label: 'Llama 3.1 8B (Budget)', value: 'llama-3.1-8b-instant' },
    { label: 'Llama 3.1 70B (Fast+)', value: 'llama-3.1-70b-versatile' },
  ];
  const [forceModel, setForceModel] = useState<string>('');

  const [stats, setStats] = useState({ total_saved: 0, best_saving: 0, avg_saving: 0 });
  const [sessionSaved, setSessionSaved] = useState(0);
  const [lastApplied, setLastApplied] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const [sessions, setSessions] = useState<{id: string, preview: string}[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabaseRef = useRef<any>(null);
  const API_BASE = "https://web-production-4f439.up.railway.app";

  const fetchUserStats = async (apiKey?: string) => {
    if (!user) return;
    const key = apiKey || userApiKey;
    if (!key) return;
    try {
      const res = await fetch(`${API_BASE}/v1/user-stats/${user.id}`, {
        headers: { 'X-API-KEY': key }
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          total_saved: data.total_savings || 0,
          best_saving: data.best_saving_pct || 0,
          avg_saving: data.avg_saving_pct || 0
        });
        if (data.plan) setUserPlan(data.plan);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { setKeyLoading(false); return; }
    async function init() {
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = createAuthClient(token!);
        supabaseRef.current = supabase;
        const { data, error } = await supabase.from('api_keys').select('key').eq('user_id', user!.id).maybeSingle();
        if (error) console.error('Failed to fetch API key:', error.message);
        if (data?.key) {
          setUserApiKey(data.key);
          await fetchUserStats(data.key);
        }
      } catch (e) {
        console.error('Init failed:', e);
      } finally {
        setKeyLoading(false);
      }
    }
    init();
  }, [isLoaded, user]);

  // ✅ Auto-scroll con delay para asegurar renderizado de Markdown
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ 
          top: scrollRef.current.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 100);
    }
  }, [messages, isTyping]);

  // Load session history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nr_chat_sessions');
    if (stored) setSessions(JSON.parse(stored));
  }, []);

  const persistSession = (id: string, preview: string) => {
    const stored = localStorage.getItem('nr_chat_sessions');
    const existing: {id: string, preview: string}[] = stored ? JSON.parse(stored) : [];
    const updated = [{ id, preview: preview.slice(0, 55) }, ...existing.filter(s => s.id !== id)].slice(0, 15);
    localStorage.setItem('nr_chat_sessions', JSON.stringify(updated));
    setSessions(updated);
  };

  const deleteSession = async (id: string) => {
    const stored = localStorage.getItem('nr_chat_sessions');
    const existing: {id: string, preview: string}[] = stored ? JSON.parse(stored) : [];
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem('nr_chat_sessions', JSON.stringify(updated));
    setSessions(updated);
    if (sessionId === id) { setMessages([]); setSessionId(""); setSessionSaved(0); }
    const client = supabaseRef.current || anonSupabaseClient;
    await client.from('chat_messages').delete().eq('session_id', id);
  };

  const renameSession = (id: string, newPreview: string) => {
    const stored = localStorage.getItem('nr_chat_sessions');
    const existing: {id: string, preview: string}[] = stored ? JSON.parse(stored) : [];
    const updated = existing.map(s => s.id === id ? { ...s, preview: newPreview.slice(0, 55) } : s);
    localStorage.setItem('nr_chat_sessions', JSON.stringify(updated));
    setSessions(updated);
    setRenamingId(null);
  };

  const loadSession = async (id: string) => {
    const client = supabaseRef.current || anonSupabaseClient;
    const { data, error } = await client.from('chat_messages')
      .select('role, content')
      .eq('session_id', id)
      .order('created_at');
    if (error) { console.error('Failed to load session:', error.message, error); return; }
    setMessages((data || []).map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content })));
    setSessionId(id);
    setSessionSaved(0);
  };

  const ensureSession = async (sessionId: string, title: string) => {
    const client = supabaseRef.current || anonSupabaseClient;
    const { error } = await client.from('chat_sessions').upsert({
      id: sessionId,
      user_id: user?.id ?? null,
      title: title.slice(0, 100),
      created_at: new Date().toISOString(),
    }, { onConflict: 'id', ignoreDuplicates: true });
    if (error) console.error('Failed to ensure session:', error.message, error.details);
  };

  const saveMessage = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
    const client = supabaseRef.current || anonSupabaseClient;
    const { error } = await client.from('chat_messages').insert({
      session_id: sessionId,
      role,
      content,
      user_id: user?.id ?? null,
    });
    if (error) console.error('Failed to save message:', error.message, error.details);
  };

  const handleSendMessage = async (overridePrompt?: string, modeOverride?: RoutingMode) => {
    const prompt = overridePrompt || input;
    let activeMode = modeOverride || routingMode;
    
    if (!prompt.trim() || isTyping || !userApiKey) return;

    setErrorDetails(null);
    const currentSessionId = sessionId || crypto.randomUUID();
    if (!sessionId) setSessionId(currentSessionId);

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInput("");
    setIsTyping(true);
    if (!sessionId) persistSession(currentSessionId, prompt);
    await ensureSession(currentSessionId, prompt);
    await saveMessage(currentSessionId, 'user', prompt);

    try {
      const response = await fetch(`${API_BASE}/v1/dispatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': userApiKey,
          'X-Routing-Mode': activeMode.toLowerCase(),
          'X-Auto-Optimize': autoOptimize.toString(),
          ...(forceModel ? { 'X-Force-Model': forceModel } : {}),
        },
        body: JSON.stringify({ 
          messages: [...messages.map(m=>({role:m.role,content:m.content})), {role:'user',content:prompt}], 
          user_id: user?.id, 
          session_id: currentSessionId 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorDetails(data.detail || data.details || `Error ${response.status}`);
      } else if (data.output?.ai_answer) {
        const actualCost = data.business_metrics?.cost_usd || 0.0001;
        const gpt4Ref = Math.max(data.business_metrics?.estimated_gpt4_cost || 0, actualCost);

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.output.ai_answer,
          stats: {
            model: data.model_used || "Neural-Router",
            cost: actualCost,
            gpt4_cost_ref: gpt4Ref,
            savings_pct: data.business_metrics?.savings_percentage || 0,
            credits_used: data.business_metrics?.credits_used || 1,
            credits_saved: data.business_metrics?.credits_saved || 0,
            credit_tier: data.business_metrics?.credit_tier || "budget",
            reasoning: "Optimizing infrastructure...",
            insight: undefined
          }
        }]);

        setSessionSaved(prev => prev + Math.max(0, gpt4Ref - actualCost));
        await saveMessage(currentSessionId, 'assistant', data.output.ai_answer);
        await fetchUserStats();
      }
    } catch (e) {
      setErrorDetails(`Request failed: Check credits or provider availability.`);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="flex h-screen bg-[#050506] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-80 bg-[#080809] border-r border-white/5 flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 space-y-6">
          <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-500/5 translate-y-12 group-hover:translate-y-0 transition-transform duration-1000" />
             <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] block mb-2 relative">Lifetime Savings</span>
             <div className="text-4xl font-black text-white italic tracking-tighter flex items-baseline relative">
               <span className="text-blue-500 mr-1">$</span>{stats.total_saved.toFixed(2)}
             </div>
          </div>
          
          <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${autoOptimize ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900/50 border-white/5'}`}>
             <div className="flex flex-col">
               <span className={`text-[9px] font-black uppercase ${autoOptimize ? 'text-emerald-500' : 'text-zinc-500'}`}>Auto-Optimize</span>
               <span className="text-[7px] text-zinc-600 uppercase font-bold tracking-tighter">AI-Driven Selection</span>
             </div>
             <button onClick={() => setAutoOptimize(!autoOptimize)} className={`w-10 h-5 rounded-full relative transition-colors ${autoOptimize ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoOptimize ? 'left-6' : 'left-1'}`} />
             </button>
          </div>

          <button onClick={() => {setMessages([]); setSessionId(crypto.randomUUID()); setSessionSaved(0)}} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
            <Plus size={14} strokeWidth={3} /> New Session
          </button>
        </div>

        <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-hide">

           {/* SESSION HISTORY */}
           {sessions.length > 0 && (
             <div className="space-y-2">
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Recent Chats</span>
               <div className="space-y-1">
                 {sessions.map(s => (
                   <div
                     key={s.id}
                     className={`group relative flex items-center rounded-xl border transition-all ${sessionId === s.id ? 'bg-blue-600/10 border-blue-500/20' : 'border-transparent hover:bg-zinc-900/60'}`}
                   >
                     {renamingId === s.id ? (
                       <div className="flex items-center w-full px-2 py-1.5 gap-1">
                         <input
                           autoFocus
                           value={renameValue}
                           onChange={e => setRenameValue(e.target.value)}
                           onKeyDown={e => { if (e.key === 'Enter') renameSession(s.id, renameValue); if (e.key === 'Escape') setRenamingId(null); }}
                           className="flex-1 bg-zinc-800 text-white text-[10px] font-bold rounded-lg px-2 py-1 outline-none border border-blue-500/40 min-w-0"
                         />
                         <button onClick={() => renameSession(s.id, renameValue)} className="p-1 text-emerald-400 hover:text-emerald-300"><Check size={12} /></button>
                         <button onClick={() => setRenamingId(null)} className="p-1 text-zinc-500 hover:text-white"><X size={12} /></button>
                       </div>
                     ) : (
                       <>
                         <button onClick={() => loadSession(s.id)} className="flex-1 text-left px-3 py-2.5 min-w-0">
                           <p className={`text-[10px] font-bold truncate leading-snug ${sessionId === s.id ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300'}`}>{s.preview}</p>
                         </button>
                         <div className="hidden group-hover:flex items-center gap-0.5 pr-2 shrink-0">
                           <button
                             onClick={() => { setRenamingId(s.id); setRenameValue(s.preview); }}
                             className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all"
                             title="Rename"
                           ><Pencil size={11} /></button>
                           <button
                             onClick={() => deleteSession(s.id)}
                             className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                             title="Delete"
                           ><Trash2 size={11} /></button>
                         </div>
                       </>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           )}

           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Routing Strategy</span>
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  userPlan === 'Business' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                  userPlan === 'Growth'   ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                  userPlan === 'Starter'  ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                  'text-zinc-500 border-white/10 bg-white/5'
                }`}>{userPlan}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {([
                  { m: 'Auto',    d: 'Balanced Cost & Intelligence' },
                  { m: 'Cost',    d: 'Strictly lowest price models' },
                  { m: 'Speed',   d: 'Lowest latency providers' },
                  { m: 'Quality', d: 'Elite reasoning models' }
                ] as { m: RoutingMode; d: string }[]).map(item => {
                  const allowed = (PLAN_ALLOWED_MODES[userPlan] ?? ['Auto']).includes(item.m);
                  return (
                    <button
                      key={item.m}
                      disabled={!allowed}
                      onClick={() => allowed && setRoutingMode(item.m)}
                      title={!allowed ? `Upgrade to unlock ${item.m} mode` : undefined}
                      className={`p-4 rounded-xl text-left border transition-all relative ${
                        routingMode === item.m && allowed
                          ? 'bg-white text-black border-white'
                          : allowed
                          ? 'bg-transparent text-zinc-500 border-white/5 hover:border-white/10'
                          : 'bg-transparent text-zinc-700 border-white/5 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase">{item.m}</span>
                        {!allowed && <span className="text-[7px] text-zinc-600 uppercase font-black">🔒 Upgrade</span>}
                      </div>
                      <div className="text-[8px] opacity-60 font-medium leading-tight mt-1">{item.d}</div>
                    </button>
                  );
                })}
              </div>

              {/* Force Model picker — available for Starter and above */}
              {(PLAN_ALLOWED_MODES[userPlan] ?? []).includes('Cost') && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Force Model</span>
                  <select
                    value={forceModel}
                    onChange={e => setForceModel(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-[10px] font-bold text-zinc-300 uppercase tracking-wide focus:border-blue-500 outline-none"
                  >
                    {FORCE_MODELS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {forceModel && (
                    <p className="text-[8px] text-amber-400 font-bold uppercase tracking-widest">
                      ⚡ Router overridden — using {forceModel}
                    </p>
                  )}
                </div>
              )}
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
        
        {/* HEADER */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-6 md:px-8 backdrop-blur-3xl z-20">
           <div className="flex items-center gap-10">
             <div className="flex flex-col">
               <h2 className="text-sm font-black uppercase italic tracking-tighter text-white">Neural Routing</h2>
               <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Session saved: <span className="text-emerald-400 animate-in fade-in slide-in-from-bottom-1">${sessionSaved.toFixed(4)}</span></span>
               </div>
             </div>
             
             <div className="hidden xl:flex items-center gap-8 border-l border-white/10 pl-10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-zinc-700 uppercase">Avg Saving</span>
                  <span className="text-xs font-bold text-blue-400">{stats.avg_saving.toFixed(0)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-zinc-700 uppercase">Best Request</span>
                  <span className="text-xs font-bold text-emerald-400">{stats.best_saving.toFixed(0)}%</span>
                </div>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2">
               <Link href="/" className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Home</Link>
               <Link href="/dashboard" className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">Dashboard</Link>
             </div>
             <UserButton afterSignOutUrl="/" />
           </div>
        </header>

        {/* CHAT AREA */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-20 max-w-5xl mx-auto w-full pt-12 scrollbar-hide pb-8">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-10 animate-in fade-in duration-1000">
               <div className="relative group">
                 <div className="absolute inset-0 bg-blue-500 blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity" />
                 <Zap className="text-blue-500 fill-blue-500 relative" size={64} />
               </div>
               <div className="space-y-4">
                 {sessionId ? (
                   <>
                     <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">No messages in this session.</h1>
                     <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.6em]">This is an old session with no saved history — start typing to continue.</p>
                   </>
                 ) : (
                   <>
                     <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">Ask anything. <br /> We'll optimize in real time.</h1>
                     <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.6em]">Infrastructure intelligence for the AI era</p>
                   </>
                 )}
               </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-6 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-4 max-w-[98%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-6 md:p-10 rounded-2xl md:rounded-[3rem] relative shadow-2xl transition-all ${m.role === 'user' ? 'bg-zinc-900 border border-white/10 text-white rounded-tr-none' : 'bg-[#0a0a0b] border border-white/5 text-zinc-200 rounded-tl-none'}`}>
                  
                  {m.role === 'assistant' && m.stats && (
                    <div className="absolute -top-3 left-4 md:left-10 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                      <TrendingDown size={12} strokeWidth={3} />
                      {m.stats.credits_used} cr used · saved {m.stats.credits_saved} cr ({m.stats.savings_pct.toFixed(0)}% off GPT-4o)
                    </div>
                  )}

                  <div className="text-sm md:text-base leading-relaxed prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isBlock = match || String(children).includes('\n')
                        return isBlock ? (
                          <SyntaxHighlighter style={vscDarkPlus as any} language={match?.[1] || 'text'} PreTag="div">
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-400 font-mono" {...props}>{children}</code>
                        )
                      }
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                  </div>

                  {m.role === 'assistant' && m.stats && (
                    <div className="mt-12 pt-12 border-t border-white/5 space-y-10">
                      {m.stats.insight && (
                        <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 group relative overflow-hidden">
                          <div className="flex items-center gap-5 relative z-10">
                            <div className="p-3 bg-blue-600/10 rounded-2xl"><Lightbulb size={20} className="text-blue-500 animate-pulse" /></div>
                            <div className="space-y-1">
                              <p className="text-[11px] text-white font-black uppercase italic tracking-tight">You're overpaying for this request.</p>
                              <p className="text-[10px] text-zinc-400 font-medium">Based on {m.stats.insight.reason}, switching to <strong>{m.stats.insight.recommended_mode} Mode</strong> could save an extra <strong>{m.stats.insight.extra_savings}%</strong>.</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => { setRoutingMode(m.stats?.insight?.recommended_mode || 'Auto'); handleSendMessage(`Switch to ${m.stats?.insight?.recommended_mode} and optimize.`, m.stats?.insight?.recommended_mode); setLastApplied(i.toString()); }} 
                            className={`text-[10px] font-black uppercase px-6 py-3 rounded-2xl transition-all flex items-center gap-2 relative z-10 ${lastApplied === i.toString() ? 'bg-emerald-500 text-black' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                          >
                            {lastApplied === i.toString() ? <>Applied <CheckCircle2 size={14} /></> : <>Switch Mode <MousePointerClick size={14} /></>}
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                         <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center group">
                            <span className="text-[7px] font-black text-zinc-700 uppercase block mb-1 group-hover:text-red-400 transition-colors">GPT-4 Price</span>
                            <span className="text-xs font-bold text-red-400/40 italic">${m.stats.gpt4_cost_ref.toFixed(5)}</span>
                         </div>
                         <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-500/20 text-center">
                            <span className="text-[7px] font-black text-blue-500 uppercase block mb-1">Neural Cost</span>
                            <span className="text-xs font-black text-blue-400">${m.stats.cost.toFixed(5)}</span>
                         </div>
                         <div className={`p-4 rounded-2xl border text-center ${
                           m.stats.credit_tier === 'premium' ? 'bg-purple-600/5 border-purple-500/20' :
                           m.stats.credit_tier === 'medium'  ? 'bg-blue-600/5 border-blue-500/20' :
                           'bg-emerald-600/5 border-emerald-500/20'
                         }`}>
                            <span className="text-[7px] font-black text-zinc-500 uppercase block mb-1">Credits Used</span>
                            <span className={`text-xs font-black ${
                              m.stats.credit_tier === 'premium' ? 'text-purple-400' :
                              m.stats.credit_tier === 'medium'  ? 'text-blue-400' : 'text-emerald-400'
                            }`}>{m.stats.credits_used} cr</span>
                         </div>
                         <div className="bg-emerald-600/5 p-4 rounded-2xl border border-emerald-500/20 text-center">
                            <span className="text-[7px] font-black text-emerald-500 uppercase block mb-1">Saved</span>
                            <span className="text-xs font-black text-emerald-400">{m.stats.savings_pct.toFixed(0)}% off</span>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="ml-12 flex items-center gap-5">
              <div className="flex gap-2">
                {[0, 200, 400].map(delay => (
                  <div key={delay} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:`${delay}ms`}} />
                ))}
              </div>
              <span className="text-blue-500/50 text-[10px] font-black uppercase tracking-[0.5em] italic">Routing to optimal provider...</span>
            </div>
          )}

          {errorDetails && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-400">{errorDetails}</p>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="flex-shrink-0 p-4 md:p-8 bg-gradient-to-t from-[#050506] via-[#050506]/95 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              ref={textareaRef} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} 
              placeholder="Ask anything. We'll optimize cost in real time." 
              className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl md:rounded-[3.5rem] p-5 md:p-8 pr-16 md:pr-28 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none resize-none shadow-3xl backdrop-blur-3xl transition-all max-h-[250px] text-white placeholder:text-zinc-800" 
              rows={1} 
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isTyping || !input.trim() || !userApiKey || keyLoading}
              className="absolute right-3 bottom-3 md:right-5 md:bottom-5 h-10 w-10 md:h-16 md:w-16 bg-blue-600 rounded-full md:rounded-[2rem] flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-30 transition-all text-white shadow-2xl z-50"
            >
              {keyLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-7 md:h-7" strokeWidth={3} />}
            </button>
          </div>
          {!keyLoading && !userApiKey && (
            <p className="text-center text-[10px] font-black text-red-500/60 uppercase tracking-widest mt-3">
              No API key found — <a href="/setup" className="underline hover:text-red-400 transition-colors">get one here</a>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}