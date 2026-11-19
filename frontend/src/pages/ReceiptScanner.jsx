import React from "react";
import { ArrowRight, BadgeCheck, ScanLine } from "lucide-react";
import PublicSiteLayout from "@/components/PublicSiteLayout";

const CHECKS = [
  "Compare the extracted amount with the receipt total, including tax and tip.",
  "Confirm the purchase date and currency, especially when traveling.",
  "Choose the category that best matches the purchase you want to review.",
  "Keep the source receipt when you may need it for a return or warranty.",
];

export default function ReceiptScanner() {
  return (
    <PublicSiteLayout>
      <article className="mx-auto max-w-3xl py-12 sm:py-16">
        <header className="border-b border-hairline pb-9">
          <p className="kicker mb-3">Receipt scanning, explained</p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Turn receipt photos into expense drafts you can verify.
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-2">
            Receipt OCR reads printed text in an image and suggests fields such as merchant, date, total, and category. It can speed up entry, but it is a first pass: you stay responsible for checking the details before saving a purchase.
          </p>
          <a href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold" style={{ background: "var(--brand)", color: "var(--brand-fg)" }}>
            Create an account <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </header>

        <div className="space-y-10 py-10 text-base leading-8 text-ink-2">
          <section>
            <ScanLine className="h-6 w-6" style={{ color: "var(--brand)" }} aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-1">What happens during a scan</h2>
            <p className="mt-3">
              A clear image gives recognition software a better chance of reading the receipt. The scanner analyzes visible text and returns a draft; it does not confirm that a charge settled, determine whether a purchase is deductible, or know how you want to categorize a mixed basket. A receipt can contain a subtotal, tax, balance, tip, and final amount, so the largest printed figure is not always the amount you paid.
            </p>
            <p className="mt-3">
              iExpenses uses receipt scanning to help prefill an expense form. You can review the suggested merchant, date, amount, currency, and category before adding the record. If the image is blurry or the result is incomplete, enter the details yourself from the source receipt rather than accepting a guess.
            </p>
          </section>

          <section>
            <BadgeCheck className="h-6 w-6" style={{ color: "var(--brand)" }} aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-1">A quick verification checklist</h2>
            <ul className="mt-4 space-y-3">
              {CHECKS.map((check) => (
                <li key={check} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--brand)" }} />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">Make a better image</h2>
            <p className="mt-3">
              Place the receipt on a flat surface with even light. Keep the full total and date in frame, avoid glare, and make sure small decimal marks are in focus. If a long receipt will not fit clearly, take overlapping images only if the workflow allows you to review the whole purchase; otherwise, key the important values in manually. Thermal-paper receipts can fade, so save a legible copy promptly when you need one.
            </p>
            <p className="mt-3">
              Crop out unrelated paperwork and avoid including other documents in the photo. Receipts may display partial payment information, loyalty numbers, addresses, or order identifiers. Only capture what is useful for your record, and check the service privacy information before sending an image to an online scanner.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-ink-1">Know the limits and the data handling</h2>
            <p className="mt-3">
              OCR quality varies with print, language, layout, image quality, and currency. Handwritten tips, faded ink, unusual date formats, and receipts with multiple totals are common sources of errors. Recognition is not a substitute for checking a bank or card record when you need to confirm the amount actually charged. It also cannot tell whether an expense is appropriate for your circumstances.
            </p>
            <p className="mt-3">
              Image processing may use an external service. Before using a scanner, read its privacy policy to understand which providers process the image, whether a copy is retained, and how to request deletion. iExpenses account and data practices are described in the <a className="underline underline-offset-4" href="/privacy">privacy policy</a>. Do not upload sensitive images that are not needed to record an expense.
            </p>
          </section>

          <section className="border-t border-hairline pt-8">
            <h2 className="font-display text-2xl font-bold text-ink-1">Build a complete receipt routine</h2>
            <p className="mt-3">
              Scanning works best when it fits into a larger habit: capture the receipt, check the draft, file the source if needed, and review the entry later with the rest of the month. See our <a className="underline underline-offset-4" href="/guides/receipt-organization-tips">receipt organization guide</a> for a simple paper and digital filing routine, or browse all <a className="underline underline-offset-4" href="/guides">personal expense guides</a>.
            </p>
          </section>
        </div>
      </article>
    </PublicSiteLayout>
  );
}
