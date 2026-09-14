"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, ArrowLeft, Building2 } from "lucide-react";
import {
  getSession,
  clearSession,
  setSession,
  DEMO_ACCOUNTS,
  SESSION_CHANGED_EVENT,
  type LocalSession,
} from "@/lib/local-session";
import { Badge } from "@/components/ui";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function DedicatedAdminDashboardPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<LocalSession | null | "checking">("checking");

  useEffect(() => {
    const existing = getSession();
    if (!existing) {
      // Auto-set admin demo session for instant accessibility
      const demo = DEMO_ACCOUNTS.admin;
      setSession({ name: demo.name, email: demo.email, role: "admin" });
      setSessionState({
        name: demo.name,
        email: demo.email,
        role: "admin",
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
          <p className="text-sm text-ocean-600 dark:text-ocean-400">Loading operations console…</p>
        </div>
      </section>
    );
  }

  const handleLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

  return (
    <section className="section-y">
      <div className="container-page space-y-6">
        {/* Dedicated Admin Portal Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ocean-100 pb-6 dark:border-ocean-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-gold-600 dark:text-gold-400">
                District Operations Console
              </span>
              <Badge tone="gold">COORDINATOR</Badge>
            </div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-ocean-950 dark:text-white">
              Operations Center · South Tongu
            </h1>
            <p className="mt-1 font-mono text-xs text-ocean-600 dark:text-ocean-400">
              Coordinator: {session.name} ({session.email}) · Dedicated route: <code className="text-ocean-900 dark:text-white">/admin/dashboard</code>
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
              <LogOut className="h-3.5 w-3.5" /> Lock &amp; Sign out
            </button>
          </div>
        </div>

        {/* Extensive Admin Dashboard Component with Sidebar */}
        <AdminDashboard session={session} />
      </div>
    </section>
  );
}
