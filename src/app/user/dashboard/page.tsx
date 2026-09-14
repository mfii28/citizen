"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user");
  }, [router]);

  return (
    <div className="section-y container-page">
      <p className="text-xs text-ocean-600 dark:text-ocean-400 font-mono">Redirecting to citizen portal (/user)…</p>
    </div>
  );
}
