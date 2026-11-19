import React from "react";
import EditorialGuide from "@/components/EditorialGuide";

const sections = [
  {
    title: "Start with a clear reason to track",
    paragraphs: [
      `A spending record is most useful when you know what you want to learn from it. Perhaps you want to understand how often you buy lunch near work, prepare for a month with several annual bills, or see whether household costs have shifted. Write down one question before choosing a system. It helps you collect enough detail to answer that question without making every purchase an administrative task.`,
      `Tracking without connecting a bank account means you enter or import transactions yourself rather than granting an app access to account activity. That choice trades automatic coverage for direct control over what enters the tracker. It can suit people who prefer not to connect financial accounts, who track cash purchases, or who want one view across several payment methods. It also requires a repeatable routine; a manual ledger cannot record a purchase you never add.`,
    ],
  },
  {
    title: "Choose a capture method you can maintain",
    paragraphs: [
      `A notebook, spreadsheet, or dedicated expense app can all work. Choose the simplest option that can store the fields you need and can be reviewed later. A notebook is quick and independent of a device, but totals and searches take effort. A spreadsheet makes sorting and formulas possible, though the structure is yours to maintain. An app can make entry and charts easier, but you should review its privacy policy, account controls, export options, and any third-party services it uses.`,
      `Pick a capture moment that already exists in your week. You might enter a purchase after paying, photograph a paper receipt and record it that evening, or collect receipts in one place for a short Sunday review. The right rhythm is the one you can repeat. If immediate entry feels distracting, keep a temporary note with the date, merchant, amount, and currency, then transfer it before details blur.`,
      `Start with a small set of fields: date, amount, currency, merchant, and category. Add a short note only when it explains something that a category cannot, such as a reimbursement, a shared bill, or an unusual one-time purchase. Avoid collecting sensitive details that do not help your review. A purchase description rarely needs a card number, account credential, or a full image of an identity document.`,
    ],
  },
  {
    title: "Use source records without sharing account access",
    paragraphs: [
      `You can reconstruct entries from receipts, cash notes, emailed order confirmations, or statements you retrieve yourself. These sources have different strengths. Receipts tend to show merchant, date, and item detail; a card statement can confirm a posted total; cash spending may require a note made at the time. Reconcile from the source that answers your question, and do not assume one document contains the whole story.`,
      `If you choose to use a spreadsheet or app, entering the information manually does not automatically make it private. Files may sync to cloud accounts, be shared through links, or appear in device backups. Use a strong device passcode, protect cloud accounts with multi-factor authentication, limit who can access a shared file, and periodically export or delete records you no longer need. These are general precautions, not a guarantee of security.`,
      `An app that offers receipt recognition may process an image through an external service. Before uploading, find out whether images are stored, how long they are kept, and which providers may process them. Crop unrelated information from a receipt image when possible, and verify extracted fields before saving. Do not upload documents containing information that is unrelated to the expense.`,
    ],
  },
  {
    title: "Make categories consistent, not complicated",
    paragraphs: [
      `A category system should help you compare similar purchases. Begin with a short list that fits your life: housing, utilities, groceries, transportation, health, eating out, and other personal spending are common starting points. Your own list may differ. If two labels are hard to distinguish at the moment of entry, combine them first; a category that is applied consistently is more useful than a detailed scheme that changes every week.`,
      `Set a rule for awkward transactions before you encounter many of them. For a mixed shopping receipt, you could use the main purpose or split it into parts. For a shared meal, you could record your portion or the full amount and note the reimbursement. For a refund, you could enter a negative adjustment if your system supports it or record a separate correction. There is no universal method, but changing the rule from month to month makes comparisons harder.`,
      `Keep reimbursable purchases and transfers in mind when reading totals. Moving money between your own accounts is not usually a purchase, while paying a bill is. A credit-card payment can duplicate expenses if you already recorded each card transaction. Decide whether your ledger tracks purchases or account cash flow; mixing the two produces totals that are difficult to interpret.`,
    ],
  },
  {
    title: "Review gaps without turning tracking into a chore",
    paragraphs: [
      `Once a week, check whether you have receipts or notes that are not in the ledger. Look for missing dates, duplicate entries, refunds, and amounts that do not match a source record. A quick check is usually enough. If you have to reconstruct a full month from memory, record that as a limitation rather than presenting estimates as exact figures.`,
      `At month end, compare the same categories and dates each time. Ask what changed and whether it was recurring, seasonal, planned, or unusual. A month with travel or a repair may not represent an ordinary month. Several months of records offer better context than one high or low total, but even a longer history describes only what you chose and managed to record.`,
      `Finish with one small follow-up question. You might check whether a subscription is still useful, look for a bill that changed, or set a reminder for a predictable annual expense. Tracking is a descriptive tool, not a substitute for a budget, personalized financial advice, or a decision about what you can afford. Keep the system honest about what it includes, and adapt it when your circumstances change.`,
    ],
  },
];

export default function TrackWithoutBankLinking() {
  return (
    <EditorialGuide
      title="How to Track Daily Expenses Without Linking Your Bank Account"
      description="A practical approach to recording purchases manually, using your own source records, and reviewing spending while keeping bank-account access separate."
      updated="November 19, 2026"
      sections={sections}
    />
  );
}
