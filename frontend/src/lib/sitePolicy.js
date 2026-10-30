const PAGE_METADATA = {
  "/": {
    title: "iEXPENSES | Personal Expense Tracker",
    description:
      "Record everyday spending, organize expenses, and review clear monthly trends with the iEXPENSES personal expense tracker.",
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

const ADSENSE_ROUTES = new Set(["/", "/expense-tracking-guide"]);

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
  return ADSENSE_ROUTES.has(normalizePath(pathname));
}
