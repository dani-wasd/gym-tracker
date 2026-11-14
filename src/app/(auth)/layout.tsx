import { Wordmark } from "@/src/components/wordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
      <Wordmark />
      <main className="flex flex-1 flex-col justify-center gap-8 py-10">{children}</main>
    </div>
  );
}
