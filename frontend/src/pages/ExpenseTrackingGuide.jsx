import React from "react";
import { ArrowRight, Check } from "lucide-react";
import PublicSiteLayout from "@/components/PublicSiteLayout";

const MONTHLY_CHECKLIST = [
  "Record purchases close to when they happen.",
  "Use the same categories for similar expenses.",
  "Review unusual totals and add context where helpful.",
  "Choose one question to check in the following month.",
];

export default function ExpenseTrackingGuide() {
  return (
    <PublicSiteLayout>
      <article className="mx-auto max-w-3xl py-12 sm:py-16">
        <header className="mb-10 border-b border-hairline pb-8">
          <p className="kicker mb-3">Practical guide to monthly spending</p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            How to track monthly expenses: a practical routine that lasts
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-2">
            A useful expense record does not need dozens of categories or a perfect budget.
            It needs a repeatable way to capture purchases, enough detail to explain them,
            and a regular moment to review what changed.
          </p>
          <p className="mt-4 text-sm text-ink-3">Published by the iEXPENSES team · Updated October 30, 2026</p>
        </header>

        <div className="space-y-10 text-base leading-8 text-ink-2">
          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">1. Decide what you want the record to answer</h2>
            <p className="mt-3">
              Before choosing an app or making a spreadsheet, name the question you want your
              records to answer. You might want to know how much you spend on food away from
              home, whether recurring bills have changed, or how often one-time purchases
              affect your monthly total. A clear question helps you record the right details
              without turning every purchase into a research project.
            </p>
            <p className="mt-3">
              Start with a manageable period, such as one calendar month. Record expenses you
              actually make, not estimates of what you think you spent. If you miss a day,
              add the information later from a receipt or statement when available; mark
              uncertain details rather than inventing precision.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">2. Capture a small, consistent set of details</h2>
            <p className="mt-3">
              For most personal reviews, the date, amount, currency, merchant, and category
              provide a useful starting record. A short note can explain a split purchase,
              reimbursement, or unusual event. Keep notes factual and brief so you can scan
              them later.
            </p>
            <p className="mt-3">
              Record a purchase once, and decide how you will handle refunds and shared bills
              before they occur. For example, you might record the original purchase and a
              separate refund entry, or record only the portion that belongs to your
              household. Either approach can work; applying it consistently is what makes
              totals comparable.
            </p>
            <div className="mt-5 rounded-2xl border border-hairline bg-surface-1 p-5">
              <p className="font-semibold text-ink-1">A practical entry might include:</p>
              <p className="mt-2 text-sm leading-6">
                <strong className="text-ink-1">Date:</strong> when the purchase happened ·{" "}
                <strong className="text-ink-1">Amount:</strong> the amount paid ·{" "}
                <strong className="text-ink-1">Merchant:</strong> where it was spent ·{" "}
                <strong className="text-ink-1">Category:</strong> the purpose ·{" "}
                <strong className="text-ink-1">Note:</strong> context you may need later
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">3. Choose categories you can apply quickly</h2>
            <p className="mt-3">
              Categories should make a monthly review easier, not force you to debate every
              transaction. Begin with broad groups that fit your life—such as housing,
              groceries, transportation, utilities, health, eating out, and personal
              purchases. Add a category only when separating it would help answer a real
              question.
            </p>
            <p className="mt-3">
              Write down simple rules for borderline items. If a grocery store visit includes
              household supplies, decide whether you categorize by the main purpose or split
              the receipt. If a bill covers several months, decide whether to record it when
              paid or spread it across the period it covers. There is no single method for
              every household; a consistent rule is more useful than repeatedly changing one.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">4. Separate recurring, flexible, and occasional costs</h2>
            <p className="mt-3">
              A helpful review distinguishes costs that arrive regularly from those that
              change with use and those that happen only occasionally. Recurring examples
              include rent, subscriptions, and insurance payments. Flexible costs might
              include groceries, transit, or dining. Occasional costs can include travel,
              repairs, gifts, and annual fees.
            </p>
            <p className="mt-3">
              This distinction gives context to a monthly total. An annual insurance payment
              can make one month look unusually expensive even though it was planned. A
              one-time repair may matter, but it does not necessarily describe your usual
              monthly routine. Notes and consistent categories help explain those
              differences without hiding them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">5. Make the routine easy to repeat</h2>
            <p className="mt-3">
              Choose a capture habit that fits how you already manage receipts. Some people
              enter purchases immediately; others set aside ten minutes every few days.
              Keep the capture step short and use a receipt or transaction record when you
              need to confirm an amount. If an app extracts information from an image,
              verify the result—optical character recognition can confuse similar digits,
              dates, and decimal marks.
            </p>
            <p className="mt-3">
              Then schedule one review near the end of each month. Look at missing entries,
              category totals, and large changes. Do not treat every increase as a mistake:
              consider seasonal activities, household changes, travel, and bills that are
              paid less often than monthly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">6. Turn observations into a small next step</h2>
            <p className="mt-3">
              A spending report describes the information you recorded; it cannot tell you
              by itself what decision is right for you. After reviewing a category, write
              down one observation and one question. For example: “Transport was higher
              because of two trips; will that happen next month?” or “Several small
              subscriptions renewed; which ones do I still use?”
            </p>
            <p className="mt-3">
              Pick a realistic follow-up rather than making several sweeping changes at
              once. In the next review, compare the new records with the same categories and
              rules. This turns tracking into a learning loop: record, review, ask, and
              adjust.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">A repeatable month-end checklist</h2>
            <ul className="mt-4 space-y-3">
              {MONTHLY_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--brand)" }} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">Common tracking mistakes to avoid</h2>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <strong className="text-ink-1">Making the category list too detailed:</strong>{" "}
                if you cannot categorize an ordinary purchase quickly, simplify the list.
              </li>
              <li>
                <strong className="text-ink-1">Changing rules mid-month:</strong> note a
                change and apply it consistently so comparisons remain understandable.
              </li>
              <li>
                <strong className="text-ink-1">Treating estimates as exact:</strong> mark
                uncertain amounts and check source records where practical.
              </li>
              <li>
                <strong className="text-ink-1">Using one unusual month as a forecast:</strong>{" "}
                review several months when you want to understand a longer-term pattern.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-hairline bg-surface-1 p-6">
            <h2 className="font-display text-2xl font-bold text-ink-1">Frequently asked questions</h2>
            <h3 className="mt-5 font-semibold text-ink-1">How often should I record expenses?</h3>
            <p className="mt-2">
              Choose a cadence you can maintain. Recording purchases as they happen reduces
              memory gaps; a scheduled weekly review can work if you keep receipts or another
              reliable source of details.
            </p>
            <h3 className="mt-5 font-semibold text-ink-1">How many expense categories should I use?</h3>
            <p className="mt-2">
              Use only enough categories to make decisions or comparisons clearer. Start
              broad, then split a category only when you repeatedly need more detail.
            </p>
            <h3 className="mt-5 font-semibold text-ink-1">Does expense tracking replace a budget?</h3>
            <p className="mt-2">
              No. Tracking records what happened. A budget is a separate plan for how you
              intend to use money. A clear record can inform planning, but this guide and
              tracker do not provide individualized financial advice.
            </p>
          </section>
        </div>

        <aside className="mt-12 rounded-3xl border border-hairline p-7 sm:p-9">
          <h2 className="font-display text-2xl font-bold">Ready to put the routine into practice?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink-2">
            Use iEXPENSES to record purchases, group them into categories, and review the
            information you have entered.
          </p>
          <a
            href="/signup"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold"
            style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
          >
            Create an account <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </aside>
      </article>
    </PublicSiteLayout>
  );
}
