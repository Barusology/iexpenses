export const SITE_ORIGIN = "https://iexpenses.xyz";

const PAGE_METADATA = {
  "/": {
    title: "iExpenses - Personal Expense Tracker & AI Receipt Scanner",
    description:
      "Track daily personal expenses, scan receipts with AI OCR, and analyze monthly spending categories without linking your bank account.",
    index: true,
  },
  "/guides": {
    title: "Personal Expense Guides | iExpenses",
    description:
      "Practical, step-by-step guides to tracking purchases, organizing receipts, and building a useful monthly spending review.",
    index: true,
  },
  "/guides/track-expenses-without-bank-linking": {
    title: "How to Track Expenses Without Linking Your Bank | iExpenses",
    description:
      "A practical method for recording personal expenses manually, protecting account access, and building a useful spending history.",
    index: true,
  },
  "/guides/receipt-organization-tips": {
    title: "How to Organize Receipts for Monthly Budgeting | iExpenses",
    description:
      "Learn how to capture, verify, categorize, and review paper and digital receipts as part of a consistent monthly spending routine.",
    index: true,
  },
  "/guides/monthly-spending-check-in": {
    title: "A 15-Minute Monthly Spending Check-In | iExpenses",
    description:
      "Use a concise monthly review to check records, understand category changes, and choose a realistic next step.",
    index: true,
  },
  "/receipt-scanner": {
    title: "AI Receipt Scanner for Personal Expenses | iExpenses",
    description:
      "Learn how receipt OCR can extract purchase details, what to verify before saving, and how iExpenses handles the scanning workflow.",
    index: true,
  },
  "/about": {
    title: "About iExpenses | Personal Expense Tracking",
    description:
      "Learn about iExpenses, a personal expense tracker for recording purchases, organizing spending, and reviewing your own records.",
    index: true,
  },
  "/expense-tracking-guide": {
    title: "A Practical Guide to Tracking Monthly Expenses | iEXPENSES",
    description:
      "A step-by-step guide to building an expense-tracking routine, choosing categories, reviewing spending, and keeping useful records.",
    index: true,
  },
  "/privacy": {
    title: "Privacy Policy | iEXPENSES",
    description:
      "Read how iEXPENSES handles account information, expense records, analytics, and advertising technologies.",
    index: true,
  },
  "/cookies": {
    title: "Cookie Policy | iEXPENSES",
    description:
      "Learn which essential and optional cookies iEXPENSES uses and how to accept, reject, or change your cookie choices.",
    index: true,
  },
  "/login": {
    title: "Sign In | iEXPENSES",
    description: "Sign in to your iEXPENSES personal expense tracker.",
    index: false,
  },
  "/signup": {
    title: "Create an Account | iEXPENSES",
    description: "Create an iEXPENSES account to start recording personal expenses.",
    index: false,
  },
  "/dashboard": {
    title: "Dashboard | iEXPENSES",
    description: "Review your private expense dashboard.",
    index: false,
  },
  "/transactions": {
    title: "Transactions | iEXPENSES",
    description: "Review and manage your private expense records.",
    index: false,
  },
  "/analytics": {
    title: "Spending Analytics | iEXPENSES",
    description: "Review private spending summaries and charts.",
    index: false,
  },
  "/profile": {
    title: "Profile | iEXPENSES",
    description: "Manage your iEXPENSES profile and preferences.",
    index: false,
  },
};

const PUBLIC_CONTENT_ROUTES = new Set([
  "/",
  "/guides",
  "/guides/track-expenses-without-bank-linking",
  "/guides/receipt-organization-tips",
  "/guides/monthly-spending-check-in",
  "/receipt-scanner",
  "/expense-tracking-guide",
]);

function normalizePath(pathname) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

export function getPageMetadata(pathname) {
  const path = normalizePath(pathname);
  const metadata = PAGE_METADATA[path];
  if (metadata) return { ...metadata, path };

  return {
    title: "Page Not Found | iEXPENSES",
    description: "The requested iEXPENSES page could not be found.",
    index: false,
    path: "/",
  };
}

export function shouldLoadAdsense(pathname) {
  return PUBLIC_CONTENT_ROUTES.has(normalizePath(pathname));
}

export function shouldLoadPostHog(pathname) {
  return PUBLIC_CONTENT_ROUTES.has(normalizePath(pathname));
}
