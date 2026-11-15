import Link from "next/link";
import { StackLegend } from "@/src/components/stack/legend";
import { WeekStack } from "@/src/components/stack/week-stack";
import { buttonStyles } from "@/src/components/ui/button";
import { Wordmark } from "@/src/components/wordmark";
import { ROUTES } from "@/src/lib/routes";
import { buildWeekSummary } from "@/src/lib/week";

/** A made-up week so visitors can play with the stack before signing up. */
const DEMO_WEEK = buildWeekSummary({
  weekStart: "2026-11-15",
  today: "2026-11-19",
  plannedMask: 0b0111110, // Mon–Fri
  sessions: [
    { id: 1, date: "2026-11-16", startLabel: "5:02 PM", endLabel: "6:10 PM", minutes: 68, muscles: ["Chest", "Triceps"], exercises: [{ name: "Bench press", sets: "3 × 8 @ 60 kg" }, { name: "Triceps pushdown", sets: "3 × 12 @ 25 kg" }] },
    { id: 2, date: "2026-11-18", startLabel: "7:15 AM", endLabel: "8:05 AM", minutes: 50, muscles: ["Quads", "Glutes"], exercises: [{ name: "Back squat", sets: "5 × 5 @ 80 kg" }] },
    { id: 3, date: "2026-11-15", startLabel: "10:30 AM", endLabel: "11:10 AM", minutes: 40, muscles: ["Abs"], exercises: [] },
  ],
});

const STEPS = [
  {
    title: "Plan the week",
    body: "Pick the days you'll train next week and save the plan.",
  },
  {
    title: "Log the session",
    body: "Time your workout or enter it afterwards. Add the exercises and sets if you want the detail.",
  },
  {
    title: "Share it",
    body: "Friends see which planned days you made and which you missed. You see theirs.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 sm:px-8">
      <header className="flex items-baseline justify-between py-5">
        <Wordmark />
        <Link href={ROUTES.login} className={buttonStyles({ variant: "ghost", size: "sm", className: "px-0" })}>
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 flex-col gap-16 py-10 sm:gap-20 sm:py-16">
        <section>
          <h1 className="headline text-[clamp(4rem,17vw,12rem)]">
            Said you&apos;d go?
            <br />
            <span className="text-plate-red">Go.</span>
          </h1>
          <p className="mt-6 max-w-lg text-steel">
            Plan your training days. Log what you did. Friends see the
            difference.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={ROUTES.signup} className={buttonStyles({ size: "lg" })}>
              Create account
            </Link>
            <Link href={ROUTES.login} className={buttonStyles({ variant: "outline", size: "lg" })}>
              Sign in
            </Link>
          </div>
        </section>

        <section>
          <p className="eyebrow">Example week · hover a day</p>
          <WeekStack summary={DEMO_WEEK} />
          <StackLegend className="mt-8" />
        </section>

        <ol className="grid gap-10 border-t-2 border-iron pt-10 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <p className="font-stencil text-6xl leading-none font-extrabold text-iron">
                0{index + 1}
              </p>
              <h2 className="mt-2 font-display text-3xl leading-none font-extrabold uppercase">
                {step.title}
              </h2>
              <p className="mt-3 text-sm text-steel">{step.body}</p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
