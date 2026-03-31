"use client";
import { useState } from "react";
import { useUser, Protect } from "@clerk/nextjs";
import { Save, Eye, Home, Type, Code, Bold, List, Hash, Tag, Clock } from "lucide-react"; 
import Link from "next/link"; 
import { supabase } from "@/lib/supabase"; 

export default function AdminBlog() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Engineering");
  const [readTime, setReadTime] = useState("5 min");
  const [isPublishing, setIsPublishing] = useState(false);

  const ADMIN_EMAIL = "juanmirande10@gmail.com"; 

  // Función rápida para insertar Markdown
  const addMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    setContent(text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end));
  };

  const handlePublish = async () => {
    if (!title || !content) return alert("Operator: Fields cannot be empty.");
    setIsPublishing(true);
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ title, content, slug, tag, read_time: readTime, published: true }]);
      if (error) throw error;
      alert("🚀 Neural Analysis Published!");
      setTitle(""); setContent("");
    } catch (error: any) {
      alert("Sync Error: " + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Protect
      condition={() => user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL}
      fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500 italic">Neural ID required.</div>}
    >
      <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30">
        
        {/* --- HEADER NAVIGATION --- */}
        <nav className="border-b border-zinc-800/50 bg-black/20 backdrop-blur-md sticky top-0 z-50 px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:bg-zinc-900 p-2 rounded-lg transition-all group">
                <Home size={18} className="text-zinc-500 group-hover:text-blue-500" />
              </Link>
              <h1 className="text-sm font-black italic uppercase tracking-widest border-l border-zinc-800 pl-6">
                Neural <span className="text-blue-600">Editor</span>
              </h1>
            </div>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className={`flex items-center gap-2 px-8 py-2.5 bg-white text-black rounded-full font-black italic uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.1)] ${isPublishing ? 'opacity-50' : ''}`}
            >
              <Save size={14} /> {isPublishing ? "Syncing..." : "Publish Broadcast"}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- LEFT SIDE: EDITOR --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Metadata Bar */}
            <div className="flex gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-500 flex items-center gap-2">
                  <Tag size={10} /> Category
                </label>
                <select 
                  value={tag} 
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold italic outline-none focus:border-blue-500 transition-all"
                >
                  <option>Engineering</option>
                  <option>Architecture</option>
                  <option>Optimization</option>
                </select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-500 flex items-center gap-2">
                  <Clock size={10} /> Read Time
                </label>
                <input 
                  type="text" 
                  value={readTime} 
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold italic outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Title Input */}
            <input 
              type="text" 
              value={title}
              placeholder="Analysis Title..."
              className="w-full bg-transparent text-5xl md:text-6xl font-black italic tracking-tighter outline-none placeholder:text-zinc-800 focus:placeholder:text-zinc-900 transition-all"
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Markdown Helper Toolbar */}
            <div className="flex items-center gap-2 border-y border-zinc-800/50 py-3">
              <button onClick={() => addMarkdown("### ")} className="p-2 hover:bg-zinc-900 rounded text-zinc-500 hover:text-white"><Hash size={16} /></button>
              <button onClick={() => addMarkdown("**", "**")} className="p-2 hover:bg-zinc-900 rounded text-zinc-500 hover:text-white"><Bold size={16} /></button>
              <button onClick={() => addMarkdown("`", "`")} className="p-2 hover:bg-zinc-900 rounded text-zinc-500 hover:text-white"><Code size={16} /></button>
              <button onClick={() => addMarkdown("* ")} className="p-2 hover:bg-zinc-900 rounded text-zinc-500 hover:text-white"><List size={16} /></button>
            </div>

            <textarea 
              value={content}
              placeholder="Start your neural broadcast here..."
              className="w-full h-[600px] bg-transparent text-lg font-medium text-zinc-400 outline-none resize-none leading-relaxed placeholder:text-zinc-800 scrollbar-hide"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* --- RIGHT SIDE: PREVIEW --- */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-32">
              <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                <Eye size={14} /> Intelligence Preview
              </div>
              
              <div className="bg-zinc-900/10 border border-zinc-800 rounded-[3rem] p-10 backdrop-blur-sm relative overflow-hidden group shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-full">{tag}</span>
                  <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">{readTime}</span>
                </div>
                <h2 className="text-3xl font-black italic text-white mb-8 uppercase tracking-tighter leading-[0.9]">
                  {title || "Untitled Analysis"}
                </h2>
                <div className="prose prose-invert max-w-none italic text-zinc-500 whitespace-pre-wrap font-medium leading-relaxed">
                  {content || "Awaiting neural input..."}
                </div>
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protect>
  );
}