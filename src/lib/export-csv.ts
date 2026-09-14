"use client";

export function downloadCsv(filename: string, rows: (string | number)[][]): void {
  if (typeof window === "undefined") return;

  const csvContent = rows
    .map((e) =>
      e
        .map((val) => {
          const str = String(val ?? "").replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
