import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Paystack signs every webhook with HMAC-SHA512 of the raw body, using your
// secret key. Verifying this (rather than trusting the payload blindly) is
// what stops anyone from POSTing a fake "payment successful" event.
export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  const signatureBuffer = signature ? Buffer.from(signature) : null;
  const expectedBuffer = Buffer.from(expected);
  const validSignature =
    signatureBuffer && signatureBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const reference: string | undefined = event?.data?.reference;

  if (reference && event.event === "charge.success") {
    await prisma.donation.updateMany({ where: { reference }, data: { status: "SUCCESS" } });
  } else if (reference && (event.event === "charge.failed" || event.event === "charge.dispute.create")) {
    await prisma.donation.updateMany({ where: { reference }, data: { status: "FAILED" } });
  }

  return NextResponse.json({ received: true });
}
