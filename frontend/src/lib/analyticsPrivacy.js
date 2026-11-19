const ANALYTICS_ROUTES = new Set([
  "/",
  "/guides",
  "/guides/track-expenses-without-bank-linking",
  "/guides/receipt-organization-tips",
  "/guides/monthly-spending-check-in",
  "/receipt-scanner",
  "/about",
  "/expense-tracking-guide",
  "/privacy",
  "/cookies",
  "/login",
  "/signup",
  "/dashboard",
  "/transactions",
  "/analytics",
  "/profile",
]);

const AUTH_CREDENTIALS = ["code", "access_token", "id_token", "refresh_token"];

export function getAnalyticsPageLocation(pathname, origin = window.location.origin) {
  const safePath = ANALYTICS_ROUTES.has(pathname) ? pathname : "/other";
  return `${origin}${safePath}`;
}

export function shouldTrackAnalyticsPageView(location) {
  const query = new URLSearchParams(location.search);
  const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
  return !AUTH_CREDENTIALS.some(
    (key) => query.has(key) || hash.has(key),
  );
}
