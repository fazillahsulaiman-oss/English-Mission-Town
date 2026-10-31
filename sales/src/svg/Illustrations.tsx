// Original illustrations and icons in a soft 3D style: rounded shapes, gentle gradients,
// highlights and soft shadows. All gradient ids are unique per instance.
import type { ReactNode } from 'react';
import { useSvgId } from './kit';

const INK = '#24324a';

function Grad({ id, from, to, angle = 'v' }: { id: string; from: string; to: string; angle?: 'v' | 'd' }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={angle === 'd' ? 1 : 0} y2="1">
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

function Shadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1d3557" floodOpacity="0.16" />
    </filter>
  );
}

/** Problem 1: a child at a desk, book open, pencil left aside. */
export function DeskIllustration() {
  const id = useSvgId('desk');
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label="Kanak-kanak di meja dengan buku terbuka dan pensel terbiar">
      <defs>
        <Grad id={`${id}-bg`} from="#e7f6f4" to="#fdf6e9" />
        <Grad id={`${id}-desk`} from="#f6c27a" to="#d98f45" />
        <Grad id={`${id}-shirt`} from="#7cc6f2" to="#3d8fd0" />
        <Grad id={`${id}-skin`} from="#e9b98d" to="#c98b5e" />
        <Grad id={`${id}-page`} from="#ffffff" to="#eef1f6" />
        <Grad id={`${id}-pencil`} from="#ffe27a" to="#f5b52e" angle="d" />
        <Shadow id={`${id}-sh`} />
      </defs>
      <rect width="320" height="220" rx="28" fill={`url(#${id}-bg)`} />
      <circle cx="262" cy="52" r="26" fill="#fff3c4" />
      <g filter={`url(#${id}-sh)`}>
        <path d="M118 150 Q118 104 160 102 Q202 104 202 150 Z" fill={`url(#${id}-shirt)`} />
        <circle cx="160" cy="78" r="30" fill={`url(#${id}-skin)`} />
        <path d="M130 74 Q132 44 160 44 Q190 44 191 72 Q178 58 158 60 Q142 62 130 74 Z" fill="#3a2a22" />
        <ellipse cx="148" cy="84" rx="3" ry="2.2" fill={INK} />
        <ellipse cx="172" cy="84" rx="3" ry="2.2" fill={INK} />
        <path d="M152 98 Q160 95 168 98" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M196 132 Q214 116 200 100" fill="none" stroke={`url(#${id}-skin)`} strokeWidth="14" strokeLinecap="round" />
      </g>
      <rect x="30" y="148" width="260" height="22" rx="11" fill={`url(#${id}-desk)`} filter={`url(#${id}-sh)`} />
      <rect x="54" y="168" width="14" height="40" rx="6" fill="#c97f3b" />
      <rect x="252" y="168" width="14" height="40" rx="6" fill="#c97f3b" />
      <g filter={`url(#${id}-sh)`}>
        <path d="M104 146 Q132 132 160 142 Q188 132 216 146 L216 150 L104 150 Z" fill={`url(#${id}-page)`} />
        <path d="M160 142 L160 150" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M118 141 L146 137 M176 137 L204 141" stroke="#b6c2d4" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="rotate(-8 252 140)">
        <rect x="226" y="136" width="52" height="8" rx="4" fill={`url(#${id}-pencil)`} />
        <path d="M278 136 L290 140 L278 144 Z" fill="#f3d6b0" />
        <rect x="222" y="136" width="7" height="8" rx="2" fill="#f49ab1" />
      </g>
      <g opacity="0.65">
        <circle cx="210" cy="56" r="4" fill="#b7c4d8" />
        <circle cx="222" cy="42" r="6" fill="#b7c4d8" />
        <circle cx="240" cy="26" r="9" fill="#b7c4d8" />
      </g>
    </svg>
  );
}

