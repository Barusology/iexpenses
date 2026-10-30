import React from "react";
import PublicSiteLayout from "@/components/PublicSiteLayout";

export default function Privacy() {
  return (
    <PublicSiteLayout>
      <article className="mx-auto max-w-3xl py-12 sm:py-16">
        <header className="mb-8 border-b border-hairline pb-7">
          <p className="kicker mb-3">Privacy and data use</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Privacy policy</h1>
          <p className="mt-4 text-sm text-ink-3">Effective date: October 30, 2026</p>
        </header>

        <div className="space-y-8 text-sm leading-7 text-ink-2">
          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">What this service does</h2>
            <p className="mt-2">
              iEXPENSES is a personal expense-recording application operated under the
              Barusology project. You can create an account, enter expense details, and
              review summaries. It is not a bank connection, payment service, or financial
              adviser. Do not enter bank passwords, payment-card numbers, or other
              credentials into expense notes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Information processed</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-ink-1">Account information:</strong> email address,
                authentication identifiers, and profile details you provide when signing
                in with email or Google.
              </li>
              <li>
                <strong className="text-ink-1">Expense information:</strong> amounts,
                dates, currencies, merchants, categories, notes, and receipt images you
                choose to attach.
              </li>
              <li>
                <strong className="text-ink-1">Technical and usage information:</strong>{" "}
                browser and device details, page visits, and product interactions processed
                by the analytics tools configured for the site.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Service providers</h2>
            <p className="mt-2">
              The application uses Supabase for authentication and database services. If
              you choose receipt scanning, the receipt image is sent to the configured
              receipt-recognition service for extraction; extracted values should be
              reviewed before saving. Google Analytics is loaded only if you accept
              optional cookies. PostHog analytics and session recording are limited to
              the public homepage and guide and also require consent.
            </p>
            <p className="mt-2">
              These providers process information under their own terms and privacy
              practices. The service may also disclose information when required by law,
              to protect the service and its users, or to respond to a valid legal request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Advertising and cookies</h2>
            <p className="mt-2">
              Google AdSense is loaded only after you accept optional cookies and only on
              the public homepage and expense-tracking guide, where publisher content is
              provided. It is not loaded on sign-in, sign-up, dashboard, transaction,
              analytics, profile, privacy, or cookie-policy pages. Google and its partners
              may use cookies or similar technologies to deliver, measure, and personalize
              ads as permitted by your settings and applicable requirements. PostHog
              session recording is also limited to those public content pages and is not
              enabled on authenticated expense screens.
            </p>
            <p className="mt-2">
              You can review or change Google ad personalization settings at{" "}
              <a className="underline" href="https://myadcenter.google.com/" target="_blank" rel="noreferrer">
                Google My Ad Center
              </a>
              . You can change your site choice with the Cookie settings control. See our{" "}
              <a className="underline" href="/cookies">cookie policy</a> for details.
            </p>
            <p className="mt-2">
              Supabase authentication and the site’s theme preference use browser storage
              to provide core features. Optional analytics and advertising do not load
              until you accept them through the consent controls.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Retention and your choices</h2>
            <p className="mt-2">
              Account and expense records are processed to provide the features you use.
              The application does not currently provide a self-service account deletion
              control. To ask about access, correction, or deletion of account information,
              contact the project through the{" "}
              <a
                className="underline"
                href="https://github.com/Barusology/iexpenses/issues"
                target="_blank"
                rel="noreferrer"
              >
                iEXPENSES project page
              </a>
              ; do not include passwords, receipts, or other sensitive personal information
              in a public issue.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Changes to this policy</h2>
            <p className="mt-2">
              This policy may be updated when the service or its providers change. The
              effective date above identifies the latest published version. Continued use
              after an update is subject to the revised policy.
            </p>
          </section>
        </div>
      </article>
    </PublicSiteLayout>
  );
}
