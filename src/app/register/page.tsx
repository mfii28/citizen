"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerAccount } from "@/lib/account-actions";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <section className="section-y">
      <div className="container-page max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Create an account</h1>
        <p className="mt-1 text-sm text-ocean-500 dark:text-ocean-400">
          Track your donations, follow initiatives, and manage recurring gifts.
        </p>
        <Card className="mt-6 p-6">
          <form
            className="space-y-4"
            action={(formData) => {
              startTransition(async () => {
                const res = await registerAccount(formData);
                setResult({ ok: res.ok, message: res.message ?? "" });
                if (res.ok) setTimeout(() => router.push("/login"), 1200);
              });
            }}
          >
            <input name="name" required placeholder="Full name" className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900" />
            <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900" />
            <input name="password" type="password" required minLength={8} placeholder="Password (min 8 characters)" className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900" />
            <Button type="submit" className="w-full">{pending ? "Creating…" : "Create account"}</Button>
            {result && (
              <div className={cn("rounded-lg p-3 text-sm", result.ok ? "bg-leaf-400/10 text-leaf-600" : "bg-red-50 text-red-700")}>
                {result.message}
              </div>
            )}
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-ocean-500">
          Already have an account? <a href="/login" className="font-semibold text-ocean-700 dark:text-ocean-300">Sign in</a>
        </p>
      </div>
    </section>
  );
}
