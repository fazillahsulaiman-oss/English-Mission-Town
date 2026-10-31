import { create } from 'zustand';
import { MISSION_BY_ID } from '../content';
import { randomId } from '../engine/random';
import type { SessionSummary } from '../engine/scoring';
import { createSession, freezeForStorage, sessionReducer, type SessionEvent, type SessionState } from '../engine/session';
import type { CategoryId, TimerSetting, YearLevel } from '../engine/types';
import { applySessionResult } from './progress';
import { createLocalStorage, emptySave, type Placement, type Profile, type SaveData, type Settings } from './schema';

export type Screen = 'welcome' | 'home' | 'missions' | 'setup' | 'game' | 'results' | 'album' | 'adult' | 'settings';

export interface LastResult {
  sessionId: string;
  missionId: string;
  summary: SessionSummary;
  newStickerIds: string[];
  timerSetting: TimerSetting;
}

interface AppState {
  save: SaveData;
  recoveredFromCorruption: boolean;
  screen: Screen;
  selectedCategory: CategoryId | null;
  selectedMissionId: string | null;
  lastResult: LastResult | null;

  go(screen: Screen): void;
  createProfile(nickname: string, avatarId: string, year: YearLevel): void;
  selectProfile(id: string): void;
  deleteProfile(id: string): void;
  setYear(year: YearLevel): void;
  updateSettings(patch: Partial<Settings>): void;
  openCategory(id: CategoryId): void;
  chooseMission(missionId: string): void;
  startMission(missionId: string, timer: TimerSetting): void;
  dispatch(event: SessionEvent): void;
  discardActiveSession(): void;
  completeTutorial(): void;
  setBoard(board: Placement[]): void;
  clearNewestSticker(): void;
  replaceSave(data: SaveData): void;
  resetProfileProgress(profileId: string): void;
  resetEverything(): void;
  persistNow(): void;
}

const storage = createLocalStorage();

export function activeProfile(s: Pick<AppState, 'save'>): Profile | undefined {
  return s.save.profiles.find((p) => p.id === s.save.activeProfileId);
}

function withProfile(save: SaveData, id: string | null, fn: (p: Profile) => Profile): SaveData {
  if (!id) return save;
  return { ...save, profiles: save.profiles.map((p) => (p.id === id ? fn(p) : p)) };
}

/** Snapshot written to storage: any running timer is frozen so a reload never loses or gains time. */
function snapshot(save: SaveData): SaveData {
  const now = Date.now();
  return {
    ...save,
    profiles: save.profiles.map((p) => (p.activeSession ? { ...p, activeSession: freezeForStorage(p.activeSession as SessionState, now) } : p)),
  };
}

function initialState() {
  const { data, recovered } = storage.load();
  const prof = data.profiles.find((p) => p.id === data.activeProfileId);
  // A reload during play returns straight to the paused mission.
  const screen: Screen = !prof ? 'welcome' : prof.activeSession && prof.activeSession.phase !== 'results' ? 'game' : 'home';
  return { save: data, recoveredFromCorruption: recovered, screen };
}

