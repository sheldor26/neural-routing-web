import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'; // Mantenemos el tema oscuro para los modales de login
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
    default: "NeuralRouting — Reduce OpenAI & LLM Costs by 97%",
    template: "%s | NeuralRouting.io",
  },
  description: "Cut your OpenAI, Anthropic and Llama API costs by up to 97%. NeuralRouting automatically routes every prompt to the cheapest model that can handle it. OpenAI SDK compatible. Free tier available.",
  keywords: ["reduce openai costs", "llm cost optimization", "llm routing", "openai api cost", "gpt-4 cheaper", "ai cost savings", "prompt routing", "reduce ai api costs", "openai alternative cheaper"],
  authors: [{ name: "NeuralRouting.io" }],
  creator: "NeuralRouting.io",
  metadataBase: new URL("https://neuralrouting.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neuralrouting.io",
    siteName: "NeuralRouting.io",
    title: "NeuralRouting.io — Save up to 97% on AI API Costs",
    description: "Intelligent AI routing that automatically selects the cheapest model for every prompt. Save up to 97% on OpenAI, Anthropic and Llama API costs with zero code changes.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NeuralRouting.io" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuralRouting.io — Save up to 97% on AI API Costs",
    description: "Intelligent AI routing that automatically selects the cheapest model for every prompt.",
    images: ["/og-image.png"],
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
          {/* El Header con el botón SIGN IN ha sido eliminado */}
          
          <main className="flex-grow">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}