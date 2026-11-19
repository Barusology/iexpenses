import React from "react";
import EditorialGuide from "@/components/EditorialGuide";

const sections = [
  {
    title: "Prepare the records before starting the timer",
    paragraphs: [
      `A fifteen-minute check-in is a focused review, not a financial audit. It works best when you have been capturing purchases during the month. Before the review, open the ledger or spreadsheet, gather any receipts or notes you still need, and choose the exact dates for the period. If you have not recorded anything yet, spend this first session building a basic record rather than trying to draw conclusions from memory.`,
      `Use the same time window each month, such as the first through the last calendar day. If your pay schedule or household routine suggests a different interval, choose one and label it clearly. Comparisons are easier when the periods are consistent. A partial month should not be compared casually with a full month, and a one-time event should not be hidden just because it makes the chart less tidy.`,
    ],
  },
  {
    title: "Minutes 0 to 4: check coverage and obvious errors",
    paragraphs: [
      `Begin with completeness. Scan for blank dates, missing categories, duplicate entries, unusually round estimates, and purchases that are still sitting in a receipt folder. Check a few entries against source records rather than rechecking every line. If you use receipt OCR, verify the total, date, and currency on entries that matter; recognition can confuse a subtotal with a final amount or misread a decimal point.`,
      `Look at the boundaries of your period. A purchase may appear on the date it was authorized, posted, or paid, depending on your source. Choose a consistent rule and note it. When a transaction is pending or uncertain, avoid treating it as confirmed until you can verify it. Make corrections while the source is available, and leave an explicit note for anything you cannot resolve during this short session.`,
    ],
  },
  {
    title: "Minutes 4 to 8: read totals in context",
    paragraphs: [
      `Check the overall total and the categories that are most relevant to your original question. Compare like with like: the same category definitions, period length, currency, and treatment of refunds. If you changed your method or categories, write that down so a difference is not mistaken for a real change in spending. A chart shows the values in your records; it cannot tell you whether the records are complete or the categories are appropriate.`,
      `Look for changes large enough to investigate, not tiny movements that may be ordinary variation. A higher grocery total could reflect extra guests, a bulk purchase, or a longer period. A transportation change could come from a trip, a route change, or a different mix of travel. Ask what could explain the observation before labeling it good or bad. The context is often more useful than the number alone.`,
      `Separate recurring costs from occasional ones. Rent, a monthly subscription, and an annual insurance payment affect a month differently. A one-time repair or trip belongs in the record, but it does not necessarily describe a normal month. Consider looking across several periods before deciding that a short-term increase is a lasting pattern.`,
    ],
  },
  {
    title: "Minutes 8 to 12: choose one useful question",
    paragraphs: [
      `Turn a surprising category into a question that can be answered. Instead of “I spend too much,” try “Which purchases made dining out higher this month?” or “Did the utility bill change, or was this a different billing period?” Specific questions help you decide what information to collect next without treating a spending report as a verdict on your choices.`,
      `If the record mixes household and personal purchases, shared expenses, or reimbursements, check whether you are comparing the same basis as last month. A change in the way you split a bill can move category totals even when the underlying household spending did not change. Make the accounting rule visible in a note. If you need a more detailed split, add it only when the benefit is worth the entry effort.`,
      `Use the review to notice missing context. A brief note can explain an annual payment, a move, a medical expense, or a travel week. Keep notes factual and avoid putting sensitive details into a tracker if they are unnecessary. You do not need a personal diary attached to every transaction; a small amount of context for unusual events is often enough.`,
    ],
  },
  {
    title: "Minutes 12 to 15: decide what happens next",
    paragraphs: [
      `End by writing down one observation, one question, and one next action. For example: “The transport category rose after two trips; I will separate travel rides next month.” Or: “A subscription renewed; I will review whether I still use it before the next renewal.” Keep the action small enough to complete. A check-in is more sustainable when it produces a manageable follow-up, not a list of rules that are difficult to keep.`,
      `You may decide that no change is needed. A month can be expensive for understandable reasons, and reducing every category is not the purpose of measurement. Your priorities, obligations, and circumstances determine what actions make sense. An expense tracker can organize what you entered, but it cannot decide what you can afford or replace individualized financial advice.`,
      `Save the review date and any change in method. Next month, repeat the same process and compare the records with those notes in view. Over time, the result is a more useful history: not a perfect prediction, but a clearer account of what happened and which questions deserve attention. If the routine takes longer than fifteen minutes repeatedly, simplify categories or capture details more regularly rather than rushing through an unreliable review.`,
    ],
  },
  {
    title: "A compact review checklist",
    paragraphs: [
      `Use this checklist to keep the session bounded:`,
    ],
    list: [
      "Confirm the dates and check for missing or duplicate entries.",
      "Verify unusual totals against a receipt or other source.",
      "Compare consistent categories and account for one-time events.",
      "Write one observation, one question, and one realistic follow-up.",
    ],
  },
];

export default function MonthlySpendingCheckIn() {
  return (
    <EditorialGuide
      title="The 15-Minute Monthly Spending Check-In Routine"
      description="A focused month-end process for checking the record, understanding meaningful changes, and choosing one practical follow-up."
      updated="November 19, 2026"
      sections={sections}
    />
  );
}
