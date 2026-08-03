import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/currency";
import { CATEGORIES, categoryMeta } from "@/lib/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Trash2, Pencil, Receipt, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ExpenseModal from "@/components/ExpenseModal";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { supabase } from "@/lib/supabase";

export default function Transactions() {
  const { user } = useAuth();
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

  const cur = user?.currency || "INR";

  return (
    <div className="space-y-6 fade-up" data-testid="transactions-page">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#00FF9D] font-mono-tab">/ Transactions</div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tighter mt-1">History</h1>
        <p className="text-zinc-400 mt-2 text-sm">
          {expenses.length} entries · Total{" "}
          <span className="text-white font-mono-tab">{formatMoney(total, cur)}</span>
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search merchant or note"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 bg-transparent border-white/15"
              data-testid="txn-search-input"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-transparent border-white/15" data-testid="txn-category-filter">
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
            className="bg-transparent border-white/15"
            data-testid="txn-start-date"
          />
          <Input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="bg-transparent border-white/15"
            data-testid="txn-end-date"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] overflow-hidden" data-testid="txn-table">
        <div className="grid grid-cols-[1fr,1fr,1fr,120px,60px] gap-4 px-4 py-3 border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">
          <div>Merchant / Note</div>
          <div>Category</div>
          <div>Date</div>
          <div className="text-right">Amount</div>
          <div></div>
        </div>
        {loading && (
          <div className="p-6 text-center text-sm text-zinc-500">Loading…</div>
        )}
        {!loading && expenses.length === 0 && (
          <div className="p-10 text-center text-sm text-zinc-500">
            <Receipt className="w-6 h-6 mx-auto mb-2" />
            No expenses found for this filter.
          </div>
        )}
        <div className="divide-y divide-white/5">
          {expenses.map((e) => {
            const meta = categoryMeta(e.category);
            const Icon = meta.icon;
            return (
              <div
                key={e.id}
                data-testid={`txn-row-${e.id}`}
                className="grid grid-cols-[1fr,1fr,1fr,120px,60px] gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center border border-white/10 shrink-0"
                    style={{ background: `${meta.color}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {e.merchant || e.note || meta.name}
                    </div>
                    {e.note && e.merchant && (
                      <div className="text-[11px] text-zinc-500 truncate">{e.note}</div>
                    )}
                  </div>
                  {e.receipt_base64 && (
                    <button
                      className="ml-auto p-1.5 text-zinc-500 hover:text-white"
                      onClick={() => setReceiptView(e)}
                      data-testid={`txn-view-receipt-${e.id}`}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-zinc-400">{meta.name}</div>
                <div className="text-sm text-zinc-400 font-mono-tab">
                  {new Date(e.date).toLocaleDateString()}
                </div>
                <div className="text-right font-mono-tab text-[#FF3366] font-medium">
                  − {formatMoney(e.amount, e.currency || cur)}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    className="p-1.5 rounded hover:bg-white/10 text-zinc-400"
                    onClick={() => { setEditing(e); setModalOpen(true); }}
                    data-testid={`txn-edit-${e.id}`}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-white/10 text-[#FF3366]"
                    onClick={() => setDeleteId(e.id)}
                    data-testid={`txn-delete-${e.id}`}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ExpenseModal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditing(null); }}
        existing={editing}
        onSaved={load}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-[var(--surface-1)] border border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-cancel-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="delete-confirm-btn"
              className="bg-[#FF3366] hover:bg-[#e42957] text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!receiptView} onOpenChange={(o) => !o && setReceiptView(null)}>
        <DialogContent className="bg-[var(--surface-1)] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {receiptView?.receipt_base64 && (
            <img src={receiptView.receipt_base64} alt="receipt" className="w-full rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
