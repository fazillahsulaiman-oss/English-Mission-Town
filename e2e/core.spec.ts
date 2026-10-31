import { expect, test } from '@playwright/test';
import { answerAndContinue, answerCorrectly, check, currentQuestion, newPlayer, openMission, playWholeMission, waitInteractive } from './helpers';

test('tutorial teaches tap, drag (tap alternative) and submit', async ({ page }) => {
  await page.addInitScript(() => (window.__EMT_AUDIO__ = 'fake'));
  await page.goto('/');
  await page.fill('#nick', 'Ali');
  await page.click('[data-testid=create-profile]');
  await page.click('[data-testid=tutorial-star]');
  await page.click('[data-tile-id="apple"]');
  await page.click('[data-slot-button="basket"]');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.click('[data-testid=tutorial-banana]');
  await page.click('[data-testid=tutorial-check]');
  await page.click('[data-testid=tutorial-done]');
  await page.reload();
  await expect(page.getByTestId('start-mission')).toBeVisible();
  await expect(page.getByText('How to play')).toHaveCount(0);
});

test('complete an eight-question mission, earn a sticker, and keep it after refresh', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'grammar-quest', 'gq-y1-m1');
  await playWholeMission(page);
  await expect(page.getByText('Congratulations!')).toBeVisible();
  await expect(page.getByTestId('score')).toContainText('8/8');
  await expect(page.getByTestId('score')).toContainText('100%');
  await expect(page.getByRole('img', { name: '3 out of 3 stars' })).toBeVisible();
  await expect(page.getByTestId('sticker-reveal')).toContainText('Detective Otter');
  await expect(page.getByTestId('recommendation')).toContainText('ready for');

  // Persistence after refresh.
  await page.click('[data-testid=back-to-town]');
  await page.reload();
  await page.click('[data-testid=open-album]');
  await page.getByRole('tab', { name: /Mystery House/ }).click();
  await expect(page.locator('[data-sticker="grammar-quest-starter"]')).toHaveAttribute('data-unlocked', 'true');
  await expect(page.getByText('1 of 24 stickers collected')).toBeVisible();

  // Place the sticker on the postcard (tap, then tap the postcard) and check it persists.
  await page.click('[data-tray-sticker="grammar-quest-starter"]');
  await page.click('[data-testid=postcard]', { position: { x: 120, y: 90 } });
  await expect(page.locator('[data-placed-sticker="grammar-quest-starter"]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.reload();
  await page.click('[data-testid=open-album]');
  await expect(page.locator('[data-placed-sticker="grammar-quest-starter"]')).toBeVisible();
});

test('replaying a mission does not duplicate rewards', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'grammar-quest', 'gq-y1-m1');
  await playWholeMission(page);
  await expect(page.getByTestId('sticker-reveal')).toBeVisible();
  await page.click('[data-testid=play-again]');
  await playWholeMission(page);
  await expect(page.getByTestId('sticker-reveal')).toHaveCount(0);
  await page.click('[data-testid=back-to-town]');
  await expect(page.locator('[data-testid=place-grammar-quest]')).toContainText('1/3 done');
  await expect(page.getByText('1 of 24 stickers')).toBeVisible();
});

test('wrong answer shows Try again with a hint, then a correct retry is celebrated', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'word-explorer', 'we-y1-m1');
  const q = await currentQuestion(page);
  if (q.activityType !== 'pictureChoice') throw new Error('expected picture choice');
  const wrong = q.options.find((o) => !q.acceptedAnswers.includes(o.id))!;
  await page.click(`[data-option-id="${wrong.id}"]`);
  // Double-clicking Check Answer must only count one attempt.
  await page.locator('[data-testid=check-answer]').dblclick();
  await expect(page.getByTestId('feedback-try-again')).toBeVisible();
  await expect(page.getByText(q.hint).first()).toBeVisible();
  await expect(page.getByText('Try 2 of 3')).toBeVisible();
  await page.click('[data-testid=retry]');
  await answerCorrectly(page, q);
  await check(page);
  await expect(page.getByTestId('feedback-correct')).toBeVisible();
  await expect(page.getByText('You kept trying and got it!')).toBeVisible();
  await page.click('[data-testid=next]');
  for (let i = 1; i < 8; i++) await answerAndContinue(page);
  await expect(page.getByTestId('score')).toContainText('7/8');
  await expect(page.getByTestId('retry-count')).toHaveText('1');
});

test('three wrong attempts reveal the answer and count as supported', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'word-explorer', 'we-y1-m1');
  const q = await currentQuestion(page);
  if (q.activityType !== 'pictureChoice') throw new Error('expected picture choice');
  const wrongs = q.options.filter((o) => !q.acceptedAnswers.includes(o.id));
  for (let i = 0; i < 3; i++) {
    const option = page.locator(`[data-option-id="${wrongs[i]!.id}"]`);
    if (await option.isDisabled()) {
      // The scaffold removed this one; pick another wrong option still available.
      const alt = wrongs.find((w) => w.id !== wrongs[i]!.id);
      await page.click(`[data-option-id="${alt!.id}"]`);
    } else await option.click();
    await check(page);
    if (i < 2) await page.click('[data-testid=retry]');
  }
  await expect(page.getByTestId('feedback-revealed')).toBeVisible();
  await expect(page.getByText('The answer is:')).toBeVisible();
});

