import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definimos las rutas que REQUIEREN protección (Login obligatorio)
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/dashboard(.*)',
  '/api/chat(.*)',
  '/blog/admin(.*)'
]);

// 2. Definimos rutas que deben ser SIEMPRE públicas (Ignorar auth por completo)
// Esto es vital para los Webhooks que vienen de servidores externos
const isPublicApiRoute = createRouteMatcher([
  '/api/webhooks/clerk(.*)',
  '/api/proxy/dispatch(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Si es una ruta de API pública (como el webhook), no hacemos nada y dejamos pasar
  if (isPublicApiRoute(req)) {
    return; 
  }

  // Si la ruta está en la lista de protegidas, exigimos login
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  // Todo lo demás (/blog, /pricing, etc.) queda público automáticamente
});

export const config = {
  matcher: [
    // Ignora archivos estáticos y Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas de API y trpc
    '/(api|trpc)(.*)',
  ],
};