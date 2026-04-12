"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { NavAuth } from '@/components/LazyAuth';

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/model-tax", label: "Model Tax" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto relative z-50">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter italic">
          NEURAL<span className="text-blue-600">ROUTING</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">
              {l.label}
            </Link>
          ))}
          <NavAuth />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[100] bg-[#050505]/98 backdrop-blur-xl transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`flex flex-col h-full transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="flex justify-between items-center p-6">
            <span className="text-xl font-black tracking-tighter italic">
              NEURAL<span className="text-blue-600">ROUTING</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-zinc-300 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
            {LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-black italic uppercase tracking-tighter text-zinc-400 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-8 pt-8 border-t border-white/10 w-full max-w-xs flex justify-center">
              <NavAuth />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-center">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
              Intelligent LLM Router & AI Gateway
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
