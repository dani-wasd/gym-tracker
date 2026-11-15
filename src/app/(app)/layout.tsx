import Link from "next/link";
import { logout } from "@/src/app/(auth)/actions";
import { TabSelector } from "@/src/components/shell/tab-selector";
import { Wordmark } from "@/src/components/shell/wordmark";
import { Button, buttonStyles } from "@/src/components/ui/button";
import { requireProfile } from "@/src/lib/auth";
import { ROUTES } from "@/src/lib/routes";

/** Shell for everything behind the login: header, tabs, settings and sign-out. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 sm:px-8">
      <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-b-2 border-iron py-5">
        <Wordmark />
        <TabSelector />
        <div className="flex items-baseline gap-4">
          <span className="eyebrow">{profile.username}</span>
          <Link href={ROUTES.settings} className={buttonStyles({ variant: "ghost", size: "inline" })}>
            Settings
          </Link>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="inline">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-14">{children}</main>
    </div>
  );
}
