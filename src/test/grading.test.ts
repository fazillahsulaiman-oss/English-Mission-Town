import { describe, expect, it } from 'vitest';
import { blank, buildMission, match, mc, order, sort, typed } from '../content/authoring';
import { grade, joinSentenceTiles, normaliseTyped } from '../engine/grading';
import type { FillBlankQuestion, MatchingQuestion, OrderingQuestion, DragDropQuestion, MultipleChoiceQuestion } from '../engine/types';

const mission = buildMission(
  { id: 't-m', categoryId: 'sentence-builder', yearLevel: 2, order: 1, title: 'T', blurb: 'T', skill: 'Writing', objective: 'Test' },
  [
    order('Build', ['I', 'brush', 'my', 'teeth', 'every', 'morning', '.'], 'h', 'e', { alt: [['every', 'morning', 'I', 'brush', 'my', 'teeth', '.']] }),
    order('Build', ['the', 'children', 'are', 'in', 'the', 'park', '.'], 'h', 'e'),
    match('Match', [['big', 'not small'], ['hot', 'not cold']], 'h', 'e'),
    sort('Sort', ['a', 'an'], [['ball', 'a'], ['egg', 'an']], 'h', 'e'),
    blank('Fill', 'I see ___ owl and ___ duck.', ['an', 'a', 'a', 'an'], ['an', 'a'], 'h', 'e'),
    typed('Type', 'She opened the window ___ it was hot.', [['because', 'as', 'since']], 'h', 'e'),
    mc('Q', 'has', ['have', 'having'], 'h', 'e'),
    blank('Fill', 'First ___ then ___.', ['First', 'Then', 'Next', 'Finally'], ['First', 'Then|Next'], 'h', 'e'),
  ],
);
const [ord, dupOrd, mat, dd, fb, ty, choice, multi] = mission.questions as [
  OrderingQuestion,
  OrderingQuestion,
  MatchingQuestion,
  DragDropQuestion,
  FillBlankQuestion,
  FillBlankQuestion,
  MultipleChoiceQuestion,
  FillBlankQuestion,
];
const idOf = (q: OrderingQuestion, text: string, nth = 0) => q.tiles.filter((t) => t.text === text)[nth]!.id;

describe('choice grading', () => {
  it('grades by stable option id, not position', () => {
    const correctId = choice.acceptedAnswers[0]!;
    expect(grade(choice, { kind: 'choice', optionId: correctId }).correct).toBe(true);
    const other = choice.options.find((o) => o.id !== correctId)!.id;
    expect(grade(choice, { kind: 'choice', optionId: other }).correct).toBe(false);
    expect(grade(choice, { kind: 'choice', optionId: 'not-an-option' }).complete).toBe(false);
  });
});

describe('ordering grading', () => {
  it('accepts every explicitly authored valid sentence order', () => {
    const main = ['I', 'brush', 'my', 'teeth', 'every', 'morning', '.'].map((t) => idOf(ord, t));
    const alt = ['every', 'morning', 'I', 'brush', 'my', 'teeth', '.'].map((t) => idOf(ord, t));
    expect(grade(ord, { kind: 'order', tileIds: main }).correct).toBe(true);
    expect(grade(ord, { kind: 'order', tileIds: alt }).correct).toBe(true);
  });
  it('rejects an order that was not authored', () => {
    const bad = ['my', 'teeth', 'I', 'brush', 'every', 'morning', '.'].map((t) => idOf(ord, t));
    expect(grade(ord, { kind: 'order', tileIds: bad }).correct).toBe(false);
  });
  it('treats tiles with identical text as interchangeable', () => {
    const swapped = [idOf(dupOrd, 'the', 1), idOf(dupOrd, 'children'), idOf(dupOrd, 'are'), idOf(dupOrd, 'in'), idOf(dupOrd, 'the', 0), idOf(dupOrd, 'park'), idOf(dupOrd, '.')];
    expect(grade(dupOrd, { kind: 'order', tileIds: swapped }).correct).toBe(true);
  });
  it('is incomplete until every tile is used', () => {
    expect(grade(ord, { kind: 'order', tileIds: [idOf(ord, 'I')] })).toEqual({ complete: false, correct: false });
  });
  it('capitalises the first word and attaches punctuation for display', () => {
    expect(joinSentenceTiles(['every', 'morning', 'I', 'brush', 'my', 'teeth', '.'])).toBe('Every morning I brush my teeth.');
    expect(joinSentenceTiles(['yes', ',', 'it', 'is', '.'])).toBe('Yes, it is.');
  });
});

