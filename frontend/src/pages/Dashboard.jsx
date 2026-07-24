import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { computeAnalyticsSummary } from "@/lib/analytics";
import StatCard from "@/components/StatCard";
import { formatMoney, formatShort } from "@/lib/currency";
import { categoryMeta } from "@/lib/categories";
import { TrendingDown, TrendingUp, Wallet, PieChart as PieIcon, Receipt, ArrowUpRight } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Area, AreaChart, CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
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
  };

  useEffect(() => { load(); }, [user?.currency]);
  useEffect(() => {
    const t = setInterval(load, 30000); // refresh every 30s to reflect new expenses
    return () => clearInterval(t);
  }, [user?.currency]);

  const cur = user?.currency || "INR";
  const total = summary?.total_all_time || 0;
  const monthTotal = summary?.current_period_total || 0;
  const txnCount = summary?.transaction_count || 0;
  const avg = txnCount ? total / txnCount : 0;

  return (
    <div className="space-y-8 fade-up" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#00FF9D] font-mono-tab">/ Overview</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tighter mt-1">
            Hey {user?.name?.split(" ")[0] || "there"} —
            <br />
            <span className="text-zinc-400">this is where your money went.</span>
          </h1>
        </div>
        <Link
          to="/transactions"
          data-testid="dashboard-view-all-link"
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
        >
          View all transactions <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          testid="stat-month-total"
          label="This month"
          value={formatMoney(monthTotal, cur)}
          sub={`${summary?.recent?.length || 0} recent entries`}
          accent="#00FF9D"
          icon={TrendingDown}
        />
        <StatCard
          testid="stat-all-time"
          label="All time spent"
          value={formatMoney(total, cur)}
          sub={`${txnCount} total expenses`}
          accent="#FFFFFF"
          icon={Wallet}
        />
        <StatCard
          testid="stat-avg-expense"
          label="Avg expense"
          value={formatMoney(avg, cur)}
          sub="per transaction"
          accent="#FAFF00"
          icon={PieIcon}
        />
        <StatCard
          testid="stat-top-category"
          label="Top category"
          value={summary?.category_breakdown?.[0]?.name || "—"}
          sub={summary?.category_breakdown?.[0] ? formatMoney(summary.category_breakdown[0].amount, cur) : ""}
          accent={summary?.category_breakdown?.[0]?.color || "#FF3366"}
          icon={TrendingUp}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie chart */}
        <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6" data-testid="pie-chart-panel">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Category split</div>
              <div className="font-display text-lg font-bold">Where it goes</div>
            </div>
          </div>
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
                >
                  {(summary?.category_breakdown || []).map((c) => (
                    <Cell key={c.id} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatMoney(v, cur)}
                  contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.15)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {(summary?.category_breakdown || []).slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-zinc-400">{c.name}</span>
                </div>
                <span className="font-mono-tab text-white">{formatMoney(c.amount, cur)}</span>
              </div>
            ))}
            {(!summary?.category_breakdown || summary.category_breakdown.length === 0) && (
              <div className="text-xs text-zinc-500 text-center py-4">No expenses yet</div>
            )}
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6 lg:col-span-2" data-testid="weekly-bar-panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Last 7 days</div>
              <div className="font-display text-lg font-bold">Daily velocity</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Week total</div>
              <div className="font-mono-tab text-lg">
                {formatMoney(
                  (summary?.weekly_bars || []).reduce((a, b) => a + b.amount, 0),
                  cur
                )}
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={summary?.weekly_bars || []}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatShort(v, cur)} width={60} />
                <Tooltip
                  formatter={(v) => formatMoney(v, cur)}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.15)" }}
                />
                <Bar dataKey="amount" fill="#FFFFFF" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend line chart */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6" data-testid="trend-line-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Monthly trend</div>
            <div className="font-display text-lg font-bold">Spending over time</div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={summary?.trend || []}>
              <defs>
                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF9D" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00FF9D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatShort(v, cur)} width={60} />
              <Tooltip
                formatter={(v) => formatMoney(v, cur)}
                contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.15)" }}
              />
              <Area type="monotone" dataKey="amount" stroke="#00FF9D" strokeWidth={2} fill="url(#lineFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent expenses */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6" data-testid="recent-expenses-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Recent</div>
            <div className="font-display text-lg font-bold">Latest transactions</div>
          </div>
          <Link to="/transactions" className="text-xs text-[#00FF9D] hover:underline">See all →</Link>
        </div>
        <div className="divide-y divide-white/10">
          {(summary?.recent || []).map((e) => {
            const meta = categoryMeta(e.category);
            const Icon = meta.icon;
            return (
              <div key={e.id} className="flex items-center justify-between py-3" data-testid={`recent-row-${e.id}`}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10"
                    style={{ background: `${meta.color}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{e.merchant || e.note || meta.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono-tab">
                      {new Date(e.date).toLocaleDateString()} · {meta.name}
                    </div>
                  </div>
                </div>
                <div className="font-mono-tab text-sm text-[#FF3366]">− {formatMoney(e.amount, e.currency || cur)}</div>
              </div>
            );
          })}
          {(!summary?.recent || summary.recent.length === 0) && !loading && (
            <div className="text-sm text-zinc-500 py-10 text-center">
              <Receipt className="w-6 h-6 mx-auto mb-2" />
              No expenses yet. Add your first one with the button above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
