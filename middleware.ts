import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Definimos las rutas PROTEGIDAS (Solo logueados)
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/dashboard(.*)',
  '/api/chat(.*)',
  '/blog/admin(.*)'
]);

// 2. Definimos las rutas PÚBLICAS (Para evitar bucles de redirección)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)' // Webhooks deben ser públicos
]);

export default clerkMiddleware(async (auth, req) => {
  // Si es una ruta pública, no hacemos nada, dejamos pasar.
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 3. Proteger rutas específicas
  // Si la ruta es protegida y no está logueado, auth.protect()
  // lo enviará automáticamente al login configurado.
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Ignora archivos estáticos y internos de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas de API y TRPC
    '/(api|trpc)(.*)',
  ],
};