import Link from "next/link";
import { buttonStyles } from "@/src/components/ui/button";
import { ROUTES } from "@/src/lib/routes";

export default function ErrorPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-5">
      <p className="eyebrow text-plate-red">No lift</p>
      <h1 className="headline text-8xl">Something slipped</h1>
      <p className="text-sm text-steel">
        That link is expired or something went wrong on our end. Head back and
        try again.
      </p>
      <Link href={ROUTES.login} className={buttonStyles({ className: "self-start" })}>
        Back to sign in
      </Link>
    </main>
  );
}
