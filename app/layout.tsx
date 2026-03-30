import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- LOGO COMPONENT (Neural Spark Op 1) ---
const NeuralLogo = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
  >
    <circle cx="50" cy="50" r="10" fill="white"/>
    <circle cx="50" cy="50" r="15" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4"/>
    <circle cx="20" cy="20" r="6" fill="#3f3f46"/>
    <circle cx="80" cy="80" r="6" fill="#3f3f46"/>
    <circle cx="20" cy="80" r="6" fill="#3b82f6"/>
    <circle cx="80" cy="20" r="6" fill="#3b82f6"/>
    <path d="M26 26 L42 42" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round"/>
    <path d="M74 74 L58 58" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round"/>
    <path d="M26 74 L42 58" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M74 26 L58 42" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// --- SEO METADATA OPTIMIZATION ---
export const metadata: Metadata = {
  title: "NeuralRoute | Smart AI Infrastructure & Cost Optimizer",
  description: "Stop overpaying for LLMs. Our Neural Node technology routes prompts between Llama 3.1 and GPT-4o to save you up to 90% on API costs.",
  keywords: ["AI Router", "LLM Cost Savings", "Neural Node", "OpenAI Optimizer", "Smart Prompt Routing"],
  icons: {
    icon: "/favicon.ico", // Asegurate de subir el logo como favicon después
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-200">
          {/* Header Global (Opcional, podés moverlo a un componente Navbar) */}
          <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <NeuralLogo size={28} />
                <span className="text-xl font-black italic uppercase tracking-tighter text-white">
                  NeuralRoute<span className="text-blue-500">.io</span>
                </span>
              </div>
              {/* Aquí Clerk manejará los botones de Login/UserButton automáticamente */}
            </div>
          </nav>

          <main className="flex-grow pt-16">
            {children}
          </main>

          {/* Footer Minimalista para SEO */}
          <footer className="py-12 border-t border-zinc-900 bg-black">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 opacity-50 grayscale">
                <NeuralLogo size={20} />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Neural Node Framework</span>
              </div>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                © 2026 NeuralRoute Global | Infrastructure by Neural Nodes
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
