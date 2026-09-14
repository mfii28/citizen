"use client";

import { useState } from "react";
import { BookOpen, Plus, X, Eye, CheckCircle2, Globe, FileEdit, Tag } from "lucide-react";
import {
  getEditorialPosts,
  togglePostPublished,
  saveEditorialPost,
  type EditorialPostEntry,
} from "@/lib/admin-store";
import { FilamentBadge } from "../filament/filament-badge";
import { formatDate } from "@/lib/utils";

export function AdminBlogCms({
  coordinatorName,
  onNotify,
}: {
  coordinatorName: string;
  onNotify: (msg: string) => void;
}) {
  const [posts, setPosts] = useState<EditorialPostEntry[]>(() => getEditorialPosts());
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New post form
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Community Updates");
  const [tagsInput, setTagsInput] = useState("Civic Action, South Tongu");
  const [published, setPublished] = useState(true);

  const handleToggle = (id: string) => {
    const updated = togglePostPublished(id, coordinatorName);
    setPosts(updated);
    const p = updated.find((item) => item.id === id);
    onNotify(`${p?.published ? "Published" : "Set to Draft"}: "${p?.title}"`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = saveEditorialPost(
      {
        slug,
        title,
        excerpt,
        category,
        tags,
        published,
      },
      coordinatorName
    );

    setPosts(updated);
    setIsCreateOpen(false);
    setTitle("");
    setExcerpt("");
    onNotify(`Created new article: "${title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              Civic News &amp; Editorial CMS
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              <BookOpen className="h-3 w-3" /> {posts.length} Articles
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Author and publish community impact stories, quarterly newsletters, and assembly bulletins to the public portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-ocean-950 shadow-sm hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" /> Draft New Article
        </button>
      </div>

      {/* Articles Table */}
      <div className="overflow-hidden rounded-xl border border-ocean-200/80 bg-white shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ocean-100 bg-ocean-50/70 font-semibold uppercase tracking-wider text-ocean-500 dark:border-ocean-800/80 dark:bg-ocean-900/50 dark:text-ocean-400">
              <tr>
                <th className="px-4 py-3">Article Title &amp; Excerpt</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800/60">
              {posts.map((p) => (
                <tr key={p.id} className="transition hover:bg-ocean-50/50 dark:hover:bg-ocean-900/30">
                  <td className="px-4 py-3.5 max-w-sm">
                    <div className="font-bold text-ocean-950 dark:text-white line-clamp-1">{p.title}</div>
                    <div className="text-[11px] text-ocean-500 line-clamp-1">{p.excerpt}</div>
                  </td>
                  <td className="px-4 py-3.5 text-ocean-700 dark:text-ocean-300 font-medium">
                    {p.category}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded bg-ocean-100 px-1.5 py-0.5 text-[10px] text-ocean-700 dark:bg-ocean-800 dark:text-ocean-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-ocean-600 dark:text-ocean-400">
                    {p.views} views
                  </td>
                  <td className="px-4 py-3.5">
                    <FilamentBadge color={p.published ? "success" : "gray"}>
                      {p.published ? "Live / Published" : "Draft"}
                    </FilamentBadge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggle(p.id)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                        p.published
                          ? "border border-ocean-200 text-ocean-700 hover:bg-ocean-100 dark:border-ocean-700 dark:text-ocean-300"
                          : "bg-emerald-600 text-white hover:bg-emerald-500"
                      }`}
                    >
                      {p.published ? "Unpublish" : "Publish Live"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Draft New Article Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">Draft Editorial Article</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded p-1 text-ocean-400 hover:text-ocean-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Article Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Water Pipeline Completed for Agorkpo Health Centre"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  >
                    <option value="Community Updates">Community Updates</option>
                    <option value="Civic Education">Civic Education</option>
                    <option value="Transparency &amp; Audit">Transparency &amp; Audit</option>
                    <option value="Volunteer Stories">Volunteer Stories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Executive Excerpt *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Key summary displayed in cards and search indexing..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded text-amber-500"
                />
                <label htmlFor="pub-check" className="font-medium text-ocean-800 dark:text-ocean-200">
                  Publish immediately to public website
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-ocean-100 pt-3 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3 py-1.5 font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-bold text-ocean-950 hover:bg-amber-400"
                >
                  Save &amp; Store Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
