// Content integrity checks, run at startup (dev and production) and in unit tests.
import { pictureExists } from '../art/icons';
import { CATEGORIES } from './categories';
import { CURRICULA } from './curricula';
import { STORIES, STORY_BY_ID, STORY_LENGTH_GUIDE, wordCount } from './stories';
import { QUESTIONS_PER_MISSION } from '../engine/scoring';
import { isChoiceBased, YEAR_LEVELS, type Choice, type Mission, type Picture, type Question } from '../engine/types';

export interface ValidationReport {
  errors: string[];
  warnings: string[];
}

function checkPicture(p: Picture | null, where: string, errors: string[]) {
  if (p === null) return;
  if (typeof p === 'string') {
    if (!pictureExists(p)) errors.push(`${where}: unknown picture "${p}"`);
  } else {
    if (!pictureExists(p.anchor)) errors.push(`${where}: unknown scene anchor "${p.anchor}"`);
    if (!pictureExists(p.item)) errors.push(`${where}: unknown scene item "${p.item}"`);
  }
}

function checkChoices(list: Choice[], where: string, errors: string[]) {
  const ids = new Set<string>();
  for (const c of list) {
    if (ids.has(c.id)) errors.push(`${where}: duplicate id ${c.id}`);
    ids.add(c.id);
    if (!c.text && !c.picture) errors.push(`${where}: choice ${c.id} has no text or picture`);
    checkPicture(c.picture, `${where} ${c.id}`, errors);
  }
}

function questionSignature(q: Question): string {
  const parts: string[] = [q.prompt, q.audioScript ?? '', q.storyId ?? ''];
  if (isChoiceBased(q)) parts.push(q.options.map((o) => o.text).join('|'));
  if (q.activityType === 'ordering') parts.push(q.tiles.map((t) => t.text).join('|'));
  if (q.activityType === 'fillBlank') parts.push(q.text);
  if (q.activityType === 'dragDrop') parts.push(q.items.map((t) => t.text).join('|'));
  if (q.activityType === 'matching') parts.push(q.left.map((t) => t.text).join('|'));
  if (q.activityType === 'dialogue') parts.push(q.lines.map((l) => l.text ?? '_').join('|'));
  return parts.join('§');
}

