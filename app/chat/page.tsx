"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  Plus, Send, LayoutDashboard, Sparkles, ArrowUpRight, 
  Copy, RefreshCcw, ShieldCheck, DollarSign, Terminal,
  Zap, Coins, CheckCircle2, ChevronDown, AlertCircle, TrendingDown, Lightbulb, MousePointerClick,
  Wand2, ZapOff
} from 'lucide-react';
import Link from 'next/link';
import { useUser, UserButton, useAuth } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
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
  const [autoOptimize, setAutoOptimize] = useState(false); // 🔥 EL TOGGLE INSANO
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  
  const [stats, setStats] = useState({ total_saved: 0, best_saving: 0, avg_saving: 0 });
  const [sessionSaved, setSessionSaved] = useState(0);
  const [lastApplied, setLastApplied] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_BASE = "https://web-production-4f439.up.railway.app";

  const fetchUserStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/v1/user-stats/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStats({
          total_saved: data.total_savings || 0,
          best_saving: data.best_saving_pct || 0,
          avg_saving: data.avg_saving_pct || 0
        });
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    async function init() {
      if (!isLoaded || !user) return;
      const token = await getToken({ template: 'supabase' });
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: { Authorization: `Bearer ${token}` } } });
      const { data } = await supabase.from('api_keys').select('key').eq('user_id', user.id).maybeSingle();
      if (data?.key) setUserApiKey(data.key);
      await fetchUserStats();
    }
    init();
  }, [isLoaded, user]);

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

    try {
      const response = await fetch(`${API_BASE}/v1/dispatch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'X-API-KEY': userApiKey,
          'X-Routing-Mode': activeMode.toLowerCase(),
          'X-Auto-Optimize': autoOptimize.toString() 
        },
        body: JSON.stringify({ 
          messages: [...messages.map(m=>({role:m.role,content:m.content})), {role:'user',content:prompt}], 
          user_id: user?.id, 
          session_id: currentSessionId 
        }),
      });

      const data = await response.json();
      
      if (data.output?.ai_answer) {
        const actualCost = data.business_metrics?.cost_usd || 0.0001;
        const gpt4Ref = Math.max(data.business_metrics?.gpt4_cost_reference || 0, actualCost);
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.output.ai_answer,
          stats: {
            model: data.business_metrics?.model_used || "Neural-Router",
            cost: actualCost,
            gpt4_cost_ref: gpt4Ref,
            savings_pct: data.business_metrics?.savings_percentage || 0,
            reasoning: data.business_metrics?.routing_reason || "Optimizing infrastructure...",
            insight: data.business_metrics?.insight || null
          }
        }]);
        
        setSessionSaved(prev => prev + (gpt4Ref - actualCost));
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
          
          {/* AUTO-OPTIMIZE TOGGLE (INSANO) */}
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
           <div className="space-y-4">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Routing Strategy</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { m: 'Auto', d: 'Balanced Cost & Intelligence' },
                  { m: 'Cost', d: 'Strictly lowest price models' },
                  { m: 'Speed', d: 'Lowest latency providers' },
                  { m: 'Quality', d: 'Elite reasoning models' }
                ].map(item => (
                  <button key={item.m} onClick={() => setRoutingMode(item.m as RoutingMode)} className={`p-4 rounded-xl text-left border transition-all ${routingMode === item.m ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/5 hover:border-white/10'}`}>
                    <div className="text-[10px] font-black uppercase">{item.m}</div>
                    <div className="text-[8px] opacity-60 font-medium leading-tight mt-1">{item.d}</div>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
        
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
           <UserButton afterSignOutUrl="/" />
        </header>

        {/* CHAT AREA */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-20 max-w-5xl mx-auto w-full pt-12 scrollbar-hide pb-40">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-10 animate-in fade-in duration-1000">
               <div className="relative group">
                 <div className="absolute inset-0 bg-blue-500 blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity" />
                 <Zap className="text-blue-500 fill-blue-500 relative" size={64} />
               </div>
               <div className="space-y-4">
                 <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">Ask anything. <br /> We'll optimize in real time.</h1>
                 <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.6em]">Infrastructure intelligence for the AI era</p>
               </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-6 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-4 max-w-[98%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-6 md:p-10 rounded-2xl md:rounded-[3rem] relative shadow-2xl transition-all ${m.role === 'user' ? 'bg-zinc-900 border border-white/10 text-white rounded-tr-none' : 'bg-[#0a0a0b] border border-white/5 text-zinc-200 rounded-tl-none'}`}>
                  
                  {/* SAVINGS BADGE */}
                  {m.role === 'assistant' && m.stats && (
                    <div className="absolute -top-3 left-4 md:left-10 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                      <TrendingDown size={12} strokeWidth={3} /> Saved ${(m.stats.gpt4_cost_ref - m.stats.cost).toFixed(4)} ({m.stats.savings_pct.toFixed(0)}%)
                    </div>
                  )}

                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    className="text-sm md:text-base leading-relaxed prose prose-invert max-w-none"
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter style={vscDarkPlus as any} language={match[1]} PreTag="div" {...props}>
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
                  
                  {/* INSIGHTS & METRICS */}
                  {m.role === 'assistant' && m.stats && (
                    <div className="mt-12 pt-12 border-t border-white/5 space-y-10">
                      
                      {/* NEURAL INSIGHT - INSANO VERSION */}
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
                            {lastApplied === i.toString() ? <>Applied <CheckCircle2 size={14} /></> : <>Switch to {m.stats.insight.recommended_mode} Mode <MousePointerClick size={14} /></>}
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-center group">
                            <span className="text-[8px] font-black text-zinc-700 uppercase block mb-1 group-hover:text-red-400 transition-colors">GPT-4 Standard</span>
                            <span className="text-xs font-bold text-red-400/30 italic">${m.stats.gpt4_cost_ref.toFixed(5)}</span>
                         </div>
                         <div className="bg-blue-600/5 p-5 rounded-2xl border border-blue-500/20 text-center">
                            <span className="text-[8px] font-black text-blue-500 uppercase block mb-1">Neural Cost</span>
                            <span className="text-xs font-black text-blue-400">${m.stats.cost.toFixed(5)}</span>
                         </div>
                         <div className="bg-emerald-600/5 p-5 rounded-2xl border border-emerald-500/20 text-center">
                            <span className="text-[8px] font-black text-emerald-500 uppercase block mb-1">Cost Reduction</span>
                            <span className="text-xs font-black text-emerald-400">{m.stats.savings_pct.toFixed(0)}% OFF</span>
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
        </div>

        {/* INPUT AREA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-[#050506] via-[#050506] to-transparent z-30">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              ref={textareaRef} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} 
              placeholder="Ask anything. We'll optimize cost in real time." 
              className="w-full bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 pr-28 text-sm focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none resize-none shadow-3xl backdrop-blur-3xl transition-all max-h-[350px] text-white placeholder:text-zinc-800" 
              rows={1} 
            />
            <button 
              onClick={() => handleSendMessage()} 
              disabled={isTyping || !input.trim() || !userApiKey} 
              className="absolute right-5 bottom-5 p-6 bg-blue-600 rounded-3xl md:rounded-[2.5rem] hover:scale-110 active:scale-95 disabled:opacity-30 transition-all text-white shadow-2xl"
            >
              <Send size={28} strokeWidth={3} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}