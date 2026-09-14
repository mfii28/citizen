// A dummy, client-side-only "session" for the login/signup/dashboard demo.
// There is no backend yet (see PRODUCT.md) — this never validates a password
// or creates a real account. It exists so the login/signup/dashboard flow is
// navigable end-to-end and ready to be swapped for real auth later.

const STORAGE_KEY = "tcp:session";

export type LocalSession = {
  name: string;
  email: string;
  loggedInAt: string;
};

export function getSession(): LocalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalSession) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Omit<LocalSession, "loggedInAt">) {
  if (typeof window === "undefined") return;
  try {
    const full: LocalSession = { ...session, loggedInAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch {
    // localStorage unavailable — the dummy flow just won't persist across reloads.
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] || "there";
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
