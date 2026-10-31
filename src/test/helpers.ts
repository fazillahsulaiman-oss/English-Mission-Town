import type { Question, Response } from '../engine/types';

/** Builds the correct response for any question straight from its accepted answers. */
export function correctResponse(q: Question): Response {
  switch (q.activityType) {
    case 'multipleChoice':
    case 'pictureChoice':
    case 'listeningChoice':
    case 'storyQuestion':
    case 'dialogue':
      return { kind: 'choice', optionId: q.acceptedAnswers[0]! };
    case 'ordering':
      return { kind: 'order', tileIds: [...q.acceptedAnswers[0]!] };
    case 'dragDrop':
      return { kind: 'placement', placements: { ...q.acceptedAnswers } };
    case 'matching':
      return { kind: 'placement', placements: Object.fromEntries(Object.entries(q.acceptedAnswers).map(([l, r]) => [r, l])) };
    case 'fillBlank':
      if (q.inputMode === 'typed') return { kind: 'typed', values: q.acceptedAnswers.map((a) => a[0]!) };
      return { kind: 'placement', placements: Object.fromEntries(q.acceptedAnswers.map((ids, i) => [ids[0]!, `blank-${i}`])) };
  }
}

/** Builds a complete but wrong response, or null when every complete response is correct. */
export function wrongResponse(q: Question): Response | null {
  switch (q.activityType) {
    case 'multipleChoice':
    case 'pictureChoice':
    case 'listeningChoice':
    case 'storyQuestion':
    case 'dialogue': {
      const w = q.options.find((o) => !q.acceptedAnswers.includes(o.id));
      return w ? { kind: 'choice', optionId: w.id } : null;
    }
    case 'ordering':
      return { kind: 'order', tileIds: [...q.acceptedAnswers[0]!].reverse() };
    case 'dragDrop': {
      const ids = Object.keys(q.acceptedAnswers);
      const groups = q.groups.map((g) => g.id);
      const placements = { ...q.acceptedAnswers };
      const first = ids[0]!;
      placements[first] = groups.find((g) => g !== placements[first])!;
      return { kind: 'placement', placements };
    }
    case 'matching': {
      const lefts = Object.keys(q.acceptedAnswers);
      const placements: Record<string, string> = {};
      lefts.forEach((l, i) => (placements[q.acceptedAnswers[lefts[(i + 1) % lefts.length]!]!] = l));
      return { kind: 'placement', placements };
    }
    case 'fillBlank':
      if (q.inputMode === 'typed') return { kind: 'typed', values: q.acceptedAnswers.map(() => 'zzz') };
      return {
        kind: 'placement',
        placements: Object.fromEntries(
          q.acceptedAnswers.map((ids, i) => {
            const accepted = new Set(ids.map((id) => q.wordBank.find((w) => w.id === id)?.text));
            const wrong = q.wordBank.find((w) => !accepted.has(w.text))!;
            return [wrong.id, `blank-${i}`];
          }),
        ),
      };
  }
}
