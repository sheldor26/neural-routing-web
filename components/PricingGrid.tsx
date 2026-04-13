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

      gsap.set(cards, { autoAlpha: 0, y: 60 });
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
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

  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    const card = (e.target as HTMLElement).closest("[data-pricing-card]");
    if (!card) return;
    gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  }, []);

  const handleMouseOut = useCallback((e: React.MouseEvent) => {
    const card = (e.target as HTMLElement).closest("[data-pricing-card]");
    if (!card) return;
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && card.contains(relatedTarget)) return;
    gsap.to(card, { y: 0, duration: 0.4, ease: "power2.inOut", overwrite: "auto" });
  }, []);

  return (
    <div
      ref={ref}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </div>
  );
}
