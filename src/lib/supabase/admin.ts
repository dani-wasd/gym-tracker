import { createClient } from "@supabase/supabase-js";

/**
 * A Supabase client with the service-role key, for the few things a signed-in
 * user can't do to their own login (deleting it). Server only: never import
 * this from a client component, and never hand it input you haven't checked
 * against `requireProfile()`.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
