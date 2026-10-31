# English Mission Town

A playful, English-only learning adventure for Malaysian primary pupils in Years 1–3 (about ages 7–9). Children explore an illustrated town with six places, play eight-question missions, get a festive celebration for every correct answer, and collect stickers. A separate parent/teacher area shows progress and curriculum mapping status.

> **Curriculum status:** every mapping is **Pending teacher review**. No KPM standard codes have been entered, and the content is not described as curriculum-aligned or KPM-approved. See `docs/curriculum-mapping-report.md`.

## Quick start

Requires Node 20+.

```bash
npm install
```

```bash
npm run dev          # http://localhost:5173
```

```bash
npm run build        # type-check + production build into dist/
```

```bash
npm run preview      # serve the production build on http://localhost:4173
```

## Tests

```bash
npm test             # Vitest: grading, session state machine, timer, scoring, rewards, storage, all 432 questions
```

```bash
npm run test:e2e     # Playwright: builds, serves and runs the browser journeys (desktop + phone)
```

If your Playwright browser is installed elsewhere, set `executablePath` in `playwright.config.ts`.

```bash
npm run content:report   # validates content and regenerates docs/curriculum-mapping-report.md
```

Optional screenshot tour for manual design review: `VISUAL_DIR=shots npx playwright test visual --project=desktop`.

## What's inside

| Area | Where |
|---|---|
| Content types (discriminated union) | `src/engine/types.ts` |
| Grading (by stable ids, typed-answer normalisation) | `src/engine/grading.ts` |
| Session state machine (ready → active → feedback → next/results) | `src/engine/session.ts` |
| Elapsed-time question timer | `src/engine/timer.ts` |
| Scoring, stars, recommendations, sticker rules | `src/engine/scoring.ts`, `recommend.ts`, `rewards.ts` |
| Missions (6 places × 3 years × 3 missions × 8 questions = 432) | `src/content/missions/*.ts` |
| Stories, stickers, curriculum registry, validator | `src/content/` |
| Versioned local save + import validation (zod) | `src/state/schema.ts` |
| Applying results (idempotent rewards) | `src/state/progress.ts` |
| Adult reports | `src/state/reports.ts` |
| Read-aloud (speech fallback) and sound effects (Web Audio) | `src/audio/` |
| Fireworks, curling ribbons, stars + canvas-confetti | `src/effects/` |
| Original SVG art: mascot Kiko the mouse-deer, avatars, town, 24 stickers, ~90 pictures | `src/art/` |
| Drag / tap / keyboard board shared by all arranging activities | `src/components/SlotBoard.tsx` |
| Screens | `src/screens/` |

Stack: React 18, TypeScript (strict), Vite, Tailwind CSS 4, Motion, dnd-kit, canvas-confetti, zod, zustand, Vitest, Playwright. No accounts, servers, API keys, ads or tracking.

## Game rules implemented

- Every mission has exactly 8 questions. Timer choices: no time limit (default), 1 minute per question, 30 seconds per question.
- Up to 3 submitted attempts per question. Wrong answers show "Try again!", a hint, and keep the question. After the third wrong attempt the answer and explanation are shown and the question counts as supported.
- Score = correct first attempts made before any time-out (max 8). Stars: 7–8 → 3, 4–6 → 2, 0–3 → 1 ("1 star for finishing your mission!"). Retries and supported answers are reported separately.
- Timer starts when the question is ready (after the first listen for listening items), pauses for audio, word help, feedback, celebrations, the pause menu and hidden tabs, is shared across retries and survives a refresh. At zero: "Time's up! Let's learn together." with an untimed try or the answer.
- Stickers are deterministic: starter (1st mission in a place), explorer (3 different missions), adventure (6 different missions), mastery (3 different three-star missions). Replays never duplicate stickers or inflate unique counts.
- Recommendation: <4 easier/scaffolded mission, 4–6 same level, 7–8 next mission. The school year is never changed automatically.

## Authoring content

Missions are plain TypeScript using small helpers from `src/content/authoring.ts`. In every helper **the first answer listed is the correct one**; options are shuffled at runtime with a stored seed.

