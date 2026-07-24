import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, categoryMeta } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currency";
import { Upload, Sparkles, Loader2, X, Camera } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ExpenseModal({ open, onOpenChange, existing, onSaved }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [merchant, setMerchant] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState(user?.currency || "INR");
  const [receipt, setReceipt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ocring, setOcring] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (open && existing) {
      setAmount(String(existing.amount || ""));
      setCategory(existing.category || "food");
      setMerchant(existing.merchant || "");
      setNote(existing.note || "");
      setDate((existing.date || new Date().toISOString()).slice(0, 10));
      setCurrency(existing.currency || user?.currency || "INR");
      setReceipt(existing.receipt_base64 || null);
    } else if (open) {
      setAmount("");
      setCategory("food");
      setMerchant("");
      setNote("");
      setDate(new Date().toISOString().slice(0, 10));
      setCurrency(user?.currency || "INR");
      setReceipt(null);
    }
  }, [open, existing, user]);

  const handleFile = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setReceipt(dataUrl);
      // Auto OCR
      setOcring(true);
      toast.message("Analyzing receipt with AI…");
      try {
        const { data } = await api.post("/receipts/ocr", { image_base64: dataUrl });
        if (data.amount) setAmount(String(data.amount));
        if (data.merchant) setMerchant(data.merchant);
        if (data.date) setDate(data.date.slice(0, 10));
        if (data.currency) setCurrency(data.currency);
        if (data.suggested_category) setCategory(data.suggested_category);
        toast.success("Receipt auto-filled — review and save");
      } catch (e) {
        toast.error("Could not auto-extract. Please enter details manually.");
      } finally {
        setOcring(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        amount: Number(amount),
        category,
        merchant,
        note,
        date: new Date(date).toISOString(),
        currency,
        receipt_base64: receipt || null,
        user_id: user.user_id || user.id,
      };
      if (existing?.id) {
        const { error } = await supabase.from('expenses').update(payload).eq('id', existing.id);
        if (error) throw error;
        toast.success("Expense updated");
      } else {
        const { error } = await supabase.from('expenses').insert([payload]);
        if (error) throw error;
        toast.success("Expense recorded");
      }
      onOpenChange(false);
      onSaved && onSaved();
    } catch (e) {
      toast.error(e.message || "Could not save expense");
    } finally {
      setSaving(false);
    }
  };

  const CatIcon = categoryMeta(category).icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[var(--surface-1)] border border-white/10 text-white" data-testid="expense-modal">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            {existing ? "Edit expense" : "New expense"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Upload a receipt to auto-extract, or enter manually.
          </DialogDescription>
        </DialogHeader>

        {/* Receipt upload */}
        <div
          className={`relative rounded-xl border-2 border-dashed transition-colors ${receipt ? "border-[#00FF9D]/50" : "border-white/15 hover:border-[#00FF9D]/70"}`}
          data-testid="receipt-dropzone"
        >
          {receipt ? (
            <div className="relative p-3">
              <img src={receipt} alt="receipt" className="w-full h-40 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => setReceipt(null)}
                data-testid="receipt-remove-btn"
                className="absolute top-2 right-2 p-1 rounded-full bg-black/70 border border-white/10 hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
              {ocring && (
                <div className="absolute inset-3 rounded-md bg-black/70 flex items-center justify-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting…
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              data-testid="receipt-upload-btn"
              className="w-full p-6 flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2 text-[#00FF9D] mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-mono-tab">AI receipt scan</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <span className="text-sm">Drop JPG / PNG or click to upload</span>
              </div>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            data-testid="receipt-file-input"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Amount</Label>
            <div className="flex gap-2 mt-1.5">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-24 bg-transparent border-white/15" data-testid="expense-currency-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                data-testid="expense-amount-input"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent border-white/15 font-mono-tab text-lg h-10"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1.5 bg-transparent border-white/15" data-testid="expense-category-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: c.color }} />
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Date</Label>
            <Input
              data-testid="expense-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 bg-transparent border-white/15"
            />
          </div>

          <div className="col-span-2">
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Merchant</Label>
            <Input
              data-testid="expense-merchant-input"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Blue Bottle Coffee"
              className="mt-1.5 bg-transparent border-white/15"
            />
          </div>

          <div className="col-span-2">
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Note</Label>
            <Textarea
              data-testid="expense-note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional details"
              className="mt-1.5 bg-transparent border-white/15 min-h-[60px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CatIcon className="w-3.5 h-3.5" style={{ color: categoryMeta(category).color }} />
            <span>{categoryMeta(category).name}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              data-testid="expense-cancel-btn"
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              data-testid="expense-save-btn"
              className="rounded-full bg-[#00FF9D] text-black hover:bg-[#00e58c] font-semibold"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Camera className="w-4 h-4 mr-1" />}
              {existing ? "Update" : "Save expense"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
