import React from "react";
import { ArrowRight } from "lucide-react";
import PublicSiteLayout from "@/components/PublicSiteLayout";

export default function EditorialGuide({ title, description, updated, sections }) {
  return (
    <PublicSiteLayout>
      <article className="mx-auto max-w-3xl py-12 sm:py-16">
        <header className="mb-10 border-b border-hairline pb-8">
          <a href="/guides" className="kicker mb-4 inline-block hover:text-ink-1">
            Practical personal finance guides
          </a>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-2">{description}</p>
          <p className="mt-4 text-sm text-ink-3">
            iExpenses editorial guide <span aria-hidden="true">·</span> Updated {updated}
          </p>
        </header>

        <div className="space-y-9 text-base leading-8 text-ink-2">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-bold leading-snug text-ink-1">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3">{paragraph}</p>
              ))}
              {section.list && (
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  {section.list.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-hairline bg-surface-1 p-7 sm:p-9">
          <h2 className="font-display text-2xl font-bold">Put the routine to work</h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink-2">
            Keep a record that is easy to review. Choose the details and cadence that fit your own needs.
          </p>
          <a
            href="/signup"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold"
            style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
          >
            Start tracking <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </aside>
      </article>
    </PublicSiteLayout>
  );
}
