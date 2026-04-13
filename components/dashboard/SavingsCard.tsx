"use client";

import Link from 'next/link';
import { TrendingUp, Loader2 } from 'lucide-react';

interface SavingsCardProps {
  savings: number;
  loading: boolean;
}

export default function SavingsCard({ savings, loading }: SavingsCardProps) {
  return (
    <div className="p-10 rounded-[3rem] bg-blue-600 flex flex-col justify-center items-center text-center space-y-4 shadow-[0_0_80px_-20px_rgba(37,99,235,0.5)] group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
        <TrendingUp size={160} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 z-10 italic">Accumulated Savings</span>
      {!loading && savings === 0 ? (
        <p className="text-xl font-black italic text-white tracking-tight z-10 px-4">
          Your first saving is one request away
        </p>
      ) : (
        <h3 className="text-7xl font-black italic text-white tracking-tighter z-10">
          {loading ? <Loader2 className="animate-spin" size={40} /> : `$${savings.toFixed(2)}`}
        </h3>
      )}
      <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest z-10 opacity-70 italic">Total value saved by Neuralrouting</p>
      <Link href="/pricing" className="mt-4 block w-full py-5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors z-10 text-center">
          Maximize My Savings →
      </Link>
    </div>
  );
}
