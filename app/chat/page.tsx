"use client";
import { useState, useRef, useEffect } from 'react';
import { Plus, Send, User, Bot, History, Home, Zap, DollarSign, Droplets, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";

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
}

export default function FullChatPage() {
  const { user, isLoaded } = useUser();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Carga inicial de historial de sesiones
  useEffect(() => {
    if (isLoaded && user) {
      if (!sessionId) {
        const newId = crypto.randomUUID();
        setSessionId(newId);
        setMessages([{ role: 'assistant', content: 'Neural Engine Online. Infrastructure logs synced.' }]);
      }
      fetchSessions();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const fetchSessions = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`https://web-production-4f439.up.railway.app/v1/sessions/${user.id}`);
      const data = await response.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (e) { console.error("Session Fetch Error", e); }
  };

  // 2. RECUPERACIÓN DE HISTORIAL (Mapeo agresivo basado en Supabase)
  const loadChatHistory = async (sId: string) => {
    if (!sId) return;
    setIsTyping(true);
    // Limpiamos mensajes antes de cargar el nuevo set para evitar confusiones
    setMessages([]); 
    
    try {
      console.log(`📡 Fetching data for session ID: ${sId}`);
      const response = await fetch(`https://web-production-4f439.up.railway.app/v1/messages/${sId}`);
      const data = await response.json();
      
      console.log("📦 Received packets:", data);

      if (Array.isArray(data) && data.length > 0) {
        const history: ChatMessage[] = [];
        
        data.forEach((msg: any) => {
          // Buscamos 'prompt' y 'ai_response' que son las columnas de tu tabla
          if (msg.prompt) {
            history.push({ role: 'user', content: msg.prompt });
          }
          if (msg.ai_response) {
            history.push({ 
              role: 'assistant', 
              content: msg.ai_response,
              stats: {
                model: msg.model_selected || "Neural Node",
                savings: msg.cost_saved ? Number(msg.cost_saved).toFixed(4) : "0.0000",
                water: "0.0125L"
              }
            });
          }
        });
        
        setMessages(history);
      } else {
        setMessages([{ role: 'assistant', content: 'Neural Log: This session node is currently empty.' }]);
      }
    } catch (e) {
      console.error("❌ Sync Error:", e);
      setMessages([{ role: 'assistant', content: 'Connection Error: Database unreachable.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewSession = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    setMessages([{ role: 'assistant', content: 'New session node established. Infrastructure ready.' }]);
    setInput("");
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping || !user) return;
    
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    const currentContext = [...messages, userMsg];
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: currentContext, 
          userId: user.id, 
          sessionId: sessionId 
        }),
      });
      
      const data = await response.json();
      
      if (data.content) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.content, 
          stats: data.stats 
        }]);
        fetchSessions(); // Actualizar barra lateral para reflejar nuevos logs
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Node connection failure. Retrying..." }]);
    } finally { 
      setIsTyping(false); 
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-300 overflow-hidden font-sans">
      <style jsx global>{`
        .n-scroll::-webkit-scrollbar { width: 4px; }
        .n-scroll::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
      `}</style>

      {/* --- SIDEBAR --- */}
      <aside className="w-80 border-r border-zinc-800 bg-[#050505] flex flex-col hidden md:flex">
        <div className="p-6 space-y-4">
          <Link href="/" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
            <Home size={12} /> Return to Base
          </Link>
          <button 
            onClick={handleNewSession}
            className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Plus size={14} /> New Session
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 n-scroll">
          <div className="flex items-center justify-between px-2 mb-4">
            <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest italic">Infrastructure Logs</p>
            <History size={12} className="text-zinc-800" />
          </div>
          {sessions.map((sess) => (
            <div 
              key={sess.session_id}
              onClick={() => { 
                if (sessionId !== sess.session_id) {
                  setSessionId(sess.session_id); 
                  loadChatHistory(sess.session_id); 
                }
              }}
              className={`group p-4 rounded-xl border transition-all cursor-pointer ${
                sessionId === sess.session_id ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'bg-zinc-900/20 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/40'
              }`}
            >
              <div className="text-[10px] font-black uppercase italic truncate">Log: {sess.session_id.slice(0, 12)}...</div>
              <div className="text-[8px] text-zinc-700 mt-1 uppercase font-bold tracking-tighter">
                {new Date(sess.created_at).toLocaleDateString()} - {new Date(sess.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col bg-[#09090b] relative">
        <header className="h-20 border-b border-zinc-800 flex items-center px-8 bg-[#09090b]/50 backdrop-blur-xl z-10">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
               <Bot className="text-blue-500" size={20} />
             </div>
             <div>
               <h2 className="text-sm font-black uppercase italic text-white tracking-tight leading-none">Neural Assistant v1.0</h2>
               <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mt-1 italic">
                 {isTyping ? 'Syncing Packets...' : 'Neural Link: Active'}
               </p>
             </div>
           </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 pr-12 space-y-10 max-w-5xl mx-auto w-full n-scroll pb-44">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-3 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${m.role === 'assistant' ? 'bg-blue-600/10 border-blue-500/20' : 'bg-zinc-800 border-zinc-700'}`}>
                  {m.role === 'assistant' ? <Zap size={14} className="text-blue-500" /> : <User size={14} className="text-zinc-500" />}
                </div>
                <div className={`p-5 rounded-[1.8rem] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none backdrop-blur-sm shadow-xl'}`}>
                  <p className="text-sm italic font-medium whitespace-pre-wrap leading-relaxed">{m.content}</p>
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
          {isTyping && (
            <div className="ml-12 flex items-center gap-2 text-blue-500/50 italic text-[10px] font-black uppercase tracking-widest">
              <Loader2 size={12} className="animate-spin" /> Retrieving Packets...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent z-10">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
              placeholder="Execute neural command..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-[2.5rem] p-6 pr-20 text-sm focus:border-blue-500 outline-none resize-none n-scroll shadow-2xl backdrop-blur-xl transition-all"
              rows={1}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isTyping || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}