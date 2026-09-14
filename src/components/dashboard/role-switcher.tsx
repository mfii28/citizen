"use client";

import { User, HeartHandshake, ShieldCheck } from "lucide-react";
import { type UserRole, switchRole } from "@/lib/local-session";
import { cn } from "@/lib/utils";

export function RoleSwitcher({ currentRole }: { currentRole: UserRole }) {
  const roles: { id: UserRole; label: string; badge: string; icon: typeof User }[] = [
    { id: "user", label: "Citizen", badge: "Simple", icon: User },
    { id: "volunteer", label: "Volunteer", badge: "Moderate", icon: HeartHandshake },
    { id: "admin", label: "Coordinator", badge: "Extensive Admin", icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ocean-200/80 bg-ocean-50/60 p-2.5 dark:border-ocean-800 dark:bg-ocean-900/60">
      <div className="flex items-center gap-2 pl-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ocean-600 dark:text-ocean-400">
          Demo Persona:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {roles.map((r) => {
          const active = currentRole === r.id;
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => switchRole(r.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                active
                  ? "bg-ocean-950 text-white shadow-sm dark:bg-white dark:text-ocean-950"
                  : "bg-white/80 text-ocean-700 hover:bg-white hover:text-ocean-950 dark:bg-ocean-800/80 dark:text-ocean-200 dark:hover:bg-ocean-800"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{r.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-mono uppercase tracking-wider",
                  active
                    ? "bg-white/20 text-white dark:bg-ocean-950/20 dark:text-ocean-950"
                    : "bg-ocean-100 text-ocean-600 dark:bg-ocean-700 dark:text-ocean-300"
                )}
              >
                {r.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
