import React from "react";
import PublicSiteLayout from "@/components/PublicSiteLayout";
import { useCookieConsent } from "@/context/CookieConsentContext";

export default function CookiePolicy() {
  const { openSettings } = useCookieConsent();

  return (
    <PublicSiteLayout>
      <article className="mx-auto max-w-3xl py-12 sm:py-16">
        <header className="mb-8 border-b border-hairline pb-7">
          <p className="kicker mb-3">Browser storage and your choices</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Cookie policy</h1>
          <p className="mt-4 text-sm text-ink-3">Effective date: October 30, 2026</p>
        </header>

        <div className="space-y-8 text-sm leading-7 text-ink-2">
          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">How this site uses storage</h2>
            <p className="mt-2">
              iEXPENSES uses browser storage and, when you consent, cookies or similar
              technologies. Essential storage supports sign-in, remembers your display
              theme, and saves your cookie choice. Optional analytics and advertising
              technologies are not loaded unless you select Accept.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Storage categories</h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-hairline">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-surface-1 text-ink-1">
                  <tr>
                    <th scope="col" className="p-3">Category</th>
                    <th scope="col" className="p-3">Purpose</th>
                    <th scope="col" className="p-3">Choice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--hairline)]">
                  <tr>
                    <th scope="row" className="p-3 font-semibold text-ink-1">Essential</th>
                    <td className="p-3">Authentication session, theme preference, and your consent selection.</td>
                    <td className="p-3">Always active where needed for the service.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-3 font-semibold text-ink-1">Analytics</th>
                    <td className="p-3">Google Analytics measures visits. PostHog analytics and session recording are limited to public content pages.</td>
                    <td className="p-3">Loaded only after you select Accept.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-3 font-semibold text-ink-1">Advertising</th>
                    <td className="p-3">Google AdSense may measure and serve ads on the homepage and expense guide.</td>
                    <td className="p-3">Loaded only after you select Accept and only on those content pages.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Remembering your choice</h2>
            <p className="mt-2">
              Your choice is saved in this browser’s local storage as “accepted” or
              “rejected” until you clear it or change it in Cookie settings. Rejecting
              optional cookies does not disable essential sign-in or theme storage. You
              can also block or clear cookies through your browser controls.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-1">Third-party technologies</h2>
            <p className="mt-2">
              If you accept, Google Analytics may receive usage information across the
              site, while PostHog analytics and session recording are enabled only on the
              public homepage and expense guide. Google AdSense may use cookies or similar
              identifiers to serve, measure, and personalize ads, subject to your settings
              and applicable requirements. Exact identifiers and their lifetimes are
              managed by these providers and may change. Google’s advertising choices are
              available at{" "}
              <a className="underline" href="https://myadcenter.google.com/" target="_blank" rel="noreferrer">
                Google My Ad Center
              </a>
              . Providers may retain information under their own policies.
            </p>
          </section>

          <section className="rounded-2xl border border-hairline bg-surface-1 p-5">
            <h2 className="font-display text-xl font-bold text-ink-1">Change your choice</h2>
            <p className="mt-2">
              You can reopen the consent controls at any time using the Cookie settings
              button at the bottom of the page.
            </p>
            <button
              type="button"
              onClick={openSettings}
              className="mt-4 rounded-full border border-hairline-strong px-4 py-2 font-semibold text-ink-1 hover:bg-tint-hover"
            >
              Open cookie settings
            </button>
          </section>
        </div>
      </article>
    </PublicSiteLayout>
  );
}
