// Applying a finished session to a profile. Pure and idempotent: processing the same
// session twice never adds completions, history entries or stickers a second time.
import { QUESTION_BY_ID } from '../content';
import { stickerId } from '../content/stickers';
import { earnedTiers } from '../engine/rewards';
import { summarise, type SessionSummary } from '../engine/scoring';
import { isComplete, type SessionState } from '../engine/session';
import { isListening } from '../engine/types';
import { HISTORY_LIMIT, type HistoryEntry, type Profile } from './schema';

export interface ApplyResult {
  profile: Profile;
  summary: SessionSummary;
  newStickerIds: string[];
  alreadyProcessed: boolean;
}

export function applySessionResult(profile: Profile, session: SessionState, now: number): ApplyResult {
  const summary = summarise(session.records);
  if (profile.processedSessionIds.includes(session.sessionId)) {
    return { profile: { ...profile, activeSession: null }, summary, newStickerIds: [], alreadyProcessed: true };
  }
  if (!isComplete(session)) throw new Error('Cannot apply an incomplete session');

  const prev = profile.missions[session.missionId];
  const missions = {
    ...profile.missions,
    [session.missionId]: {
      missionId: session.missionId,
      categoryId: session.categoryId,
      yearLevel: session.yearLevel,
      completions: (prev?.completions ?? 0) + 1,
      bestScore: Math.max(prev?.bestScore ?? 0, summary.firstAttemptScore),
      bestStars: Math.max(prev?.bestStars ?? 0, summary.stars),
      lastScore: summary.firstAttemptScore,
      lastPlayedAt: now,
    },
  };

  const entry: HistoryEntry = {
    sessionId: session.sessionId,
    missionId: session.missionId,
    categoryId: session.categoryId,
    yearLevel: session.yearLevel,
    timerSetting: session.timerSetting,
    completedAt: session.completedAt ?? now,
    score: summary.firstAttemptScore,
    stars: summary.stars,
    correctAfterRetry: summary.correctAfterRetry,
    supportedOrTimedOut: summary.supportedOrTimedOut,
    questions: session.records.map((r) => {
      const q = QUESTION_BY_ID[r.questionId];
      return {
        questionId: r.questionId,
        activityType: q?.activityType ?? 'unknown',
        skill: q?.curriculum.skill ?? 'unknown',
        attempts: r.attempts,
        correct: r.correct,
        firstAttemptCorrect: r.firstAttemptCorrect,
        timedOut: r.timedOut,
        revealed: r.revealed,
        listening: q ? isListening(q) : false,
        textPractice: r.textPractice,
      };
    }),
  };

  const stickers = { ...profile.stickers };
  const newStickerIds: string[] = [];
  for (const tier of earnedTiers(missions, session.categoryId)) {
    const id = stickerId(session.categoryId, tier);
    if (!stickers[id]) {
      stickers[id] = { unlockedAt: now, sessionId: session.sessionId };
      newStickerIds.push(id);
    }
  }

  return {
    profile: {
      ...profile,
      missions,
      history: [...profile.history, entry].slice(-HISTORY_LIMIT),
      stickers,
      newestStickerId: newStickerIds[newStickerIds.length - 1] ?? profile.newestStickerId,
      processedSessionIds: [...profile.processedSessionIds, session.sessionId].slice(-HISTORY_LIMIT),
      activeSession: null,
    },
    summary,
    newStickerIds,
    alreadyProcessed: false,
  };
}
