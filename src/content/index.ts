import type { CategoryId, Mission, Question, YearLevel } from '../engine/types';
import { EVERYDAY_ENGLISH } from './missions/everydayEnglish';
import { GRAMMAR_QUEST } from './missions/grammarQuest';
import { LISTEN_DISCOVER } from './missions/listenDiscover';
import { SENTENCE_BUILDER } from './missions/sentenceBuilder';
import { STORY_ADVENTURE } from './missions/storyAdventure';
import { WORD_EXPLORER } from './missions/wordExplorer';

/** A content pack is tied to one curriculum version so future curricula can ship as new packs. */
export interface ContentPack {
  curriculumVersion: string;
  missions: Mission[];
}

export const STARTER_PACK: ContentPack = {
  curriculumVersion: 'kssr-2017-penjajaran',
  missions: [...WORD_EXPLORER, ...LISTEN_DISCOVER, ...SENTENCE_BUILDER, ...GRAMMAR_QUEST, ...EVERYDAY_ENGLISH, ...STORY_ADVENTURE],
};

export const MISSIONS: Mission[] = STARTER_PACK.missions;
export const MISSION_BY_ID: Record<string, Mission> = Object.fromEntries(MISSIONS.map((m) => [m.id, m]));
export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(MISSIONS.flatMap((m) => m.questions.map((q) => [q.id, q])));

export function missionsFor(categoryId: CategoryId, year: YearLevel): Mission[] {
  return MISSIONS.filter((m) => m.categoryId === categoryId && m.yearLevel === year).sort((a, b) => a.order - b.order);
}

/** The next mission in the same category and year, then the next category in the same year. */
export function nextMission(current: Mission): Mission | undefined {
  const path = missionsFor(current.categoryId, current.yearLevel);
  const idx = path.findIndex((m) => m.id === current.id);
  if (idx >= 0 && idx < path.length - 1) return path[idx + 1];
  const order: CategoryId[] = ['word-explorer', 'listen-discover', 'sentence-builder', 'grammar-quest', 'everyday-english', 'story-adventure'];
  const nextCat = order[(order.indexOf(current.categoryId) + 1) % order.length]!;
  return missionsFor(nextCat, current.yearLevel)[0];
}
