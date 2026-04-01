"use client";
import { useState, useRef, useEffect } from 'react';
import { Plus, Send, User, Bot, History, Home, Zap, DollarSign, Loader2, Trash2, Edit3, Check, X, Menu, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
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
    prompt: "Act as a Corporate Communications Expert. Draft a professional email to [Recipient] regarding [Subject]. The goal is to [Goal]. Maintain a [Professional/Firm] tone and include a clear Call to Action." 
  },
  { 
    label: "Executive Summary", 
    icon: <History size={12}/>, 
    prompt: "Analyze the following text and generate an Executive Summary for leadership. Structure into: 1) Context, 2) Critical Findings, and 3) Actionable Steps. Text: [Paste here]" 
  },
  { 
    label: "Technical Audit", 
    icon: <Zap size={12}/>, 
    prompt: "Act as a Senior Engineer. Review this code for vulnerabilities or performance issues. Explain the risks and provide the optimized fix: [Paste code]" 
  },
  { 
    label: "Data Insights", 
    icon: <DollarSign size={12}/>, 
    prompt: "Take the role of a Data Analyst. Analyze these metrics, detect trends or anomalies, and provide 3 actionable business insights: [Paste data]" 
  },
];

export default function FullChatPage() {
  const { user, isLoaded } = useUser();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ Multi-tenant: Get Clerk ID dynamically
  const getTargetId = () => {
    if (!isLoaded || !user) return "guest";
    return user.id;
  };

  useEffect(() => {
    if (isLoaded) {
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
  }, [isLoaded, user?.id]); // Reload when user ID becomes available

  useEffect(() => {
    if (scrollRef.current && isTyping) {
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight, 
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const fetchSessions = async () => {
    const targetId = getTargetId();
    if (targetId === "guest") return;

    try {
      const response = await fetch(`https://web-production-4f439.up.railway.app/v1/sessions/${targetId}`, {
        headers: { 'X-API-KEY': 'nr-dev-secret-123' }
      });
      
      if (!response.ok) return;

      const data = await response.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (e) { console.error("Session Fetch Error", e); }
  };

  const loadChatHistory = async (sId: string) => {
    if (!sId || editingId) return;
    setIsTyping(true);
    setMessages([]);
    setIsSidebarOpen(false);
    setSessionId(sId);
    try {
      const response = await fetch(`https://web-production-4f439.up.railway.app/v1/messages/${sId}`, {
        headers: { 'X-API-KEY': 'nr-dev-secret-123' }
      });
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const history: ChatMessage[] = data.map((msg: any) => ({
          role: msg.prompt ? 'user' : 'assistant',
          content: msg.prompt || msg.ai_response,
          stats: msg.ai_response ? {
            model: msg.model_selected || "Neural Node",
            savings: msg.cost_saved || "0.0000",
            water: "0.0125L"
          } : undefined
        }));
        setMessages(history);
      }
    } catch (e) { console.error("Sync Error:", e); }
    finally { setIsTyping(false); }
  };

  const openDeleteModal = (sId: string) => {
    setSessionToDelete(sId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      await fetch(`https://web-production-4f439.up.railway.app/v1/sessions/${sessionToDelete}`, { 
        method: 'DELETE',
        headers: { 'X-API-KEY': 'nr-dev-secret-123' }
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
    try {
      await fetch(`https://web-production-4f439.up.railway.app/v1/sessions/${sId}/rename`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': 'nr-dev-secret-123'
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

    if (!user) {
      localStorage.setItem('pending_neural_msg', input.trim());
      const trigger = document.getElementById('clerk-auth-trigger');
      trigger?.click();
      return;
    }

    const currentPrompt = input.trim();
    const userMsg: ChatMessage = { role: 'user', content: currentPrompt };
    const currentContext = [...messages, userMsg];
    
    const isFirstRealMessage = messages.length <= 1; 

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentContext,
          userId: getTargetId(), 
          sessionId: sessionId
        }),
      });

      const data = await response.json();
      const aiAnswer = data.output?.ai_answer || data.content;

      if (aiAnswer) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiAnswer.replace(/^User:.*?\n/i, '').trim(),
          stats: {
            model: data.routing?.model_used || "Neural Node",
            savings: Number(data.business_metrics?.estimated_savings_usd || 0).toFixed(4),
            water: "0.0125L"
          }
        }]);

        if (isFirstRealMessage) {
          const finalTitle = currentPrompt.substring(0, 25) + "...";
          await renameSession(sessionId, finalTitle);
        } else {
          fetchSessions();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural Node timeout." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-300 overflow-hidden font-sans relative">
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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative w-full max-sm bg-[#050505] border border-zinc-800 rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center text-white">
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

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

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

        <div className="px-6 py-2 space-y-3">
          <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest italic mb-2">Neural Presets</p>
          <div className="grid grid-cols-1 gap-2">
            {NEURAL_PRESETS.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(item.prompt);
                  setIsSidebarOpen(false);
                  textareaRef.current?.focus();
                }}
                className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl text-[10px] font-bold uppercase tracking-tight text-zinc-500 hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-500/30 transition-all text-left group"
              >
                <span className="text-zinc-700 group-hover:text-blue-500 transition-colors">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-[1px] bg-zinc-800/50 my-4" />

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
              {editingId !== sess.session_id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm p-1 rounded-lg">
                   <button onClick={(e) => { e.stopPropagation(); setEditingId(sess.session_id); setEditValue(sess.custom_title || ""); }} className="p-1 hover:text-blue-500 text-zinc-600 transition-colors"><Edit3 size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); openDeleteModal(sess.session_id); }} className="p-1 hover:text-red-500 text-zinc-600 transition-colors"><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col bg-[#09090b] relative w-full">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-[#09090b]/50 backdrop-blur-xl z-10 text-white">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 md:hidden hover:text-white transition-colors"><Menu size={20} /></button>
             <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
               <Bot className="text-blue-500" size={20} />
             </div>
             <div className="hidden sm:block">
               <h2 className="text-sm font-black uppercase italic text-white tracking-tight leading-none">Neural Assistant v1.0</h2>
               <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mt-1 italic">{isTyping ? 'Syncing...' : 'Neural Link: Active'}</p>
             </div>
           </div>

           <div className="flex items-center gap-6">
             <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-blue-400 transition-colors hidden md:block">
               Pricing
             </Link>
             
             <div className="flex items-center bg-[#0d0d0f] border border-zinc-800 rounded-full pl-5 pr-2 py-1.5 gap-4 shadow-2xl">
                <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-200 hover:text-blue-400 transition-all group">
                  Dashboard
                  <LayoutDashboard size={14} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </Link>
                <div className="w-[1px] h-4 bg-zinc-800" />
                <div className="scale-90 opacity-90 hover:opacity-100 transition-opacity">
                  {user ? (
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    <SignInButton mode="modal">
                      <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Sign In</button>
                    </SignInButton>
                  )}
                </div>
             </div>
           </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 pr-16 md:pr-24 space-y-10 max-w-5xl mx-auto w-full n-scroll text-white pt-10" style={{ scrollbarGutter: 'stable' }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-3 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${m.role === 'assistant' ? 'bg-blue-600/10 border-blue-500/20' : 'bg-zinc-800 border-zinc-700'}`}>
                  {m.role === 'assistant' ? <Zap size={14} className="text-blue-500" /> : <User size={14} className="text-zinc-500" />}
                </div>
                <div className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[1.8rem] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-900/20' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none backdrop-blur-sm shadow-xl'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter style={vscDarkPlus as any} language={match[1]} PreTag="div" className="rounded-lg my-4 border border-zinc-800 text-[11px] md:text-sm" {...props}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-blue-400 font-mono" {...props}>{children}</code>
                        );
                      },
                    }}
                    className="text-xs md:text-sm font-medium leading-relaxed prose prose-invert max-w-none"
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
              {m.role === 'assistant' && m.stats && (
                <div className="flex gap-4 ml-12 text-[8px] font-black uppercase text-zinc-600 tracking-widest animate-in fade-in">
                  <span className="flex items-center gap-1"><Zap size={8} className="text-blue-500"/> {m.stats.model}</span>
                  <div className="w-[1px] h-2 bg-zinc-800 self-center" />
                  <span className="flex items-center gap-1"><DollarSign size={8} className="text-green-500"/> ${m.stats.savings}</span>
                </div>
              )}
            </div>
          ))}
          {isTyping && <div className="ml-12 flex items-center gap-2 text-blue-500/50 italic text-[10px] font-black uppercase tracking-widest"><Loader2 size={12} className="animate-spin" /> Syncing Node...</div>}
          
          <div className="h-32 w-full flex-shrink-0" /> 
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#09090b] via-[#09090b] via-80% to-transparent z-10 text-white">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              ref={textareaRef} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} 
              placeholder={user ? "Execute neural command..." : "Type command and Sign In to execute..."} 
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 pr-16 md:pr-20 text-xs md:text-sm focus:border-blue-500 outline-none resize-none n-scroll shadow-2xl backdrop-blur-xl transition-all" 
              rows={1} 
            />
            <button onClick={handleSendMessage} disabled={isTyping || !input.trim()} className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2.5 md:p-3 bg-blue-600 rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-blue-500/20 text-white"><Send size={18} /></button>
          </div>
        </div>
      </main>
    </div>
  );
}
