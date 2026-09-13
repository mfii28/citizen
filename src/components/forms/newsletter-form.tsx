"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark = true }: { dark?: boolean }) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex gap-2"
      action={(formData) => {
        startTransition(async () => {
          const res = await subscribeNewsletter(formData);
          setStatus({ ok: res.ok, message: res.message ?? "" });
        });
      }}
    >
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className={cn(
          "w-full min-w-0 rounded-lg border px-3 py-2 text-sm focus:border-gold-500",
          dark
            ? "border-ocean-800 bg-ocean-900 text-white placeholder:text-ocean-500"
            : "border-ocean-200 bg-white text-ocean-900 placeholder:text-ocean-400"
        )}
      />
      <button
        disabled={pending}
        className="shrink-0 rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-ocean-950 hover:bg-gold-400 disabled:opacity-60"
      >
        {pending ? "..." : "Join"}
      </button>
      {status && (
        <span className="sr-only" role="status">{status.message}</span>
      )}
    </form>
  );
}
