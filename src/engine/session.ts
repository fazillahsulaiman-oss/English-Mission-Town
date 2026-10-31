// Mission session state machine.
//
//   ready ──QUESTION_READY──▶ active
//   active ──SUBMIT(correct)──▶ correctFeedback ──NEXT──▶ ready (next) | results
//   active ──SUBMIT(wrong, <3)──▶ incorrectFeedback ──RETRY──▶ active
//   active ──SUBMIT(wrong, =3)──▶ revealed ──NEXT──▶ ready | results
//   active ──TICK(expired)──▶ timedOut ──CHOOSE_SUPPORTED──▶ supportedReview (untimed)
//                                      └─CHOOSE_REVEAL──▶ revealed
//   supportedReview behaves like active, but without a timer and without a first-attempt point.
//
// The reducer is pure: every event carries `now` so the timer can be advanced deterministically.

import { createTimer, isExpired, pauseTimer, startTimer, type TimerState } from './timer';
import { TIMER_LIMIT_MS, type CategoryId, type TimerSetting, type YearLevel } from './types';

export const MAX_ATTEMPTS = 3;

export type Phase =
  | 'ready'
  | 'active'
  | 'incorrectFeedback'
  | 'correctFeedback'
  | 'timedOut'
  | 'supportedReview'
  | 'revealed'
  | 'results';

export type PauseReason = 'audio' | 'glossary' | 'hidden' | 'menu' | 'resume' | 'tutorial';

export interface QuestionRecord {
  questionId: string;
  attempts: number;
  /** Eventually answered correctly by the child (first try, retry or supported attempt). */
  correct: boolean;
  /** Correct on the first submitted attempt, before any timeout. The only thing that scores. */
  firstAttemptCorrect: boolean;
  timedOut: boolean;
  /** Answer was shown after three attempts or chosen after a timeout. */
  revealed: boolean;
  /** Listening question answered via the labelled text-practice alternative. */
  textPractice: boolean;
  glossaryOpens: number;
  resolved: boolean;
}

export interface SessionState {
  sessionId: string;
  missionId: string;
  categoryId: CategoryId;
  yearLevel: YearLevel;
  timerSetting: TimerSetting;
  questionOrder: string[];
  /** Seed for deterministic option shuffling, so a resumed session shows the same order. */
  shuffleSeed: number;
  index: number;
  phase: Phase;
  attemptsThisQuestion: number;
  /** Untimed supported mode after a timeout. */
  supportMode: boolean;
  timer: TimerState;
  pauseReasons: PauseReason[];
  records: QuestionRecord[];
  /** Ids of submissions already processed, to drop duplicate clicks. */
  lastSubmissionId: string | null;
  startedAt: number;
  completedAt: number | null;
}

export type SessionEvent =
  | { type: 'QUESTION_READY'; now: number }
  | { type: 'SUBMIT'; correct: boolean; submissionId: string; now: number }
  | { type: 'RETRY'; now: number }
  | { type: 'TICK'; now: number }
  | { type: 'CHOOSE_SUPPORTED'; now: number }
  | { type: 'CHOOSE_REVEAL'; now: number }
  | { type: 'NEXT'; now: number }
  | { type: 'PAUSE'; reason: PauseReason; now: number }
  | { type: 'RESUME'; reason: PauseReason; now: number }
  | { type: 'TEXT_PRACTICE'; now: number }
  | { type: 'GLOSSARY_OPENED'; now: number };

function newRecord(questionId: string): QuestionRecord {
  return {
    questionId,
    attempts: 0,
    correct: false,
    firstAttemptCorrect: false,
    timedOut: false,
    revealed: false,
    textPractice: false,
    glossaryOpens: 0,
    resolved: false,
  };
}

export function createSession(args: {
  sessionId: string;
  missionId: string;
  categoryId: CategoryId;
  yearLevel: YearLevel;
  timerSetting: TimerSetting;
  questionIds: string[];
  shuffleSeed: number;
  now: number;
}): SessionState {
  const first = args.questionIds[0];
  if (!first) throw new Error('A session needs questions');
  return {
    sessionId: args.sessionId,
    missionId: args.missionId,
    categoryId: args.categoryId,
    yearLevel: args.yearLevel,
    timerSetting: args.timerSetting,
    questionOrder: [...args.questionIds],
    shuffleSeed: args.shuffleSeed,
    index: 0,
    phase: 'ready',
    attemptsThisQuestion: 0,
    supportMode: false,
    timer: createTimer(TIMER_LIMIT_MS[args.timerSetting]),
    pauseReasons: [],
    records: [newRecord(first)],
    lastSubmissionId: null,
    startedAt: args.now,
    completedAt: null,
  };
}

/** Keep the timer running only while the child is actively answering a timed question. */
function syncTimer(s: SessionState, now: number): SessionState {
  const shouldRun = s.phase === 'active' && !s.supportMode && s.pauseReasons.length === 0;
  const timer = shouldRun ? startTimer(s.timer, now) : pauseTimer(s.timer, now);
  return timer === s.timer ? s : { ...s, timer };
}

