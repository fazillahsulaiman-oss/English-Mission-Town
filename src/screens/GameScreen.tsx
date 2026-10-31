import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { speech } from '../audio/speech';
import { sfx } from '../audio/sfx';
import { Avatar, Mascot, type MascotMood } from '../art/characters';
import { ActivityView } from '../components/Activities';
import { Picture } from '../components/Picture';
import { GlossaryPopup, Icon, Modal, SpeakButton, WordText } from '../components/ui';
import { CATEGORY_BY_ID } from '../content/categories';
import { MISSION_BY_ID, QUESTION_BY_ID } from '../content';
import { STORY_BY_ID } from '../content/stories';
import { celebrate, stopCelebration } from '../effects/CelebrationLayer';
import { describeAnswer, grade } from '../engine/grading';
import { hashString, seededShuffle } from '../engine/random';
import { MAX_ATTEMPTS, type QuestionRecord, type SessionState } from '../engine/session';
import { remainingMs } from '../engine/timer';
import { isChoiceBased, isListening, type DialogueQuestion, type GlossaryEntry, type Question, type Response } from '../engine/types';
import { useReducedMotion } from '../state/prefs';
import { activeProfile, useApp } from '../state/store';

const PRAISE = ['Brilliant!', 'You did it!', 'Great thinking!', 'Fantastic!', 'Well done!'];

function ProgressTrail({ session }: { session: SessionState }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="Mission progress">
      {session.questionOrder.map((id, i) => {
        const r: QuestionRecord | undefined = session.records[i];
        const current = i === session.index;
        let status = 'not started';
        let bg = 'bg-white';
        let mark = '';
        if (r?.resolved) {
          if (r.firstAttemptCorrect) {
            status = 'correct first time';
            bg = 'bg-yellow-300';
            mark = '★';
          } else if (r.correct && !r.timedOut) {
            status = 'correct after trying again';
            bg = 'bg-green-300';
            mark = '✓';
          } else {
            status = 'learned together';
            bg = 'bg-sky-300';
            mark = '•';
          }
        } else if (current) status = 'current question';
        return (
          <li
            key={id}
            aria-label={`Question ${i + 1}: ${status}`}
            className={`grid place-items-center rounded-full border-3 border-ink font-black text-sm ${bg} ${current ? 'w-9 h-9 sm:w-10 sm:h-10 ring-4 ring-amber-400' : 'w-7 h-7 sm:w-8 sm:h-8'}`}
          >
            <span aria-hidden="true">{mark || i + 1}</span>
          </li>
        );
      })}
    </ol>
  );
}

function useNow(active: boolean, ms = 200) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [active, ms]);
  return now;
}

function TimerBadge({ session, now }: { session: SessionState; now: number }) {
  const rem = remainingMs(session.timer, now);
  if (rem === null) return null;
  const secs = Math.ceil(rem / 1000);
  const running = session.timer.runningSince !== null;
  const low = secs <= 10;
  const pct = session.timer.limitMs ? rem / session.timer.limitMs : 0;
  return (
    <div className={`flex items-center gap-2 rounded-full border-3 border-ink px-3 py-1 font-display font-extrabold ${low ? 'bg-orange-200' : 'bg-white'}`} role="timer" aria-live="off" aria-label={`${secs} seconds left for this question${running ? '' : ', timer paused'}`}>
      <svg viewBox="0 0 36 36" className="w-8 h-8" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill="#e2e8f0" />
        <path d={describeArc(pct)} fill={low ? '#fb923c' : '#4ade80'} />
        <circle cx="18" cy="18" r="15" fill="none" stroke="#2f2f48" strokeWidth={3} />
      </svg>
      <span className="text-xl tabular-nums">{secs}s</span>
      {!running && session.phase === 'active' && <span className="text-sm">paused</span>}
    </div>
  );
}

function describeArc(pct: number): string {
  const p = Math.max(0, Math.min(0.9999, pct));
  const a = p * Math.PI * 2;
  const x = 18 + 15 * Math.sin(a);
  const y = 18 - 15 * Math.cos(a);
  return `M18 18 L18 3 A15 15 0 ${p > 0.5 ? 1 : 0} 1 ${x} ${y} Z`;
}

