import type { FillBlankQuestion, OrderingQuestion, Question, Response } from './types';

export interface GradeResult {
  /** The response is complete enough to be submitted. */
  complete: boolean;
  correct: boolean;
}

const PUNCTUATION = /[.,!?;:'"’‘“”]/g;

/**
 * Normalise a typed answer: trim, collapse whitespace, unify apostrophes, and
 * optionally ignore case and punctuation. Deliberately no fuzzy matching.
 */
export function normaliseTyped(
  value: string,
  opts: { caseSensitive: boolean; assessPunctuation: boolean },
): string {
  let v = value.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  if (!opts.assessPunctuation) v = v.replace(PUNCTUATION, '').replace(/\s+/g, ' ').trim();
  if (!opts.caseSensitive) v = v.toLowerCase();
  return v;
}

function gradeFillBlank(q: FillBlankQuestion, r: Response): GradeResult {
  const blanks = q.acceptedAnswers.length;
  if (q.inputMode === 'typed') {
    if (r.kind !== 'typed') return { complete: false, correct: false };
    const complete = r.values.length === blanks && r.values.every((v) => v.trim().length > 0);
    if (!complete) return { complete, correct: false };
    const correct = q.acceptedAnswers.every((variants, i) => {
      const given = normaliseTyped(r.values[i] ?? '', q);
      return variants.some((a) => normaliseTyped(a, q) === given);
    });
    return { complete, correct };
  }
  if (r.kind !== 'placement') return { complete: false, correct: false };
  // placements: optionId -> blank-N target
  const byBlank: (string | undefined)[] = Array.from({ length: blanks }, () => undefined);
  for (const [optionId, target] of Object.entries(r.placements)) {
    const m = /^blank-(\d+)$/.exec(target);
    if (m) byBlank[Number(m[1])] = optionId;
  }
  const complete = byBlank.every((v) => v !== undefined);
  if (!complete) return { complete, correct: false };
  // Tiles with identical text are interchangeable.
  const textOf = (id: string) => q.wordBank.find((o) => o.id === id)?.text?.toLowerCase() ?? `#${id}`;
  const correct = q.acceptedAnswers.every((ids, i) => {
    const placed = byBlank[i]!;
    return ids.some((id) => id === placed || textOf(id) === textOf(placed));
  });
  return { complete, correct };
}

function tileKey(q: OrderingQuestion, id: string): string {
  const t = q.tiles.find((x) => x.id === id);
  // Sentence tiles with identical text are interchangeable; sequence tiles are unique events.
  if (q.orderingKind === 'sentence' && t?.text) return t.text.toLowerCase();
  return id;
}

function gradeOrdering(q: OrderingQuestion, r: Response): GradeResult {
  if (r.kind !== 'order') return { complete: false, correct: false };
  const complete = r.tileIds.length === q.tiles.length && new Set(r.tileIds).size === q.tiles.length;
  if (!complete) return { complete, correct: false };
  const given = r.tileIds.map((id) => tileKey(q, id)).join('|');
  const correct = q.acceptedAnswers.some((order) => order.map((id) => tileKey(q, id)).join('|') === given);
  return { complete, correct };
}

export function grade(q: Question, r: Response): GradeResult {
  switch (q.activityType) {
    case 'multipleChoice':
    case 'pictureChoice':
    case 'listeningChoice':
    case 'storyQuestion':
    case 'dialogue': {
      if (r.kind !== 'choice') return { complete: false, correct: false };
      const exists = q.options.some((o) => o.id === r.optionId);
      return { complete: exists, correct: exists && q.acceptedAnswers.includes(r.optionId) };
    }
    case 'dragDrop': {
      if (r.kind !== 'placement') return { complete: false, correct: false };
      const complete = q.items.every((it) => r.placements[it.id] !== undefined);
      const correct = complete && q.items.every((it) => r.placements[it.id] === q.acceptedAnswers[it.id]);
      return { complete, correct };
    }
    case 'matching': {
      if (r.kind !== 'placement') return { complete: false, correct: false };
      // placements: rightId -> leftId
      const leftFilled = new Map<string, string>();
      for (const [rightId, leftId] of Object.entries(r.placements)) leftFilled.set(leftId, rightId);
      const complete = q.left.every((l) => leftFilled.has(l.id));
      const correct = complete && q.left.every((l) => leftFilled.get(l.id) === q.acceptedAnswers[l.id]);
      return { complete, correct };
    }
    case 'ordering':
      return gradeOrdering(q, r);
    case 'fillBlank':
      return gradeFillBlank(q, r);
  }
}

/** Build the display string for a sentence made from tiles: auto-capitalise the first word, attach punctuation. */
export function joinSentenceTiles(texts: string[]): string {
  let out = '';
  texts.forEach((t, i) => {
    let word = t;
    if (i === 0 && word.length > 0) word = word[0]!.toUpperCase() + word.slice(1);
    if (/^[.,!?;:]$/.test(word) || out === '') out += word;
    else out += ' ' + word;
  });
  return out;
}

/** Human-readable correct answer, used in supported review explanations. */
export function describeAnswer(q: Question): string {
  switch (q.activityType) {
    case 'multipleChoice':
    case 'pictureChoice':
    case 'listeningChoice':
    case 'storyQuestion':
    case 'dialogue':
      return q.options
        .filter((o) => q.acceptedAnswers.includes(o.id))
        .map((o) => o.text ?? '')
        .join(' / ');
    case 'ordering': {
      const first = q.acceptedAnswers[0] ?? [];
      const texts = first.map((id) => q.tiles.find((t) => t.id === id)?.text ?? '');
      return q.orderingKind === 'sentence' ? joinSentenceTiles(texts) : texts.map((t, i) => `${i + 1}. ${t}`).join('  ');
    }
    case 'dragDrop':
      return q.groups
        .map((g) => `${g.text}: ${q.items.filter((it) => q.acceptedAnswers[it.id] === g.id).map((it) => it.text).join(', ')}`)
        .join('  •  ');
    case 'matching':
      return q.left
        .map((l) => `${l.text ?? ''} → ${q.right.find((r) => r.id === q.acceptedAnswers[l.id])?.text ?? ''}`)
        .join('  •  ');
    case 'fillBlank': {
      let i = 0;
      return q.text.replace(/___/g, () => {
        const acc = q.acceptedAnswers[i++] ?? [];
        if (q.inputMode === 'typed') return acc[0] ?? '';
        return q.wordBank.find((o) => o.id === acc[0])?.text ?? '';
      });
    }
  }
}
