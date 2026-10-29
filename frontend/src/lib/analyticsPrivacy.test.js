import {
  getAnalyticsPageLocation,
  shouldTrackAnalyticsPageView,
} from "./analyticsPrivacy";

describe("analytics URL privacy", () => {
  test("uses only allowlisted paths and omits URL parameters", () => {
    expect(
      getAnalyticsPageLocation("/dashboard", "https://example.test"),
    ).toBe("https://example.test/dashboard");
    expect(
      getAnalyticsPageLocation("/dashboard?access_token=secret", "https://example.test"),
    ).toBe("https://example.test/other");
    expect(
      getAnalyticsPageLocation("/unexpected/secret", "https://example.test"),
    ).toBe("https://example.test/other");
  });

  test.each([
    ["?code=secret", ""],
    ["", "#access_token=secret"],
    ["", "#id_token=secret"],
    ["?refresh_token=secret", ""],
  ])("suppresses auth callback URLs (%s %s)", (search, hash) => {
    expect(shouldTrackAnalyticsPageView({ search, hash })).toBe(false);
  });

  test("allows ordinary routes without auth credentials", () => {
    expect(shouldTrackAnalyticsPageView({ search: "", hash: "" })).toBe(true);
  });
});
