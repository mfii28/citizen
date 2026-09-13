"use client";

import { useState, useTransition } from "react";
import { submitSurveyReport } from "@/lib/actions";
import { SURVEY_CATEGORIES, labelize } from "@/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

export function SurveyForm() {
  const [anonymous, setAnonymous] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        formData.set("anonymous", anonymous ? "true" : "");
        startTransition(async () => {
          const res = await submitSurveyReport(formData);
          setResult({ ok: res.ok, message: res.message ?? "" });
        });
      }}
      className="space-y-5"
    >
      <label className="flex items-center gap-2 text-sm text-ocean-700 dark:text-ocean-300">
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded" />
        Submit anonymously
      </label>

      {!anonymous && (
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="reporterName" placeholder="Full name" className={inputClass} />
          <input name="phone" placeholder="Phone number" className={inputClass} />
          <input name="occupation" placeholder="Occupation" className={inputClass} />
          <input name="email" type="email" placeholder="Email (optional)" className={inputClass} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="community" required placeholder="Community" className={inputClass} />
        <input name="town" required placeholder="Town" className={inputClass} />
      </div>

      <select name="category" required defaultValue="" className={inputClass}>
        <option value="" disabled>Select a category</option>
        {SURVEY_CATEGORIES.map((c) => (
          <option key={c} value={c}>{labelize(c)}</option>
        ))}
      </select>

      <input name="title" required placeholder="Issue title" className={inputClass} />
      <textarea name="description" required rows={4} placeholder="Describe the issue in detail" className={inputClass} />
      <textarea name="suggestedSolution" rows={2} placeholder="Suggested solution (optional)" className={inputClass} />

      <div>
        <p className="mb-2 text-sm font-medium text-ocean-800 dark:text-ocean-200">Photo / video (optional)</p>
        <input type="file" accept="image/*,video/*" className={cn(inputClass, "cursor-not-allowed opacity-60")} disabled />
        <p className="mt-1 text-xs text-ocean-500 dark:text-ocean-400">
          Media uploads activate once Cloudinary is connected — see the README.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium text-ocean-800 dark:text-ocean-200">Priority</p>
          <select name="priority" defaultValue="MEDIUM" className={inputClass}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-ocean-800 dark:text-ocean-200">Urgency</p>
          <select name="urgency" defaultValue="MEDIUM" className={inputClass}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">{pending ? "Submitting…" : "Submit report"}</Button>

      {result && (
        <div className={cn("rounded-lg p-4 text-sm", result.ok ? "bg-leaf-400/10 text-leaf-600" : "bg-red-50 text-red-700")}>
          {result.message}
        </div>
      )}
    </form>
  );
}
