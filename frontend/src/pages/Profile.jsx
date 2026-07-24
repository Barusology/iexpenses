import React, { useState } from "react";
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
    <div className="space-y-8 fade-up max-w-3xl" data-testid="profile-page">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#00FF9D] font-mono-tab">/ Profile</div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tighter mt-1">Your details</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16 border border-white/10">
            <AvatarImage src={user?.picture || undefined} />
            <AvatarFallback className="bg-white/10 text-lg">
              {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-display text-xl font-bold" data-testid="profile-display-name">{user?.name || "—"}</div>
            <div className="text-sm text-zinc-400 font-mono-tab" data-testid="profile-email">{user?.email}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
              {user?.auth_provider === "google" ? "Signed in with Google" : "Email account"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Display name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 bg-transparent border-white/15"
              data-testid="profile-name-input"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Primary currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="mt-1.5 bg-transparent border-white/15" data-testid="profile-currency-select">
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
            className="rounded-full bg-[#00FF9D] text-black hover:bg-[#00e58c] font-semibold"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            Save changes
          </Button>
        </div>
      </div>

      {/* Theme */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Appearance</div>
        <div className="font-display text-lg font-bold mt-1">Theme</div>
        <p className="text-sm text-zinc-400 mt-1">Toggle between dark and light mode. Preference is stored locally.</p>
        <div className="mt-4 inline-flex rounded-full border border-white/10 p-1" data-testid="theme-selector">
          <button
            onClick={() => setTheme("dark")}
            data-testid="theme-dark-btn"
            className={`px-4 py-1.5 text-xs uppercase tracking-widest font-mono-tab rounded-full flex items-center gap-1.5 transition-colors ${
              theme === "dark" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            data-testid="theme-light-btn"
            className={`px-4 py-1.5 text-xs uppercase tracking-widest font-mono-tab rounded-full flex items-center gap-1.5 transition-colors ${
              theme === "light" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Light
          </button>
        </div>
      </div>

      {/* Danger */}
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-6">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono-tab">Account</div>
        <div className="font-display text-lg font-bold mt-1">Session</div>
        <p className="text-sm text-zinc-400 mt-1">Sign out from this device.</p>
        <Button
          variant="outline"
          onClick={doLogout}
          data-testid="profile-logout-btn"
          className="mt-4 rounded-full border-white/15 bg-transparent hover:bg-white/5"
        >
          <LogOut className="w-4 h-4 mr-1" /> Log out
        </Button>
      </div>
    </div>
  );
}
