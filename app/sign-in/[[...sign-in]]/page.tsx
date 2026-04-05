import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NeuralRouting account to access your AI gateway dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-6">
      <SignIn 
        // 1. Definimos la ruta donde está montado este componente
        path="/sign-in" 
        
        // 2. Usamos la nueva prop de Clerk v5 (reemplaza a afterSignInUrl)
        fallbackRedirectUrl="/dashboard"

        // 4. Apariencia para que combine con tu fondo oscuro
        appearance={{
          baseTheme: undefined, // O "dark" si importás { dark } de @clerk/themes
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-500',
          }
        }}
      />
    </div>
  );
}