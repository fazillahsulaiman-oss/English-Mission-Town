// Core content and engine types for English Mission Town.
// Content is data-driven: every activity is a member of the `Question` discriminated union.

export type YearLevel = 1 | 2 | 3;
export const YEAR_LEVELS: readonly YearLevel[] = [1, 2, 3] as const;

export type CategoryId =
  | 'word-explorer'
  | 'listen-discover'
  | 'sentence-builder'
  | 'grammar-quest'
  | 'everyday-english'
  | 'story-adventure';

export type Difficulty = 1 | 2 | 3;

/** KSSR-style skill strands. Used for adult reporting, not as a claim of official mapping. */
export type CurriculumSkill = 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Language Arts';

/**
 * `verified`   – a teacher/curriculum reviewer has checked the mapping against the official document.
 * `pendingTeacherReview` – mapping proposed by the content author; must be verified before
 *                  the content is described as curriculum-aligned.
 */
export type MappingStatus = 'verified' | 'pendingTeacherReview';

export interface CurriculumMeta {
  /** Id from the curriculum registry (see content/curricula.ts). */
  curriculumVersion: string;
  schoolYear: YearLevel;
  /** Human-readable reference to the source document, or null if not yet identified. */
  curriculumSource: string | null;
  skill: CurriculumSkill;
  learningObjective: string;
  /** Only filled in when verified against an official document. Never invented. */
  standardCode: string | null;
  mappingStatus: MappingStatus;
  reviewNote: string | null;
}

/** Colour names supported by the illustration library. */
export type ColourName =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'black'
  | 'white'
  | 'grey';

export type SceneRelation = 'on' | 'under' | 'in' | 'next to' | 'behind' | 'in front of';

/** A small composed scene, e.g. "The red bag is under the chair." */
export interface SceneSpec {
  kind: 'scene';
  anchor: string;
  item: string;
  relation: SceneRelation;
}

/**
 * Picture reference. A string uses the grammar `name[:colour][*count]`, e.g.
 * `elephant`, `bag:red`, `apple*3`, `act:read`, `face:happy`, `swatch:blue`.
 */
export type Picture = string | SceneSpec;

export interface Choice {
  /** Stable id used for grading. Never derived from screen position. */
  id: string;
  text: string | null;
  picture: Picture | null;
}

export interface GlossaryEntry {
  word: string;
  /** Only provided when an accurate simpler synonym exists. */
  synonym: string | null;
  explanation: string;
  example: string;
  /** If true the word is being assessed: help is hidden until after the first incorrect attempt. */
  assessed: boolean;
}

export interface DialogueLine {
  speaker: string;
  /** null marks the child's turn (the gap to complete). */
  text: string | null;
}

export type ActivityType =
  | 'multipleChoice'
  | 'pictureChoice'
  | 'dragDrop'
  | 'ordering'
  | 'matching'
  | 'fillBlank'
  | 'dialogue'
  | 'listeningChoice'
  | 'storyQuestion';

interface QuestionBase {
  id: string;
  categoryId: CategoryId;
  missionId: string;
  yearLevel: YearLevel;
  difficulty: Difficulty;
  learningObjective: string;
  curriculum: CurriculumMeta;
  prompt: string;
  imageAsset: Picture | null;
  /** Exact authored script for listening content. */
  audioScript: string | null;
  /** Path to a bundled recording. null = no recording; speech synthesis fallback may be used. */
  audioAsset: string | null;
  hint: string;
  explanation: string;
  glossaryEntries: GlossaryEntry[];
  storyId: string | null;
}

interface ChoiceQuestionFields {
  options: Choice[];
  /** Ids of options that are correct. Usually exactly one. */
  acceptedAnswers: string[];
  showOptionLabels: boolean;
}

export interface MultipleChoiceQuestion extends QuestionBase, ChoiceQuestionFields {
  activityType: 'multipleChoice';
}
export interface PictureChoiceQuestion extends QuestionBase, ChoiceQuestionFields {
  activityType: 'pictureChoice';
}
export interface ListeningChoiceQuestion extends QuestionBase, ChoiceQuestionFields {
  activityType: 'listeningChoice';
}
export interface StoryQuestion extends QuestionBase, ChoiceQuestionFields {
  activityType: 'storyQuestion';
}
export interface DialogueQuestion extends QuestionBase, ChoiceQuestionFields {
  activityType: 'dialogue';
  lines: DialogueLine[];
}

export interface DragDropQuestion extends QuestionBase {
  activityType: 'dragDrop';
  groups: Choice[];
  items: Choice[];
  /** itemId -> groupId */
  acceptedAnswers: Record<string, string>;
}

export interface OrderingQuestion extends QuestionBase {
  activityType: 'ordering';
  orderingKind: 'sentence' | 'sequence';
  tiles: Choice[];
  /** Each entry is a complete valid order of tile ids. Tiles with identical text are interchangeable. */
  acceptedAnswers: string[][];
}

export interface MatchingQuestion extends QuestionBase {
  activityType: 'matching';
  left: Choice[];
  right: Choice[];
  /** leftId -> rightId */
  acceptedAnswers: Record<string, string>;
}

export interface FillBlankQuestion extends QuestionBase {
  activityType: 'fillBlank';
  /** Sentence with one or more `___` gaps. */
  text: string;
  inputMode: 'tiles' | 'typed';
  /** Word tiles (tiles mode). Empty for typed mode. */
  wordBank: Choice[];
  /** Per blank: accepted option ids (tiles) or accepted text variants (typed). */
  acceptedAnswers: string[][];
  caseSensitive: boolean;
  assessPunctuation: boolean;
}

export type Question =
  | MultipleChoiceQuestion
  | PictureChoiceQuestion
  | ListeningChoiceQuestion
  | StoryQuestion
  | DialogueQuestion
  | DragDropQuestion
  | OrderingQuestion
  | MatchingQuestion
  | FillBlankQuestion;

export type ChoiceBasedQuestion =
  | MultipleChoiceQuestion
  | PictureChoiceQuestion
  | ListeningChoiceQuestion
  | StoryQuestion
  | DialogueQuestion;

export function isChoiceBased(q: Question): q is ChoiceBasedQuestion {
  return (
    q.activityType === 'multipleChoice' ||
    q.activityType === 'pictureChoice' ||
    q.activityType === 'listeningChoice' ||
    q.activityType === 'storyQuestion' ||
    q.activityType === 'dialogue'
  );
}

/** A question is a listening item when it carries an authored audio script. */
export function isListening(q: Question): boolean {
  return q.audioScript !== null;
}

export interface Mission {
  id: string;
  categoryId: CategoryId;
  yearLevel: YearLevel;
  /** 1-based order within category + year. */
  order: number;
  title: string;
  blurb: string;
  curriculum: CurriculumMeta;
  questions: Question[];
}

export interface Story {
  id: string;
  yearLevel: YearLevel;
  title: string;
  text: string;
  illustration: Picture[];
  glossaryEntries: GlossaryEntry[];
}

export interface Category {
  id: CategoryId;
  name: string;
  place: string;
  tagline: string;
  colour: string;
  skill: CurriculumSkill;
}

// ---------- Responses ----------

export type Response =
  | { kind: 'choice'; optionId: string }
  | { kind: 'placement'; placements: Record<string, string> }
  | { kind: 'order'; tileIds: string[] }
  | { kind: 'typed'; values: string[] };

export type TimerSetting = 'none' | '30s' | '60s';

export const TIMER_LIMIT_MS: Record<TimerSetting, number | null> = {
  none: null,
  '30s': 30_000,
  '60s': 60_000,
};
