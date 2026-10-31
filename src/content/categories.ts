import type { Category, CategoryId } from '../engine/types';

export const CATEGORIES: Category[] = [
  { id: 'word-explorer', name: 'Word Explorer', place: 'Town Park', tagline: 'Find and sort new words', colour: '#22c55e', skill: 'Reading' },
  { id: 'listen-discover', name: 'Listen & Discover', place: 'Discovery Station', tagline: 'Listen carefully and choose', colour: '#0ea5e9', skill: 'Listening' },
  { id: 'sentence-builder', name: 'Sentence Builder', place: 'School Clubhouse', tagline: 'Put words in order', colour: '#f97316', skill: 'Writing' },
  { id: 'grammar-quest', name: 'Grammar Quest', place: 'Mystery House', tagline: 'Solve word puzzles', colour: '#8b5cf6', skill: 'Writing' },
  { id: 'everyday-english', name: 'Everyday English', place: 'Café & Market', tagline: 'Talk in everyday places', colour: '#ec4899', skill: 'Speaking' },
  { id: 'story-adventure', name: 'Story Adventure', place: 'Story Treehouse', tagline: 'Read stories and find answers', colour: '#eab308', skill: 'Reading' },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;
