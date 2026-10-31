import { expect, type Page } from '@playwright/test';
import { QUESTION_BY_ID } from '../src/content';
import type { Question } from '../src/engine/types';

export async function newPlayer(page: Page, opts: { year?: 1 | 2 | 3; audio?: 'fake' | 'none'; skipTutorial?: boolean } = {}) {
  const audio = opts.audio ?? 'fake';
  await page.addInitScript((a) => {
    window.__EMT_AUDIO__ = a;
  }, audio);
  await page.goto('/');
  await page.fill('#nick', 'Star');
  if (opts.year) await page.click(`[data-testid=year-${opts.year}]`);
  await page.click('[data-testid=create-profile]');
  if (opts.skipTutorial !== false) await page.getByText('Skip the tutorial').click();
  await expect(page.getByTestId('start-mission')).toBeVisible();
}

export async function openMission(page: Page, categoryId: string, missionId: string, timer: 'none' | '30s' | '60s' = 'none', waitReady = true) {
  await page.click(`[data-testid=place-${categoryId}]`);
  await page.click(`[data-testid=mission-${missionId}]`);
  await page.click(`[data-testid=timer-${timer}]`);
  await page.click('[data-testid=begin-mission]');
  if (waitReady) await waitInteractive(page);
}

export async function currentQuestion(page: Page): Promise<Question> {
  const id = await page.locator('[data-question-id]').getAttribute('data-question-id');
  const q = id ? QUESTION_BY_ID[id] : undefined;
  if (!q) throw new Error(`Unknown question ${id}`);
  return q;
}

export async function waitInteractive(page: Page) {
  await expect(page.locator('[data-phase]')).toHaveAttribute('data-phase', /active|supportedReview/, { timeout: 15_000 });
}

async function tapPlace(page: Page, tileId: string, targetId: string) {
  await page.click(`[data-tile-id="${tileId}"]`);
  await page.click(`[data-slot-button="${targetId}"]`);
}

/** Fill in the correct answer using the tap interaction (no dragging). */
export async function answerCorrectly(page: Page, q: Question) {
  switch (q.activityType) {
    case 'multipleChoice':
    case 'pictureChoice':
    case 'listeningChoice':
    case 'storyQuestion':
    case 'dialogue':
      await page.click(`[data-option-id="${q.acceptedAnswers[0]}"]`);
      break;
    case 'ordering': {
      const order = q.acceptedAnswers[0]!;
      for (let i = 0; i < order.length; i++) await tapPlace(page, order[i]!, `slot-${i}`);
      break;
    }
    case 'dragDrop':
      for (const [item, group] of Object.entries(q.acceptedAnswers)) await tapPlace(page, item, group);
      break;
    case 'matching':
      for (const [left, right] of Object.entries(q.acceptedAnswers)) await tapPlace(page, right, left);
      break;
    case 'fillBlank':
      if (q.inputMode === 'typed') {
        for (let i = 0; i < q.acceptedAnswers.length; i++) await page.fill(`[data-typed-blank="${i}"]`, q.acceptedAnswers[i]![0]!);
      } else {
        for (let i = 0; i < q.acceptedAnswers.length; i++) await tapPlace(page, q.acceptedAnswers[i]![0]!, `blank-${i}`);
      }
      break;
  }
}

export async function check(page: Page) {
  await page.click('[data-testid=check-answer]');
}

export async function answerAndContinue(page: Page) {
  await waitInteractive(page);
  const q = await currentQuestion(page);
  await answerCorrectly(page, q);
  await check(page);
  await expect(page.getByTestId('feedback-correct')).toBeVisible();
  await page.click('[data-testid=next]');
  return q;
}

export async function playWholeMission(page: Page) {
  const types: string[] = [];
  for (let i = 0; i < 8; i++) {
    await expect(page.getByText(`Question ${i + 1} of 8`)).toBeVisible();
    const q = await answerAndContinue(page);
    types.push(q.activityType);
  }
  await expect(page.getByTestId('results')).toBeVisible();
  return types;
}
