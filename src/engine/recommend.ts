import type { Mission } from './types';

export type RecommendationKind = 'easier' | 'same' | 'next';

export interface Recommendation {
  kind: RecommendationKind;
  missionId: string;
  message: string;
}

/**
 * Transparent rule:
 *   below 4/8  -> an easier or scaffolded mission (the previous mission, or a replay without a timer)
 *   4–6/8      -> more practice at the same level (replay this mission)
 *   7–8/8      -> the next mission
 * Never changes the child's chosen school year.
 */
export function recommend(missionsInPath: Mission[], current: Mission, score: number): Recommendation {
  const idx = missionsInPath.findIndex((m) => m.id === current.id);
  if (score < 4) {
    const prev = idx > 0 ? missionsInPath[idx - 1] : undefined;
    if (prev) return { kind: 'easier', missionId: prev.id, message: `Warm up with "${prev.title}", then try again.` };
    return { kind: 'easier', missionId: current.id, message: 'Play this mission again with no time limit and use the hints.' };
  }
  if (score <= 6) {
    return { kind: 'same', missionId: current.id, message: 'A little more practice here will make you even stronger.' };
  }
  const next = idx >= 0 ? missionsInPath[idx + 1] : undefined;
  if (next) return { kind: 'next', missionId: next.id, message: `You are ready for "${next.title}"!` };
  return { kind: 'next', missionId: current.id, message: 'You finished every mission here. Try another place in town!' };
}
