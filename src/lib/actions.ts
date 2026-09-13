"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReference } from "@/lib/utils";
import { initializePaystackTransaction } from "@/lib/paystack";
import { rateLimit, getActionIp } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

type ActionResult = { ok: true; message?: string } | { ok: false; message: string };

const RATE_LIMIT_MESSAGE = "You're doing that a bit fast — please wait a minute and try again.";

export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const ip = await getActionIp();
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000).ok) return { ok: false, message: RATE_LIMIT_MESSAGE };

  const email = String(formData.get("email") ?? "").trim();
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data },
      update: {},
      create: { email: parsed.data },
    });
    return { ok: true, message: "You're subscribed. Thank you for staying informed." };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function submitContactMessage(formData: FormData): Promise<ActionResult> {
  const ip = await getActionIp();
  if (!rateLimit(`contact:${ip}`, 5, 60_000).ok) return { ok: false, message: RATE_LIMIT_MESSAGE };

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please fill in all required fields correctly." };

  await prisma.contactMessage.create({ data: parsed.data });
  return { ok: true, message: "Message sent — we'll respond within 2 business days." };
}

const surveySchema = z.object({
  reporterName: z.string().optional(),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  community: z.string().min(2),
  town: z.string().min(2),
  category: z.string(),
  title: z.string().min(4),
  description: z.string().min(15),
  suggestedSolution: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  anonymous: z.coerce.boolean().optional(),
});

export async function submitSurveyReport(formData: FormData): Promise<ActionResult> {
  const ip = await getActionIp();
  if (!rateLimit(`survey:${ip}`, 5, 60_000).ok) return { ok: false, message: RATE_LIMIT_MESSAGE };

  const raw = Object.fromEntries(formData);
  const parsed = surveySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please check the required fields — category, community, title, and description." };
  }

  const { anonymous, ...rest } = parsed.data;
  await prisma.surveyReport.create({
    data: {
      ...rest,
      email: rest.email || null,
      anonymous: !!anonymous,
      category: rest.category as never, // validated against SurveyCategory enum values at the UI layer
    },
  });

  revalidatePath("/survey");
  return { ok: true, message: "Report submitted. Thank you for speaking up for your community." };
}

const partnerSchema = z.object({
  name: z.string().min(2),
  organisation: z.string().optional(),
  position: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  category: z.string(),
  purpose: z.string().min(10),
  areasOfCollaboration: z.string().optional(),
  website: z.string().optional(),
  referralSource: z.string().optional(),
});

export async function submitPartnerApplication(formData: FormData): Promise<ActionResult> {
  const ip = await getActionIp();
  if (!rateLimit(`partner:${ip}`, 3, 60_000).ok) return { ok: false, message: RATE_LIMIT_MESSAGE };

  const parsed = partnerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please complete the required fields." };

  await prisma.partner.create({
    data: { ...parsed.data, category: parsed.data.category as never },
  });

  revalidatePath("/partners");
  return { ok: true, message: "Application received — our team reviews every partner request before approval." };
}

const donationSchema = z.object({
  donorName: z.string().optional(),
  donorEmail: z.string().email(),
  amount: z.coerce.number().positive(),
  method: z.enum(["MOBILE_MONEY", "CARD", "BANK_TRANSFER", "PAYPAL"]),
  frequency: z.enum(["ONE_TIME", "MONTHLY"]).default("ONE_TIME"),
  anonymous: z.coerce.boolean().optional(),
  corporate: z.coerce.boolean().optional(),
  initiativeId: z.string().optional(),
});

export async function initiateDonation(
  formData: FormData
): Promise<ActionResult & { authorizationUrl?: string }> {
  const ip = await getActionIp();
  if (!rateLimit(`donate:${ip}`, 8, 60_000).ok) return { ok: false, message: RATE_LIMIT_MESSAGE };

  const raw = Object.fromEntries(formData);
  const parsed = donationSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please check the donation amount and details." };

  const session = await getServerSession(authOptions);
  const reference = generateReference("DON");
  const { anonymous, corporate, initiativeId, ...rest } = parsed.data;

  await prisma.donation.create({
    data: {
      ...rest,
      reference,
      anonymous: !!anonymous,
      corporate: !!corporate,
      initiativeId: initiativeId || null,
      userId: session?.user?.id ?? null,
      status: "PENDING",
    },
  });

  if (session?.user?.id && parsed.data.frequency === "MONTHLY") {
    await prisma.recurringDonation.create({
      data: {
        userId: session.user.id,
        initiativeId: initiativeId || null,
        amount: parsed.data.amount,
        status: "ACTIVE",
      },
    });
  }

  if (parsed.data.method === "BANK_TRANSFER") {
    return {
      ok: true,
      message: "Reference generated. Use it when you make your bank transfer — see the account details on this page.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const result = await initializePaystackTransaction({
    email: parsed.data.donorEmail,
    amountGHS: parsed.data.amount,
    reference,
    callbackUrl: `${siteUrl}/donate/thank-you?ref=${reference}`,
  });

  if (!result.ok) return { ok: false, message: result.reason };
  return { ok: true, authorizationUrl: result.authorizationUrl };
}
