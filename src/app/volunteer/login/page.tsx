"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VolunteerLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?role=volunteer");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-ocean-600 dark:text-ocean-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        <span>Redirecting to Volunteer login…</span>
      </div>
    </div>
  );
}
