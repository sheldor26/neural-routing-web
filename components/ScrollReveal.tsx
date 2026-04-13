"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  stagger?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  y = 40,
  duration = 0.8,
  delay = 0,
  start = "top 85%",
  stagger = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const mm = gsap.matchMedia();
    mm.add({
      normal: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { reduced } = context.conditions!;

      const targets = ref.current!.querySelectorAll("[data-reveal]");
      const elements = targets.length > 0 ? targets : ref.current!;

      if (reduced) {
        gsap.set(elements, { autoAlpha: 1 });
        return;
      }

      gsap.from(elements, {
        y,
        autoAlpha: 0,
        duration,
        delay,
        stagger: targets.length > 0 ? stagger : 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none none",
        },
      });
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}
