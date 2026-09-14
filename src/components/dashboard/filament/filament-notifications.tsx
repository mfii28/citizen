"use client";

import { Bell, CheckCircle2, AlertTriangle, Heart, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilamentNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "alert" | "success" | "info";
  unread?: boolean;
}

const mockNotifications: FilamentNotification[] = [
  {
    id: "notif-1",
    title: "Critical Issue: Water Contamination",
    description: "Sogakope Central reported main pipe breakage affecting 200+ households. SLA deadline: 8 hours.",
    time: "12m ago",
    type: "alert",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Paystack Donation Verified",
    description: "Kofi Mensah completed GH₵ 150 pledge for Youth Skills & Livelihood Initiative via Paystack.",
    time: "45m ago",
    type: "success",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Volunteer Service Logged",
    description: "Akua Agbavitor logged 6 hours of field mobilization in Dabala.",
    time: "2h ago",
    type: "info",
    unread: false,
  },
  {
    id: "notif-4",
    title: "Initiative Milestone Reached",
    description: "Community Solar Boreholes reached 84% funding threshold.",
    time: "5h ago",
    type: "success",
    unread: false,
  },
];

export function FilamentNotifications({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-ocean-100 bg-white p-4 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-bold text-ocean-950 dark:text-white">District Notifications</span>
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            2 New
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 divide-y divide-ocean-100 dark:divide-ocean-800/60 max-h-80 overflow-y-auto">
        {mockNotifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "py-3 transition first:pt-1 last:pb-1 flex gap-3 items-start",
              n.unread && "bg-amber-500/5 -mx-2 px-2 rounded-lg"
            )}
          >
            <div className="mt-0.5 shrink-0">
              {n.type === "alert" && <AlertTriangle className="h-4 w-4 text-rose-500" />}
              {n.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {n.type === "info" && <Clock className="h-4 w-4 text-sky-500" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-ocean-900 dark:text-white">{n.title}</p>
                <span className="text-[10px] text-ocean-400 shrink-0 font-mono">{n.time}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-ocean-600 dark:text-ocean-400 leading-snug">
                {n.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-ocean-100 pt-2 text-center dark:border-ocean-800">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}
