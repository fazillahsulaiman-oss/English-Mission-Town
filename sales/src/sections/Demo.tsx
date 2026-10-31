// Live two-question demo (lazy-loaded). Everything inside the device screen is in English,
// as in the game. Uses the game's own drag/tap board, sentence formatting, sounds and celebrations.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { setSfxEnabled, sfx } from '../../../src/audio/sfx';
import { Mascot } from '../../../src/art/characters';
import { StickerArt } from '../../../src/art/town';
import { Picture } from '../../../src/components/Picture';
import { Bank, Slot, SlotBoard, Tile, useOccupant, type BoardState } from '../../../src/components/SlotBoard';
import { STICKERS } from '../../../src/content/stickers';
import { CelebrationEngine } from '../../../src/effects/celebration';
import { joinSentenceTiles } from '../../../src/engine/grading';
import { COPY } from '../copy';
import { DEMO_Q1, DEMO_Q2, MAX_ATTEMPTS, PRAISE, demoStars } from '../demoQuestions';
import { DemoTabletFrame } from '../svg/Devices';
import { PointerHand } from '../svg/Illustrations';
import { Star } from '../svg/kit';

type Phase = 'answering' | 'wrong' | 'correct' | 'revealed';
interface QState {
  attempts: number;
  firstTry: boolean;
  correct: boolean;
  revealed: boolean;
  phase: Phase;
}
const fresh = (): QState => ({ attempts: 0, firstTry: false, correct: false, revealed: false, phase: 'answering' });
const DEMO_STICKER = STICKERS.find((s) => s.name === 'Rainbow Tiger')!;

function useCelebrations(enabled: boolean) {
  const fx = useRef<HTMLCanvasElement>(null);
  const conf = useRef<HTMLCanvasElement>(null);
  const engine = useRef<CelebrationEngine | null>(null);
  useEffect(() => {
    if (!enabled || !fx.current || !conf.current) return;
    const e = new CelebrationEngine(fx.current, conf.current);
    engine.current = e;
    const onResize = () => e.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      e.destroy();
      engine.current = null;
    };
  }, [enabled]);
  const canvases = enabled ? (
    <>
      <canvas ref={conf} className="fx-canvas" aria-hidden="true" data-testid="demo-confetti-canvas" />
      <canvas ref={fx} className="fx-canvas" aria-hidden="true" data-testid="demo-fx-canvas" />
    </>
  ) : null;
  return { canvases, engine };
}

function OrderSlot({ index }: { index: number }) {
  const occupant = useOccupant(`slot-${index}`);
  const tile = DEMO_Q2.tiles.find((t) => t.id === occupant);
  return (
    <Slot id={`slot-${index}`} label={`Place ${index + 1} of 4${tile ? `, holds ${tile.text}` : ', empty'}`} className="demo-slot">
      {occupant && <Tile id={occupant} display={index === 0 && tile ? joinSentenceTiles([tile.text]) : undefined} />}
    </Slot>
  );
}

function Sparkles() {
  return (
    <span className="static-sparkles" aria-hidden="true" data-testid="demo-static-sparkles">
      {['#facc15', '#f472b6', '#38bdf8', '#4ade80'].map((c) => (
        <svg key={c} viewBox="0 0 24 24" width="22" height="22">
          <path d="M12 1 L14.5 9.5 L23 12 L14.5 14.5 L12 23 L9.5 14.5 L1 12 L9.5 9.5 Z" fill={c} stroke="#2f2f48" strokeWidth="1.5" />
        </svg>
      ))}
    </span>
  );
}

