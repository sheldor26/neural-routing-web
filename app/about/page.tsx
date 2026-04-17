import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Compass, Code2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "About NeuralRouting — Juan Miranda, Founder | NeuralRouting.io" },
  description: "The story behind NeuralRouting.io. Founded in 2025 by Juan Miranda to end the Model Tax — the hidden cost of sending every LLM request to GPT-4o.",
  alternates: { canonical: "https://neuralrouting.io/about" },
  openGraph: {
    title: "About NeuralRouting — Juan Miranda, Founder",
    description: "Why NeuralRouting exists — the Model Tax, the mission, and the person building it.",
    url: "https://neuralrouting.io/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About NeuralRouting — Juan Miranda, Founder",
    description: "Why NeuralRouting exists — the Model Tax, the mission, and the person building it.",
  },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Juan Miranda",
  jobTitle: "Founder & CEO",
  worksFor: {
    "@type": "Organization",
    name: "NeuralRouting.io",
    url: "https://neuralrouting.io",
  },
  url: "https://neuralrouting.io/about",
  sameAs: [],
  description:
    "Founder of NeuralRouting.io — building the intelligent LLM router that eliminates the Model Tax and reduces LLM costs by 60–85%.",
  image: "https://neuralrouting.io/juan.jpg",
};

const aboutPageLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://neuralrouting.io/about",
  name: "About NeuralRouting — Juan Miranda, Founder",
  mainEntity: { "@id": "https://neuralrouting.io/#org" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://neuralrouting.io" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://neuralrouting.io/about" },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }}
      />

      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="text-base font-black italic uppercase tracking-tighter text-white">
            Neuralrouting.io
          </span>
        </Link>
        <Link
          href="/sign-up"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
        >
          Get Started Free
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">
          About
        </p>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mb-8">
          The <span className="text-blue-500">Model Tax</span> has to end.
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-2xl">
          NeuralRouting exists to fix one specific problem: teams burn 60–85% of their LLM
          budget sending every request — trivial or complex — to the most expensive model they
          can access. We call that the Model Tax. Our job is to eliminate it automatically,
          without asking you to rewrite a line of code.
        </p>

        {/* Founder card */}
        <section className="mb-16 p-8 rounded-[2rem] border border-zinc-800/80 bg-zinc-900/20">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 shrink-0 rounded-[1.25rem] bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-xl font-black text-white overflow-hidden">
              {/* Replace with <Image src="/juan.jpg" ... /> once the photo is added */}
              JM
            </div>
            <div>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">
                Founder
              </p>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-3">
                Juan Miranda
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Solo engineer, indie founder. Spent years watching product teams overpay for
                AI inference by orders of magnitude — sending &quot;what&apos;s 2+2&quot; to GPT-4o because
                routing logic was tedious to build. I started NeuralRouting in 2025 to make
                that routing a commodity: managed, OpenAI-compatible, and honest about what
                gets sent where.
              </p>
            </div>
          </div>
        </section>

        {/* Mission / values */}
        <section className="mb-20 space-y-10">
          <div className="flex gap-5">
            <Target size={22} className="text-blue-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">
                The mission
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Make intelligent LLM routing a default, not a side project. Every team
                sending production traffic to an LLM should know exactly which model ran each
                request, why it was chosen, and what it cost — without building that
                observability layer themselves.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <Compass size={22} className="text-blue-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">
                What we optimize for
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Cost per <em>correct</em> output. Not cheapest tokens. Not lowest latency in
                isolation. Our Shadow Engine audits routed outputs against the premium tier
                so you can prove quality didn&apos;t drop — and rollback confidently when it does.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <Code2 size={22} className="text-blue-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">
                How we build
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Ship weekly. Publish benchmarks before marketing claims. Stay{" "}
                <Link
                  href="/docs"
                  className="text-blue-400 border-b border-blue-500/30 hover:text-blue-300"
                >
                  OpenAI SDK compatible
                </Link>
                {" "}so swapping in NeuralRouting is a one-line change. If a customer can&apos;t
                leave us in under five minutes, we don&apos;t deserve them.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-1">
              See your Model Tax in numbers.
            </h4>
            <p className="text-zinc-500 text-xs font-medium italic">
              Free tier, 5,000 credits, no credit card.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase italic tracking-tighter rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-xl shrink-0 flex items-center gap-2"
          >
            Get Started Free <ArrowRight size={14} />
          </Link>
        </section>
      </main>
    </div>
  );
}
