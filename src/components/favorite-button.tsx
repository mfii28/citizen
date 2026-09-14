"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { isFavorited, toggleFavorite, FAVORITES_CHANGED_EVENT } from "@/lib/local-favorites";

export function FavoriteButton({ initiativeId, initiallyFavorited = false }: { initiativeId: string; initiallyFavorited?: boolean }) {
  const [favorited, setFavorited] = useState(initiallyFavorited);

  useEffect(() => {
    setFavorited(isFavorited(initiativeId));
    const handleSync = () => setFavorited(isFavorited(initiativeId));
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleSync);
    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, handleSync);
  }, [initiativeId]);

  return (
    <button
      type="button"
      title={favorited ? "Remove from favorites" : "Save this initiative"}
      onClick={() => {
        const next = toggleFavorite(initiativeId);
        setFavorited(next);
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition",
        favorited
          ? "border-red-500/40 bg-red-500/10 text-[#DC2626] dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-400"
          : "border-ocean-200 text-ocean-500 hover:border-red-500/40 hover:text-[#DC2626] dark:border-ocean-700 dark:text-ocean-400 dark:hover:text-red-400"
      )}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
    </button>
  );
}
