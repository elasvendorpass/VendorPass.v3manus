/**
 * Supabase client configuration for ELAS VendorPass™ v3
 * 
 * This module initializes the Supabase JS SDK client lazily.
 * When the user provides their Supabase URL and ANON KEY via environment
 * variables, this client connects to the real database.
 * Until then, the services layer falls back to mock data.
 * 
 * Environment variables (set in Vercel/GitHub secrets):
 * - VITE_SUPABASE_URL: Your Supabase project URL (e.g. https://xxxx.supabase.co)
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let client: SupabaseClient | null = null;

/**
 * Returns the Supabase client instance.
 * Returns null if credentials are not configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

// Legacy export for backward compatibility — returns null if not configured
export const supabase = getSupabaseClient();

/**
 * Returns true when Supabase credentials are configured.
 * Use this to decide between real DB calls vs mock fallbacks.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes("supabase"));
}
