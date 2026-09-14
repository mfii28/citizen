"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilamentStat {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  descriptionIcon?: "up" | "down" | "neutral";
  descriptionTone?: "success" | "warning" | "danger" | "primary";
  chart?: number[];
  chartTone?: "emerald" | "amber" | "rose" | "sky";
}

export function FilamentStatsOverview({
  stats,
  className,
}: {
  stats: FilamentStat[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {stats.map((stat) => (
        <FilamentStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

export function FilamentStatCard({ stat }: { stat: FilamentStat }) {
  const chartTone = stat.chartTone || "emerald";

  const toneConfig = {
    emerald: {
      stroke: "#10b981",
      fill: "url(#gradient-emerald)",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    },
    amber: {
      stroke: "#f59e0b",
      fill: "url(#gradient-amber)",
      badge: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    },
    rose: {
      stroke: "#f43f5e",
      fill: "url(#gradient-rose)",
      badge: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    },
    sky: {
      stroke: "#0ea5e9",
      fill: "url(#gradient-sky)",
      badge: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800",
    },
  };

  const currentTone = toneConfig[chartTone];

  // Generate SVG path for sparkline
  const chartPoints = stat.chart && stat.chart.length > 1 ? stat.chart : [10, 15, 12, 22, 18, 28, 35];
  const min = Math.min(...chartPoints);
  const max = Math.max(...chartPoints);
  const range = max - min || 1;
  const width = 160;
  const height = 44;

  const points = chartPoints.map((val, idx) => {
    const x = (idx / (chartPoints.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="relative overflow-hidden rounded-xl border border-ocean-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-ocean-800 dark:bg-ocean-950">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ocean-600 dark:text-ocean-400">
          {stat.label}
        </span>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl font-bold tracking-tight text-ocean-950 dark:text-white sm:text-3xl">
          {stat.value}
        </span>
      </div>

      {stat.description && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold",
              currentTone.badge
            )}
          >
            {stat.descriptionIcon === "up" && <TrendingUp className="h-3 w-3" />}
            {stat.descriptionIcon === "down" && <TrendingDown className="h-3 w-3" />}
            {stat.descriptionIcon === "neutral" && <Minus className="h-3 w-3" />}
            {stat.description}
          </span>
        </div>
      )}

      {/* Signature Filament Sparkline Chart */}
      <div className="absolute -bottom-1 -right-2 w-36 opacity-80 pointer-events-none sm:w-44">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full overflow-visible">
          <defs>
            <linearGradient id="gradient-emerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-amber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-rose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={currentTone.fill} />
          <path d={pathD} fill="none" stroke={currentTone.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
