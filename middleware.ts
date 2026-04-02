import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // 🚨 BLOQUE DE EXCEPCIÓN TOTAL
  // Si la ruta es el webhook, salimos del middleware inmediatamente.
  // No permitimos que Clerk ni Next.js toquen esta petición.
  if (pathname.startsWith('/api/webhooks/clerk')) {
    return NextResponse.next();
  }

  const isProtectedRoute = createRouteMatcher([
    '/chat(.*)',
    '/dashboard(.*)',
    '/api/chat(.*)'
  ]);

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};