export function validateQuestion(q: Question, errors: string[]) {
  const where = q.id;
  if (!q.prompt.trim()) errors.push(`${where}: empty prompt`);
  if (!q.hint.trim()) errors.push(`${where}: missing hint`);
  if (!q.explanation.trim()) errors.push(`${where}: missing explanation`);
  if (!q.learningObjective.trim()) errors.push(`${where}: missing learning objective`);
  if (q.curriculum.mappingStatus === 'verified' && !q.curriculum.curriculumSource) errors.push(`${where}: verified mapping without a source`);
  if (q.curriculum.standardCode !== null && q.curriculum.mappingStatus !== 'verified') errors.push(`${where}: standard code present on an unverified mapping`);
  if (!CURRICULA.some((c) => c.id === q.curriculum.curriculumVersion)) errors.push(`${where}: unknown curriculum version`);
  checkPicture(q.imageAsset, where, errors);
  if (q.storyId && !STORY_BY_ID[q.storyId]) errors.push(`${where}: unknown story ${q.storyId}`);
  if (q.categoryId === 'story-adventure' && !q.storyId) errors.push(`${where}: story question without a story`);
  if (q.categoryId === 'listen-discover' && !q.audioScript) errors.push(`${where}: listening question without an audio script`);
  if (q.activityType === 'listeningChoice' && !q.audioScript) errors.push(`${where}: listeningChoice without audio script`);

  if (isChoiceBased(q)) {
    checkChoices(q.options, where, errors);
    if (q.options.length < 2) errors.push(`${where}: needs at least 2 options`);
    if (q.acceptedAnswers.length < 1) errors.push(`${where}: no accepted answer`);
    for (const a of q.acceptedAnswers) if (!q.options.some((o) => o.id === a)) errors.push(`${where}: accepted answer ${a} not an option`);
    // Exact comparison: capitalisation questions intentionally differ only by case.
    const texts = q.options.map((o) => o.text ?? '');
    if (new Set(texts).size !== texts.length) errors.push(`${where}: duplicate option text`);
    if (q.activityType === 'pictureChoice' && q.options.some((o) => !o.picture)) errors.push(`${where}: picture choice option without picture`);
    if (q.activityType === 'dialogue' && q.lines.filter((l) => l.text === null).length !== 1) errors.push(`${where}: dialogue needs exactly one gap`);
  }
  switch (q.activityType) {
    case 'ordering': {
      checkChoices(q.tiles, where, errors);
      if (q.tiles.length < 2) errors.push(`${where}: ordering needs 2+ tiles`);
      const all = [...q.tiles.map((t) => t.id)].sort().join('|');
      for (const ord of q.acceptedAnswers) if ([...ord].sort().join('|') !== all) errors.push(`${where}: accepted order is not a permutation of the tiles`);
      break;
    }
    case 'dragDrop': {
      checkChoices(q.groups, where, errors);
      checkChoices(q.items, where, errors);
      for (const it of q.items) {
        const g = q.acceptedAnswers[it.id];
        if (!g || !q.groups.some((x) => x.id === g)) errors.push(`${where}: item ${it.id} has no valid group`);
      }
      for (const g of q.groups) if (!q.items.some((it) => q.acceptedAnswers[it.id] === g.id)) errors.push(`${where}: group ${g.id} is empty`);
      break;
    }
    case 'matching': {
      checkChoices(q.left, where, errors);
      checkChoices(q.right, where, errors);
      if (q.left.length !== q.right.length) errors.push(`${where}: matching sides differ in length`);
      const used = new Set(Object.values(q.acceptedAnswers));
      if (used.size !== q.right.length) errors.push(`${where}: matching answers are not one-to-one`);
      for (const l of q.left) if (!q.right.some((r) => r.id === q.acceptedAnswers[l.id])) errors.push(`${where}: left ${l.id} has no valid match`);
      break;
    }
    case 'fillBlank': {
      const blanks = (q.text.match(/___/g) ?? []).length;
      if (blanks < 1) errors.push(`${where}: fill-blank text has no ___`);
      if (blanks !== q.acceptedAnswers.length) errors.push(`${where}: blank count ${blanks} != answers ${q.acceptedAnswers.length}`);
      if (q.inputMode === 'tiles') {
        checkChoices(q.wordBank, where, errors);
        if (q.wordBank.length <= blanks) errors.push(`${where}: word bank needs a distractor`);
        for (const acc of q.acceptedAnswers) for (const id of acc) if (!q.wordBank.some((w) => w.id === id)) errors.push(`${where}: answer ${id} not in bank`);
      } else {
        for (const acc of q.acceptedAnswers) if (acc.length === 0 || acc.some((a) => !a.trim())) errors.push(`${where}: typed blank has no accepted text`);
      }
      break;
    }
    default:
      break;
  }
}

export function validateMissions(missions: Mission[]): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missionIds = new Set<string>();
  const questionIds = new Set<string>();
  const signatures = new Map<string, string>();

  for (const m of missions) {
    if (missionIds.has(m.id)) errors.push(`duplicate mission id ${m.id}`);
    missionIds.add(m.id);
    if (m.questions.length !== QUESTIONS_PER_MISSION) errors.push(`${m.id}: has ${m.questions.length} questions, expected ${QUESTIONS_PER_MISSION}`);
    for (const q of m.questions) {
      if (questionIds.has(q.id)) errors.push(`duplicate question id ${q.id}`);
      questionIds.add(q.id);
      if (q.missionId !== m.id || q.categoryId !== m.categoryId || q.yearLevel !== m.yearLevel) errors.push(`${q.id}: metadata does not match mission`);
      validateQuestion(q, errors);
      const sig = questionSignature(q);
      const prev = signatures.get(sig);
      if (prev) errors.push(`${q.id}: duplicates ${prev}`);
      signatures.set(sig, q.id);
    }
  }

  for (const c of CATEGORIES) {
    for (const y of YEAR_LEVELS) {
      const ms = missions.filter((m) => m.categoryId === c.id && m.yearLevel === y);
      if (ms.length < 3) errors.push(`${c.id} Year ${y}: only ${ms.length} missions (need 3+)`);
    }
    const types = new Set(missions.filter((m) => m.categoryId === c.id).flatMap((m) => m.questions.map((q) => q.activityType)));
    if (types.size < 2) errors.push(`${c.id}: needs at least two interaction formats`);
  }

  for (const s of STORIES) {
    const [min, max] = STORY_LENGTH_GUIDE[s.yearLevel];
    const n = wordCount(s.text);
    if (n < min || n > max) warnings.push(`story ${s.id}: ${n} words (guide ${min}–${max})`);
    for (const p of s.illustration) checkPicture(p, `story ${s.id}`, errors);
  }
  return { errors, warnings };
}
