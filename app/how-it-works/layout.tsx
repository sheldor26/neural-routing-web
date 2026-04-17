import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — 8-Step AI Routing Architecture",
  description: "See how NeuralRouting's 8-step pipeline routes every prompt through semantic cache, security shield, complexity analysis, and dynamic model selection.",
  alternates: { canonical: "https://neuralrouting.io/how-it-works" },
  openGraph: {
    title: "How NeuralRouting Works — 8-Step AI Routing Architecture",
    description: "Semantic cache, security shield, confidence matrix, dynamic routing — all in under 200ms.",
    url: "https://neuralrouting.io/how-it-works",
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
