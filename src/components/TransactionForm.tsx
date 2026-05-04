import { useState, type FormEvent } from "react";
import { CATEGORIES, type Category, type Transaction } from "@/lib/types";
import { Button } from "./ui-kit/Button";

type Props = {
  onSubmit: (tx: Omit<Transaction, "id">) => void;
  onCancel?: () => void;
};

export function TransactionForm({ onSubmit, onCancel }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<Category>("Food");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!date) {
      setError("Date is required.");
      return;
    }
    setError(null);
    onSubmit({ date, category, amount: num, note: note.trim() });
    setAmount("");
    setNote("");
  };

  const inputCls =
    "h-9 w-full rounded-md border border-border-strong bg-surface-2 px-3 text-[13px] text-foreground placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
  const labelCls = "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputCls}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Amount (PKR)</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-subtle">
            Rs
          </span>
          <input
            type="number"
            step="1"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className={`${inputCls} pl-9 tabular-nums-feat`}
            required
          />
        </div>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Note</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional description"
          className={inputCls}
          maxLength={120}
        />
      </label>
      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-[12px] text-danger">
          {error}
        </div>
      )}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Add transaction</Button>
      </div>
    </form>
  );
}
