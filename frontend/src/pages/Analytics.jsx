import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatMoney, formatShort } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, Legend,
} from "recharts";

const PERIODS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export default function Analytics() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("monthly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async (p) => {
    setLoading(true);
    try {
      const { data } = await api.get("/analytics/summary", { params: { period: p } });
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(period); }, [period]);

  const cur = user?.currency || "INR";
  const catData = data?.category_breakdown || [];
  const trend = data?.trend || [];

  return (
    <div className="space-y-8 fade-up" data-testid="analytics-page">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#00FF9D] font-mono-tab">/ Analytics</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tighter mt-1">
            Signal, not noise.
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            {data?.transaction_count || 0} transactions · Lifetime{" "}
            <span className="text-white font-mono-tab">{formatMoney(data?.total_all_time || 0, cur)}</span>
          </p>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-black/40 p-1" data-testid="period-toggle">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              data-testid={`period-${p.id}`}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-mono-tab rounded-full transition-colors ${
                period === p.id ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trend area chart */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6" data-testid="analytics-trend">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">
              {period} trend
            </div>
            <div className="font-display text-xl font-bold">Spending curve</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Latest period</div>
            <div className="font-mono-tab text-lg">{formatMoney(data?.current_period_total || 0, cur)}</div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF9D" stopOpacity={0.5} />
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
              <Area type="monotone" dataKey="amount" stroke="#00FF9D" strokeWidth={2} fill="url(#areaFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6" data-testid="analytics-pie">
          <div className="mb-2">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Category share</div>
            <div className="font-display text-xl font-bold">Where it went</div>
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
                  stroke="none"
                >
                  {catData.map((c) => <Cell key={c.id} fill={c.color} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => formatMoney(v, cur)}
                  contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.15)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6" data-testid="analytics-bar">
          <div className="mb-2">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Category totals</div>
            <div className="font-display text-xl font-bold">Ranked by amount</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => formatShort(v, cur)} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={110} />
                <Tooltip
                  formatter={(v) => formatMoney(v, cur)}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.15)" }}
                />
                <Bar dataKey="amount" radius={0}>
                  {catData.map((c) => <Cell key={c.id} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category detail list */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6" data-testid="analytics-category-list">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Breakdown</div>
          <div className="font-display text-xl font-bold">By category</div>
        </div>
        <div className="divide-y divide-white/5">
          {catData.map((c) => {
            const pct = data?.total_all_time ? (c.amount / data.total_all_time) * 100 : 0;
            return (
              <div key={c.id} className="py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-sm">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-mono-tab">{pct.toFixed(1)}%</span>
                    <span className="font-mono-tab text-sm">{formatMoney(c.amount, cur)}</span>
                  </div>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${Math.min(pct, 100)}%`, background: c.color }} />
                </div>
              </div>
            );
          })}
          {catData.length === 0 && (
            <div className="text-sm text-zinc-500 text-center py-8">No data for this period yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
