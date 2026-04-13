"use client";
import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";

const CODE_LINES = [
  'import OpenAI from "openai";',
  '',
  '// Change one line. Save 80%.',
  'const client = new OpenAI({',
  '  baseURL: "https://neuralrouting.io/v1",',
  '  apiKey:  "nr_live_...",',
  '});',
  '',
  'const res = await client.chat.completions.create({',
  '  model: "auto", // NeuralRouting picks the best',
  '  messages: [{ role: "user", content: "..." }],',
  '});',
];

function highlightLine(line: string) {
  if (!line) return <br />;

  // Comments
  if (line.trimStart().startsWith("//")) {
    return <span className="text-zinc-600 italic">{line}</span>;
  }

  // Process tokens
  const parts: React.ReactElement[] = [];
  let remaining = line;
  let key = 0;

  const rules: [RegExp, string][] = [
    [/\b(import|from|const|await|new)\b/g, "text-purple-400"],
    [/"[^"]*"/g, "text-emerald-400"],
    [/\/\/.*/g, "text-zinc-600"],
    [/\b(baseURL|apiKey|model|messages|role|content)\b/g, "text-blue-300"],
    [/[{}(),;:=.[\]]/g, "text-zinc-500"],
  ];

  // Simple approach: split by strings first, then keywords
  const stringRegex = /"[^"]*"/g;
  const segments: { text: string; color?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = stringRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, match.index) });
    }
    segments.push({ text: match[0], color: "text-emerald-400" });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    segments.push({ text: line.slice(lastIndex) });
  }

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.color) {
          return <span key={i} className={seg.color}>{seg.text}</span>;
        }
        // Highlight keywords and punctuation in non-string segments
        let text = seg.text;
        const tokens: React.ReactElement[] = [];
        const tokenRegex = /(\b(?:import|from|const|await|new)\b)|(\/\/.*)|(\b(?:baseURL|apiKey|model|messages|role|content)\b)|([{}(),;:=.\[\]])/g;
        let tLastIndex = 0;
        let tMatch;
        let tKey = 0;

        while ((tMatch = tokenRegex.exec(text)) !== null) {
          if (tMatch.index > tLastIndex) {
            tokens.push(<span key={`t${tKey++}`} className="text-zinc-300">{text.slice(tLastIndex, tMatch.index)}</span>);
          }
          const color = tMatch[1] ? "text-purple-400" :
                        tMatch[2] ? "text-zinc-600 italic" :
                        tMatch[3] ? "text-blue-300" :
                        "text-zinc-500";
          tokens.push(<span key={`t${tKey++}`} className={color}>{tMatch[0]}</span>);
          tLastIndex = tMatch.index + tMatch[0].length;
        }
        if (tLastIndex < text.length) {
          tokens.push(<span key={`t${tKey++}`} className="text-zinc-300">{text.slice(tLastIndex)}</span>);
        }
        return <span key={i}>{tokens}</span>;
      })}
    </>
  );
}

export default function CodeShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();
    mm.add({
      normal: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { reduced } = context.conditions!;
      const lines = containerRef.current!.querySelectorAll("[data-code-line]");

      if (reduced) {
        gsap.set(lines, { autoAlpha: 1 });
        return;
      }

      gsap.from(lines, {
        autoAlpha: 0,
        x: -10,
        duration: 0.3,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-black border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
      <div className="flex gap-1.5 mb-4">
        <div className="w-2 h-2 rounded-full bg-zinc-800" />
        <div className="w-2 h-2 rounded-full bg-zinc-800" />
        <div className="w-2 h-2 rounded-full bg-zinc-800" />
      </div>
      <pre className="text-[11px] leading-[1.6]" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
        {CODE_LINES.map((line, i) => (
          <div key={i} data-code-line style={{ visibility: "hidden" }}>
            {highlightLine(line)}
          </div>
        ))}
      </pre>
    </div>
  );
}
