import { useTheme } from "@/context/ThemeContext";

/**
 * JS mirror of the accent tokens in index.css.
 *
 * Needed because recharts writes series colors into SVG *attributes*
 * (fill="#..."), and var() is not valid in a presentation attribute — only in
 * a CSS property. Structural colors (tooltip, grid) still come from CSS vars;
 * only the colors that land in SVG attributes are duplicated here. Keep in sync
 * with :root / html.light in index.css.
 */
export const PALETTE = {
  dark: {
    brand: "#00FF9D",
    negative: "#FF3366",
    highlight: "#FAFF00",
    ink1: "#FFFFFF",
    ink2: "#A1A1AA",
    ink3: "#71717A",
    surface1: "#0A0A0A",
    gridStroke: "rgba(255,255,255,0.06)",
    cursorFill: "rgba(255,255,255,0.05)",
    // area gradient: bright at the line, gone at the baseline
    areaFrom: 0.34,
    areaTo: 0,
  },
  light: {
    brand: "#007A50",
    negative: "#C41E49",
    highlight: "#7A5F00",
    ink1: "#17161A",
    ink2: "#55535C",
    ink3: "#7A7783",
    surface1: "#FFFFFF",
    gridStroke: "rgba(23,22,26,0.08)",
    cursorFill: "rgba(23,22,26,0.05)",
    // paper absorbs pigment, so the wash needs to start stronger and fade softer
    areaFrom: 0.26,
    areaTo: 0,
  },
};

export function useChartTheme() {
  const { theme } = useTheme();
  return { theme, ...PALETTE[theme === "light" ? "light" : "dark"] };
}

/**
 * Trend buckets arrive as YYYY-MM-DD (daily/weekly), YYYY-MM-01 (monthly) or
 * YYYY (yearly). Raw ISO strings collide on the axis, so shorten per shape.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function bucketLabel(bucket) {
  if (!bucket) return "";
  const s = String(bucket);
  const monthly = /^(\d{4})-(\d{2})-01$/.exec(s);
  if (monthly) return `${MONTHS[Number(monthly[2]) - 1]} ${monthly[1].slice(2)}`;
  const daily = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (daily) return `${MONTHS[Number(daily[2]) - 1]} ${Number(daily[3])}`;
  const yearMonth = /^(\d{4})-(\d{2})$/.exec(s);
  if (yearMonth) return `${MONTHS[Number(yearMonth[2]) - 1]} ${yearMonth[1].slice(2)}`;
  return s;
}

/**
 * Shared recharts prop bundles. `contentStyle` is intentionally absent — the
 * tooltip surface is styled by .recharts-default-tooltip in index.css so it
 * follows the theme without a hard-coded background at every call site.
 */
export function tooltipShape(cur, formatter) {
  return {
    formatter,
    labelStyle: { color: "var(--ink-3)", fontFamily: "var(--font-mono)", fontSize: 11 },
    itemStyle: { color: "var(--ink-1)", fontFamily: "var(--font-mono)", fontSize: 12 },
    wrapperStyle: { outline: "none" },
    cursor: { stroke: "var(--hairline)", strokeDasharray: "3 3" },
  };
}
