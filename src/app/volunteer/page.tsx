"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Home, UserCheck, CheckCircle2, Award } from "lucide-react";
import {
  getSession,
  clearSession,
  setSession,
  DEMO_ACCOUNTS,
  SESSION_CHANGED_EVENT,
  type LocalSession,
} from "@/lib/local-session";
import { Badge, Card, Button } from "@/components/ui";
import { VolunteerDashboard } from "@/components/dashboard/volunteer-dashboard";

const perks = [
  "Track your volunteer hours toward certificates and official civic commendations",
  "Join any active community initiative that matches your skills",
  "Get priority access to South Tongu community outreach events",
  "Receive verified ambassador credentials with shareable verification QR codes",
];

export default function DedicatedVolunteerPage() {
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
          <p className="text-sm text-ocean-600 dark:text-ocean-400">Loading volunteer portal…</p>
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
              Account: {session.email} · Dedicated route: <code className="text-ocean-900 dark:text-white">/volunteer</code>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-ocean-200 px-3.5 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300 dark:hover:bg-ocean-800"
            >
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <Link
              href="/volunteer/login"
              className="flex items-center gap-1.5 rounded-full border border-ocean-200 px-3.5 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300 dark:hover:bg-ocean-800"
            >
              <UserCheck className="h-3.5 w-3.5" /> Switch Account
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

        {/* Volunteer Perks & Civic Program Info */}
        <Card className="mt-10 p-6 sm:p-8 bg-ocean-50/50 dark:bg-ocean-900/30 border-ocean-200/60 dark:border-ocean-800">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-leaf-600 dark:text-leaf-400" />
            <h2 className="text-base font-semibold text-ocean-950 dark:text-white">
              South Tongu Civic Ambassador Network
            </h2>
          </div>
          <p className="text-xs text-ocean-600 dark:text-ocean-400 mb-4">
            South Tongu&apos;s progress runs on volunteer hours. Key milestones for ambassadors:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-xs text-ocean-700 dark:text-ocean-300">
            {perks.map((p) => (
              <li key={p} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-ocean-100 dark:border-ocean-800 pt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ocean-600 dark:text-ocean-400">
              Want to recommend a friend or register as an initiative leader?
            </p>
            <Button href="/contact" size="sm" variant="secondary">
              Contact District Office &rarr;
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
