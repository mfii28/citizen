import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/mock-data";
import { SectionHeading, Card, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  const posts = blogPosts.filter((p) => p.published).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow="Stories & updates" title="Blog" description="News, reflections, and reports from across our initiatives." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`}>
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(8,29,38,0.10)]">
                <Badge>{p.category}</Badge>
                <h3 className="mt-3 font-display font-semibold text-ocean-950 dark:text-white">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-ocean-600 dark:text-ocean-300">{p.excerpt}</p>
                <p className="mt-4 font-mono text-xs text-ocean-600 dark:text-ocean-400">{formatDate(p.publishedAt)}</p>
              </Card>
            </Link>
          ))}
          {posts.length === 0 && <p className="text-ocean-600 dark:text-ocean-400">No posts yet.</p>}
        </div>
      </div>
    </section>
  );
}
