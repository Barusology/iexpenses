import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { computeAnalyticsSummary } from "@/lib/analytics";
import StatCard from "@/components/StatCard";
import { formatMoney, formatShort } from "@/lib/currency";
import { categoryMeta, catColor, withAlpha } from "@/lib/categories";
import { useChartTheme, tooltipShape, bucketLabel } from "@/lib/chartTheme";
import {
  TrendingDown, Wallet, PieChart as PieIcon, TrendingUp, Receipt, ArrowUpRight
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, Area, AreaChart, CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";
import {
  Stagger, Reveal, SectionHeading, Fade, EASE_CINEMATIC,
} from "@/components/motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { theme, brand, ink1, gridStroke, cursorFill, areaFrom, areaTo } = useChartTheme();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('expenses').select('*');
      if (error) throw error;
      const summaryData = computeAnalyticsSummary(data, "monthly", user?.currency || "INR");
      setSummary(summaryData);
    } catch (e) {
      console.error("Failed to load dashboard summary:", e);
    } finally {
      setLoading(false);
    }
  }, [user?.currency]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setInterval(load, 30000); // refresh every 30s to reflect new expenses
    return () => clearInterval(t);
  }, [load]);

  const cur = user?.currency || "INR";
  const money = (v) => formatMoney(v, cur);
  const total = summary?.total_all_time || 0;
  const monthTotal = summary?.current_period_total || 0;
  const txnCount = summary?.transaction_count || 0;
  const avg = txnCount ? total / txnCount : 0;
  const topCat = summary?.category_breakdown?.[0];
  const weekTotal = (summary?.weekly_bars || []).reduce((a, b) => a + b.amount, 0);

  const tip = (f) => tooltipShape(cur, f);

  return (
    <div data-testid="dashboard-page" className="relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <SectionHeading
          kicker="/ Overview"
          title={<>Hey {user?.name?.split(" ")[0] || "there"} —</>}
          subtitle="this is where your money went."
          right={
            <Link
              to="/transactions"
              data-testid="dashboard-view-all-link"
              className="group flex items-center gap-1 text-sm text-ink-2 hover:text-ink-1 transition-colors"
            >
              View all transactions
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
        />
      </div>

      {/* Stat bento */}
      <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8" delay={0.18}>
        <Reveal>
          <StatCard
            testid="stat-month-total"
            label="This month"
            value={monthTotal}
            format={money}
            sub={`${summary?.recent?.length || 0} recent entries`}
            accent={brand}
            icon={TrendingDown}
          />
        </Reveal>
        <Reveal>
          <StatCard
            testid="stat-all-time"
            label="All time spent"
            value={total}
            format={money}
            sub={`${txnCount} total expenses`}
            accent={ink1}
            icon={Wallet}
          />
        </Reveal>
        <Reveal>
          <StatCard
            testid="stat-avg-expense"
            label="Avg expense"
            value={avg}
            format={money}
            sub="per transaction"
            accent={theme === "light" ? "#7A5F00" : "#FAFF00"}
            icon={PieIcon}
          />
        </Reveal>
        <Reveal>
          <StatCard
            testid="stat-top-category"
            label="Top category"
            text={topCat?.name || "—"}
            sub={topCat ? money(topCat.amount) : ""}
            accent={catColor(topCat, theme) || (theme === "light" ? "#C41E49" : "#FF3366")}
            icon={TrendingUp}
          />
        </Reveal>
      </Stagger>

      {/* Charts row */}
      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4" delay={0.1}>
        <Reveal className="lg:col-span-1">
          <Panel testid="pie-chart-panel" className="p-6 h-full">
            <PanelHead kicker="Category split" title="Where it goes" />
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={(summary?.category_breakdown || []).slice(0, 6)}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    strokeWidth={0}
                    animationDuration={900}
                    animationBegin={150}
                  >
                    {(summary?.category_breakdown || []).map((c) => (
                      <Cell key={c.id} fill={catColor(c, theme)} stroke="var(--surface-1)" />
                    ))}
                  </Pie>
                  <Tooltip {...tip((v) => money(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {(summary?.category_breakdown || []).slice(0, 5).map((c, i) => (
                <motion.div
                  key={c.id}
                  className="flex items-center justify-between text-xs"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.45, ease: EASE_CINEMATIC }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: catColor(c, theme) }} />
                    <span className="text-ink-2">{c.name}</span>
                  </div>
                  <span className="font-mono-tab text-ink-1">{money(c.amount)}</span>
                </motion.div>
              ))}
              {(!summary?.category_breakdown || summary.category_breakdown.length === 0) && (
                <div className="text-xs text-ink-3 text-center py-4">No expenses yet</div>
              )}
            </div>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-2">
          <Panel testid="weekly-bar-panel" className="p-6 h-full">
            <PanelHead
              kicker="Last 7 days"
              title="Daily velocity"
              right={
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">Week total</div>
                  <div className="font-mono-tab text-lg text-ink-1">{money(weekTotal)}</div>
                </div>
              }
            />
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={summary?.weekly_bars || []}>
                  <CartesianGrid strokeDasharray="2 4" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatShort(v, cur)} width={60} />
                  <Tooltip {...tip((v) => money(v))} cursor={{ fill: cursorFill }} />
                  <Bar dataKey="amount" fill={ink1} radius={0} animationDuration={850} animationBegin={250} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>
      </Stagger>

      {/* Trend line chart */}
      <Fade delay={0.2} className="mt-4">
        <Panel testid="trend-line-panel" className="p-6">
          <PanelHead kicker="Monthly trend" title="Spending over time" />
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={summary?.trend || []}>
                <defs>
                  <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#lineFill)"
                  animationDuration={1200}
                  animationBegin={200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </Fade>

      {/* Recent expenses */}
      <Fade delay={0.3} className="mt-4">
        <Panel testid="recent-expenses-panel" className="p-6">
          <PanelHead
            kicker="Recent"
            title="Latest transactions"
            right={
              <Link to="/transactions" className="text-xs hover:underline" style={{ color: "var(--brand)" }}>
                See all →
              </Link>
            }
          />
          <Stagger className="divide-y divide-hairline-faint" delay={0.05}>
            {(summary?.recent || []).map((e) => {
                const meta = categoryMeta(e.category);
                const Icon = meta.icon;
                const color = catColor(meta, theme);
                return (
                  <Reveal key={e.id}>
                    <div
                      data-testid={`recent-row-${e.id}`}
                      className="flex items-center justify-between py-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg grid place-items-center border transition-transform group-hover:scale-105"
                          style={{ background: withAlpha(color, 0.12), borderColor: withAlpha(color, 0.3), color }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ink-1">{e.merchant || e.note || meta.name}</div>
                          <div className="text-[11px] text-ink-3 font-mono-tab">
                            {new Date(e.date).toLocaleDateString()} · {meta.name}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono-tab text-sm font-medium" style={{ color: "var(--negative)" }}>
                        − {money(e.amount)}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
          </Stagger>
          {(!summary?.recent || summary.recent.length === 0) && !loading && (
            <div className="text-sm text-ink-3 py-10 text-center">
              <Receipt className="w-6 h-6 mx-auto mb-2" />
              No expenses yet. Add your first one with the button above.
            </div>
          )}
        </Panel>
      </Fade>
    </div>
  );
}

/* ---------- local panel primitives ---------- */

function Panel({ children, className = "", testid }) {
  return (
    <div
      data-testid={testid}
      className={`relative rounded-2xl border border-hairline bg-surface-1 theme-fade overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

function PanelHead({ kicker, title, right }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">{kicker}</div>
        <div className="font-display text-lg font-bold text-ink-1">{title}</div>
      </div>
      {right}
    </div>
  );
}
