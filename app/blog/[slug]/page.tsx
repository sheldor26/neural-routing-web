import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, Share2, Zap } from "lucide-react";

export const revalidate = 60;

const TAG_COLORS: Record<string, string> = {
  Engineering:       "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Architecture:      "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Neural Research": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !post) notFound();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30">

      {/* Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="text-base font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
        </Link>
        <Link href="/blog" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all flex items-center gap-2">
          <ArrowLeft size={11} /> Blog
        </Link>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16">

        {/* Cover image */}
        {post.cover_image && (
          <div className="mb-12 rounded-[2rem] overflow-hidden border border-zinc-800">
            <img src={post.cover_image} alt={post.title} className="w-full h-64 object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${TAG_COLORS[post.tag] ?? "text-zinc-400 bg-zinc-800 border-zinc-700"}`}>
            {post.tag}
          </span>
          <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1">
            <Clock size={11} /> {post.read_time}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black italic text-white tracking-tighter leading-[0.9] mb-8 uppercase">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-zinc-400 text-lg leading-relaxed mb-8 italic border-l-2 border-blue-600/40 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Byline */}
        <div className="flex items-center justify-between py-5 border-y border-zinc-800/50 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-[9px] font-black text-white">
              NR
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-tight">Neural Systems</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{fmtDate(post.created_at)}</p>
            </div>
          </div>
          <button
            onClick={undefined}
            className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-600 hover:text-white"
            title="Copy link"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Content — full markdown */}
        <article className="
          prose prose-invert prose-lg max-w-none

          prose-h2:text-2xl prose-h2:font-black prose-h2:italic prose-h2:uppercase prose-h2:tracking-tighter prose-h2:text-white prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-xl prose-h3:font-black prose-h3:text-white prose-h3:mt-8 prose-h3:mb-3

          prose-p:text-zinc-400 prose-p:leading-[1.85] prose-p:text-base prose-p:mb-6

          prose-li:text-zinc-400 prose-li:leading-relaxed prose-li:my-1
          prose-ul:my-6 prose-ul:space-y-1
          prose-ol:my-6

          prose-strong:text-white prose-strong:font-bold

          prose-code:text-blue-400 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none

          prose-pre:bg-zinc-900/80 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-8 prose-pre:overflow-x-auto

          prose-table:text-sm prose-thead:border-zinc-700 prose-tbody:divide-zinc-800 prose-th:text-white prose-th:font-black prose-th:py-3 prose-td:text-zinc-400 prose-td:py-3

          prose-blockquote:border-l-2 prose-blockquote:border-blue-500 prose-blockquote:text-zinc-400 prose-blockquote:italic prose-blockquote:pl-6 prose-blockquote:my-8 prose-blockquote:not-italic

          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline

          prose-hr:border-zinc-800 prose-hr:my-12
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Footer CTA */}
        <footer className="mt-20 pt-12 border-t border-zinc-800">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-1">
                Ready to cut your AI costs?
              </h4>
              <p className="text-zinc-500 text-xs font-medium italic">
                Start saving up to 85% on token costs today.
              </p>
            </div>
            <Link
              href="/"
              className="px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-xl shrink-0"
            >
              Get Started →
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
