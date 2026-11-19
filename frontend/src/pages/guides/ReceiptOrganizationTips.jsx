import React from "react";
import EditorialGuide from "@/components/EditorialGuide";

const sections = [
  {
    title: "Give every receipt a simple destination",
    paragraphs: [
      `Receipt organization works best when the next step is obvious. Decide where paper receipts go when you leave a shop and where digital receipts go when they arrive. A small envelope, a labeled folder, or a dedicated inbox can prevent slips from spreading across a desk, wallet, and email account. The system does not need to be elaborate; it needs to make it easy to find a receipt when you need to verify a purchase.`,
      `Choose whether to sort by month, household member, or broad expense type. For most personal spending reviews, month-based folders are easy to maintain because they match the review period. If you also need records for reimbursement, warranty, or tax purposes, create a separate clearly named folder for those documents and follow the requirements that apply to your situation. Personal tracking is not a replacement for official recordkeeping rules.`,
    ],
  },
  {
    title: "Capture useful details before the ink fades",
    paragraphs: [
      `Paper receipts can fade, become damaged, or disappear. If a purchase matters to your records, capture the date, merchant, amount, and currency soon after paying. A phone photo can preserve a readable copy, but check focus and lighting before putting the original away. Include the full total and date while avoiding unrelated documents or personal information in the frame.`,
      `Use a consistent filename for digital copies, such as a date followed by a merchant and a short purpose. For example, “2026-11-19-market-groceries” is easier to search than “IMG_0412.” If your file system supports folders, put the image in the relevant month and avoid relying on filenames alone. A naming convention only helps if you use it consistently.`,
      `Digital purchases often arrive in email or an account portal. Save the confirmation or invoice in the same monthly location as paper scans, or record the transaction details in your tracker and keep the original message searchable. Be cautious with links and attachments: verify the sender before opening files, especially messages that claim a payment failed or request account credentials.`,
    ],
  },
  {
    title: "Turn receipt lines into a clear expense entry",
    paragraphs: [
      `A receipt can contain many item lines, discounts, deposits, taxes, tips, and payment details. Decide what your ledger is designed to represent. If your goal is a monthly record of money spent, the amount paid is usually the useful starting point. If you want item-level analysis, you will need more detail and more time. Do not mix line-item totals in some entries with final amounts in others.`,
      `Choose categories based on how you intend to review the records. A receipt from a large store may include groceries, cleaning supplies, and pharmacy items. You can classify the whole purchase by its main purpose or split it if the distinction matters. Splitting every mixed basket can be tedious, so reserve that effort for cases where the extra detail changes a decision or answers a repeated question.`,
      `When an expense is shared or reimbursed, note the arrangement rather than relying on memory. You might record your own share, the full payment with a note, or the original expense and later reimbursement separately. Each method affects totals differently. Select one rule and use it in future periods, or make a clear note when a change is necessary.`,
    ],
  },
  {
    title: "Use OCR as a first pass, not as the final record",
    paragraphs: [
      `Optical character recognition can read printed text and suggest merchant, date, and total values from a receipt image. It can reduce typing, but it does not understand every receipt layout. Faded ink, thermal paper, unusual typefaces, narrow decimals, foreign date formats, and handwritten tips can all create errors. Treat every extracted value as a draft that needs a quick human review.`,
      `Check the final amount against the amount charged or paid, not just the largest number on the page. A subtotal, tax line, balance, and total may all look plausible to software. Confirm the date and currency too, especially when traveling or when the receipt uses a day-month order. If a suggested category is not right, change it before saving. Keeping the original receipt image can help resolve an uncertainty later.`,
      `Before uploading images to a scanning tool, read how the service processes and stores them. A receipt may include a partial payment-card number, loyalty identifier, address, or other details that are not required for categorization. Crop the image when practical, avoid uploading unrelated paperwork, and do not assume that scanning means the image is automatically deleted.`,
    ],
  },
  {
    title: "Keep the archive useful and proportionate",
    paragraphs: [
      `At the end of each month, reconcile the entries you care about against receipts or other source records. Look for duplicates, missing tips, refunds, and receipts whose totals differ from the saved entry. Mark an unresolved item for follow-up rather than silently changing a number to make it fit. The point is a record you can interpret later, not a perfect archive of every scrap of paper.`,
      `Set a retention rule based on why you keep a document. Some receipts matter only long enough to confirm a personal expense; others may support a warranty, return, reimbursement, or formal filing. Requirements vary by jurisdiction and circumstance, so consult an appropriate professional for legal or tax retention questions. Avoid keeping sensitive information indefinitely just because storage is cheap.`,
      `A short monthly cleanup can keep the system manageable: move loose paper into its folder, delete accidental duplicates, make sure digital copies open, and remove files you no longer need under your chosen policy. Back up important records in a secure location. Test that the backup can be opened; an archive that cannot be found or restored does not help during a review.`,
    ],
  },
];

export default function ReceiptOrganizationTips() {
  return (
    <EditorialGuide
      title="How to Digitize and Categorize Paper Receipts for Monthly Budgeting"
      description="A practical workflow for collecting paper and digital receipts, checking OCR results, and keeping a searchable monthly record."
      updated="November 19, 2026"
      sections={sections}
    />
  );
}
