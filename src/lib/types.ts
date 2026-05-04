export type Category =
  | "Income"
  | "Housing"
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Shopping"
  | "Health"
  | "Utilities"
  | "Savings"
  | "Other";

export const CATEGORIES: Category[] = [
  "Income",
  "Housing",
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Utilities",
  "Savings",
  "Other",
];

export const EXPENSE_CATEGORIES: Category[] = CATEGORIES.filter(
  (c) => c !== "Income",
);

export type Transaction = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  category: Category;
  amount: number; // positive number; sign determined by category
  note: string;
};

export type Budget = Partial<Record<Category, number>>;

export const CATEGORY_COLORS: Record<Category, string> = {
  Income: "#15803d",
  Housing: "#9a3412",
  Food: "#c2410c",
  Transport: "#ea580c",
  Entertainment: "#b45309",
  Shopping: "#a16207",
  Health: "#7c3aed",
  Utilities: "#1d4ed8",
  Savings: "#0e7490",
  Other: "#52525b",
};
