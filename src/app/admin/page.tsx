"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSession,
  clearSession,
  setSession,
  DEMO_ACCOUNTS,
  SESSION_CHANGED_EVENT,
  type LocalSession,
} from "@/lib/local-session";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function DedicatedAdminPage() {
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
          <p className="text-sm text-ocean-600 dark:text-ocean-400">Loading Filament operations console…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6">
        <AdminDashboard session={session} />
      </div>
    </section>
  );
}
