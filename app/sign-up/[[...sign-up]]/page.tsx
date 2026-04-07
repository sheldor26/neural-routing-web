import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free NeuralRouting account. Start saving up to 85% on AI API costs with intelligent LLM routing.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-6">
      <SignUp 
        // 1. Definimos la ruta exacta donde vive este componente
        path="/sign-up" 
        
        // 2. Reemplaza al viejo afterSignUpUrl para evitar conflictos
        forceRedirectUrl="/onboarding"

        // 4. Estética coherente con tu App
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-500 text-sm normal-case',
            card: 'bg-[#09090b] border border-slate-800',
          }
        }}
      />
    </div>
  );
}