"use client";
import { useState, useRef, useEffect } from 'react';
import { Plus, Send, User, Bot, History, Home, Zap, DollarSign, Loader2, Trash2, Edit3, Check, X, Menu, LayoutDashboard } from 'lucide-react';
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
    savings: string;
    water: string;
    tier?: string;
  };
}

interface ChatSession {
  session_id: string;
  created_at: string;
  custom_title?: string;
}

const NEURAL_PRESETS = [
  { 
    label: "Draft Email", 
    icon: <Send size={12}/>, 
    prompt: "Act as a Corporate Communications Expert. Draft a professional email..." 
  },
  { 
    label: "Executive Summary", 
    icon: <History size={12}/>, 
    prompt: "Analyze the following text and generate an Executive Summary..." 
  },
  { 
    label: "Technical Audit", 
    icon: <Zap size={12}/>, 
    prompt: "Act as a Senior Engineer. Review this code for vulnerabilities..." 
  },
  { 
    label: "Data Insights", 
    icon: <DollarSign size={12}/>, 
    prompt: "Take the role of a Data Analyst. Analyze these metrics..." 
  },
];

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ NUEVA LÓGICA: Recuperar la API Key de Supabase para autenticar el Chat
  useEffect(() => {
    async function initChat() {
      if (!isLoaded || !user) return;

      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data } = await supabase
          .from('api_keys')
          .select('key')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data?.key) {
          setUserApiKey(data.key);
        }
      } catch (e) {
        console.error("Failed to load Neural Key", e);
      }
    }
    initChat();
  }, [isLoaded, user]);

  useEffect(() => {
    if (isLoaded && user?.id && userApiKey) {
      const pendingMsg = localStorage.getItem('pending_neural_msg');
      if (pendingMsg) {
        setInput(pendingMsg);
        localStorage.removeItem('pending_neural_msg');
      }
      if (!sessionId) {
        setSessionId(crypto.randomUUID());
        setMessages([{ role: 'assistant', content: 'Neural Engine Online. Infrastructure logs synced.' }]);
      }
      fetchSessions();
    }
  }, [isLoaded, user?.id, userApiKey]);

  useEffect(() => {
    if (scrollRef.current && (isTyping || messages.length > 0)) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const fetchSessions = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`https://web-production-4f439.up.railway.app/v1/sessions/${user.id}`, {
        headers: { 'X-API-KEY': userApiKey || "" }
      });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (e) { console.error("Session Fetch Error", e); }
  };

  const loadChatHistory = async (sId: string) => {
    if (!sId || editingId || !userApiKey) return;
    setIsTyping(true);
    setMessages([]);
    setIsSidebarOpen(false);
    setSessionId(sId);
    try {
      const response = await fetch(`https://web-production-4f439.up.railway.app/v1/messages/${sId}`, {
        headers: { 'X-API-KEY': userApiKey }
      });
      const data = await response.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) { console.error("Sync Error:", e); }
    finally { setIsTyping(false); }
  };

  const confirmDelete = async () => {
    if (!sessionToDelete || !userApiKey) return;
    try {
      await fetch(`https://web-production-4f439.up.railway.app/v1/sessions/${sessionToDelete}`, { 
        method: 'DELETE',
        headers: { 'X-API-KEY': userApiKey }
      });
      if (sessionToDelete === sessionId) handleNewSession();
      fetchSessions();
    } catch (e) { console.error("Delete Error", e); }
    finally {
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const renameSession = async (sId: string, newTitle: string) => {
    if (!userApiKey) return;
    try {
      await fetch(`https://web-production-4f439.up.railway.app/v1/sessions/${sId}/rename`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': userApiKey
        },
        body: JSON.stringify({ new_title: newTitle })
      });
      setEditingId(null);
      fetchSessions();
    } catch (e) { console.error("Rename Error", e); }
  };

  const handleNewSession = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    setMessages([{ role: 'assistant', content: 'New session node established.' }]);
    setInput("");
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    if (!user?.id) {
      localStorage.setItem('pending_neural_msg', input.trim());
      document.getElementById('clerk-auth-trigger')?.click();
      return;
    }

    if (!userApiKey) {
      alert("Neural Key not found. Please refresh the page.");
      return;
    }

    const currentPrompt = input.trim();
    const userMsg: ChatMessage = { role: 'user', content: currentPrompt };
    const cleanContext = messages.map(({ role, content }) => ({ role, content }));
    const contextWithNewMsg = [...cleanContext, { role: userMsg.role, content: userMsg.content }];

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('https://web-production-4f439.up.railway.app/v1/dispatch', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': userApiKey // ✅ USANDO LA KEY REAL
        },
        body: JSON.stringify({
          messages: contextWithNewMsg,
          user_id: user.id,
          session_id: sessionId
        }),
      });

      const data = await response.json();
      
      // Manejo de error de saldo
      if (response.status === 402) {
          setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Free Tier reached. Please upgrade your plan in the Dashboard to continue using NeuralRouting." }]);
          return;
      }

      const aiAnswer = data.output?.ai_answer || data.ai_answer || data.content;

      if (aiAnswer) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiAnswer.replace(/^User:.*?\n/i, '').trim(),
          stats: {
            model: data.routing?.model_used || "Neural Node",
            savings: data.routing?.cost_saved?.toString() || "0.0001",
            water: "0.0125L"
          }
        }]);

        if (messages.length <= 1) {
          const finalTitle = currentPrompt.substring(0, 25) + "...";
          await renameSession(sessionId, finalTitle);
        } else {
          fetchSessions();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural Node connection failed. Please check your credentials." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-300 overflow-hidden font-sans relative text-white">
      <style jsx global>{`
        .n-scroll::-webkit-scrollbar { width: 5px; }
        .n-scroll::-webkit-scrollbar-track { background: transparent; }
        .n-scroll::-webkit-scrollbar-thumb { background: #1f1f23; border-radius: 10px; }
      `}</style>

      <div className="hidden">
        <SignInButton mode="modal">
          <button id="clerk-auth-trigger">Auth</button>
        </SignInButton>
      </div>

      {/* MODAL ELIMINAR */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#050505] border border-zinc-800 rounded-[2rem] p-8 shadow-2xl text-center text-white">
             <Trash2 size={28} className="text-red-500 mx-auto mb-4" />
             <h3 className="text-lg font-black uppercase italic mb-2">Delete Log</h3>
             <p className="text-xs text-zinc-500 mb-6">Are you sure? This action is irreversible.</p>
             <div className="flex gap-3">
               <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
               <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Delete</button>
             </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[50] w-72 bg-[#050505] border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:w-80`}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
              <Home size={12} /> Return to Base
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-white"><X size={20} /></button>
          </div>
          <button onClick={handleNewSession} className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all cursor-pointer shadow-lg active:scale-95">
            <Plus size={14} /> New Session
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 n-scroll pb-10">
          <p className="text-[9px] font-black uppercase text-zinc-600 px-2 mb-4 tracking-widest italic">Infrastructure Logs</p>
          {sessions.map((sess) => (
            <div key={sess.session_id} className={`group relative p-4 rounded-xl border transition-all ${sessionId === sess.session_id ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'bg-zinc-900/20 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/40'}`}>
              <div onClick={() => loadChatHistory(sess.session_id)} className="cursor-pointer">
                {editingId === sess.session_id ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input autoFocus className="bg-black border border-blue-500 rounded px-2 py-1 text-[10px] w-full outline-none text-white font-bold" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    <button onClick={() => renameSession(sess.session_id, editValue)} className="text-green-500"><Check size={12}/></button>
                    <button onClick={() => setEditingId(null)} className="text-red-500"><X size={12}/></button>
                  </div>
                ) : (
                  <>
                    <div className="text-[10px] font-black uppercase italic truncate pr-12">{sess.custom_title || `Log: ${sess.session_id.slice(0, 10)}`}</div>
                    <div className="text-[8px] text-zinc-700 mt-1 uppercase font-bold">{new Date(sess.created_at).toLocaleDateString()}</div>
                  </>
                )}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-1 rounded-lg">
                <button onClick={(e) => { e.stopPropagation(); setEditingId(sess.session_id); setEditValue(sess.custom_title || ""); }} className="p-1 hover:text-blue-500 text-zinc-600"><Edit3 size={12} /></button>
                <button onClick={(e) => { e.stopPropagation(); openDeleteModal(sess.session_id); }} className="p-1 hover:text-red-500 text-zinc-600"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ÁREA DE CHAT PRINCIPAL */}
      <main className="flex-1 flex flex-col bg-[#09090b] relative w-full overflow-hidden">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-[#09090b]/50 backdrop-blur-xl z-10">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 md:hidden"><Menu size={20} /></button>
             <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
               <Bot className="text-blue-500" size={20} />
             </div>
             <div>
               <h2 className="text-sm font-black uppercase italic text-white tracking-tight leading-none">Neural Assistant v1.0</h2>
               <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mt-1 italic">{isTyping ? 'Syncing...' : 'Neural Link: Active'}</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-200 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-full hover:bg-blue-600/10 hover:border-blue-500/30 transition-all group">
                Dashboard <LayoutDashboard size={12} className="text-zinc-500 group-hover:text-blue-500" />
             </Link>
             <UserButton afterSignOutUrl="/" />
           </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 max-w-5xl mx-auto w-full n-scroll">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-3 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in`}>
              <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${m.role === 'assistant' ? 'bg-blue-600/10 border-blue-500/20' : 'bg-zinc-800 border-zinc-700'}`}>
                  {m.role === 'assistant' ? <Zap size={14} className="text-blue-500" /> : <User size={14} className="text-zinc-500" />}
                </div>
                <div className={`p-4 md:p-5 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter style={vscDarkPlus as any} language={match[1]} PreTag="div" className="rounded-lg my-4 text-[11px] md:text-sm" {...props}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-blue-400 font-mono" {...props}>{children}</code>
                        );
                      },
                    }}
                    className="text-xs md:text-sm leading-relaxed prose prose-invert"
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
              {m.role === 'assistant' && m.stats && (
                <div className="flex gap-4 ml-12 text-[8px] font-black uppercase text-zinc-600 tracking-widest italic">
                  <span>MOD: {m.stats.model}</span>
                  <span>SAV: ${m.stats.savings}</span>
                </div>
              )}
            </div>
          ))}
          {isTyping && <div className="ml-12 flex items-center gap-2 text-blue-500/50 text-[10px] font-black uppercase tracking-widest"><Loader2 size={12} className="animate-spin" /> Syncing Node...</div>}
          <div className="h-32 flex-shrink-0" /> 
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#09090b] to-transparent z-10">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              ref={textareaRef} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} 
              placeholder={user ? "Execute neural command..." : "Sign In to execute..."} 
              className="w-full bg-black border border-zinc-800 rounded-[2rem] p-4 md:p-6 pr-16 md:pr-20 text-xs md:text-sm focus:border-blue-500 outline-none resize-none n-scroll shadow-2xl backdrop-blur-xl" 
              rows={1} 
            />
            <button onClick={handleSendMessage} disabled={isTyping || !input.trim() || !userApiKey} className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer text-white">
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}