import {
  Utensils, Car, ShoppingBag, Receipt, Film, HeartPulse,
  ShoppingCart, Plane, BookOpen, MoreHorizontal
} from "lucide-react";

/**
 * Each category carries two hexes locked to the same hue: `dark` is the neon
 * original for the black canvas, `light` is the same hue graded darker so it
 * holds WCAG AA on warm paper. Neon on white reads washed, so light mode can't
 * reuse these values.
 */
export const CATEGORIES = [
  { id: "food",          name: "Food & Dining",    icon: Utensils,     dark: "#00FF9D", light: "#007A50" },
  { id: "transport",     name: "Transport",        icon: Car,          dark: "#5EEAD4", light: "#0F7A78" },
  { id: "shopping",      name: "Shopping",         icon: ShoppingBag,  dark: "#FAFF00", light: "#7A5F00" },
  { id: "bills",         name: "Bills & Utilities",icon: Receipt,      dark: "#FF3366", light: "#C41E49" },
  { id: "entertainment", name: "Entertainment",    icon: Film,         dark: "#A78BFA", light: "#6D4AB8" },
  { id: "health",        name: "Health",           icon: HeartPulse,   dark: "#F97316", light: "#A8480A" },
  { id: "groceries",     name: "Groceries",        icon: ShoppingCart, dark: "#22D3EE", light: "#0A6E80" },
  { id: "travel",        name: "Travel",           icon: Plane,        dark: "#F472B6", light: "#A83070" },
  { id: "education",     name: "Education",        icon: BookOpen,     dark: "#60A5FA", light: "#1D5FBF" },
  { id: "other",         name: "Other",            icon: MoreHorizontal,dark: "#A1A1AA", light: "#6B6A72" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export function categoryMeta(id) {
  return CATEGORY_MAP[id] || CATEGORY_MAP["other"];
}

/** Resolve the right hex for the active theme. Accepts a category or breakdown row. */
export function catColor(item, theme) {
  if (!item) return theme === "light" ? "#6B6A72" : "#A1A1AA";
  return theme === "light" ? item.light : item.dark;
}

/** #RRGGBB -> rgba() for icon chips and soft fills, replacing the old `${hex}18` hack. */
export function withAlpha(hex, alpha) {
  const h = (hex || "").replace("#", "");
  if (h.length !== 6) return hex;
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
