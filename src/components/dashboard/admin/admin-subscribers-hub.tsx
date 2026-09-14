"use client";

import { useState } from "react";
import { Mail, Send, Download, Users, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  getSubscribers,
  addSubscriber,
  addAuditEntry,
  type SubscriberEntry,
} from "@/lib/admin-store";
import { FilamentBadge } from "../filament/filament-badge";
import { downloadCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/utils";

export function AdminSubscribersHub({
  coordinatorName,
  onNotify,
}: {
  coordinatorName: string;
  onNotify: (msg: string) => void;
}) {
  const [subscribers, setSubscribers] = useState<SubscriberEntry[]>(() => getSubscribers());
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  // Broadcast state
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("ALL_ACTIVE");

  const handleExport = () => {
    const headers = ["ID", "Email", "Status", "Subscribed At", "Source"];
    const rows = subscribers.map((s) => [s.id, s.email, s.status, formatDate(new Date(s.subscribedAt)), s.source]);
    downloadCsv("south_tongu_newsletter_subscribers.csv", [headers, ...rows]);
    onNotify("Exported newsletter subscribers CSV");
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return;

    addAuditEntry({
      actor: coordinatorName,
      action: "BROADCAST_DISPATCHED",
      entityType: "SYSTEM",
      entityId: `broadcast-${Date.now()}`,
      details: `Dispatched community broadcast "${broadcastSubject}" to ${subscribers.length} subscribers.`,
    });

    setIsBroadcastOpen(false);
    setBroadcastSubject("");
    setBroadcastMessage("");
    onNotify(`Dispatched broadcast to ${subscribers.length} active subscribers`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              Newsletter &amp; Citizen Subscribers Hub
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              <Users className="h-3 w-3" /> {subscribers.length} Subscribers
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Citizens and donors subscribed to public quarterly bulletins, emergency advisories, and milestone reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-1.5 text-xs font-semibold text-ocean-800 shadow-xs hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200 dark:hover:bg-ocean-800"
          >
            <Download className="h-3.5 w-3.5 text-ocean-500" /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsBroadcastOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-ocean-950 shadow-sm hover:bg-amber-400"
          >
            <Send className="h-3.5 w-3.5" /> Compose Community Broadcast
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="overflow-hidden rounded-xl border border-ocean-200/80 bg-white shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ocean-100 bg-ocean-50/70 font-semibold uppercase tracking-wider text-ocean-500 dark:border-ocean-800/80 dark:bg-ocean-900/50 dark:text-ocean-400">
              <tr>
                <th className="px-4 py-3">Subscriber Email</th>
                <th className="px-4 py-3">Acquisition Source</th>
                <th className="px-4 py-3">Date Subscribed</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800/60">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="transition hover:bg-ocean-50/50 dark:hover:bg-ocean-900/30">
                  <td className="px-4 py-3.5 font-bold text-ocean-950 dark:text-white">
                    {sub.email}
                  </td>
                  <td className="px-4 py-3.5 text-ocean-600 dark:text-ocean-400 font-medium">
                    {sub.source}
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-ocean-500 font-mono">
                    {formatDate(new Date(sub.subscribedAt))}
                  </td>
                  <td className="px-4 py-3.5">
                    <FilamentBadge color={sub.status === "ACTIVE" ? "success" : "gray"}>
                      {sub.status}
                    </FilamentBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Composer Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsBroadcastOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">
                Dispatch Community Bulletin Broadcast
              </h3>
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="rounded p-1 text-ocean-400 hover:text-ocean-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Target Recipient Pool
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                >
                  <option value="ALL_ACTIVE">All Verified Active Subscribers ({subscribers.length})</option>
                  <option value="VOLUNTEERS_ONLY">South Tongu Volunteers &amp; Donors</option>
                  <option value="COMMUNITY_LEADERS">Assembly Members &amp; Area Liaisons</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Bulletin Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly Civic Progress Report: 3 Projects Completed in Dabala"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft the official message body or executive summary..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-ocean-100 pt-3 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3 py-1.5 font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-bold text-ocean-950 hover:bg-amber-400"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
