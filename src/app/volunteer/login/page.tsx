"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Trophy, UserCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import { setSession, nameFromEmail, DEMO_ACCOUNTS } from "@/lib/local-session";
import { SectionHeading, Card, Button } from "@/components/ui";

export default function VolunteerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleQuickLogin = () => {
    setPending(true);
    const demo = DEMO_ACCOUNTS.volunteer;
    setSession({ name: demo.name, email: demo.email, role: "volunteer" });
    router.push("/volunteer/dashboard");
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    setSession({ name: nameFromEmail(email), email, role: "volunteer" });
    router.push("/volunteer/dashboard");
  };

  return (
    <section className="section-y">
      <div className="container-page max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-400/20 text-leaf-600 dark:text-leaf-400 mb-4">
          <Award className="h-7 w-7" />
        </div>

        <SectionHeading
          eyebrow="District Ambassador Network"
          title="Volunteer &amp; Ambassador Portal"
          description="Log verified service hours, track your tier standing, and download your South Tongu Ambassador Certificate."
          align="center"
        />

        {/* 1-Click Quick Demo Sign-in */}
        <div className="mt-8">
          <Card className="border-leaf-500/30 bg-leaf-400/5 p-4 text-center dark:border-leaf-500/20">
            <p className="text-xs font-medium text-ocean-700 dark:text-ocean-300">
              Previewing volunteer features?
            </p>
            <Button
              type="button"
              onClick={handleQuickLogin}
              disabled={pending}
              className="mt-3 w-full"
            >
              <UserCheck className="h-4 w-4" /> 1-Click Login as Akua Agbavitor (Volunteer)
            </Button>
          </Card>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
          <span className="font-mono text-xs uppercase tracking-wider text-ocean-400">
            Or sign in with volunteer email
          </span>
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label
                htmlFor="vol-email"
                className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200"
              >
                Volunteer email address
              </label>
              <input
                id="vol-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="volunteer@example.com"
                className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
              />
            </div>

            <div>
              <label
                htmlFor="vol-password"
                className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200"
              >
                Password
              </label>
              <input
                id="vol-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
              />
            </div>

            <Button type="submit" disabled={pending} className="w-full mt-2">
              {pending ? "Authenticating…" : "Access Volunteer Console"}
            </Button>
          </form>

          <div className="mt-4 border-t border-ocean-100 pt-4 dark:border-ocean-800">
            <p className="text-xs text-ocean-600 dark:text-ocean-400">
              Ambassador Benefits:
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-ocean-700 dark:text-ocean-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-leaf-500" /> Verified hours logged on blockchain ledger
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-leaf-500" /> Downloadable District Ambassador Certificate
              </li>
            </ul>
          </div>
        </Card>

        {/* Portal Links */}
        <div className="mt-6 rounded-xl border border-ocean-100 bg-ocean-50/50 p-4 text-xs dark:border-ocean-800 dark:bg-ocean-900/40">
          <p className="font-semibold text-ocean-900 dark:text-white mb-2">Looking for other portals?</p>
          <div className="space-y-2">
            <Link
              href="/user/login"
              className="flex items-center justify-between text-ocean-700 hover:text-ocean-950 dark:text-ocean-300 dark:hover:text-white"
            >
              <span>Citizen &amp; Supporter Portal &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/user/login</span>
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
