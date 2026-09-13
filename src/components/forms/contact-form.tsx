"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/lib/actions";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export function ContactForm() {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const res = await submitContactMessage(formData);
          setResult({ ok: res.ok, message: res.message ?? "" });
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" className={inputClass} />
        <input name="email" type="email" required placeholder="Email" className={inputClass} />
      </div>
      <input name="phone" placeholder="Phone (optional)" className={inputClass} />
      <input name="subject" required placeholder="Subject" className={inputClass} />
      <textarea name="message" required rows={5} placeholder="Your message" className={inputClass} />
      <Button type="submit" size="lg" className="w-full">{pending ? "Sending…" : "Send message"}</Button>
      {result && (
        <div className={cn("rounded-lg p-4 text-sm", result.ok ? "bg-leaf-400/10 text-leaf-600" : "bg-red-50 text-red-700")}>
          {result.message}
        </div>
      )}
    </form>
  );
}
