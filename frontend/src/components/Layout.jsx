import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, ListOrdered, PieChart, User, LogOut,
  Sun, Moon, Plus, Menu, X, Wallet
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ExpenseModal from "@/components/ExpenseModal";

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

  const SidebarLinks = ({ onNav }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            data-testid={item.testid}
            onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors font-medium ` +
              (isActive
                ? "bg-white/[0.06] text-white border border-white/10"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent")
            }
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen grain-overlay bg-[var(--surface-0)] text-white dark:text-white light:text-black">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[var(--surface-1)] flex-col p-5 z-30">
        <Link to="/dashboard" className="flex items-center gap-2 mb-8" data-testid="brand-logo">
          <div className="w-9 h-9 rounded-xl bg-[#00FF9D] text-black flex items-center justify-center">
            <Wallet className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none tracking-tight">iEXPENSES</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Neo Fintech</div>
          </div>
        </Link>

        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 px-2">Navigate</div>
        <SidebarLinks />

        <div className="mt-auto flex flex-col gap-3">
          <Button
            onClick={() => setAddOpen(true)}
            data-testid="sidebar-add-expense-btn"
            className="rounded-full bg-[#00FF9D] text-black hover:bg-[#00e58c] w-full font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" /> Add expense
          </Button>

          <div className="flex items-center gap-3 p-2 rounded-lg border border-white/10 bg-black/40">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.picture || undefined} />
              <AvatarFallback className="bg-white/10 text-white text-xs">
                {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" data-testid="sidebar-user-name">
                {user?.name || user?.email}
              </div>
              <div className="text-[10px] text-zinc-500 truncate">{user?.email}</div>
            </div>
            <button
              onClick={doLogout}
              data-testid="sidebar-logout-btn"
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button
          data-testid="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-display font-bold text-lg tracking-tight">iEXPENSES</div>
        <button
          data-testid="mobile-theme-toggle"
          onClick={toggle}
          className="p-2 rounded-md hover:bg-white/5"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-72 bg-[var(--surface-1)] border-r border-white/10 p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="font-display font-bold text-lg tracking-tight">iEXPENSES</div>
              <button data-testid="mobile-drawer-close" onClick={() => setMobileOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarLinks onNav={() => setMobileOpen(false)} />
            <Button
              onClick={() => { setAddOpen(true); setMobileOpen(false); }}
              className="mt-6 rounded-full bg-[#00FF9D] text-black hover:bg-[#00e58c] font-semibold"
              data-testid="mobile-add-expense-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> Add expense
            </Button>
            <button
              onClick={doLogout}
              data-testid="mobile-logout-btn"
              className="mt-auto text-sm text-zinc-400 hover:text-white flex items-center gap-2 px-3 py-2"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-64 relative z-10">
        {/* Desktop utility bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-20">
          <div className="text-xs text-zinc-400 font-mono-tab">
            {new Date().toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2">
            <button
              data-testid="theme-toggle-btn"
              onClick={toggle}
              className="p-2 rounded-md hover:bg-white/5 border border-white/10"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button
              onClick={() => setAddOpen(true)}
              data-testid="topbar-add-expense-btn"
              className="rounded-full bg-white text-black hover:bg-zinc-200 font-semibold"
            >
              <Plus className="w-4 h-4 mr-1" /> New expense
            </Button>
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>

      <ExpenseModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
