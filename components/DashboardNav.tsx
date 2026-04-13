"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Zap, Menu, X,
  LayoutDashboard, BarChart2, ScrollText, Users, ShieldCheck,
  Workflow, MessageSquare, Home, DollarSign, TrendingUp, UsersRound, GitMerge,
  FileText, Settings,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
      { href: "/chat",        label: "Chat",         icon: MessageSquare },
    ],
  },
  {
    label: "Observability",
    items: [
      { href: "/logs",        label: "Request Logs", icon: ScrollText },
      { href: "/analytics",   label: "Analytics",    icon: BarChart2 },
      { href: "/quality",     label: "Quality",      icon: ShieldCheck },
    ],
  },
  {
    label: "Optimize",
    items: [
      { href: "/finops",      label: "FinOps ROI",   icon: TrendingUp },
      { href: "/attribution", label: "Attribution",  icon: Users },
      { href: "/rules",       label: "Routing Rules",icon: GitMerge },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/team",        label: "Team",         icon: UsersRound },
      { href: "/workflows",   label: "Workflows",    icon: Workflow },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/docs",        label: "Docs",         icon: FileText },
      { href: "/pricing",     label: "Pricing",      icon: DollarSign },
      { href: "/",            label: "Home",         icon: Home },
    ],
  },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="text-sm font-black italic uppercase tracking-tighter text-white">
            NeuralRouting
          </span>
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 px-2 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                    isActive(href)
                      ? "text-white bg-blue-600/15 border border-blue-500/20"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon size={14} className={isActive(href) ? "text-blue-400" : ""} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User */}
      <div className="px-5 py-4 border-t border-white/5 flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Account</span>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-[#080809] border-r border-white/5 flex-col z-50">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black/90 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Zap size={16} className="text-blue-500 fill-blue-500" />
          <span className="text-sm font-black italic uppercase tracking-tighter text-white">NR</span>
        </Link>
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer + backdrop */}
      <div
        className={`lg:hidden fixed inset-0 top-14 z-30 bg-black/60 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`lg:hidden fixed inset-y-0 left-0 top-14 z-40 w-64 bg-[#080809] border-r border-white/5 overflow-y-auto transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
          <div className="py-4 px-3 space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 px-2 mb-2">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive(href)
                          ? "text-white bg-blue-600/15 border border-blue-500/20"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon size={16} className={isActive(href) ? "text-blue-400" : ""} />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
      </div>
    </>
  );
}
