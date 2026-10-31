import { useMemo, useRef, useState } from 'react';
import { speech } from '../audio/speech';
import { Avatar } from '../art/characters';
import { Modal, TopBar } from '../components/ui';
import { CATEGORIES, CATEGORY_BY_ID } from '../content/categories';
import { CURRICULA, PENDING_NOTE } from '../content/curricula';
import { MISSIONS } from '../content';
import { STORIES, STORY_LENGTH_GUIDE, wordCount } from '../content/stories';
import { useReducedMotion } from '../state/prefs';
import { buildReport } from '../state/reports';
import { exportText, parseImportText, type SaveData } from '../state/schema';
import { activeProfile, useApp } from '../state/store';
import { YearPicker } from './HomeScreens';

type Tab = 'progress' | 'curriculum' | 'data' | 'about';

function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [a] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [b] = useState(() => 4 + Math.floor(Math.random() * 5));
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form
        className="card p-6 max-w-md w-full space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (Number(value) === a * b) onPass();
          else setWrong(true);
        }}
      >
        <h1 className="font-display font-extrabold text-3xl">Grown-ups only</h1>
        <p className="text-lg">
          To open the parent and teacher area, answer: <b>What is {a} × {b}?</b>
        </p>
        <input aria-label="Answer" inputMode="numeric" className="w-full rounded-2xl border-3 border-ink px-4 py-3 text-2xl" value={value} onChange={(e) => setValue(e.target.value)} data-testid="gate-answer" />
        {wrong && <p className="font-bold text-red-700">That is not right. Please try again.</p>}
        <p className="text-sm text-ink-soft">This is a simple check to keep young children out. It is not a secure lock or a password.</p>
        <div className="flex gap-3">
          <button type="button" className="btn flex-1" onClick={onCancel}>
            Back
          </button>
          <button type="submit" className="btn btn-primary flex-1" data-testid="gate-submit">
            Open
          </button>
        </div>
      </form>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border-3 border-ink bg-white p-3">
      <p className="text-sm font-bold text-ink-soft">{label}</p>
      <p className="font-display font-extrabold text-2xl">{value}</p>
      {note && <p className="text-xs text-ink-soft">{note}</p>}
    </div>
  );
}

