import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, Calendar, Share2 } from "lucide-react";

// Esto ayuda a que Next.js sepa que es una página dinámica
export const revalidate = 60; 

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // 1. Buscamos el post en Supabase por el slug
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  // 2. Si no existe o hay error, mandamos al 404
  if (error || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* --- DECORATIVE BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        
        {/* --- NAVIGATION --- */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-blue-500 transition-colors mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Engineering Logs
        </Link>

        {/* --- ARTICLE HEADER --- */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
              {post.tag}
            </span>
            <div className="h-[1px] w-8 bg-zinc-800"></div>
            <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1">
              <Clock size={12} /> {post.read_time}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter leading-[0.9] mb-8 uppercase">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/5 flex items-center justify-center text-[10px] font-black text-white">
                NR
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-tight">Neural Systems</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Core Engineering</p>
              </div>
            </div>
            <button className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-600 hover:text-white">
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {/* --- ARTICLE CONTENT --- */}
        <article className="prose prose-invert prose-blue max-w-none">
          {/* Usamos whitespace-pre-wrap para que respete los saltos de línea del editor */}
          <div className="text-lg leading-relaxed text-zinc-400 font-medium italic whitespace-pre-wrap">
            {post.content}
          </div>
        </article>

        {/* --- FOOTER CTA --- */}
        <footer className="mt-20 pt-12 border-t border-zinc-800">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-1">Optimize your stack?</h4>
              <p className="text-zinc-500 text-xs font-medium italic">Join the private beta for NeuralRouting v1.0</p>
            </div>
            <Link 
              href="/"
              className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl"
            >
              Get Started Now
            </Link>
          </div>
        </footer>

      </main>
    </div>
  );
}