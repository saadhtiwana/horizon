import { useRef, useState } from "react";
import { Upload, FileWarning, CheckCircle2 } from "lucide-react";
import { parseCSV } from "@/lib/csv";
import type { Transaction } from "@/lib/types";
import { Button } from "./ui-kit/Button";

type Props = {
  onImport: (rows: Omit<Transaction, "id">[]) => void;
};

export function CsvImport({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    setErrors([]);
    setSuccess(null);
    try {
      const text = await file.text();
      const result = parseCSV(text);
      if (result.rows.length === 0) {
        setErrors(
          result.errors.length > 0
            ? result.errors
            : ["No valid transactions found in file."],
        );
      } else {
        onImport(result.rows);
        setSuccess(
          `Imported ${result.rows.length} transactions${
            result.errors.length > 0 ? ` (${result.errors.length} rows skipped)` : ""
          }.`,
        );
        if (result.errors.length > 0) setErrors(result.errors.slice(0, 5));
      }
    } catch (e) {
      setErrors([(e as Error).message || "Failed to read file."]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-dashed border-border-strong bg-surface-2/40 p-6 text-center">
        <Upload className="mx-auto text-subtle" size={20} />
        <h3 className="mt-3 text-[13px] font-semibold text-foreground">Import from CSV</h3>
        <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-muted-foreground">
          Required columns:{" "}
          <code className="rounded bg-surface-3 px-1 py-0.5 text-[11px] text-foreground">
            date, category, amount
          </code>
          . Optional:{" "}
          <code className="rounded bg-surface-3 px-1 py-0.5 text-[11px] text-foreground">
            note
          </code>
          .
        </p>
        <div className="mt-4">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Parsing..." : "Choose file"}
          </Button>
        </div>
      </div>

      {success && (
        <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-[12px] text-success">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-[12px] text-danger">
          <div className="flex items-center gap-2 font-medium">
            <FileWarning size={14} />
            <span>Some rows could not be parsed</span>
          </div>
          <ul className="mt-2 space-y-0.5 pl-1">
            {errors.map((err, i) => (
              <li key={i} className="text-[11px] leading-relaxed text-danger/90">
                · {err}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
