import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-6">
      <SignIn 
        // 1. Definimos la ruta donde está montado este componente
        path="/sign-in" 
        
        // 2. Usamos la nueva prop de Clerk v5 (reemplaza a afterSignInUrl)
        fallbackRedirectUrl="/dashboard"
        
        // 3. Opcional: Si querés forzar que SIEMPRE vaya al dashboard 
        // aunque el usuario viniera de otra URL:
        // forceRedirectUrl="/dashboard"

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