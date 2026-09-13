"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FolderKanban, HeartHandshake, Megaphone, Handshake, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/initiatives", label: "Initiatives", icon: FolderKanban },
  { href: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { href: "/admin/surveys", label: "Survey Reports", icon: Megaphone },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex w-full shrink-0 items-center gap-1 overflow-x-auto border-b border-ocean-100 bg-white p-3 dark:border-ocean-900 dark:bg-ocean-950 sm:w-64 sm:flex-col sm:items-stretch sm:overflow-visible sm:border-b-0 sm:border-r sm:p-5">
      <div className="hidden sm:block">
        <p className="font-display font-semibold text-ocean-950 dark:text-white">The Citizen Project</p>
        <p className="mt-0.5 text-xs text-ocean-500">Admin — {userName}</p>
      </div>
      <nav className="flex gap-1 sm:mt-6 sm:flex-1 sm:flex-col sm:gap-0.5">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ocean-700 hover:bg-ocean-50 dark:text-ocean-200 dark:hover:bg-ocean-900",
              pathname === l.href && "bg-ocean-50 text-ocean-900 dark:bg-ocean-900 dark:text-white"
            )}
          >
            <l.icon className="h-4 w-4" /> <span className="whitespace-nowrap">{l.label}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="ml-auto flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ocean-500 hover:bg-ocean-50 dark:hover:bg-ocean-900 sm:ml-0"
      >
        <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
      </button>
    </aside>
  );
}
