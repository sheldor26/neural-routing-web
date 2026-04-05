"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Zap, Menu, X,
  LayoutDashboard, BarChart2, ScrollText, Users, ShieldCheck,
  Workflow, MessageSquare, Home, DollarSign, TrendingUp, UsersRound,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Nav items config
// ---------------------------------------------------------------------------
const NAV_GROUPS = [
  {
    label: "Tools",
    items: [
      { href: "/chat",      label: "Chat",      icon: MessageSquare },
      { href: "/workflows", label: "Workflows", icon: Workflow      },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
      { href: "/analytics",   label: "Analytics",   icon: BarChart2       },
      { href: "/logs",        label: "Logs",        icon: ScrollText      },
      { href: "/attribution", label: "Attribution", icon: Users           },
      { href: "/quality",     label: "Quality",     icon: ShieldCheck     },
      { href: "/finops",      label: "FinOps ROI",  icon: TrendingUp      },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/team",    label: "Team",    icon: UsersRound },
      { href: "/",        label: "Home",    icon: Home       },
      { href: "/pricing", label: "Pricing", icon: DollarSign },
    ],
  },
];

const NAV_LINK_BASE =
  "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all";
const NAV_LINK_ACTIVE =
  "text-white bg-white/10 border border-white/15";
const NAV_LINK_IDLE =
  "text-zinc-500 hover:text-white border border-transparent hover:border-white/10";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashboardNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50 h-16 flex items-center justify-between px-5 md:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="text-base font-black italic uppercase tracking-tighter text-white">
            Neuralrouting.io
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-1">
          {/* Tools group */}
          <div className="flex items-center gap-1 mr-2">
            {NAV_GROUPS[0].items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`${NAV_LINK_BASE} ${isActive(href) ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
              >
                <Icon size={11} />
                {label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Insights group */}
          <div className="flex items-center gap-1 mx-2">
            {NAV_GROUPS[1].items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`${NAV_LINK_BASE} ${isActive(href) ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
              >
                <Icon size={11} />
                {label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Account group */}
          <div className="flex items-center gap-1 ml-2">
            {NAV_GROUPS[2].items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`${NAV_LINK_BASE} ${isActive(href) ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
              >
                <Icon size={11} />
                {label}
              </Link>
            ))}
          </div>

          <div className="w-px h-5 bg-white/10 mx-2" />
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Mobile: avatar + hamburger */}
        <div className="flex xl:hidden items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="xl:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-xl overflow-y-auto pb-10">
          <div className="px-5 pt-6 space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3 px-1">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                        isActive(href)
                          ? "text-white bg-white/10 border border-white/15"
                          : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
