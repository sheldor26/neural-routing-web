import { SignUp } from "@clerk/nextjs";

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