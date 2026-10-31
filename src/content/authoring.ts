// Compact authoring helpers. Mission files describe questions with these helpers;
// `buildMission` fills in ids, mission metadata and curriculum metadata.
import { ACTIVE_CURRICULUM_ID } from './curricula';
import type {
  CategoryId,
  Choice,
  CurriculumSkill,
  Difficulty,
  DialogueLine,
  GlossaryEntry,
  Mission,
  Picture,
  Question,
  SceneRelation,
  SceneSpec,
  YearLevel,
} from '../engine/types';

type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;
type MissionFilled = 'id' | 'categoryId' | 'missionId' | 'yearLevel' | 'curriculum' | 'learningObjective' | 'difficulty';
export type QuestionDraft = DistributiveOmit<Question, MissionFilled> & {
  difficulty?: Difficulty;
  learningObjective?: string;
};

export interface Extra {
  difficulty?: Difficulty;
  objective?: string;
  glossary?: GlossaryEntry[];
  image?: Picture;
  /** Authored listening script. */
  audio?: string;
  storyId?: string;
  labels?: boolean;
}

export type OptionInput = string | { text: string; picture: Picture };

export function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'x'
  );
}

/** Picture option with a label. */
export function P(text: string, picture: Picture = text): { text: string; picture: Picture } {
  return { text, picture };
}

export function scene(item: string, relation: SceneRelation, anchor: string): SceneSpec {
  return { kind: 'scene', item, relation, anchor };
}

export function gloss(word: string, synonym: string | null, explanation: string, example: string, assessed = false): GlossaryEntry {
  return { word, synonym, explanation, example, assessed };
}

function toChoices(inputs: OptionInput[], prefix: string): Choice[] {
  const used = new Set<string>();
  return inputs.map((inp) => {
    const text = typeof inp === 'string' ? inp : inp.text;
    const picture = typeof inp === 'string' ? null : inp.picture;
    let id = `${prefix}-${slug(text)}`;
    let n = 2;
    while (used.has(id)) id = `${prefix}-${slug(text)}-${n++}`;
    used.add(id);
    return { id, text, picture };
  });
}

function base(prompt: string, hint: string, explanation: string, x: Extra = {}) {
  return {
    prompt,
    hint,
    explanation,
    imageAsset: x.image ?? null,
    audioScript: x.audio ?? null,
    audioAsset: null,
    glossaryEntries: x.glossary ?? [],
    storyId: x.storyId ?? null,
    ...(x.difficulty ? { difficulty: x.difficulty } : {}),
    ...(x.objective ? { learningObjective: x.objective } : {}),
  };
}

function choiceFields(answer: OptionInput, wrong: OptionInput[], labels: boolean) {
  const options = toChoices([answer, ...wrong], 'o');
  return { options, acceptedAnswers: [options[0]!.id], showOptionLabels: labels };
}

/** Text multiple choice. The first option is correct; options are shuffled at runtime. */
export function mc(prompt: string, answer: OptionInput, wrong: OptionInput[], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  return { activityType: 'multipleChoice', ...base(prompt, hint, explanation, x), ...choiceFields(answer, wrong, x.labels ?? true) };
}

/** Picture choice. Labels hidden by default so the child reads the prompt and looks at pictures. */
export function pc(prompt: string, answer: OptionInput, wrong: OptionInput[], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  return { activityType: 'pictureChoice', ...base(prompt, hint, explanation, x), ...choiceFields(answer, wrong, x.labels ?? false) };
}

/** Listen and choose. `script` is the exact authored audio. */
export function listen(script: string, prompt: string, answer: OptionInput, wrong: OptionInput[], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  const anyPicture = [answer, ...wrong].some((o) => typeof o !== 'string');
  return {
    activityType: 'listeningChoice',
    ...base(prompt, hint, explanation, { ...x, audio: script }),
    ...choiceFields(answer, wrong, x.labels ?? !anyPicture),
  };
}

export function dlg(prompt: string, lines: [string, string | null][], answer: string, wrong: string[], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  const dl: DialogueLine[] = lines.map(([speaker, text]) => ({ speaker, text }));
  return { activityType: 'dialogue', ...base(prompt, hint, explanation, x), lines: dl, ...choiceFields(answer, wrong, true) };
}

export function storyQ(storyId: string, prompt: string, answer: OptionInput, wrong: OptionInput[], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  return {
    activityType: 'storyQuestion',
    ...base(prompt, hint, explanation, { ...x, storyId }),
    ...choiceFields(answer, wrong, x.labels ?? true),
  };
}

/**
 * Ordering. `tiles` are given in a correct order. `alt` lists other valid complete orders
 * (as tile texts). Sentence tiles are lower-case except proper nouns and "I"; the first
 * placed word is capitalised on screen.
 */
