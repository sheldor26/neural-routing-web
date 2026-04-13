"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";

export function useScrollReveal(options?: {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    y = 40,
    duration = 0.8,
    stagger = 0.1,
    delay = 0,
    start = "top 85%",
  } = options ?? {};

  useGSAP(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.querySelectorAll("[data-reveal]");
    if (children.length === 0) return;

    gsap.from(children, {
      y,
      autoAlpha: 0,
      duration,
      stagger,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start,
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef });

  return containerRef;
}
