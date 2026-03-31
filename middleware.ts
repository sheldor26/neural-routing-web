import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definimos las rutas que REQUIEREN protección (Chat y Dashboard)
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/dashboard(.*)',
  '/api/chat(.*)' // Protegemos también el endpoint de la API
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Si la ruta está en la lista de protegidas, aplicamos auth.protect()
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // Cualquier otra ruta (/, /blog, etc.) será pública por defecto
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};