"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Heart, ArrowLeft, Shield, User } from "lucide-react";
import {
  getSession,
  clearSession,
  setSession,
  DEMO_ACCOUNTS,
  SESSION_CHANGED_EVENT,
  type LocalSession,
} from "@/lib/local-session";
import { getFavoriteSlugs, FAVORITES_CHANGED_EVENT } from "@/lib/local-favorites";
import { SectionHeading, Badge, Button } from "@/components/ui";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

const SAMPLE_FAVORITE_SLUGS = ["youth-skills-livelihood-initiative"];

export default function DedicatedUserDashboardPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<LocalSession | null | "checking">("checking");
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    const existing = getSession();
    if (!existing) {
      // Auto-set citizen demo session so user can view immediately without friction
      const demo = DEMO_ACCOUNTS.user;
      setSession({ name: demo.name, email: demo.email, role: "user" });
      setSessionState({
        name: demo.name,
        email: demo.email,
        role: "user",
        loggedInAt: new Date().toISOString(),
      });
    } else {
      setSessionState(existing);
    }

    const saved = getFavoriteSlugs();
    setFavoriteSlugs(saved.length > 0 ? saved : SAMPLE_FAVORITE_SLUGS);

    const handleSessionSync = () => {
      const current = getSession();
      setSessionState(current);
    };

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
  }, []);

  if (session === "checking" || session === null) {
    return (
      <section className="section-y">
        <div className="container-page">
          <p className="text-sm text-ocean-600 dark:text-ocean-400">Loading citizen dashboard…</p>
        </div>
      </section>
    );
  }

  const handleLogout = () => {
    clearSession();
    router.push("/user/login");
  };

  return (
    <section className="section-y">
      <div className="container-page space-y-6">
        {/* Dedicated Citizen Portal Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ocean-100 pb-6 dark:border-ocean-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-ocean-600 dark:text-ocean-400">
                Citizen Supporter Portal
              </span>
              <Badge tone="ocean">CITIZEN</Badge>
            </div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-ocean-950 dark:text-white">
              Welcome back, {session.name}
            </h1>
            <p className="mt-1 font-mono text-xs text-ocean-600 dark:text-ocean-400">
              Account: {session.email} · Dedicated route: <code className="text-ocean-900 dark:text-white">/user/dashboard</code>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full border border-ocean-200 px-3.5 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300 dark:hover:bg-ocean-800"
            >
              All Dashboards Hub
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-ocean-200 px-3.5 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300 dark:hover:bg-ocean-800"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>

        {/* Citizen Dashboard Component */}
        <UserDashboard session={session} favoriteSlugs={favoriteSlugs} />
      </div>
    </section>
  );
}
