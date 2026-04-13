"use client";
import { useRef, useCallback } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";

export default function PricingGrid({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const mm = gsap.matchMedia();
    mm.add({
      normal: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { reduced } = context.conditions!;
      const cards = ref.current!.querySelectorAll("[data-pricing-card]");

      if (reduced) {
        gsap.set(cards, { autoAlpha: 1 });
        return;
      }

      gsap.from(cards, {
        y: 60,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
  }, { scope: ref });

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const card = (e.target as HTMLElement).closest("[data-pricing-card]");
    if (card) gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    const card = (e.target as HTMLElement).closest("[data-pricing-card]");
    if (card) gsap.to(card, { y: 0, duration: 0.4, ease: "power2.inOut" });
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
