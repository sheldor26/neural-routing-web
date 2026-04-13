"use client";
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-setup';

interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const objRef = useRef({ val: 0 });

  useGSAP(() => {
    if (value === 0 || !spanRef.current) return;
    objRef.current.val = 0;

    gsap.to(objRef.current, {
      val: value,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: spanRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${Math.floor(objRef.current.val).toLocaleString()}${suffix}`;
        }
      },
    });
  }, { dependencies: [value] });

  return <span ref={spanRef}>{prefix}0{suffix}</span>;
}

export function AnimatedStats({ stats }: { stats: { savings: number; requests: number; users: number } }) {
  const items: Stat[] = [
    { label: "Saved by users",  value: stats.savings,  prefix: "$", suffix: "",   color: "text-emerald-400" },
    { label: "Requests routed", value: stats.requests, prefix: "",  suffix: "+",  color: "text-blue-400" },
    { label: "Dev teams",       value: stats.users,    prefix: "",  suffix: "+",  color: "text-purple-400" },
    { label: "Avg latency",     value: 118,            prefix: "",  suffix: "ms", color: "text-white" },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {items.map((s) => (
        <div key={s.label} className="flex flex-col items-center border border-white/5 bg-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm min-w-[110px]">
          <p className={`text-lg font-black italic ${s.color}`}>
            <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
          </p>
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function LiveBanner({ savings }: { savings: number }) {
  if (savings >= 500) {
    return (
      <div className="inline-flex items-center gap-3 mb-10 p-1 pr-4 bg-red-500/5 border border-red-500/20 backdrop-blur-md rounded-full">
        <div className="px-3 py-1 rounded-full bg-red-600 text-white text-[9px] font-black tracking-widest uppercase italic animate-pulse">Efficiency Leak</div>
        <span className="text-[10px] font-bold text-red-100 uppercase tracking-tight">
          Neural Node: ${savings.toLocaleString()} saved since launch.
        </span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-3 mb-10 p-1 pr-4 bg-blue-500/5 border border-blue-500/20 backdrop-blur-md rounded-full">
      <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase italic">Live</div>
      <span className="text-[10px] font-bold text-blue-100 uppercase tracking-tight">
        Intelligent routing · 450+ dev teams · Free tier available
      </span>
    </div>
  );
}
