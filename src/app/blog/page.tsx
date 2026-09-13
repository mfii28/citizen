import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SectionHeading, Card, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow="Stories & updates" title="Blog" description="News, reflections, and reports from across our initiatives." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`}>
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <Badge>{p.category}</Badge>
                <h3 className="mt-3 font-display font-semibold text-ocean-950 dark:text-white">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-ocean-600 dark:text-ocean-300">{p.excerpt}</p>
                <p className="mt-4 font-mono text-xs text-ocean-400">{formatDate(p.publishedAt)}</p>
              </Card>
            </Link>
          ))}
          {posts.length === 0 && <p className="text-ocean-500">No posts yet.</p>}
        </div>
      </div>
    </section>
  );
}
