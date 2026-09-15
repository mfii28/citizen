"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSession,
  SESSION_CHANGED_EVENT,
  type LocalSession,
} from "@/lib/local-session";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function DedicatedAdminPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<LocalSession | null | "checking">("checking");

  useEffect(() => {
    const existing = getSession();
    if (!existing || existing.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    setSessionState(existing);

    const handleSessionSync = () => {
      const current = getSession();
      if (!current || current.role !== "admin") {
        router.replace("/admin/login");
      } else {
        setSessionState(current);
      }
    };

    window.addEventListener(SESSION_CHANGED_EVENT, handleSessionSync);
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, handleSessionSync);
  }, [router]);

  if (session === "checking" || session === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0c1322]">
        <div className="flex items-center gap-3 text-sm text-ocean-600 dark:text-ocean-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span>Verifying administrator authorization…</span>
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
