"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { AnimatedStats, LiveBanner } from "@/components/AnimatedStats";
import { HeroAuth } from "@/components/LazyAuth";

interface HeroSectionProps {
  savings: number;
  stats: { savings: number; requests: number; users: number };
}

export default function HeroSection({ savings, stats }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const heroes = containerRef.current.querySelectorAll("[data-hero]");

    const mm = gsap.matchMedia();
    mm.add({
      normal: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { reduced } = context.conditions!;

      if (reduced) {
        gsap.set(heroes, { autoAlpha: 1 });
        return;
      }

      // Set initial hidden state explicitly, then animate to visible
      gsap.set("[data-hero='banner']", { autoAlpha: 0, y: -20 });
      gsap.set("[data-hero='title']", { autoAlpha: 0, y: 50 });
      gsap.set("[data-hero='subtitle']", { autoAlpha: 0, y: 30 });
      gsap.set("[data-hero='cta']", { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to("[data-hero='banner']", { y: 0, autoAlpha: 1, duration: 0.6 })
        .to("[data-hero='title']", { y: 0, autoAlpha: 1, duration: 1 }, "-=0.3")
        .to("[data-hero='subtitle']", { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.5")
        .to("[data-hero='cta']", { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.4");
    });
  }, { scope: containerRef });

  return (
    <header ref={containerRef} className="relative pt-16 pb-12 px-6 text-center max-w-6xl mx-auto flex flex-col items-center z-10 overflow-hidden">
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)" }} />
      </div>

      <div data-hero="banner">
        <LiveBanner savings={savings} />
      </div>

      <h1 data-hero="title" className="relative z-10 text-5xl md:text-[5.5rem] font-black tracking-tighter mb-6 leading-[0.9] bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent italic uppercase font-display">
        Stop paying premium prices <br /> for routine AI tasks.
      </h1>

      <p data-hero="subtitle" className="relative z-10 text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
        NeuralRouting is an intelligent LLM router that eliminates the Model Tax — routing every request to the right AI model at the right price. Cut LLM costs up to 85% with smart model routing, semantic caching, and zero-downtime failover.
        <span className="text-white font-bold ml-2 underline decoration-blue-500 underline-offset-4">Free tier available.</span>
      </p>

      <div data-hero="cta" className="relative z-20 flex flex-col items-center gap-6">
        <HeroAuth />
        <AnimatedStats stats={stats} />
      </div>
    </header>
  );
}
