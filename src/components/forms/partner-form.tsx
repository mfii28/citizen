"use client";

import { useState, useTransition } from "react";
import { submitPartnerApplication } from "@/lib/actions";
import { PARTNER_CATEGORIES, labelize } from "@/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export function PartnerForm() {
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const res = await submitPartnerApplication(formData);
          setResult({ ok: res.ok, message: res.message ?? "" });
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className={inputClass} />
        <input name="position" placeholder="Position / title" className={inputClass} />
        <input name="organisation" placeholder="Organisation" className={inputClass} />
        <input name="email" type="email" required placeholder="Email" className={inputClass} />
        <input name="phone" placeholder="Phone" className={inputClass} />
        <input name="website" placeholder="Website (optional)" className={inputClass} />
      </div>

      <select name="category" required defaultValue="" className={inputClass}>
        <option value="" disabled>Partner category</option>
        {PARTNER_CATEGORIES.map((c) => (
          <option key={c} value={c}>{labelize(c)}</option>
        ))}
      </select>

      <textarea name="purpose" required rows={3} placeholder="Purpose of partnership" className={inputClass} />
      <textarea name="areasOfCollaboration" rows={2} placeholder="Areas of collaboration" className={inputClass} />
      <input name="referralSource" placeholder="How did you hear about us?" className={inputClass} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs text-ocean-500 dark:text-ocean-400">Upload logo (optional — needs Cloudinary)</p>
          <input type="file" disabled className={cn(inputClass, "cursor-not-allowed opacity-60")} />
        </div>
        <div>
          <p className="mb-1 text-xs text-ocean-500 dark:text-ocean-400">Upload proposal (optional — needs Cloudinary)</p>
          <input type="file" disabled className={cn(inputClass, "cursor-not-allowed opacity-60")} />
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-ocean-700 dark:text-ocean-300">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 rounded" />
        I consent to The Citizen Project reviewing and contacting me about this application.
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={!consent}>
        {pending ? "Submitting…" : "Submit application"}
      </Button>

      {result && (
        <div className={cn("rounded-lg p-4 text-sm", result.ok ? "bg-leaf-400/10 text-leaf-600" : "bg-red-50 text-red-700")}>
          {result.message}
        </div>
      )}
    </form>
  );
}
