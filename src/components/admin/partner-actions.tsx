"use client";

import { useTransition } from "react";
import { updatePartnerStatus } from "@/lib/admin-actions";
import { Check, X } from "lucide-react";

export function PartnerActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  if (status !== "PENDING") return null;
  return (
    <div className="flex shrink-0 gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(() => updatePartnerStatus(id, "APPROVED"))}
        className="flex items-center gap-1 rounded-full bg-leaf-400/15 px-3 py-1.5 text-xs font-semibold text-leaf-600 disabled:opacity-50"
      >
        <Check className="h-3 w-3" /> Approve
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => updatePartnerStatus(id, "REJECTED"))}
        className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
      >
        <X className="h-3 w-3" /> Reject
      </button>
    </div>
  );
}
