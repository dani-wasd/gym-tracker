import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isGuestOnlyPath, isProtectedPath, ROUTES } from "@/src/lib/routes";

/**
 * Runs before every page: refreshes the session cookie when it has expired,
 * and sends signed-out visitors away from private pages (and signed-in users
 * away from the login and signup pages).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Refreshed cookies go on the request (for this render) and the response (for the browser).
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Verifies the session token's signature locally: no round trip to Supabase
  // on an ordinary request.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims.sub);

  const { pathname } = request.nextUrl;
  if (!isSignedIn && isProtectedPath(pathname)) {
    return redirectKeepingSession(request, response, ROUTES.login);
  }
  if (isSignedIn && isGuestOnlyPath(pathname)) {
    return redirectKeepingSession(request, response, ROUTES.dashboard);
  }
  return response;
}

/** Redirects while carrying over any auth cookies refreshed during this request. */
function redirectKeepingSession(
  request: NextRequest,
  sessionResponse: NextResponse,
  pathname: string,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const response = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}
