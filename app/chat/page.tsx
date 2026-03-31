"use client";
import { useState } from 'react';
import { MessageSquare, Plus, Send, User, Bot, History, Home } from 'lucide-react';
import Link from 'next/link';

export default function FullChatPage() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Neural Engine Online. How can I optimize your infrastructure today?' 
    }
  ]);

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-300 font-sans">
      
      {/* --- SIDEBAR (History) --- */}
      <aside className="w-80 border-r border-zinc-800 bg-[#050505] flex flex-col">
        <div className="p-6 space-y-4">
          {/* Back to Home Button */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors mb-2"
          >
            <Home size={12} /> Return to Base
          </Link>

          <button className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">
            <Plus size={14} /> New Session
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <div className="flex items-center justify-between px-2 mb-4">
             <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Infrastructure Logs</p>
             <History size={12} className="text-zinc-800" />
          </div>

          {/* This will be mapped from Supabase later */}
          <div className="group p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 hover:border-blue-500/40 text-zinc-400 hover:text-white text-xs font-bold italic cursor-pointer transition-all">
            Llama 3 Cost Optimization
          </div>
          
          <div className="group p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 text-zinc-500 text-xs font-bold italic cursor-pointer transition-all">
            Token Redaction Test
          </div>
        </nav>

        <div className="p-6 border-t border-zinc-900">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400" />
              <div>
                 <p className="text-[10px] font-black text-white uppercase tracking-tighter">Neural Operator</p>
                 <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Premium Tier</p>
              </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent">
        
        {/* Header with Real-time Metrics */}
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
               <Bot className="text-blue-500" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase italic tracking-tight text-white">Neural Assistant v1.0</h2>
              <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                Active Node: Economy-Route
              </p>
            </div>
          </div>
        </header>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Zap size={14} className="text-blue-500" />
                </div>
              )}
              
              <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-2xl ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none backdrop-blur-sm'
              }`}>
                <p className="text-sm leading-relaxed italic font-medium">{m.content}</p>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <User size={14} className="text-zinc-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent z-20">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              placeholder="Send a neural command..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-[2rem] p-6 pr-20 text-sm focus:border-blue-500 outline-none transition-all resize-none shadow-2xl backdrop-blur-xl"
              rows={1}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
              <Send size={18} />
            </button>
          </div>
          <p className="text-center mt-4 text-[9px] font-black uppercase text-zinc-700 tracking-[0.3em] italic">
            NeuralRouting v1.0 // Secured Infrastructure // 2026
          </p>
        </div>
      </main>
    </div>
  );
}