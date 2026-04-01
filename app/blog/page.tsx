"use client";
import { Bot, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  // Mock data for now
  const posts = [
    { id: 1, title: "Neural Latency Optimization", date: "2026-03-31", slug: "neural-latency" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 text-center md:text-left">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
            Neural <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-bold">
            Engineering Logs & Infrastructure Updates
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block p-8 rounded-[2rem] border border-zinc-900 bg-zinc-900/10 hover:border-blue-600/50 transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mb-2">{post.date}</p>
                  <h2 className="text-2xl font-black italic uppercase group-hover:text-blue-400 transition-colors">{post.title}</h2>
                </div>
                <ChevronRight className="text-zinc-800 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-600 uppercase text-[10px] font-black tracking-widest italic font-medium">
              No engineering logs found in current node.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}