"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { setSession, nameFromEmail, DEMO_ACCOUNTS } from "@/lib/local-session";
import { SectionHeading, Card, Button } from "@/components/ui";

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleQuickLogin = () => {
    setPending(true);
    const demo = DEMO_ACCOUNTS.user;
    setSession({ name: demo.name, email: demo.email, role: "user" });
    router.push("/user/dashboard");
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    setSession({ name: nameFromEmail(email), email, role: "user" });
    router.push("/user/dashboard");
  };

  return (
    <section className="section-y">
      <div className="container-page max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-300/30 text-gold-600 dark:text-gold-400 mb-4">
          <Heart className="h-7 w-7" />
        </div>

        <SectionHeading
          eyebrow="Citizen &amp; Supporter Portal"
          title="Sign in to your account"
          description="Access your donation receipts, tracked community issues, and saved initiatives."
          align="center"
        />

        {/* 1-Click Quick Demo Sign-in */}
        <div className="mt-8">
          <Card className="border-gold-500/30 bg-gold-300/5 p-4 text-center dark:border-gold-500/20">
            <p className="text-xs font-medium text-ocean-700 dark:text-ocean-300">
              Testing the citizen experience?
            </p>
            <Button
              type="button"
              onClick={handleQuickLogin}
              disabled={pending}
              className="mt-3 w-full"
            >
              <UserCheck className="h-4 w-4" /> 1-Click Login as Kofi Mensah (Citizen)
            </Button>
          </Card>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
          <span className="font-mono text-xs uppercase tracking-wider text-ocean-400">
            Or sign in with email
          </span>
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label
                htmlFor="user-email"
                className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200"
              >
                Email address
              </label>
              <input
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
              />
            </div>

            <div>
              <label
                htmlFor="user-password"
                className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200"
              >
                Password
              </label>
              <input
                id="user-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
              />
            </div>

            <Button type="submit" disabled={pending} className="w-full mt-2">
              {pending ? "Signing in…" : "Sign in to Citizen Dashboard"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-ocean-600 dark:text-ocean-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold underline text-ocean-900 dark:text-white">
              Create citizen profile
            </Link>
          </p>
        </Card>

        {/* Portal Links */}
        <div className="mt-6 rounded-xl border border-ocean-100 bg-ocean-50/50 p-4 text-xs dark:border-ocean-800 dark:bg-ocean-900/40">
          <p className="font-semibold text-ocean-900 dark:text-white mb-2">Looking for other portals?</p>
          <div className="space-y-2">
            <Link
              href="/volunteer/login"
              className="flex items-center justify-between text-ocean-700 hover:text-ocean-950 dark:text-ocean-300 dark:hover:text-white"
            >
              <span>Ambassador &amp; Volunteer Portal &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/volunteer/login</span>
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center justify-between text-ocean-700 hover:text-ocean-950 dark:text-ocean-300 dark:hover:text-white"
            >
              <span>District Coordinator (Admin) Console &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/admin/login</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
