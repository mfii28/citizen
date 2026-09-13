"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <section className="section-y">
      <div className="container-page max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Sign in</h1>
        <p className="mt-1 text-sm text-ocean-500 dark:text-ocean-400">Donors, volunteers, staff, and admins all sign in here.</p>
        <Card className="mt-6 p-6">
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              setError("");
              const formData = new FormData(e.currentTarget);
              const res = await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false,
              });
              if (res?.error) {
                setPending(false);
                setError("Invalid email or password.");
                return;
              }
              const session = await getSession();
              const role = (session?.user as { role?: string } | undefined)?.role;
              router.push(role === "ADMIN" || role === "STAFF" ? "/admin" : "/account");
            }}
          >
            <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900" />
            <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">{pending ? "Signing in…" : "Sign in"}</Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-ocean-500">
          New here? <a href="/register" className="font-semibold text-ocean-700 dark:text-ocean-300">Create an account</a>
        </p>
      </div>
    </section>
  );
}
