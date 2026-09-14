"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/local-session";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session && session.role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="section-y container-page">
      <p className="text-xs text-ocean-600 dark:text-ocean-400 font-mono">Verifying authorization and routing to operations console…</p>
    </div>
  );
}
