// Original illustration library: every picture is hand-built SVG in a 100×100 box.
// Keys are referenced by content via the Picture grammar `name[:colour|variant][*count]`.
import type { ReactElement } from 'react';
import type { ColourName } from '../engine/types';

export const COLOURS: Record<ColourName, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#facc15',
  orange: '#fb923c',
  purple: '#a855f7',
  pink: '#f472b6',
  brown: '#a16207',
  black: '#334155',
  white: '#f8fafc',
  grey: '#9ca3af',
};

const INK = '#2f2f48';
type Draw = (c: string) => ReactElement;

const skin = ['#f1c9a5', '#d9a273', '#a86b43', '#7b4a2a'];

/** Child figure used for action pictures. */
function kid(opts: { pose?: 'stand' | 'run' | 'jump' | 'arms-up' | 'sit'; shirt: string; tone: number; prop?: ReactElement; hair?: string; hijab?: boolean }) {
  const s = skin[opts.tone % skin.length]!;
  const pose = opts.pose ?? 'stand';
  const legs =
    pose === 'run' ? (
      <>
        <path d="M46 70 L36 88" />
        <path d="M54 70 L66 86" />
      </>
    ) : pose === 'jump' ? (
      <>
        <path d="M46 70 L40 82 L46 90" />
        <path d="M54 70 L60 82 L54 90" />
      </>
    ) : pose === 'sit' ? (
      <>
        <path d="M44 72 L60 74 L60 90" />
        <path d="M52 72 L66 74 L66 90" />
      </>
    ) : (
      <>
        <path d="M46 70 L44 90" />
        <path d="M54 70 L56 90" />
      </>
    );
  const arms =
    pose === 'arms-up' || pose === 'jump' ? (
      <>
        <path d="M40 50 L30 32" />
        <path d="M60 50 L70 32" />
      </>
    ) : pose === 'run' ? (
      <>
        <path d="M40 50 L28 58" />
        <path d="M60 50 L70 40" />
      </>
    ) : (
      <>
        <path d="M40 50 L32 62" />
        <path d="M60 50 L68 62" />
      </>
    );
  return (
    <g>
      <g strokeWidth={6} stroke={INK} fill="none">
        {legs}
        {arms}
      </g>
      <g strokeWidth={4} stroke={s} fill="none">
        {arms}
      </g>
      <path d="M38 44 Q50 38 62 44 L60 72 L40 72 Z" fill={opts.shirt} />
      <circle cx="50" cy="28" r="13" fill={s} />
      {opts.hijab ? (
        <path d="M36 30 Q36 12 50 12 Q64 12 64 30 L66 46 Q50 40 34 46 Z M40 30 Q40 20 50 20 Q60 20 60 30 Q60 38 50 39 Q40 38 40 30 Z" fill={opts.hair ?? '#7c3aed'} fillRule="evenodd" />
      ) : (
        <path d="M37 26 Q38 13 50 13 Q63 13 63 26 Q56 20 44 22 Q40 23 37 26 Z" fill={opts.hair ?? '#2a1d14'} />
      )}
      <circle cx="45" cy="29" r="1.6" fill={INK} stroke="none" />
      <circle cx="55" cy="29" r="1.6" fill={INK} stroke="none" />
      <path d="M46 34 Q50 37 54 34" fill="none" strokeWidth={2} />
      {opts.prop}
    </g>
  );
}

function face(expr: string): ReactElement {
  const mouth: Record<string, ReactElement> = {
    happy: <path d="M34 60 Q50 76 66 60" fill="none" strokeWidth={4} />,
    sad: <path d="M34 70 Q50 56 66 70" fill="none" strokeWidth={4} />,
    angry: <path d="M36 68 Q50 60 64 68" fill="none" strokeWidth={4} />,
    tired: <path d="M40 66 L60 66" fill="none" strokeWidth={4} />,
    scared: <ellipse cx="50" cy="66" rx="8" ry="10" fill="#7f1d1d" />,
    surprised: <circle cx="50" cy="66" r="7" fill="#7f1d1d" />,
  };
  const eyes: Record<string, ReactElement> = {
    tired: (
      <>
        <path d="M32 44 Q38 48 44 44" fill="none" strokeWidth={3} />
        <path d="M56 44 Q62 48 68 44" fill="none" strokeWidth={3} />
      </>
    ),
    angry: (
      <>
        <path d="M30 34 L44 40" strokeWidth={4} />
        <path d="M70 34 L56 40" strokeWidth={4} />
        <circle cx="39" cy="46" r="4" fill={INK} />
        <circle cx="61" cy="46" r="4" fill={INK} />
      </>
    ),
  };
  const fills: Record<string, string> = { happy: '#fde047', sad: '#93c5fd', angry: '#fca5a5', tired: '#c4b5fd', scared: '#a5f3fc', surprised: '#fdba74' };
  return (
    <g>
      <circle cx="50" cy="52" r="38" fill={fills[expr] ?? '#fde047'} />
      {eyes[expr] ?? (
        <>
          <circle cx="38" cy="44" r="5" fill={INK} />
          <circle cx="62" cy="44" r="5" fill={INK} />
        </>
      )}
      {expr === 'sad' && <path d="M36 52 Q34 58 36 60 Q39 58 36 52 Z" fill="#3b82f6" strokeWidth={1.5} />}
      {mouth[expr] ?? mouth.happy}
    </g>
  );
}

function building(c: string, roof: string, sign: ReactElement) {
  return (
    <g>
      <rect x="16" y="40" width="68" height="50" rx="4" fill={c} />
      <path d="M10 42 L50 12 L90 42 Z" fill={roof} />
      <rect x="42" y="64" width="16" height="26" rx="3" fill="#7c4a1e" />
      <rect x="22" y="52" width="14" height="12" rx="2" fill="#bae6fd" />
      <rect x="64" y="52" width="14" height="12" rx="2" fill="#bae6fd" />
      {sign}
    </g>
  );
}

