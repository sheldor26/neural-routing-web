"use client";
import { useState } from 'react';
import { MessageSquare, Plus, Send, User, Bot, History } from 'lucide-react';

export default function FullChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Neural Engine Online. ¿En qué puedo optimizar tu infraestructura hoy?' }
  ]);

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-300">
      
      {/* --- SIDEBAR (Historial) --- */}
      <aside className="w-80 border-r border-zinc-800 bg-[#050505] flex flex-col">
        <div className="p-6">
          <button className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
            <Plus size={14} /> New Session
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <p className="text-[9px] font-black uppercase text-zinc-600 px-2 mb-4 tracking-[0.2em]">Recent Infrastructure Logs</p>
          {/* Aquí mapearemos los chats de Supabase */}
          <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20 text-white text-xs font-bold italic cursor-pointer">
            Optimización Costos Llama 3
          </div>
        </nav>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative">
        {/* Header con métricas en tiempo real */}
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Bot className="text-blue-500" />
            <div>
              <h2 className="text-sm font-black uppercase italic tracking-tight text-white">Neural Assistant v1.0</h2>
              <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Active Node: Economy-Route</p>
            </div>
          </div>
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
              <div className={`max-w-[80%] p-6 rounded-[2rem] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed italic font-medium">{m.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input area estilo ChatGPT */}
        <div className="p-8 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              placeholder="Send a neural command..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 pr-20 text-sm focus:border-blue-500 outline-none transition-all resize-none shadow-2xl"
              rows={1}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}