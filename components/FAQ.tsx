"use client";

export default function FAQ() {
  const faqs = [
    {
      q: "How much can I actually save?",
      a: "Most companies are overpaying by 70–90% on their AI costs without realizing it. If you're spending $200/month, NeuralRouting brings that down to ~$40–60. That difference adds up fast—especially at scale. Join hundreds of developers already optimizing their margins.",
      featured: true 
    },
    {
      q: "Will I lose response quality?",
      a: "No. You get the same high-quality results—just at a lower cost. We automatically choose the best model for each request, reserving premium reasoning only for when it's actually needed."
    },
    {
      q: "Will this break my current setup?",
      a: "No. NeuralRouting is fully compatible with OpenAI-style requests. You can switch endpoints in seconds without changing your existing logic or refactoring a single line of code."
    },
    {
      q: "Is my data secure?",
      a: "Yes. Our Privacy Shield redacts sensitive info before it reaches any provider. Your data is never stored or used for training, keeping your business enterprise-ready and protected."
    },
    {
      q: "How do I start right now?",
      a: "Just paste your API key and send your first request. It takes less than 30 seconds to test. No complex setup. Start saving from your very first prompt."
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
            Don't let inefficient routing drain your budget. Switch to NeuralRouting in seconds.
          </p>
        </div>

        <div className="grid gap-6">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`group p-8 rounded-[2.5rem] transition-all duration-300 cursor-default border ${
                faq.featured 
                ? "bg-blue-500/5 border-blue-500/40 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]" 
                : "bg-zinc-900/20 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex gap-4 items-start">
                <span className={`font-mono font-black text-lg ${faq.featured ? "text-blue-400" : "text-zinc-600"}`}>
                  0{i + 1}
                </span>
                <div className="space-y-3">
                  <h4 className={`font-black italic uppercase tracking-tight text-xl ${faq.featured ? "text-blue-400" : "text-white group-hover:text-blue-400"} transition-colors`}>
                    {faq.q}
                  </h4>
                  <p className={`${faq.featured ? "text-zinc-300" : "text-zinc-400"} text-sm leading-relaxed italic font-medium`}>
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
