import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES } from "@/lib/currency";
import { Loader2, Sun, Moon, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Stagger, Reveal, SectionHeading, EASE_CINEMATIC } from "@/components/motion";

const THEMES = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
];

export default function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(user?.currency || "INR");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const userId = user?.id || user?.user_id;
      if (!userId) throw new Error("No authenticated user session");
      const { error } = await supabase.from('users').upsert({
        id: userId,
        name,
        currency,
        theme
      });
      if (error) throw error;
      await refreshUser();
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const doLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6 max-w-3xl relative" data-testid="profile-page">
      <SectionHeading kicker="/ Profile" title="Your details" />

      <Stagger className="space-y-6" delay={0.12}>
        {/* Identity */}
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 theme-fade">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="ring-1 ring-hairline rounded-full"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.picture || undefined} />
                  <AvatarFallback className="text-lg font-semibold" style={{ background: "var(--tint-active)", color: "var(--ink-1)" }}>
                    {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <div className="font-display text-xl font-bold text-ink-1" data-testid="profile-display-name">
                  {user?.name || "—"}
                </div>
                <div className="text-sm text-ink-2 font-mono-tab" data-testid="profile-email">{user?.email}</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-3 mt-1">
                  {user?.auth_provider === "google" ? "Signed in with Google" : "Email account"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-xs uppercase tracking-widest text-ink-3">Display name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 bg-transparent border-hairline-strong text-ink-1"
                  data-testid="profile-name-input"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-ink-3">Primary currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1.5 bg-transparent border-hairline-strong text-ink-1" data-testid="profile-currency-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.symbol} · {c.code} — {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={save}
                disabled={saving}
                data-testid="profile-save-btn"
                className="rounded-full font-semibold border-0"
                style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                Save changes
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Theme */}
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 theme-fade">
            <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">Appearance</div>
            <div className="font-display text-lg font-bold mt-1 text-ink-1">Theme</div>
            <p className="text-sm text-ink-2 mt-1">
              Toggle between dark and light mode. Preference is stored locally.
            </p>
            <div className="mt-4 inline-flex rounded-full border border-hairline bg-surface-2 p-1 theme-fade" data-testid="theme-selector">
              {THEMES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  data-testid={`theme-${id}-btn`}
                  className={`relative px-4 py-1.5 text-xs uppercase tracking-widest font-mono-tab rounded-full flex items-center gap-1.5 transition-colors ${
                    theme === id ? "text-brand-fg" : "text-ink-2 hover:text-ink-1"
                  }`}
                >
                  {theme === id && (
                    <motion.span
                      layoutId="theme-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--ink-1)" }}
                      transition={{ duration: 0.36, ease: EASE_CINEMATIC }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Danger */}
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 theme-fade">
            <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">Account</div>
            <div className="font-display text-lg font-bold mt-1 text-ink-1">Session</div>
            <p className="text-sm text-ink-2 mt-1">Sign out from this device.</p>
            <Button
              variant="outline"
              onClick={doLogout}
              data-testid="profile-logout-btn"
              className="mt-4 rounded-full border-hairline-strong bg-transparent hover:bg-tint-active text-ink-1"
            >
              <LogOut className="w-4 h-4 mr-1" /> Log out
            </Button>
          </div>
        </Reveal>
      </Stagger>
    </div>
  );
}
