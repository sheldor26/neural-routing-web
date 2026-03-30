import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definimos cuáles son las rutas que requieren que el usuario esté logueado
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 2. Si el usuario intenta entrar al dashboard, verificamos su sesión
  if (isDashboardRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};