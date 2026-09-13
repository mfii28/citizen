"use client";

import { useState, useTransition } from "react";
import { initiateDonation } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const AMOUNTS = [50, 100, 250, 500];
const METHODS = [
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CARD", label: "Visa / Mastercard" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
] as const;

export function DonationForm({ initiativeId }: { initiativeId?: string }) {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"ONE_TIME" | "MONTHLY">("ONE_TIME");
  const [method, setMethod] = useState<(typeof METHODS)[number]["value"]>("MOBILE_MONEY");
  const [anonymous, setAnonymous] = useState(false);
  const [corporate, setCorporate] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const finalAmount = customAmount ? Number(customAmount) : amount;

  return (
    <form
      action={(formData) => {
        formData.set("amount", String(finalAmount));
        formData.set("frequency", frequency);
        formData.set("method", method);
        formData.set("anonymous", anonymous ? "true" : "");
        formData.set("corporate", corporate ? "true" : "");
        if (initiativeId) formData.set("initiativeId", initiativeId);

        startTransition(async () => {
          const res = await initiateDonation(formData);
          if (res.ok && res.authorizationUrl) {
            window.location.href = res.authorizationUrl;
            return;
          }
          setResult({ ok: res.ok, message: res.ok ? res.message ?? "Thank you." : res.message });
        });
      }}
      className="space-y-6"
    >
      <div className="flex gap-2 rounded-full bg-ocean-50 p-1 dark:bg-ocean-900">
        {(["ONE_TIME", "MONTHLY"] as const).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFrequency(f)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-semibold transition",
              frequency === f ? "bg-ocean-700 text-white" : "text-ocean-600 dark:text-ocean-300"
            )}
          >
            {f === "ONE_TIME" ? "One-time" : "Monthly"}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ocean-800 dark:text-ocean-200">Amount (GHS)</p>
        <div className="grid grid-cols-4 gap-2">
          {AMOUNTS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={cn(
                "rounded-lg border py-2.5 text-sm font-semibold transition",
                !customAmount && amount === a
                  ? "border-ocean-700 bg-ocean-700 text-white"
                  : "border-ocean-200 text-ocean-700 hover:border-ocean-400 dark:border-ocean-700 dark:text-ocean-200"
              )}
            >
              {a}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          placeholder="Or enter a custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="mt-2 w-full rounded-lg border border-ocean-200 px-3 py-2.5 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ocean-800 dark:text-ocean-200">Payment method</p>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map((m) => (
            <button
              type="button"
              key={m.value}
              onClick={() => setMethod(m.value)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition",
                method === m.value
                  ? "border-ocean-700 bg-ocean-50 text-ocean-900 dark:bg-ocean-800 dark:text-white"
                  : "border-ocean-200 text-ocean-600 hover:border-ocean-400 dark:border-ocean-700 dark:text-ocean-300"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-ocean-500 dark:text-ocean-400">
          Mobile Money and Card are processed securely via Paystack, covering MTN, AirtelTigo, and Telecel.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input name="donorName" placeholder="Your name (optional)" className="rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900" />
        <input name="donorEmail" type="email" required placeholder="Email (for your receipt)" className="rounded-lg border border-ocean-200 px-3 py-2.5 text-sm dark:border-ocean-700 dark:bg-ocean-900" />
      </div>

      <div className="flex flex-wrap gap-5 text-sm text-ocean-700 dark:text-ocean-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded" />
          Give anonymously
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={corporate} onChange={(e) => setCorporate(e.target.checked)} className="rounded" />
          This is a corporate donation
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full">
        {pending ? "Processing…" : `Donate GHS ${finalAmount || 0}${frequency === "MONTHLY" ? " / month" : ""}`}
      </Button>

      {result && (
        <div className={cn("rounded-lg p-4 text-sm", result.ok ? "bg-leaf-400/10 text-leaf-600" : "bg-red-50 text-red-700")}>
          {result.message}
          {method === "BANK_TRANSFER" && result.ok && (
            <p className="mt-2 font-mono text-xs">
              Acc. Name: The Citizen Project · Acc. No: 0000000000 · Bank: [Add bank details] · Use your reference as the transfer narration.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
