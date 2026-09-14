import type { Metadata } from "next";
import { events } from "@/lib/mock-data";
import { SectionHeading, Card, Button } from "@/components/ui";
import { ShareRow } from "@/components/share-row";
import { formatDate } from "@/lib/utils";
import { MapPin } from "lucide-react";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  const now = new Date();
  const upcoming = events.filter((e) => e.startDate >= now).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const past = events.filter((e) => e.startDate < now).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow="Get on the calendar" title="Events" description="Upcoming gatherings, dialogues, and service days across South Tongu." />

        <h2 className="mt-12 font-display text-xl font-semibold text-ocean-950 dark:text-white">Upcoming</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {upcoming.map((e) => (
            <Card key={e.id} id={e.slug} className="p-6">
              <p className="font-mono text-xs uppercase tracking-wide text-ocean-600 dark:text-ocean-400">{formatDate(e.startDate)}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-ocean-950 dark:text-white">{e.title}</h3>
              <p className="mt-2 text-sm text-ocean-600 dark:text-ocean-300">{e.summary}</p>
              {e.location && (
                <p className="mt-2 flex items-center gap-1 text-xs text-ocean-600 dark:text-ocean-400">
                  <MapPin className="h-3.5 w-3.5" /> {e.location}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Button href="/volunteer" size="sm" variant="secondary">Register interest</Button>
                <ShareRow title={e.title} />
              </div>
            </Card>
          ))}
          {upcoming.length === 0 && <p className="text-ocean-600 dark:text-ocean-400">No upcoming events scheduled right now.</p>}
        </div>

        {past.length > 0 && (
          <>
            <h2 className="mt-14 font-display text-xl font-semibold text-ocean-950 dark:text-white">Past events</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {past.map((e) => (
                <Card key={e.id} className="p-5 opacity-80">
                  <p className="font-mono text-xs uppercase tracking-wide text-ocean-600 dark:text-ocean-400">{formatDate(e.startDate)}</p>
                  <h3 className="mt-1 font-semibold text-ocean-950 dark:text-white">{e.title}</h3>
                  <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-300">{e.summary}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
