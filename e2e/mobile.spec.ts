import { expect, test } from '@playwright/test';
import { answerAndContinue, check, currentQuestion, newPlayer, openMission } from './helpers';

async function noHorizontalScroll(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test('phone: home, missions and game fit without horizontal scrolling and with large targets', async ({ page }) => {
  await newPlayer(page);
  await noHorizontalScroll(page);
  const sizes = await page.locator('.btn').evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent).map((e) => e.getBoundingClientRect()).map((r) => Math.min(r.width, r.height)));
  expect(Math.min(...sizes)).toBeGreaterThanOrEqual(44);
  await openMission(page, 'sentence-builder', 'sb-y1-m1');
  await noHorizontalScroll(page);
  // Tap alternative to dragging on a touch device.
  const q = await currentQuestion(page);
  if (q.activityType !== 'ordering') throw new Error('expected ordering');
  for (let i = 0; i < q.acceptedAnswers[0]!.length; i++) {
    await page.tap(`[data-tile-id="${q.acceptedAnswers[0]![i]}"]`);
    await page.tap(`[data-slot-button="slot-${i}"]`);
  }
  await check(page);
  await expect(page.getByTestId('feedback-correct')).toBeVisible();
  await page.tap('[data-testid=next]');
  await answerAndContinue(page);
  await noHorizontalScroll(page);
});

test('phone: story and matching layouts fit', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'story-adventure', 'sa-y1-m1');
  await noHorizontalScroll(page);
  for (let i = 0; i < 6; i++) await answerAndContinue(page);
  await noHorizontalScroll(page);
});
