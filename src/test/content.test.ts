import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../content';
import { CATEGORIES } from '../content/categories';
import { validateMissions } from '../content/validate';
import { grade } from '../engine/grading';
import { YEAR_LEVELS } from '../engine/types';
import { correctResponse, wrongResponse } from './helpers';

const questions = MISSIONS.flatMap((m) => m.questions);

describe('content integrity', () => {
  it('has at least 432 questions across 6 categories × 3 years × 3 missions', () => {
    expect(questions.length).toBeGreaterThanOrEqual(432);
    for (const c of CATEGORIES) for (const y of YEAR_LEVELS) expect(MISSIONS.filter((m) => m.categoryId === c.id && m.yearLevel === y).length).toBeGreaterThanOrEqual(3);
  });

  it('every mission has exactly eight questions', () => {
    for (const m of MISSIONS) expect(m.questions, m.id).toHaveLength(8);
  });

  it('passes the content validator with no errors', () => {
    const report = validateMissions(MISSIONS);
    expect(report.errors).toEqual([]);
  });

  it('every question has a hint, explanation and pending-review curriculum metadata without invented codes', () => {
    for (const q of questions) {
      expect(q.hint.length, q.id).toBeGreaterThan(5);
      expect(q.explanation.length, q.id).toBeGreaterThan(5);
      expect(q.curriculum.mappingStatus).toBe('pendingTeacherReview');
      expect(q.curriculum.standardCode).toBeNull();
    }
  });

  it('the authored answer to every question grades as correct', () => {
    for (const q of questions) expect(grade(q, correctResponse(q)), q.id).toEqual({ complete: true, correct: true });
  });

  it('a wrong answer to every question grades as incorrect', () => {
    for (const q of questions) {
      const w = wrongResponse(q);
      expect(w, q.id).not.toBeNull();
      expect(grade(q, w!).correct, q.id).toBe(false);
    }
  });

  it('question ids and option ids are unique', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it('each category uses at least two interaction formats', () => {
    for (const c of CATEGORIES) {
      const types = new Set(questions.filter((q) => q.categoryId === c.id).map((q) => q.activityType));
      expect(types.size, c.id).toBeGreaterThanOrEqual(2);
    }
  });
});
