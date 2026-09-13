// Paystack handles Mobile Money (MTN, AirtelTigo, Telecel) + Visa/Mastercard
// through a single hosted checkout — the standard approach for Ghanaian NGOs.
// Add PAYSTACK_SECRET_KEY in .env to activate. Without it, donations save as
// PENDING locally instead of crashing, so the form stays testable.

interface InitializePaystackArgs {
  email: string;
  amountGHS: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export async function initializePaystackTransaction(args: InitializePaystackArgs) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return {
      ok: false as const,
      reason: "Paystack is not configured yet. Add PAYSTACK_SECRET_KEY to .env to accept live payments.",
    };
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: args.email,
      amount: Math.round(args.amountGHS * 100),
      currency: "GHS",
      reference: args.reference,
      callback_url: args.callbackUrl,
      channels: ["card", "mobile_money", "bank_transfer"],
      metadata: args.metadata ?? {},
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    return { ok: false as const, reason: data.message ?? "Could not start the payment." };
  }
  return { ok: true as const, authorizationUrl: data.data.authorization_url as string };
}

export async function verifyPaystackTransaction(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return { ok: false as const, reason: "Paystack is not configured yet." };

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const data = await res.json();
  if (!res.ok || !data.status) return { ok: false as const, reason: data.message };
  return { ok: true as const, success: data.data.status === "success", raw: data.data };
}