```ts
buildMission(
  { id: 'gq-y2-m2', categoryId: 'grammar-quest', yearLevel: 2, order: 2, title: 'Has, Have…', blurb: '…', skill: 'Writing', objective: '…' },
  [
    mc('She ___ a blue bag.', 'has', ['have', 'having'], 'Hint…', 'Explanation…', { image: 'bag:blue' }),
    pc('Which animal can fly?', P('bird'), [P('cat'), P('frog')], 'Hint…', 'Explanation…'),
    listen('The cat is on the table.', 'Listen. Choose the matching picture.', P('cat on the table', scene('cat', 'on', 'table')), [...], 'Hint…', 'Explanation…'),
    order('Build the sentence.', ['I', 'brush', 'my', 'teeth', 'every', 'morning', '.'], 'Hint…', 'Explanation…', { alt: [['every', 'morning', 'I', 'brush', 'my', 'teeth', '.']] }),
    sort('Fly or swim?', ['It can fly', 'It can swim'], [['bird', 'It can fly', 'bird'], ['fish', 'It can swim', 'fish']], 'Hint…', 'Explanation…'),
    match('Match the words.', [['big', 'not small'], ['hot', 'not cold']], 'Hint…', 'Explanation…'),
    blank('Choose the word.', 'First ___, then ___.', ['First', 'Then', 'Next', 'Finally'], ['First', 'Then|Next'], 'Hint…', 'Explanation…'),
    typed('Type the plural.', 'one baby, two ___', [['babies']], 'Hint…', 'Explanation…'),
    dlg('Choose the best reply.', [['Shopkeeper', 'Can I help you?'], ['You', null]], 'Yes, I would like a pencil, please.', [...], 'Hint…', 'Explanation…'),
    storyQ('y1-oyen', "What is the cat's name?", 'Oyen', ['Aina', 'Ravi'], 'Hint…', 'Explanation…'),
  ],
);
```

Guidelines:

- Sentence tiles are lower-case except names and "I"; the first placed word is capitalised on screen. List every other grammatical order you accept in `alt`. Only listed orders are accepted.
- Typed blanks: list every accepted spelling. Matching trims spaces and ignores case and (unless `assessPunctuation`) punctuation. There is no fuzzy matching.
- Pictures use `name[:colour|variant][*count]` keys from `src/art/icons.tsx` (e.g. `bag:red`, `apple*3`, `act:read`, `face:happy`, `person:doctor`, `swatch:blue`) or `scene(item, relation, anchor)`.
- Word help: `gloss(word, synonymOrNull, explanation, example, assessed)`. Set `assessed: true` when the word itself is being tested; help then appears only after a first wrong attempt.
- Listening items must have an exact `audio` script. Bundled recordings can be added via the question's `audioAsset` path.
- Every question needs a hint and a short explanation. Distractors should reflect real learner errors, with only one defensible answer.
- Run `npm test` and `npm run content:report`. The validator checks 8 questions per mission, ids, answers, pictures, stories, blanks, curriculum metadata and duplicate questions. The app also validates content at startup and shows an adult-facing error instead of a broken game.

### Adding the 2027 curriculum

Add an entry to `src/content/curricula.ts` (an entry for Kurikulum Persekolahan 2027 already exists, marked "planned, nothing mapped"), then add missions whose `buildMission` metadata use that curriculum id, as a new `ContentPack` in `src/content/index.ts`. The engine, grading, timer and rewards do not change.

## Audio

No recorded audio is bundled yet. Read-aloud and listening use the browser's speech synthesis as a **prototype fallback**, always reading the exact authored script, only after a user action, never overlapping, with replay and stop. If no voice is available, listening questions offer a clearly labelled **text practice** alternative; those attempts are flagged and excluded from listening results in the adult area. Sound effects are synthesised with Web Audio (gentle; no buzzer).

## Privacy and storage

Progress is stored only in this browser (`localStorage`, versioned schema, validated on load; corrupted data is backed up and the game starts fresh). Grown-ups can export/import JSON and reset progress from the Parent & Teacher Area. The parent gate is a simple multiplication check, not secure authentication.

## Known limitations

- Curriculum mappings are unverified: the MOE website could not be reached from the build environment. See `docs/curriculum-mapping-report.md`.
- Voice quality depends on the device's speech engine; some devices or headless browsers have no voices (text practice is offered).
- Supplementary practice only. It does not assess speaking fluency, pronunciation or extended writing, and does not cover the whole curriculum.
- Progress does not sync between devices (export/import instead).
- Illustrations are original vector art made for this prototype; a professional illustration pass would further improve them.
- An in-progress drag arrangement is not saved on refresh (the question, attempts, score and remaining time are).