export const ICONS: Record<string, Draw> = {
  // ---------- Animals ----------
  elephant: (c) => (
    <g>
      <ellipse cx="54" cy="58" rx="30" ry="22" fill={c} />
      <ellipse cx="28" cy="44" rx="16" ry="18" fill="#b9c3d6" />
      <circle cx="34" cy="48" r="14" fill={c} />
      <path d="M24 54 Q16 70 22 86" fill="none" stroke={c} strokeWidth={9} />
      <path d="M24 54 Q16 70 22 86" fill="none" strokeWidth={0} />
      <rect x="38" y="72" width="10" height="16" rx="3" fill={c} />
      <rect x="64" y="72" width="10" height="16" rx="3" fill={c} />
      <circle cx="32" cy="44" r="2.5" fill={INK} />
      <path d="M28 58 Q34 62 30 66" fill="none" stroke="#fff" strokeWidth={3} />
    </g>
  ),
  giraffe: (c) => (
    <g>
      <rect x="40" y="16" width="12" height="50" rx="5" fill={c} />
      <ellipse cx="44" cy="16" rx="12" ry="8" fill={c} />
      <ellipse cx="60" cy="68" rx="24" ry="14" fill={c} />
      <rect x="40" y="76" width="7" height="18" fill={c} />
      <rect x="72" y="76" width="7" height="18" fill={c} />
      <circle cx="46" cy="40" r="3" fill="#a16207" stroke="none" />
      <circle cx="58" cy="66" r="4" fill="#a16207" stroke="none" />
      <circle cx="70" cy="70" r="3" fill="#a16207" stroke="none" />
      <path d="M40 9 L38 2 M48 9 L50 2" />
      <circle cx="40" cy="14" r="2" fill={INK} />
    </g>
  ),
  cat: (c) => (
    <g>
      <ellipse cx="55" cy="70" rx="24" ry="18" fill={c} />
      <path d="M78 74 Q94 60 86 44" fill="none" stroke={c} strokeWidth={7} />
      <circle cx="42" cy="44" r="20" fill={c} />
      <path d="M26 34 L26 16 L40 28 Z M58 34 L58 16 L44 28 Z" fill={c} />
      <circle cx="35" cy="42" r="2.6" fill={INK} />
      <circle cx="49" cy="42" r="2.6" fill={INK} />
      <path d="M40 50 L42 52 L44 50" fill="none" strokeWidth={2} />
      <path d="M22 48 L32 49 M52 49 L62 48" strokeWidth={1.5} />
    </g>
  ),
  dog: (c) => (
    <g>
      <ellipse cx="58" cy="70" rx="26" ry="16" fill={c} />
      <circle cx="40" cy="46" r="20" fill={c} />
      <ellipse cx="24" cy="48" rx="7" ry="14" fill="#7c4a1e" />
      <ellipse cx="56" cy="48" rx="7" ry="14" fill="#7c4a1e" />
      <ellipse cx="40" cy="56" rx="10" ry="7" fill="#fde7c7" />
      <circle cx="40" cy="52" r="3" fill={INK} />
      <circle cx="33" cy="42" r="2.5" fill={INK} />
      <circle cx="47" cy="42" r="2.5" fill={INK} />
      <path d="M84 64 Q94 54 90 46" fill="none" stroke={c} strokeWidth={6} />
      <rect x="42" y="80" width="8" height="12" rx="3" fill={c} />
      <rect x="66" y="80" width="8" height="12" rx="3" fill={c} />
    </g>
  ),
  bird: (c) => (
    <g>
      <ellipse cx="50" cy="56" rx="26" ry="20" fill={c} />
      <circle cx="68" cy="40" r="14" fill={c} />
      <path d="M80 40 L94 44 L80 48 Z" fill="#f59e0b" />
      <path d="M36 52 Q48 40 58 58 Q44 66 36 52 Z" fill="#fff" opacity={0.6} />
      <circle cx="70" cy="37" r="2.5" fill={INK} />
      <path d="M44 76 L42 88 M56 76 L58 88" />
      <path d="M24 56 L10 48 L14 62 Z" fill={c} />
    </g>
  ),
  fish: (c) => (
    <g>
      <path d="M14 50 Q40 20 72 50 Q40 80 14 50 Z" fill={c} />
      <path d="M70 50 L90 34 L88 66 Z" fill={c} />
      <circle cx="30" cy="46" r="3" fill={INK} />
      <path d="M44 38 Q50 50 44 62" fill="none" strokeWidth={2} />
    </g>
  ),
  rabbit: (c) => (
    <g>
      <ellipse cx="38" cy="22" rx="6" ry="18" fill={c} />
      <ellipse cx="56" cy="22" rx="6" ry="18" fill={c} />
      <ellipse cx="38" cy="22" rx="2.5" ry="12" fill="#fbcfe8" stroke="none" />
      <ellipse cx="56" cy="22" rx="2.5" ry="12" fill="#fbcfe8" stroke="none" />
      <ellipse cx="50" cy="74" rx="24" ry="18" fill={c} />
      <circle cx="47" cy="48" r="16" fill={c} />
      <circle cx="41" cy="46" r="2.5" fill={INK} />
      <circle cx="53" cy="46" r="2.5" fill={INK} />
      <circle cx="47" cy="53" r="2.5" fill="#f472b6" />
    </g>
  ),
  tiger: (c) => (
    <g>
      <circle cx="50" cy="52" r="32" fill={c} />
      <circle cx="26" cy="26" r="9" fill={c} />
      <circle cx="74" cy="26" r="9" fill={c} />
      <ellipse cx="50" cy="66" rx="16" ry="12" fill="#fff7ed" />
      <path d="M50 22 L50 34 M38 24 L42 34 M62 24 L58 34 M20 50 L32 52 M80 50 L68 52 M22 62 L32 60 M78 62 L68 60" strokeWidth={4} />
      <circle cx="40" cy="46" r="3" fill={INK} />
      <circle cx="60" cy="46" r="3" fill={INK} />
      <path d="M46 60 L54 60 L50 65 Z" fill={INK} />
    </g>
  ),
  monkey: (c) => (
    <g>
      <circle cx="22" cy="44" r="10" fill="#fcd9b6" />
      <circle cx="78" cy="44" r="10" fill="#fcd9b6" />
      <circle cx="50" cy="46" r="28" fill={c} />
      <path d="M30 50 Q30 34 42 36 Q50 40 58 36 Q70 34 70 50 Q70 72 50 72 Q30 72 30 50 Z" fill="#fcd9b6" />
      <circle cx="42" cy="48" r="3" fill={INK} />
      <circle cx="58" cy="48" r="3" fill={INK} />
      <path d="M42 60 Q50 66 58 60" fill="none" strokeWidth={3} />
      <path d="M50 74 L50 92" stroke={c} strokeWidth={8} />
    </g>
  ),
  turtle: (c) => (
    <g>
      <circle cx="82" cy="58" r="9" fill="#86efac" />
      <rect x="22" y="64" width="12" height="14" rx="5" fill="#86efac" />
      <rect x="62" y="64" width="12" height="14" rx="5" fill="#86efac" />
      <path d="M14 66 Q16 30 48 30 Q78 30 80 66 Z" fill={c} />
      <path d="M30 64 L38 44 L58 44 L66 64 M38 44 L48 32 L58 44" fill="none" strokeWidth={2.5} />
      <circle cx="85" cy="56" r="2" fill={INK} />
    </g>
  ),
  cow: (c) => (
    <g>
      <rect x="20" y="40" width="60" height="34" rx="14" fill={c} />
      <circle cx="40" cy="52" r="6" fill={INK} stroke="none" />
      <circle cx="62" cy="62" r="7" fill={INK} stroke="none" />
      <rect x="26" y="70" width="9" height="20" rx="3" fill={c} />
      <rect x="64" y="70" width="9" height="20" rx="3" fill={c} />
      <circle cx="20" cy="38" r="15" fill={c} />
      <ellipse cx="16" cy="46" rx="10" ry="7" fill="#fbcfe8" />
      <path d="M8 24 L4 16 M30 24 L34 16" strokeWidth={4} />
      <circle cx="16" cy="34" r="2.5" fill={INK} />
      <circle cx="26" cy="34" r="2.5" fill={INK} />
    </g>
  ),
  chicken: (c) => (
    <g>
      <ellipse cx="52" cy="60" rx="26" ry="22" fill={c} />
      <circle cx="34" cy="36" r="13" fill={c} />
      <path d="M28 22 Q32 14 36 22 Q40 14 42 24" fill="#ef4444" />
      <path d="M22 38 L12 42 L22 44 Z" fill="#f59e0b" />
      <path d="M28 46 Q26 52 30 52" fill="#ef4444" />
      <circle cx="32" cy="34" r="2.5" fill={INK} />
      <path d="M74 50 Q88 40 82 62" fill={c} />
      <path d="M46 82 L44 92 M58 82 L60 92" stroke="#f59e0b" strokeWidth={4} />
    </g>
  ),
  duck: (c) => (
    <g>
      <path d="M18 60 Q20 84 52 84 Q84 84 86 58 Q70 66 56 56 Z" fill={c} />
      <circle cx="40" cy="40" r="15" fill={c} />
      <path d="M24 42 L8 46 L24 50 Z" fill="#fb923c" />
      <circle cx="38" cy="36" r="2.5" fill={INK} />
      <path d="M50 66 Q62 58 74 66" fill="none" strokeWidth={2.5} />
      <path d="M10 88 Q50 96 90 88" fill="none" stroke="#38bdf8" strokeWidth={4} />
    </g>
  ),
  butterfly: (c) => (
    <g>
      <path d="M48 48 Q20 10 12 36 Q8 56 48 52 Z" fill={c} />
      <path d="M52 48 Q80 10 88 36 Q92 56 52 52 Z" fill={c} />
      <path d="M48 54 Q22 80 30 86 Q42 88 48 58 Z" fill="#fde047" />
      <path d="M52 54 Q78 80 70 86 Q58 88 52 58 Z" fill="#fde047" />
      <rect x="46" y="34" width="8" height="40" rx="4" fill={INK} />
      <path d="M48 34 Q44 24 38 22 M52 34 Q56 24 62 22" fill="none" />
    </g>
  ),
  frog: (c) => (
    <g>
      <ellipse cx="50" cy="64" rx="34" ry="24" fill={c} />
      <circle cx="32" cy="38" r="12" fill={c} />
      <circle cx="68" cy="38" r="12" fill={c} />
      <circle cx="32" cy="38" r="6" fill="#fff" />
      <circle cx="68" cy="38" r="6" fill="#fff" />
      <circle cx="33" cy="39" r="3" fill={INK} />
      <circle cx="67" cy="39" r="3" fill={INK} />
      <path d="M32 66 Q50 80 68 66" fill="none" strokeWidth={3} />
    </g>
  ),
  snake: (c) => (
    <g>
      <path d="M14 80 Q30 60 50 76 Q70 92 82 70 Q90 54 74 46 Q58 40 54 28" fill="none" stroke={INK} strokeWidth={14} />
      <path d="M14 80 Q30 60 50 76 Q70 92 82 70 Q90 54 74 46 Q58 40 54 28" fill="none" stroke={c} strokeWidth={9} />
      <ellipse cx="54" cy="22" rx="11" ry="9" fill={c} />
      <circle cx="51" cy="19" r="2" fill={INK} />
      <path d="M62 24 L70 26 L66 28 L70 30" fill="none" stroke="#ef4444" strokeWidth={2} />
    </g>
  ),
  hornbill: (c) => (
    <g>
      <ellipse cx="54" cy="62" rx="22" ry="24" fill={c} />
      <circle cx="44" cy="34" r="14" fill={c} />
      <path d="M32 26 Q12 24 6 40 Q22 36 32 40 Z" fill="#f59e0b" />
      <path d="M30 22 Q16 14 10 26 Q22 22 32 28 Z" fill="#ef4444" />
      <path d="M50 46 Q64 52 66 78" fill="none" stroke="#fff" strokeWidth={6} />
      <circle cx="46" cy="32" r="2.5" fill={INK} />
      <path d="M60 84 L58 94 M48 84 L46 94" />
    </g>
  ),

  // ---------- Food ----------
  apple: (c) => (
    <g>
      <path d="M50 30 Q74 20 80 46 Q82 80 60 86 Q50 82 40 86 Q18 80 20 46 Q26 20 50 30 Z" fill={c} />
      <path d="M50 30 Q50 18 56 12" fill="none" strokeWidth={4} />
      <path d="M54 20 Q66 10 72 18 Q62 26 54 20 Z" fill="#22c55e" />
      <ellipse cx="34" cy="46" rx="4" ry="8" fill="#fff" opacity={0.6} stroke="none" />
    </g>
  ),
  banana: (c) => (
    <g>
      <path d="M18 30 Q22 80 80 76 Q86 70 80 66 Q40 66 30 28 Z" fill={c} />
      <path d="M16 30 L28 26 L26 20 L18 22 Z" fill="#78350f" />
      <path d="M36 50 Q50 64 72 68" fill="none" strokeWidth={2} />
    </g>
  ),
  watermelon: () => (
    <g>
      <path d="M10 40 Q50 110 90 40 Z" fill="#22c55e" />
      <path d="M16 42 Q50 98 84 42 Z" fill="#f87171" />
      {[30, 42, 54, 66].map((x, i) => (
        <ellipse key={x} cx={x + 2} cy={52 + (i % 2) * 8} rx="2" ry="3.5" fill={INK} stroke="none" />
      ))}
    </g>
  ),
  orange: (c) => (
    <g>
      <circle cx="50" cy="54" r="32" fill={c} />
      <path d="M50 22 Q60 10 70 16 Q62 26 50 22 Z" fill="#22c55e" />
      <circle cx="38" cy="44" r="2" fill="#fff" stroke="none" />
      <circle cx="58" cy="60" r="2" fill="#fff" stroke="none" opacity={0.6} />
    </g>
  ),
  rice: () => (
    <g>
      <path d="M22 50 Q50 20 78 50 Z" fill="#fff" />
      <path d="M12 50 L88 50 Q84 84 50 86 Q16 84 12 50 Z" fill="#60a5fa" />
      <path d="M24 62 Q50 70 76 62" fill="none" stroke="#fff" strokeWidth={3} />
    </g>
  ),
  bread: () => (
    <g>
      <path d="M18 46 Q12 22 50 22 Q88 22 82 46 L78 84 L22 84 Z" fill="#f59e0b" />
      <path d="M26 46 Q22 30 50 30 Q78 30 74 46 L72 78 L28 78 Z" fill="#fde68a" />
    </g>
  ),
  egg: () => (
    <g>
      <path d="M12 56 Q16 30 46 32 Q66 18 84 40 Q94 62 74 74 Q50 88 24 76 Q8 68 12 56 Z" fill="#fff" />
      <circle cx="50" cy="54" r="15" fill="#facc15" />
    </g>
  ),
  milk: () => (
    <g>
      <path d="M30 30 L70 30 L74 90 L26 90 Z" fill="#fff" />
      <path d="M30 30 L40 12 L60 12 L70 30 Z" fill="#93c5fd" />
      <rect x="34" y="50" width="32" height="20" rx="4" fill="#3b82f6" />
      <text x="50" y="65" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" stroke="none">MILK</text>
    </g>
  ),
  water: () => (
    <g>
      <path d="M26 16 L74 16 L68 90 L32 90 Z" fill="#e0f2fe" />
      <path d="M29 40 L71 40 L68 90 L32 90 Z" fill="#7dd3fc" />
      <ellipse cx="42" cy="58" rx="3" ry="8" fill="#fff" stroke="none" />
    </g>
  ),
  cake: () => (
    <g>
      <rect x="18" y="50" width="64" height="36" rx="6" fill="#f9a8d4" />
      <path d="M18 60 Q26 70 34 60 Q42 70 50 60 Q58 70 66 60 Q74 70 82 60" fill="none" stroke="#fff" strokeWidth={4} />
      <rect x="46" y="28" width="8" height="22" fill="#fde047" />
      <path d="M50 14 Q56 22 50 28 Q44 22 50 14 Z" fill="#fb923c" />
    </g>
  ),
  noodles: () => (
    <g>
      <path d="M30 20 L44 48 M70 18 L56 48" strokeWidth={4} />
      <path d="M26 44 Q34 36 42 46 Q50 36 58 46 Q66 36 74 44" fill="none" stroke="#facc15" strokeWidth={5} />
      <path d="M12 48 L88 48 Q84 86 50 88 Q16 86 12 48 Z" fill="#ef4444" />
      <path d="M22 62 L78 62" stroke="#fff" strokeWidth={3} />
    </g>
  ),
  icecream: (c) => (
    <g>
      <path d="M32 50 L50 94 L68 50 Z" fill="#f59e0b" />
      <path d="M36 56 L64 56 M40 66 L60 66" strokeWidth={2} />
      <circle cx="50" cy="36" r="20" fill={c} />
      <circle cx="50" cy="16" r="6" fill="#ef4444" />
    </g>
  ),
  cup: (c) => (
    <g>
      <path d="M20 30 L76 30 L70 84 L26 84 Z" fill={c} />
      <path d="M76 42 Q94 44 90 60 Q86 72 72 70" fill="none" strokeWidth={5} />
      <path d="M38 22 Q34 14 40 8 M54 22 Q50 14 56 8" fill="none" stroke="#9ca3af" />
      <ellipse cx="48" cy="34" rx="26" ry="4" fill="#c08457" />
    </g>
  ),

  // ---------- Things ----------
  bag: (c) => (
    <g>
      <path d="M34 30 Q34 12 50 12 Q66 12 66 30" fill="none" strokeWidth={6} />
      <rect x="20" y="28" width="60" height="62" rx="14" fill={c} />
      <rect x="32" y="56" width="36" height="22" rx="6" fill="#fff" opacity={0.5} />
      <path d="M32 64 L68 64" />
    </g>
  ),
  book: (c) => (
    <g>
      <path d="M50 26 Q30 16 12 22 L12 82 Q30 76 50 86 Z" fill={c} />
      <path d="M50 26 Q70 16 88 22 L88 82 Q70 76 50 86 Z" fill={c} />
      <path d="M50 30 Q34 22 18 26 L18 76 Q34 72 50 80 Z" fill="#fff" />
      <path d="M50 30 Q66 22 82 26 L82 76 Q66 72 50 80 Z" fill="#fff" />
      <path d="M24 38 L42 40 M24 48 L42 50 M58 40 L76 38 M58 50 L76 48" strokeWidth={2} />
    </g>
  ),
  pencil: (c) => (
    <g transform="rotate(-35 50 50)">
      <rect x="40" y="10" width="20" height="64" fill={c} />
      <rect x="40" y="6" width="20" height="10" rx="2" fill="#f9a8d4" />
      <path d="M40 74 L50 94 L60 74 Z" fill="#fde7c7" />
      <path d="M46 86 L50 94 L54 86 Z" fill={INK} />
    </g>
  ),
  ruler: (c) => (
    <g transform="rotate(-20 50 50)">
      <rect x="8" y="38" width="84" height="24" rx="3" fill={c} />
      {[16, 26, 36, 46, 56, 66, 76, 86].map((x, i) => (
        <path key={x} d={`M${x} 38 L${x} ${i % 2 ? 46 : 50}`} strokeWidth={2} />
      ))}
    </g>
  ),
  eraser: (c) => (
    <g transform="rotate(-15 50 50)">
      <rect x="14" y="36" width="72" height="30" rx="6" fill={c} />
      <rect x="14" y="36" width="30" height="30" rx="6" fill="#fff" />
    </g>
  ),
  chair: (c) => (
    <g>
      <rect x="28" y="10" width="44" height="40" rx="6" fill={c} />
      <rect x="22" y="50" width="56" height="10" rx="3" fill={c} />
      <path d="M28 60 L26 92 M72 60 L74 92" strokeWidth={6} />
      <path d="M28 60 L26 92 M72 60 L74 92" stroke={c} strokeWidth={3} />
    </g>
  ),
  table: (c) => (
    <g>
      <rect x="6" y="34" width="88" height="12" rx="3" fill={c} />
      <path d="M16 46 L16 92 M84 46 L84 92" strokeWidth={8} />
      <path d="M16 46 L16 92 M84 46 L84 92" stroke={c} strokeWidth={4} />
    </g>
  ),
  ball: (c) => (
    <g>
      <circle cx="50" cy="52" r="34" fill={c} />
      <path d="M18 44 Q50 60 82 44 M50 18 Q36 52 50 86" fill="none" stroke="#fff" strokeWidth={4} />
    </g>
  ),
  hat: (c) => (
    <g>
      <ellipse cx="50" cy="70" rx="42" ry="12" fill={c} />
      <path d="M26 70 Q26 26 50 26 Q74 26 74 70 Z" fill={c} />
      <path d="M27 60 Q50 66 73 60" fill="none" stroke="#fff" strokeWidth={5} />
    </g>
  ),
  umbrella: (c) => (
    <g>
      <path d="M8 50 Q10 14 50 14 Q90 14 92 50 Q82 42 71 50 Q61 42 50 50 Q39 42 29 50 Q18 42 8 50 Z" fill={c} />
      <path d="M50 50 L50 84 Q50 92 42 92 Q36 92 36 86" fill="none" strokeWidth={5} />
    </g>
  ),
  shoe: (c) => (
    <g>
      <path d="M10 70 L14 40 L40 40 Q46 56 70 58 Q92 60 90 76 L90 82 L10 82 Z" fill={c} />
      <rect x="10" y="76" width="80" height="8" rx="3" fill="#fff" />
      <path d="M24 46 L36 50 M24 54 L38 56" stroke="#fff" strokeWidth={3} />
    </g>
  ),
  shirt: (c) => (
    <g>
      <path d="M34 14 L14 26 L22 44 L30 40 L30 88 L70 88 L70 40 L78 44 L86 26 L66 14 Q50 26 34 14 Z" fill={c} />
      <path d="M50 30 L50 84" strokeWidth={2} />
    </g>
  ),
  bed: (c) => (
    <g>
      <rect x="8" y="34" width="12" height="56" rx="3" fill="#a16207" />
      <rect x="16" y="54" width="76" height="22" rx="4" fill={c} />
      <rect x="20" y="44" width="22" height="12" rx="5" fill="#fff" />
      <path d="M16 76 L16 90 M88 76 L88 90" strokeWidth={6} />
    </g>
  ),
  box: (c) => (
    <g>
      <rect x="12" y="38" width="76" height="52" rx="4" fill={c} />
      <path d="M12 38 L24 22 L76 22 L88 38" fill="#d6a46a" />
      <path d="M40 38 L40 90 M60 38 L60 90" stroke="#fff" strokeWidth={3} opacity={0.6} />
    </g>
  ),
  kite: (c) => (
    <g>
      <path d="M50 6 L80 40 L50 74 L20 40 Z" fill={c} />
      <path d="M50 6 L50 74 M20 40 L80 40" strokeWidth={2} />
      <path d="M50 74 Q40 84 52 88 Q62 92 54 98" fill="none" strokeWidth={2} />
      <path d="M44 82 L50 86 M50 92 L56 94" stroke="#ef4444" strokeWidth={4} />
    </g>
  ),
  bicycle: (c) => (
    <g>
      <circle cx="24" cy="66" r="18" fill="none" strokeWidth={5} />
      <circle cx="76" cy="66" r="18" fill="none" strokeWidth={5} />
      <path d="M24 66 L42 40 L66 40 L76 66 M42 40 L52 66 L66 40 M52 66 L24 66" fill="none" stroke={c} strokeWidth={5} />
      <path d="M38 34 L48 34 M62 30 L72 30 L66 40" fill="none" strokeWidth={4} />
    </g>
  ),
  car: (c) => (
    <g>
      <path d="M8 66 L12 48 L28 46 L38 28 L66 28 L78 46 L92 50 L92 66 Z" fill={c} />
      <path d="M40 34 L48 34 L48 46 L32 46 Z M54 34 L64 34 L72 46 L54 46 Z" fill="#bae6fd" />
      <circle cx="28" cy="68" r="10" fill={INK} />
      <circle cx="72" cy="68" r="10" fill={INK} />
      <circle cx="28" cy="68" r="4" fill="#e5e7eb" />
      <circle cx="72" cy="68" r="4" fill="#e5e7eb" />
    </g>
  ),
  bus: (c) => (
    <g>
      <rect x="8" y="22" width="84" height="52" rx="8" fill={c} />
      {[14, 34, 54].map((x) => (
        <rect key={x} x={x} y="30" width="16" height="16" rx="2" fill="#bae6fd" />
      ))}
      <rect x="74" y="30" width="12" height="34" rx="2" fill="#bae6fd" />
      <circle cx="26" cy="76" r="9" fill={INK} />
      <circle cx="72" cy="76" r="9" fill={INK} />
      <path d="M8 56 L72 56" stroke="#fff" strokeWidth={4} />
    </g>
  ),
  boat: (c) => (
    <g>
      <path d="M48 12 L48 62" strokeWidth={4} />
      <path d="M52 16 L80 56 L52 56 Z" fill="#fff" />
      <path d="M10 64 L90 64 L76 84 L24 84 Z" fill={c} />
      <path d="M4 92 Q20 86 36 92 Q52 98 68 92 Q84 86 96 92" fill="none" stroke="#38bdf8" strokeWidth={4} />
    </g>
  ),
  clock: (c) => (
    <g>
      <circle cx="50" cy="52" r="38" fill={c} />
      <circle cx="50" cy="52" r="30" fill="#fff" />
      <path d="M50 52 L50 30 M50 52 L64 60" strokeWidth={4} />
      <circle cx="50" cy="52" r="3" fill={INK} />
    </g>
  ),
  key: (c) => (
    <g>
      <circle cx="30" cy="50" r="18" fill={c} />
      <circle cx="30" cy="50" r="7" fill="#fff" />
      <path d="M46 50 L88 50 L88 62 M74 50 L74 60" fill="none" stroke={INK} strokeWidth={9} />
      <path d="M46 50 L88 50 L88 62 M74 50 L74 60" fill="none" stroke={c} strokeWidth={5} />
    </g>
  ),
  toothbrush: (c) => (
    <g transform="rotate(-30 50 50)">
      <rect x="20" y="46" width="70" height="10" rx="5" fill={c} />
      <rect x="14" y="30" width="22" height="16" rx="2" fill="#fff" />
      <path d="M18 30 L18 40 M24 30 L24 40 M30 30 L30 40" stroke="#93c5fd" strokeWidth={3} />
    </g>
  ),
  spoon: (c) => (
    <g transform="rotate(30 50 50)">
      <ellipse cx="50" cy="24" rx="14" ry="18" fill={c} />
      <rect x="46" y="40" width="8" height="52" rx="4" fill={c} />
    </g>
  ),
  plate: (c) => (
    <g>
      <ellipse cx="50" cy="56" rx="42" ry="30" fill="#fff" />
      <ellipse cx="50" cy="56" rx="28" ry="18" fill={c} opacity={0.35} />
    </g>
  ),
  racket: (c) => (
    <g>
      <ellipse cx="42" cy="34" rx="22" ry="26" fill="#fff" stroke={c} strokeWidth={5} />
      <path d="M28 22 L56 22 M24 34 L60 34 M28 46 L56 46 M34 12 L34 58 M42 8 L42 60 M50 12 L50 58" strokeWidth={1.2} />
      <path d="M48 60 L72 92" strokeWidth={8} />
      <path d="M82 18 L90 26 M86 12 Q96 20 86 30 Q78 22 86 12 Z" fill="#fff" />
    </g>
  ),
  basket: (c) => (
    <g>
      <path d="M24 44 Q24 14 50 14 Q76 14 76 44" fill="none" strokeWidth={5} />
      <path d="M10 44 L90 44 L80 88 L20 88 Z" fill={c} />
      <path d="M18 58 L82 58 M22 72 L78 72 M36 44 L38 88 M64 44 L62 88" strokeWidth={2} />
    </g>
  ),

  // ---------- Nature ----------
  tree: (c) => (
    <g>
      <rect x="42" y="56" width="16" height="36" rx="3" fill="#a16207" />
      <circle cx="50" cy="38" r="26" fill={c} />
      <circle cx="30" cy="50" r="16" fill={c} />
      <circle cx="70" cy="50" r="16" fill={c} />
    </g>
  ),
  flower: (c) => (
    <g>
      <path d="M50 54 L50 94" stroke="#16a34a" strokeWidth={5} />
      <path d="M50 78 Q66 66 72 74 Q62 84 50 80" fill="#22c55e" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="50" cy="22" rx="11" ry="16" fill={c} transform={`rotate(${a} 50 38)`} />
      ))}
      <circle cx="50" cy="38" r="10" fill="#fde047" />
    </g>
  ),
  sun: () => (
    <g>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M50 6 L50 18" strokeWidth={5} stroke="#f59e0b" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="24" fill="#fde047" />
      <path d="M40 54 Q50 62 60 54" fill="none" />
    </g>
  ),
  moon: () => (
    <g>
      <path d="M60 10 Q24 18 26 54 Q30 88 68 90 Q40 76 40 50 Q42 24 60 10 Z" fill="#fde68a" />
      <circle cx="74" cy="24" r="3" fill="#fde68a" />
      <circle cx="80" cy="54" r="2" fill="#fde68a" />
    </g>
  ),
  star: (c) => (
    <g>
      <path d="M50 8 L61 36 L92 38 L68 58 L76 88 L50 72 L24 88 L32 58 L8 38 L39 36 Z" fill={c} />
    </g>
  ),
  cloud: () => (
    <g>
      <path d="M22 72 Q4 70 10 54 Q14 42 28 46 Q30 26 50 26 Q68 26 72 44 Q90 42 92 58 Q92 72 76 72 Z" fill="#fff" />
    </g>
  ),
  rain: () => (
    <g>
      <path d="M22 56 Q6 54 10 40 Q14 30 26 34 Q28 16 48 16 Q66 16 70 32 Q88 30 90 46 Q90 56 76 56 Z" fill="#cbd5e1" />
      {[28, 46, 64, 80].map((x, i) => (
        <path key={x} d={`M${x} ${64 + (i % 2) * 6} L${x - 6} ${80 + (i % 2) * 6}`} stroke="#3b82f6" strokeWidth={4} />
      ))}
    </g>
  ),
  windy: () => (
    <g>
      <path d="M10 36 L60 36 Q74 36 72 24 Q68 14 58 20" fill="none" strokeWidth={5} stroke="#64748b" />
      <path d="M10 54 L78 54 Q92 54 90 66 Q86 76 76 70" fill="none" strokeWidth={5} stroke="#64748b" />
      <path d="M18 72 L50 72" strokeWidth={5} stroke="#64748b" />
      <path d="M70 80 Q80 84 76 92 Q62 90 70 80 Z" fill="#22c55e" />
    </g>
  ),
  rainbow: () => (
    <g fill="none" strokeWidth={7} stroke="none">
      {['#ef4444', '#fb923c', '#facc15', '#22c55e', '#3b82f6', '#a855f7'].map((col, i) => (
        <path key={col} d={`M${10 + i * 6} 80 A${40 - i * 6} ${40 - i * 6} 0 0 1 ${90 - i * 6} 80`} stroke={col} />
      ))}
    </g>
  ),

  // ---------- Places ----------
  house: (c) => building(c, '#ef4444', <></>),
  school: () =>
    building(
      '#fde68a',
      '#f97316',
      <>
        <rect x="34" y="26" width="32" height="10" rx="2" fill="#fff" />
        <text x="50" y="34" textAnchor="middle" fontSize="8" fontWeight="800" fill={INK} stroke="none">SCHOOL</text>
      </>,
    ),
  shop: () => (
    <g>
      <rect x="12" y="40" width="76" height="50" rx="4" fill="#fef3c7" />
      <path d="M8 40 L16 18 L84 18 L92 40 Z" fill="#ec4899" />
      <path d="M22 18 L18 40 M36 18 L34 40 M50 18 L50 40 M64 18 L66 40 M78 18 L82 40" stroke="#fff" strokeWidth={4} />
      <rect x="20" y="52" width="60" height="24" rx="3" fill="#fff" />
      <circle cx="32" cy="64" r="6" fill="#ef4444" />
      <circle cx="48" cy="64" r="6" fill="#facc15" />
      <circle cx="64" cy="64" r="6" fill="#22c55e" />
    </g>
  ),
  hospital: () =>
    building(
      '#f8fafc',
      '#38bdf8',
      <path d="M46 22 L54 22 L54 28 L60 28 L60 36 L54 36 L54 42 L46 42 L46 36 L40 36 L40 28 L46 28 Z" fill="#ef4444" strokeWidth={1.5} />,
    ),
  library: () =>
    building(
      '#c7d2fe',
      '#6366f1',
      <path d="M50 30 Q42 26 36 28 L36 38 Q42 36 50 40 Q58 36 64 38 L64 28 Q58 26 50 30 Z" fill="#fff" strokeWidth={1.5} />,
    ),
  beach: () => (
    <g>
      <rect x="0" y="0" width="100" height="60" fill="#bae6fd" stroke="none" />
      <circle cx="78" cy="22" r="10" fill="#fde047" />
      <path d="M0 56 Q25 48 50 56 Q75 64 100 56 L100 70 L0 70 Z" fill="#38bdf8" stroke="none" />
      <rect x="0" y="68" width="100" height="32" fill="#fde68a" stroke="none" />
      <path d="M26 90 L30 50" strokeWidth={3} />
      <path d="M10 54 Q30 30 50 54 Z" fill="#ef4444" />
    </g>
  ),
  park: () => (
    <g>
      <rect x="0" y="66" width="100" height="34" fill="#86efac" stroke="none" />
      <rect x="16" y="56" width="10" height="24" fill="#a16207" />
      <circle cx="21" cy="44" r="18" fill="#22c55e" />
      <rect x="50" y="62" width="40" height="6" rx="2" fill="#f97316" />
      <path d="M54 68 L54 80 M86 68 L86 80 M50 56 L90 56" strokeWidth={4} />
    </g>
  ),
};

