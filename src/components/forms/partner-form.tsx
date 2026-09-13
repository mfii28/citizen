"use client";

import { useState } from "react";
import { PARTNER_CATEGORIES, labelize } from "@/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export function PartnerForm() {
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
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

      <label className="flex items-start gap-2 text-sm text-ocean-700 dark:text-ocean-300">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 rounded" />
        I consent to The Citizen Project reviewing and contacting me about this application.
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={!consent}>
        Submit application
      </Button>

      {sent && (
        <div className={cn("rounded-lg p-4 text-sm bg-leaf-400/10 text-leaf-600")}>
          Thanks for your interest! This is a demo site, so applications aren&apos;t actually reviewed or stored anywhere.
        </div>
      )}
    </form>
  );
}
