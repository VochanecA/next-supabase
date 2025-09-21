// lib/supabase/client-edge.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseEdge = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
  // // @ts-expect-error Supabase types don't include fetch for Edge, but it's valid at runtime
  // { fetch }
);
