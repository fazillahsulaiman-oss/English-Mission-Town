// Demo content. Shown inside the demo exactly as in the game (English).

export const DEMO_Q1 = {
  title: 'Grammar Quest',
  prompt: 'Choose the word that fits.',
  sentence: ['She', 'a blue bag.'] as const,
  options: [
    { id: 'has', text: 'has' },
    { id: 'have', text: 'have' },
    { id: 'having', text: 'having' },
  ],
  answer: 'has',
  hint: 'Use ‘has’ with ‘she’.',
  explanation: 'We say “she has”: one person, so the word ends in -s.',
};

export const DEMO_Q2 = {
  title: 'Sentence Builder',
  prompt: 'Build the sentence.',
  /** Initial tile order, as shown. */
  tiles: [
    { id: 'badminton', text: 'badminton' },
    { id: 'aina', text: 'Aina' },
    { id: 'plays', text: 'plays' },
    { id: 'stop', text: '.' },
  ],
  answer: ['aina', 'plays', 'badminton', 'stop'],
  hint: 'Who plays? Start with the name.',
  explanation: '“Aina plays badminton.” The person comes first, then the action.',
};

export const MAX_ATTEMPTS = 3;

/** Two-question demo: 2/2 → 3 stars, 1/2 → 2 stars, 0/2 → 1 participation star. */
export function demoStars(firstTryScore: number): 1 | 2 | 3 {
  if (firstTryScore >= 2) return 3;
  if (firstTryScore === 1) return 2;
  return 1;
}

export const PRAISE = ['Brilliant!', 'Great thinking!'];
