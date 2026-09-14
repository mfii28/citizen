"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  getSession,
  clearSession,
  SESSION_CHANGED_EVENT,
  type LocalSession,
} from "@/lib/local-session";
import { getFavoriteSlugs, FAVORITES_CHANGED_EVENT } from "@/lib/local-favorites";
import { SectionHeading, Badge } from "@/components/ui";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { VolunteerDashboard } from "@/components/dashboard/volunteer-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

const SAMPLE_FAVORITE_SLUGS = ["youth-skills-livelihood-initiative"];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<LocalSession | null | "checking">("checking");
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    const existing = getSession();
    if (!existing) {
      router.replace("/login");
      return;
    }
    setSessionState(existing);

    const saved = getFavoriteSlugs();
    setFavoriteSlugs(saved.length > 0 ? saved : SAMPLE_FAVORITE_SLUGS);

    // Sync session updates (e.g. role switch)
    const handleSessionSync = () => {
      const current = getSession();
      if (!current) {
        router.replace("/login");
        return;
      }
      setSessionState(current);
    };

    // Sync favorites updates
    const handleFavoritesSync = () => {
      const updated = getFavoriteSlugs();
      setFavoriteSlugs(updated.length > 0 ? updated : SAMPLE_FAVORITE_SLUGS);
    };

    window.addEventListener(SESSION_CHANGED_EVENT, handleSessionSync);
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesSync);

    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, handleSessionSync);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesSync);
    };
  }, [router]);

  if (session === "checking" || session === null) {
    return (
      <section className="section-y">
        <div className="container-page">
          <p className="text-sm text-ocean-600 dark:text-ocean-400">Loading your dashboard…</p>
        </div>
      </section>
    );
  }

  const roleLabel =
    session.role === "admin"
      ? "District Operations (Coordinator)"
      : session.role === "volunteer"
      ? "Volunteer & Ambassador Portal"
      : "Citizen Supporter Dashboard";

  return (
    <section className="section-y">
      <div className="container-page space-y-6">
        {/* Header and Logout */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs uppercase tracking-wider text-ocean-600 dark:text-ocean-400">
                {roleLabel}
              </p>
              <Badge tone={session.role === "admin" ? "gold" : session.role === "volunteer" ? "leaf" : "ocean"}>
                {session.role.toUpperCase()}
              </Badge>
            </div>
            <h1 className="mt-1 text-balance font-display text-3xl font-semibold text-ocean-950 dark:text-white">
              Welcome back, {session.name}
            </h1>
            <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400 font-mono">
              Signed in as {session.email}
            </p>
          </div>

          <button
            onClick={() => {
              clearSession();
              router.push("/");
            }}
            className="flex items-center gap-1.5 rounded-full border border-ocean-200 px-4 py-2 text-sm font-semibold text-ocean-700 transition hover:border-ocean-400 dark:border-ocean-700 dark:text-ocean-200"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>

        {/* Persona Switcher Bar */}
        <RoleSwitcher currentRole={session.role} />

        {/* Dynamic Role-Based View */}
        {session.role === "admin" && <AdminDashboard session={session} />}
        {session.role === "volunteer" && <VolunteerDashboard session={session} />}
        {session.role === "user" && (
          <UserDashboard session={session} favoriteSlugs={favoriteSlugs} />
        )}
      </div>
    </section>
  );
}
