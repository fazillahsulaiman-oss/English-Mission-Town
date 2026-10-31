import { expect, test, type Page } from '@playwright/test';

async function openDemo(page: Page) {
  await page.goto('/#demo');
  await expect(page.getByTestId('demo-screen')).toBeVisible({ timeout: 15_000 });
}

async function answerQ1(page: Page, id: 'has' | 'have' | 'having') {
  await page.click(`[data-demo-option="${id}"]`);
  await page.click('[data-testid=demo-check]');
}

async function tapArrange(page: Page, order: string[]) {
  for (let i = 0; i < order.length; i++) {
    await page.click(`[data-tile-id="${order[i]}"]`);
    await page.click(`[data-slot-button="slot-${i}"]`);
  }
}

test('navigation anchors point at real sections', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  for (const h of hrefs.filter((x) => x !== '#')) {
    expect(await page.locator(h).count(), h).toBe(1);
  }
  await page.getByRole('link', { name: 'Lihat Pakej Bermula RM49' }).click();
  await expect(page.locator('#pakej')).toBeInViewport();
  await page.getByRole('link', { name: 'Cuba Demo' }).first().click();
  await expect(page.locator('#demo')).toBeInViewport();
});

test('purchase buttons stay as placeholders and nothing claims a purchase', async ({ page }) => {
  await page.goto('/');
  const ctas = page.locator('[data-cta=purchase]');
  await expect(ctas).toHaveCount(2);
  await expect(ctas.nth(0)).toHaveText('Pilih BASIC — RM49');
  await expect(ctas.nth(1)).toHaveText('Pilih PRO — RM89');
  for (const a of await ctas.all()) await expect(a).toHaveAttribute('href', '#');
  await ctas.nth(1).click();
  await expect(page.getByText(/berjaya/i)).toHaveCount(0);
  await expect(page.locator('.plan-ribbon')).toHaveText('Pilihan Lebih Lengkap');
});

test('customer page has no unverified claims, internal notes or emoji', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(500);
  const text = await page.locator('body').innerText();
  const forbidden = [/KPM approved/i, /diiktiraf/i, /100% ikut silibus/i, /testimoni/i, /wang dikembalikan/i, /jaminan/i, /Paling Laris/i, /seumur hidup/i, /WhatsApp/i, /sijil/i, /proven/i, /terhad/i, /Cadangan nilai/i, /belum disahkan/i, /Perlu dibina/i, /Harga Promo/i, /Jimat/i, /RM25\b/, /RM30\b/, /RM160/, /RM480/, /Tempoh akses/i, /Berapa lama tempoh akses/i];
  for (const f of forbidden) expect(text, String(f)).not.toMatch(f);
  expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
  await expect(page.locator('[data-owner-only]')).toHaveCount(0);
  await expect(page.locator('s')).toHaveCount(0);
  await expect(page.getByText('Dibangunkan dengan rujukan kurikulum English sekolah rendah Malaysia.')).toBeVisible();
});

test('owner review page shows pending items separately', async ({ page }) => {
  await page.goto('/owner.html');
  await expect(page.getByText('Mod semakan pemilik.')).toBeVisible();
  await expect(page.getByText('Cadangan nilai: RM25 — belum disahkan.').first()).toBeVisible();
  await expect(page.getByText(/Perlu dibina dalam produk/).first()).toBeVisible();
  await expect(page.getByText(/Tempat harga asal berpalang/).first()).toBeVisible();
  await expect(page.getByText(/Perlu pengesahan pemilik/)).toBeVisible();
});

test('demo: wrong answer, hint, retry, tap-arrange, scorecard and restart', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByTestId('pointer-hand')).toBeVisible();
  await answerQ1(page, 'have');
  await expect(page.getByTestId('pointer-hand')).toHaveCount(0);
  await expect(page.getByTestId('demo-feedback-wrong')).toContainText('Try again!');
  await expect(page.getByTestId('demo-feedback-wrong')).toContainText('Use ‘has’ with ‘she’.');
  // Double-clicking Check is ignored while feedback shows.
  await page.click('[data-testid=demo-retry]');
  await answerQ1(page, 'has');
  await expect(page.getByTestId('demo-feedback-correct')).toContainText('Brilliant!');
  await expect(page.getByTestId('demo-feedback-correct')).toContainText('You kept trying and got it!');
  await page.click('[data-testid=demo-next]');

  await expect(page.getByText('Question 2 of 2')).toBeVisible();
  await expect(page.getByTestId('pointer-hand')).toBeVisible();
  await tapArrange(page, ['aina', 'plays', 'badminton', 'stop']);
  await expect(page.locator('.q2-preview')).toHaveText('Aina plays badminton.');
  await page.click('[data-testid=demo-check]');
  await expect(page.getByTestId('demo-feedback-correct')).toBeVisible();
  await page.click('[data-testid=demo-next]');

  const results = page.getByTestId('demo-results');
  await expect(results).toContainText('Congratulations!');
  await expect(page.getByTestId('demo-score')).toHaveText('1 / 2');
  await expect(page.getByTestId('demo-stars')).toHaveAttribute('data-stars', '2');
  await expect(page.getByTestId('demo-retry-count')).toHaveText('1');
  await expect(page.getByTestId('demo-sticker')).toContainText('Rainbow Tiger');
  await expect(results).not.toContainText('8/8');
  await expect(results.getByRole('link', { name: 'Lihat Pakej' })).toHaveAttribute('href', '#pakej');
  await page.click('[data-testid=demo-restart]');
  await expect(page.getByText('Question 1 of 2')).toBeVisible();
});

