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

    const targets = ref.current.querySelectorAll("[data-reveal]");
    const elements = targets.length > 0 ? Array.from(targets) : [ref.current];

    const mm = gsap.matchMedia();
    mm.add({
      normal: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { reduced } = context.conditions!;

      if (reduced) {
        // Make everything visible immediately for users who prefer reduced motion
        gsap.set(ref.current, { visibility: "inherit" });
        gsap.set(elements, { autoAlpha: 1 });
        return;
      }

      // 1. Make the wrapper visible so children can be seen once animated
      gsap.set(ref.current, { visibility: "inherit" });

      // 2. Set initial hidden state on the actual elements
      gsap.set(elements, { autoAlpha: 0, y });

      // 3. Animate them in when scrolled into view
      gsap.to(elements, {
        y: 0,
        autoAlpha: 1,
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