function DialogueView({ q, answerText, avatarId }: { q: DialogueQuestion; answerText: string | null; avatarId: string }) {
  return (
    <div className="flex flex-col gap-3" aria-label="Conversation">
      {q.lines.map((l, i) => {
        const isYou = l.speaker === 'You';
        const gap = l.text === null;
        return (
          <div key={i} className={`flex items-end gap-2 ${isYou ? 'flex-row-reverse' : ''}`}>
            {isYou ? (
              <Avatar avatarId={avatarId} size={48} />
            ) : (
              <span className="w-12 h-12 shrink-0 rounded-full bg-pink-200 border-3 border-ink grid place-items-center font-display font-extrabold text-lg" aria-hidden="true">
                {l.speaker[0]}
              </span>
            )}
            <div className={`max-w-[80%] rounded-3xl border-3 border-ink px-4 py-2 text-lg sm:text-xl ${isYou ? 'bg-amber-100 rounded-br-md' : 'bg-white rounded-bl-md'} ${gap ? 'border-dashed' : ''}`}>
              <p className="text-sm font-extrabold text-ink-soft">{l.speaker}</p>
              <p className="font-bold">{gap ? (answerText ?? <span className="text-slate-400">? ? ?</span>) : l.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type ListenStatus = 'checking' | 'playing' | 'played' | 'unavailable' | 'voiceOff' | 'text';

export function GameScreen() {
  const save = useApp((s) => s.save);
  const dispatch = useApp((s) => s.dispatch);
  const go = useApp((s) => s.go);
  const updateSettings = useApp((s) => s.updateSettings);
  const profile = activeProfile({ save });
  const session = profile?.activeSession as SessionState | null | undefined;
  const settings = save.settings;
  const reduced = useReducedMotion();

  const qid = session?.questionOrder[session.index];
  const question: Question | undefined = qid ? QUESTION_BY_ID[qid] : undefined;
  const mission = session ? MISSION_BY_ID[session.missionId] : undefined;
  const timerActive = !!session && session.timer.limitMs !== null && session.phase === 'active';
  const now = useNow(timerActive);

  const [response, setResponse] = useState<Response | null>(null);
  const [tried, setTried] = useState<string[]>([]);
  const [glossary, setGlossary] = useState<GlossaryEntry | null>(null);
  const [listen, setListen] = useState<ListenStatus>('checking');
  const [menuOpen, setMenuOpen] = useState(false);
  const celebrated = useRef<string | null>(null);
  const onResponse = useCallback((r: Response | null) => setResponse(r), []);

  const t = () => Date.now();

  // Reset per-question UI state.
  useEffect(() => {
    setResponse(null);
    setTried([]);
    setListen('checking');
    // Clear any celebration still running so the next question is easy to read.
    stopCelebration();
  }, [qid]);

  // Any speech pauses the timer.
  useEffect(() => {
    const off = speech.onSpeakingChange((on) => dispatch({ type: on ? 'PAUSE' : 'RESUME', reason: 'audio', now: t() }));
    return () => {
      off();
      speech.stop();
    };
  }, [dispatch]);

  // Hidden tab pauses the timer.
  useEffect(() => {
    const onVis = () => dispatch({ type: document.visibilityState === 'hidden' ? 'PAUSE' : 'RESUME', reason: 'hidden', now: t() });
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [dispatch]);

  // Timer ticks (elapsed-time based; the reducer decides when time is up).
  useEffect(() => {
    if (timerActive) dispatch({ type: 'TICK', now });
  }, [now, timerActive, dispatch]);

  const needsResume = !!session?.pauseReasons.includes('resume');
  const listening = question ? isListening(question) : false;

  // Prepare the question: start right away, or after the first listen for listening items.
  useEffect(() => {
    if (!session || !question || session.phase !== 'ready' || needsResume) return;
    if (!listening) {
      dispatch({ type: 'QUESTION_READY', now: t() });
      return;
    }
    let cancelled = false;
    (async () => {
      if (!settings.voice) {
        setListen('voiceOff');
        return;
      }
      const a = await speech.detect();
      if (cancelled) return;
      if (a !== 'available') {
        setListen('unavailable');
        return;
      }
      setListen('playing');
      const res = await speech.speak(question.audioScript!, { asset: question.audioAsset });
      if (cancelled) return;
      if (res === 'failed') {
        setListen('unavailable');
        return;
      }
      setListen('played');
      dispatch({ type: 'QUESTION_READY', now: t() });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.phase, qid, needsResume, settings.voice]);

  // Celebrate once per correctly completed question.
  const phase = session?.phase;
  useEffect(() => {
    if (!session) return;
    const key = `${session.sessionId}-${session.index}`;
    if (phase === 'correctFeedback' && celebrated.current !== key) {
      celebrated.current = key;
      if (settings.soundEffects) sfx.correct();
      if (!reduced) celebrate('answer', settings.celebration);
    }
    if (phase === 'incorrectFeedback' && settings.soundEffects) sfx.tryAgain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, session?.index]);

  const eliminated = useMemo(() => {
    if (!question || !session || !isChoiceBased(question) || session.attemptsThisQuestion < 2 || question.options.length < 3) return [];
    const wrong = question.options.filter((o) => !question.acceptedAnswers.includes(o.id) && !tried.includes(o.id));
    // Only remove a distractor when at least two untried choices would still remain.
    if (wrong.length < 2) return [];
    const seeded = seededShuffle(wrong, hashString(question.id));
    return seeded.slice(0, 1).map((o) => o.id);
  }, [question, session, tried]);

  if (!profile || !session || !question || !mission) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl font-bold mb-4">This mission could not be found.</p>
        <button className="btn btn-primary" onClick={() => go('home')}>
          Back to Town
        </button>
      </div>
    );
  }

  const category = CATEGORY_BY_ID[mission.categoryId];
  const story = question.storyId ? STORY_BY_ID[question.storyId] : undefined;
  const canSubmit = (session.phase === 'active' || session.phase === 'supportedReview') && !!response && grade(question, response).complete;
  const unlockAssessed = session.attemptsThisQuestion >= 1;
  const record = session.records[session.index];

  const submit = () => {
    if (!response || !canSubmit) return;
    const g = grade(question, response);
    if (!g.complete) return;
    if (!g.correct && response.kind === 'choice') setTried((tr) => (tr.includes(response.optionId) ? tr : [...tr, response.optionId]));
    dispatch({ type: 'SUBMIT', correct: g.correct, submissionId: `${session.index}-${session.attemptsThisQuestion}`, now: t() });
  };

  const openGlossary = (e: GlossaryEntry) => {
    setGlossary(e);
    dispatch({ type: 'PAUSE', reason: 'glossary', now: t() });
    dispatch({ type: 'GLOSSARY_OPENED', now: t() });
  };
  const closeGlossary = () => {
    setGlossary(null);
    dispatch({ type: 'RESUME', reason: 'glossary', now: t() });
  };

  const replay = async () => {
    setListen('playing');
    const res = await speech.speak(question.audioScript!, { asset: question.audioAsset });
    setListen(res === 'failed' ? 'unavailable' : 'played');
    if (session.phase === 'ready' && res !== 'failed') dispatch({ type: 'QUESTION_READY', now: t() });
  };

  const useTextPractice = () => {
    setListen('text');
    dispatch({ type: 'TEXT_PRACTICE', now: t() });
    if (session.phase === 'ready') dispatch({ type: 'QUESTION_READY', now: t() });
  };

  const mood: MascotMood =
    session.phase === 'correctFeedback' ? 'cheer' : session.phase === 'incorrectFeedback' || session.phase === 'timedOut' ? 'encourage' : session.phase === 'revealed' ? 'think' : 'happy';
  const praise = PRAISE[(hashString(question.id) + session.index) % PRAISE.length]!;
  const selectedDialogueText = question.activityType === 'dialogue' && response?.kind === 'choice' ? (question.options.find((o) => o.id === response.optionId)?.text ?? null) : null;
  const interactive = session.phase === 'active' || session.phase === 'supportedReview';
  const showActivity = session.phase !== 'ready' || !listening;
  const textPracticeShown = listen === 'text' || record?.textPractice;

  return (
    <div className="min-h-screen pb-[46vh] sm:pb-72" data-question-id={question.id} data-phase={session.phase}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-sky-100/95 backdrop-blur border-b-3 border-ink">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            className="btn btn-icon"
            aria-label="Pause mission"
            onClick={() => {
              setMenuOpen(true);
              speech.stop();
              dispatch({ type: 'PAUSE', reason: 'menu', now: t() });
            }}
          >
            <Icon name="pause" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-display font-extrabold text-lg sm:text-xl truncate" style={{ color: '#2f2f48' }}>
              {mission.title}
            </p>
            <p className="font-bold text-sm sm:text-base" aria-live="polite">
              Question {session.index + 1} of {session.questionOrder.length}
              <span className="hidden sm:inline text-ink-soft"> · {category.place}</span>
            </p>
          </div>
          <TimerBadge session={session} now={now} />
          <div className="w-full sm:w-auto order-last sm:order-none flex justify-center">
            <ProgressTrail session={session} />
          </div>
        </div>
        {session.timer.limitMs !== null && <p className="sr-only">Timer: {session.timer.limitMs / 1000} seconds per question.</p>}
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 pt-4">
        <div className={story ? 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]' : ''}>
          {story && (
            <section className="card p-4 !bg-amber-50 self-start" aria-label={`Story: ${story.title}`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="font-display font-extrabold text-2xl">{story.title}</h2>
                {settings.voice && <SpeakButton text={story.text} label="Read the story" />}
              </div>
              <div className="flex justify-center gap-2 mb-3">
                {story.illustration.map((p, i) => (
                  <Picture key={i} picture={p} className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl border-3 border-ink p-1" />
                ))}
              </div>
              <p className="text-xl sm:text-2xl leading-relaxed font-semibold">
                <WordText text={story.text} entries={story.glossaryEntries} unlockAssessed onOpen={openGlossary} />
              </p>
            </section>
          )}

          <section className="space-y-4">
            {/* Prompt */}
            <div className="flex items-start gap-2 sm:gap-3">
              <Mascot mood={mood} size={84} animate={!reduced} className="shrink-0 -mt-1" />
              <div className="card p-3 sm:p-4 flex-1 !rounded-3xl relative">
                <p className="text-xl sm:text-2xl font-extrabold leading-snug" id="prompt">
                  <WordText text={question.prompt} entries={question.glossaryEntries} unlockAssessed={unlockAssessed} onOpen={openGlossary} />
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.voice && !listening && <SpeakButton text={question.prompt} />}
                  {question.glossaryEntries.some((g) => g.assessed) && !unlockAssessed && (
                    <span className="text-sm font-bold text-ink-soft self-center">Word help opens after your first try.</span>
                  )}
                </div>
                {session.attemptsThisQuestion > 0 && session.phase !== 'correctFeedback' && session.phase !== 'revealed' && (
                  <p className="mt-2 rounded-2xl bg-violet-50 border-2 border-violet-300 p-2 font-bold">
                    <span className="text-violet-700">Hint: </span>
                    {question.hint}
                  </p>
                )}
              </div>
            </div>

            {/* Listening controls */}
            {listening && (
              <div className="card p-3 sm:p-4 !bg-sky-50 flex flex-col gap-3" aria-label="Listening">
                <div className="flex flex-wrap items-center gap-3">
                  <motion.span animate={listen === 'playing' && !reduced ? { scale: [1, 1.15, 1] } : undefined} transition={{ repeat: Infinity, duration: 0.8 }} className="w-12 h-12 rounded-full bg-sky-300 border-3 border-ink grid place-items-center">
                    <Icon name="speaker" className="w-7 h-7" />
                  </motion.span>
                  <p className="font-extrabold text-lg flex-1">
                    {listen === 'checking' && 'Getting ready to listen…'}
                    {listen === 'playing' && 'Listen carefully…'}
                    {listen === 'played' && 'You can listen again.'}
                    {listen === 'unavailable' && 'Sound is not working on this device right now.'}
                    {listen === 'voiceOff' && 'The reading voice is turned off.'}
                    {listen === 'text' && 'Text practice'}
                  </p>
                  {(listen === 'played' || listen === 'playing') && (
                    <>
                      <button className="btn btn-sm btn-blue" onClick={replay} disabled={listen === 'playing'}>
                        <Icon name="replay" className="w-5 h-5" /> Listen again
                      </button>
                      {listen === 'playing' && (
                        <button className="btn btn-sm" onClick={() => speech.stop()}>
                          <Icon name="stop" className="w-5 h-5" /> Stop
                        </button>
                      )}
                    </>
                  )}
                  {listen === 'voiceOff' && (
                    <button className="btn btn-sm btn-blue" onClick={() => updateSettings({ voice: true })}>
                      Turn voice on
                    </button>
                  )}
                  {listen === 'unavailable' && (
                    <button className="btn btn-sm btn-blue" onClick={replay}>
                      Try sound again
                    </button>
                  )}
                </div>
                {(listen === 'unavailable' || listen === 'voiceOff') && !textPracticeShown && (
                  <div className="rounded-2xl bg-white border-2 border-sky-300 p-3">
                    <p className="font-bold mb-2">You can read the words instead. This is reading practice, so it will not count as listening practice.</p>
                    <button className="btn btn-sm btn-purple" onClick={useTextPractice}>
                      Use text practice
                    </button>
                  </div>
                )}
                {textPracticeShown && (
                  <div className="rounded-2xl bg-white border-2 border-violet-300 p-3" data-testid="text-practice">
                    <p className="text-sm font-extrabold text-violet-700">Text practice (reading, not listening)</p>
                    <p className="text-xl font-bold">“{question.audioScript}”</p>
                  </div>
                )}
              </div>
            )}

            {question.imageAsset && (
              <div className="flex justify-center">
                <Picture picture={question.imageAsset} className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-3xl border-3 border-ink p-2" />
              </div>
            )}

            {question.activityType === 'dialogue' && <DialogueView q={question} answerText={selectedDialogueText} avatarId={profile.avatarId} />}

            {showActivity && (
              <div className={session.phase === 'ready' ? 'opacity-50 pointer-events-none' : ''}>
                <ActivityView key={question.id} question={question} seed={session.shuffleSeed} disabled={!interactive} onResponse={onResponse} tried={tried} eliminated={eliminated} />
              </div>
            )}
            {session.phase === 'supportedReview' && <p className="text-center font-bold text-sky-700">No timer now. Take your time.</p>}

            <div className="flex justify-center pt-2">
              <button className="btn btn-lg btn-go" onClick={submit} disabled={!canSubmit} data-testid="check-answer">
                <Icon name="check" className="w-7 h-7" /> Check Answer
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Feedback panels */}
      {(session.phase === 'incorrectFeedback' || session.phase === 'correctFeedback' || session.phase === 'revealed' || session.phase === 'timedOut') && (
          <div
            key={`${session.phase}-${session.index}-${session.attemptsThisQuestion}`}
            className={`fixed bottom-0 inset-x-0 z-30 p-3 sm:p-4 ${reduced ? '' : 'slide-up'}`}
            role="status"
            aria-live="assertive"
          >
            <div
              className={`card max-w-3xl mx-auto p-4 sm:p-5 flex gap-3 items-start ${
                session.phase === 'correctFeedback' ? '!bg-green-100' : session.phase === 'incorrectFeedback' ? '!bg-amber-50' : '!bg-sky-50'
              }`}
            >
              <Mascot mood={mood} size={88} animate={!reduced} className="shrink-0 hidden sm:block" />
              <div className="flex-1 min-w-0">
                {session.phase === 'correctFeedback' && (
                  <>
                    <motion.p initial={reduced ? false : { scale: 0.6 }} animate={{ scale: 1 }} className="font-display font-extrabold text-3xl sm:text-4xl text-green-700 flex items-center gap-2" data-testid="feedback-correct">
                      <span aria-hidden="true">★</span> {praise}
                    </motion.p>
                    {record && !record.firstAttemptCorrect && <p className="font-bold text-green-800">You kept trying and got it!</p>}
                    <p className="text-lg mt-1">{question.explanation}</p>
                    {reduced && <StaticSparkles />}
                    <div className="mt-3 flex justify-end">
                      <button className="btn btn-lg btn-primary" onClick={() => dispatch({ type: 'NEXT', now: t() })} autoFocus data-testid="next">
                        {session.index === session.questionOrder.length - 1 ? 'See my results' : 'Next'} <Icon name="next" />
                      </button>
                    </div>
                  </>
                )}
                {session.phase === 'incorrectFeedback' && (
                  <>
                    <motion.p
                      initial={reduced ? false : { rotate: -4, scale: 0.8 }}
                      animate={reduced ? undefined : { rotate: [0, -3, 3, 0], scale: 1 }}
                      className="font-display font-extrabold text-3xl sm:text-4xl text-amber-700"
                      data-testid="feedback-try-again"
                    >
                      Try again!
                    </motion.p>
                    <p className="text-lg font-bold mt-1">
                      <span className="text-violet-700">Hint: </span>
                      {question.hint}
                    </p>
                    <p className="text-base text-ink-soft">
                      Try {session.attemptsThisQuestion + 1} of {MAX_ATTEMPTS}. Your stars are safe.
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button className="btn btn-lg btn-primary" onClick={() => dispatch({ type: 'RETRY', now: t() })} autoFocus data-testid="retry">
                        Try again
                      </button>
                    </div>
                  </>
                )}
                {session.phase === 'revealed' && (
                  <>
                    <p className="font-display font-extrabold text-3xl text-sky-700" data-testid="feedback-revealed">
                      Let’s learn together
                    </p>
                    <p className="text-lg font-bold mt-1">
                      The answer is: <span className="bg-white rounded-lg px-1">{describeAnswer(question)}</span>
                    </p>
                    <p className="text-lg mt-1">{question.explanation}</p>
                    <div className="mt-3 flex justify-end">
                      <button className="btn btn-lg btn-primary" onClick={() => dispatch({ type: 'NEXT', now: t() })} autoFocus data-testid="next">
                        {session.index === session.questionOrder.length - 1 ? 'See my results' : 'Next'} <Icon name="next" />
                      </button>
                    </div>
                  </>
                )}
                {session.phase === 'timedOut' && (
                  <>
                    <p className="font-display font-extrabold text-3xl text-sky-700" data-testid="feedback-timeout">
                      Time’s up! Let’s learn together.
                    </p>
                    <p className="text-lg mt-1">You can try once more without the timer, or see the answer.</p>
                    <div className="mt-3 flex flex-wrap gap-3 justify-end">
                      <button className="btn btn-blue" onClick={() => dispatch({ type: 'CHOOSE_REVEAL', now: t() })} data-testid="show-answer">
                        Show me the answer
                      </button>
                      <button className="btn btn-primary" onClick={() => dispatch({ type: 'CHOOSE_SUPPORTED', now: t() })} autoFocus data-testid="try-untimed">
                        Try without the timer
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      {glossary && <GlossaryPopup entry={glossary} onClose={closeGlossary} voiceOn={settings.voice} />}

      {menuOpen && (
        <Modal
          title="Mission paused"
          onClose={() => {
            setMenuOpen(false);
            dispatch({ type: 'RESUME', reason: 'menu', now: t() });
          }}
        >
          <p className="text-lg mb-4">Your mission is saved. You can come back to it later.</p>
          <div className="flex flex-col gap-3">
            <button
              className="btn btn-go"
              onClick={() => {
                setMenuOpen(false);
                dispatch({ type: 'RESUME', reason: 'menu', now: t() });
              }}
            >
              Keep playing
            </button>
            <button
              className="btn"
              onClick={() => {
                setMenuOpen(false);
                dispatch({ type: 'RESUME', reason: 'menu', now: t() });
                useApp.getState().persistNow();
                go('home');
              }}
              data-testid="leave-mission"
            >
              <Icon name="home" /> Back to Town (save for later)
            </button>
          </div>
        </Modal>
      )}

      {needsResume && !menuOpen && (
        <Modal title="Welcome back!">
          <div className="flex items-center gap-3 mb-4">
            <Mascot mood="wave" size={80} animate={!reduced} />
            <p className="text-lg">
              Let’s keep going with <b>{mission.title}</b>. You are on question {session.index + 1} of {session.questionOrder.length}.
            </p>
          </div>
          <button className="btn btn-lg btn-go w-full" onClick={() => dispatch({ type: 'RESUME', reason: 'resume', now: t() })} data-testid="resume">
            Continue
          </button>
        </Modal>
      )}
    </div>
  );
}

/** Reduced-motion celebration: static sparkles instead of particles. */
export function StaticSparkles() {
  return (
    <div className="flex gap-2 mt-1" aria-hidden="true" data-testid="static-sparkles">
      {['#facc15', '#f472b6', '#38bdf8', '#4ade80', '#a78bfa'].map((c, i) => (
        <svg key={c} viewBox="0 0 24 24" className={i % 2 ? 'w-6 h-6' : 'w-8 h-8'}>
          <path d="M12 1 L14.5 9.5 L23 12 L14.5 14.5 L12 23 L9.5 14.5 L1 12 L9.5 9.5 Z" fill={c} stroke="#2f2f48" strokeWidth={1.5} />
        </svg>
      ))}
    </div>
  );
}
