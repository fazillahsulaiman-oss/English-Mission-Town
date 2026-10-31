import { useCallback, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Avatar, AVATARS, Mascot } from '../art/characters';
import { Building } from '../art/town';
import { Picture } from '../components/Picture';
import { Bank, Slot, SlotBoard, Tile, useOccupant, type BoardState } from '../components/SlotBoard';
import { Icon, Modal, StarRow, TopBar } from '../components/ui';
import { CATEGORIES, CATEGORY_BY_ID } from '../content/categories';
import { MISSION_BY_ID, missionsFor } from '../content';
import { STICKERS } from '../content/stickers';
import { celebrate } from '../effects/CelebrationLayer';
import { sfx } from '../audio/sfx';
import { YEAR_LEVELS, type CategoryId, type TimerSetting, type YearLevel } from '../engine/types';
import { useReducedMotion } from '../state/prefs';
import { activeProfile, useApp } from '../state/store';

// ---------------- Welcome / profiles ----------------
export function WelcomeScreen() {
  const profiles = useApp((s) => s.save.profiles);
  const selectProfile = useApp((s) => s.selectProfile);
  const createProfile = useApp((s) => s.createProfile);
  const recovered = useApp((s) => s.recoveredFromCorruption);
  const reduced = useReducedMotion();
  const [creating, setCreating] = useState(profiles.length === 0);
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState(AVATARS[0]!.id);
  const [year, setYear] = useState<YearLevel>(1);
  const valid = nickname.trim().length >= 1;

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-6 flex flex-col items-center gap-5">
      <div className="flex flex-col items-center text-center">
        <Mascot mood="wave" size={140} animate={!reduced} />
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-tight">English Mission Town</h1>
        <p className="text-xl font-bold text-ink-soft">Hi! I’m Kiko. Let’s go on English missions together!</p>
      </div>
      {recovered && (
        <p className="card !bg-amber-50 p-3 font-bold" role="alert">
          Saved progress on this device could not be read, so we started fresh. A backup copy was kept.
        </p>
      )}

      {!creating && (
        <section className="card p-5 w-full" aria-labelledby="who">
          <h2 id="who" className="font-display font-extrabold text-2xl mb-3 text-center">
            Who is playing?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profiles.map((p) => (
              <button key={p.id} className="card !rounded-3xl p-3 flex flex-col items-center gap-1 hover:-translate-y-1 transition" onClick={() => selectProfile(p.id)} data-testid={`profile-${p.nickname}`}>
                <Avatar avatarId={p.avatarId} size={80} />
                <span className="font-display font-extrabold text-xl">{p.nickname}</span>
                <span className="text-sm font-bold text-ink-soft">Year {p.yearLevel}</span>
              </button>
            ))}
            {profiles.length < 12 && (
              <button className="card !rounded-3xl p-3 flex flex-col items-center justify-center gap-2 !bg-yellow-50 border-dashed" onClick={() => setCreating(true)}>
                <span className="w-16 h-16 rounded-full bg-sun border-3 border-ink grid place-items-center text-4xl font-black">+</span>
                <span className="font-display font-extrabold text-lg">New player</span>
              </button>
            )}
          </div>
        </section>
      )}

      {creating && (
        <form
          className="card p-5 w-full space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) createProfile(nickname, avatarId, year);
          }}
        >
          <h2 className="font-display font-extrabold text-2xl text-center">Make your player</h2>
          <div>
            <label htmlFor="nick" className="block font-extrabold text-lg mb-1">
              Your nickname
            </label>
            <input
              id="nick"
              className="w-full rounded-2xl border-3 border-ink px-4 py-3 text-2xl font-bold"
              maxLength={16}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Star"
              autoComplete="off"
            />
            <p className="text-sm text-ink-soft mt-1">Use a nickname, not your full name.</p>
          </div>
          <fieldset>
            <legend className="font-extrabold text-lg mb-2">Choose your picture</legend>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  aria-pressed={avatarId === a.id}
                  aria-label={a.label}
                  onClick={() => setAvatarId(a.id)}
                  className={`rounded-full p-1 justify-self-center ${avatarId === a.id ? 'ring-4 ring-amber-400 bg-amber-100' : ''}`}
                >
                  <Avatar avatarId={a.id} size={68} />
                </button>
              ))}
            </div>
          </fieldset>
          <YearPicker year={year} onChange={setYear} />
          <div className="flex flex-wrap gap-3 justify-center">
            {profiles.length > 0 && (
              <button type="button" className="btn" onClick={() => setCreating(false)}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-lg btn-go" disabled={!valid} data-testid="create-profile">
              Let’s go!
            </button>
          </div>
        </form>
      )}
      <p className="text-sm text-ink-soft text-center max-w-md">Progress is saved on this device only. No accounts, no ads and no chat.</p>
    </div>
  );
}

