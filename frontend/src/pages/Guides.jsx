import React from "react";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import PublicSiteLayout from "@/components/PublicSiteLayout";

const GUIDES = [
  {
    href: "/guides/track-expenses-without-bank-linking",
    title: "Track expenses without linking your bank",
    description:
      "Build a manual record from receipts and notes, choose a manageable capture rhythm, and understand the privacy tradeoffs.",
    length: "8 minute read",
  },
  {
    href: "/guides/receipt-organization-tips",
    title: "Organize receipts for monthly budgeting",
    description:
      "Create a simple paper and digital filing routine, verify OCR details, and keep only the records you need.",
    length: "8 minute read",
  },
  {
    href: "/guides/monthly-spending-check-in",
    title: "The 15-minute monthly spending check-in",
    description:
      "Check coverage, review meaningful category changes, and leave the session with one useful next step.",
    length: "7 minute read",
  },
  {
    href: "/expense-tracking-guide",
    title: "Build a practical expense-tracking routine",
    description:
      "Set up consistent categories, record key purchase details, and make a monthly review easier to repeat.",
    length: "6 minute read",
  },
];

export default function Guides() {
  return (
    <PublicSiteLayout>
      <section className="py-14 sm:py-20">
        <p className="kicker mb-3">Field notes for your finances</p>
        <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Practical guides for clearer spending records.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-2">
          Straightforward methods for capturing purchases, organizing receipts, and reviewing a month.
          These guides explain the tradeoffs so you can choose a routine that fits your life.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {GUIDES.map((guide, index) => (
            <article key={guide.href} className="flex min-h-64 flex-col rounded-2xl border border-hairline bg-surface-1 p-6 sm:p-7">
              <div className="flex items-center justify-between text-xs text-ink-3">
                <span className="font-mono-tab">0{index + 1}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{guide.length}</span>
              </div>
              <BookOpen className="mt-7 h-5 w-5" style={{ color: "var(--brand)" }} aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-bold leading-snug">{guide.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-ink-2">{guide.description}</p>
              <a href={guide.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--brand)" }}>
                Read the guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </PublicSiteLayout>
  );
}