function updateRecord(s: SessionState, patch: Partial<QuestionRecord>): QuestionRecord[] {
  const records = [...s.records];
  const cur = records[s.index];
  if (cur) records[s.index] = { ...cur, ...patch };
  return records;
}

export function currentRecord(s: SessionState): QuestionRecord | undefined {
  return s.records[s.index];
}

export function currentQuestionId(s: SessionState): string | undefined {
  return s.questionOrder[s.index];
}

function transition(s: SessionState, e: SessionEvent): SessionState {
  switch (e.type) {
    case 'QUESTION_READY':
      if (s.phase !== 'ready') return s;
      return { ...s, phase: 'active' };

    case 'TICK': {
      if (s.phase !== 'active' || s.supportMode) return s;
      const t = pauseTimer(s.timer, e.now);
      if (!isExpired(t, e.now)) return s;
      return { ...s, timer: t, phase: 'timedOut', records: updateRecord(s, { timedOut: true }) };
    }

    case 'SUBMIT': {
      if (s.phase !== 'active' && s.phase !== 'supportedReview') return s;
      if (s.lastSubmissionId === e.submissionId) return s;
      // A submission that arrives after the time ran out counts as a timeout, not an attempt.
      if (s.phase === 'active' && !s.supportMode) {
        const t = pauseTimer(s.timer, e.now);
        if (isExpired(t, e.now)) {
          return { ...s, timer: t, phase: 'timedOut', lastSubmissionId: e.submissionId, records: updateRecord(s, { timedOut: true }) };
        }
      }
      const attempts = s.attemptsThisQuestion + 1;
      const rec = currentRecord(s);
      const isFirst = attempts === 1 && !rec?.timedOut;
      if (e.correct) {
        return {
          ...s,
          attemptsThisQuestion: attempts,
          lastSubmissionId: e.submissionId,
          phase: 'correctFeedback',
          records: updateRecord(s, { attempts, correct: true, firstAttemptCorrect: isFirst, resolved: true }),
        };
      }
      if (attempts >= MAX_ATTEMPTS) {
        return {
          ...s,
          attemptsThisQuestion: attempts,
          lastSubmissionId: e.submissionId,
          phase: 'revealed',
          records: updateRecord(s, { attempts, revealed: true, resolved: true }),
        };
      }
      return {
        ...s,
        attemptsThisQuestion: attempts,
        lastSubmissionId: e.submissionId,
        phase: 'incorrectFeedback',
        records: updateRecord(s, { attempts }),
      };
    }

    case 'RETRY':
      if (s.phase !== 'incorrectFeedback') return s;
      return { ...s, phase: s.supportMode ? 'supportedReview' : 'active' };

    case 'CHOOSE_SUPPORTED':
      if (s.phase !== 'timedOut') return s;
      return { ...s, phase: 'supportedReview', supportMode: true };

    case 'CHOOSE_REVEAL':
      if (s.phase !== 'timedOut') return s;
      return { ...s, phase: 'revealed', records: updateRecord(s, { revealed: true, resolved: true }) };

    case 'NEXT': {
      if (s.phase !== 'correctFeedback' && s.phase !== 'revealed') return s;
      const nextIndex = s.index + 1;
      const nextId = s.questionOrder[nextIndex];
      if (nextId === undefined) {
        return { ...s, phase: 'results', completedAt: e.now };
      }
      return {
        ...s,
        index: nextIndex,
        phase: 'ready',
        attemptsThisQuestion: 0,
        supportMode: false,
        lastSubmissionId: null,
        timer: createTimer(s.timer.limitMs),
        records: [...s.records, newRecord(nextId)],
      };
    }

    case 'PAUSE':
      if (s.pauseReasons.includes(e.reason)) return s;
      return { ...s, pauseReasons: [...s.pauseReasons, e.reason] };

    case 'RESUME':
      if (!s.pauseReasons.includes(e.reason)) return s;
      return { ...s, pauseReasons: s.pauseReasons.filter((r) => r !== e.reason) };

    case 'TEXT_PRACTICE':
      return { ...s, records: updateRecord(s, { textPractice: true }) };

    case 'GLOSSARY_OPENED':
      return { ...s, records: updateRecord(s, { glossaryOpens: (currentRecord(s)?.glossaryOpens ?? 0) + 1 }) };
  }
}

export function sessionReducer(s: SessionState, e: SessionEvent): SessionState {
  const next = transition(s, e);
  if (next === s) return s;
  return syncTimer(next, e.now);
}

/** Snapshot for persistence: freezes the running timer and marks the session as needing a resume tap. */
export function freezeForStorage(s: SessionState, now: number): SessionState {
  const timer = pauseTimer(s.timer, now);
  const pauseReasons: PauseReason[] = s.phase === 'results' ? [] : ['resume'];
  return { ...s, timer, pauseReasons };
}

export function isComplete(s: SessionState): boolean {
  return s.phase === 'results' && s.records.length === s.questionOrder.length && s.records.every((r) => r.resolved);
}
