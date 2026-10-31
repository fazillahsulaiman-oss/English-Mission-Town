import { expect, test } from '@playwright/test';

test('phone: sticky CTA appears after the hero and hides over the demo and pricing', async ({ page }) => {
  await page.goto('/');
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).not.toHaveClass(/is-visible/);
  await page.locator('#masalah').scrollIntoViewIfNeeded();
  await expect(bar).toHaveClass(/is-visible/);
  await page.locator('[data-testid=demo-screen], .demo-placeholder').first().scrollIntoViewIfNeeded();
  await expect(bar).not.toHaveClass(/is-visible/);
  await page.locator('#pakej').scrollIntoViewIfNeeded();
  await expect(bar).not.toHaveClass(/is-visible/);
});

test('phone: demo playable by tapping', async ({ page }) => {
  await page.goto('/#demo');
  await expect(page.getByTestId('demo-screen')).toBeVisible({ timeout: 15_000 });
  await page.tap('[data-demo-option="has"]');
  await page.tap('[data-testid=demo-check]');
  await page.tap('[data-testid=demo-next]');
  for (const [i, id] of ['aina', 'plays', 'badminton', 'stop'].entries()) {
    await page.tap(`[data-tile-id="${id}"]`);
    await page.tap(`[data-slot-button="slot-${i}"]`);
  }
  await page.tap('[data-testid=demo-check]');
  await page.tap('[data-testid=demo-next]');
  await expect(page.getByTestId('demo-score')).toHaveText('2 / 2');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
