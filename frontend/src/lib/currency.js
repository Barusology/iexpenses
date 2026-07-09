export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

export function currencySymbol(code = "INR") {
  return (CURRENCIES.find((c) => c.code === code) || CURRENCIES[0]).symbol;
}

export function formatMoney(amount, code = "INR", opts = {}) {
  const num = Number(amount || 0);
  const locale = code === "INR" ? "en-IN" : "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      maximumFractionDigits: opts.decimals ?? 2,
      minimumFractionDigits: opts.decimals ?? 2,
    }).format(num);
  } catch {
    return `${currencySymbol(code)}${num.toFixed(2)}`;
  }
}

export function formatShort(amount, code = "INR") {
  const num = Number(amount || 0);
  const sym = currencySymbol(code);
  if (num >= 1_00_00_000 && code === "INR") return `${sym}${(num / 1_00_00_000).toFixed(2)}Cr`;
  if (num >= 1_00_000 && code === "INR") return `${sym}${(num / 1_00_000).toFixed(2)}L`;
  if (num >= 1_000_000) return `${sym}${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${sym}${(num / 1_000).toFixed(2)}K`;
  return `${sym}${num.toFixed(0)}`;
}
