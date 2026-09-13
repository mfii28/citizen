"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
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
      <Button type="submit" size="lg" className="w-full">Send message</Button>
      {sent && (
        <div className={cn("rounded-lg p-4 text-sm bg-leaf-400/10 text-leaf-600")}>
          Thanks for reaching out! This is a demo site, so messages aren&apos;t actually sent or stored anywhere.
        </div>
      )}
    </form>
  );
}
