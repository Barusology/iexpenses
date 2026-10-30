import React from "react";
import { useCookieConsent } from "@/context/CookieConsentContext";

export default function CookieConsent() {
  const { consent, chooseConsent, settingsOpen, openSettings } = useCookieConsent();
  const isOpen = consent === "unset" || settingsOpen;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={openSettings}
        className="fixed bottom-3 right-3 z-40 rounded-full border border-hairline-strong bg-surface-1 px-3 py-2 text-xs font-medium text-ink-2 shadow-lg hover:text-ink-1"
      >
        Cookie settings
      </button>
    );
  }

  return (
    <section
      aria-label="Cookie choices"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-hairline-strong bg-surface-1 p-5 text-ink-1 shadow-2xl sm:inset-x-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-lg font-bold">Your cookie choices</h2>
          <p className="mt-1 text-sm leading-6 text-ink-2">
            Essential storage keeps sign-in and your preferences working. With your
            permission, Google Analytics and advertising cookies may be used; AdSense
            loads only on our public content pages. Read the{" "}
            <a className="underline" href="/cookies">cookie policy</a>.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => chooseConsent("rejected")}
            className="rounded-full border border-hairline-strong px-4 py-2 text-sm font-semibold hover:bg-tint-hover"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => chooseConsent("accepted")}
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
