// Plain summaries for the parent/teacher area. Derived from saved history only.
import { CATEGORIES } from '../content/categories';
import { MISSION_BY_ID, missionsFor } from '../content';
import { YEAR_LEVELS, type CategoryId, type YearLevel } from '../engine/types';
import type { Profile } from './schema';

export interface CategoryYearRow {
  categoryId: CategoryId;
  yearLevel: YearLevel;
  missionsTotal: number;
  missionsCompleted: number;
  sessions: number;
  firstAttemptAccuracy: number | null;
}

export interface ProfileReport {
  sessions: number;
  questions: number;
  firstAttemptCorrect: number;
  firstAttemptAccuracy: number | null;
  retryChances: number;
  retrySuccesses: number;
  retrySuccessRate: number | null;
  supported: number;
  timedOut: number;
  listeningWithAudio: number;
  listeningWithAudioCorrectFirst: number;
  listeningTextPractice: number;
  rows: CategoryYearRow[];
  needsPractice: { label: string; detail: string }[];
}

const pct = (a: number, b: number) => (b === 0 ? null : Math.round((a / b) * 100));

const ACTIVITY_LABEL: Record<string, string> = {
  multipleChoice: 'Multiple choice',
  pictureChoice: 'Picture choice',
  listeningChoice: 'Listen and choose',
  storyQuestion: 'Story questions',
  dialogue: 'Dialogue replies',
  dragDrop: 'Sorting into groups',
  ordering: 'Putting things in order',
  matching: 'Matching',
  fillBlank: 'Filling blanks',
};

export function buildReport(p: Profile): ProfileReport {
  const qs = p.history.flatMap((h) => h.questions.map((q) => ({ ...q, categoryId: h.categoryId, yearLevel: h.yearLevel })));
  const firstAttemptCorrect = qs.filter((q) => q.firstAttemptCorrect).length;
  // A retry chance: first attempt was wrong (not a timeout) so the child could try again.
  const retryChances = qs.filter((q) => !q.firstAttemptCorrect && !q.timedOut && q.attempts >= 1).length;
  const retrySuccesses = qs.filter((q) => q.correct && !q.firstAttemptCorrect && !q.timedOut).length;
  const listeningAudio = qs.filter((q) => q.listening && !q.textPractice);

  const rows: CategoryYearRow[] = [];
  for (const c of CATEGORIES) {
    for (const y of YEAR_LEVELS) {
      const ms = missionsFor(c.id, y);
      const hist = p.history.filter((h) => h.categoryId === c.id && h.yearLevel === y);
      const hq = hist.flatMap((h) => h.questions);
      rows.push({
        categoryId: c.id,
        yearLevel: y,
        missionsTotal: ms.length,
        missionsCompleted: ms.filter((m) => p.missions[m.id]?.completions).length,
        sessions: hist.length,
        firstAttemptAccuracy: pct(hq.filter((q) => q.firstAttemptCorrect).length, hq.length),
      });
    }
  }

  const needsPractice: { label: string; detail: string }[] = [];
  for (const m of Object.values(p.missions)) {
    if (m.completions > 0 && m.bestScore < 4) {
      const mission = MISSION_BY_ID[m.missionId];
      if (mission) needsPractice.push({ label: mission.title, detail: `Best first-try score ${m.bestScore}/8 · ${mission.curriculum.learningObjective}` });
    }
  }
  const byType = new Map<string, { n: number; ok: number }>();
  for (const q of qs) {
    const t = byType.get(q.activityType) ?? { n: 0, ok: 0 };
    t.n++;
    if (q.firstAttemptCorrect) t.ok++;
    byType.set(q.activityType, t);
  }
  for (const [type, t] of byType) {
    if (t.n >= 4 && t.ok / t.n < 0.6) needsPractice.push({ label: ACTIVITY_LABEL[type] ?? type, detail: `${pct(t.ok, t.n)}% correct on the first try (${t.n} questions)` });
  }

  return {
    sessions: p.history.length,
    questions: qs.length,
    firstAttemptCorrect,
    firstAttemptAccuracy: pct(firstAttemptCorrect, qs.length),
    retryChances,
    retrySuccesses,
    retrySuccessRate: pct(retrySuccesses, retryChances),
    supported: qs.filter((q) => q.revealed).length,
    timedOut: qs.filter((q) => q.timedOut).length,
    listeningWithAudio: listeningAudio.length,
    listeningWithAudioCorrectFirst: listeningAudio.filter((q) => q.firstAttemptCorrect).length,
    listeningTextPractice: qs.filter((q) => q.listening && q.textPractice).length,
    rows,
    needsPractice,
  };
}
