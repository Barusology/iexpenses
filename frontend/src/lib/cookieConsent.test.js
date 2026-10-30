import { getCookieConsent, saveCookieConsent } from "./cookieConsent";

describe("cookie consent preference", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("requires a choice when no preference has been saved", () => {
    expect(getCookieConsent()).toBe("unset");
  });

  test.each(["accepted", "rejected"])("persists the %s choice", (choice) => {
    saveCookieConsent(choice);
    expect(getCookieConsent()).toBe(choice);
  });

  test("rejects invalid choices", () => {
    expect(() => saveCookieConsent("maybe")).toThrow("Invalid cookie consent choice");
  });
});
