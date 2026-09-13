import type { MetadataRoute } from "next";

const routes = [
  "", "about", "vision", "mission", "initiatives", "events", "donate",
  "transparency", "contact", "survey", "partners", "ambassadors", "volunteer", "blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thecitizenproject.org";
  return routes.map((r) => ({ url: `${base}/${r}`, lastModified: new Date() }));
}
