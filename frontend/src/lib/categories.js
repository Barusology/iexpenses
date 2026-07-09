import {
  Utensils, Car, ShoppingBag, Receipt, Film, HeartPulse,
  ShoppingCart, Plane, BookOpen, MoreHorizontal
} from "lucide-react";

export const CATEGORIES = [
  { id: "food", name: "Food & Dining", icon: Utensils, color: "#00FF9D" },
  { id: "transport", name: "Transport", icon: Car, color: "#5EEAD4" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "#FAFF00" },
  { id: "bills", name: "Bills & Utilities", icon: Receipt, color: "#FF3366" },
  { id: "entertainment", name: "Entertainment", icon: Film, color: "#A78BFA" },
  { id: "health", name: "Health", icon: HeartPulse, color: "#F97316" },
  { id: "groceries", name: "Groceries", icon: ShoppingCart, color: "#22D3EE" },
  { id: "travel", name: "Travel", icon: Plane, color: "#F472B6" },
  { id: "education", name: "Education", icon: BookOpen, color: "#60A5FA" },
  { id: "other", name: "Other", icon: MoreHorizontal, color: "#A1A1AA" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export function categoryMeta(id) {
  return CATEGORY_MAP[id] || CATEGORY_MAP["other"];
}