/** Problem 2: floating word blocks that are not yet in order. */
export function WordBlocksIllustration() {
  const id = useSvgId('blocks');
  const blocks = [
    { t: 'play', x: 36, y: 46, r: -10, c: ['#ffd36e', '#f5a524'] },
    { t: 'I', x: 196, y: 30, r: 8, c: ['#9be7dc', '#2bb3a3'] },
    { t: 'ball', x: 150, y: 112, r: -4, c: ['#ffb4a9', '#f06b5b'] },
    { t: 'the', x: 46, y: 132, r: 6, c: ['#c9b8ff', '#8b6cf6'] },
    { t: '.', x: 246, y: 120, r: 12, c: ['#a9d8ff', '#4a9ae8'] },
  ];
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label="Blok perkataan play, I, ball, the dan noktah yang belum tersusun">
      <defs>
        <Grad id={`${id}-bg`} from="#f3efff" to="#fdf6e9" />
        {blocks.map((b, i) => (
          <Grad key={i} id={`${id}-b${i}`} from={b.c[0]!} to={b.c[1]!} />
        ))}
        <Shadow id={`${id}-sh`} />
      </defs>
      <rect width="320" height="220" rx="28" fill={`url(#${id}-bg)`} />
      {blocks.map((b, i) => {
        const w = Math.max(48, b.t.length * 18 + 28);
        return (
          <g key={i} className="float-soft" style={{ animationDelay: `${i * 0.4}s` }}>
            <g transform={`rotate(${b.r} ${b.x + w / 2} ${b.y + 24})`} filter={`url(#${id}-sh)`}>
              <rect x={b.x} y={b.y} width={w} height="48" rx="14" fill={`url(#${id}-b${i})`} />
              <rect x={b.x + 4} y={b.y + 4} width={w - 8} height="16" rx="8" fill="#ffffff" opacity="0.35" />
              <text x={b.x + w / 2} y={b.y + 32} textAnchor="middle" fontFamily="'Nunito', system-ui, sans-serif" fontWeight={800} fontSize="20" fill={INK}>
                {b.t}
              </text>
            </g>
          </g>
        );
      })}
      <g fill="none" stroke="#8b6cf6" strokeWidth="3" strokeLinecap="round" opacity="0.55">
        <path d="M128 36 Q140 20 152 34 Q156 44 144 50 L144 58" />
        <circle cx="144" cy="68" r="2" fill="#8b6cf6" />
      </g>
    </svg>
  );
}

/** Problem 3: a parent looking at a tablet and a progress card. */
export function ParentIllustration() {
  const id = useSvgId('parent');
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label="Ibu melihat tablet dan kad kemajuan anak">
      <defs>
        <Grad id={`${id}-bg`} from="#e8f4ff" to="#fdf6e9" />
        <Grad id={`${id}-top`} from="#ffb4a9" to="#e8705f" />
        <Grad id={`${id}-scarf`} from="#9be7dc" to="#1fa293" />
        <Grad id={`${id}-skin`} from="#e7b48a" to="#c38458" />
        <Grad id={`${id}-tab`} from="#4b5568" to="#252b38" angle="d" />
        <Grad id={`${id}-card`} from="#ffffff" to="#f1f5fb" />
        <Shadow id={`${id}-sh`} />
      </defs>
      <rect width="320" height="220" rx="28" fill={`url(#${id}-bg)`} />
      <g filter={`url(#${id}-sh)`}>
        <path d="M44 220 Q46 150 102 146 Q158 150 160 220 Z" fill={`url(#${id}-top)`} />
        <path d="M70 108 Q66 58 102 54 Q138 58 134 108 L140 150 Q102 136 64 150 Z" fill={`url(#${id}-scarf)`} />
        <ellipse cx="102" cy="100" rx="25" ry="28" fill={`url(#${id}-skin)`} />
        <ellipse cx="93" cy="98" rx="2.8" ry="2.2" fill={INK} />
        <ellipse cx="113" cy="98" rx="2.8" ry="2.2" fill={INK} />
        <path d="M94 112 Q102 117 110 112" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g filter={`url(#${id}-sh)`} transform="rotate(-6 150 150)">
        <rect x="118" y="120" width="92" height="70" rx="10" fill={`url(#${id}-tab)`} />
        <rect x="124" y="126" width="80" height="58" rx="6" fill="#dff4fd" />
        <path d="M134 168 L134 150 M148 168 L148 140 M162 168 L162 156 M176 168 L176 134 M190 168 L190 146" stroke="#2bb3a3" strokeWidth="7" strokeLinecap="round" />
      </g>
      <path d="M150 190 Q140 178 128 186" fill="none" stroke={`url(#${id}-skin)`} strokeWidth="12" strokeLinecap="round" />
      <g filter={`url(#${id}-sh)`} className="float-soft">
        <rect x="214" y="40" width="88" height="108" rx="16" fill={`url(#${id}-card)`} />
        <rect x="226" y="54" width="44" height="7" rx="3.5" fill="#24324a" opacity="0.8" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="226" y={72 + i * 22} width="64" height="10" rx="5" fill="#e6ebf3" />
            <rect x="226" y={72 + i * 22} width={[52, 38, 60][i]} height="10" rx="5" fill={['#2bb3a3', '#ffc93c', '#8b6cf6'][i]} />
          </g>
        ))}
        <path d="M252 140 L257 130 L262 140 L272 141 L264 148 L267 158" fill="none" />
      </g>
    </svg>
  );
}

