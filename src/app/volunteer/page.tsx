import type { Metadata } from "next";
import { SectionHeading, Card, Button } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Volunteer" };

const perks = [
  "Track your volunteer hours toward certificates",
  "Join any active initiative that matches your interests",
  "Get first access to event registrations",
  "Receive programme announcements and impact updates",
];

export default function VolunteerPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl">
        <SectionHeading eyebrow="Give your time" title="Become a volunteer" description="South Tongu's progress runs on volunteer hours. Here's what's in it for you." />
        <Card className="mt-8 p-6 sm:p-8">
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex gap-2 text-ocean-700 dark:text-ocean-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf-500" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ocean-500 dark:text-ocean-400">
            A full self-service volunteer portal (hour tracking, certificate downloads, initiative sign-up) is coming in
            Phase 2. For now, register your interest and our team will follow up directly.
          </p>
          <Button href="/contact" size="lg" className="mt-6 w-full">Register your interest</Button>
        </Card>
      </div>
    </section>
  );
}
