import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const routes = [
  "", "about", "vision", "mission", "initiatives", "events", "donate",
  "transparency", "contact", "survey", "partners", "ambassadors", "volunteer", "blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return routes.map((r) => ({ url: `${base}/${r}`, lastModified: new Date() }));
}
