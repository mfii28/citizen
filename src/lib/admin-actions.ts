"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { InitiativeStatus, SurveyStatus, PartnerStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Not authorized");
  }
  return session;
}

function initiativeData(formData: FormData) {
  return {
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    status: (formData.get("status") as InitiativeStatus) ?? "ACTIVE",
    budget: Number(formData.get("budget") || 0),
    amountRaised: Number(formData.get("amountRaised") || 0),
    location: String(formData.get("location") || "") || null,
    beneficiaries: String(formData.get("beneficiaries") || "") || null,
    volunteersInvolved: Number(formData.get("volunteersInvolved") || 0),
    objectives: String(formData.get("objectives") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    sdgTags: String(formData.get("sdgTags") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export async function createInitiative(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title"));
  await prisma.initiative.create({
    data: { title, slug: slugify(title), ...initiativeData(formData) },
  });
  revalidatePath("/admin/initiatives");
  revalidatePath("/initiatives");
  redirect("/admin/initiatives");
}

export async function updateInitiative(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title"));
  await prisma.initiative.update({
    where: { id },
    data: { title, ...initiativeData(formData) },
  });
  revalidatePath("/admin/initiatives");
  revalidatePath("/initiatives");
  redirect("/admin/initiatives");
}

export async function deleteInitiative(id: string, _formData: FormData) {
  await requireAdmin();
  await prisma.initiative.delete({ where: { id } });
  revalidatePath("/admin/initiatives");
  revalidatePath("/initiatives");
}

export async function updateSurveyStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.surveyReport.update({ where: { id }, data: { status: status as SurveyStatus } });
  revalidatePath("/admin/surveys");
}

export async function updatePartnerStatus(id: string, status: "APPROVED" | "REJECTED") {
  await requireAdmin();
  await prisma.partner.update({ where: { id }, data: { status: status as PartnerStatus } });
  revalidatePath("/admin/partners");
  revalidatePath("/partners");
}