/** Variant-based pictures: `face:happy`, `act:read`, `swatch:red`, `person:doctor`. */
const ACTIONS: Record<string, (tone: number) => ReactElement> = {
  read: (t) => kid({ shirt: '#3b82f6', tone: t, prop: <g transform="translate(26 44) scale(0.48)">{ICONS.book!('#ef4444')}</g> }),
  write: (t) =>
    kid({
      shirt: '#22c55e',
      tone: t,
      hijab: true,
      prop: (
        <g>
          <rect x="56" y="58" width="32" height="24" rx="2" fill="#fff" />
          <path d="M60 66 L82 66 M60 72 L76 72" strokeWidth={2} />
          <path d="M68 62 L84 48" stroke="#facc15" strokeWidth={4} />
        </g>
      ),
    }),
  eat: (t) => kid({ shirt: '#f97316', tone: t, prop: <g transform="translate(56 50) scale(0.38)">{ICONS.rice!('')}</g> }),
  drink: (t) => kid({ shirt: '#a855f7', tone: t, prop: <g transform="translate(60 44) scale(0.3)">{ICONS.water!('')}</g> }),
  sleep: (t) => (
    <g>
      <g transform="translate(0 10)">{ICONS.bed!('#60a5fa')}</g>
      <circle cx="34" cy="56" r="9" fill={skin[t % 4]} />
      <path d="M30 56 L33 56 M36 56 L39 56" strokeWidth={2} />
      <text x="64" y="30" fontSize="18" fontWeight="800" fill="#6366f1" stroke="none">z z</text>
    </g>
  ),
  run: (t) => kid({ pose: 'run', shirt: '#ef4444', tone: t }),
  jump: (t) => kid({ pose: 'jump', shirt: '#eab308', tone: t }),
  swim: (t) => (
    <g>
      <circle cx="44" cy="46" r="12" fill={skin[t % 4]} />
      <path d="M36 42 Q44 30 54 40" fill="#334155" />
      <path d="M58 52 L80 34" stroke={INK} strokeWidth={6} />
      <path d="M58 52 L80 34" stroke={skin[t % 4]} strokeWidth={3} />
      <path d="M0 62 Q12 54 25 62 Q38 70 50 62 Q62 54 75 62 Q88 70 100 62 L100 100 L0 100 Z" fill="#38bdf8" />
      <path d="M8 80 Q20 74 32 80 M58 84 Q70 78 82 84" fill="none" stroke="#fff" />
    </g>
  ),
  sing: (t) =>
    kid({
      shirt: '#ec4899',
      tone: t,
      prop: (
        <g fill={INK}>
          <path d="M72 14 L72 30" strokeWidth={3} />
          <circle cx="68" cy="31" r="4" />
          <path d="M84 20 L84 36" strokeWidth={3} />
          <circle cx="80" cy="37" r="4" />
          <path d="M72 14 L84 20" strokeWidth={3} />
        </g>
      ),
    }),
  football: (t) => kid({ pose: 'run', shirt: '#16a34a', tone: t, prop: <g transform="translate(70 70) scale(0.26)">{ICONS.ball!('#f8fafc')}</g> }),
  badminton: (t) =>
    kid({ pose: 'arms-up', shirt: '#0ea5e9', tone: t, hijab: true, prop: <g transform="translate(60 0) scale(0.4)">{ICONS.racket!('#ef4444')}</g> }),
  cook: (t) =>
    kid({
      shirt: '#f8fafc',
      tone: t,
      prop: (
        <g>
          <ellipse cx="74" cy="66" rx="16" ry="6" fill="#64748b" />
          <path d="M58 64 L44 60" strokeWidth={4} />
          <path d="M70 56 Q66 48 72 42 M78 56 Q74 48 80 42" fill="none" stroke="#9ca3af" />
        </g>
      ),
    }),
  wash: (t) =>
    kid({
      shirt: '#14b8a6',
      tone: t,
      prop: (
        <g>
          <path d="M70 14 L70 24 L82 24" fill="none" strokeWidth={4} />
          <circle cx="76" cy="36" r="3" fill="#38bdf8" />
          <circle cx="72" cy="46" r="3" fill="#38bdf8" />
          <circle cx="68" cy="58" r="5" fill="#fff" />
          <circle cx="76" cy="60" r="4" fill="#fff" />
        </g>
      ),
    }),
  brush: (t) => kid({ shirt: '#f43f5e', tone: t, prop: <g transform="translate(52 22) scale(0.3)">{ICONS.toothbrush!('#3b82f6')}</g> }),
  draw: (t) =>
    kid({
      shirt: '#8b5cf6',
      tone: t,
      prop: (
        <g>
          <rect x="60" y="36" width="34" height="30" rx="2" fill="#fff" />
          <circle cx="72" cy="48" r="5" fill="#fde047" />
          <path d="M62 62 Q72 52 80 60 Q86 54 92 62" fill="#86efac" />
        </g>
      ),
    }),
  cycle: () => (
    <g>
      {ICONS.bicycle!('#ef4444')}
      <circle cx="50" cy="14" r="8" fill={skin[1]} />
      <path d="M50 22 L46 40 L52 52 M48 28 L66 32" fill="none" strokeWidth={5} stroke="#0ea5e9" />
    </g>
  ),
  wave: (t) => kid({ pose: 'stand', shirt: '#f59e0b', tone: t, prop: <path d="M74 20 Q80 14 84 22 M78 30 Q86 26 88 34" fill="none" strokeWidth={2} /> }),
  kite: (t) => kid({ pose: 'arms-up', shirt: '#22c55e', tone: t, prop: <g transform="translate(64 -4) scale(0.36)">{ICONS.kite!('#ef4444')}</g> }),
  sweep: (t) =>
    kid({
      shirt: '#64748b',
      tone: t,
      hijab: true,
      prop: (
        <g>
          <path d="M66 40 L76 82" strokeWidth={4} stroke="#a16207" />
          <path d="M68 82 L86 82 L90 94 L64 94 Z" fill="#facc15" />
        </g>
      ),
    }),
  plant: (t) =>
    kid({
      shirt: '#84cc16',
      tone: t,
      prop: (
        <g>
          <path d="M66 74 L90 74 L86 94 L70 94 Z" fill="#c2410c" />
          <path d="M78 74 L78 58 M78 64 Q70 56 72 50 Q80 54 78 64 M78 60 Q86 52 88 56 Q84 62 78 60" fill="#22c55e" />
        </g>
      ),
    }),
  dance: (t) => kid({ pose: 'arms-up', shirt: '#f472b6', tone: t }),
  sit: (t) => kid({ pose: 'sit', shirt: '#0ea5e9', tone: t }),
  stand: (t) => kid({ pose: 'stand', shirt: '#f97316', tone: t }),
  climb: (t) => (
    <g>
      <path d="M30 4 L30 96 M70 4 L70 96 M30 20 L70 20 M30 40 L70 40 M30 60 L70 60 M30 80 L70 80" strokeWidth={4} stroke="#a16207" />
      <g transform="translate(0 4)">{kid({ pose: 'arms-up', shirt: '#ef4444', tone: t })}</g>
    </g>
  ),
};

