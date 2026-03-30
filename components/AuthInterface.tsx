"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export function NavAuth() {
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        {/* Agregamos forceRedirectUrl para que el login sea directo al dashboard */}
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition">
            Get Started
          </button>
        </SignInButton>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center gap-3 bg-zinc-900/50 p-1 pl-4 rounded-full border border-zinc-800">
          <Link 
            href="/dashboard" 
            className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-blue-400 transition flex items-center gap-2"
          >
            Dashboard <LayoutDashboard size={12} />
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}

export function HeroAuth() {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-2 group">
            Try Live Demo 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </SignInButton>
      </SignedOut>
      
      <SignedIn>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard" 
            className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-2 group"
          >
            Go to Dashboard
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
          </Link>
          
          <a 
            href="#playground" 
            className="px-10 py-5 rounded-2xl font-bold text-lg border border-zinc-800 hover:bg-zinc-900 transition flex items-center justify-center gap-2"
          >
            Launch Simulator
          </a>
        </div>
      </SignedIn>
    </div>
  );
}