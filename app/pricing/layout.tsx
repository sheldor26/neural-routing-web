import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "AI Gateway Pricing — LLM Router Plans | NeuralRouting" },
  description: "NeuralRouting AI gateway pricing starts free. LLM router plans from $29/mo. Save up to 97% on OpenAI, Anthropic & Llama API costs. No credit card required to start.",
  keywords: [
    "AI gateway pricing", "LLM router pricing", "cheapest LLM router",
    "LLM gateway", "reduce AI costs", "OpenAI alternative API",
    "enterprise AI gateway", "LLM cost optimization", "AI API cost calculator",
    "best LLM gateway 2026", "multi-provider LLM API",
  ],
  openGraph: {
    title: "AI Gateway Pricing — LLM Router Plans from $0 | NeuralRouting",
    description: "AI gateway and LLM router pricing. Free tier + paid plans from $29/mo. Save up to 97% on AI API costs.",
    url: "https://neuralrouting.io/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Gateway Pricing — LLM Router Plans | NeuralRouting",
    description: "Free tier + plans from $29/mo. Save up to 97% on OpenAI costs.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
