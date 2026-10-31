// Versioned, validated local save data. Everything lives on this device only.
import { z } from 'zod';

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'emt.save';
export const HISTORY_LIMIT = 300;

const year = z.union([z.literal(1), z.literal(2), z.literal(3)]);
const categoryId = z.enum(['word-explorer', 'listen-discover', 'sentence-builder', 'grammar-quest', 'everyday-english', 'story-adventure']);
const timerSetting = z.enum(['none', '30s', '60s']);

export const settingsSchema = z.object({
  soundEffects: z.boolean(),
  voice: z.boolean(),
  motion: z.enum(['system', 'reduced', 'full']),
  celebration: z.enum(['full', 'gentle']),
  curriculumVersion: z.string(),
});
export type Settings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  soundEffects: true,
  voice: true,
  motion: 'system',
  celebration: 'full',
  curriculumVersion: 'kssr-2017-penjajaran',
};

const missionProgressSchema = z.object({
  missionId: z.string(),
  categoryId,
  yearLevel: year,
  completions: z.number().int().min(0),
  bestScore: z.number().int().min(0).max(8),
  bestStars: z.number().int().min(0).max(3),
  lastScore: z.number().int().min(0).max(8),
  lastPlayedAt: z.number(),
});
export type MissionProgress = z.infer<typeof missionProgressSchema>;

const questionResultSchema = z.object({
  questionId: z.string(),
  activityType: z.string(),
  skill: z.string(),
  attempts: z.number().int().min(0).max(3),
  correct: z.boolean(),
  firstAttemptCorrect: z.boolean(),
  timedOut: z.boolean(),
  revealed: z.boolean(),
  listening: z.boolean(),
  textPractice: z.boolean(),
});
export type QuestionResult = z.infer<typeof questionResultSchema>;

const historySchema = z.object({
  sessionId: z.string(),
  missionId: z.string(),
  categoryId,
  yearLevel: year,
  timerSetting,
  completedAt: z.number(),
  score: z.number().int().min(0).max(8),
  stars: z.number().int().min(1).max(3),
  correctAfterRetry: z.number().int().min(0).max(8),
  supportedOrTimedOut: z.number().int().min(0).max(8),
  questions: z.array(questionResultSchema).max(8),
});
export type HistoryEntry = z.infer<typeof historySchema>;

const timerSchema = z.object({ limitMs: z.number().nullable(), usedMs: z.number().min(0), runningSince: z.number().nullable() });
const recordSchema = z.object({
  questionId: z.string(),
  attempts: z.number().int().min(0).max(3),
  correct: z.boolean(),
  firstAttemptCorrect: z.boolean(),
  timedOut: z.boolean(),
  revealed: z.boolean(),
  textPractice: z.boolean(),
  glossaryOpens: z.number().int().min(0),
  resolved: z.boolean(),
});
export const sessionSchema = z.object({
  sessionId: z.string(),
  missionId: z.string(),
  categoryId,
  yearLevel: year,
  timerSetting,
  questionOrder: z.array(z.string()).min(1).max(8),
  shuffleSeed: z.number(),
  index: z.number().int().min(0).max(7),
  phase: z.enum(['ready', 'active', 'incorrectFeedback', 'correctFeedback', 'timedOut', 'supportedReview', 'revealed', 'results']),
  attemptsThisQuestion: z.number().int().min(0).max(3),
  supportMode: z.boolean(),
  timer: timerSchema,
  pauseReasons: z.array(z.enum(['audio', 'glossary', 'hidden', 'menu', 'resume', 'tutorial'])),
  records: z.array(recordSchema).max(8),
  lastSubmissionId: z.string().nullable(),
  startedAt: z.number(),
  completedAt: z.number().nullable(),
});

const placementSchema = z.object({
  stickerId: z.string(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  rotation: z.number().min(-45).max(45),
});
export type Placement = z.infer<typeof placementSchema>;

const profileSchema = z.object({
  id: z.string(),
  nickname: z.string().min(1).max(16),
  avatarId: z.string(),
  yearLevel: year,
  createdAt: z.number(),
  tutorialDone: z.boolean(),
  missions: z.record(z.string(), missionProgressSchema),
  history: z.array(historySchema).max(HISTORY_LIMIT),
  stickers: z.record(z.string(), z.object({ unlockedAt: z.number(), sessionId: z.string() })),
  board: z.array(placementSchema).max(64),
  activeSession: sessionSchema.nullable(),
  newestStickerId: z.string().nullable(),
  processedSessionIds: z.array(z.string()).max(HISTORY_LIMIT),
});
export type Profile = z.infer<typeof profileSchema>;

export const saveSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  settings: settingsSchema,
  profiles: z.array(profileSchema).max(12),
  activeProfileId: z.string().nullable(),
});
export type SaveData = z.infer<typeof saveSchema>;

export function emptySave(): SaveData {
  return { schemaVersion: SCHEMA_VERSION, settings: { ...DEFAULT_SETTINGS }, profiles: [], activeProfileId: null };
}

/** Migrate older shapes to the current schema. Only version 1 exists so far. */
function migrate(raw: unknown): unknown {
  if (raw && typeof raw === 'object' && !('schemaVersion' in raw)) return { ...raw, schemaVersion: SCHEMA_VERSION };
  return raw;
}

export type ParseResult = { ok: true; data: SaveData } | { ok: false; error: string };

export function parseSave(raw: unknown): ParseResult {
  const res = saveSchema.safeParse(migrate(raw));
  if (!res.success) {
    const first = res.error.issues[0];
    return { ok: false, error: first ? `${first.path.join('.') || 'file'}: ${first.message}` : 'Invalid data' };
  }
  const data = res.data;
  if (data.activeProfileId && !data.profiles.some((p) => p.id === data.activeProfileId)) data.activeProfileId = data.profiles[0]?.id ?? null;
  return { ok: true, data };
}

export function parseImportText(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' };
  }
  if (json && typeof json === 'object' && 'app' in json && (json as { app: unknown }).app === 'english-mission-town' && 'data' in json) {
    return parseSave((json as { data: unknown }).data);
  }
  return parseSave(json);
}

export function exportText(data: SaveData): string {
  return JSON.stringify({ app: 'english-mission-town', exportedAt: new Date().toISOString(), data }, null, 2);
}

export interface Storage {
  load(): { data: SaveData; recovered: boolean };
  save(data: SaveData): void;
}

export function createLocalStorage(key = STORAGE_KEY): Storage {
  return {
    load() {
      let text: string | null = null;
      try {
        text = window.localStorage.getItem(key);
      } catch {
        return { data: emptySave(), recovered: false };
      }
      if (!text) return { data: emptySave(), recovered: false };
      try {
        const parsed = parseSave(JSON.parse(text));
        if (parsed.ok) return { data: parsed.data, recovered: false };
      } catch {
        /* fall through */
      }
      // Corrupted data: keep a backup copy, start fresh.
      try {
        window.localStorage.setItem(`${key}.corrupt-${Date.now()}`, text);
      } catch {
        /* ignore quota errors */
      }
      return { data: emptySave(), recovered: true };
    },
    save(data) {
      try {
        window.localStorage.setItem(key, JSON.stringify(data));
      } catch {
        /* storage full or blocked: the game keeps working in memory */
      }
    },
  };
}
