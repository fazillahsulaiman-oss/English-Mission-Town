import type { QuestionRecord } from './session';

export type Stars = 1 | 2 | 3;

export const QUESTIONS_PER_MISSION = 8;

export function starsForScore(score: number): Stars {
  if (score >= 7) return 3;
  if (score >= 4) return 2;
  return 1;
}

export interface SessionSummary {
  firstAttemptScore: number;
  percentage: number;
  stars: Stars;
  correctAfterRetry: number;
  supportedOrTimedOut: number;
  total: number;
}

export function summarise(records: QuestionRecord[]): SessionSummary {
  const firstAttemptScore = records.filter((r) => r.firstAttemptCorrect).length;
  const correctAfterRetry = records.filter((r) => r.correct && !r.firstAttemptCorrect && !r.timedOut).length;
  const supportedOrTimedOut = records.filter((r) => r.revealed || r.timedOut).length;
  return {
    firstAttemptScore,
    percentage: Math.round((firstAttemptScore / QUESTIONS_PER_MISSION) * 100),
    stars: starsForScore(firstAttemptScore),
    correctAfterRetry,
    supportedOrTimedOut,
    total: records.length,
  };
}
