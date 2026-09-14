"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ocean-600 dark:text-ocean-400">Share</p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ocean-50 px-3 py-1.5 text-xs font-medium text-ocean-700 hover:bg-ocean-100 dark:bg-ocean-800 dark:text-ocean-200 dark:hover:bg-ocean-700"
          >
            {l.label}
          </a>
        ))}
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1 rounded-full bg-ocean-50 px-3 py-1.5 text-xs font-medium text-ocean-700 hover:bg-ocean-100 dark:bg-ocean-800 dark:text-ocean-200 dark:hover:bg-ocean-700"
        >
          {copied ? <Check className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