// ---------------- Icons ----------------

type IconName = 'years' | 'wordhelp' | 'pace' | 'six' | 'activities' | 'places' | 'timer' | 'rewards' | 'score' | 'missions' | 'stars' | 'check' | 'try' | 'hint' | 'understand' | 'continue' | 'sticker' | 'card' | 'album' | 'celebrate';

const ICON_COLOURS: Record<IconName, [string, string]> = {
  years: ['#7fe0d3', '#169c8d'],
  wordhelp: ['#c9b8ff', '#7b5cf0'],
  pace: ['#ffd36e', '#f0a020'],
  six: ['#7fe0d3', '#169c8d'],
  activities: ['#ffb4a9', '#ea6250'],
  places: ['#ffd36e', '#f0a020'],
  timer: ['#a9d8ff', '#3d8fe0'],
  rewards: ['#ffd36e', '#f0a020'],
  score: ['#c9b8ff', '#7b5cf0'],
  missions: ['#7fe0d3', '#169c8d'],
  stars: ['#ffd36e', '#f0a020'],
  check: ['#9ee6a8', '#2fa84f'],
  try: ['#ffb4a9', '#ea6250'],
  hint: ['#c9b8ff', '#7b5cf0'],
  understand: ['#a9d8ff', '#3d8fe0'],
  continue: ['#7fe0d3', '#169c8d'],
  sticker: ['#ffb4d6', '#e5539a'],
  card: ['#a9d8ff', '#3d8fe0'],
  album: ['#ffb4d6', '#e5539a'],
  celebrate: ['#ffd36e', '#f0a020'],
};

