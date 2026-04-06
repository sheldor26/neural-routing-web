import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Zap, ArrowLeft } from "lucide-react";

export const revalidate = 60;

const TAG_FROM_SLUG: Record<string, string> = {
  "engineering":    "Engineering",
  "architecture":   "Architecture",
  "neural-research": "Neural Research",
};

const TAG_COLORS: Record<string, string> = {
  Engineering:       "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Architecture:      "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Neural Research": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const TAG_DESCRIPTIONS: Record<string, string> = {
  Engineering:       "Implementation guides, cost breakdowns, and technical deep-dives on AI infrastructure optimization.",
  Architecture:      "System design decisions, routing architectures, and infrastructure patterns for production AI systems.",
  "Neural Research": "Research findings on LLM behavior, caching strategies, and intelligent model selection.",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = TAG_FROM_SLUG[params.tag];
  if (!tag) return { title: "Category Not Found" };

  return {
    title: `${tag} — NeuralRouting Blog`,
    description: TAG_DESCRIPTIONS[tag],
    openGraph: {
      title: `${tag} — NeuralRouting Blog`,
      description: TAG_DESCRIPTIONS[tag],
      url: `https://neuralrouting.io/blog/category/${params.tag}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: { tag: string } }) {
  const tag = TAG_FROM_SLUG[params.tag];
  if (!tag) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, tag, read_time, cover_image, created_at")
    .eq("published", true)
    .lte("created_at", new Date().toISOString())
    .eq("tag", tag)
    .order("created_at", { ascending: false });

  const list = posts ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag} — NeuralRouting Blog`,
    description: TAG_DESCRIPTIONS[tag],
    url: `https://neuralrouting.io/blog/category/${params.tag}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Blog", item: "https://neuralrouting.io/blog" },
        { "@type": "ListItem", position: 2, name: tag, item: `https://neuralrouting.io/blog/category/${params.tag}` },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="text-base font-black italic uppercase tracking-tighter text-white">Neuralrouting.io</span>
        </Link>
        <Link href="/blog" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all flex items-center gap-2">
          <ArrowLeft size={11} /> All Posts
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-10">
          <Link href="/blog" className="hover:text-zinc-400 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-400">{tag}</span>
        </nav>

        {/* Header */}
        <header className="mb-16">
          <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border mb-4 ${TAG_COLORS[tag]}`}>
            {tag}
          </span>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mb-4">
            {tag}
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg">{TAG_DESCRIPTIONS[tag]}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 mt-4">
            {list.length} {list.length === 1 ? "post" : "posts"}
          </p>
        </header>

        {/* All categories nav */}
        <div className="flex gap-3 mb-12 flex-wrap">
          <Link href="/blog" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-white/10 rounded-full text-zinc-500 hover:text-white hover:border-white/30 transition-all">
            All
          </Link>
          {Object.entries(TAG_FROM_SLUG).map(([slug, label]) => (
            <Link
              key={slug}
              href={`/blog/category/${slug}`}
              className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all ${
                label === tag
                  ? TAG_COLORS[label] + " font-black"
                  : "border-white/10 text-zinc-500 hover:text-white hover:border-white/30"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Posts */}
        {list.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-600 uppercase text-[10px] font-black tracking-widest italic">No posts in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {list.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-[2rem] border border-zinc-800/60 bg-zinc-900/10 hover:border-blue-500/40 hover:bg-zinc-900/30 transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {post.cover_image && (
                    <div className="md:w-56 md:shrink-0 h-40 md:h-auto overflow-hidden">
                      <img src={post.cover_image} alt={post.title} width={224} height={160} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-1">
                        <Clock size={10} /> {post.read_time}
                      </span>
                      <span className="text-[9px] text-zinc-700 font-bold">{fmtDate(post.created_at)}</span>
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}
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
