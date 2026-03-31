import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definimos las rutas que REQUIEREN protección
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/dashboard(.*)',
  '/api/chat(.*)',
  '/blog/admin(.*)' // <--- Agregamos la nueva ruta del editor
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Si la ruta es protegida, ejecutamos auth.protect()
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // Todo lo demás (/blog, /blog/[slug], /pricing) queda público automáticamente
});

export const config = {
  matcher: [
    // Ignora archivos estáticos y Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas de API
    '/(api|trpc)(.*)',
  ],
};