const PEOPLE: Record<string, () => ReactElement> = {
  teacher: () => kid({ shirt: '#6366f1', tone: 1, hijab: true, hair: '#db2777', prop: <rect x="68" y="44" width="22" height="16" rx="2" fill="#22c55e" /> }),
  doctor: () =>
    kid({
      shirt: '#f8fafc',
      tone: 2,
      prop: <path d="M42 46 Q40 62 50 62 Q60 62 58 46" fill="none" strokeWidth={2.5} stroke="#0ea5e9" />,
    }),
  farmer: () =>
    kid({
      shirt: '#65a30d',
      tone: 3,
      prop: (
        <g>
          <ellipse cx="50" cy="16" rx="22" ry="5" fill="#facc15" />
          <path d="M38 16 Q40 6 50 6 Q60 6 62 16 Z" fill="#facc15" />
        </g>
      ),
    }),
  chef: () =>
    kid({
      shirt: '#f8fafc',
      tone: 0,
      prop: (
        <g>
          <path d="M38 18 Q30 4 42 6 Q48 -2 56 6 Q70 4 62 18 Z" fill="#fff" />
        </g>
      ),
    }),
  firefighter: () =>
    kid({
      shirt: '#dc2626',
      tone: 2,
      prop: <path d="M34 20 Q36 8 50 8 Q64 8 66 20 L72 22 L28 22 Z" fill="#facc15" />,
    }),
  postman: () =>
    kid({
      shirt: '#2563eb',
      tone: 1,
      prop: <rect x="62" y="50" width="22" height="16" rx="2" fill="#fff" />,
    }),
};

