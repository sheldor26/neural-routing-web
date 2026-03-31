"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, Send, User, Bot, History, Home, Zap, DollarSign, Droplets } from 'lucide-react';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs"; // Importamos Clerk para el UserID real

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  stats?: {
    model: string;
    savings: string;
    water: string;
  };
}

export default function FullChatPage() {
  const { user } = useUser(); // Obtenemos el usuario logueado
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Neural Engine Online. How can I optimize your infrastructure today?' 
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userContent = input.trim();
    const userMessage: ChatMessage = { role: 'user', content: userContent };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Llamada a tu API de Next.js que hace de puente con main.py
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          userId: user?.id || "guest_user" // Enviamos el ID de Clerk a Python
        }),
      });

      if (!response.ok) throw new Error("Neural Node connection failed");

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content,
        stats: data.stats // Estos vienen procesados por tu NeuralRouterV2
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Error: Could not establish secure link with Neural Node. Make sure main.py is running." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-80 border-r border-zinc-800 bg-[#050505] flex flex-col hidden md:flex">
        <div className="p-6 space-y-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors mb-2 group"
          >
            <Home size={12} className="group-hover:text-blue-500 transition-colors" /> Return to Base
          </Link>

          <button 
            onClick={() => setMessages([{ role: 'assistant', content: 'New session initialized. Awaiting commands.' }])}
            className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95"
          >
            <Plus size={14} /> New Session
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <div className="flex items-center justify-between px-2 mb-4">
             <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Infrastructure Logs</p>
             <History size={12} className="text-zinc-800" />
          </div>
          <div className="group p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 text-zinc-400 text-xs font-bold italic transition-all hover:bg-blue-600/10 cursor-pointer">
            {user?.firstName ? `${user.firstName}'s Active Session` : "Current Active Session"}
          </div>
        </nav>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative bg-[#09090b]">
        
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
               <Bot className="text-blue-500" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase italic tracking-tight text-white leading-none">Neural Assistant v1.0</h2>
              <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-blue-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                {isTyping ? 'Routing Architecture...' : 'Node Status: Optimal'}
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-10 max-w-4xl mx-auto w-full scroll-smooth pb-40 no-scrollbar"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-3 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  m.role === 'assistant' 
                  ? 'bg-blue-600/10 border-blue-500/20' 
                  : 'bg-zinc-800 border-zinc-700'
                }`}>
                  {m.role === 'assistant' ? <Zap size={14} className="text-blue-500" /> : <User size={14} className="text-zinc-500" />}
                </div>

                <div className={`p-6 rounded-[2rem] shadow-2xl ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none backdrop-blur-sm'
                }`}>
                  <p className="text-sm leading-relaxed italic font-medium whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>

              {/* Stats dinámicos de tu NeuralRouterV2 */}
              {m.role === 'assistant' && m.stats && (
                <div className="flex items-center gap-4 ml-12 px-2 animate-in fade-in slide-in-from-left-2 duration-700 delay-300">
                  <div className="flex items-center gap-1.5">
                    <Bot size={10} className="text-zinc-600" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">{m.stats.model}</span>
                  </div>
                  <div className="h-3 w-[1px] bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={10} className="text-green-500" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-green-500">Saved {m.stats.savings}</span>
                  </div>
                  <div className="h-3 w-[1px] bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <Droplets size={10} className="text-blue-400" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">{m.stats.water} Conserved</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-pulse ml-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                <Zap size={14} className="text-blue-500" />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent z-20">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Send a neural command..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-[2.5rem] p-6 pr-20 text-sm focus:border-blue-500 outline-none transition-all resize-none shadow-2xl backdrop-blur-xl max-h-32 scrollbar-hide"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isTyping || !input.trim()}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] 
                ${isTyping || !input.trim() ? 'bg-zinc-800 text-zinc-600' : 'bg-blue-600 text-white hover:scale-105 active:scale-95'}`}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center mt-4 text-[8px] font-black uppercase text-zinc-800 tracking-[0.4em] italic">
            NeuralRouting v1.0 // Secured Infrastructure // 2026
          </p>
        </div>
      </main>
    </div>
  );
}