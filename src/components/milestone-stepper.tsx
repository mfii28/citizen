import { Check } from "lucide-react";
import type { Milestone } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MilestoneStepper({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol>
      {milestones.map((m, idx) => {
        const isLast = idx === milestones.length - 1;
        return (
          <li key={m.label} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-full w-0.5",
                  m.status === "complete" ? "bg-leaf-500" : "bg-ocean-100 dark:bg-ocean-800"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                m.status === "complete" && "border-leaf-500 bg-leaf-500 text-white",
                m.status === "current" && "border-gold-500 bg-white dark:bg-ocean-900",
                m.status === "upcoming" && "border-ocean-200 bg-white dark:border-ocean-700 dark:bg-ocean-900"
              )}
            >
              {m.status === "complete" && <Check className="h-3.5 w-3.5" />}
              {m.status === "current" && <span className="h-2 w-2 rounded-full bg-gold-500" />}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p
                  className={cn(
                    "font-display text-sm font-semibold",
                    m.status === "upcoming" ? "text-ocean-600 dark:text-ocean-400" : "text-ocean-950 dark:text-white"
                  )}
                >
                  {m.label}
                </p>
                <p className="font-mono text-xs text-ocean-600 dark:text-ocean-400">{formatDate(m.date)}</p>
                {m.status === "current" && (
                  <span className="rounded-full bg-gold-300/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-600">
                    In progress
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ocean-700 dark:text-ocean-300">{m.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