export interface ParsedPicture {
  name: string;
  variant: string | null;
  count: number;
}

export function parsePicture(key: string): ParsedPicture {
  const [main, countStr] = key.split('*');
  const [name, variant] = (main ?? '').split(':');
  return { name: name ?? '', variant: variant ?? null, count: countStr ? Number(countStr) : 1 };
}

const DEFAULT_COLOUR: Record<string, string> = {
  elephant: '#a5b4cf', giraffe: '#fbbf24', cat: '#fb923c', dog: '#d6a46a', bird: '#38bdf8', fish: '#fb923c',
  rabbit: '#f1f5f9', tiger: '#fb923c', monkey: '#a16207', turtle: '#16a34a', cow: '#f8fafc', chicken: '#f8fafc',
  duck: '#fde047', butterfly: '#a855f7', frog: '#4ade80', snake: '#22c55e', hornbill: '#334155', apple: '#ef4444',
  banana: '#fde047', orange: '#fb923c', icecream: '#f9a8d4', cup: '#f8fafc', bag: '#3b82f6', book: '#22c55e',
  pencil: '#facc15', ruler: '#38bdf8', eraser: '#f472b6', chair: '#f97316', table: '#a16207', ball: '#ef4444',
  hat: '#8b5cf6', umbrella: '#ec4899', shoe: '#3b82f6', shirt: '#22c55e', bed: '#60a5fa', box: '#d6a46a',
  kite: '#f97316', bicycle: '#ef4444', car: '#ef4444', bus: '#facc15', boat: '#f97316', clock: '#38bdf8',
  key: '#facc15', toothbrush: '#22c55e', spoon: '#9ca3af', plate: '#38bdf8', racket: '#ef4444', basket: '#d97706',
  tree: '#22c55e', flower: '#f472b6', star: '#facc15', house: '#fde68a',
};

