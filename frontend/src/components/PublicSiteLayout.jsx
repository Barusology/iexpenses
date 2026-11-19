import React from "react";
import { Wallet } from "lucide-react";

export default function PublicSiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-0 text-ink-1">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface-1 focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header className="border-b border-hairline bg-surface-0/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4">
          <a href="/" className="flex items-center gap-2.5" aria-label="iEXPENSES home">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
            >
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">iEXPENSES</span>
          </a>
          <nav aria-label="Main navigation" className="flex items-center gap-3 text-sm sm:gap-4">
            <a className="hidden text-ink-2 hover:text-ink-1 sm:inline" href="/guides">
              Guides
            </a>
            <a className="hidden text-ink-2 hover:text-ink-1 md:inline" href="/receipt-scanner">
              Receipt scanner
            </a>
            <a className="hidden text-ink-2 hover:text-ink-1 lg:inline" href="/about">
              About
            </a>
            <details className="relative sm:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-hairline-strong px-3 py-2 font-semibold hover:bg-tint-hover">
                Explore
              </summary>
              <div className="absolute right-0 top-full z-30 mt-2 grid min-w-48 gap-1 rounded-xl border border-hairline bg-surface-1 p-2 shadow-lg">
                <a className="rounded-lg px-3 py-2 text-ink-2 hover:bg-tint-hover hover:text-ink-1" href="/guides">Guides</a>
                <a className="rounded-lg px-3 py-2 text-ink-2 hover:bg-tint-hover hover:text-ink-1" href="/receipt-scanner">Receipt scanner</a>
                <a className="rounded-lg px-3 py-2 text-ink-2 hover:bg-tint-hover hover:text-ink-1" href="/about">About</a>
                <a className="rounded-lg px-3 py-2 text-ink-2 hover:bg-tint-hover hover:text-ink-1" href="/privacy">Privacy</a>
              </div>
            </details>
            <a
              href="/login"
              className="rounded-full border border-hairline-strong px-4 py-2 font-semibold hover:bg-tint-hover"
            >
              Sign in
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-5">
        {children}
      </main>

      <footer className="mt-20 border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>Powered by Barusology INITIATIVE</p>
            <p>© 2026 iEXPENSES. All rights reserved.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a className="hover:text-ink-1" href="/guides">All guides</a>
            <a className="hover:text-ink-1" href="/guides/track-expenses-without-bank-linking">Track without bank linking</a>
            <a className="hover:text-ink-1" href="/guides/receipt-organization-tips">Organize receipts</a>
            <a className="hover:text-ink-1" href="/guides/monthly-spending-check-in">Monthly check-in</a>
            <a className="hover:text-ink-1" href="/receipt-scanner">Receipt scanner</a>
            <a className="hover:text-ink-1" href="/about">About</a>
            <a className="hover:text-ink-1" href="/expense-tracking-guide">Expense tracking guide</a>
            <a className="hover:text-ink-1" href="/privacy">Privacy policy</a>
            <a className="hover:text-ink-1" href="/cookies">Cookie policy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
