import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { formatMoney, formatShort } from "@/lib/currency";
import { catColor } from "@/lib/categories";
import { useChartTheme, tooltipShape, bucketLabel } from "@/lib/chartTheme";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, AreaChart, Area, CartesianGrid,
} from "recharts";
import { SectionHeading, Stagger, Reveal, Fade, EASE_CINEMATIC } from "@/components/motion";

import { supabase } from "@/lib/supabase";
import { computeAnalyticsSummary } from "@/lib/analytics";

const PERIODS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export default function Analytics() {
  const { user } = useAuth();
  const { theme, brand, gridStroke, cursorFill, areaFrom, areaTo } = useChartTheme();
  const [period, setPeriod] = useState("monthly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p) => {
    setLoading(true);
    try {
      const { data: rawExpenses, error } = await supabase.from('expenses').select('*');
      if (error) throw error;
      const summaryData = computeAnalyticsSummary(rawExpenses, p, user?.currency || "INR");
      setData(summaryData);
    } catch (e) {
      console.error("Failed to load analytics summary:", e);
    } finally {
      setLoading(false);
    }
  }, [user?.currency]);

  useEffect(() => { load(period); }, [period, load]);

  const cur = user?.currency || "INR";
  const money = (v) => formatMoney(v, cur);
  const tip = (f) => tooltipShape(cur, f);
  const catData = data?.category_breakdown || [];
  const trend = data?.trend || [];
  const catTotal = catData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div data-testid="analytics-page" className="relative">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <SectionHeading
          kicker="/ Analytics"
          title="Signal, not noise."
          subtitle={
            <>
              {data?.transaction_count || 0} transactions · Lifetime{" "}
              <span className="text-ink-1 font-mono-tab">{money(data?.total_all_time || 0)}</span>
            </>
          }
        />

        {/* Period toggle — the pill slides between options via layoutId */}
        <Fade delay={0.3}>
          <div className="inline-flex rounded-full border border-hairline bg-surface-1 p-1 self-end theme-fade" data-testid="period-toggle">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                data-testid={`period-${p.id}`}
                className={`relative px-4 py-1.5 text-xs uppercase tracking-widest font-mono-tab rounded-full transition-colors ${
                  period === p.id ? "text-brand-fg" : "text-ink-2 hover:text-ink-1"
                }`}
              >
                {period === p.id && (
                  <motion.span
                    layoutId="period-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--ink-1)" }}
                    transition={{ duration: 0.36, ease: EASE_CINEMATIC }}
                  />
                )}
                <span className="relative z-10">{p.label}</span>
              </button>
            ))}
          </div>
        </Fade>
      </div>

      {/* Trend area chart */}
      <Fade delay={0.18} className="mt-8">
        <div className="rounded-2xl border border-hairline bg-surface-1 p-6 theme-fade" data-testid="analytics-trend">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">{period} trend</div>
              <div className="font-display text-xl font-bold text-ink-1">Spending curve</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">Latest period</div>
              <div className="font-mono-tab text-lg text-ink-1">{money(data?.current_period_total || 0)}</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={brand} stopOpacity={areaFrom} />
                    <stop offset="100%" stopColor={brand} stopOpacity={areaTo} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} tickFormatter={bucketLabel} minTickGap={18} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatShort(v, cur)} width={60} />
                <Tooltip {...tip((v) => money(v))} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={brand}
                  strokeWidth={2}
                  fill="url(#areaFill)"
                  animationDuration={1200}
                  animationBegin={150}
                  key={`${period}-${theme}`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Fade>

      {/* Pie + Bar */}
      <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4" delay={0.08}>
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 theme-fade h-full" data-testid="analytics-pie">
            <div className="mb-2">
              <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">Category share</div>
              <div className="font-display text-xl font-bold text-ink-1">Where it went</div>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={catData}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    stroke="var(--surface-1)"
                    strokeWidth={2}
                    animationDuration={900}
                  >
                    {catData.map((c) => <Cell key={c.id} fill={catColor(c, theme)} />)}
                  </Pie>
                  <Tooltip {...tip((v) => money(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 theme-fade h-full" data-testid="analytics-bar">
            <div className="mb-2">
              <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">Category totals</div>
              <div className="font-display text-xl font-bold text-ink-1">Ranked by amount</div>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => formatShort(v, cur)} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={110} />
                  <Tooltip {...tip((v) => money(v))} cursor={{ fill: cursorFill }} />
                  <Bar dataKey="amount" radius={0} animationDuration={850}>
                    {catData.map((c) => <Cell key={c.id} fill={catColor(c, theme)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>
      </Stagger>

      {/* Category detail list */}
      <Fade delay={0.2} className="mt-4">
        <div className="rounded-2xl border border-hairline bg-surface-1 p-6 theme-fade" data-testid="analytics-category-list">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">Breakdown</div>
            <div className="font-display text-xl font-bold text-ink-1">By category</div>
          </div>
          <div className="divide-y divide-hairline-faint">
            {catData.map((c, i) => {
              const pct = catTotal ? (c.amount / catTotal) * 100 : 0;
              const color = catColor(c, theme);
              return (
                <motion.div
                  key={c.id}
                  className="py-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.45, ease: EASE_CINEMATIC }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-sm text-ink-1">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-ink-3 font-mono-tab">{pct.toFixed(1)}%</span>
                      <span className="font-mono-tab text-sm text-ink-1">{money(c.amount)}</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--chart-track)" }}>
                    <motion.div
                      className="h-full"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: EASE_CINEMATIC }}
                    />
                  </div>
                </motion.div>
              );
            })}
            {catData.length === 0 && !loading && (
              <div className="text-sm text-ink-3 text-center py-8">No data for this period yet.</div>
            )}
          </div>
        </div>
      </Fade>
    </div>
  );
}
