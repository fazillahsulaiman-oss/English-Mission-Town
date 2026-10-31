import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { sfx } from '../audio/sfx';
import { Mascot } from '../art/characters';
import { StickerArt } from '../art/town';
import { Icon } from '../components/ui';
import { MISSION_BY_ID, missionsFor, nextMission } from '../content';
import { CATEGORY_BY_ID } from '../content/categories';
import { STICKER_BY_ID } from '../content/stickers';
import { celebrate, stopCelebration } from '../effects/CelebrationLayer';
import { recommend } from '../engine/recommend';
import { useReducedMotion } from '../state/prefs';
import { activeProfile, useApp } from '../state/store';
import { StaticSparkles } from './GameScreen';

export function ResultsScreen() {
  const result = useApp((s) => s.lastResult);
  const save = useApp((s) => s.save);
  const { go, startMission, chooseMission, clearNewestSticker } = useApp.getState();
  const reduced = useReducedMotion();
  const profile = activeProfile({ save });
  const [shownStars, setShownStars] = useState(reduced ? 3 : 0);
  const [celebrating, setCelebrating] = useState(!reduced);
  const fired = useRef<string | null>(null);

  const mission = result ? MISSION_BY_ID[result.missionId] : undefined;
  const stars = result?.summary.stars ?? 1;

  useEffect(() => {
    if (!result || fired.current === result.sessionId) return;
    fired.current = result.sessionId;
    if (save.settings.soundEffects) sfx.victory();
    if (reduced) return;
    celebrate('final', save.settings.celebration);
    const timers = [1, 2, 3].map((i) => setTimeout(() => setShownStars(i), 500 + i * 550));
    const end = setTimeout(() => setCelebrating(false), 3800);
    if (result.newStickerIds.length && save.settings.soundEffects) timers.push(setTimeout(() => sfx.sticker(), 2600));
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.sessionId]);

  useEffect(() => () => stopCelebration(), []);

  if (!result || !mission || !profile) {
    return (
      <div className="p-8 text-center">
        <button className="btn btn-primary" onClick={() => go('home')}>
          Back to Town
        </button>
      </div>
    );
  }
  const s = result.summary;
  const cat = CATEGORY_BY_ID[mission.categoryId];
  const rec = recommend(missionsFor(mission.categoryId, mission.yearLevel), mission, s.firstAttemptScore);
  const next = nextMission(mission);
  const skip = () => {
    stopCelebration();
    setShownStars(3);
    setCelebrating(false);
  };

  return (
    <div className="min-h-screen px-4 py-6 pb-16" data-testid="results">
      <div className="max-w-2xl mx-auto">
        <div className="card p-5 sm:p-7 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#fff7c2,#ffffff 60%)' }}>
          {celebrating && (
            <button className="absolute top-3 right-3 btn btn-sm z-10" onClick={skip} data-testid="skip-celebration">
              Skip
            </button>
          )}
          <Mascot mood="cheer" size={120} animate={!reduced} className="mx-auto" />
          <motion.h1 initial={reduced ? false : { scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display font-extrabold text-4xl sm:text-5xl text-amber-600">
            Congratulations!
          </motion.h1>
          <p className="text-xl font-bold">
            {profile.nickname}, you finished <span className="whitespace-nowrap">“{mission.title}”</span>!
          </p>
          <p className="text-sm font-bold text-ink-soft">
            {cat.place} · Year {mission.yearLevel}
          </p>

          <div className="flex justify-center gap-2 sm:gap-4 my-4" role="img" aria-label={`${stars} out of 3 stars`}>
            {[1, 2, 3].map((i) => {
              const earned = i <= stars;
              const visible = i <= shownStars;
              return (
                <motion.svg
                  key={i}
                  viewBox="0 0 24 24"
                  className="w-20 h-20 sm:w-24 sm:h-24"
                  initial={false}
                  animate={visible && !reduced ? { scale: [0.3, 1.25, 1], rotate: [0, 15, 0] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                  aria-hidden="true"
                >
                  <path d="M12 2.5 L14.9 8.6 L21.5 9.3 L16.5 13.8 L18 20.4 L12 17 L6 20.4 L7.5 13.8 L2.5 9.3 L9.1 8.6 Z" fill={visible && earned ? '#facc15' : '#e2e8f0'} stroke="#2f2f48" strokeWidth={1.6} strokeLinejoin="round" />
                </motion.svg>
              );
            })}
          </div>
          {reduced && <div className="flex justify-center"><StaticSparkles /></div>}
          {stars === 1 && <p className="text-lg font-extrabold text-amber-700">1 star for finishing your mission!</p>}

          <dl className="grid grid-cols-2 gap-3 mt-4 text-left">
            <div className="rounded-2xl bg-yellow-100 border-3 border-ink p-3 col-span-2 flex items-center justify-between">
              <dt className="font-extrabold">First-try score</dt>
              <dd className="font-display font-extrabold text-3xl" data-testid="score">
                {s.firstAttemptScore}/8 <span className="text-xl">({s.percentage}%)</span>
              </dd>
            </div>
            <div className="rounded-2xl bg-green-100 border-3 border-ink p-3">
              <dt className="font-bold text-sm">Correct after trying again</dt>
              <dd className="font-display font-extrabold text-2xl" data-testid="retry-count">
                {s.correctAfterRetry}
              </dd>
            </div>
            <div className="rounded-2xl bg-sky-100 border-3 border-ink p-3">
              <dt className="font-bold text-sm">Learned together (help or time’s up)</dt>
              <dd className="font-display font-extrabold text-2xl" data-testid="supported-count">
                {s.supportedOrTimedOut}
              </dd>
            </div>
          </dl>

          <AnimatePresence>
            {result.newStickerIds.length > 0 && (
              <motion.div
                className="mt-5 rounded-3xl border-3 border-ink bg-pink-50 p-4"
                initial={reduced ? false : { scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: reduced ? 0 : 2.2, type: 'spring', stiffness: 180, damping: 12 }}
                data-testid="sticker-reveal"
              >
                <p className="font-display font-extrabold text-2xl">New sticker{result.newStickerIds.length > 1 ? 's' : ''}!</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {result.newStickerIds.map((id) => {
                    const def = STICKER_BY_ID[id];
                    return def ? (
                      <div key={id} className="flex flex-col items-center">
                        <StickerArt def={def} className={`w-28 h-28 ${reduced ? '' : 'newest-sticker'}`} />
                        <span className="font-extrabold">{def.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-4 rounded-2xl bg-violet-50 border-2 border-violet-300 p-3 font-bold" data-testid="recommendation">
            <span className="text-violet-700">Kiko says: </span>
            {rec.message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button className="btn btn-go" onClick={() => startMission(mission.id, result.timerSetting)} data-testid="play-again">
            <Icon name="replay" /> Play Again
          </button>
          <button className="btn btn-primary" onClick={() => next && chooseMission(next.id)} disabled={!next} data-testid="next-mission">
            Next Mission <Icon name="next" />
          </button>
          <button
            className="btn btn-pink"
            onClick={() => {
              go('album');
            }}
            data-testid="results-album"
          >
            <Icon name="album" /> Sticker Album
          </button>
          <button
            className="btn"
            onClick={() => {
              clearNewestSticker();
              go('home');
            }}
            data-testid="back-to-town"
          >
            <Icon name="home" /> Back to Town
          </button>
        </div>
        {rec.missionId !== mission.id && (
          <div className="text-center mt-3">
            <button className="btn btn-sm btn-purple" onClick={() => chooseMission(rec.missionId)}>
              Go to “{MISSION_BY_ID[rec.missionId]?.title}”
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
