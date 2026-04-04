import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const BASE_AUTH_OPTIONS = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
} as const;

// Singleton anon client — shared across the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { ...BASE_AUTH_OPTIONS, storageKey: 'nr-anon' },
});

// JWT-authenticated client for Clerk + Supabase RLS
// Each call gets a unique storageKey so GoTrueClient instances don't collide
let authClientCounter = 0;
export function createAuthClient(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { ...BASE_AUTH_OPTIONS, storageKey: `nr-auth-${++authClientCounter}` },
  });
}
