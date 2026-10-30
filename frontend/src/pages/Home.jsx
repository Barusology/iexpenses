import React from "react";
import { ArrowRight, BarChart3, Check, ReceiptText, Tags, Wallet } from "lucide-react";
import PublicSiteLayout from "@/components/PublicSiteLayout";

const FEATURES = [
  {
    icon: ReceiptText,
    title: "Keep a useful record",
    description:
      "Add the amount, date, merchant, currency, category, and an optional note. You can enter a purchase yourself or use a receipt image to help fill in its details.",
  },
  {
    icon: Tags,
    title: "Use consistent categories",
    description:
      "Group purchases into practical categories so your monthly review compares like with like instead of relying on memory.",
  },
  {
    icon: BarChart3,
    title: "Review patterns over time",
    description:
      "See totals and category breakdowns in one place, then use those records to decide what you want to examine next month.",
  },
];

const REVIEW_STEPS = [
  "Check that the month’s major purchases and recurring bills are recorded.",
  "Compare category totals with the previous month; investigate changes rather than judging them.",
  "Choose one small adjustment or question to carry into the next month.",
];

export default function Home() {
  return (
    <PublicSiteLayout>
      <section className="grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-24">
        <div>
          <p className="kicker mb-4">A clearer view of everyday spending</p>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            See where your money goes.{" "}
            <span style={{ color: "var(--brand)" }}>Make the next month easier.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">
            iEXPENSES is a personal expense tracker for recording purchases, organizing them
            into categories, and reviewing spending trends. Build a record you can use—not
            another budget you have to guess at.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/signup"
              className="inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold"
              style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
            >
              Create your ledger <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="/expense-tracking-guide"
              className="inline-flex h-12 items-center rounded-full border border-hairline-strong px-6 font-semibold hover:bg-tint-hover"
            >
              Read the expense guide
            </a>
          </div>
        </div>

        <aside className="rounded-3xl border border-hairline bg-surface-1 p-6 sm:p-8" aria-label="A simple monthly review">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-3">Start with the record</p>
              <h2 className="font-display text-xl font-bold">A calmer monthly check-in</h2>
            </div>
          </div>
          <ol className="mt-6 space-y-4">
            {REVIEW_STEPS.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-ink-2">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-hairline text-xs font-semibold text-ink-1">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-6 border-t border-hairline pt-4 text-xs leading-5 text-ink-3">
            A tracking habit is a source of information, not a financial plan or a substitute
            for professional advice.
          </p>
        </aside>
      </section>

      <section className="border-t border-hairline py-14 sm:py-18">
        <div className="max-w-2xl">
          <p className="kicker mb-3">What you can do</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A straightforward workflow, from purchase to pattern.
          </h2>
          <p className="mt-4 leading-7 text-ink-2">
            Good tracking starts with records you can understand later. iEXPENSES brings
            entry, categorization, and review together, while leaving you in control of what
            to record and how to interpret it.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-hairline bg-surface-1 p-6">
              <Icon className="h-5 w-5" style={{ color: "var(--brand)" }} aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-2">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-hairline py-14 md:grid-cols-2 md:py-16">
        <div>
          <p className="kicker mb-3">A useful habit</p>
          <h2 className="font-display text-3xl font-bold tracking-tight">How to make expense tracking stick</h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-ink-2">
          <p>
            Pick a consistent moment to enter purchases—after a shopping trip, at the end of
            the day, or during a weekly review. Capture the date, amount, and a category while
            the details are still easy to remember. If you use receipt scanning, check the
            extracted values before saving; image recognition can misread dates, totals, and
            currency symbols.
          </p>
          <p>
            At month-end, look for meaningful changes rather than trying to make every
            category smaller. A travel month, an annual bill, or a one-time repair can explain
            a higher total. A short note beside an unusual purchase makes the next review
            more useful.
          </p>
          <a href="/expense-tracking-guide" className="inline-flex items-center gap-2 font-semibold" style={{ color: "var(--brand)" }}>
            Read the complete step-by-step guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="mb-16 rounded-3xl border border-hairline bg-surface-1 p-7 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="kicker mb-3">Designed for personal records</p>
            <h2 className="font-display text-3xl font-bold tracking-tight">Your spending data is yours to review.</h2>
            <p className="mt-3 leading-7 text-ink-2">
              The tracker is not a bank connection or investment service. You enter your own
              expense information and use the charts as a record of what you have entered.
              Review the privacy policy to understand the services used to operate the site.
            </p>
          </div>
          <a href="/privacy" className="inline-flex shrink-0 items-center gap-2 font-semibold" style={{ color: "var(--brand)" }}>
            Read our privacy policy <Check className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
