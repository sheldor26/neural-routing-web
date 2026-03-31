"use client";
import { useState } from "react";
import { useUser, Protect } from "@clerk/nextjs";
import { Save, Eye, Trash2, Loader2 } from "lucide-react";

export default function AdminBlog() {
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 1. Tu email real (aseguratate que sea el mismo que ves en el dashboard de Clerk)
  const ADMIN_EMAIL = "juanlxxxxxxxx@gmail.com".toLowerCase(); 

  // 2. Si Clerk está cargando, mostramos un spinner para no dar "Access Denied" por error
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <Protect
      condition={() => 
        user?.primaryEmailAddress?.emailAddress.toLowerCase() === ADMIN_EMAIL
      }
      fallback={
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-500 italic space-y-4">
          <p>Access Denied. Neural ID required.</p>
          <p className="text-[10px] uppercase tracking-widest not-italic">Tu ID actual no tiene permisos de escritura.</p>
        </div>
      }
    >
      <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-8 gap-6">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                Neural <span className="text-blue-600">Editor</span>
              </h1>
              <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest font-bold italic">
                Operador: {user?.firstName} {user?.lastName}
              </p>
            </div>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 rounded-2xl font-black italic uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Save size={14} /> Publish Post
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* EDITOR */}
            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="Post Title..."
                className="w-full bg-transparent border-b border-zinc-800 p-4 text-4xl font-black italic focus:border-blue-600 outline-none transition-all placeholder:text-zinc-800"
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea 
                placeholder="Write your engineering analysis here (Markdown supported)..."
                className="w-full h-[500px] bg-zinc-900/20 border border-zinc-800 rounded-[2rem] p-8 font-mono text-sm text-zinc-400 focus:border-blue-600 outline-none transition-all resize-none n-scroll"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* PREVIEW */}
            <div className="hidden lg:block bg-zinc-900/5 border border-zinc-800 rounded-[3rem] p-12 overflow-y-auto max-h-[700px] n-scroll">
              <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 italic">
                <Eye size={14} /> Live Preview
              </div>
              <h2 className="text-4xl font-black italic text-white mb-6 uppercase tracking-tighter break-words">
                {title || "Untitled_Session"}
              </h2>
              <div className="prose prose-invert max-w-none italic text-zinc-500 whitespace-pre-wrap font-medium leading-relaxed">
                {content || "Analyzing neural packets for documentation..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protect>
  );
}