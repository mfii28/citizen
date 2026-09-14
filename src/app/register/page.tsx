"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { setSession } from "@/lib/local-session";
import { SectionHeading, Card, Button } from "@/components/ui";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <section className="section-y">
      <div className="container-page max-w-md">
        <SectionHeading eyebrow="Join us" title="Create an account" />

        <Card className="mt-8 p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPending(true);
              setSession({ name, email });
              router.push("/dashboard");
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-ocean-800 dark:text-ocean-200">Full name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ama Donkor"
                className={inputClass}
              />
            </div>
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
              <UserPlus className="h-4 w-4" /> {pending ? "Creating account…" : "Create account"}
            </Button>

            <p className="rounded-lg bg-ocean-50 p-3 text-xs text-ocean-700 dark:bg-ocean-800 dark:text-ocean-200">
              This is a demo signup — there&apos;s no backend yet, so no account is actually created. You&apos;ll
              be taken straight to a sample dashboard.
            </p>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-ocean-600 dark:text-ocean-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ocean-700 underline dark:text-ocean-300">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
