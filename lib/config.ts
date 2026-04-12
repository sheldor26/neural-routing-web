/**
 * Centralized runtime configuration.
 * NEXT_PUBLIC_API_BASE must be set in Vercel/Railway env vars.
 */
const API_BASE_RAW = process.env.NEXT_PUBLIC_API_BASE;

if (!API_BASE_RAW && typeof window !== "undefined") {
  console.error("NEXT_PUBLIC_API_BASE is not set");
}

export const API_BASE = API_BASE_RAW || "";
