import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCertificatePdf } from "@/lib/pdf";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const agg = await prisma.volunteerHour.aggregate({
    where: { userId: session.user.id, approved: true },
    _sum: { hours: true },
  });
  const hours = agg._sum.hours ?? 0;
  if (hours <= 0) return NextResponse.json({ error: "No approved volunteer hours yet" }, { status: 400 });

  const pdfBytes = await generateCertificatePdf({
    name: session.user.name ?? "Volunteer",
    hours,
    issueDate: new Date(),
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-of-service.pdf"`,
    },
  });
}
