import type { Category, Transaction } from "./types";
import { CATEGORIES } from "./types";

export type CSVParseResult = {
  rows: Omit<Transaction, "id">[];
  errors: string[];
};

function splitCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function normalizeCategory(input: string): Category | null {
  const lower = input.trim().toLowerCase();
  const found = CATEGORIES.find((c) => c.toLowerCase() === lower);
  return found ?? null;
}

function normalizeDate(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  // Accept YYYY-MM-DD or MM/DD/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const mm = m[1].padStart(2, "0");
    const dd = m[2].padStart(2, "0");
    return `${m[3]}-${mm}-${dd}`;
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return null;
}

export function parseCSV(text: string): CSVParseResult {
  const rows: Omit<Transaction, "id">[] = [];
  const errors: string[] = [];

  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows, errors: ["File is empty."] };
  }

  const header = splitCSVLine(lines[0]).map((h) => h.toLowerCase());
  const dateIdx = header.indexOf("date");
  const categoryIdx = header.indexOf("category");
  const amountIdx = header.indexOf("amount");
  const noteIdx = header.indexOf("note");

  if (dateIdx === -1 || categoryIdx === -1 || amountIdx === -1) {
    return {
      rows,
      errors: [
        "Missing required columns. Header must contain: date, category, amount (note optional).",
      ],
    };
  }

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i]);
    const dateRaw = cells[dateIdx] ?? "";
    const catRaw = cells[categoryIdx] ?? "";
    const amtRaw = cells[amountIdx] ?? "";
    const noteRaw = noteIdx >= 0 ? (cells[noteIdx] ?? "") : "";

    const date = normalizeDate(dateRaw);
    const category = normalizeCategory(catRaw);
    const amount = Number(amtRaw.replace(/[$,]/g, ""));

    if (!date) {
      errors.push(`Row ${i + 1}: invalid date "${dateRaw}".`);
      continue;
    }
    if (!category) {
      errors.push(
        `Row ${i + 1}: unknown category "${catRaw}". Allowed: ${CATEGORIES.join(", ")}.`,
      );
      continue;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push(`Row ${i + 1}: invalid amount "${amtRaw}".`);
      continue;
    }

    rows.push({ date, category, amount, note: noteRaw });
  }

  return { rows, errors };
}
