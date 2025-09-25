// lib/supabase/service-client.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client — full access, bypasses RLS
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !serviceKey) {
    throw new Error("Supabase URL or Service Role Key not set in environment variables");
  }

  return createSupabaseClient(url, serviceKey);
}
