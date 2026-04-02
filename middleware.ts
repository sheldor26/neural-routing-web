import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  // 1. Si la URL contiene "webhooks", saltamos Clerk por completo
  if (req.nextUrl.pathname.includes('/api/webhooks/clerk')) {
    return NextResponse.next(); 
  }

  // 2. Definimos rutas protegidas (solo para el Dashboard y Chat)
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