export const SURVEY_CATEGORIES = [
  "EDUCATION", "HEALTH", "ENVIRONMENT", "ROADS", "WATER", "SANITATION",
  "EMPLOYMENT", "DOMESTIC_VIOLENCE", "YOUTH_DEVELOPMENT", "POLITICS",
  "CIVIC_EDUCATION", "AGRICULTURE", "SECURITY", "CORRUPTION",
  "INFRASTRUCTURE", "OTHER",
] as const;

export const PARTNER_CATEGORIES = [
  "INDIVIDUAL_AMBASSADOR", "CORPORATE_BRAND", "INSTITUTION", "NGO",
  "GOVERNMENT_AGENCY", "SCHOOL", "COMMUNITY_GROUP",
] as const;

export function labelize(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