test('timeout leads to an untimed supported attempt and no first-try point', async ({ page }) => {
  await page.clock.install();
  await newPlayer(page);
  await openMission(page, 'grammar-quest', 'gq-y1-m3', '30s');
  await expect(page.getByRole('timer')).toBeVisible();
  await page.clock.fastForward(31_000);
  await expect(page.getByTestId('feedback-timeout')).toContainText('Time’s up! Let’s learn together.');
  await page.click('[data-testid=try-untimed]');
  await expect(page.getByText('No timer now. Take your time.')).toBeVisible();
  const q = await currentQuestion(page);
  await answerCorrectly(page, q);
  await check(page);
  await expect(page.getByTestId('feedback-correct')).toBeVisible();
  await page.click('[data-testid=next]');
  // Second question: time out and choose to see the answer.
  await waitInteractive(page);
  await page.clock.fastForward(31_000);
  await page.click('[data-testid=show-answer]');
  await expect(page.getByTestId('feedback-revealed')).toBeVisible();
  await page.click('[data-testid=next]');
  for (let i = 2; i < 8; i++) await answerAndContinue(page);
  await expect(page.getByTestId('score')).toContainText('6/8');
  await expect(page.getByTestId('supported-count')).toHaveText('2');
});

test('timer pauses while word help is open', async ({ page }) => {
  await page.clock.install();
  await newPlayer(page, { year: 2 });
  await openMission(page, 'word-explorer', 'we-y2-m3', '30s');
  // Question 2 has a non-assessed glossary word ("borrow").
  await answerAndContinue(page);
  await waitInteractive(page);
  await page.getByRole('button', { name: 'Word help: borrow' }).click();
  await expect(page.getByRole('dialog', { name: 'borrow' })).toBeVisible();
  await page.clock.fastForward(60_000);
  await expect(page.getByTestId('feedback-timeout')).toHaveCount(0);
  await page.getByRole('button', { name: 'Got it!' }).click();
  await expect(page.getByRole('timer')).toContainText(/2\ds|30s/);
});

test('every interaction type works with tap controls', async ({ page }) => {
  test.setTimeout(240_000);
  await newPlayer(page, { year: 1 });
  const seen = new Set<string>();
  const plan: [string, string][] = [
    ['word-explorer', 'we-y1-m1'],
    ['listen-discover', 'ld-y1-m2'],
    ['everyday-english', 'ee-y1-m1'],
    ['story-adventure', 'sa-y1-m1'],
  ];
  for (const [cat, mission] of plan) {
    await openMission(page, cat, mission);
    (await playWholeMission(page)).forEach((t) => seen.add(t));
    await page.click('[data-testid=back-to-town]');
  }
  await page.click('[data-testid=year-selector]');
  await page.click('[data-testid=year-3]');
  await openMission(page, 'sentence-builder', 'sb-y3-m1');
  (await playWholeMission(page)).forEach((t) => seen.add(t));
  expect([...seen].sort()).toEqual(['dialogue', 'dragDrop', 'fillBlank', 'listeningChoice', 'matching', 'multipleChoice', 'ordering', 'pictureChoice', 'storyQuestion']);
});

test('drag and drop with a pointer builds a sentence', async ({ page }) => {
  // Tall viewport so the drag never starts in the auto-scroll edge zone.
  await page.setViewportSize({ width: 1280, height: 1100 });
  await newPlayer(page);
  await openMission(page, 'sentence-builder', 'sb-y1-m1');
  const q = await currentQuestion(page);
  if (q.activityType !== 'ordering') throw new Error('expected ordering');
  const order = q.acceptedAnswers[0]!;
  for (let i = 0; i < order.length; i++) {
    const tile = page.locator(`[data-tile-id="${order[i]}"]`);
    const slot = page.locator(`[data-target-id="slot-${i}"]`);
    const a = (await tile.boundingBox())!;
    const b = (await slot.boundingBox())!;
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2 + 5, { steps: 4 });
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 10 });
    // Hover briefly over the target, as a real drag would, so drop targets are measured.
    await page.waitForTimeout(150);
    await page.mouse.move(b.x + b.width / 2 + 1, b.y + b.height / 2 + 1);
    await page.mouse.up();
    // Wait for the board to re-render before measuring the next tile (the layout shifts).
    await expect(page.locator(`[data-target-id="slot-${i}"] [data-tile-id="${order[i]}"]`)).toBeVisible();
  }
  await expect(page.getByText('Aina plays badminton.')).toBeVisible();
  await check(page);
  await expect(page.getByTestId('feedback-correct')).toBeVisible();
});

