"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Plus, X, CheckCircle2, Clock } from "lucide-react";
import {
  getCommunityEvents,
  saveCommunityEvent,
  type CommunityEventEntry,
} from "@/lib/admin-store";
import { FilamentBadge } from "../filament/filament-badge";
import { formatDate } from "@/lib/utils";

export function AdminEventsManager({
  coordinatorName,
  onNotify,
}: {
  coordinatorName: string;
  onNotify: (msg: string) => void;
}) {
  const [events, setEvents] = useState<CommunityEventEntry[]>(() => getCommunityEvents());
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("Sogakope Community Centre");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"UPCOMING" | "IN_PROGRESS" | "COMPLETED">("UPCOMING");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const next = saveCommunityEvent(
      {
        title,
        summary,
        location,
        startDate: new Date(startDate).toISOString(),
        status,
      },
      coordinatorName
    );

    setEvents(next);
    setIsCreateOpen(false);
    setTitle("");
    setSummary("");
    onNotify(`Created new event: "${title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Subheader */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              Community Outreach &amp; Events Desk
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <Calendar className="h-3 w-3" /> {events.length} Scheduled
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Organize town halls, cleanup drives, medical screenings, and civic education summits across South Tongu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-ocean-950 shadow-sm hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" /> Schedule New Event
        </button>
      </div>

      {/* Events Table */}
      <div className="overflow-hidden rounded-xl border border-ocean-200/80 bg-white shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ocean-100 bg-ocean-50/70 font-semibold uppercase tracking-wider text-ocean-500 dark:border-ocean-800/80 dark:bg-ocean-900/50 dark:text-ocean-400">
              <tr>
                <th className="px-4 py-3">Event Title &amp; Summary</th>
                <th className="px-4 py-3">Venue Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">RSVPs</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800/60">
              {events.map((evt) => (
                <tr key={evt.id} className="transition hover:bg-ocean-50/50 dark:hover:bg-ocean-900/30">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-ocean-950 dark:text-white">{evt.title}</div>
                    <div className="text-[11px] text-ocean-500 line-clamp-1">{evt.summary}</div>
                  </td>
                  <td className="px-4 py-3.5 text-ocean-700 dark:text-ocean-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-ocean-400" />
                      <span>{evt.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-ocean-500 whitespace-nowrap">
                    {formatDate(new Date(evt.startDate))}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="inline-flex items-center gap-1 rounded-full bg-ocean-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-ocean-800 dark:bg-ocean-800 dark:text-ocean-200">
                      <Users className="h-3 w-3" /> {evt.rsvpsCount} attendees
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <FilamentBadge
                      color={
                        evt.status === "COMPLETED"
                          ? "success"
                          : evt.status === "IN_PROGRESS"
                          ? "info"
                          : "warning"
                      }
                    >
                      {evt.status.replace("_", " ")}
                    </FilamentBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">Schedule New Community Event</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded p-1 text-ocean-400 hover:text-ocean-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Tongu Clean Water & Sanitation Town Hall"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Venue Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Summary &amp; Objectives
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key agenda items and stakeholder invitation scope..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-ocean-100 pt-3 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3 py-1.5 font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-bold text-ocean-950 hover:bg-amber-400"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
