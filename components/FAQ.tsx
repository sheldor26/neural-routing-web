"use client";

export default function FAQ() {
  const faqs = [
    {
      q: "How can I reduce LLM API costs without increasing latency?",
      a: "NeuralRoute utilizes a dual-engine architecture. By offloading routine tasks to high-speed LPU providers like Groq (Economy) and reserving complex reasoning for GPT-4o (Premium), you reduce costs by up to 90% while keeping overhead under 20ms."
    },
    {
      q: "Is my data secure with the Neural Privacy Filter?",
      a: "Yes. Our enterprise-grade Privacy Shield redacts PII (Personally Identifiable Information) like names, emails, and keys before they reach third-party model providers. Your data is never used for training purposes."
    },
    {
      q: "What happens if a model provider experiences an outage?",
      a: "Reliability is our priority. NeuralRoute includes an active failover system. If an Economy node or Premium provider fails, traffic is instantly rerouted to our Fallback Premium Node (GPT-4o-mini) to ensure 100% uptime."
    },
    {
      q: "Can I customize the routing logic for specific business needs?",
      a: "Our Enterprise plan allows for custom model weighting and specific keyword triggers. This ensures that business-critical prompts always utilize the most capable reasoning models regardless of length."
    }
  ];

  // SEO JSON-LD Schema for Google Search Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section id="faq" className="py-24 px-6 bg-[#09090b] relative overflow-hidden">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Support & Intelligence</h2>
          <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 text-white">
            Frequently Asked <span className="text-zinc-600 underline decoration-blue-500/30 underline-offset-8">Neural</span> Questions
          </h3>
          <p className="text-zinc-500 text-lg italic max-w-xl mx-auto">
            Everything you need to know about optimizing your AI infrastructure with the Neural Node.
          </p>
        </div>

        <div className="grid gap-6">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div className="flex gap-4 items-start">
                <span className="text-blue-500 font-mono font-black text-lg">0{i + 1}</span>
                <div className="space-y-3">
                  <h4 className="text-white font-black italic uppercase tracking-tight text-xl group-hover:text-blue-400 transition-colors">
                    {faq.q}
                  </h4>
                  <p className="text-zinc-400 text-sm leading-relaxed italic font-medium">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Trust Footer */}
        <div className="mt-16 pt-10 border-t border-zinc-900 flex flex-wrap justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SLA 99.9% Guaranteed</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">PCI DSS Compliant</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">GDPR Ready</span>
           </div>
        </div>
      </div>
    </section>
  );
}
