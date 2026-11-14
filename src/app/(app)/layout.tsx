import { logout } from "@/src/app/(auth)/actions";
import TabSelector from "@/src/components/tab-selector";
import { Button } from "@/src/components/ui/button";
import { Wordmark } from "@/src/components/wordmark";
import { requireProfile } from "@/src/lib/auth";

/** Shell for everything behind the login: header, tabs, sign-out. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b-2 border-iron py-5">
        <Wordmark />
        <TabSelector />
        <form action={logout} className="flex items-center gap-3">
          <span className="eyebrow">{profile.username}</span>
          <Button type="submit" variant="ghost" size="sm" className="px-0">
            Sign out
          </Button>
        </form>
      </header>

      <main className="flex-1 py-10 sm:py-14">{children}</main>
    </div>
  );
}
