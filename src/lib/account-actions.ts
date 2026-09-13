"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getActionIp } from "@/lib/rate-limit";

type ActionResult = { ok: true; message?: string } | { ok: false; message: string };

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not signed in");
  return session.user;
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerAccount(formData: FormData): Promise<ActionResult> {
  const ip = await getActionIp();
  if (!rateLimit(`register:${ip}`, 5, 60_000).ok) {
    return { ok: false, message: "Too many attempts — please wait a minute and try again." };
  }

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please use a real email and a password of at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { ok: false, message: "An account with that email already exists — try signing in instead." };

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      role: "MEMBER",
    },
  });

  return { ok: true, message: "Account created — you can now sign in." };
}

export async function toggleFavorite(initiativeId: string): Promise<ActionResult & { favorited?: boolean }> {
  const user = await requireUser();

  const existing = await prisma.favorite.findUnique({
    where: { userId_initiativeId: { userId: user.id, initiativeId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/account");
    return { ok: true, favorited: false };
  }

  await prisma.favorite.create({ data: { userId: user.id, initiativeId } });
  revalidatePath("/account");
  return { ok: true, favorited: true };
}

export async function cancelRecurringDonation(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const recurring = await prisma.recurringDonation.findUnique({ where: { id } });
  if (!recurring || recurring.userId !== user.id) return { ok: false, message: "Not found." };

  await prisma.recurringDonation.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/account");
  return { ok: true, message: "Recurring donation cancelled." };
}