test('refreshing during play resumes the same question and progress', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'grammar-quest', 'gq-y1-m2');
  await answerAndContinue(page);
  await answerAndContinue(page);
  await waitInteractive(page);
  const before = await currentQuestion(page);
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.getByText('Welcome back!')).toBeVisible();
  await page.click('[data-testid=resume]');
  expect((await currentQuestion(page)).id).toBe(before.id);
  await expect(page.getByText('Question 3 of 8')).toBeVisible();
  await expect(page.getByRole('listitem', { name: 'Question 1: correct first time' })).toBeVisible();
});

test('leaving a mission keeps it for later', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'grammar-quest', 'gq-y1-m2');
  await answerAndContinue(page);
  await page.getByRole('button', { name: 'Pause mission' }).click();
  await page.click('[data-testid=leave-mission]');
  await expect(page.getByTestId('start-mission')).toContainText('Continue Mission');
  await page.click('[data-testid=start-mission]');
  await expect(page.getByText('Question 2 of 8')).toBeVisible();
});

test('reduced motion keeps positive feedback without particle canvases', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await newPlayer(page);
  await openMission(page, 'grammar-quest', 'gq-y1-m1');
  await expect(page.getByTestId('fx-canvas')).toHaveCount(0);
  const q = await currentQuestion(page);
  await answerCorrectly(page, q);
  await check(page);
  await expect(page.getByTestId('feedback-correct')).toBeVisible();
  await expect(page.getByTestId('static-sparkles')).toBeVisible();
});

test('celebration canvases never block taps', async ({ page }) => {
  await newPlayer(page);
  await openMission(page, 'grammar-quest', 'gq-y1-m1');
  await expect(page.getByTestId('fx-canvas')).toHaveCSS('pointer-events', 'none');
  await expect(page.getByTestId('confetti-canvas')).toHaveCSS('pointer-events', 'none');
  const q = await currentQuestion(page);
  await answerCorrectly(page, q);
  await check(page);
  // Next is clickable immediately, while the celebration is still running.
  await page.click('[data-testid=next]', { timeout: 1500 });
  await expect(page.getByText('Question 2 of 8')).toBeVisible();
});

test('missing listening audio offers labelled text practice, excluded from listening reports', async ({ page }) => {
  await newPlayer(page, { audio: 'none' });
  await openMission(page, 'listen-discover', 'ld-y1-m1', 'none', false);
  await expect(page.getByText('Sound is not working on this device right now.')).toBeVisible();
  await expect(page.locator('[data-phase]')).toHaveAttribute('data-phase', 'ready');
  await page.getByRole('button', { name: 'Use text practice' }).click();
  await expect(page.getByTestId('text-practice')).toContainText('The red bag is under the chair.');
  await expect(page.getByTestId('text-practice')).toContainText('not listening');
  const q = await currentQuestion(page);
  await answerCorrectly(page, q);
  await check(page);
  await page.click('[data-testid=next]');
  for (let i = 1; i < 8; i++) {
    await page.getByRole('button', { name: 'Use text practice' }).click();
    await answerAndContinue(page);
  }
  await page.click('[data-testid=back-to-town]');
  await page.click('[data-testid=grown-ups]');
  const text = await page.getByText(/What is \d+ × \d+\?/).textContent();
  const [, a, b] = /(\d+) × (\d+)/.exec(text!)!;
  await page.fill('[data-testid=gate-answer]', String(Number(a) * Number(b)));
  await page.click('[data-testid=gate-submit]');
  await expect(page.getByTestId('adult-stats')).toContainText('8 text-practice attempts not counted as listening');
  await expect(page.getByText('Listening with working audio').locator('..')).toContainText('0');
});

test('parent area: gate, curriculum status, export and import validation', async ({ page }) => {
  await newPlayer(page);
  await page.click('[data-testid=grown-ups]');
  await page.fill('[data-testid=gate-answer]', '1');
  await page.click('[data-testid=gate-submit]');
  await expect(page.getByText('That is not right.')).toBeVisible();
  const text = await page.getByText(/What is \d+ × \d+\?/).textContent();
  const [, a, b] = /(\d+) × (\d+)/.exec(text!)!;
  await page.fill('[data-testid=gate-answer]', String(Number(a) * Number(b)));
  await page.click('[data-testid=gate-submit]');
  await page.click('[data-testid=tab-curriculum]');
  await expect(page.getByText('Pending teacher review').first()).toBeVisible();
  await expect(page.getByTestId('curriculum-table')).toContainText('needs verification');
  await page.click('[data-testid=tab-data]');
  const download = page.waitForEvent('download');
  await page.click('[data-testid=export]');
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/english-mission-town-progress/);
  await page.setInputFiles('[data-testid=import-file]', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"schemaVersion":1,"profiles":"nope"}') });
  await expect(page.getByTestId('import-message')).toContainText('Import failed');
  const good = await file.path();
  await page.setInputFiles('[data-testid=import-file]', good!);
  await page.click('[data-testid=confirm-import]');
  await expect(page.getByTestId('start-mission')).toBeVisible();
});
