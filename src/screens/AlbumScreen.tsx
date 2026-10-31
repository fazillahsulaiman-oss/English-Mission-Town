import { useRef, useState, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from 'react';
import { StickerArt } from '../art/town';
import { Icon, TopBar } from '../components/ui';
import { CATEGORIES } from '../content/categories';
import { STICKERS, STICKER_BY_ID } from '../content/stickers';
import { TIER_RULES, tierProgress } from '../engine/rewards';
import type { CategoryId } from '../engine/types';
import { useReducedMotion } from '../state/prefs';
import type { Placement } from '../state/schema';
import { activeProfile, useApp } from '../state/store';

const clamp = (v: number) => Math.min(0.95, Math.max(0.05, v));

function Postcard({ board, onChange, picking, onPlaced }: { board: Placement[]; onChange: (b: Placement[]) => void; picking: string | null; onPlaced: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; moved: boolean } | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const posFrom = (e: { clientX: number; clientY: number }) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) };
  };
  const move = (id: string, x: number, y: number) => onChange(board.map((p) => (p.stickerId === id ? { ...p, x: clamp(x), y: clamp(y) } : p)));

  const onBoardClick = (e: RMouseEvent) => {
    if (!picking) return;
    const { x, y } = posFrom(e);
    onChange([...board.filter((p) => p.stickerId !== picking), { stickerId: picking, x, y, rotation: Math.round((Math.random() - 0.5) * 20) }]);
    onPlaced();
  };

  return (
    <div
      ref={ref}
      className={`relative w-full aspect-[3/2] rounded-[2rem] border-3 border-ink overflow-hidden shadow-[0_6px_0_#2f2f48] ${picking ? 'cursor-crosshair ring-4 ring-amber-400' : ''}`}
      onClick={onBoardClick}
      data-testid="postcard"
      role="group"
      aria-label={picking ? 'Postcard: tap where you want the sticker' : 'My town postcard'}
    >
      <svg viewBox="0 0 300 200" className="absolute inset-0 w-full h-full" aria-hidden="true" preserveAspectRatio="none">
        <rect width="300" height="200" fill="#bfeaff" />
        <circle cx="255" cy="38" r="20" fill="#fde047" />
        <path d="M0 120 Q80 80 160 118 Q230 150 300 110 L300 200 L0 200 Z" fill="#9ae6a0" />
        <path d="M0 160 Q100 130 180 165 Q240 190 300 160 L300 200 L0 200 Z" fill="#6fcf7a" />
        <rect x="8" y="8" width="284" height="184" rx="14" fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="10 8" />
        <text x="20" y="34" fontFamily="Baloo 2, sans-serif" fontWeight={800} fontSize="18" fill="#2f2f48">
          Greetings from Mission Town!
        </text>
      </svg>
      {board.map((p) => {
        const def = STICKER_BY_ID[p.stickerId];
        if (!def) return null;
        return (
          <button
            key={p.stickerId}
            type="button"
            className={`absolute w-[18%] -translate-x-1/2 -translate-y-1/2 touch-none ${focused === p.stickerId ? 'ring-4 ring-blue-500 rounded-full' : ''}`}
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: `translate(-50%,-50%) rotate(${p.rotation}deg)` }}
            aria-label={`${def.name} on the postcard. Use arrow keys to move, Delete to remove.`}
            data-placed-sticker={p.stickerId}
            onFocus={() => setFocused(p.stickerId)}
            onBlur={() => setFocused(null)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              const step = 0.03;
              if (e.key === 'ArrowLeft') move(p.stickerId, p.x - step, p.y);
              else if (e.key === 'ArrowRight') move(p.stickerId, p.x + step, p.y);
              else if (e.key === 'ArrowUp') move(p.stickerId, p.x, p.y - step);
              else if (e.key === 'ArrowDown') move(p.stickerId, p.x, p.y + step);
              else if (e.key === 'Delete' || e.key === 'Backspace') onChange(board.filter((b) => b.stickerId !== p.stickerId));
              else return;
              e.preventDefault();
            }}
            onPointerDown={(e: RPointerEvent<HTMLButtonElement>) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              drag.current = { id: p.stickerId, moved: false };
            }}
            onPointerMove={(e) => {
              if (drag.current?.id !== p.stickerId) return;
              drag.current.moved = true;
              const { x, y } = posFrom(e);
              move(p.stickerId, x, y);
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
          >
            <StickerArt def={def} className="w-full h-auto pointer-events-none" />
          </button>
        );
      })}
    </div>
  );
}