describe('matching and sorting', () => {
  it('a complete matching board counts as one answer', () => {
    const [l1, l2] = mat.left;
    const [r1, r2] = mat.right;
    expect(grade(mat, { kind: 'placement', placements: { [r1!.id]: l1!.id, [r2!.id]: l2!.id } })).toEqual({ complete: true, correct: true });
    expect(grade(mat, { kind: 'placement', placements: { [r1!.id]: l2!.id, [r2!.id]: l1!.id } })).toEqual({ complete: true, correct: false });
    expect(grade(mat, { kind: 'placement', placements: { [r1!.id]: l1!.id } }).complete).toBe(false);
  });
  it('drag into groups needs every item in its group', () => {
    const [ball, egg] = dd.items;
    const [a, an] = dd.groups;
    expect(grade(dd, { kind: 'placement', placements: { [ball!.id]: a!.id, [egg!.id]: an!.id } }).correct).toBe(true);
    expect(grade(dd, { kind: 'placement', placements: { [ball!.id]: an!.id, [egg!.id]: an!.id } }).correct).toBe(false);
  });
});

describe('fill in the blanks', () => {
  it('duplicate word tiles are interchangeable', () => {
    const anTiles = fb.wordBank.filter((w) => w.text === 'an');
    const aTiles = fb.wordBank.filter((w) => w.text === 'a');
    expect(grade(fb, { kind: 'placement', placements: { [anTiles[1]!.id]: 'blank-0', [aTiles[1]!.id]: 'blank-1' } }).correct).toBe(true);
    expect(grade(fb, { kind: 'placement', placements: { [aTiles[0]!.id]: 'blank-0', [anTiles[0]!.id]: 'blank-1' } }).correct).toBe(false);
  });
  it('accepts explicitly listed alternative tiles', () => {
    const id = (t: string) => multi.wordBank.find((w) => w.text === t)!.id;
    expect(grade(multi, { kind: 'placement', placements: { [id('First')]: 'blank-0', [id('Next')]: 'blank-1' } }).correct).toBe(true);
    expect(grade(multi, { kind: 'placement', placements: { [id('First')]: 'blank-0', [id('Finally')]: 'blank-1' } }).correct).toBe(false);
  });
  it('typed answers: trims, ignores case, accepts listed variants, no fuzzy matching', () => {
    expect(grade(ty, { kind: 'typed', values: ['  Because '] }).correct).toBe(true);
    expect(grade(ty, { kind: 'typed', values: ['since'] }).correct).toBe(true);
    expect(grade(ty, { kind: 'typed', values: ['becuase'] }).correct).toBe(false);
    expect(grade(ty, { kind: 'typed', values: ['so'] }).correct).toBe(false);
    expect(grade(ty, { kind: 'typed', values: ['   '] }).complete).toBe(false);
  });
  it('normalises punctuation only when punctuation is not assessed', () => {
    expect(normaliseTyped('Played.', { caseSensitive: false, assessPunctuation: false })).toBe('played');
    expect(normaliseTyped('Played.', { caseSensitive: false, assessPunctuation: true })).toBe('played.');
    expect(normaliseTyped('Played', { caseSensitive: true, assessPunctuation: false })).toBe('Played');
  });
});

import { placeItem } from '../components/SlotBoard';
describe('tap/drag placement rule', () => {
  it('moving into an occupied single slot swaps the occupant back', () => {
    const cap = { 'slot-0': 1, 'slot-1': 1 };
    let p = placeItem({}, cap, 'a', 'slot-0');
    p = placeItem(p, cap, 'b', 'slot-1');
    p = placeItem(p, cap, 'b', 'slot-0');
    expect(p).toEqual({ b: 'slot-0', a: 'slot-1' });
    expect(placeItem(p, cap, 'a', null)).toEqual({ b: 'slot-0' });
    expect(placeItem({ x: 'g1' }, { g1: 99 }, 'y', 'g1')).toEqual({ x: 'g1', y: 'g1' });
  });
});
