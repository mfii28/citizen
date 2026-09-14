"use client";

import { useState } from "react";
import { CheckCircle2, Heart } from "lucide-react";
import { cn, formatGHS, generateReference } from "@/lib/utils";
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
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState("");

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const methodLabel = METHODS.find((m) => m.value === method)?.label ?? method;

  if (sent) {
    return (
      <div className="space-y-6 py-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-400/15 text-leaf-600 dark:text-leaf-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">
            Thank you for your support
          </h3>
          <p className="mx-auto max-w-md text-sm text-ocean-700 dark:text-ocean-300">
            This is a demo site, so no funds were debited. Your gift represents the kind of civic investment that powers South Tongu forward.
          </p>
        </div>

        <div className="mx-auto max-w-sm rounded-xl border border-ocean-100 bg-ocean-50/50 p-4 text-left text-xs text-ocean-800 dark:border-ocean-800 dark:bg-ocean-900/50 dark:text-ocean-200">
          <div className="flex justify-between py-1 border-b border-ocean-100 dark:border-ocean-800">
            <span className="text-ocean-600 dark:text-ocean-400">Reference</span>
            <span className="font-mono font-medium">{reference}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-ocean-100 dark:border-ocean-800">
            <span className="text-ocean-600 dark:text-ocean-400">Amount</span>
            <span className="font-mono font-medium">{formatGHS(finalAmount)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-ocean-100 dark:border-ocean-800">
            <span className="text-ocean-600 dark:text-ocean-400">Frequency</span>
            <span className="font-medium">{frequency === "MONTHLY" ? "Monthly gift" : "One-time gift"}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ocean-600 dark:text-ocean-400">Method</span>
            <span className="font-medium">{methodLabel}</span>
          </div>
        </div>

        {method === "BANK_TRANSFER" && (
          <div className="mx-auto max-w-sm rounded-lg border border-gold-300/40 bg-gold-300/10 p-3 text-left font-mono text-xs text-gold-700 dark:text-gold-300">
            <p className="font-semibold uppercase tracking-wider text-[10px]">Wire Instructions</p>
            <p className="mt-1">Bank: GCB Bank (Sogakope Branch)</p>
            <p>Acc Name: The Citizen Project</p>
            <p>Acc No: 1441000000000</p>
            <p className="mt-1 text-[11px] text-ocean-600 dark:text-ocean-400">Narration: {reference}</p>
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={() => {
              setSent(false);
              setCustomAmount("");
              setAmount(100);
            }}
            variant="ghost"
            size="md"
          >
            Make another donation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setReference(generateReference("TCP"));
        setSent(true);
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
        <p className="mt-1.5 text-xs text-ocean-600 dark:text-ocean-400">
          This is a demo site — no payment provider is connected, so nothing is actually charged.
        </p>
      </div>

      {initiativeId && (
        <p className="text-xs text-ocean-600 dark:text-ocean-400">Donating to initiative: {initiativeId}</p>
      )}

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
        {`Donate ${formatGHS(finalAmount || 0)}${frequency === "MONTHLY" ? " / month" : ""}`}
      </Button>
    </form>
  );
}
