import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SectionHeading, Card, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Search" };
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const mode = "insensitive" as const;

  const [initiatives, events, posts, partners] = q
    ? await Promise.all([
        prisma.initiative.findMany({ where: { OR: [{ title: { contains: q, mode } }, { summary: { contains: q, mode } }] }, take: 8 }),
        prisma.event.findMany({ where: { OR: [{ title: { contains: q, mode } }, { summary: { contains: q, mode } }] }, take: 8 }),
        prisma.blogPost.findMany({ where: { published: true, OR: [{ title: { contains: q, mode } }, { excerpt: { contains: q, mode } }] }, take: 8 }),
        prisma.partner.findMany({ where: { status: "APPROVED", OR: [{ name: { contains: q, mode } }, { organisation: { contains: q, mode } }] }, take: 8 }),
      ])
    : [[], [], [], []];

  const totalResults = initiatives.length + events.length + posts.length + partners.length;

  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="Find anything on the site" title="Search" />
        <form className="mt-6 flex gap-2" action="/search">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search initiatives, events, blog posts, partners…"
            className="w-full rounded-lg border border-ocean-200 px-4 py-3 text-sm dark:border-ocean-700 dark:bg-ocean-900"
          />
          <button className="rounded-lg bg-ocean-700 px-5 text-sm font-semibold text-white hover:bg-ocean-600">Search</button>
        </form>

        {q && (
          <p className="mt-6 text-sm text-ocean-500 dark:text-ocean-400">
            {totalResults} result{totalResults === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
        )}

        <div className="mt-6 space-y-8">
          {initiatives.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-500">Initiatives</h2>
              <div className="mt-2 space-y-2">
                {initiatives.map((i) => (
                  <Link key={i.id} href={`/initiatives/${i.slug}`}>
                    <Card className="p-4 hover:shadow-md"><p className="font-medium text-ocean-900 dark:text-white">{i.title}</p><p className="text-sm text-ocean-600 dark:text-ocean-300">{i.summary}</p></Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {events.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-500">Events</h2>
              <div className="mt-2 space-y-2">
                {events.map((e) => (
                  <Link key={e.id} href={`/events#${e.slug}`}>
                    <Card className="p-4 hover:shadow-md"><p className="font-medium text-ocean-900 dark:text-white">{e.title}</p><p className="text-sm text-ocean-600 dark:text-ocean-300">{e.summary}</p></Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {posts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-500">Blog</h2>
              <div className="mt-2 space-y-2">
                {posts.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`}>
                    <Card className="p-4 hover:shadow-md"><p className="font-medium text-ocean-900 dark:text-white">{p.title}</p><p className="text-sm text-ocean-600 dark:text-ocean-300">{p.excerpt}</p></Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {partners.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-500">Partners</h2>
              <div className="mt-2 space-y-2">
                {partners.map((p) => (
                  <Card key={p.id} className="p-4"><p className="font-medium text-ocean-900 dark:text-white">{p.organisation ?? p.name}</p><Badge>{p.category}</Badge></Card>
                ))}
              </div>
            </div>
          )}
          {q && totalResults === 0 && <p className="text-ocean-500">No results yet — try a different term.</p>}
        </div>
      </div>
    </section>
  );
}
