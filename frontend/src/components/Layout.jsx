import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ListOrdered, PieChart, User, LogOut,
  Sun, Moon, Plus, Menu, X, Wallet
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ExpenseModal from "@/components/ExpenseModal";
import { AmbientStage, ThemeMorph, EASE_CINEMATIC } from "@/components/motion";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, testid: "nav-dashboard" },
  { to: "/transactions", label: "Transactions", icon: ListOrdered, testid: "nav-transactions" },
  { to: "/analytics", label: "Analytics", icon: PieChart, testid: "nav-analytics" },
  { to: "/profile", label: "Profile", icon: User, testid: "nav-profile" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = (user?.name || user?.email || "U").slice(0, 1).toUpperCase();

  const SidebarLinks = ({ onNav, activeContext }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} data-testid={item.testid} onClick={onNav} className="relative">
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId={`nav-pill-${activeContext}`}
                    className="absolute inset-0 rounded-lg border border-hairline bg-tint-active"
                    transition={{ duration: 0.34, ease: EASE_CINEMATIC }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "text-ink-1" : "text-ink-2 hover:text-ink-1"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen grain-overlay bg-surface-0 text-ink-1">
      <AmbientStage intensity={0.9} />

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col p-5 z-30 border-r border-hairline bg-surface-1/70 backdrop-blur-2xl theme-fade">
        <Link to="/dashboard" className="flex items-center gap-2 mb-8" data-testid="brand-logo">
          <div className="w-9 h-9 rounded-xl grid place-items-center shadow-lift" style={{ background: "var(--brand)", color: "var(--brand-fg)" }}>
            <Wallet className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none tracking-tight">iEXPENSES</div>
            <div className="text-[10px] uppercase tracking-widest text-ink-3 mt-1">Neo Fintech</div>
          </div>
        </Link>

        <div className="text-[10px] uppercase tracking-widest text-ink-3 mb-2 px-2">Navigate</div>
        <SidebarLinks activeContext="desktop" />

        <div className="mt-auto flex flex-col gap-3">
          <Button
            onClick={() => setAddOpen(true)}
            data-testid="sidebar-add-expense-btn"
            className="rounded-full w-full font-semibold h-10 border-0"
            style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
          >
            <Plus className="w-4 h-4 mr-1" /> Add expense
          </Button>

          <div className="flex items-center gap-3 p-2 rounded-xl border border-hairline bg-tint-hover theme-fade">
            <Avatar className="w-8 h-8 ring-1 ring-hairline">
              <AvatarImage src={user?.picture || undefined} />
              <AvatarFallback className="text-xs font-semibold" style={{ background: "var(--tint-active)", color: "var(--ink-1)" }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate text-ink-1" data-testid="sidebar-user-name">
                {user?.name || user?.email}
              </div>
              <div className="text-[10px] text-ink-3 truncate">{user?.email}</div>
            </div>
            <button
              onClick={doLogout}
              data-testid="sidebar-logout-btn"
              className="p-1.5 rounded-lg hover:bg-tint-active text-ink-2 hover:text-ink-1 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 glass px-4 py-3 flex items-center justify-between">
        <button
          data-testid="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-tint-active text-ink-1 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-display font-bold text-lg tracking-tight">iEXPENSES</div>
        <button
          data-testid="mobile-theme-toggle"
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-tint-active text-ink-1 transition-colors"
        >
          <ThemeMorph icon={theme === "dark" ? Sun : Moon} theme={theme} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <div className="absolute inset-0 backdrop-blur-md" style={{ background: "var(--scrim)" }} onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute left-0 top-0 h-full w-72 bg-surface-1 border-r border-hairline p-5 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="font-display font-bold text-lg tracking-tight">iEXPENSES</div>
                <button data-testid="mobile-drawer-close" onClick={() => setMobileOpen(false)} className="p-2 text-ink-2 hover:text-ink-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarLinks onNav={() => setMobileOpen(false)} activeContext="mobile" />
              <Button
                onClick={() => { setAddOpen(true); setMobileOpen(false); }}
                className="mt-6 rounded-full font-semibold h-10 border-0"
                data-testid="mobile-add-expense-btn"
                style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add expense
              </Button>
              <button
                onClick={doLogout}
                data-testid="mobile-logout-btn"
                className="mt-auto text-sm text-ink-2 hover:text-ink-1 flex items-center gap-2 px-3 py-2"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="lg:ml-64 relative z-10">
        {/* Desktop utility bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-hairline glass sticky top-0 z-20">
          <div className="text-xs text-ink-2 font-mono-tab flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ background: "var(--brand)" }} />
            {new Date().toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2">
            <button
              data-testid="theme-toggle-btn"
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-tint-active border border-hairline text-ink-1 transition-colors"
              title="Toggle theme"
            >
              <ThemeMorph icon={theme === "dark" ? Sun : Moon} theme={theme} />
            </button>
            <Button
              onClick={() => setAddOpen(true)}
              data-testid="topbar-add-expense-btn"
              className="rounded-full font-semibold h-9"
              style={{ background: "var(--ink-1)", color: "var(--surface-0)" }}
            >
              <Plus className="w-4 h-4 mr-1" /> New expense
            </Button>
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6 lg:py-8 relative">
          {children}
        </div>
      </main>

      <ExpenseModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
