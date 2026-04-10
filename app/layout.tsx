import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'; // Mantenemos el tema oscuro para los modales de login
import { Analytics } from '@vercel/analytics/react';
import JsonLd from '@/components/JsonLd';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // only loaded when code blocks are present
});

export const metadata: Metadata = {
  title: {
    default: "NeuralRouting — Intelligent LLM Router & AI Gateway",
    template: "%s | NeuralRouting.io",
  },
  description: "Route every AI request to the right model at the right price. NeuralRouting cuts LLM costs up to 85% with intelligent model routing, semantic caching, and zero-downtime failover. OpenAI SDK compatible.",
  keywords: ["llm router", "ai gateway", "llm cost optimization", "reduce openai costs", "model routing", "llm failover", "semantic caching llm", "ai model routing", "llm gateway", "reduce ai costs", "model tax", "cheapest llm router"],
  authors: [{ name: "NeuralRouting.io" }],
  creator: "NeuralRouting.io",
  metadataBase: new URL("https://neuralrouting.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neuralrouting.io",
    siteName: "NeuralRouting.io",
    title: "NeuralRouting.io — Intelligent LLM Router & AI Gateway",
    description: "Route every AI request to the right model automatically. Save up to 80% on OpenAI costs with zero code changes. OpenAI SDK compatible.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuralRouting.io — Intelligent LLM Router & AI Gateway",
    description: "Route every AI request to the right model automatically. Save up to 80% on OpenAI costs.",
    creator: "@neuralrouting",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#2563eb' }
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning 
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body 
          className="min-h-full flex flex-col bg-[#09090b] text-zinc-200 selection:bg-blue-600/30"
          suppressHydrationWarning 
        >
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NeuralRouting",
            url: "https://neuralrouting.io",
            logo: "https://neuralrouting.io/logo.png",
            description: "Intelligent LLM Router & AI Gateway. Eliminate the Model Tax — route every request to the right AI model at the right price.",
            sameAs: ["https://github.com/neuralrouting", "https://twitter.com/neuralrouting"],
          }} />
          <main className="flex-grow">
            {children}
          </main>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}