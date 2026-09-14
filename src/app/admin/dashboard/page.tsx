"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="section-y container-page">
      <p className="text-xs text-ocean-600 dark:text-ocean-400 font-mono">Redirecting to operations console (/admin)…</p>
    </div>
  );
}
