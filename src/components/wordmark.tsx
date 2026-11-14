import Link from "next/link";
import { ROUTES } from "@/src/lib/routes";

export function Wordmark() {
  return (
    <Link
      href={ROUTES.home}
      className="font-stencil text-2xl leading-none font-extrabold uppercase tracking-wide"
    >
      Gym<span className="text-plate-red">/</span>Tracker
    </Link>
  );
}
