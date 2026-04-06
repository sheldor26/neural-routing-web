import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, Zap } from "lucide-react";

export const revalidate = 60;

const TAG_COLORS: Record<string, string> = {
  Engineering:       "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Architecture:      "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Neural Research": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const TAG_SLUG: Record<string, string> = {
  Engineering:       "engineering",
  Architecture:      "architecture",
  "Neural Research": "neural-research",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// --- Dynamic metadata per post ---
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, slug, cover_image, tag, created_at")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Post Not Found" };

  // Keep rendered title (post.title + " | NeuralRouting.io") under 60 chars.
  // Template adds " | NeuralRouting.io" (19 chars), so cap the raw title at 41.
  const SUFFIX = " | NeuralRouting.io";
  const MAX_TITLE = 60 - SUFFIX.length; // 41
  const seoTitle = post.title.length > MAX_TITLE
    ? { absolute: post.title.slice(0, MAX_TITLE - 1).trimEnd() + "…" + SUFFIX }
    : post.title;

  return {
    title: seoTitle,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: typeof seoTitle === "string" ? seoTitle : post.title.slice(0, MAX_TITLE - 1) + "…",
      description: post.excerpt ?? undefined,
      url: `https://neuralrouting.io/blog/${post.slug}`,
      type: "article",
      publishedTime: post.created_at,
      tags: [post.tag, "AI cost optimization", "LLM routing"],
      images: post.cover_image ? [{ url: post.cover_image }] : [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [post.cover_image ?? "/og-image.png"],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) notFound();

  // Related posts — same tag, exclude current
  const { data: related } = await supabase
    .from("posts")
    .select("slug, title, tag, read_time")
    .eq("published", true)
    .eq("tag", post.tag)
    .neq("slug", post.slug)
    .limit(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: "NeuralRouting.io", url: "https://neuralrouting.io" },
    publisher: {
      "@type": "Organization",
      name: "NeuralRouting.io",
      logo: { "@type": "ImageObject", url: "https://neuralrouting.io/icon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://neuralrouting.io/blog/${post.slug}` },
    keywords: `${post.tag}, AI cost optimization, LLM routing, reduce OpenAI costs`,
    ...(post.cover_image ? { image: post.cover_image } : {}),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Blog", item: "https://neuralrouting.io/blog" },
        { "@type": "ListItem", position: 2, name: post.tag, item: `https://neuralrouting.io/blog/category/${TAG_SLUG[post.tag] ?? post.tag.toLowerCase()}` },
        { "@type": "ListItem", position: 3, name: post.title, item: `https://neuralrouting.io/blog/${post.slug}` },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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

      <main className="relative z-10 max-w-[780px] mx-auto px-6 py-16">

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-8">
          <Link href="/blog" className="hover:text-zinc-400 transition-colors">Blog</Link>
          <span>/</span>
          <Link
            href={`/blog/category/${TAG_SLUG[post.tag] ?? post.tag.toLowerCase()}`}
            className="hover:text-zinc-400 transition-colors"
          >
            {post.tag}
          </Link>
          <span>/</span>
          <span className="text-zinc-700 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Cover image */}
        {post.cover_image && (
          <div className="mb-12 rounded-[2rem] overflow-hidden border border-zinc-800 aspect-[16/7]">
            <img src={post.cover_image} alt={post.title} width={780} height={341} className="w-full h-full object-cover" fetchPriority="high" />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/blog/category/${TAG_SLUG[post.tag] ?? post.tag.toLowerCase()}`}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all hover:opacity-80 ${TAG_COLORS[post.tag] ?? "text-zinc-400 bg-zinc-800 border-zinc-700"}`}
          >
            {post.tag}
          </Link>
          <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1">
            <Clock size={11} /> {post.read_time}
          </span>
          <span className="text-[9px] text-zinc-700 font-bold">{fmtDate(post.created_at)}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black italic text-white tracking-tighter leading-[0.9] mb-8 uppercase">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-zinc-300 text-xl leading-[1.75] mb-10 font-light border-l-[3px] border-blue-600/50 pl-5 bg-blue-500/[0.04] pr-4 py-2 rounded-r-xl">
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
              <p className="text-[10px] font-black text-white uppercase tracking-tight">NeuralRouting Team</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{fmtDate(post.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="
          prose prose-invert max-w-none

          [&>*]:max-w-[68ch]

          prose-h2:text-[1.6rem] prose-h2:font-black prose-h2:italic prose-h2:uppercase prose-h2:tracking-tight prose-h2:text-white prose-h2:mt-14 prose-h2:mb-5 prose-h2:leading-tight
          prose-h3:text-xl prose-h3:font-bold prose-h3:text-white/90 prose-h3:mt-10 prose-h3:mb-4 prose-h3:leading-snug
          prose-h4:text-base prose-h4:font-bold prose-h4:text-zinc-300 prose-h4:mt-8 prose-h4:mb-3

          prose-p:text-zinc-400 prose-p:leading-[1.95] prose-p:text-[1.05rem] prose-p:mb-7 prose-p:tracking-[0.01em]

          prose-li:text-zinc-400 prose-li:leading-[1.85] prose-li:mb-2 prose-li:tracking-[0.01em]
          prose-ul:my-7 prose-ul:space-y-0 prose-ul:pl-6
          prose-ol:my-7 prose-ol:pl-6
          prose-ul:marker:text-blue-500/60
          prose-ol:marker:text-zinc-600

          prose-strong:text-zinc-200 prose-strong:font-semibold

          prose-em:text-zinc-300 prose-em:not-italic

          prose-code:text-blue-400 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-[0.15em] prose-code:rounded-md prose-code:text-[0.875em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-blue-500/20

          prose-pre:bg-[#0d0d10] prose-pre:border prose-pre:border-zinc-800/80 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-10 prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:leading-relaxed

          prose-table:text-sm prose-table:my-8 prose-thead:border-zinc-700 prose-tbody:divide-zinc-800 prose-th:text-zinc-300 prose-th:font-semibold prose-th:py-3 prose-th:px-4 prose-td:text-zinc-400 prose-td:py-3 prose-td:px-4

          prose-blockquote:border-l-[3px] prose-blockquote:border-blue-500/60 prose-blockquote:bg-blue-500/5 prose-blockquote:text-zinc-400 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-1 prose-blockquote:my-10 prose-blockquote:rounded-r-xl prose-blockquote:not-italic

          prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-blue-500/30 hover:prose-a:border-blue-400 hover:prose-a:text-blue-300

          prose-hr:border-zinc-800/60 prose-hr:my-14

          prose-img:rounded-2xl prose-img:border prose-img:border-zinc-800
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Related Posts */}
        {related && related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-zinc-800">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
              More in {post.tag}
            </p>
            <div className="space-y-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-zinc-800/60 hover:border-blue-500/30 hover:bg-zinc-900/20 transition-all"
                >
                  <p className="text-sm font-black italic uppercase tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                    {r.title}
                  </p>
                  <span className="text-[9px] text-zinc-700 font-bold shrink-0 ml-4">{r.read_time}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <footer className="mt-20 pt-12 border-t border-zinc-800">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-1">
                Ready to cut your AI costs?
              </h4>
              <p className="text-zinc-500 text-xs font-medium italic">
                Start saving up to 97% on token costs today. Free tier available.
              </p>
            </div>
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-xl shrink-0"
            >
              Get Started Free →
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
