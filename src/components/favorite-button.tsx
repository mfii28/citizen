"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({ initiativeId, initiallyFavorited }: { initiativeId: string; initiallyFavorited: boolean }) {
  const [favorited, setFavorited] = useState(initiallyFavorited);

  return (
    <button
      type="button"
      title={favorited ? "Remove from favorites" : "Save this initiative"}
      onClick={() => setFavorited((v) => !v)}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition",
        favorited
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-ocean-200 text-ocean-500 hover:border-red-200 hover:text-red-500 dark:border-ocean-700"
      )}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
    </button>
  );
}
