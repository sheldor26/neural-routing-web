"use client";
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

const POSTS = [
  {
    title: "Optimizing LLM Latency: The Neural Advantage",
    excerpt: "How we achieved sub-200ms routing decisions using edge-compute nodes.",
    date: "March 28, 2026",
    readTime: "5 min",
    tag: "Engineering",
    slug: "optimizing-llm-latency"
  },
  {
    title: "The Economics of Token Arbitrage",
    excerpt: "Why fixed-model architectures are costing your enterprise millions in leakage.",
    date: "March 15, 2026",
    readTime: "8 min",
    tag: "Economics",
    slug: "economics-of-token-arbitrage"
  }
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 text-center md:text-left">
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase mb-4">
            Engineering <span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-zinc-500 italic font-medium max-w-xl">
            Deep dives into neural orchestration, cost-efficiency, and the future of agentic infrastructure.
          </p>
        </header>

        <div className="grid gap-12">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="relative p-8 rounded-[2rem] border border-zinc-800/50 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-blue-600/10 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-600/20">
                    {post.tag}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
                    <Clock size={12} /> {post.readTime}
                  </div>
                </div>
                
                <h2 className="text-2xl font-black italic text-white group-hover:text-blue-500 transition-colors mb-4 uppercase tracking-tighter">
                  {post.title}
                </h2>
                <p className="text-zinc-500 leading-relaxed mb-8 italic">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em]">
                  Read full analysis <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}