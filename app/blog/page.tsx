import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronRight, Clock, Zap } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Engineering Insights & AI Cost Research",
  description: "Architecture decisions, infrastructure updates, and research from the NeuralRouting team on AI cost optimization and intelligent prompt routing.",
  openGraph: {
    title: "NeuralRouting Blog — AI Cost Engineering",
    description: "Architecture decisions and research on AI cost optimization from the NeuralRouting team.",
    url: "https://neuralrouting.io/blog",
  },
};

const TAG_COLORS: Record<string, string> = {
  Engineering:      "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Architecture:     "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Neural Research": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, tag, read_time, cover_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const list = posts ?? [];

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">

      {/* Decorative glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="text-base font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
        </Link>
        <Link href="/" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all">
          ← Home
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <header className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic mb-3">
            Engineering Logs
          </p>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
            Neural <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-4 max-w-md">
            Infrastructure updates, architecture decisions, and research from the NeuralRouting team.
          </p>
        </header>

        {/* Posts */}
        {list.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-600 uppercase text-[10px] font-black tracking-widest italic">
              No posts published yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {list.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-[2rem] border border-zinc-800/60 bg-zinc-900/10 hover:border-blue-500/40 hover:bg-zinc-900/30 transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Cover image */}
                  {post.cover_image && (
                    <div className="md:w-56 md:shrink-0 h-40 md:h-auto overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex-1 p-8">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${TAG_COLORS[post.tag] ?? "text-zinc-400 bg-zinc-800 border-zinc-700"}`}>
                        {post.tag}
                      </span>
                      <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-1">
                        <Clock size={10} /> {post.read_time}
                      </span>
                      <span className="text-[9px] text-zinc-700 font-bold">
                        {fmtDate(post.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read more */}
                    <div className="flex items-center gap-1.5 mt-4 text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-blue-500 transition-colors">
                      Read More <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
