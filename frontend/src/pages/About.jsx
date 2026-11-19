import React from "react";
import { ArrowRight, BookOpen, ClipboardList, ScanLine } from "lucide-react";
import PublicSiteLayout from "@/components/PublicSiteLayout";

const PRINCIPLES = [
  {
    icon: ClipboardList,
    title: "A record, not a judgment",
    text: "Expense history describes what was entered. It does not label a purchase as good or bad or prescribe what someone should do with their money.",
  },
  {
    icon: ScanLine,
    title: "Automation with a human check",
    text: "Receipt recognition can reduce typing, but users should verify the amount, date, currency, and category before saving an entry.",
  },
  {
    icon: BookOpen,
    title: "Clear explanations",
    text: "Our public guides focus on practical recordkeeping methods, tradeoffs, and limitations rather than promises of financial outcomes.",
  },
];

export default function About() {
  return (
    <PublicSiteLayout>
      <article className="py-14 sm:py-20">
        <header className="max-w-3xl">
          <p className="kicker mb-3">About the project</p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            A clearer place to keep your personal expense records.
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-2">
            iExpenses is a personal expense tracker built to help people record purchases, organize them into categories, and review the information they have entered. It brings everyday entry, optional receipt scanning, and spending summaries into one workflow.
          </p>
        </header>

        <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Project principles">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-hairline bg-surface-1 p-6">
              <Icon className="h-5 w-5" style={{ color: "var(--brand)" }} aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-2">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 max-w-3xl space-y-5 text-base leading-8 text-ink-2">
          <h2 className="font-display text-2xl font-bold text-ink-1">What iExpenses is for</h2>
          <p>
            A useful spending history starts with accurate entries and consistent choices. iExpenses supports manual records and can use receipt OCR to suggest details from an image. Users remain in control of what they enter and should review suggested values before saving. Category totals and charts are summaries of those records, not independent verification of a bank balance or a complete view of every financial obligation.
          </p>
          <p>
            The tracker is not a bank, investment platform, credit service, tax service, or source of individualized financial advice. It does not promise that tracking alone will improve a person’s finances. The project is intended to make recording and reviewing purchases more straightforward, so users can bring their own context and judgment to the information.
          </p>
          <p>
            iExpenses is developed by Barusology INITIATIVE. For details about account information, analytics, advertising technologies, and data handling, review our <a className="underline underline-offset-4" href="/privacy">privacy policy</a> and <a className="underline underline-offset-4" href="/cookies">cookie policy</a>.
          </p>
          <a href="/guides" className="inline-flex items-center gap-2 font-semibold" style={{ color: "var(--brand)" }}>
            Browse the practical guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </article>
    </PublicSiteLayout>
  );
}