export function YearPicker({ year, onChange }: { year: YearLevel; onChange: (y: YearLevel) => void }) {
  return (
    <fieldset>
      <legend className="font-extrabold text-lg mb-2">Which year are you in?</legend>
      <div className="flex gap-2 sm:gap-3">
        {YEAR_LEVELS.map((y) => (
          <button
            type="button"
            key={y}
            aria-pressed={year === y}
            onClick={() => onChange(y)}
            className={`btn flex-1 ${year === y ? 'btn-primary' : ''}`}
            data-testid={`year-${y}`}
          >
            Year {y}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// ---------------- Tutorial ----------------
function TutorialDropTarget() {
  const occupant = useOccupant('basket');
  return (
    <Slot id="basket" label="Basket" className="w-36 h-32 !rounded-3xl flex-col" emptyContent={<Picture picture="basket" className="w-20 h-20" />}>
      {occupant && (
        <>
          <Tile id={occupant} />
          <span className="font-bold">In the basket!</span>
        </>
      )}
    </Slot>
  );
}

export function Tutorial({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState<BoardState>({ placements: {}, selected: null });
  const [picked, setPicked] = useState(false);
  const reduced = useReducedMotion();
  const render = useCallback(
    () => (
      <span className="inline-flex items-center gap-1">
        <Picture picture="apple" className="w-10 h-10" /> apple
      </span>
    ),
    [],
  );
  const label = useCallback(() => 'apple', []);
  const capacity = useMemo(() => ({ basket: 1 }), []);
  const placed = !!board.placements.apple;
  return (
    <Modal title="How to play" labelledBy="tutorial-title">
      <div className="flex items-center gap-3 mb-3">
        <Mascot mood={step === 3 ? 'cheer' : 'happy'} size={72} animate={!reduced} />
        <p className="text-lg font-bold" aria-live="polite">
          {step === 0 && 'Step 1: Tap the star.'}
          {step === 1 && 'Step 2: Drag the apple into the basket. Or tap the apple, then tap the basket.'}
          {step === 2 && 'Step 3: Press Check Answer when you are ready.'}
          {step === 3 && 'You did it! You are ready for your first mission.'}
        </p>
      </div>
      {step === 0 && (
        <div className="flex justify-center py-4">
          <span className="relative inline-flex">
          {!reduced && <span className="pulse-halo absolute -inset-3 rounded-full bg-yellow-200" aria-hidden="true" />}
          <button
            className="relative w-28 h-28 rounded-full bg-sun border-3 border-ink shadow-[0_6px_0_#2f2f48] grid place-items-center"
            onClick={() => {
              sfx.tap();
              setStep(1);
            }}
            aria-label="Tap the star"
            data-testid="tutorial-star"
          >
            <Icon name="star" className="w-16 h-16 text-white" />
          </button>
          </span>
        </div>
      )}
      {step === 1 && (
        <SlotBoard state={board} onChange={(s) => setBoard(s)} capacity={capacity} disabled={false} renderItem={render} labelOf={label}>
          <div className="flex flex-col items-center gap-4 py-2">
            <TutorialDropTarget />
            <Bank items={['apple']} label="Apple" className="w-full" />
            <button className="btn btn-go" disabled={!placed} onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        </SlotBoard>
      )}
      {step === 2 && (
        <div className="flex flex-col items-center gap-3 py-2">
          <p className="text-base">Pick the answer: Which one is a fruit?</p>
          <div className="flex gap-3">
            <button className={`card p-2 ${picked ? 'ring-4 ring-amber-400 !bg-amber-100' : ''}`} onClick={() => setPicked(true)} aria-pressed={picked} aria-label="banana" data-testid="tutorial-banana">
              <Picture picture="banana" className="w-20 h-20" />
            </button>
          </div>
          <button
            className="btn btn-lg btn-go"
            disabled={!picked}
            onClick={() => {
              setStep(3);
              sfx.correct();
              if (!reduced) celebrate('answer', 'gentle');
            }}
            data-testid="tutorial-check"
          >
            <Icon name="check" /> Check Answer
          </button>
        </div>
      )}
      {step === 3 && (
        <button className="btn btn-lg btn-primary w-full" onClick={onDone} data-testid="tutorial-done">
          Start exploring!
        </button>
      )}
      {step < 3 && (
        <button className="mt-3 text-sm underline font-bold text-ink-soft min-h-[48px]" onClick={onDone}>
          Skip the tutorial
        </button>
      )}
    </Modal>
  );
}

// ---------------- Town home ----------------
export function HomeScreen() {
  const save = useApp((s) => s.save);
  const profile = activeProfile({ save });
  const { go, setYear, openCategory, completeTutorial, updateSettings } = useApp.getState();
  const reduced = useReducedMotion();
  const [yearOpen, setYearOpen] = useState(false);
  if (!profile) return null;
  const year = profile.yearLevel;
  const unlocked = Object.keys(profile.stickers).length;
  const completedThisYear = Object.values(profile.missions).filter((m) => m.yearLevel === year && m.completions > 0).length;
  const totalThisYear = CATEGORIES.reduce((n, c) => n + missionsFor(c.id, year).length, 0);
  const active = profile.activeSession && profile.activeSession.phase !== 'results' ? profile.activeSession : null;
  const activeMission = active ? MISSION_BY_ID[active.missionId] : undefined;

  // "Start Mission": continue the current mission, or pick the first unfinished mission for this year.
  const startMission = () => {
    if (active) return go('game');
    for (const c of CATEGORIES) {
      const m = missionsFor(c.id, year).find((x) => !profile.missions[x.id]?.completions);
      if (m) return openCategory(c.id);
    }
    openCategory(CATEGORIES[0]!.id);
  };

  return (
    <div className="min-h-screen pb-10">
      <header className="max-w-5xl mx-auto px-4 pt-4 flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 card !rounded-full pl-1 pr-4 py-1" onClick={() => go('welcome')} aria-label={`Player ${profile.nickname}. Change player`}>
          <Avatar avatarId={profile.avatarId} size={52} />
          <span className="font-display font-extrabold text-xl">{profile.nickname}</span>
        </button>
        <button className="btn btn-sm btn-purple" onClick={() => setYearOpen(true)} data-testid="year-selector">
          Year {year} ▾
        </button>
        <div className="flex-1" />
        <button className="btn btn-icon" onClick={() => updateSettings({ soundEffects: !save.settings.soundEffects })} aria-pressed={save.settings.soundEffects} aria-label={save.settings.soundEffects ? 'Sound on. Tap to turn off' : 'Sound off. Tap to turn on'}>
          {save.settings.soundEffects ? <Icon name="speaker" /> : <span className="relative"><Icon name="speaker" /><Icon name="cross" className="w-4 h-4 absolute -right-1 -bottom-1 text-red-600" /></span>}
        </button>
        <button className="btn btn-icon" onClick={() => go('settings')} aria-label="Settings">
          <Icon name="gear" />
        </button>
        <button className="btn btn-sm" onClick={() => go('adult')} data-testid="grown-ups">
          <Icon name="grown-up" className="w-5 h-5" /> Grown-ups
        </button>
      </header>

      <section className="max-w-5xl mx-auto px-4 mt-4 grid gap-4 sm:grid-cols-[1fr_auto] items-center">
        <div className="flex items-center gap-3">
          <Mascot mood="happy" size={96} animate={!reduced} />
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">Welcome to Mission Town!</h1>
            <p className="text-lg font-bold text-ink-soft">{active ? `You have a mission waiting: ${activeMission?.title ?? ''}` : 'Pick a place on the map, or press Start Mission.'}</p>
          </div>
        </div>
        <span className="relative inline-flex justify-self-center">
          {/* A soft glow pulses behind the button, so the button itself stays still under a finger. */}
          {!reduced && <span className="pulse-halo absolute -inset-2 rounded-full bg-yellow-300" aria-hidden="true" />}
          <button className="relative btn btn-lg btn-primary !text-2xl sm:!text-3xl !px-8 !min-h-[76px]" onClick={startMission} data-testid="start-mission">
            <Icon name="star" className="w-8 h-8" /> {active ? 'Continue Mission' : 'Start Mission'}
          </button>
        </span>
      </section>

      {/* Town map */}
      <section aria-label="Town map" className="max-w-5xl mx-auto px-3 sm:px-4 mt-5">
        <div className="relative rounded-[2.5rem] border-3 border-ink overflow-hidden shadow-[0_8px_0_#2f2f48]" style={{ background: 'linear-gradient(180deg,#bfeaff 0%,#dff7d9 38%,#bbf7a8 100%)' }}>
          <TownBackdrop />
          <div className="relative grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 p-3 sm:p-6">
            {CATEGORIES.map((c, i) => {
              const ms = missionsFor(c.id, year);
              const done = ms.filter((m) => profile.missions[m.id]?.completions).length;
              return (
                <motion.button
                  key={c.id}
                  onClick={() => openCategory(c.id)}
                  className="group relative flex flex-col items-center text-center rounded-3xl p-2 sm:p-3 bg-white/55 hover:bg-white/85 border-3 border-transparent hover:border-ink focus-visible:border-ink transition"
                  initial={reduced ? false : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  data-testid={`place-${c.id}`}
                  aria-label={`${c.place}: ${c.name}. ${done} of ${ms.length} missions done.`}
                >
                  <Building categoryId={c.id} className="w-full max-w-[220px] h-auto drop-shadow group-hover:-translate-y-1 transition" />
                  <span className="mt-1 rounded-full border-3 border-ink px-3 py-0.5 font-display font-extrabold text-base sm:text-xl text-white" style={{ background: c.colour, textShadow: '0 2px 0 rgba(0,0,0,.25)' }}>
                    {c.place}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base">{c.name}</span>
                  <span className="text-xs sm:text-sm font-bold text-ink-soft">
                    {done}/{ms.length} done
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Album + progress */}
      <section className="max-w-5xl mx-auto px-4 mt-6 grid gap-4 sm:grid-cols-2">
        <button className="card p-4 flex items-center gap-4 text-left hover:-translate-y-1 transition !bg-pink-50" onClick={() => go('album')} data-testid="open-album">
          <span className="w-16 h-16 rounded-2xl bg-pink-300 border-3 border-ink grid place-items-center">
            <Icon name="album" className="w-9 h-9" />
          </span>
          <span>
            <span className="block font-display font-extrabold text-2xl">Sticker Album</span>
            <span className="font-bold text-ink-soft">
              {unlocked} of {STICKERS.length} stickers
            </span>
          </span>
        </button>
        <div className="card p-4 !bg-green-50">
          <p className="font-display font-extrabold text-2xl">My Progress</p>
          <p className="font-bold text-ink-soft">
            Year {year}: {completedThisYear} of {totalThisYear} missions finished
          </p>
          <div className="mt-2 h-5 rounded-full bg-white border-3 border-ink overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={totalThisYear} aria-valuenow={completedThisYear} aria-label="Missions finished this year">
            <div className="h-full bg-green-400" style={{ width: `${(completedThisYear / Math.max(1, totalThisYear)) * 100}%` }} />
          </div>
        </div>
      </section>

      {yearOpen && (
        <Modal title="Choose your year" onClose={() => setYearOpen(false)}>
          <YearPicker
            year={year}
            onChange={(y) => {
              setYear(y);
              setYearOpen(false);
            }}
          />
          <p className="text-sm text-ink-soft mt-3">You can explore every place in town in any year.</p>
        </Modal>
      )}
      {!profile.tutorialDone && <Tutorial onDone={completeTutorial} />}
    </div>
  );
}

function TownBackdrop() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <circle cx="350" cy="40" r="26" fill="#fde047" />
      <path d="M40 40 Q50 28 64 34 Q74 24 88 34 Q100 36 96 46 L40 46 Z" fill="#fff" opacity={0.9} />
      <path d="M220 26 Q228 18 240 22 Q250 14 262 24 Q272 26 268 34 L220 34 Z" fill="#fff" opacity={0.8} />
      <path d="M0 120 Q100 80 200 120 Q300 160 400 110 L400 300 L0 300 Z" fill="#a7f3a0" opacity={0.7} />
      <path d="M-10 200 Q120 150 200 200 Q280 250 410 190" fill="none" stroke="#fde68a" strokeWidth={26} strokeLinecap="round" />
      <path d="M-10 200 Q120 150 200 200 Q280 250 410 190" fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="10 12" />
    </svg>
  );
}

// ---------------- Missions in a place ----------------
export function MissionSelectScreen() {
  const save = useApp((s) => s.save);
  const catId = useApp((s) => s.selectedCategory) as CategoryId | null;
  const { go, chooseMission } = useApp.getState();
  const profile = activeProfile({ save });
  if (!profile || !catId) return null;
  const cat = CATEGORY_BY_ID[catId];
  const ms = missionsFor(catId, profile.yearLevel);
  const firstUnfinished = ms.find((m) => !profile.missions[m.id]?.completions);
  return (
    <div className="min-h-screen pb-10">
      <TopBar title={`${cat.place}`} onBack={() => go('home')} />
      <div className="max-w-5xl mx-auto px-4">
        <div className="card p-4 flex items-center gap-4 mb-5" style={{ background: `linear-gradient(${cat.colour}22, ${cat.colour}22), #fff` }}>
          <Building categoryId={catId} className="w-28 h-24 sm:w-40 sm:h-32 shrink-0" />
          <div>
            <h2 className="font-display font-extrabold text-3xl">{cat.name}</h2>
            <p className="text-lg font-bold text-ink-soft">{cat.tagline}</p>
            <p className="text-sm font-bold mt-1">Year {profile.yearLevel} missions · 8 questions each</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {ms.map((m) => {
            const prog = profile.missions[m.id];
            const recommended = firstUnfinished?.id === m.id;
            return (
              <button key={m.id} onClick={() => chooseMission(m.id)} className="card p-4 text-left flex flex-col gap-2 hover:-translate-y-1 transition relative" data-testid={`mission-${m.id}`}>
                {recommended && <span className="absolute -top-3 right-3 rounded-full bg-sun border-3 border-ink px-2 text-sm font-extrabold">Try this next</span>}
                <span className="font-display font-extrabold text-sm text-ink-soft">Mission {m.order}</span>
                <span className="font-display font-extrabold text-2xl leading-tight">{m.title}</span>
                <span className="font-semibold">{m.blurb}</span>
                <span className="mt-auto flex items-center justify-between">
                  {prog?.completions ? (
                    <>
                      <StarRow stars={prog.bestStars} size={24} label={`Best: ${prog.bestStars} stars`} />
                      <span className="text-sm font-bold">Best {prog.bestScore}/8</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-ink-soft">Not played yet</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------- Timer setup ----------------
export function SetupScreen() {
  const missionId = useApp((s) => s.selectedMissionId);
  const save = useApp((s) => s.save);
  const { go, startMission, discardActiveSession } = useApp.getState();
  const [timer, setTimer] = useState<TimerSetting>('none');
  const [confirmReplace, setConfirmReplace] = useState(false);
  const profile = activeProfile({ save });
  const mission = missionId ? MISSION_BY_ID[missionId] : undefined;
  if (!mission || !profile) return null;
  const cat = CATEGORY_BY_ID[mission.categoryId];
  const opts: { id: TimerSetting; title: string; sub: string }[] = [
    { id: 'none', title: 'No time limit', sub: 'Take your time' },
    { id: '60s', title: '1 minute per question', sub: 'A gentle timer' },
    { id: '30s', title: '30 seconds per question', sub: 'A quick challenge' },
  ];
  const begin = () => {
    if (profile.activeSession && profile.activeSession.phase !== 'results' && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }
    discardActiveSession();
    startMission(mission.id, timer);
  };
  return (
    <div className="min-h-screen pb-10">
      <TopBar title="Get ready!" onBack={() => go('missions')} />
      <div className="max-w-2xl mx-auto px-4 space-y-5">
        <div className="card p-5 text-center" style={{ background: `linear-gradient(${cat.colour}22, ${cat.colour}22), #fff` }}>
          <p className="font-bold text-ink-soft">
            {cat.place} · Year {mission.yearLevel}
          </p>
          <h2 className="font-display font-extrabold text-3xl">{mission.title}</h2>
          <p className="font-semibold">8 questions. You can try each question up to 3 times.</p>
        </div>
        <fieldset className="card p-5">
          <legend className="sr-only">Timer</legend>
          <h3 className="font-display font-extrabold text-2xl mb-3">Choose a timer</h3>
          <div className="grid gap-3">
            {opts.map((o) => (
              <button key={o.id} type="button" aria-pressed={timer === o.id} onClick={() => setTimer(o.id)} className={`btn !justify-start !rounded-3xl text-left ${timer === o.id ? 'btn-primary' : ''}`} data-testid={`timer-${o.id}`}>
                <span className="w-7 h-7 rounded-full border-3 border-ink grid place-items-center bg-white shrink-0" aria-hidden="true">
                  {timer === o.id ? '●' : ''}
                </span>
                <span className="flex flex-col">
                  <span>{o.title}</span>
                  <span className="text-sm font-bold opacity-75">{o.sub}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-ink-soft mt-3">Timers never give extra stars or stickers. The timer stops while you listen, use word help or read feedback.</p>
        </fieldset>
        {confirmReplace && (
          <p className="card !bg-amber-50 p-3 font-bold" role="alert">
            You have another mission waiting. Starting this one will replace it. Press Start again to continue.
          </p>
        )}
        <button className="btn btn-lg btn-go w-full" onClick={begin} data-testid="begin-mission">
          <Icon name="star" /> Start
        </button>
      </div>
    </div>
  );
}
