import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup — Get Your API Key",
  description: "Connect NeuralRouting to your app in minutes. Get your API key and start routing AI requests to the cheapest available model.",
  robots: { index: false, follow: false },
};

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