function glyph(name: IconName): ReactNode {
  const w = '#ffffff';
  const s = { fill: 'none', stroke: w, strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'years':
      return (
        <g {...s}>
          <rect x="15" y="17" width="26" height="24" rx="5" />
          <path d="M15 25 H41 M22 13 V20 M34 13 V20" />
          <path d="M23 33 H33" />
        </g>
      );
    case 'wordhelp':
      return (
        <g {...s}>
          <path d="M14 18 Q14 14 18 14 H38 Q42 14 42 18 V32 Q42 36 38 36 H26 L19 42 V36 H18 Q14 36 14 32 Z" />
          <path d="M24 22 Q24 18 28 18 Q32 18 32 22 Q32 25 28 26 V28" />
          <circle cx="28" cy="32" r="0.6" fill={w} />
        </g>
      );
    case 'pace':
    case 'timer':
      return (
        <g {...s}>
          <circle cx="28" cy="30" r="12" />
          <path d="M28 23 V30 L33 33 M24 14 H32" />
        </g>
      );
    case 'six':
      return (
        <g fill={w}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={15 + (i % 3) * 9.5} y={18 + Math.floor(i / 3) * 10} width="7" height="7" rx="2" />
          ))}
        </g>
      );
    case 'activities':
      return (
        <g {...s}>
          <path d="M16 20 H26 Q26 15 30 15 Q34 15 34 20 H40 V30 Q45 30 45 34 Q45 38 40 38 V42 H16 Z" />
        </g>
      );
    case 'places':
      return (
        <g {...s}>
          <path d="M14 26 L18 16 H38 L42 26 Z M16 26 V41 H40 V26 M24 41 V32 H32 V41" />
        </g>
      );
    case 'rewards':
    case 'stars':
      return <path d="M28 13 L32.3 22 L42 23.3 L35 30 L36.8 39.6 L28 35 L19.2 39.6 L21 30 L14 23.3 L23.7 22 Z" fill={w} />;
    case 'score':
    case 'card':
      return (
        <g {...s}>
          <rect x="15" y="14" width="26" height="28" rx="5" />
          <path d="M21 34 V29 M28 34 V24 M35 34 V27" />
        </g>
      );
    case 'missions':
      return (
        <g {...s}>
          <path d="M18 42 V14 M18 15 H38 L34 21 L38 27 H18" />
        </g>
      );
    case 'check':
      return <path d="M17 29 L25 37 L40 20" fill="none" stroke={w} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />;
    case 'try':
      return (
        <g {...s}>
          <path d="M18 30 A10 10 0 1 0 22 21" />
          <path d="M17 17 L22 21 L18 26" />
        </g>
      );
    case 'hint':
      return (
        <g {...s}>
          <path d="M22 32 Q16 27 18 20 Q21 13 28 13 Q35 13 38 20 Q40 27 34 32 V36 H22 Z M24 41 H32" />
        </g>
      );
    case 'understand':
      return (
        <g {...s}>
          <circle cx="28" cy="28" r="13" />
          <path d="M22 26 Q23 24 25 26 M31 26 Q33 24 34 26 M22 32 Q28 37 34 32" />
        </g>
      );
    case 'continue':
      return <path d="M16 28 H38 M30 20 L38 28 L30 36" fill="none" stroke={w} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />;
    case 'sticker':
    case 'album':
      return (
        <g {...s}>
          <path d="M16 18 Q16 14 20 14 H38 Q42 14 42 18 V30 L30 42 H20 Q16 42 16 38 Z M42 30 H34 Q30 30 30 34 V42" />
        </g>
      );
    case 'celebrate':
      return (
        <g {...s}>
          <path d="M15 42 L23 22 L35 34 Z M30 16 Q32 12 36 14 M38 22 Q42 20 43 24 M33 26 L40 19" />
        </g>
      );
  }
}

export function FluentIcon({ name, size = 56, label }: { name: IconName; size?: number; label?: string }) {
  const id = useSvgId(`ic-${name}`);
  const [a, b] = ICON_COLOURS[name];
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false" className="fluent-icon">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <filter id={`${id}-s`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor={b} floodOpacity="0.35" />
        </filter>
      </defs>
      <rect x="4" y="4" width="48" height="48" rx="16" fill={`url(#${id}-g)`} filter={`url(#${id}-s)`} />
      <rect x="9" y="7" width="38" height="14" rx="7" fill="#ffffff" opacity="0.28" />
      {glyph(name)}
    </svg>
  );
}

/** Animated pointer hand (decorative). */
export function PointerHand() {
  const id = useSvgId('hand');
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe1c4" />
          <stop offset="1" stopColor="#e9a876" />
        </linearGradient>
        <filter id={`${id}-s`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1d3557" floodOpacity="0.3" />
        </filter>
      </defs>
      <path
        d="M22 8 Q22 3 27 3 Q32 3 32 8 V26 L34 25 Q38 23 40 27 L41 28 Q45 25 48 29 L49 31 Q53 29 55 34 V44 Q55 58 41 60 H33 Q25 60 20 52 L10 37 Q8 33 12 31 Q15 29 18 32 L22 37 Z"
        fill={`url(#${id}-g)`}
        stroke="#7a4b2a"
        strokeWidth="2.2"
        strokeLinejoin="round"
        filter={`url(#${id}-s)`}
      />
      <path d="M24 10 Q25 6 28 7" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export type { IconName };
