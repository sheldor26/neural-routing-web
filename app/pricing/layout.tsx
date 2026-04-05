import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Plans That Pay for Themselves",
  description: "Start free, scale as you grow. NeuralRouting plans save teams up to 97% on AI API costs. Starter $29/mo, Growth $89/mo, Business $349/mo.",
  openGraph: {
    title: "NeuralRouting Pricing — Save up to 97% on AI Costs",
    description: "Start free, scale as you grow. Plans from $29/mo that pay for themselves in days.",
    url: "https://neuralrouting.io/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
