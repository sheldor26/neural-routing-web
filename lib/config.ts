/**
 * Centralized runtime configuration.
 * Set NEXT_PUBLIC_API_BASE in your .env.local (or Vercel/Railway env vars).
 * Falls back to the production Railway URL if the var is absent.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://web-production-4f439.up.railway.app";
