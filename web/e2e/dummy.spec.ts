import { test, expect } from "@playwright/test";

test("smoke", async ({ page }) => {
  await page.goto("about:blank");
  expect(true).toBeTruthy();
});
