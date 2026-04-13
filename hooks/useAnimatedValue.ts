"use client";
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-setup";

export function useAnimatedValue(value: number, prefix = "$") {
  const ref = useRef<HTMLSpanElement>(null);
  const objRef = useRef({ val: value });

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(objRef.current, {
      val: value,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(objRef.current.val).toLocaleString()}`;
        }
      },
    });
  }, [value, prefix]);

  return ref;
}