export function AlbumScreen() {
  const save = useApp((s) => s.save);
  const { go, setBoard, clearNewestSticker } = useApp.getState();
  const profile = activeProfile({ save });
  const reduced = useReducedMotion();
  const [page, setPage] = useState<CategoryId>('word-explorer');
  const [picking, setPicking] = useState<string | null>(null);
  if (!profile) return null;
  const unlocked = STICKERS.filter((s) => profile.stickers[s.id]);
  const cat = CATEGORIES.find((c) => c.id === page)!;
  const prog = tierProgress(profile.missions, page);
  const onBoard = new Set(profile.board.map((b) => b.stickerId));
  const tray = unlocked.filter((s) => !onBoard.has(s.id));

  const requirementProgress = (tier: keyof typeof TIER_RULES) => {
    if (tier === 'starter') return `${Math.min(prog.completed, 1)}/1 mission`;
    if (tier === 'explorer') return `${Math.min(prog.completed, 3)}/3 missions`;
    if (tier === 'adventure') return `${Math.min(prog.completed, 6)}/6 missions`;
    return `${Math.min(prog.threeStar, 3)}/3 three-star missions`;
  };

  return (
    <div className="min-h-screen pb-12">
      <TopBar
        title="Sticker Album"
        onBack={() => {
          clearNewestSticker();
          go('home');
        }}
      />
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="card p-4 flex flex-wrap items-center gap-3 !bg-pink-50">
          <p className="font-display font-extrabold text-2xl flex-1">
            {unlocked.length} of {STICKERS.length} stickers collected
          </p>
          <div className="h-5 w-full sm:w-64 rounded-full bg-white border-3 border-ink overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={STICKERS.length} aria-valuenow={unlocked.length} aria-label="Stickers collected">
            <div className="h-full bg-pink-400" style={{ width: `${(unlocked.length / STICKERS.length) * 100}%` }} />
          </div>
        </div>

        {/* Pages */}
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Album pages">
          {CATEGORIES.map((c) => {
            const n = STICKERS.filter((s) => s.categoryId === c.id && profile.stickers[s.id]).length;
            return (
              <button key={c.id} role="tab" aria-selected={page === c.id} onClick={() => setPage(c.id)} className={`btn btn-sm shrink-0 ${page === c.id ? '' : 'opacity-80'}`} style={page === c.id ? { background: c.colour, color: '#fff' } : undefined}>
                {c.place} <span className="text-sm">({n}/4)</span>
              </button>
            );
          })}
        </div>

        <section className="card p-4 sm:p-6" style={{ background: `linear-gradient(${cat.colour}18, ${cat.colour}18), #fff` }} role="tabpanel" aria-label={`${cat.place} stickers`}>
          <h2 className="font-display font-extrabold text-2xl mb-1">{cat.place}</h2>
          <p className="font-bold text-ink-soft mb-4">
            Missions finished here: {prog.completed} · Three-star missions: {prog.threeStar}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STICKERS.filter((s) => s.categoryId === page).map((s) => {
              const got = !!profile.stickers[s.id];
              const newest = profile.newestStickerId === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center text-center gap-1" data-sticker={s.id} data-unlocked={got}>
                  <StickerArt def={s} locked={!got} className={`w-28 h-28 sm:w-32 sm:h-32 ${newest && !reduced ? 'newest-sticker' : ''}`} />
                  <span className="font-extrabold">{got ? s.name : '???'}</span>
                  <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">{TIER_RULES[s.tier].label}</span>
                  {!got && (
                    <span className="text-sm font-semibold">
                      {TIER_RULES[s.tier].requirement}
                      <br />
                      <span className="text-ink-soft">({requirementProgress(s.tier)})</span>
                    </span>
                  )}
                  {newest && <span className="rounded-full bg-sun border-2 border-ink px-2 text-xs font-extrabold">NEW!</span>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3" aria-labelledby="postcard-title">
          <h2 id="postcard-title" className="font-display font-extrabold text-2xl">
            My Town Postcard
          </h2>
          <p className="font-bold text-ink-soft">Tap a sticker, then tap the postcard to stick it. Drag stickers to move them. With a keyboard, use the arrow keys.</p>
          <Postcard board={profile.board} onChange={setBoard} picking={picking} onPlaced={() => setPicking(null)} />
          <div className="flex flex-wrap gap-3 items-center">
            {tray.length === 0 && <p className="font-bold text-ink-soft">{unlocked.length === 0 ? 'Finish a mission to get your first sticker!' : 'All your stickers are on the postcard.'}</p>}
            {tray.map((s) => (
              <button key={s.id} type="button" aria-pressed={picking === s.id} onClick={() => setPicking(picking === s.id ? null : s.id)} className={`rounded-full p-1 ${picking === s.id ? 'ring-4 ring-amber-400 bg-amber-100' : ''}`} aria-label={`Pick ${s.name} to place`} data-tray-sticker={s.id}>
                <StickerArt def={s} className="w-20 h-20" />
              </button>
            ))}
            {profile.board.length > 0 && (
              <button className="btn btn-sm" onClick={() => setBoard([])}>
                <Icon name="cross" className="w-5 h-5" /> Clear postcard
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
