"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, LoaderCircle } from "lucide-react";
import { SURVEY_CATEGORIES, labelize } from "@/types";
import { addLocalReport, generateLocalReportId } from "@/lib/local-reports";
import type { PriorityLevel, UrgencyLevel } from "@/lib/mock-data";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900";

type GeoStatus = "idle" | "locating" | "granted" | "denied" | "unavailable";

export function SurveyForm() {
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(false);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const captureLocation = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("unavailable");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setGeoStatus("granted");
      },
      (error) => {
        setGeoStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        addLocalReport({
          id: generateLocalReportId(),
          reporterName: anonymous ? null : (formData.get("reporterName") as string) || null,
          phone: anonymous ? null : (formData.get("phone") as string) || null,
          occupation: anonymous ? null : (formData.get("occupation") as string) || null,
          email: anonymous ? null : (formData.get("email") as string) || null,
          community: String(formData.get("community") || ""),
          town: String(formData.get("town") || ""),
          latitude: coords?.lat ?? null,
          longitude: coords?.lng ?? null,
          category: String(formData.get("category") || ""),
          title: String(formData.get("title") || ""),
          description: String(formData.get("description") || ""),
          suggestedSolution: (formData.get("suggestedSolution") as string) || null,
          priority: (formData.get("priority") as PriorityLevel) || "MEDIUM",
          urgency: (formData.get("urgency") as UrgencyLevel) || "MEDIUM",
          status: "SUBMITTED",
          anonymous,
          createdAt: new Date(),
        });
        setSent(true);
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

      <div className="rounded-lg border border-ocean-200 p-4 dark:border-ocean-700">
        <p className="text-sm font-medium text-ocean-800 dark:text-ocean-200">Pin your exact location (optional)</p>
        <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
          {geoStatus === "granted"
            ? "Captured — this exact point will be pinned on the Community Map, not just the nearest town."
            : "Share your device's GPS location so this report is pinned exactly where the issue is."}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={captureLocation}
            disabled={geoStatus === "locating"}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-60",
              geoStatus === "granted"
                ? "border-leaf-500 bg-leaf-400/10 text-leaf-600"
                : "border-ocean-300 text-ocean-700 hover:border-ocean-500 dark:border-ocean-600 dark:text-ocean-200"
            )}
          >
            {geoStatus === "locating" ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
            {geoStatus === "locating"
              ? "Locating…"
              : geoStatus === "granted"
                ? "Location captured"
                : "Use my current location"}
          </button>
          {geoStatus === "granted" && coords && (
            <span className="font-mono text-xs text-ocean-600 dark:text-ocean-400">
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </span>
          )}
        </div>
        {(geoStatus === "denied" || geoStatus === "unavailable") && (
          <p className="mt-2 text-xs text-gold-600">
            {geoStatus === "denied" ? "Location access was denied" : "Couldn't get your location"} — your report
            will still be pinned using the Community/Town fields below.
          </p>
        )}
      </div>

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
        <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
          Media uploads aren&apos;t available on this demo site.
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

      <Button type="submit" size="lg" className="w-full">Submit report</Button>

      {sent && (
        <div className={cn("rounded-lg p-4 text-sm bg-leaf-400/10 text-leaf-600")}>
          Thanks for reporting this! It&apos;s saved on this device and now pinned on the{" "}
          <Link href="/community-map" className="font-semibold underline">Community Map</Link>. This is a demo
          site with no shared database yet, so the report is visible on this device only.
        </div>
      )}
    </form>
  );
}
