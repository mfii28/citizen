"use client";

import { cn } from "@/lib/utils";

export type FilamentBadgeColor = "success" | "warning" | "danger" | "info" | "gray";

const colorStyles: Record<FilamentBadgeColor, { badge: string; dot: string }> = {
  success: {
    badge: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  warning: {
    badge: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20",
    dot: "bg-amber-500",
  },
  danger: {
    badge: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-500/20",
    dot: "bg-rose-500",
  },
  info: {
    badge: "bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border-sky-500/20",
    dot: "bg-sky-500",
  },
  gray: {
    badge: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 border-slate-500/20",
    dot: "bg-slate-400",
  },
};

export function FilamentBadge({
  children,
  color = "gray",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  color?: FilamentBadgeColor;
  size?: "sm" | "md";
  className?: string;
}) {
  const cfg = colorStyles[color] || colorStyles.gray;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        cfg.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} />
      <span>{children}</span>
    </span>
  );
}
