import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui";
import { ShareRow } from "@/components/share-row";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();

  return (
    <article className="section-y">
      <div className="container-page max-w-2xl">
        <Badge>{post.category}</Badge>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ocean-950 dark:text-white">{post.title}</h1>
        <p className="mt-2 font-mono text-xs text-ocean-400">{formatDate(post.publishedAt)}</p>
        <div className="mt-6 whitespace-pre-line text-ocean-700 dark:text-ocean-300">{post.content}</div>
        <div className="mt-8 border-t border-ocean-100 pt-5 dark:border-ocean-800">
          <ShareRow title={post.title} />
        </div>
      </div>
    </article>
  );
}
