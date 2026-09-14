"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Award, ArrowLeft, Trophy } from "lucide-react";
import {
  getSession,
  clearSession,
  setSession,
  DEMO_ACCOUNTS,
  SESSION_CHANGED_EVENT,
  type LocalSession,
} from "@/lib/local-session";
import { Badge } from "@/components/ui";
import { VolunteerDashboard } from "@/components/dashboard/volunteer-dashboard";

export default function DedicatedVolunteerDashboardPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<LocalSession | null | "checking">("checking");

  useEffect(() => {
    const existing = getSession();
    if (!existing) {
      // Auto-set volunteer demo session so user can test immediately
      const demo = DEMO_ACCOUNTS.volunteer;
      setSession({ name: demo.name, email: demo.email, role: "volunteer" });
      setSessionState({
        name: demo.name,
        email: demo.email,
        role: "volunteer",
        loggedInAt: new Date().toISOString(),
      });
    } else {
      setSessionState(existing);
    }

    const handleSessionSync = () => {
      const current = getSession();
      setSessionState(current);
    };

    window.addEventListener(SESSION_CHANGED_EVENT, handleSessionSync);
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, handleSessionSync);
  }, []);

  if (session === "checking" || session === null) {
    return (
      <section className="section-y">
        <div className="container-page">
          <p className="text-sm text-ocean-600 dark:text-ocean-400">Loading volunteer console…</p>
        </div>
      </section>
    );
  }

  const handleLogout = () => {
    clearSession();
    router.push("/volunteer/login");
  };

  return (
    <section className="section-y">
      <div className="container-page space-y-6">
        {/* Dedicated Volunteer Portal Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ocean-100 pb-6 dark:border-ocean-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-leaf-600 dark:text-leaf-400">
                Ambassador &amp; Volunteer Portal
              </span>
              <Badge tone="leaf">AMBASSADOR</Badge>
            </div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-ocean-950 dark:text-white">
              Welcome back, {session.name}
            </h1>
            <p className="mt-1 font-mono text-xs text-ocean-600 dark:text-ocean-400">
              Account: {session.email} · Dedicated route: <code className="text-ocean-900 dark:text-white">/volunteer/dashboard</code>
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

        {/* Volunteer Dashboard Component */}
        <VolunteerDashboard session={session} />
      </div>
    </section>
  );
}
