import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReceiptPdf } from "@/lib/pdf";

export async function GET(_req: Request, { params }: { params: { donationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const donation = await prisma.donation.findUnique({
    where: { id: params.donationId },
    include: { initiative: true },
  });

  if (!donation || donation.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdfBytes = await generateReceiptPdf({
    reference: donation.reference,
    donorName: donation.donorName,
    donorEmail: donation.donorEmail,
    amount: Number(donation.amount),
    currency: donation.currency,
    method: donation.method,
    createdAt: donation.createdAt,
    initiativeTitle: donation.initiative?.title,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${donation.reference}.pdf"`,
    },
  });
}
