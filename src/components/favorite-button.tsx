"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/account-actions";
import { cn } from "@/lib/utils";

export function FavoriteButton({ initiativeId, initiallyFavorited }: { initiativeId: string; initiallyFavorited: boolean }) {
  const { status } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [pending, startTransition] = useTransition();

  if (status === "loading") return null;

  return (
    <button
      type="button"
      title={status === "authenticated" ? "Save this initiative" : "Sign in to save initiatives"}
      onClick={() => {
        if (status !== "authenticated") {
          router.push("/login");
          return;
        }
        startTransition(async () => {
          const res = await toggleFavorite(initiativeId);
          if (res.ok) setFavorited(!!res.favorited);
        });
      }}
      disabled={pending}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition disabled:opacity-50",
        favorited
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-ocean-200 text-ocean-500 hover:border-red-200 hover:text-red-500 dark:border-ocean-700"
      )}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
    </button>
  );
}
