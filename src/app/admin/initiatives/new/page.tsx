import { InitiativeForm } from "@/components/admin/initiative-form";

export default function NewInitiativePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">New initiative</h1>
      <div className="mt-6 max-w-2xl"><InitiativeForm /></div>
    </div>
  );
}
