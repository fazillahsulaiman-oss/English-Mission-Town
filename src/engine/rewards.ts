import type { CategoryId } from './types';

export type StickerTier = 'starter' | 'explorer' | 'adventure' | 'mastery';

export interface MissionProgressLike {
  categoryId: CategoryId;
  completions: number;
  bestStars: number;
}

export const TIER_RULES: Record<StickerTier, { label: string; requirement: string }> = {
  starter: { label: 'Starter', requirement: 'Finish your first mission here.' },
  explorer: { label: 'Explorer', requirement: 'Finish 3 different missions here.' },
  adventure: { label: 'Adventure', requirement: 'Finish 6 different missions here.' },
  mastery: { label: 'Mastery', requirement: 'Get 3 stars in 3 different missions here.' },
};

/**
 * Deterministic sticker tiers earned in a category. Counts unique missions only,
 * so replaying the same mission never inflates progress.
 */
export function earnedTiers(missions: Record<string, MissionProgressLike>, categoryId: CategoryId): StickerTier[] {
  const inCat = Object.values(missions).filter((m) => m.categoryId === categoryId);
  const completed = inCat.filter((m) => m.completions > 0).length;
  const threeStar = inCat.filter((m) => m.completions > 0 && m.bestStars >= 3).length;
  const tiers: StickerTier[] = [];
  if (completed >= 1) tiers.push('starter');
  if (completed >= 3) tiers.push('explorer');
  if (completed >= 6) tiers.push('adventure');
  if (threeStar >= 3) tiers.push('mastery');
  return tiers;
}

export function tierProgress(
  missions: Record<string, MissionProgressLike>,
  categoryId: CategoryId,
): { completed: number; threeStar: number } {
  const inCat = Object.values(missions).filter((m) => m.categoryId === categoryId && m.completions > 0);
  return { completed: inCat.length, threeStar: inCat.filter((m) => m.bestStars >= 3).length };
}
