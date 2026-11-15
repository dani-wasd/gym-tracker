import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/src/lib/routes";
import { createClient } from "@/src/lib/supabase/server";

/**
 * Where the links in Supabase's emails land (signup confirmation, email
 * change). Verifies the token, then sends the user on without it in the URL.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  let destination: string = ROUTES.error;
  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) destination = ROUTES.dashboard;
  }

  const url = request.nextUrl.clone();
  url.pathname = destination;
  url.search = "";
  return NextResponse.redirect(url);
}
