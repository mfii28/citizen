import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { formatGHS, formatDate } from "@/lib/utils";

async function basePdf(title: string) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 420]); // A5 landscape-ish
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const ocean = rgb(0.031, 0.114, 0.149); // ~#081D26
  const gold = rgb(0.910, 0.635, 0.2);

  page.drawRectangle({ x: 0, y: 390, width: 595, height: 30, color: ocean });
  page.drawText("THE CITIZEN PROJECT", { x: 24, y: 399, size: 12, font: bold, color: rgb(1, 1, 1) });
  page.drawText(title, { x: 24, y: 340, size: 20, font: bold, color: ocean });
  page.drawLine({ start: { x: 24, y: 330 }, end: { x: 571, y: 330 }, thickness: 2, color: gold });

  return { doc, page, bold, regular, ocean };
}

export async function generateReceiptPdf(donation: {
  reference: string;
  donorName: string | null;
  donorEmail: string;
  amount: number;
  currency: string;
  method: string;
  createdAt: Date;
  initiativeTitle?: string | null;
}) {
  const { doc, page, bold, regular, ocean } = await basePdf("Donation Receipt");

  const lines = [
    ["Receipt reference", donation.reference],
    ["Donor", donation.donorName ?? "Anonymous supporter"],
    ["Amount", `${formatGHS(donation.amount)} (${donation.currency})`],
    ["Method", donation.method.replace("_", " ")],
    ["Date", formatDate(donation.createdAt)],
    ["Designation", donation.initiativeTitle ?? "General fund"],
  ];

  let y = 290;
  for (const [label, value] of lines) {
    page.drawText(label, { x: 24, y, size: 11, font: bold, color: ocean });
    page.drawText(String(value), { x: 220, y, size: 11, font: regular, color: ocean });
    y -= 26;
  }

  page.drawText(
    "Thank you for supporting civic responsibility and community development in South Tongu District.",
    { x: 24, y: 60, size: 9, font: regular, color: rgb(0.3, 0.4, 0.45) }
  );

  return doc.save();
}

export async function generateCertificatePdf(params: { name: string; hours: number; issueDate: Date }) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 420]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const ocean = rgb(0.031, 0.114, 0.149);
  const gold = rgb(0.910, 0.635, 0.2);

  page.drawRectangle({ x: 0, y: 0, width: 595, height: 420, borderColor: gold, borderWidth: 6 });
  page.drawText("CERTIFICATE OF VOLUNTEER SERVICE", { x: 90, y: 330, size: 20, font: bold, color: ocean });
  page.drawText("The Citizen Project — South Tongu District", { x: 150, y: 305, size: 11, font: regular, color: ocean });

  page.drawText("This certifies that", { x: 230, y: 250, size: 11, font: regular, color: rgb(0.3, 0.4, 0.45) });
  page.drawText(params.name, { x: 595 / 2 - (bold.widthOfTextAtSize(params.name, 26) / 2), y: 210, size: 26, font: bold, color: ocean });
  page.drawText(
    `has contributed ${params.hours} approved volunteer hour${params.hours === 1 ? "" : "s"} in service of civic`,
    { x: 90, y: 175, size: 11, font: regular, color: ocean }
  );
  page.drawText("responsibility and community development.", { x: 90, y: 158, size: 11, font: regular, color: ocean });
  page.drawText(`Issued ${formatDate(params.issueDate)}`, { x: 24, y: 30, size: 9, font: regular, color: rgb(0.3, 0.4, 0.45) });

  return doc.save();
}