export default function Demo({ reducedMotion, active }: { reducedMotion: boolean; active: boolean }) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [q, setQ] = useState<[QState, QState]>([fresh(), fresh()]);
  const [choice, setChoice] = useState<string | null>(null);
  const [tried, setTried] = useState<string[]>([]);
  const [board, setBoard] = useState<BoardState>({ placements: {}, selected: null });
  const [sound, setSound] = useState(true);
  const [gentle, setGentle] = useState(false);
  const [touched, setTouched] = useState<[boolean, boolean]>([false, false]);
  const [skipCelebration, setSkipCelebration] = useState(false);
  const lastSubmit = useRef<string | null>(null);
  const { canvases, engine } = useCelebrations(!reducedMotion);

  useEffect(() => setSfxEnabled(sound), [sound]);
  // Stop running effects when the demo scrolls out of view.
  useEffect(() => {
    if (!active) engine.current?.stop();
  }, [active, engine]);

  const cur = step < 2 ? q[step as 0 | 1] : null;
  const update = (i: 0 | 1, patch: Partial<QState>) => setQ((prev) => {
    const next: [QState, QState] = [{ ...prev[0] }, { ...prev[1] }];
    next[i] = { ...next[i], ...patch };
    return next;
  });

  const markTouched = () => {
    if (step < 2 && !touched[step as 0 | 1]) setTouched((t) => (step === 0 ? [true, t[1]] : [t[0], true]));
  };

  const order = useMemo(() => {
    const ids: string[] = [];
    for (let i = 0; i < 4; i++) {
      const id = Object.keys(board.placements).find((k) => board.placements[k] === `slot-${i}`);
      if (id) ids.push(id);
    }
    return ids;
  }, [board]);

  const complete = step === 0 ? choice !== null : step === 1 ? order.length === 4 : false;
  const canCheck = !!cur && cur.phase === 'answering' && complete;

  const submit = () => {
    if (!cur || !canCheck) return;
    const key = `${step}-${cur.attempts}`;
    if (lastSubmit.current === key) return; // ignore double clicks
    lastSubmit.current = key;
    const correct = step === 0 ? choice === DEMO_Q1.answer : order.join('|') === DEMO_Q2.answer.join('|');
    const attempts = cur.attempts + 1;
    const i = step as 0 | 1;
    if (correct) {
      update(i, { attempts, correct: true, firstTry: attempts === 1, phase: 'correct' });
      sfx.correct();
      engine.current?.celebrate('answer', gentle ? 'gentle' : 'full');
    } else if (attempts >= MAX_ATTEMPTS) {
      update(i, { attempts, revealed: true, phase: 'revealed' });
    } else {
      update(i, { attempts, phase: 'wrong' });
      sfx.tryAgain();
      if (step === 0 && choice) setTried((t) => [...t, choice]);
    }
  };

  const retry = () => {
    if (!cur) return;
    update(step as 0 | 1, { phase: 'answering' });
    if (step === 0) setChoice(null);
  };

  const next = () => {
    engine.current?.stop();
    if (step === 0) {
      setStep(1);
      return;
    }
    setStep(2);
    setSkipCelebration(false);
    sfx.victory();
    engine.current?.celebrate('final', gentle ? 'gentle' : 'full');
    window.setTimeout(() => sfx.sticker(), 1600);
  };

  const restart = () => {
    engine.current?.stop();
    setStep(0);
    setQ([fresh(), fresh()]);
    setChoice(null);
    setTried([]);
    setBoard({ placements: {}, selected: null });
    lastSubmit.current = null;
  };

  const onBoard = useCallback((s: BoardState) => setBoard(s), []);
  const renderTile = useCallback((id: string) => <span>{DEMO_Q2.tiles.find((t) => t.id === id)?.text}</span>, []);
  const labelTile = useCallback((id: string) => DEMO_Q2.tiles.find((t) => t.id === id)?.text ?? id, []);
  const capacity = useMemo(() => ({ 'slot-0': 1, 'slot-1': 1, 'slot-2': 1, 'slot-3': 1 }), []);

  const score = q.filter((x) => x.firstTry).length;
  const afterRetry = q.filter((x) => x.correct && !x.firstTry).length;
  const learned = q.filter((x) => x.revealed).length;
  const stars = demoStars(score);
  const showHand = active && !reducedMotion && step < 2 && !touched[step as 0 | 1] && cur?.phase === 'answering' && (step === 0 ? choice === null : order.length === 0);
  const praise = PRAISE[step === 0 ? 0 : 1]!;

  return (
    <div className="demo">
      <div className="demo-toolbar" role="group" aria-label="Tetapan demo">
        <span className="badge">{COPY.demo.badge}</span>
        <button type="button" className="chip" aria-pressed={sound} onClick={() => setSound((v) => !v)} data-testid="demo-sound">
          {COPY.demo.mute}: {sound ? 'Hidup' : 'Senyap'}
        </button>
        <button type="button" className="chip" aria-pressed={gentle} onClick={() => setGentle((v) => !v)} data-testid="demo-gentle">
          {COPY.demo.gentle}: {gentle ? 'Ya' : 'Tidak'}
        </button>
      </div>

      <div className="demo-device">
        <DemoTabletFrame />
        <div className="demo-screen" lang="en" onPointerDownCapture={markTouched} onKeyDownCapture={markTouched} data-testid="demo-screen" data-step={step} data-active={active}>
          {step < 2 && cur && (
            <>
              <header className="g-header">
                <div>
                  <p className="g-title">{step === 0 ? DEMO_Q1.title : DEMO_Q2.title}</p>
                  <p className="g-sub" aria-live="polite">
                    Question {step + 1} of 2
                  </p>
                </div>
                <ol className="g-trail" aria-label="Demo progress">
                  {[0, 1].map((i) => (
                    <li key={i} className={`${i === step ? 'is-current' : ''} ${q[i as 0 | 1].correct || q[i as 0 | 1].revealed ? 'is-done' : ''}`} aria-label={`Question ${i + 1}${i === step ? ', current' : ''}`}>
                      {i + 1}
                    </li>
                  ))}
                </ol>
              </header>

              <div className="g-body">
                <div className="g-prompt">
                  <Mascot mood={cur.phase === 'correct' ? 'cheer' : cur.phase === 'wrong' ? 'encourage' : 'happy'} size={64} animate={!reducedMotion} />
                  <p>{step === 0 ? DEMO_Q1.prompt : DEMO_Q2.prompt}</p>
                </div>

                {step === 0 && (
                  <div className="q1">
                    <div className="q1-row">
                      <Picture picture="bag:blue" className="q1-pic" label="A blue bag" />
                      <p className="q1-sentence">
                        She <span className={`q1-blank ${choice ? 'filled' : ''}`} aria-label={choice ? undefined : 'blank'}>{choice ?? '\u00a0'}</span> a blue bag.
                      </p>
                    </div>
                    <div className="q1-options" role="radiogroup" aria-label="Answer choices">
                      {DEMO_Q1.options.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          role="radio"
                          aria-checked={choice === o.id}
                          className="g-option"
                          disabled={cur.phase !== 'answering'}
                          onClick={() => {
                            setChoice(o.id);
                            sfx.tap();
                          }}
                          data-demo-option={o.id}
                        >
                          {o.text}
                          {tried.includes(o.id) && choice !== o.id && <span className="g-tried">Not this one</span>}
                        </button>
                      ))}
                      {showHand && (
                        <span className="hand hand-sweep" aria-hidden="true" data-testid="pointer-hand">
                          <PointerHand />
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <SlotBoard state={board} onChange={onBoard} capacity={capacity} disabled={cur.phase !== 'answering'} renderItem={renderTile} labelOf={labelTile}>
                    <div className="q2">
                      <div className="q2-help">
                        <span>Drag the words, or tap a word and then tap its place.</span>
                        <button type="button" className="g-small" onClick={() => setBoard({ placements: {}, selected: null })} disabled={cur.phase !== 'answering' || order.length === 0 && !board.selected} data-testid="demo-reset">
                          Reset
                        </button>
                      </div>
                      <div className="q2-slots">
                        {[0, 1, 2, 3].map((i) => (
                          <OrderSlot key={i} index={i} />
                        ))}
                      </div>
                      <p className="q2-preview" aria-live="polite">
                        {order.length > 0 ? joinSentenceTiles(order.map((id) => DEMO_Q2.tiles.find((t) => t.id === id)!.text)) : ' '}
                      </p>
                      <div className="q2-bank">
                        <Bank items={DEMO_Q2.tiles.map((t) => t.id)} label="Word tiles" />
                        {showHand && (
                          <span className="hand-drag" aria-hidden="true" data-testid="pointer-hand">
                            <span className="ghost-tile">badminton</span>
                            <PointerHand />
                          </span>
                        )}
                      </div>
                    </div>
                  </SlotBoard>
                )}

                <div className="g-check">
                  <button type="button" className="g-btn g-go" onClick={submit} disabled={!canCheck} data-testid="demo-check">
                    Check Answer
                  </button>
                </div>
              </div>

              {cur.phase !== 'answering' && (
                <div className={`g-feedback is-${cur.phase}`} role="status" aria-live="assertive" data-testid={`demo-feedback-${cur.phase}`}>
                  <Mascot mood={cur.phase === 'correct' ? 'cheer' : cur.phase === 'wrong' ? 'encourage' : 'think'} size={70} animate={!reducedMotion} className="g-feedback-mascot" />
                  <div className="g-feedback-body">
                    {cur.phase === 'correct' && (
                      <>
                        <p className="g-big good">{praise}</p>
                        {!cur.firstTry && <p className="g-note">You kept trying and got it!</p>}
                        <p>{step === 0 ? DEMO_Q1.explanation : DEMO_Q2.explanation}</p>
                        {reducedMotion && <Sparkles />}
                        <button type="button" className="g-btn g-sun" onClick={next} data-testid="demo-next">
                          {step === 0 ? 'Next' : 'See my results'}
                        </button>
                      </>
                    )}
                    {cur.phase === 'wrong' && (
                      <>
                        <p className="g-big warn try-again">Try again!</p>
                        <p>
                          <b>Hint:</b> {step === 0 ? DEMO_Q1.hint : DEMO_Q2.hint}
                        </p>
                        <p className="g-note">
                          Try {cur.attempts + 1} of {MAX_ATTEMPTS}. Your stars are safe.
                        </p>
                        <button type="button" className="g-btn g-sun" onClick={retry} data-testid="demo-retry">
                          Try again
                        </button>
                      </>
                    )}
                    {cur.phase === 'revealed' && (
                      <>
                        <p className="g-big info">Let’s learn together</p>
                        <p>
                          The answer is: <b>{step === 0 ? 'has' : 'Aina plays badminton.'}</b>
                        </p>
                        <p>{step === 0 ? DEMO_Q1.explanation : DEMO_Q2.explanation}</p>
                        <button type="button" className="g-btn g-sun" onClick={next} data-testid="demo-next">
                          {step === 0 ? 'Next' : 'See my results'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="g-results" data-testid="demo-results">
              {!reducedMotion && !skipCelebration && (
                <button type="button" className="g-small g-skip" onClick={() => { engine.current?.stop(); setSkipCelebration(true); }}>
                  Skip
                </button>
              )}
              <Mascot mood="cheer" size={96} animate={!reducedMotion} />
              <p className="g-congrats">Congratulations!</p>
              <p className="g-sub">You finished the demo mission.</p>
              <svg viewBox="0 0 180 60" className="g-stars" role="img" aria-label={`${stars} out of 3 stars`} data-testid="demo-stars" data-stars={stars}>
                {[0, 1, 2].map((i) => (
                  <g key={i} className={reducedMotion ? '' : 'star-pop'} style={{ animationDelay: `${0.3 + i * 0.45}s` }}>
                    <Star cx={30 + i * 60} cy={30} r={i === 1 ? 26 : 22} filled={i < stars} />
                  </g>
                ))}
              </svg>
              {stars === 1 && <p className="g-note">1 star for finishing your mission!</p>}
              {reducedMotion && <Sparkles />}
              <dl className="g-score">
                <div className="wide">
                  <dt>First-try score</dt>
                  <dd data-testid="demo-score">{score} / 2</dd>
                </div>
                <div>
                  <dt>Correct after trying again</dt>
                  <dd data-testid="demo-retry-count">{afterRetry}</dd>
                </div>
                <div>
                  <dt>Learned together</dt>
                  <dd>{learned}</dd>
                </div>
              </dl>
              <div className={`g-sticker ${reducedMotion ? '' : 'sticker-reveal'}`} data-testid="demo-sticker">
                <StickerArt def={DEMO_STICKER} className="g-sticker-art" />
                <div>
                  <p className="g-sticker-title">New sticker!</p>
                  <p>{DEMO_STICKER.name}</p>
                </div>
              </div>
              <div className="g-actions" lang="ms">
                <button type="button" className="g-btn g-go" onClick={restart} data-testid="demo-restart">
                  Main Demo Lagi
                </button>
                <a className="g-btn g-sun" href="#pakej">
                  Lihat Pakej
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="demo-caption">{COPY.demo.text}</p>
      {canvases}
    </div>
  );
}
