// Lightweight in-memory rate limiter for public form-submitting Server Actions.
// Good enough for a single-instance deployment. For multi-instance production
// hosting, swap this for a shared store (e.g. Upstash Redis rate limiting).

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): { ok: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { ok: true };
}

// Best-effort caller IP for Server Actions (no direct request object available).
export async function getActionIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
