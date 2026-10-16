import { test, expect, type Page } from "@playwright/test";
import { profile } from "../../src/content/profile";

const input = (page: Page) => page.getByRole("textbox", { name: "Terminal command" });
const log = (page: Page) => page.getByRole("log");

async function run(page: Page, cmd: string) {
  await input(page).fill(cmd);
  await input(page).press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(input(page)).toBeVisible();
});

const cases: Array<[string, string | RegExp]> = [
  ["help", "experience"],
  ["about", profile.name],
  ["experience", "Nimbus Labs"],
  ["projects", "TaskFlow"],
  ["skills", "TypeScript"],
  ["education", "MSc Computer Science"],
  ["contact", "alex.morgan@example.com"],
];

for (const [cmd, expected] of cases) {
  test(`command "${cmd}" shows expected output`, async ({ page }) => {
    await run(page, cmd);
    await expect(log(page)).toContainText(expected);
  });
}

test('command "clear" empties the log and hides the welcome', async ({ page }) => {
  await run(page, "about");
  await expect(log(page)).toContainText(profile.name);
  await run(page, "clear");
  await expect(log(page)).toBeEmpty();
  await expect(page.getByRole("heading", { name: profile.name })).toHaveCount(0);
});

test("unknown command shows not found message", async ({ page }) => {
  await run(page, "foo");
  await expect(log(page)).toContainText('command not found: foo. Type "help" to see available commands.');
});

test("experience 99 shows usage", async ({ page }) => {
  await run(page, "experience 99");
  await expect(log(page)).toContainText("experience [n]");
});

test("no horizontal overflow at 375px after projects", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await run(page, "projects");
  await expect(log(page)).toContainText("TaskFlow");
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sw).toBeLessThanOrEqual(375);
});

test("text in output is selectable via triple click", async ({ page }) => {
  await run(page, "about");
  await page.getByText(profile.bio).click({ clickCount: 3 });
  const sel = await page.evaluate(() => window.getSelection()?.toString() ?? "");
  expect(sel.trim().length).toBeGreaterThan(0);
});

test("keyboard: Tab reaches welcome buttons then input; Enter on a button runs it", async ({ page }) => {
  const buttons = page.locator("section button");
  const n = await buttons.count();
  expect(n).toBeGreaterThan(0);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  const focusedNames: string[] = [];
  for (let i = 0; i < n; i++) {
    await page.keyboard.press("Tab");
    focusedNames.push(await page.evaluate(() => document.activeElement?.tagName ?? ""));
  }
  expect(focusedNames.every((t) => t === "BUTTON")).toBe(true);
  await page.keyboard.press("Tab");
  await expect(input(page)).toBeFocused();

  await buttons.first().focus();
  const label = (await buttons.first().innerText()).trim();
  await page.keyboard.press("Enter");
  await expect(log(page)).toContainText(label);
  await expect(log(page)).not.toBeEmpty();
});
