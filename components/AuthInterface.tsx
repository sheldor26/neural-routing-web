"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight } from 'lucide-react';

export function NavAuth() {
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition">
            Get Started
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-4 bg-zinc-900/50 p-1 pl-4 rounded-full border border-zinc-800">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Dashboard</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}

export function HeroAuth() {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-2">
            Try Live Demo <ArrowRight size={20} />
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <a href="#playground" className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-2">
          Launch Simulator <ArrowRight size={20} />
        </a>
      </SignedIn>
    </div>
  );
}