import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Definimos las rutas que REQUIEREN estar logueado
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/dashboard(.*)',
  '/api/chat(.*)',
  '/blog/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // 2. EXCEPCIÓN TOTAL PARA WEBHOOKS
  // Esto permite que Clerk nos avise cuando un usuario se registra sin que el middleware lo bloquee
  if (pathname.startsWith('/api/webhooks/clerk')) {
    return NextResponse.next();
  }

  // 3. PROTEGER RUTAS ESPECÍFICAS
  // Si el usuario intenta entrar a /dashboard o /chat y no está logueado, lo manda al login
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Esto es lo que te pidió Clerk: ignora archivos estáticos y corre en las APIs
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};