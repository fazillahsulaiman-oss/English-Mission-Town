import { describe, expect, it } from 'vitest';
import { createSession, freezeForStorage, isComplete, sessionReducer, type SessionEvent, type SessionState } from '../engine/session';
import { summarise, starsForScore } from '../engine/scoring';
import { remainingMs } from '../engine/timer';
import type { TimerSetting } from '../engine/types';

const ids = Array.from({ length: 8 }, (_, i) => `q${i + 1}`);
const make = (timer: TimerSetting = 'none') =>
  createSession({ sessionId: 's1', missionId: 'm1', categoryId: 'grammar-quest', yearLevel: 1, timerSetting: timer, questionIds: ids, shuffleSeed: 1, now: 0 });
const run = (s: SessionState, events: SessionEvent[]) => events.reduce(sessionReducer, s);
let sub = 0;
const submit = (correct: boolean, now = 0): SessionEvent => ({ type: 'SUBMIT', correct, submissionId: `x${sub++}`, now });

function answerAll(s: SessionState, pattern: ('first' | 'retry' | 'reveal')[]): SessionState {
  for (const p of pattern) {
    s = run(s, [{ type: 'QUESTION_READY', now: 0 }]);
    if (p === 'first') s = run(s, [submit(true)]);
    if (p === 'retry') s = run(s, [submit(false), { type: 'RETRY', now: 0 }, submit(true)]);
    if (p === 'reveal') s = run(s, [submit(false), { type: 'RETRY', now: 0 }, submit(false), { type: 'RETRY', now: 0 }, submit(false)]);
    s = run(s, [{ type: 'NEXT', now: 0 }]);
  }
  return s;
}

describe('scoring', () => {
  it('star thresholds: 7–8 → 3, 4–6 → 2, 0–3 → 1', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8].map(starsForScore)).toEqual([1, 1, 1, 1, 2, 2, 2, 3, 3]);
  });

  it('counts only first-attempt correct answers as points', () => {
    const s = answerAll(make(), ['first', 'first', 'retry', 'retry', 'reveal', 'first', 'first', 'first']);
    expect(s.phase).toBe('results');
    const sum = summarise(s.records);
    expect(sum.firstAttemptScore).toBe(5);
    expect(sum.correctAfterRetry).toBe(2);
    expect(sum.supportedOrTimedOut).toBe(1);
    expect(sum.stars).toBe(2);
    expect(sum.percentage).toBe(63);
  });

  it('a session has exactly eight questions and ends in results', () => {
    const s = answerAll(make(), Array(8).fill('first'));
    expect(s.records).toHaveLength(8);
    expect(isComplete(s)).toBe(true);
    expect(summarise(s.records).firstAttemptScore).toBe(8);
    // No further transitions after results.
    expect(sessionReducer(s, { type: 'NEXT', now: 1 })).toBe(s);
  });
});

describe('question flow', () => {
  it('wrong answer → try again → correct retry records eventual success separately', () => {
    let s = run(make(), [{ type: 'QUESTION_READY', now: 0 }, submit(false)]);
    expect(s.phase).toBe('incorrectFeedback');
    s = run(s, [{ type: 'RETRY', now: 0 }]);
    expect(s.phase).toBe('active');
    s = run(s, [submit(true)]);
    expect(s.phase).toBe('correctFeedback');
    expect(s.records[0]).toMatchObject({ attempts: 2, correct: true, firstAttemptCorrect: false, resolved: true });
  });

  it('three wrong attempts reveal the answer and mark the question supported', () => {
    let s = run(make(), [{ type: 'QUESTION_READY', now: 0 }]);
    s = run(s, [submit(false), { type: 'RETRY', now: 0 }, submit(false), { type: 'RETRY', now: 0 }, submit(false)]);
    expect(s.phase).toBe('revealed');
    expect(s.records[0]).toMatchObject({ attempts: 3, revealed: true, correct: false, resolved: true });
  });

  it('ignores duplicate submissions (double-click on Check Answer)', () => {
    let s = run(make(), [{ type: 'QUESTION_READY', now: 0 }]);
    const ev: SessionEvent = { type: 'SUBMIT', correct: false, submissionId: 'same', now: 0 };
    s = sessionReducer(s, ev);
    const again = sessionReducer(s, ev);
    expect(again).toBe(s);
    expect(s.records[0]!.attempts).toBe(1);
  });

  it('cannot submit during feedback or move on before answering', () => {
    let s = run(make(), [{ type: 'QUESTION_READY', now: 0 }]);
    expect(sessionReducer(s, { type: 'NEXT', now: 0 })).toBe(s);
    s = run(s, [submit(true)]);
    expect(sessionReducer(s, submit(true))).toBe(s);
  });
});

