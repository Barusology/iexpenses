import React from "react";
import { SpotlightCard, CountUp } from "@/components/motion";

/**
 * Bento stat tile. Pass `value` + `format` for a number that ticks up, or `text`
 * for a string metric (e.g. the top category name).
 */
export default function StatCard({
  label,
  value,
  format,
  text,
  sub,
  accent = "var(--brand)",
  icon: Icon,
  testid,
}) {
  return (
    <SpotlightCard testid={testid} accent={accent} rule className="p-6 card-hover h-full">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">
          {label}
        </div>
        {Icon && (
          <span
            className="w-8 h-8 rounded-lg grid place-items-center border border-hairline transition-colors"
            style={{ color: accent }}
          >
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>

      <div
        className="mt-4 text-3xl font-semibold leading-none"
        style={{ color: accent }}
      >
        {format ? <CountUp value={value} format={format} /> : <span className="font-mono-tab">{text ?? value}</span>}
      </div>

      {sub && (
        <div className="mt-2 text-xs text-ink-3">{sub}</div>
      )}
    </SpotlightCard>
  );
}
