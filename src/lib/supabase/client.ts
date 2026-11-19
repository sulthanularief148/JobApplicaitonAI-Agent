// Browser-side Supabase client.
// Used in React components (Client Components) to talk to Supabase.
// This runs in the browser, so it uses the public anon key (safe to expose).

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
