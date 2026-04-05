import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "AI Gateway Pricing — LLM Router Plans | NeuralRouting" },
  description: "NeuralRouting AI gateway pricing starts free. LLM router plans from $29/mo. Save up to 97% on OpenAI, Anthropic & Llama API costs. No credit card required to start.",
  keywords: [
    "ai gateway pricing", "llm router pricing", "ai api gateway cost",
    "llm routing pricing", "openai proxy pricing", "ai cost optimization pricing",
    "llm gateway plans", "ai infrastructure pricing",
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