/** True when a picture key can be rendered. Used by the content validator. */
export function pictureExists(key: string): boolean {
  const { name, variant, count } = parsePicture(key);
  if (!Number.isInteger(count) || count < 1 || count > 10) return false;
  if (name === 'face') return variant !== null && ['happy', 'sad', 'angry', 'tired', 'scared', 'surprised'].includes(variant);
  if (name === 'act') return variant !== null && variant in ACTIONS;
  if (name === 'person') return variant !== null && variant in PEOPLE;
  if (name === 'swatch') return variant !== null && variant in COLOURS;
  if (!(name in ICONS)) return false;
  return variant === null || variant in COLOURS;
}

/** Render a single picture key's SVG contents (100×100 coordinate space). */
export function renderPictureContent(key: string, tone = 0): ReactElement | null {
  const { name, variant } = parsePicture(key);
  let el: ReactElement | null = null;
  if (name === 'face' && variant) el = face(variant);
  else if (name === 'act' && variant && ACTIONS[variant]) el = ACTIONS[variant]!(tone);
  else if (name === 'person' && variant && PEOPLE[variant]) el = PEOPLE[variant]!();
  else if (name === 'swatch' && variant) {
    const col = COLOURS[variant as ColourName] ?? '#ccc';
    el = <path d="M20 40 Q14 16 40 18 Q58 6 76 20 Q94 30 86 54 Q90 80 64 84 Q40 94 24 78 Q8 62 20 40 Z" fill={col} />;
  } else {
    const draw = ICONS[name];
    if (draw) {
      const colour = variant ? COLOURS[variant as ColourName] : DEFAULT_COLOUR[name] ?? '#94a3b8';
      el = draw(colour ?? '#94a3b8');
    }
  }
  if (!el) return null;
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      {el}
    </g>
  );
}
