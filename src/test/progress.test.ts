import { describe, expect, it } from 'vitest';
import { MISSIONS, missionsFor, QUESTION_BY_ID } from '../content';
import { STICKERS } from '../content/stickers';
import { recommend } from '../engine/recommend';
import { earnedTiers } from '../engine/rewards';
import { createSession, sessionReducer, type SessionState } from '../engine/session';
import { applySessionResult } from '../state/progress';
import type { Profile } from '../state/schema';

function profile(): Profile {
  return { id: 'p1', nickname: 'Star', avatarId: 'a1', yearLevel: 1, createdAt: 0, tutorialDone: true, missions: {}, history: [], stickers: {}, board: [], activeSession: null, newestStickerId: null, processedSessionIds: [] };
}

let n = 0;
function completedSession(missionId: string, firstTryCount: number): SessionState {
  const m = MISSIONS.find((x) => x.id === missionId)!;
  let s = createSession({ sessionId: `s${n++}`, missionId, categoryId: m.categoryId, yearLevel: m.yearLevel, timerSetting: 'none', questionIds: m.questions.map((q) => q.id), shuffleSeed: 1, now: 0 });
  for (let i = 0; i < 8; i++) {
    s = sessionReducer(s, { type: 'QUESTION_READY', now: 0 });
    if (i < firstTryCount) s = sessionReducer(s, { type: 'SUBMIT', correct: true, submissionId: `a${i}`, now: 0 });
    else {
      s = sessionReducer(s, { type: 'SUBMIT', correct: false, submissionId: `b${i}`, now: 0 });
      s = sessionReducer(s, { type: 'RETRY', now: 0 });
      s = sessionReducer(s, { type: 'SUBMIT', correct: true, submissionId: `c${i}`, now: 0 });
    }
    s = sessionReducer(s, { type: 'NEXT', now: 0 });
  }
  return s;
}

describe('rewards and progress', () => {
  it('has 24 stickers, four per category', () => {
    expect(STICKERS).toHaveLength(24);
    expect(new Set(STICKERS.map((s) => s.id)).size).toBe(24);
  });

  it('first completed mission in a category unlocks the starter sticker once', () => {
    const s = completedSession('we-y1-m1', 2);
    const r1 = applySessionResult(profile(), s, 1);
    expect(r1.newStickerIds).toEqual(['word-explorer-starter']);
    // Applying the same session again (refresh, double event) changes nothing.
    const r2 = applySessionResult(r1.profile, s, 2);
    expect(r2.alreadyProcessed).toBe(true);
    expect(r2.newStickerIds).toEqual([]);
    expect(r2.profile.missions['we-y1-m1']!.completions).toBe(1);
    expect(r2.profile.history).toHaveLength(1);
  });

  it('replaying the same mission never inflates unique mission counts or duplicates stickers', () => {
    let p = profile();
    for (let i = 0; i < 5; i++) p = applySessionResult(p, completedSession('we-y1-m1', 8), i).profile;
    expect(p.missions['we-y1-m1']!.completions).toBe(5);
    expect(Object.keys(p.stickers)).toEqual(['word-explorer-starter']);
    expect(earnedTiers(p.missions, 'word-explorer')).toEqual(['starter']);
  });

  it('explorer at 3 unique missions, adventure at 6, mastery at 3 unique three-star missions', () => {
    let p = profile();
    const ids = MISSIONS.filter((m) => m.categoryId === 'grammar-quest').map((m) => m.id);
    const unlocked: string[] = [];
    ids.slice(0, 6).forEach((id, i) => {
      const score = i < 2 ? 8 : 5;
      const r = applySessionResult(p, completedSession(id, score), i);
      p = r.profile;
      unlocked.push(...r.newStickerIds);
    });
    expect(unlocked).toEqual(['grammar-quest-starter', 'grammar-quest-explorer', 'grammar-quest-adventure']);
    // Third three-star mission → mastery.
    const r = applySessionResult(p, completedSession(ids[2]!, 7), 99);
    expect(r.newStickerIds).toEqual(['grammar-quest-mastery']);
    expect(r.profile.missions[ids[2]!]!.bestScore).toBe(7);
  });

  it('best score keeps the highest result but last score is stored too', () => {
    let p = applySessionResult(profile(), completedSession('ld-y1-m1', 7), 0).profile;
    p = applySessionResult(p, completedSession('ld-y1-m1', 2), 1).profile;
    expect(p.missions['ld-y1-m1']).toMatchObject({ bestScore: 7, bestStars: 3, lastScore: 2, completions: 2 });
  });

  it('records listening questions for reporting', () => {
    const p = applySessionResult(profile(), completedSession('ld-y1-m1', 8), 0).profile;
    expect(p.history[0]!.questions.every((q) => q.listening)).toBe(true);
    expect(QUESTION_BY_ID['ld-y1-m1-q1']!.audioScript).toBe('The red bag is under the chair.');
  });
});

describe('recommendations', () => {
  const path = missionsFor('word-explorer', 2);
  it('below 4 → easier/scaffolded, 4–6 → same level, 7–8 → next mission', () => {
    expect(recommend(path, path[1]!, 3)).toMatchObject({ kind: 'easier', missionId: path[0]!.id });
    expect(recommend(path, path[0]!, 2)).toMatchObject({ kind: 'easier', missionId: path[0]!.id });
    expect(recommend(path, path[1]!, 5)).toMatchObject({ kind: 'same', missionId: path[1]!.id });
    expect(recommend(path, path[1]!, 7)).toMatchObject({ kind: 'next', missionId: path[2]!.id });
  });
});
