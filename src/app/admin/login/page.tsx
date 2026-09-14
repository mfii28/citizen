"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, KeyRound, AlertTriangle, UserCheck } from "lucide-react";
import { setSession, nameFromEmail, DEMO_ACCOUNTS } from "@/lib/local-session";
import { SectionHeading, Card, Button } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [pending, setPending] = useState(false);

  const handleQuickLogin = () => {
    setPending(true);
    const demo = DEMO_ACCOUNTS.admin;
    setSession({ name: demo.name, email: demo.email, role: "admin" });
    router.push("/admin");
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    setSession({ name: nameFromEmail(email), email, role: "admin" });
    router.push("/admin");
  };

  return (
    <section className="section-y">
      <div className="container-page max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-300/30 text-gold-600 dark:text-gold-400 mb-4">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <SectionHeading
          eyebrow="District Operations &amp; Administration"
          title="Coordinator Operations Console"
          description="Restricted authentication gate for South Tongu District Coordinators, Project Officers, and Assembly Liaisons."
          align="center"
        />

        {/* 1-Click Quick Demo Sign-in */}
        <div className="mt-8">
          <Card className="border-gold-500/30 bg-gold-300/10 p-4 text-center dark:border-gold-500/20">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gold-700 dark:text-gold-300">
              <Lock className="h-3.5 w-3.5" /> Coordinator Access
            </div>
            <p className="mt-1 text-xs text-ocean-700 dark:text-ocean-300">
              Evaluating the operations console and triage workflows?
            </p>
            <Button
              type="button"
              onClick={handleQuickLogin}
              disabled={pending}
              className="mt-3 w-full"
            >
              <UserCheck className="h-4 w-4" /> 1-Click Authorize as Selorm Dzreke (Admin)
            </Button>
          </Card>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
          <span className="font-mono text-xs uppercase tracking-wider text-ocean-400">
            Or enter staff credentials
          </span>
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200"
              >
                Official Officer Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinator@thecitizenproject.org"
                className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900 font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="admin-pin"
                className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200"
              >
                Security Authorization PIN
              </label>
              <input
                id="admin-pin"
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
              />
            </div>

            <Button type="submit" disabled={pending} className="w-full mt-2">
              {pending ? "Verifying Authorization…" : "Unlock District Operations Console"}
            </Button>
          </form>

          <div className="mt-5 rounded-lg bg-ocean-100/50 p-3 text-[11px] text-ocean-600 dark:bg-ocean-800/40 dark:text-ocean-400">
            <div className="flex items-center gap-1.5 font-semibold text-ocean-900 dark:text-white">
              <AlertTriangle className="h-3.5 w-3.5 text-gold-500" /> Authorized Personnel Only
            </div>
            <p className="mt-1">
              All triage dispositions, volunteer service approvals, and financial exports are recorded with an audit trail on South Tongu district servers.
            </p>
          </div>
        </Card>

        {/* Portal Links */}
        <div className="mt-6 rounded-xl border border-ocean-100 bg-ocean-50/50 p-4 text-xs dark:border-ocean-800 dark:bg-ocean-900/40">
          <p className="font-semibold text-ocean-900 dark:text-white mb-2">Looking for citizen or volunteer portals?</p>
          <div className="space-y-2">
            <Link
              href="/user/login"
              className="flex items-center justify-between text-ocean-700 hover:text-ocean-950 dark:text-ocean-300 dark:hover:text-white"
            >
              <span>Citizen &amp; Supporter Portal &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/user/login</span>
            </Link>
            <Link
              href="/volunteer/login"
              className="flex items-center justify-between text-ocean-700 hover:text-ocean-950 dark:text-ocean-300 dark:hover:text-white"
            >
              <span>Ambassador &amp; Volunteer Portal &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/volunteer/login</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
