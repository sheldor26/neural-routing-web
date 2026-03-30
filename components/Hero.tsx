import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden pt-20">
      {/* Background Effect: Neural Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8 animate-bounce">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Neural Node v2.2 Live</span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 leading-[0.9]">
          The Intelligence <br /> 
          <span className="text-blue-500 underline decoration-zinc-800 underline-offset-8">Router</span>
        </h1>

        <p className="text-zinc-500 text-xl md:text-2xl max-w-2xl mx-auto italic font-medium mb-12 leading-tight">
          Stop overpaying for GPT-4. Our Neural Engine automatically routes simple tasks to Llama 3.1, saving you up to 90% in real-time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full md:w-auto px-10 py-5 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
            Start Saving Now
          </Link>
          <Link href="#how-it-works" className="w-full md:w-auto px-10 py-5 bg-zinc-900 text-zinc-400 border border-zinc-800 font-black uppercase italic tracking-tighter rounded-2xl hover:bg-zinc-800 transition-all">
            View Documentation
          </Link>
        </div>

        {/* Trust Bar */}
        <div className="mt-24 pt-12 border-t border-zinc-900/50 flex flex-col items-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Integrated with Industry Leaders</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             {/* Acá podés poner logos simples de OpenAI, Groq, Anthropic */}
             <span className="text-2xl font-black italic tracking-tighter text-white">OPENAI</span>
             <span className="text-2xl font-black italic tracking-tighter text-white">GROQ</span>
             <span className="text-2xl font-black italic tracking-tighter text-white">META</span>
          </div>
        </div>
      </div>
    </section>
  );
}