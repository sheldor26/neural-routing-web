"use client";
import { useState } from "react";
import { useUser, Protect } from "@clerk/nextjs";
import { Save, Eye, Home, ArrowLeft } from "lucide-react"; 
import Link from "next/link"; 
import { supabase } from "@/lib/supabase"; 

export default function AdminBlog() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Cambiá esto por tu mail real de Clerk
  const ADMIN_EMAIL = "juanlxxxxxxxx@gmail.com"; 

  const handlePublish = async () => {
    if (!title || !content) return alert("Operator: Title and Content are required.");
    
    setIsPublishing(true);
    // Generamos un slug amigable para la URL (ej: "mi-post-pro" de "Mi Post Pro")
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { 
            title, 
            content, 
            slug, 
            tag: 'Engineering', 
            read_time: '5 min', 
            published: true 
          }
        ]);

      if (error) throw error;

      alert("🚀 Neural Analysis Published Successfully!");
      setTitle("");
      setContent("");
    } catch (error: any) {
      alert("Neural Node Sync Error: " + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Protect
      condition={() => user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL}
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center text-zinc-500 italic uppercase tracking-widest gap-4">
          <span>Access Denied. Neural ID required.</span>
          <Link href="/" className="text-blue-500 border-b border-blue-500/30 pb-1 text-[10px]">Return to Base</Link>
        </div>
      }
    >
      <div className="min-h-screen bg-[#09090b] text-white p-12">
        <div className="max-w-5xl mx-auto">
          
          {/* --- BOTÓN BACK TO HOME --- */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all group"
            >
              <Home size={14} className="group-hover:text-blue-500 transition-colors" />
              Back to Home
            </Link>
          </div>

          <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-8">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Neural <span className="text-blue-600">Editor</span></h1>
              <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold italic">Operator: {user?.firstName}</p>
            </div>
            
            {/* --- BOTÓN PUBLISH CONECTADO --- */}
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className={`flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95 ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save size={14} /> 
              {isPublishing ? "Syncing..." : "Publish Post"}
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* EDITOR */}
            <div className="space-y-6">
              <input 
                type="text" 
                value={title}
                placeholder="Post Title..."
                className="w-full bg-transparent border-b border-zinc-800 p-4 text-4xl font-black italic focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea 
                value={content}
                placeholder="Write your engineering analysis here (Markdown supported)..."
                className="w-full h-[500px] bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 font-mono text-sm text-zinc-400 focus:border-blue-600 outline-none transition-all resize-none shadow-inner"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* PREVIEW */}
            <div className="hidden lg:block bg-zinc-900/10 border border-zinc-800 rounded-[3rem] p-12 overflow-y-auto max-h-[700px] relative">
              <div className="sticky top-0 bg-[#09090b]/10 backdrop-blur-md pb-4 flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Eye size={14} /> Live Preview
              </div>
              <h2 className="text-4xl font-black italic text-white mb-6 uppercase tracking-tighter leading-none">{title || "Untitled Analysis"}</h2>
              <div className="prose prose-invert max-w-none italic text-zinc-500 whitespace-pre-wrap font-medium leading-relaxed">
                {content || "The routing engine performance was analyzed..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protect>
  );
}