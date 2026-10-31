// Manual visual check: node e2e/screenshots.mjs <outDir>  (needs `npm run preview` running)
import { chromium, devices } from 'playwright';
const out = process.argv[2] ?? 'screenshots';
const base = 'http://localhost:4173';

async function setup(page) {
  await page.addInitScript(() => (window.__EMT_AUDIO__ = 'fake'));
  await page.goto(base);
  await page.fill('#nick', 'Star');
  await page.click('[data-testid=create-profile]');
  await page.getByText('Skip the tutorial').click();
}
async function mission(page, cat, id) {
  await page.click(`[data-testid=place-${cat}]`);
  await page.click(`[data-testid=mission-${id}]`);
  await page.click('[data-testid=begin-mission]');
  await page.waitForSelector('[data-phase=active]');
}

const b = await chromium.launch();
for (const [name, ctxOpts] of [
  ['phone', devices['Pixel 7']],
  ['tablet', { viewport: { width: 820, height: 1180 }, hasTouch: true }],
  ['desktop', { viewport: { width: 1366, height: 900 } }],
]) {
  const ctx = await b.newContext(ctxOpts);
  const page = await ctx.newPage();
  await setup(page);
  await page.screenshot({ path: `${out}/${name}-home.png`, fullPage: true });
  await mission(page, 'listen-discover', 'ld-y1-m1');
  await page.screenshot({ path: `${out}/${name}-listening.png` });
  await page.click('[data-testid=pause-mission]').catch(() => {});
  await page.getByRole('button', { name: 'Pause mission' }).click();
  await page.click('[data-testid=leave-mission]');
  await page.click('[data-testid=place-word-explorer]');
  await page.click('[data-testid=mission-we-y1-m1]');
  await page.click('[data-testid=begin-mission]');
  await page.click('[data-testid=begin-mission]');
  await page.waitForSelector('[data-phase=active]');
  const opt = await page.locator('[data-option-id]').first().getAttribute('data-option-id');
  await page.click(`[data-option-id="${opt}"]`);
  await page.click('[data-testid=check-answer]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/${name}-feedback.png` });
  await ctx.close();
}
await b.close();
