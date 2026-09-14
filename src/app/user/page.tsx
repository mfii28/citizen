"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/local-session";

export default function UserIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session && session.role === "user") {
      router.replace("/user/dashboard");
    } else {
      router.replace("/user/login");
    }
  }, [router]);

  return (
    <div className="section-y container-page">
      <p className="text-xs text-ocean-600 dark:text-ocean-400 font-mono">Redirecting to citizen portal…</p>
    </div>
  );
}
