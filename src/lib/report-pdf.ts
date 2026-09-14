import { jsPDF } from "jspdf";
import type { SurveyReport } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { labelize } from "@/types";

export function downloadReportPdf(report: SurveyReport & { source?: "seed" | "local" }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("The Citizen Project — Community Survey Report", margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("South Tongu District, Volta Region, Ghana · Community Map submission", margin, y);
  y += 24;
  doc.setTextColor(0);

  const field = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(label.toUpperCase(), margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(value || "—", 495);
    doc.text(lines, margin, y);
    y += lines.length * 15 + 12;
  };

  field("Report title", report.title);
  field("Category", labelize(report.category));
  field("Community / Town", `${report.community}, ${report.town}`);
  field(
    "Coordinates",
    report.latitude != null && report.longitude != null
      ? `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`
      : "Not captured (resolved from community name)"
  );
  field("Priority / Urgency", `${labelize(report.priority)} / ${labelize(report.urgency)}`);
  field("Status", labelize(report.status));
  field("Reported", formatDate(report.createdAt));
  field("Description", report.description);
  if (report.suggestedSolution) field("Suggested solution", report.suggestedSolution);
  field(
    "Reporter",
    report.anonymous
      ? "Anonymous"
      : [report.reporterName, report.phone, report.email].filter(Boolean).join(" · ") || "Not provided"
  );
  field(
    "Source",
    report.source === "local"
      ? "Submitted from this device — not yet synced to a shared database."
      : "Seed/demo dataset."
  );

  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text("Generated from thecitizenproject.org — demo data, for illustration only.", margin, 800);

  const safeTitle = report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`citizen-project-report-${safeTitle || report.id}.pdf`);
}
