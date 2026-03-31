"use client";
import { useState, useRef } from "react";
import { useUser, Protect } from "@clerk/nextjs";
import { Save, Eye, Home, Code, Bold, List, Hash, Tag, Clock, Loader2, Sparkles, Image as ImageIcon } from "lucide-react"; 
import Link from "next/link"; 
import { supabase } from "@/lib/supabase"; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AdminBlog() {
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Engineering");
  const [readTime, setReadTime] = useState("5 min");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ADMIN_EMAIL = "juanmirande10@gmail.com".toLowerCase(); 

  const addMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selected = text.substring(start, end);

    const newContent = before + prefix + selected + suffix + after;
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const cursorPadding = prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(start + cursorPadding, start + cursorPadding);
    }, 10);
  };

  const uploadToSupabase = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      const imageMarkdown = `\n![Neural Image](${publicUrl})\n`;
      addMarkdown(imageMarkdown);
    } catch (error: any) {
      alert("Neural Uplink Failure: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadToSupabase(file);
  };

  // Soporte para arrastrar y soltar imágenes
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadToSupabase(file);
    }
  };

  const handlePublish = async () => {
    if (!title || !content) return alert("Operator: Fields cannot be empty.");
    setIsPublishing(true);
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ 
          title, content, slug, tag, read_time: readTime, 
          published: true, created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      alert("🚀 Neural Analysis Published to Mainnet!");
      setTitle(""); setContent("");
    } catch (error: any) {
      alert("Sync Error: " + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <Protect
      condition={() => user?.primaryEmailAddress?.emailAddress.toLowerCase() === ADMIN_EMAIL}
      fallback={<div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-500 italic space-y-4"><p>Access Denied. Neural ID required.</p></div>}
    >
      <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30 font-sans">
        <nav className="border-b border-zinc-800/50 bg-black/20 backdrop-blur-md sticky top-0 z-50 px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:bg-zinc-900 p-2 rounded-lg transition-all group"><Home size={18} className="text-zinc-500 group-hover:text-blue-500" /></Link>
              <h1 className="text-sm font-black italic uppercase tracking-widest border-l border-zinc-800 pl-6">Neural <span className="text-blue-600">Editor</span></h1>
            </div>
            <button onClick={handlePublish} disabled={isPublishing} className="flex items-center gap-2 px-8 py-2.5 bg-white text-black rounded-full font-black italic uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl disabled:opacity-50">
              {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isPublishing ? "Syncing..." : "Publish Broadcast"}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl shadow-inner">
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter"><Tag size={10} className="inline mr-1"/> Category</label>
                <select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold italic outline-none focus:border-blue-500 transition-all cursor-pointer">
                  <option>Engineering</option>
                  <option>Architecture</option>
                  <option>Neural Research</option>
                </select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter"><Clock size={10} className="inline mr-1"/> Read Latency</label>
                <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold italic outline-none focus:border-blue-500 transition-all"/>
              </div>
            </div>

            <input type="text" value={title} placeholder="Analysis Title..." className="w-full bg-transparent text-5xl md:text-6xl font-black italic tracking-tighter outline-none placeholder:text-zinc-900" onChange={(e) => setTitle(e.target.value)}/>

            <div className="flex items-center gap-2 border-y border-zinc-800/30 py-3">
              <button onClick={() => addMarkdown("### ")} className="p-2 hover:bg-zinc-900 rounded text-zinc-600 hover:text-white transition-colors"><Hash size={16} /></button>
              <button onClick={() => addMarkdown("**", "**")} className="p-2 hover:bg-zinc-900 rounded text-zinc-600 hover:text-white transition-colors"><Bold size={16} /></button>
              <button onClick={() => addMarkdown("`", "`")} className="p-2 hover:bg-zinc-900 rounded text-zinc-600 hover:text-white transition-colors"><Code size={16} /></button>
              <button onClick={() => addMarkdown("* ")} className="p-2 hover:bg-zinc-900 rounded text-zinc-600 hover:text-white transition-colors"><List size={16} /></button>
              
              <div className="w-[1px] h-4 bg-zinc-800 mx-2" />

              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isUploading}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-blue-600/10 rounded-lg text-zinc-600 hover:text-blue-500 transition-all text-[10px] font-black uppercase tracking-widest"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={16} />}
                {isUploading ? "Uploading..." : "Neural Uplink (Img)"}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            <textarea 
              ref={textareaRef} 
              value={content} 
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              placeholder="Start your neural broadcast here... (Drop images here)" 
              className="w-full h-[650px] bg-transparent text-lg font-medium text-zinc-400 outline-none resize-none leading-relaxed n-scroll" 
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-32">
              <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 italic"><Eye size={14} /> Neural Live Preview</div>
              <div className="bg-zinc-900/5 border border-zinc-800/80 rounded-[3rem] p-10 backdrop-blur-sm relative overflow-hidden group shadow-2xl min-h-[500px]">
                <h2 className="text-4xl font-black italic text-white mb-8 uppercase tracking-tighter leading-[0.85] break-words">{title || "Awaiting_Title"}</h2>
                <div className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-p:italic prose-p:text-zinc-500 prose-img:rounded-3xl prose-img:border prose-img:border-zinc-800 shadow-blue-500/5">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "Synthesizing neural input..."}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protect>
  );
}