export function order(
  prompt: string,
  tiles: OptionInput[],
  hint: string,
  explanation: string,
  x: Extra & { alt?: string[][]; kind?: 'sentence' | 'sequence' } = {},
): QuestionDraft {
  const choices = toChoices(tiles, 't');
  const ids = choices.map((c) => c.id);
  const toIds = (texts: string[]): string[] => {
    const pool = [...choices];
    return texts.map((t) => {
      const i = pool.findIndex((c) => c.text === t);
      if (i < 0) throw new Error(`Alternative order uses unknown tile "${t}" in "${prompt}"`);
      return pool.splice(i, 1)[0]!.id;
    });
  };
  return {
    activityType: 'ordering',
    ...base(prompt, hint, explanation, x),
    orderingKind: x.kind ?? 'sentence',
    tiles: choices,
    acceptedAnswers: [ids, ...(x.alt ?? []).map(toIds)],
  };
}

/** Drag items into groups. items: [text, groupText, picture?] */
export function sort(prompt: string, groups: OptionInput[], items: [string, string, Picture?][], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  const g = toChoices(groups, 'g');
  const it = toChoices(items.map(([t, , p]) => (p ? { text: t, picture: p } : t)), 'i');
  const accepted: Record<string, string> = {};
  items.forEach(([, groupText], i) => {
    const grp = g.find((c) => c.text === groupText);
    if (!grp) throw new Error(`Unknown group "${groupText}" in "${prompt}"`);
    accepted[it[i]!.id] = grp.id;
  });
  return { activityType: 'dragDrop', ...base(prompt, hint, explanation, x), groups: g, items: it, acceptedAnswers: accepted };
}

/** Matching board. Each pair is [left, right]; the whole board is one question. */
export function match(prompt: string, pairs: [OptionInput, OptionInput][], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  const left = toChoices(pairs.map((p) => p[0]), 'l');
  const right = toChoices(pairs.map((p) => p[1]), 'r');
  const accepted: Record<string, string> = {};
  left.forEach((l, i) => (accepted[l.id] = right[i]!.id));
  return { activityType: 'matching', ...base(prompt, hint, explanation, x), left, right, acceptedAnswers: accepted };
}

/**
 * Fill blanks with word tiles. `answers[i]` is the text of the correct tile for blank i
 * (use "a|b" for more than one acceptable tile). `bank` must contain every answer.
 */
export function blank(prompt: string, text: string, bank: string[], answers: string[], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  const wordBank = toChoices(bank, 'w');
  const acceptedAnswers = answers.map((a) =>
    a.split('|').map((variant) => {
      const c = wordBank.find((w) => w.text === variant);
      if (!c) throw new Error(`Blank answer "${variant}" missing from bank in "${text}"`);
      return c.id;
    }),
  );
  return {
    activityType: 'fillBlank',
    ...base(prompt, hint, explanation, x),
    text,
    inputMode: 'tiles',
    wordBank,
    acceptedAnswers,
    caseSensitive: false,
    assessPunctuation: false,
  };
}

/** Typed fill-in. answers[i] lists every accepted spelling for blank i. */
export function typed(prompt: string, text: string, answers: string[][], hint: string, explanation: string, x: Extra = {}): QuestionDraft {
  return {
    activityType: 'fillBlank',
    ...base(prompt, hint, explanation, x),
    text,
    inputMode: 'typed',
    wordBank: [],
    acceptedAnswers: answers,
    caseSensitive: false,
    assessPunctuation: false,
  };
}

export interface MissionSpec {
  id: string;
  categoryId: CategoryId;
  yearLevel: YearLevel;
  order: number;
  title: string;
  blurb: string;
  skill: CurriculumSkill;
  objective: string;
  difficulty?: Difficulty;
}

export function buildMission(spec: MissionSpec, drafts: QuestionDraft[]): Mission {
  const curriculum = {
    curriculumVersion: ACTIVE_CURRICULUM_ID,
    schoolYear: spec.yearLevel,
    curriculumSource: null,
    skill: spec.skill,
    learningObjective: spec.objective,
    standardCode: null,
    mappingStatus: 'pendingTeacherReview' as const,
    reviewNote: null,
  };
  const questions = drafts.map((d, i): Question => {
    const objective = d.learningObjective ?? spec.objective;
    return {
      ...d,
      id: `${spec.id}-q${i + 1}`,
      categoryId: spec.categoryId,
      missionId: spec.id,
      yearLevel: spec.yearLevel,
      difficulty: d.difficulty ?? spec.difficulty ?? (Math.min(3, spec.order) as Difficulty),
      learningObjective: objective,
      curriculum: { ...curriculum, learningObjective: objective },
    } as Question;
  });
  return {
    id: spec.id,
    categoryId: spec.categoryId,
    yearLevel: spec.yearLevel,
    order: spec.order,
    title: spec.title,
    blurb: spec.blurb,
    curriculum,
    questions,
  };
}