test('demo: perfect run with drag and drop gives 2/2 and three stars, with effects', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await openDemo(page);
  await expect(page.getByTestId('demo-fx-canvas')).toHaveCSS('pointer-events', 'none');
  await answerQ1(page, 'has');
  await expect(page.getByTestId('demo-feedback-correct')).toBeVisible();
  // The celebration canvas is drawing.
  const drawn = await page.getByTestId('demo-fx-canvas').evaluate(async (c: HTMLCanvasElement) => {
    await new Promise((r) => setTimeout(r, 600));
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4 * 97) if (d[i]! > 0) return true;
    return false;
  });
  expect(drawn).toBe(true);
  await page.click('[data-testid=demo-next]');
  await page.locator('[data-target-id="slot-0"]').scrollIntoViewIfNeeded();
  const order = ['aina', 'plays', 'badminton', 'stop'];
  for (let i = 0; i < order.length; i++) {
    const a = (await page.locator(`[data-tile-id="${order[i]}"]`).boundingBox())!;
    const b = (await page.locator(`[data-target-id="slot-${i}"]`).boundingBox())!;
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(a.x + a.width / 2 + 15, a.y + a.height / 2, { steps: 4 });
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 10 });
    await page.waitForTimeout(120);
    await page.mouse.move(b.x + b.width / 2 + 1, b.y + b.height / 2 + 1);
    await page.mouse.up();
    await expect(page.locator(`[data-target-id="slot-${i}"] [data-tile-id="${order[i]}"]`)).toBeVisible();
  }
  await page.click('[data-testid=demo-check]');
  await page.click('[data-testid=demo-next]');
  await expect(page.getByTestId('demo-score')).toHaveText('2 / 2');
  await expect(page.getByTestId('demo-stars')).toHaveAttribute('data-stars', '3');
  await expect(page.getByTestId('demo-retry-count')).toHaveText('0');
});

test('demo: three wrong tries reveal the answer; 0/2 gives one participation star', async ({ page }) => {
  await openDemo(page);
  for (const id of ['have', 'having', 'have'] as const) {
    await answerQ1(page, id);
    if (await page.getByTestId('demo-retry').isVisible()) await page.click('[data-testid=demo-retry]');
  }
  await expect(page.getByTestId('demo-feedback-revealed')).toContainText('The answer is: has');
  await page.click('[data-testid=demo-next]');
  for (let t = 0; t < 3; t++) {
    if (await page.getByTestId('demo-reset').isEnabled()) await page.click('[data-testid=demo-reset]');
    await tapArrange(page, ['badminton', 'aina', 'plays', 'stop']);
    await page.click('[data-testid=demo-check]');
    if (t < 2) await page.click('[data-testid=demo-retry]');
  }
  await page.click('[data-testid=demo-next]');
  await expect(page.getByTestId('demo-score')).toHaveText('0 / 2');
  await expect(page.getByTestId('demo-stars')).toHaveAttribute('data-stars', '1');
  await expect(page.getByTestId('demo-results')).toContainText('1 star for finishing your mission!');
});

test('demo: reset clears the sentence, sound and gentle toggles work', async ({ page }) => {
  await openDemo(page);
  await answerQ1(page, 'has');
  await page.click('[data-testid=demo-next]');
  await tapArrange(page, ['aina', 'plays']);
  await expect(page.locator('.q2-preview')).toHaveText('Aina plays');
  await page.click('[data-testid=demo-reset]');
  await expect(page.locator('[data-target-id="slot-0"] [data-tile-id]')).toHaveCount(0);
  await page.click('[data-testid=demo-sound]');
  await expect(page.getByTestId('demo-sound')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('demo-sound')).toContainText('Senyap');
  await page.click('[data-testid=demo-gentle]');
  await expect(page.getByTestId('demo-gentle')).toHaveAttribute('aria-pressed', 'true');
});

test('reduced motion: no particle canvas, static sparkles, no pointer hand', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDemo(page);
  await expect(page.getByTestId('pointer-hand')).toHaveCount(0);
  await expect(page.getByTestId('demo-fx-canvas')).toHaveCount(0);
  await answerQ1(page, 'has');
  await expect(page.getByTestId('demo-static-sparkles')).toBeVisible();
});

test('FAQ accordion works with the keyboard; access-period question is hidden', async ({ page }) => {
  await page.goto('/#soalan');
  const btn = page.getByRole('button', { name: 'Ada had masa?' });
  await btn.focus();
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Boleh pilih 30 saat setiap soalan')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Berapa lama tempoh akses?')).toHaveCount(0);
});

for (const width of [360, 390, 768, 1440]) {
  test(`layout at ${width}px has no horizontal overflow and large CTAs`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const heights = await page.locator('main .btn').evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent).map((e) => e.getBoundingClientRect().height));
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
  });
}

test('embeds in an iframe on another origin and the demo works inside it', async ({ page }) => {
  await page.goto('http://localhost:4181/');
  const frame = page.frameLocator('#emt-sales');
  await expect(frame.getByRole('heading', { level: 1 })).toContainText('Anak Suka Main Game?');
  await frame.locator('#demo').scrollIntoViewIfNeeded();
  await frame.locator('[data-demo-option="has"]').click();
  await frame.getByTestId('demo-check').click();
  await expect(frame.getByTestId('demo-feedback-correct')).toBeVisible();
});
