"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, User, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";
import { setSession, nameFromEmail, DEMO_ACCOUNTS, type UserRole } from "@/lib/local-session";
import { SectionHeading, Card, Button, Badge } from "@/components/ui";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [pending, setPending] = useState(false);

  const handleQuickLogin = (demoRole: UserRole) => {
    setPending(true);
    const demo = DEMO_ACCOUNTS[demoRole];
    setSession({ name: demo.name, email: demo.email, role: demo.role });
    if (demoRole === "admin") {
      router.push("/admin");
    } else if (demoRole === "volunteer") {
      router.push("/volunteer");
    } else {
      router.push("/user");
    }
  };

  return (
    <section className="section-y">
      <div className="container-page max-w-md">
        <SectionHeading eyebrow="Welcome back" title="Sign in" align="center" />

        {/* 1-Click Quick Demo Sign-in */}
        <div className="mt-8 space-y-2.5">
          <p className="font-mono text-xs uppercase tracking-wider text-ocean-600 dark:text-ocean-400">
            Preview Demo Persona (1-Click)
          </p>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("user")}
              className="flex items-center justify-between rounded-xl border border-ocean-200 bg-white p-3 text-left transition hover:border-ocean-500 hover:bg-ocean-50/50 dark:border-ocean-800 dark:bg-ocean-900 dark:hover:bg-ocean-800/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-100 text-ocean-700 dark:bg-ocean-800 dark:text-ocean-300">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ocean-950 dark:text-white">Citizen Supporter</p>
                  <p className="text-xs text-ocean-600 dark:text-ocean-400">Routes to <code className="text-ocean-900 dark:text-white">/user</code></p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ocean-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("volunteer")}
              className="flex items-center justify-between rounded-xl border border-ocean-200 bg-white p-3 text-left transition hover:border-ocean-500 hover:bg-ocean-50/50 dark:border-ocean-800 dark:bg-ocean-900 dark:hover:bg-ocean-800/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-400/15 text-leaf-600 dark:text-leaf-400">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ocean-950 dark:text-white">Volunteer / Ambassador</p>
                  <p className="text-xs text-ocean-600 dark:text-ocean-400">Routes to <code className="text-ocean-900 dark:text-white">/volunteer</code></p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ocean-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="flex items-center justify-between rounded-xl border border-ocean-200 bg-white p-3 text-left transition hover:border-ocean-500 hover:bg-ocean-50/50 dark:border-ocean-800 dark:bg-ocean-900 dark:hover:bg-ocean-800/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-300/30 text-gold-600 dark:text-gold-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ocean-950 dark:text-white">District Coordinator (Admin)</p>
                  <p className="text-xs text-ocean-600 dark:text-ocean-400">Routes to <code className="text-ocean-900 dark:text-white">/admin</code></p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ocean-400" />
            </button>
          </div>
        </div>

        {/* Direct Links to Separate Role Login Pages */}
        <div className="mt-6 rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 text-xs dark:border-ocean-800 dark:bg-ocean-900/40">
          <p className="font-semibold text-ocean-900 dark:text-white">Dedicated Role Login Pages:</p>
          <div className="mt-2 space-y-1.5">
            <Link
              href="/user/login"
              className="flex items-center justify-between rounded-lg p-2 transition hover:bg-white dark:hover:bg-ocean-800 text-ocean-700 dark:text-ocean-300"
            >
              <span>Citizen Portal Sign In &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/user/login</span>
            </Link>
            <Link
              href="/volunteer/login"
              className="flex items-center justify-between rounded-lg p-2 transition hover:bg-white dark:hover:bg-ocean-800 text-ocean-700 dark:text-ocean-300"
            >
              <span>Volunteer &amp; Ambassador Sign In &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/volunteer/login</span>
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center justify-between rounded-lg p-2 transition hover:bg-white dark:hover:bg-ocean-800 text-ocean-700 dark:text-ocean-300"
            >
              <span>District Operations Console Sign In &rarr;</span>
              <span className="font-mono text-[11px] text-ocean-500">/admin/login</span>
            </Link>
          </div>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
          <span className="font-mono text-xs uppercase tracking-wider text-ocean-400">Or sign in with email</span>
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-800" />
        </div>

        <Card className="p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPending(true);
              setSession({ name: nameFromEmail(email), email, role });
              const target = role === "admin" ? "/admin" : role === "volunteer" ? "/volunteer" : "/user";
              router.push(target);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-800 dark:text-ocean-200">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-800 dark:text-ocean-200">Password</label>
              <input type="password" required placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-800 dark:text-ocean-200">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={inputClass}
              >
                <option value="user">Citizen Supporter (Simple)</option>
                <option value="volunteer">Volunteer / Ambassador (Moderate)</option>
                <option value="admin">District Coordinator (Extensive Admin)</option>
              </select>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              <LogIn className="h-4 w-4" /> {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-ocean-600 dark:text-ocean-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-ocean-700 underline dark:text-ocean-300">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
