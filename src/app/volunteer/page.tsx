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
          <div className="mt-6 rounded-xl border border-leaf-500/30 bg-leaf-400/10 p-4">
            <p className="text-xs font-semibold text-leaf-800 dark:text-leaf-300">
              Already a South Tongu Volunteer or Ambassador?
            </p>
            <p className="mt-1 text-xs text-ocean-700 dark:text-ocean-300">
              Access your self-service portal to log service hours, monitor leaderboard standing, and download your ambassador credentials.
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <Button href="/volunteer/dashboard" size="sm">
                Open Volunteer Dashboard &rarr;
              </Button>
              <Button href="/volunteer/login" size="sm" variant="secondary">
                Volunteer Sign In
              </Button>
            </div>
          </div>

          <div className="mt-6 border-t border-ocean-100 pt-6 dark:border-ocean-800">
            <p className="text-xs text-ocean-600 dark:text-ocean-400">
              New to The Citizen Project? Register your interest below:
            </p>
            <Button href="/contact" size="md" variant="ghost" className="mt-2 w-full">
              Register interest as a new volunteer
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
