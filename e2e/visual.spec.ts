// Screenshot tour for manual review. Runs only with VISUAL_DIR set:
//   VISUAL_DIR=shots npx playwright test visual --project=desktop
import { test } from '@playwright/test';
import { newPlayer, openMission, playWholeMission } from './helpers';

const dir = process.env.VISUAL_DIR;
test.skip(!dir, 'visual tour only runs when VISUAL_DIR is set');

for (const [name, viewport] of [
  ['phone', { width: 412, height: 915 }],
  ['desktop', { width: 1366, height: 900 }],
] as const) {
  test(`visual tour ${name}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize(viewport);
    await newPlayer(page);
    await openMission(page, 'story-adventure', 'sa-y1-m1');
    await page.screenshot({ path: `${dir}/${name}-story.png`, fullPage: true });
    await playWholeMission(page);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${dir}/${name}-results-mid.png` });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${dir}/${name}-results.png`, fullPage: true });
    await page.click('[data-testid=results-album]');
    await page.getByRole('tab', { name: /Story Treehouse/ }).click();
    await page.click('[data-tray-sticker="story-adventure-starter"]');
    await page.click('[data-testid=postcard]', { position: { x: 100, y: 80 } });
    await page.screenshot({ path: `${dir}/${name}-album.png`, fullPage: true });
    await page.getByRole('button', { name: 'Back' }).click();
    await openMission(page, 'word-explorer', 'we-y1-m1');
    for (let i = 0; i < 5; i++) {
      const { answerAndContinue } = await import('./helpers');
      await answerAndContinue(page);
    }
    await page.screenshot({ path: `${dir}/${name}-sort.png`, fullPage: true });
  });
}
