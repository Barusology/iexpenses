import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, categoryMeta, catColor, withAlpha } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currency";
import { Upload, Sparkles, Loader2, X, Camera } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { EASE_CINEMATIC } from "@/components/motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ExpenseModal({ open, onOpenChange, existing, onSaved }) {
  const { user } = useAuth();
  const { theme } = useTheme();
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
  const catHex = catColor(categoryMeta(category), theme);

  const inputCls = "bg-transparent border-hairline-strong text-ink-1 placeholder:text-ink-3";
  const labelCls = "text-xs uppercase tracking-widest text-ink-3";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg border-hairline bg-surface-1 text-ink-1 shadow-key"
        data-testid="expense-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            {existing ? "Edit expense" : "New expense"}
          </DialogTitle>
          <DialogDescription className="text-ink-2">
            Upload a receipt to auto-extract, or enter manually.
          </DialogDescription>
        </DialogHeader>

        {/* Receipt upload */}
        <motion.div
          className={`relative rounded-xl border-2 border-dashed transition-colors ${
            receipt ? "" : "hover:bg-tint-hover"
          }`}
          style={{ borderColor: receipt ? withAlpha(catHex, 0.55) : "var(--hairline-strong)" }}
          data-testid="receipt-dropzone"
          animate={ocring ? { scale: [1, 1.006, 1] } : { scale: 1 }}
          transition={ocring ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        >
          {receipt ? (
            <div className="relative p-3">
              <img src={receipt} alt="receipt" className="w-full h-40 object-cover rounded-md" />
              {/* OCR scan line — reads as the receipt being actively read */}
              {ocring && (
                <motion.div
                  className="absolute left-3 right-3 h-[2px] rounded-full"
                  style={{ background: "var(--brand)", boxShadow: "0 0 14px 2px var(--brand-glow)" }}
                  initial={{ top: "0.75rem" }}
                  animate={{ top: ["0.75rem", "calc(100% - 0.75rem)", "0.75rem"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <button
                type="button"
                onClick={() => setReceipt(null)}
                data-testid="receipt-remove-btn"
                className="absolute top-2 right-2 p-1 rounded-full border border-hairline"
                style={{ background: "var(--scrim)", color: "var(--ink-1)" }}
              >
                <X className="w-4 h-4" />
              </button>
              {ocring && (
                <div
                  className="absolute inset-3 rounded-md flex items-center justify-center gap-2 text-sm"
                  style={{ background: "var(--scrim)", backdropFilter: "blur(2px)" }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting…
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              data-testid="receipt-upload-btn"
              className="w-full p-6 flex flex-col items-center justify-center text-ink-2 hover:text-ink-1 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2" style={{ color: "var(--brand)" }}>
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
        </motion.div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label className={labelCls}>Amount</Label>
            <div className="flex gap-2 mt-1.5">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className={`w-24 ${inputCls}`} data-testid="expense-currency-select">
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
                className={`font-mono-tab text-lg h-10 ${inputCls}`}
              />
            </div>
          </div>

          <div>
            <Label className={labelCls}>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={`mt-1.5 ${inputCls}`} data-testid="expense-category-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: catColor(c, theme) }} />
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={labelCls}>Date</Label>
            <Input
              data-testid="expense-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`mt-1.5 ${inputCls}`}
            />
          </div>

          <div className="col-span-2">
            <Label className={labelCls}>Merchant</Label>
            <Input
              data-testid="expense-merchant-input"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Blue Bottle Coffee"
              className={`mt-1.5 ${inputCls}`}
            />
          </div>

          <div className="col-span-2">
            <Label className={labelCls}>Note</Label>
            <Textarea
              data-testid="expense-note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional details"
              className={`mt-1.5 min-h-[60px] ${inputCls}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
            className="flex items-center gap-2 text-xs text-ink-2"
          >
            <span
              className="w-6 h-6 rounded-md grid place-items-center border"
              style={{ background: withAlpha(catHex, 0.12), borderColor: withAlpha(catHex, 0.28), color: catHex }}
            >
              <CatIcon className="w-3.5 h-3.5" />
            </span>
            <span>{categoryMeta(category).name}</span>
          </motion.div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              data-testid="expense-cancel-btn"
              className="text-ink-2 hover:text-ink-1 hover:bg-tint-active"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              data-testid="expense-save-btn"
              className="rounded-full font-semibold border-0"
              style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
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
