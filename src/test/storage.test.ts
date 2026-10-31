import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorage, emptySave, exportText, parseImportText, STORAGE_KEY, type SaveData } from '../state/schema';

function sample(): SaveData {
  const s = emptySave();
  s.profiles.push({ id: 'p1', nickname: 'Star', avatarId: 'a1', yearLevel: 2, createdAt: 1, tutorialDone: true, missions: {}, history: [], stickers: { 'word-explorer-starter': { unlockedAt: 1, sessionId: 's1' } }, board: [{ stickerId: 'word-explorer-starter', x: 0.5, y: 0.5, rotation: 5 }], activeSession: null, newestStickerId: null, processedSessionIds: ['s1'] });
  s.activeProfileId = 'p1';
  return s;
}

describe('import validation', () => {
  it('round-trips an exported file', () => {
    const res = parseImportText(exportText(sample()));
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.profiles[0]!.stickers['word-explorer-starter']).toBeDefined();
  });

  it('rejects text that is not JSON', () => {
    expect(parseImportText('not json')).toEqual({ ok: false, error: 'This file is not valid JSON.' });
  });

  it('rejects out-of-range or malformed data', () => {
    const bad = sample() as unknown as { profiles: { yearLevel: number; missions: unknown }[] };
    bad.profiles[0]!.yearLevel = 9;
    expect(parseImportText(JSON.stringify(bad)).ok).toBe(false);
    const bad2 = sample() as unknown as { profiles: { missions: unknown }[] };
    bad2.profiles[0]!.missions = { x: { bestScore: 99 } };
    expect(parseImportText(JSON.stringify(bad2)).ok).toBe(false);
    expect(parseImportText(JSON.stringify({ schemaVersion: 7, profiles: [] })).ok).toBe(false);
  });

  it('repairs a dangling active profile id', () => {
    const s = sample();
    s.activeProfileId = 'missing';
    const res = parseImportText(JSON.stringify(s));
    expect(res.ok && res.data.activeProfileId).toBe('p1');
  });
});

describe('local storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('saves and loads', () => {
    const st = createLocalStorage();
    st.save(sample());
    expect(st.load().data.profiles[0]!.nickname).toBe('Star');
  });

  it('recovers gracefully from corrupted data and keeps a backup', () => {
    window.localStorage.setItem(STORAGE_KEY, '{"schemaVersion":1, broken');
    const res = createLocalStorage().load();
    expect(res.recovered).toBe(true);
    expect(res.data.profiles).toEqual([]);
    expect(Object.keys(window.localStorage).some((k) => k.startsWith(`${STORAGE_KEY}.corrupt-`))).toBe(true);
  });
});
