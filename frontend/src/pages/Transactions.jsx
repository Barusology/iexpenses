import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/currency";
import { CATEGORIES, categoryMeta, catColor, withAlpha } from "@/lib/categories";
import { useChartTheme } from "@/lib/chartTheme";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2, Pencil, Receipt, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ExpenseModal from "@/components/ExpenseModal";
import { CountUp, SectionHeading, Fade, EASE_CINEMATIC } from "@/components/motion";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { supabase } from "@/lib/supabase";

export default function Transactions() {
  const { user } = useAuth();
  const { theme } = useChartTheme();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [receiptView, setReceiptView] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase.from('expenses').select('*');

      if (category && category !== "all") {
        queryBuilder = queryBuilder.eq('category', category);
      }
      if (start) {
        queryBuilder = queryBuilder.gte('date', start + "T00:00:00+00:00");
      }
      if (end) {
        queryBuilder = queryBuilder.lte('date', end + "T23:59:59.999999+00:00");
      }

      const { data, error } = await queryBuilder.order('date', { ascending: false });
      if (error) throw error;

      let filtered = data || [];
      if (q) {
        const queryText = q.toLowerCase();
        filtered = filtered.filter(e =>
          (e.merchant && e.merchant.toLowerCase().includes(queryText)) ||
          (e.note && e.note.toLowerCase().includes(queryText))
        );
      }

      setExpenses(filtered);
    } catch (e) {
      console.error(e);
      toast.error("Could not load transactions");
    } finally {
      setLoading(false);
    }
  }, [category, start, end, q]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const total = useMemo(() => expenses.reduce((a, b) => a + b.amount, 0), [expenses]);
  const cur = user?.currency || "INR";

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success("Expense deleted");
      setExpenses((prev) => prev.filter((e) => e.id !== deleteId));
    } catch (e) {
      toast.error("Could not delete");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div data-testid="transactions-page" className="relative">
      <SectionHeading
        kicker="/ Transactions"
        title="History"
        subtitle={
          <>
            {expenses.length} entries · Total{" "}
            <CountUp value={total} format={(v) => formatMoney(v, cur)} className="text-ink-1 font-semibold" />
          </>
        }
      />

      {/* Filters */}
      <Fade delay={0.16} className="mt-6">
        <div className="rounded-2xl border border-hairline bg-surface-1 p-4 theme-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
              <Input
                placeholder="Search merchant or note"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9 bg-transparent border-hairline-strong text-ink-1 placeholder:text-ink-3"
                data-testid="txn-search-input"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-transparent border-hairline-strong text-ink-1" data-testid="txn-category-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="bg-transparent border-hairline-strong text-ink-1"
              data-testid="txn-start-date"
            />
            <Input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="bg-transparent border-hairline-strong text-ink-1"
              data-testid="txn-end-date"
            />
          </div>
        </div>
      </Fade>

      {/* Table */}
      <Fade delay={0.24} className="mt-4">
        <div className="rounded-2xl border border-hairline bg-surface-1 overflow-hidden theme-fade" data-testid="txn-table">
          <div className="grid grid-cols-[minmax(0,1fr),84px,88px,40px] md:grid-cols-[minmax(0,1fr),minmax(0,1fr),84px,110px,40px] gap-3 md:gap-4 px-4 py-3 border-b border-hairline text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">
            <div>Merchant / Note</div>
            <div className="hidden md:block">Category</div>
            <div>Date</div>
            <div className="text-right">Amount</div>
            <div></div>
          </div>

          {loading && (
            <div className="p-6 text-center text-sm text-ink-3">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ background: "var(--brand)" }} />
                Loading…
              </span>
            </div>
          )}

          {!loading && expenses.length === 0 && (
            <div className="p-10 text-center text-sm text-ink-3">
              <Receipt className="w-6 h-6 mx-auto mb-2" />
              No expenses found for this filter.
            </div>
          )}

          <div className="divide-y divide-hairline-faint">
            <AnimatePresence initial={false}>
              {expenses.map((e, i) => {
                const meta = categoryMeta(e.category);
                const Icon = meta.icon;
                const color = catColor(meta, theme);
                return (
                  <motion.div
                    key={e.id}
                    layout
                    data-testid={`txn-row-${e.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -18, height: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE_CINEMATIC,
                      delay: Math.min(i, 12) * 0.035,
                    }}
                    className="grid grid-cols-[minmax(0,1fr),84px,88px,40px] md:grid-cols-[minmax(0,1fr),minmax(0,1fr),84px,110px,40px] gap-3 md:gap-4 px-4 py-3 items-center hover:bg-tint-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-md grid place-items-center shrink-0 border"
                        style={{ background: withAlpha(color, 0.12), borderColor: withAlpha(color, 0.28), color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate text-ink-1">
                          {e.merchant || e.note || meta.name}
                        </div>
                        {e.note && e.merchant && (
                          <div className="text-[11px] text-ink-3 truncate hidden md:block">{e.note}</div>
                        )}
                      </div>
                      {e.receipt_base64 && (
                        <button
                          className="ml-auto p-1.5 text-ink-3 hover:text-ink-1 transition-colors"
                          onClick={() => setReceiptView(e)}
                          data-testid={`txn-view-receipt-${e.id}`}
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-ink-2 hidden md:block">{meta.name}</div>
                    <div className="text-sm text-ink-2 font-mono-tab">
                      {new Date(e.date).toLocaleDateString()}
                    </div>
                    <div className="text-right text-[13px] font-mono-tab font-medium" style={{ color: "var(--negative)" }}>
                      −{formatMoney(e.amount, e.currency || cur)}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1.5 rounded-md hover:bg-tint-active text-ink-2 transition-colors"
                        onClick={() => { setEditing(e); setModalOpen(true); }}
                        data-testid={`txn-edit-${e.id}`}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-negative-soft transition-colors"
                        style={{ color: "var(--negative)" }}
                        onClick={() => setDeleteId(e.id)}
                        data-testid={`txn-delete-${e.id}`}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </Fade>

      <ExpenseModal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditing(null); }}
        existing={editing}
        onSaved={load}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-cancel-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="delete-confirm-btn"
              style={{ background: "var(--negative)", color: "#fff" }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!receiptView} onOpenChange={(o) => !o && setReceiptView(null)}>
        <DialogContent className="border-hairline bg-surface-1 text-ink-1">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {receiptView?.receipt_base64 && (
            <motion.img
              src={receiptView.receipt_base64}
              alt="receipt"
              className="w-full rounded-lg"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
