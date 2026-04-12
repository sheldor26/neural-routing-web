"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const faqs = [
    {
      q: "How much can an LLM router save on AI costs?",
      a: "Most teams overpay 60-85% on LLM costs by sending every request to GPT-4o. NeuralRouting eliminates this Model Tax by routing simple tasks to economy models automatically. If you spend $1,000/month on OpenAI, intelligent model routing typically brings that to $150-400. The savings compound at scale.",
      featured: true
    },
    {
      q: "Will routing to cheaper models affect quality?",
      a: "No. The Shadow Engine validates every economy response against premium models in the background. If quality drops below threshold, the system auto-escalates to GPT-4o transparently. The Confidence Matrix learns from every audit, so your LLM router improves over time."
    },
    {
      q: "Is this compatible with my existing OpenAI setup?",
      a: "Yes. NeuralRouting is a drop-in OpenAI alternative API. Change your base_url to neuralrouting.io/v1 and your API key — nothing else changes. Works with any OpenAI SDK, LangChain, or custom integration. Full multi-provider LLM API with automatic failover."
    },
    {
      q: "What about data security and privacy?",
      a: "The Prompt Injection Shield scans every request for 6 attack categories before routing. PII auto-redaction strips sensitive data. Your prompts are never stored for training. Built for enterprise AI gateway requirements."
    },
    {
      q: "What happens when a provider goes down?",
      a: "NeuralRouting provides LLM failover and downtime protection automatically. If OpenAI goes down, requests reroute to backup providers transparently. Your users never notice. No code changes, no manual intervention."
    },
    {
      q: "How fast is the LLM semantic caching?",
      a: "Cache hits return in under 1ms at zero cost. The 2-level cache matches both identical and semantically similar queries. Typical applications see 30-40% cache hit rates, dramatically reducing LLM latency and API spend."
    }
  ];

  return (
    <section id="faq" className="py-24 px-6 bg-[#09090b] relative overflow-hidden">
      {/* Glow decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Stop Overpaying Instantly</h2>
          <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 text-white">
            Everything you need to <span className="text-zinc-600 underline decoration-blue-500/30 underline-offset-8">save money</span>
          </h3>
          <p className="text-zinc-500 text-lg italic max-w-xl mx-auto">
            Don&apos;t let inefficient routing drain your budget. Switch to NeuralRouting in seconds.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-[2.5rem] transition-all duration-300 border overflow-hidden ${
                  isOpen && faq.featured
                    ? "bg-blue-500/5 border-blue-500/40 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]"
                    : isOpen
                    ? "bg-zinc-900/30 border-zinc-700"
                    : "bg-zinc-900/20 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full p-8 flex gap-4 items-start text-left"
                >
                  <span className={`font-mono font-black text-lg shrink-0 ${faq.featured ? "text-blue-400" : "text-zinc-600"}`}>
                    0{i + 1}
                  </span>
                  <h4 className={`flex-1 font-black italic uppercase tracking-tight text-xl ${isOpen && faq.featured ? "text-blue-400" : "text-white"} transition-colors`}>
                    {faq.q}
                  </h4>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 mt-1 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-400" : "text-zinc-600"}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`px-8 pb-8 pl-[3.75rem] ${faq.featured ? "text-zinc-300" : "text-zinc-400"} text-sm leading-relaxed italic font-medium`}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges de confianza */}
        <div className="mt-16 pt-10 border-t border-zinc-900 flex flex-wrap justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SLA 99.9% Guaranteed</span>
           </div>
           <div className="flex items-center gap-2 text-blue-400">
             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
             <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Privacy</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Zero Data Training</span>
           </div>
        </div>
      </div>
    </section>
  );
}
