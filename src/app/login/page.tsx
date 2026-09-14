"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { setSession, nameFromEmail } from "@/lib/local-session";
import { SectionHeading, Card, Button } from "@/components/ui";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <section className="section-y">
      <div className="container-page max-w-md">
        <SectionHeading eyebrow="Welcome back" title="Sign in" />

        <Card className="mt-8 p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPending(true);
              setSession({ name: nameFromEmail(email), email });
              router.push("/dashboard");
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

            <Button type="submit" size="lg" className="w-full">
              <LogIn className="h-4 w-4" /> {pending ? "Signing in…" : "Sign in"}
            </Button>

            <p className="rounded-lg bg-ocean-50 p-3 text-xs text-ocean-700 dark:bg-ocean-800 dark:text-ocean-200">
              This is a demo login — there&apos;s no backend yet, so any email and password will sign you in and
              take you to a sample dashboard.
            </p>
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
