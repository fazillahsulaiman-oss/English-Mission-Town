import type { StickerTier } from '../engine/rewards';
import type { CategoryId } from '../engine/types';

export type StickerAnimal = 'cat' | 'tiger' | 'tapir' | 'turtle' | 'otter' | 'hornbill' | 'elephant' | 'mousedeer' | 'orangutan' | 'sunbear' | 'pangolin' | 'owl';
export type StickerAccessory = 'helmet' | 'rainbow' | 'cape' | 'rocket' | 'magnifier' | 'wizard' | 'crown' | 'headphones' | 'chef' | 'book' | 'wand' | 'scarf' | 'leaf' | 'medal' | 'balloon' | 'pencil';

export interface StickerDef {
  id: string;
  categoryId: CategoryId;
  tier: StickerTier;
  name: string;
  animal: StickerAnimal;
  accessory: StickerAccessory;
  colours: { bg: string; ring: string; body: string };
}

const s = (categoryId: CategoryId, tier: StickerTier, name: string, animal: StickerAnimal, accessory: StickerAccessory, bg: string, ring: string, body: string): StickerDef => ({
  id: `${categoryId}-${tier}`,
  categoryId,
  tier,
  name,
  animal,
  accessory,
  colours: { bg, ring, body },
});

// 24 original stickers: four progression stickers for each place in town.
export const STICKERS: StickerDef[] = [
  s('word-explorer', 'starter', 'Leafy Mouse-deer', 'mousedeer', 'leaf', '#dcfce7', '#22c55e', '#c08457'),
  s('word-explorer', 'explorer', 'Rainbow Tiger', 'tiger', 'rainbow', '#fef9c3', '#f97316', '#fb923c'),
  s('word-explorer', 'adventure', 'Explorer Elephant', 'elephant', 'scarf', '#e0f2fe', '#0ea5e9', '#a5b4cf'),
  s('word-explorer', 'mastery', 'Royal Pangolin', 'pangolin', 'crown', '#fef3c7', '#eab308', '#b45309'),

  s('listen-discover', 'starter', 'DJ Owl', 'owl', 'headphones', '#e0f2fe', '#0284c7', '#a16207'),
  s('listen-discover', 'explorer', 'Space Cat', 'cat', 'helmet', '#ede9fe', '#6366f1', '#fb923c'),
  s('listen-discover', 'adventure', 'Rocket Turtle', 'turtle', 'rocket', '#cffafe', '#06b6d4', '#16a34a'),
  s('listen-discover', 'mastery', 'Star Sun Bear', 'sunbear', 'medal', '#fef3c7', '#f59e0b', '#44403c'),

  s('sentence-builder', 'starter', 'Pencil Tapir', 'tapir', 'pencil', '#ffedd5', '#f97316', '#334155'),
  s('sentence-builder', 'explorer', 'Super Tapir', 'tapir', 'cape', '#fee2e2', '#ef4444', '#334155'),
  s('sentence-builder', 'adventure', 'Builder Orang-utan', 'orangutan', 'helmet', '#ffedd5', '#ea580c', '#c2410c'),
  s('sentence-builder', 'mastery', 'Golden Elephant', 'elephant', 'crown', '#fef9c3', '#ca8a04', '#a5b4cf'),

  s('grammar-quest', 'starter', 'Detective Otter', 'otter', 'magnifier', '#f3e8ff', '#9333ea', '#92400e'),
  s('grammar-quest', 'explorer', 'Wizard Hornbill', 'hornbill', 'wizard', '#ede9fe', '#7c3aed', '#334155'),
  s('grammar-quest', 'adventure', 'Magic Cat', 'cat', 'wand', '#fae8ff', '#c026d3', '#94a3b8'),
  s('grammar-quest', 'mastery', 'Clever Owl', 'owl', 'book', '#e0e7ff', '#4f46e5', '#78716c'),

  s('everyday-english', 'starter', 'Chef Sun Bear', 'sunbear', 'chef', '#fce7f3', '#db2777', '#44403c'),
  s('everyday-english', 'explorer', 'Party Otter', 'otter', 'balloon', '#ffe4e6', '#e11d48', '#92400e'),
  s('everyday-english', 'adventure', 'Friendly Tiger', 'tiger', 'scarf', '#fdf2f8', '#ec4899', '#fb923c'),
  s('everyday-english', 'mastery', 'Superstar Mouse-deer', 'mousedeer', 'medal', '#fef3c7', '#f59e0b', '#c08457'),

  s('story-adventure', 'starter', 'Bookworm Turtle', 'turtle', 'book', '#fef9c3', '#eab308', '#16a34a'),
  s('story-adventure', 'explorer', 'Storyteller Orang-utan', 'orangutan', 'scarf', '#fff7ed', '#f59e0b', '#c2410c'),
  s('story-adventure', 'adventure', 'Flying Hornbill', 'hornbill', 'cape', '#ecfccb', '#65a30d', '#334155'),
  s('story-adventure', 'mastery', 'Moon Pangolin', 'pangolin', 'wizard', '#e0e7ff', '#6366f1', '#b45309'),
];

export const STICKER_BY_ID: Record<string, StickerDef> = Object.fromEntries(STICKERS.map((x) => [x.id, x]));
export const stickerId = (categoryId: CategoryId, tier: StickerTier) => `${categoryId}-${tier}`;
