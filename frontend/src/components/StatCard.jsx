import React from "react";

export default function StatCard({ label, value, sub, accent = "#FFFFFF", icon: Icon, testid }) {
  return (
    <div
      data-testid={testid}
      className="relative rounded-xl border border-white/10 bg-[var(--surface-1)] p-6 card-hover overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: accent }} />
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">{label}</div>
        {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
      </div>
      <div className="mt-3 font-mono-tab text-3xl font-semibold tracking-tight" style={{ color: accent }}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}
