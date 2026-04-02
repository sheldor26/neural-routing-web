import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas que SIEMPRE requieren login
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/dashboard(.*)',
  '/api/chat(.*)',
  '/blog/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { nextUrl } = req;

  // 🚨 REGLA DE ORO: Si la URL contiene "webhooks/clerk", NO aplicar auth.
  // Esto ignora mayúsculas, minúsculas y barras diagonales.
  if (nextUrl.pathname.includes('/api/webhooks/clerk')) {
    return; 
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};