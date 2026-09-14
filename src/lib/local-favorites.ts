// Client-side favorites management for initiatives.
// There is no backend yet (see PRODUCT.md), so favorites are saved to
// the device's localStorage and kept in sync via custom window events.

const STORAGE_KEY = "tcp:favorites";
export const FAVORITES_CHANGED_EVENT = "tcp:favorites-changed";

export function getFavoriteSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFavorited(slug: string): boolean {
  return getFavoriteSlugs().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const existing = getFavoriteSlugs();
    const index = existing.indexOf(slug);
    let next: string[];
    let newState: boolean;

    if (index >= 0) {
      next = existing.filter((s) => s !== slug);
      newState = false;
    } else {
      next = [...existing, slug];
      newState = true;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: { slug, favorited: newState } }));
    return newState;
  } catch {
    return false;
  }
}
