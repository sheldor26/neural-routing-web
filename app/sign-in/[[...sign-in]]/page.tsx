import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-6">
      <SignIn 
        // 1. Definimos la ruta donde está montado este componente
        path="/sign-in" 
        
        // 2. Usamos la nueva prop de Clerk v5 (reemplaza a afterSignInUrl)
        forceRedirectUrl="/"

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