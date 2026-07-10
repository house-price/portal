// Client-side data export helpers (CSV via Blob, PDF via jsPDF).
// Per the task, export is a frontend responsibility, keeping the Java service lean.
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Trigger a browser download of some text content
function download(filename: string, content: string, mime: string) {
    const blob = new Blob([content], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Quote a CSV cell when it contains a delimiter, quote, or newline (RFC 4180)
function csvCell(v: unknown): string {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

// Export an array of rows to CSV. `columns` = [key, header] pairs.
export function exportCsv<T>(
    filename: string,
    rows: T[],
    columns: [keyof T, string][],
) {
    const header = columns.map(([, h]) => csvCell(h)).join(",");
    const body = rows
        .map((r) => columns.map(([k]) => csvCell(r[k])).join(","))
        .join("\n");
    download(filename, `${header}\n${body}`, "text/csv;charset=utf-8;");
}

// Export rows to a simple PDF table
export function exportPdf<T>(
    filename: string,
    title: string,
    rows: T[],
    columns: [keyof T, string][],
) {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    autoTable(doc, {
        startY: 22,
        head: [columns.map(([, h]) => h)],
        body: rows.map((r) => columns.map(([k]) => String(r[k] ?? ""))),
    });
    doc.save(filename);
}
