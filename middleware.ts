import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Definimos las rutas que REQUIEREN estar logueado
// Usamos paths específicos y (.*) para subrutas
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/dashboard(.*)',
  '/api/chat(.*)',
  '/blog/admin(.*)'
]);

// 2. Definimos las rutas que son siempre PÚBLICAS
// Incluimos explícitamente sign-in y sign-up para evitar bucles
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
  '/blog' // Si tenés un blog público
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      // Use relative redirect_url so Clerk doesn't need it in the allowlist
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Ignora archivos estáticos e internos de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas de API y TRPC
    '/(api|trpc)(.*)',
  ],
};