export const useApp = create<AppState>((set, get) => ({
  ...initialState(),
  selectedCategory: null,
  selectedMissionId: null,
  lastResult: null,

  go: (screen) => set({ screen }),

  createProfile: (nickname, avatarId, year) => {
    const profile: Profile = {
      id: randomId('p'),
      nickname: nickname.trim().slice(0, 16),
      avatarId,
      yearLevel: year,
      createdAt: Date.now(),
      tutorialDone: false,
      missions: {},
      history: [],
      stickers: {},
      board: [],
      activeSession: null,
      newestStickerId: null,
      processedSessionIds: [],
    };
    set((s) => ({ save: { ...s.save, profiles: [...s.save.profiles, profile], activeProfileId: profile.id }, screen: 'home' }));
  },

  selectProfile: (id) => {
    set((s) => {
      const p = s.save.profiles.find((x) => x.id === id);
      const screen: Screen = p?.activeSession && p.activeSession.phase !== 'results' ? 'game' : 'home';
      return { save: { ...s.save, activeProfileId: id }, screen };
    });
  },

  deleteProfile: (id) =>
    set((s) => {
      const profiles = s.save.profiles.filter((p) => p.id !== id);
      const activeProfileId = s.save.activeProfileId === id ? (profiles[0]?.id ?? null) : s.save.activeProfileId;
      return { save: { ...s.save, profiles, activeProfileId } };
    }),

  setYear: (year) => set((s) => ({ save: withProfile(s.save, s.save.activeProfileId, (p) => ({ ...p, yearLevel: year })) })),

  updateSettings: (patch) => set((s) => ({ save: { ...s.save, settings: { ...s.save.settings, ...patch } } })),

  openCategory: (id) => set({ selectedCategory: id, screen: 'missions' }),

  chooseMission: (missionId) => set({ selectedMissionId: missionId, screen: 'setup' }),

  startMission: (missionId, timer) => {
    const mission = MISSION_BY_ID[missionId];
    if (!mission) return;
    const now = Date.now();
    const session = createSession({
      sessionId: randomId('s'),
      missionId,
      categoryId: mission.categoryId,
      yearLevel: mission.yearLevel,
      timerSetting: timer,
      questionIds: mission.questions.map((q) => q.id),
      shuffleSeed: Math.floor(Math.random() * 2 ** 31),
      now,
    });
    set((s) => ({
      save: withProfile(s.save, s.save.activeProfileId, (p) => ({ ...p, activeSession: session })),
      screen: 'game',
      selectedMissionId: missionId,
      selectedCategory: mission.categoryId,
    }));
  },

  dispatch: (event) => {
    const s = get();
    const prof = activeProfile(s);
    const cur = prof?.activeSession as SessionState | null | undefined;
    if (!prof || !cur) return;
    const next = sessionReducer(cur, event);
    if (next === cur) return;
    if (next.phase === 'results') {
      const res = applySessionResult(prof, next, event.now);
      set({
        save: withProfile(s.save, prof.id, () => res.profile),
        lastResult: {
          sessionId: next.sessionId,
          missionId: next.missionId,
          summary: res.summary,
          newStickerIds: res.newStickerIds,
          timerSetting: next.timerSetting,
        },
        screen: 'results',
      });
      return;
    }
    set({ save: withProfile(s.save, prof.id, (p) => ({ ...p, activeSession: next })) });
  },

  discardActiveSession: () => set((s) => ({ save: withProfile(s.save, s.save.activeProfileId, (p) => ({ ...p, activeSession: null })) })),

  completeTutorial: () => set((s) => ({ save: withProfile(s.save, s.save.activeProfileId, (p) => ({ ...p, tutorialDone: true })) })),

  setBoard: (board) => set((s) => ({ save: withProfile(s.save, s.save.activeProfileId, (p) => ({ ...p, board })) })),

  clearNewestSticker: () => set((s) => ({ save: withProfile(s.save, s.save.activeProfileId, (p) => ({ ...p, newestStickerId: null })) })),

  replaceSave: (data) => set({ save: data, screen: data.activeProfileId ? 'home' : 'welcome', lastResult: null }),

  resetProfileProgress: (profileId) =>
    set((s) => ({
      save: withProfile(s.save, profileId, (p) => ({
        ...p,
        missions: {},
        history: [],
        stickers: {},
        board: [],
        activeSession: null,
        newestStickerId: null,
        processedSessionIds: [],
        tutorialDone: false,
      })),
      lastResult: null,
    })),

  resetEverything: () => set({ save: emptySave(), screen: 'welcome', lastResult: null }),

  persistNow: () => storage.save(snapshot(get().save)),
}));

// Persist on change (throttled) and when the page is hidden or closed.
let pending: ReturnType<typeof setTimeout> | null = null;
useApp.subscribe((state, prev) => {
  if (state.save === prev.save) return;
  if (pending) return;
  pending = setTimeout(() => {
    pending = null;
    useApp.getState().persistNow();
  }, 250);
});
if (typeof window !== 'undefined') {
  const flush = () => useApp.getState().persistNow();
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}
