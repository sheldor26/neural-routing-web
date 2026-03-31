"use client";
import { useState } from "react";
import { useUser, Protect } from "@clerk/nextjs";
import { PenTool, Save, Eye, Trash2 } from "lucide-react";

export default function AdminBlog() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // SOLO VOS: Cambiá esto por tu email real de Clerk
  const ADMIN_EMAIL = "juanlxxxxxxxx@gmail.com"; 

  return (
    <Protect
      condition={(has) => user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL}
      fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500 italic">Access Denied. Neural ID required.</div>}
    >
      <div className="min-h-screen bg-[#09090b] text-white p-12">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-8">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Neural <span className="text-blue-600">Editor</span></h1>
              <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Logged in as: {user?.firstName}</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all">
              <Save size={14} /> Publish Post
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* EDITOR */}
            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="Post Title..."
                className="w-full bg-transparent border-b border-zinc-800 p-4 text-4xl font-black italic focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea 
                placeholder="Write your engineering analysis here (Markdown supported)..."
                className="w-full h-[500px] bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 font-mono text-sm text-zinc-400 focus:border-blue-600 outline-none transition-all resize-none"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* PREVIEW */}
            <div className="hidden lg:block bg-zinc-900/10 border border-zinc-800 rounded-[3rem] p-12 overflow-y-auto max-h-[700px]">
              <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Eye size={14} /> Live Preview
              </div>
              <h2 className="text-4xl font-black italic text-white mb-6 uppercase tracking-tighter">{title || "Your Title"}</h2>
              <div className="prose prose-invert max-w-none italic text-zinc-500 whitespace-pre-wrap font-medium">
                {content || "The routing engine performance was analyzed..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protect>
  );
}