describe('timer rules', () => {
  it('starts only when the question is ready and pauses for audio, glossary and hidden tabs', () => {
    let s = make('30s');
    expect(s.timer.runningSince).toBeNull();
    s = run(s, [{ type: 'QUESTION_READY', now: 1000 }]);
    expect(s.timer.runningSince).toBe(1000);
    s = run(s, [{ type: 'PAUSE', reason: 'glossary', now: 6000 }]);
    expect(remainingMs(s.timer, 20_000)).toBe(25_000);
    s = run(s, [{ type: 'PAUSE', reason: 'hidden', now: 7000 }, { type: 'RESUME', reason: 'glossary', now: 8000 }]);
    expect(s.timer.runningSince).toBeNull(); // still hidden
    s = run(s, [{ type: 'RESUME', reason: 'hidden', now: 10_000 }]);
    expect(remainingMs(s.timer, 12_000)).toBe(23_000);
  });

  it('pauses during feedback and retries share the remaining time', () => {
    let s = run(make('30s'), [{ type: 'QUESTION_READY', now: 0 }, submit(false, 10_000)]);
    expect(s.phase).toBe('incorrectFeedback');
    expect(remainingMs(s.timer, 50_000)).toBe(20_000);
    s = run(s, [{ type: 'RETRY', now: 60_000 }]);
    expect(remainingMs(s.timer, 65_000)).toBe(15_000);
  });

  it('expires at zero, gives no point and allows an untimed supported attempt', () => {
    let s = run(make('30s'), [{ type: 'QUESTION_READY', now: 0 }, { type: 'TICK', now: 29_000 }]);
    expect(s.phase).toBe('active');
    s = run(s, [{ type: 'TICK', now: 30_000 }]);
    expect(s.phase).toBe('timedOut');
    s = run(s, [{ type: 'CHOOSE_SUPPORTED', now: 31_000 }]);
    expect(s.phase).toBe('supportedReview');
    expect(s.timer.runningSince).toBeNull();
    s = run(s, [submit(true, 99_000)]);
    expect(s.phase).toBe('correctFeedback');
    expect(s.records[0]).toMatchObject({ timedOut: true, correct: true, firstAttemptCorrect: false });
    expect(summarise(s.records).supportedOrTimedOut).toBe(1);
  });

  it('a submission arriving after time ran out becomes a timeout, not an attempt', () => {
    const s = run(make('30s'), [{ type: 'QUESTION_READY', now: 0 }, submit(true, 31_000)]);
    expect(s.phase).toBe('timedOut');
    expect(s.records[0]!.attempts).toBe(0);
  });

  it('timeout can reveal the explanation and still continue', () => {
    let s = run(make('60s'), [{ type: 'QUESTION_READY', now: 0 }, { type: 'TICK', now: 60_000 }, { type: 'CHOOSE_REVEAL', now: 60_001 }]);
    expect(s.phase).toBe('revealed');
    s = run(s, [{ type: 'NEXT', now: 60_002 }]);
    expect(s.index).toBe(1);
    expect(s.timer.usedMs).toBe(0);
  });

  it('freezing for storage keeps used time and requires a resume tap', () => {
    let s = run(make('30s'), [{ type: 'QUESTION_READY', now: 0 }]);
    const frozen = freezeForStorage(s, 12_000);
    expect(frozen.timer).toMatchObject({ usedMs: 12_000, runningSince: null });
    expect(frozen.pauseReasons).toContain('resume');
    s = run(frozen, [{ type: 'RESUME', reason: 'resume', now: 500_000 }]);
    expect(remainingMs(s.timer, 503_000)).toBe(15_000);
  });

  it('no-timer sessions never time out', () => {
    const s = run(make('none'), [{ type: 'QUESTION_READY', now: 0 }, { type: 'TICK', now: 10_000_000 }]);
    expect(s.phase).toBe('active');
  });
});
