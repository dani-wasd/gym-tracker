import { Barbell } from "@/src/components/barbell/barbell";

/**
 * Shown the instant a tab is clicked, while the page's data is still on its
 * way — an empty bar waiting for its plates.
 */
export default function AppLoading() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse">
      <div className="h-3 w-48 bg-iron" />
      <div className="mt-4 h-[clamp(3rem,11vw,7.5rem)] w-2/3 bg-iron" />
      <Barbell>{null}</Barbell>
    </div>
  );
}
