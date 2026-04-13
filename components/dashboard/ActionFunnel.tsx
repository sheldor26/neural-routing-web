"use client";

import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

export default function ActionFunnel() {
  return (
    <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/10">
        <div className="space-y-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Step 1: Deployment</p>
            <h2 className="text-xl font-black italic text-white uppercase">Scale your savings to production</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
            <Link href="/setup" className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 font-bold">
                Go to Production Setup <ArrowRight size={14}/>
            </Link>
            <Link href="/report" target="_blank" className="px-8 py-3 bg-zinc-800 text-zinc-300 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all flex items-center gap-2">
                <FileText size={14} /> Monthly Report
            </Link>
        </div>
    </div>
  );
}
