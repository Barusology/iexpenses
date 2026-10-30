export const COOKIE_CONSENT_KEY = "iexpenses-cookie-consent";

const VALID_CHOICES = new Set(["accepted", "rejected"]);

export function getCookieConsent() {
  const choice = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return VALID_CHOICES.has(choice) ? choice : "unset";
}

export function saveCookieConsent(choice) {
  if (!VALID_CHOICES.has(choice)) {
    throw new Error(`Invalid cookie consent choice: ${choice}`);
  }
  window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
}
