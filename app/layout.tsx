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

export const metadata: Metadata = {
  title: "NeuralRouting.io | Enterprise AI Infrastructure",
  description: "Intelligent prompt routing in milliseconds. Save up to 85% on token costs by automatically switching between Economy and Premium models.",
  icons: {
    icon: "/favicon.ico", // Tu nueva Opción 2
    apple: "/icon.png",   // Para la pantalla de inicio de iOS
  },
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
        suppressHydrationWarning 
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body 
          className="min-h-full flex flex-col bg-[#09090b] text-zinc-200 selection:bg-blue-600/30"
          suppressHydrationWarning 
        >
          <main className="flex-grow">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
