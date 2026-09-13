"use client";

import { useTransition } from "react";
import { createInitiative, updateInitiative } from "@/lib/admin-actions";
import { Button } from "@/components/ui";

const inputClass = "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900";

type InitiativeInput = {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  status: string;
  budget: number;
  amountRaised: number;
  location: string | null;
  beneficiaries: string | null;
  volunteersInvolved: number;
  objectives: string[];
  sdgTags: string[];
};

export function InitiativeForm({ initiative }: { initiative?: InitiativeInput }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          if (initiative) await updateInitiative(initiative.id, formData);
          else await createInitiative(formData);
        });
      }}
      className="space-y-4"
    >
      <input name="title" required defaultValue={initiative?.title} placeholder="Title" className={inputClass} />
      <input name="summary" required defaultValue={initiative?.summary} placeholder="Short summary" className={inputClass} />
      <textarea name="description" required rows={4} defaultValue={initiative?.description} placeholder="Full description" className={inputClass} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="category" required defaultValue={initiative?.category} placeholder="Category" className={inputClass} />
        <select name="status" defaultValue={initiative?.status ?? "ACTIVE"} className={inputClass}>
          <option value="UPCOMING">Upcoming</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input name="budget" type="number" step="0.01" defaultValue={initiative?.budget ?? 0} placeholder="Budget (GHS)" className={inputClass} />
        <input name="amountRaised" type="number" step="0.01" defaultValue={initiative?.amountRaised ?? 0} placeholder="Amount raised (GHS)" className={inputClass} />
        <input name="location" defaultValue={initiative?.location ?? ""} placeholder="Location" className={inputClass} />
        <input name="volunteersInvolved" type="number" defaultValue={initiative?.volunteersInvolved ?? 0} placeholder="Volunteers involved" className={inputClass} />
      </div>
      <input name="beneficiaries" defaultValue={initiative?.beneficiaries ?? ""} placeholder="Beneficiaries" className={inputClass} />
      <textarea name="objectives" rows={3} defaultValue={initiative?.objectives?.join("\n")} placeholder="Objectives (one per line)" className={inputClass} />
      <input name="sdgTags" defaultValue={initiative?.sdgTags?.join(", ")} placeholder="SDG tags, comma separated (e.g. SDG 4, SDG 11)" className={inputClass} />
      <Button type="submit" size="lg">{pending ? "Saving…" : initiative ? "Save changes" : "Create initiative"}</Button>
    </form>
  );
}
