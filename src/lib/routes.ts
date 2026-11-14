export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  friends: "/friends",
} as const;

/** Signed-out visitors get bounced to login from these. */
const PROTECTED_PREFIXES = [ROUTES.dashboard, ROUTES.friends];

/** Signed-in users have no business here and go straight to the dashboard. */
const GUEST_ONLY_ROUTES: string[] = [ROUTES.home, ROUTES.login, ROUTES.signup];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.includes(pathname);
}
