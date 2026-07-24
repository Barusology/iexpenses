import { CATEGORIES } from "./categories";

function getBucketStart(dateStr, period) {
  const dt = new Date(dateStr);
  if (period === "daily") {
    return dt.toISOString().split("T")[0];
  } else if (period === "weekly") {
    // Start of week (Monday)
    const day = dt.getDay();
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(dt.setDate(diff));
    return monday.toISOString().split("T")[0];
  } else if (period === "monthly") {
    return dt.toISOString().slice(0, 7) + "-01";
  } else if (period === "yearly") {
    return dt.getFullYear().toString();
  }
  return dt.toISOString().split("T")[0];
}

export function computeAnalyticsSummary(expenses, period = "monthly", userCurrency = "INR") {
  const docs = expenses || [];
  const total = docs.reduce((sum, d) => sum + Number(d.amount), 0);

  const now = new Date();
  const curBucket = getBucketStart(now.toISOString(), period);
  const byBucket = {};
  const byCategory = {};

  for (const d of docs) {
    const amt = Number(d.amount);
    const b = getBucketStart(d.date, period);
    byBucket[b] = (byBucket[b] || 0) + amt;
    if (b === curBucket) {
      byCategory[d.category] = (byCategory[d.category] || 0) + amt;
    }
  }

  // Trend series: last 12 buckets
  const series = Object.entries(byBucket).sort((a, b) => a[0].localeCompare(b[0]));
  const trend = series.slice(-12).map(([bucket, amount]) => ({
    bucket,
    amount: Math.round(amount * 100) / 100
  }));

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map(cat => {
    const amt = byCategory[cat.id] || 0;
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      amount: Math.round(amt * 100) / 100
    };
  })
  .filter(c => c.amount > 0)
  .sort((a, b) => b.amount - a.amount);

  const currentPeriodTotal = byBucket[curBucket] || 0;

  // Recent expenses
  const recent = [...docs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Weekly bar (last 7 days)
  const weeklyBars = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(now.getDate() - i);
    const key = day.toISOString().split("T")[0];
    let totalDay = 0;
    for (const d of docs) {
      if (d.date.split("T")[0] === key) {
        totalDay += Number(d.amount);
      }
    }
    weeklyBars.push({
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      date: key,
      amount: Math.round(totalDay * 100) / 100
    });
  }

  return {
    total_all_time: Math.round(total * 100) / 100,
    current_period_total: Math.round(currentPeriodTotal * 100) / 100,
    period,
    trend,
    category_breakdown: categoryBreakdown,
    recent,
    weekly_bars: weeklyBars,
    transaction_count: docs.length,
    currency: userCurrency,
  };
}
