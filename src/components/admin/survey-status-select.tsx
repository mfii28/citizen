"use client";

import { useTransition } from "react";
import { updateSurveyStatus } from "@/lib/admin-actions";
import { labelize } from "@/types";

const STATUSES = ["SUBMITTED", "IN_REVIEW", "IN_PROGRESS", "RESOLVED"];

export function SurveyStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateSurveyStatus(id, e.target.value))}
      className="shrink-0 rounded-lg border border-ocean-200 px-2 py-1.5 text-xs dark:border-ocean-700 dark:bg-ocean-900"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{labelize(s)}</option>
      ))}
    </select>
  );
}
