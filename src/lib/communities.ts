// Approximate coordinates for known South Tongu District communities.
// Sogakope and Dabala are grounded in published sources; smaller communities
// (like Agorkpo) are placed approximately within the district and should be
// corrected with real GPS as reports come in — see the Survey form's optional
// GPS field, which always takes priority over this lookup when present.
export const COMMUNITY_COORDINATES: Record<string, [number, number]> = {
  "sogakope": [5.9977, 0.5883],
  "sokpoe": [5.9833, 0.5833],
  "dabala": [6.0100, 0.6800],
  "agorkpo": [5.9500, 0.5500],
  "adidome": [6.0997, 0.5461],
  "battor": [6.1180, 0.5340],
};

export function resolveCoordinates(
  community: string,
  lat?: number | null,
  lng?: number | null
): [number, number] | null {
  if (lat != null && lng != null) return [lat, lng];
  const key = community.trim().toLowerCase();
  return COMMUNITY_COORDINATES[key] ?? null;
}

// District centroid — used to center the map (South Tongu District, Volta Region).
export const DISTRICT_CENTER: [number, number] = [6.0001, 0.5991];
