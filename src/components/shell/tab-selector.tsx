"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/cn";
import { ROUTES } from "@/src/lib/routes";

const TABS = [
  { href: ROUTES.dashboard, label: "Week" },
  { href: ROUTES.friends, label: "Friends" },
  { href: ROUTES.stats, label: "Stats" },
];

export function TabSelector() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex gap-4 sm:gap-6">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "border-b-4 pb-1 font-display text-xl leading-none whitespace-nowrap sm:text-2xl font-extrabold uppercase tracking-wide transition-colors",
                  isActive
                    ? "border-plate-red text-chalk"
                    : "border-transparent text-steel hover:text-chalk",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
