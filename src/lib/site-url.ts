const DEFAULT_SITE_URL = "https://thecitizenproject.org";

/**
 * Safely resolves the canonical site URL for metadata, sitemaps, and robots.txt.
 * Resilient against empty strings, invalid URLs, and handles Vercel environment variables.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && envUrl.length > 0) {
    try {
      const normalized = envUrl.startsWith("http://") || envUrl.startsWith("https://")
        ? envUrl
        : `https://${envUrl}`;
      return new URL(normalized).origin;
    } catch {
      // Invalid URL in env, fallback
    }
  }

  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProdUrl && vercelProdUrl.length > 0) {
    try {
      return new URL(`https://${vercelProdUrl}`).origin;
    } catch {
      // Fallback
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl && vercelUrl.length > 0) {
    try {
      return new URL(`https://${vercelUrl}`).origin;
    } catch {
      // Fallback
    }
  }

  return DEFAULT_SITE_URL;
}

