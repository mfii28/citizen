"use client";

import { useTransition } from "react";
import { cancelRecurringDonation } from "@/lib/account-actions";

export function CancelRecurringButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("Cancel this recurring donation?")) startTransition(() => cancelRecurringDonation(id));
      }}
      className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
    >
      {pending ? "…" : "Cancel"}
    </button>
  );
}