export function AdultScreen() {
  const save = useApp((s) => s.save);
  const { go, replaceSave, resetProfileProgress, resetEverything, deleteProfile } = useApp.getState();
  const [passed, setPassed] = useState(false);
  const [tab, setTab] = useState<Tab>('progress');
  const [profileId, setProfileId] = useState<string | null>(save.activeProfileId);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<SaveData | null>(null);
  const [confirm, setConfirm] = useState<null | 'profile' | 'all' | 'delete'>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const profile = save.profiles.find((p) => p.id === profileId) ?? activeProfile({ save });
  const report = useMemo(() => (profile ? buildReport(profile) : null), [profile]);

  if (!passed) return <ParentGate onPass={() => setPassed(true)} onCancel={() => go(save.activeProfileId ? 'home' : 'welcome')} />;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'progress', label: 'Progress' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'data', label: 'Data & reset' },
    { id: 'about', label: 'About' },
  ];
  const pctText = (v: number | null) => (v === null ? '—' : `${v}%`);

  const download = () => {
    const blob = new Blob([exportText(save)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-mission-town-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen pb-12 bg-white/70">
      <TopBar title="Parent & Teacher Area" onBack={() => go(save.activeProfileId ? 'home' : 'welcome')} />
      <div className="max-w-5xl mx-auto px-4 space-y-5">
        <div className="flex gap-2 flex-wrap" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={`btn btn-sm ${tab === t.id ? 'btn-primary' : ''}`} onClick={() => setTab(t.id)} data-testid={`tab-${t.id}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'progress' && (
          <section className="space-y-4" role="tabpanel">
            {save.profiles.length === 0 && <p className="font-bold">No players yet.</p>}
            {save.profiles.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {save.profiles.map((p) => (
                  <button key={p.id} className={`btn btn-sm ${p.id === profile?.id ? 'btn-blue' : ''}`} onClick={() => setProfileId(p.id)}>
                    <Avatar avatarId={p.avatarId} size={32} /> {p.nickname}
                  </button>
                ))}
              </div>
            )}
            {profile && report && (
              <>
                <div className="card p-4 flex items-center gap-3">
                  <Avatar avatarId={profile.avatarId} size={56} />
                  <div className="flex-1">
                    <p className="font-display font-extrabold text-2xl">{profile.nickname}</p>
                    <p className="font-bold text-ink-soft">
                      Chosen school year: Year {profile.yearLevel} · {report.sessions} missions completed · {Object.keys(profile.stickers).length} stickers
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="adult-stats">
                  <Stat label="First-try accuracy" value={pctText(report.firstAttemptAccuracy)} note={`${report.firstAttemptCorrect} of ${report.questions} questions`} />
                  <Stat label="Retry success" value={pctText(report.retrySuccessRate)} note={`${report.retrySuccesses} of ${report.retryChances} second chances`} />
                  <Stat label="Supported completions" value={String(report.supported)} note={`Answer shown after 3 tries or time-out · ${report.timedOut} timed out`} />
                  <Stat
                    label="Listening with working audio"
                    value={String(report.listeningWithAudio)}
                    note={`${report.listeningWithAudioCorrectFirst} correct first try · ${report.listeningTextPractice} text-practice attempts not counted as listening`}
                  />
                </div>
                <div className="card p-4 overflow-x-auto">
                  <h2 className="font-display font-extrabold text-xl mb-2">Progress by place and year</h2>
                  <table className="w-full text-left min-w-[480px]">
                    <thead>
                      <tr className="border-b-2 border-ink">
                        <th className="py-1">Place</th>
                        <th>Year</th>
                        <th>Missions finished</th>
                        <th>Plays</th>
                        <th>First-try accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.rows.map((r) => (
                        <tr key={`${r.categoryId}-${r.yearLevel}`} className={`border-b border-slate-200 ${r.yearLevel === profile.yearLevel ? 'bg-amber-50' : ''}`}>
                          <td className="py-1 font-bold">{CATEGORY_BY_ID[r.categoryId].name}</td>
                          <td>{r.yearLevel}</td>
                          <td>
                            {r.missionsCompleted}/{r.missionsTotal}
                          </td>
                          <td>{r.sessions}</td>
                          <td>{pctText(r.firstAttemptAccuracy)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card p-4">
                  <h2 className="font-display font-extrabold text-xl mb-2">Skills that need more practice</h2>
                  {report.needsPractice.length === 0 ? (
                    <p>Nothing flagged yet. Items appear here when a mission’s best first-try score is below 4/8, or a question type is below 60% first-try accuracy (4+ questions).</p>
                  ) : (
                    <ul className="list-disc pl-6 space-y-1">
                      {report.needsPractice.map((n) => (
                        <li key={n.label + n.detail}>
                          <b>{n.label}</b> — {n.detail}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-sm text-ink-soft mt-3">
                    Recommendation rule shown to children after each mission: below 4/8 → an easier or scaffolded mission; 4–6/8 → more practice at the same level; 7–8/8 → the next mission. The chosen school year is never changed automatically.
                  </p>
                </div>
                <div className="card p-4">
                  <h2 className="font-display font-extrabold text-xl mb-2">Change school year for {profile.nickname}</h2>
                  <YearPicker
                    year={profile.yearLevel}
                    onChange={(y) => {
                      if (profile.id === save.activeProfileId) useApp.getState().setYear(y);
                      else replaceSave({ ...save, profiles: save.profiles.map((p) => (p.id === profile.id ? { ...p, yearLevel: y } : p)) });
                    }}
                  />
                </div>
              </>
            )}
          </section>
        )}

        {tab === 'curriculum' && <CurriculumPanel />}

        {tab === 'data' && (
          <section className="space-y-4" role="tabpanel">
            <div className="card p-4 space-y-2">
              <h2 className="font-display font-extrabold text-xl">Where progress is stored</h2>
              <p>Progress is stored only in this browser on this device (local storage). It is not sent anywhere. Clearing browser data will remove it, so export a copy to keep it safe or move it to another device.</p>
            </div>
            <div className="card p-4 space-y-3">
              <h2 className="font-display font-extrabold text-xl">Export and import</h2>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-blue" onClick={download} data-testid="export">
                  Export progress (JSON)
                </button>
                <button className="btn" onClick={() => fileRef.current?.click()}>
                  Import progress…
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  data-testid="import-file"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const res = parseImportText(await f.text());
                    e.target.value = '';
                    if (!res.ok) {
                      setImportMsg(`Import failed: ${res.error}. Nothing was changed.`);
                      setPendingImport(null);
                    } else {
                      setPendingImport(res.data);
                      setImportMsg(null);
                    }
                  }}
                />
              </div>
              {importMsg && (
                <p className="font-bold text-red-700" role="alert" data-testid="import-message">
                  {importMsg}
                </p>
              )}
              {pendingImport && (
                <div className="rounded-2xl bg-amber-50 border-3 border-ink p-3 space-y-2" role="alert">
                  <p className="font-bold">
                    This file has {pendingImport.profiles.length} player(s). Importing will replace all progress on this device.
                  </p>
                  <div className="flex gap-3">
                    <button className="btn btn-sm" onClick={() => setPendingImport(null)}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        replaceSave(pendingImport);
                        setPendingImport(null);
                        setImportMsg(null);
                      }}
                      data-testid="confirm-import"
                    >
                      Replace and import
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="card p-4 space-y-3">
              <h2 className="font-display font-extrabold text-xl">Reset</h2>
              <div className="flex flex-wrap gap-3">
                {profile && (
                  <>
                    <button className="btn btn-pink" onClick={() => setConfirm('profile')} data-testid="reset-profile">
                      Reset {profile.nickname}’s progress
                    </button>
                    <button className="btn btn-pink" onClick={() => setConfirm('delete')}>
                      Delete player {profile.nickname}
                    </button>
                  </>
                )}
                <button className="btn btn-pink" onClick={() => setConfirm('all')}>
                  Reset everything on this device
                </button>
              </div>
            </div>
          </section>
        )}

        {tab === 'about' && (
          <section className="card p-5 space-y-3" role="tabpanel">
            <h2 className="font-display font-extrabold text-xl">About this version</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>English Mission Town gives supplementary practice for Years 1–3. It does not cover the whole curriculum, and it does not assess speaking fluency or extended writing. Dialogue activities are multiple choice and check understanding of suitable replies only.</li>
              <li>
                <b>Audio:</b> no recorded audio is bundled yet. Read-aloud and listening use the browser’s built-in speech voice as a prototype fallback, reading the exact authored scripts. Voice quality depends on the device. Current status on this device: <b>{speech.availability === 'unknown' ? 'not checked yet' : speech.availability}</b>. When audio does not work, listening questions offer a clearly labelled text practice, and those attempts are excluded from listening results.
              </li>
              <li>Scores count only correct first attempts made before any time-out. Retries and supported answers are shown separately. Timers never give extra stars or stickers.</li>
              <li>The parent gate is a simple check, not secure authentication.</li>
              <li>No accounts, advertising, leaderboards, chat or email collection.</li>
            </ul>
          </section>
        )}
      </div>

      {confirm && profile && (
        <Modal title="Are you sure?" onClose={() => setConfirm(null)}>
          <p className="text-lg mb-4">
            {confirm === 'profile' && `This removes all missions, scores, stickers and the postcard for ${profile.nickname}. This cannot be undone.`}
            {confirm === 'delete' && `This deletes the player ${profile.nickname} and all of their progress. This cannot be undone.`}
            {confirm === 'all' && 'This removes every player and all progress on this device. This cannot be undone.'}
          </p>
          <div className="flex gap-3">
            <button className="btn flex-1" onClick={() => setConfirm(null)}>
              Cancel
            </button>
            <button
              className="btn btn-pink flex-1"
              data-testid="confirm-reset"
              onClick={() => {
                if (confirm === 'profile') resetProfileProgress(profile.id);
                if (confirm === 'delete') {
                  deleteProfile(profile.id);
                  setProfileId(null);
                }
                if (confirm === 'all') resetEverything();
                setConfirm(null);
              }}
            >
              Yes, reset
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function CurriculumPanel() {
  const [cat, setCat] = useState<string>('all');
  const missions = MISSIONS.filter((m) => cat === 'all' || m.categoryId === cat);
  const total = MISSIONS.reduce((n, m) => n + m.questions.length, 0);
  const verified = MISSIONS.flatMap((m) => m.questions).filter((q) => q.curriculum.mappingStatus === 'verified').length;
  return (
    <section className="space-y-4" role="tabpanel">
      <div className="card p-4 space-y-2 !bg-amber-50">
        <h2 className="font-display font-extrabold text-xl">Curriculum mapping status</h2>
        <p>
          <b>{verified}</b> of <b>{total}</b> questions have verified mappings. <b>{total - verified}</b> are <b>Pending teacher review</b>.
        </p>
        <p>
          The official KPM documents could not be accessed while this version was built, so no standard codes have been entered and no content is described as curriculum-aligned yet. Skills and learning objectives below are the content author’s proposals. This product is not approved or endorsed by KPM.
        </p>
      </div>
      <div className="card p-4 space-y-2">
        <h2 className="font-display font-extrabold text-xl">Curriculum versions</h2>
        {CURRICULA.map((c) => (
          <div key={c.id} className="border-t border-slate-200 pt-2">
            <p className="font-bold">
              {c.name} <span className="text-sm font-semibold text-ink-soft">({c.status === 'inUse' ? 'used by current content' : 'planned, nothing mapped yet'})</span>
            </p>
            <p className="text-sm">{c.description}</p>
            <ul className="text-sm list-disc pl-5">
              {c.sourceReferences.map((r) => (
                <li key={r.title}>
                  {r.title} — {r.note}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="card p-4 overflow-x-auto">
        <div className="flex flex-wrap gap-2 mb-3">
          <button className={`btn btn-sm ${cat === 'all' ? 'btn-primary' : ''}`} onClick={() => setCat('all')}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={`btn btn-sm ${cat === c.id ? 'btn-primary' : ''}`} onClick={() => setCat(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
        <table className="w-full text-left text-sm min-w-[640px]" data-testid="curriculum-table">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="py-1">Mission</th>
              <th>Year</th>
              <th>Skill</th>
              <th>Learning objective (proposed)</th>
              <th>Standard code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((m) => (
              <tr key={m.id} className="border-b border-slate-200 align-top">
                <td className="py-1 font-bold">
                  {CATEGORY_BY_ID[m.categoryId].name}: {m.title}
                </td>
                <td>{m.yearLevel}</td>
                <td>{m.curriculum.skill}</td>
                <td>{m.curriculum.learningObjective}</td>
                <td>{m.curriculum.standardCode ?? '— (needs verification)'}</td>
                <td>
                  <span className="rounded-full bg-amber-200 px-2 font-bold whitespace-nowrap">{m.curriculum.mappingStatus === 'verified' ? 'Verified' : 'Pending teacher review'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-ink-soft mt-2">{PENDING_NOTE}</p>
      </div>
      <div className="card p-4">
        <h2 className="font-display font-extrabold text-xl mb-2">Story lengths</h2>
        <p className="text-sm mb-2">Editorial starting points (not KPM requirements): Year 1 ≈ 20–40 words, Year 2 ≈ 40–70, Year 3 ≈ 60–100. Teachers may adjust.</p>
        <ul className="text-sm grid sm:grid-cols-2 gap-1">
          {STORIES.map((s) => {
            const [min, max] = STORY_LENGTH_GUIDE[s.yearLevel];
            const n = wordCount(s.text);
            return (
              <li key={s.id}>
                Year {s.yearLevel} · {s.title}: {n} words {n < min || n > max ? '(outside guide)' : ''}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function SettingsScreen() {
  const settings = useApp((s) => s.save.settings);
  const { go, updateSettings } = useApp.getState();
  const reduced = useReducedMotion();
  const Toggle = ({ label, value, onChange, testId }: { label: string; value: boolean; onChange: (v: boolean) => void; testId?: string }) => (
    <button className={`btn w-full !justify-between ${value ? 'btn-go' : ''}`} aria-pressed={value} onClick={() => onChange(!value)} data-testid={testId}>
      <span>{label}</span>
      <span className="rounded-full bg-white border-3 border-ink px-3">{value ? 'On' : 'Off'}</span>
    </button>
  );
  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Settings" onBack={() => go('home')} />
      <div className="max-w-2xl mx-auto px-4 space-y-5">
        <section className="card p-5 space-y-3">
          <h2 className="font-display font-extrabold text-2xl">Sound</h2>
          <Toggle label="Sound effects" value={settings.soundEffects} onChange={(v) => updateSettings({ soundEffects: v })} testId="toggle-sfx" />
          <Toggle label="Reading voice" value={settings.voice} onChange={(v) => updateSettings({ voice: v })} testId="toggle-voice" />
        </section>
        <section className="card p-5 space-y-3">
          <h2 className="font-display font-extrabold text-2xl">Motion</h2>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Motion">
            {(['system', 'full', 'reduced'] as const).map((m) => (
              <button key={m} role="radio" aria-checked={settings.motion === m} className={`btn btn-sm ${settings.motion === m ? 'btn-primary' : ''}`} onClick={() => updateSettings({ motion: m })} data-testid={`motion-${m}`}>
                {m === 'system' ? 'Device' : m === 'full' ? 'Full' : 'Reduced'}
              </button>
            ))}
          </div>
          <p className="text-sm text-ink-soft">Reduced motion is {reduced ? 'on' : 'off'} now. With reduced motion, celebrations use still sparkles, colours and Kiko’s happy face instead of moving particles.</p>
          <h3 className="font-display font-extrabold text-xl pt-2">Celebrations</h3>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Celebration intensity">
            {(['full', 'gentle'] as const).map((c) => (
              <button key={c} role="radio" aria-checked={settings.celebration === c} className={`btn btn-sm ${settings.celebration === c ? 'btn-primary' : ''}`} onClick={() => updateSettings({ celebration: c })} data-testid={`celebration-${c}`}>
                {c === 'full' ? 'Full' : 'Gentle'}
              </button>
            ))}
          </div>
        </section>
        <section className="card p-5 space-y-2">
          <h2 className="font-display font-extrabold text-2xl">About the lessons</h2>
          <p>Every mission has 8 questions. Missions are extra practice for Years 1–3. The links to the school curriculum are still waiting for a teacher to check them.</p>
          <p className="text-sm text-ink-soft">Grown-ups can see full curriculum details in the Parent & Teacher Area.</p>
          <button className="btn btn-sm" onClick={() => go('adult')}>
            Open Parent & Teacher Area
          </button>
        </section>
      </div>
    </div>
  );
}
