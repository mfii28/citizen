"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VolunteerDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/volunteer");
  }, [router]);

  return (
    <div className="section-y container-page">
      <p className="text-xs text-ocean-600 dark:text-ocean-400 font-mono">Redirecting to volunteer portal (/volunteer)…</p>
    </div>
  );
}
