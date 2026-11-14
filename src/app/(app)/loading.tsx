import { Rack } from "@/src/components/rack/rack";

/**
 * Shown the instant a tab is clicked, while the page's data is still on its
 * way — an empty rack.
 */
export default function AppLoading() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse">
      <div className="h-3 w-48 bg-iron" />
      <div className="mt-4 h-[clamp(3rem,11vw,7.5rem)] w-2/3 bg-iron" />
      <Rack>{null}</Rack>
    </div>
  );
}
