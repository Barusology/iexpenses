import { getPageMetadata, shouldLoadAdsense } from "./sitePolicy";

describe("public page policy", () => {
  test.each(["/", "/expense-tracking-guide"])(
    "allows AdSense on publisher-content page %s",
    (path) => {
      expect(shouldLoadAdsense(path)).toBe(true);
    },
  );

  test.each([
    "/privacy",
    "/login",
    "/signup",
    "/dashboard",
    "/transactions",
    "/analytics",
    "/profile",
    "/unknown",
  ])("does not load AdSense on non-content page %s", (path) => {
    expect(shouldLoadAdsense(path)).toBe(false);
  });

  test.each(["/login", "/signup", "/dashboard", "/transactions", "/analytics", "/profile"])(
    "marks private or navigation page %s as noindex",
    (path) => {
      expect(getPageMetadata(path).index).toBe(false);
    },
  );

  test("normalizes trailing slashes for public pages", () => {
    expect(getPageMetadata("/expense-tracking-guide/").path).toBe(
      "/expense-tracking-guide",
    );
    expect(shouldLoadAdsense("/expense-tracking-guide/")).toBe(true);
  });
});
