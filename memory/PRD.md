# Ledgerly — Personal Expense Tracker (PRD)

## Original Problem Statement
Build a full stack web application for personal expense management. Users should be able to record and categorize expenses, view daily/weekly/monthly/yearly analytics with charts, upload receipt images, filter transaction history, manage their profile, and toggle dark/light mode. Include email/password authentication and Google login. Use preset expense categories (Food, Transport, Shopping, Bills, etc.) with INR as the default currency. Design it as a modern fintech UI with pie charts, bar graphs, and line charts.

## Architecture
- Frontend: React 19 + React Router 7 + TailwindCSS + Shadcn UI + Recharts + Sonner (toasts) + Lucide icons.
- Backend: FastAPI + Motor (async MongoDB) + PyJWT + bcrypt + httpx + emergentintegrations (Gemini 3 flash for OCR).
- Auth: JWT (email/password) + Emergent-managed Google OAuth (cookie session).
- DB collections: `users`, `user_sessions`, `expenses`.

## User Personas
- Individual users tracking daily personal spend across INR / multi-currency.

## Core Requirements (Static)
- Email/password auth + Google OAuth via Emergent.
- Preset categories (food, transport, shopping, bills, entertainment, health, groceries, travel, education, other).
- Expense CRUD with amount, category, merchant, note, date, receipt (base64), currency.
- Receipt OCR via Gemini 3 flash → auto-fills amount/merchant/date/category/currency.
- Analytics with pie / bar / line charts; period toggle daily/weekly/monthly/yearly.
- Transaction history with search, category filter, and date range.
- Profile with editable name, currency, theme.
- Dark/light theme toggle.

## Implemented (2026-02)
- **Auth**: /api/auth/register, /api/auth/login, /api/auth/session (Emergent OAuth exchange), /api/auth/me, /api/auth/logout. Cookie + Bearer dual-support.
- **Users**: PUT /api/users/me for profile.
- **Categories**: GET /api/categories returns preset list.
- **Expenses**: full CRUD + rich filters (q, category, start, end, min_amount, max_amount).
- **Analytics**: /api/analytics/summary with period buckets, category breakdown, weekly bars, trend series, recent transactions.
- **OCR**: /api/receipts/ocr with base64 image → structured JSON (verified in test with real LLM call).
- **Frontend pages**: Login, Signup, Dashboard (bento grid with 4 stat cards + pie + weekly bar + monthly trend + recent list), Transactions (filterable table with edit/delete/receipt viewer), Analytics (4 period toggles + pie + bar + trend), Profile (name/currency/theme).
- **Design**: Dark neo-fintech with Bricolage Grotesque + Manrope + JetBrains Mono fonts, #00FF9D mint accent, #FF3366 rose accent, glassmorphism header, grain overlay, grid backdrop, animated micro-interactions.
- **All 26/26 backend tests + 16/16 frontend tests passing.**

## Backlog / Next Tasks
- P1: Export transactions to CSV / PDF.
- P1: Budget goals per category with alerts.
- P1: Recurring expenses (subscriptions).
- P2: Currency conversion (live FX rates) for mixed-currency analytics.
- P2: Split expenses / shared ledger (multi-user).
- P2: Receipts stored via object storage instead of base64 for scale.
- P3: Push / email reminders for weekly review.
