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
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0c1322]">
        <div className="flex items-center gap-3 text-sm text-ocean-600 dark:text-ocean-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span>Loading Filament operations console…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-white dark:bg-[#0c1322]">
      <AdminDashboard session={session} />
    </div>
  );
}
