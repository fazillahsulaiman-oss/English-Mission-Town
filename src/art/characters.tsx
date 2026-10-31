// Original characters: Kiko the mouse-deer (mascot) and the children avatars.
import { motion } from 'motion/react';

const INK = '#2f2f48';

export type MascotMood = 'happy' | 'cheer' | 'think' | 'encourage' | 'wave';

/** Kiko the mouse-deer: the town guide. */
export function Mascot({ mood = 'happy', size = 120, animate = true, className }: { mood?: MascotMood; size?: number; animate?: boolean; className?: string }) {
  const bounce = animate
    ? mood === 'cheer'
      ? { y: [0, -18, 0, -10, 0], rotate: [0, -6, 6, -3, 0] }
      : mood === 'encourage'
        ? { rotate: [0, -4, 4, 0] }
        : { y: [0, -4, 0] }
    : undefined;
  const transition = mood === 'cheer' ? { duration: 1.1, ease: 'easeOut' as const } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const };
  const eyes =
    mood === 'cheer' ? (
      <>
        <path d="M66 58 Q71 52 76 58" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M86 58 Q91 52 96 58" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      </>
    ) : mood === 'think' ? (
      <>
        <circle cx="72" cy="56" r="4.5" fill={INK} />
        <circle cx="91" cy="56" r="4.5" fill={INK} />
        <circle cx="73.5" cy="54" r="1.6" fill="#fff" />
        <circle cx="92.5" cy="54" r="1.6" fill="#fff" />
        <path d="M66 46 L77 48" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="72" cy="57" r="5" fill={INK} />
        <circle cx="91" cy="57" r="5" fill={INK} />
        <circle cx="73.8" cy="55" r="1.8" fill="#fff" />
        <circle cx="92.8" cy="55" r="1.8" fill="#fff" />
      </>
    );
  const mouth =
    mood === 'cheer' ? (
      <path d="M74 70 Q82 82 90 70 Z" fill="#be123c" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    ) : mood === 'think' ? (
      <path d="M77 73 Q82 71 87 73" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    ) : mood === 'encourage' ? (
      <path d="M76 71 Q82 76 88 71" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    ) : (
      <path d="M75 70 Q82 78 89 70" fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
    );
  const armUp = mood === 'cheer' || mood === 'wave';
  return (
    <motion.svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      animate={bounce}
      transition={transition}
      style={{ overflow: 'visible' }}
    >
      <ellipse cx="80" cy="150" rx="40" ry="6" fill="#000" opacity={0.1} />
      {/* tail and body */}
      <path d="M40 104 Q26 96 30 86" fill="none" stroke="#a0673b" strokeWidth={8} strokeLinecap="round" />
      <ellipse cx="62" cy="112" rx="30" ry="22" fill="#c48a55" stroke={INK} strokeWidth={3} />
      <ellipse cx="66" cy="118" rx="16" ry="11" fill="#f5deb8" />
      {/* legs */}
      <path d="M48 128 L46 146 M60 130 L60 147 M74 130 L76 147 M84 124 L90 144" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M48 128 L46 146 M60 130 L60 147 M74 130 L76 147 M84 124 L90 144" stroke="#a0673b" strokeWidth={3} strokeLinecap="round" />
      {/* explorer scarf */}
      <path d="M62 86 Q82 98 104 84 L106 94 Q84 108 60 96 Z" fill="#14b8a6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M96 92 L108 112 L98 112 L92 98 Z" fill="#0d9488" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      {/* arm */}
      {armUp ? (
        <motion.path
          d="M98 98 Q114 86 118 68"
          fill="none"
          stroke="#a0673b"
          strokeWidth={7}
          strokeLinecap="round"
          animate={animate && mood === 'wave' ? { rotate: [0, 14, 0, 14, 0] } : undefined}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ originX: '98px', originY: '98px' }}
        />
      ) : (
        <path d="M96 100 Q106 112 100 124" fill="none" stroke="#a0673b" strokeWidth={7} strokeLinecap="round" />
      )}
      {/* head */}
      <ellipse cx="60" cy="38" rx="9" ry="12" transform="rotate(-25 60 38)" fill="#c48a55" stroke={INK} strokeWidth={3} />
      <ellipse cx="102" cy="38" rx="9" ry="12" transform="rotate(25 102 38)" fill="#c48a55" stroke={INK} strokeWidth={3} />
      <ellipse cx="60" cy="39" rx="4.5" ry="7" transform="rotate(-25 60 39)" fill="#f9a8d4" />
      <ellipse cx="102" cy="39" rx="4.5" ry="7" transform="rotate(25 102 39)" fill="#f9a8d4" />
      <ellipse cx="81" cy="62" rx="28" ry="26" fill="#c48a55" stroke={INK} strokeWidth={3} />
      <ellipse cx="82" cy="72" rx="16" ry="11" fill="#f5deb8" />
      <ellipse cx="82" cy="65" rx="5" ry="3.5" fill={INK} />
      {eyes}
      {mouth}
      <circle cx="63" cy="68" r="4.5" fill="#fb7185" opacity={0.5} />
      <circle cx="100" cy="68" r="4.5" fill="#fb7185" opacity={0.5} />
      {mood === 'think' && (
        <g>
          <circle cx="126" cy="30" r="4" fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx="136" cy="18" r="6" fill="#fff" stroke={INK} strokeWidth={2} />
        </g>
      )}
    </motion.svg>
  );
}

export interface AvatarDef {
  id: string;
  label: string;
  skin: string;
  hair: string;
  style: 'short' | 'long' | 'bun' | 'hijab' | 'curly' | 'ponytail' | 'spiky' | 'braids';
  shirt: string;
  bg: string;
  glasses?: boolean;
}

// Varied, inclusive Malaysian children. Labels describe the picture, not ethnicity.
export const AVATARS: AvatarDef[] = [
  { id: 'a1', label: 'Child with a pink headscarf', skin: '#d9a273', hair: '#ec4899', style: 'hijab', shirt: '#f9a8d4', bg: '#fce7f3' },
  { id: 'a2', label: 'Child with short black hair', skin: '#f1c9a5', hair: '#1f1a17', style: 'short', shirt: '#38bdf8', bg: '#e0f2fe' },
  { id: 'a3', label: 'Child with curly hair and glasses', skin: '#7b4a2a', hair: '#1f1a17', style: 'curly', shirt: '#facc15', bg: '#fef9c3', glasses: true },
  { id: 'a4', label: 'Child with long hair in a ponytail', skin: '#f1c9a5', hair: '#3b2416', style: 'ponytail', shirt: '#a78bfa', bg: '#ede9fe' },
  { id: 'a5', label: 'Child with spiky hair', skin: '#a86b43', hair: '#1f1a17', style: 'spiky', shirt: '#4ade80', bg: '#dcfce7' },
  { id: 'a6', label: 'Child with braids', skin: '#a86b43', hair: '#2a1d14', style: 'braids', shirt: '#fb923c', bg: '#ffedd5' },
  { id: 'a7', label: 'Child with a teal headscarf', skin: '#f1c9a5', hair: '#14b8a6', style: 'hijab', shirt: '#5eead4', bg: '#ccfbf1' },
  { id: 'a8', label: 'Child with a hair bun', skin: '#d9a273', hair: '#1f1a17', style: 'bun', shirt: '#f87171', bg: '#fee2e2', glasses: true },
];

export const AVATAR_BY_ID: Record<string, AvatarDef> = Object.fromEntries(AVATARS.map((a) => [a.id, a]));

export function Avatar({ avatarId, size = 64, className }: { avatarId: string; size?: number; className?: string }) {
  const a = AVATAR_BY_ID[avatarId] ?? AVATARS[0]!;
  const hairBack: Record<AvatarDef['style'], JSX.Element | null> = {
    short: null,
    spiky: null,
    curly: null,
    hijab: <path d="M22 62 Q18 22 50 20 Q82 22 78 62 L84 92 L16 92 Z" fill={a.hair} />,
    long: <path d="M24 50 Q22 84 30 92 L70 92 Q78 84 76 50 Z" fill={a.hair} />,
    ponytail: <path d="M74 40 Q94 50 84 78 Q78 64 72 56 Z" fill={a.hair} />,
    bun: <circle cx="50" cy="18" r="11" fill={a.hair} />,
    braids: (
      <>
        <path d="M26 50 Q20 72 26 86" stroke={a.hair} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M74 50 Q80 72 74 86" stroke={a.hair} strokeWidth={9} fill="none" strokeLinecap="round" />
      </>
    ),
  };
  const hairFront: Record<AvatarDef['style'], JSX.Element | null> = {
    short: <path d="M28 46 Q28 22 50 22 Q74 22 72 46 Q64 34 50 34 Q36 34 28 46 Z" fill={a.hair} />,
    spiky: <path d="M28 46 L30 28 L38 34 L42 20 L50 30 L58 18 L62 32 L70 26 L72 46 Q62 36 50 36 Q38 36 28 46 Z" fill={a.hair} />,
    curly: (
      <g fill={a.hair}>
        {[30, 38, 46, 54, 62, 70].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 28 : 32} r="9" />
        ))}
      </g>
    ),
    hijab: <path d="M30 50 Q30 28 50 28 Q70 28 70 50 L72 46 Q72 24 50 24 Q28 24 28 46 Z" fill={a.hair} />,
    long: <path d="M28 48 Q28 22 50 22 Q72 22 72 48 Q66 32 50 32 Q34 32 28 48 Z" fill={a.hair} />,
    ponytail: <path d="M28 48 Q28 22 50 22 Q72 22 72 48 Q62 30 44 34 Q34 38 28 48 Z" fill={a.hair} />,
    bun: <path d="M28 48 Q28 24 50 24 Q72 24 72 48 Q64 32 50 32 Q36 32 28 48 Z" fill={a.hair} />,
    braids: <path d="M28 48 Q28 22 50 22 Q72 22 72 48 Q60 32 50 34 Q40 32 28 48 Z" fill={a.hair} />,
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label={a.label}>
      <circle cx="50" cy="50" r="48" fill={a.bg} stroke="#fff" strokeWidth={4} />
      <clipPath id={`av-${a.id}`}>
        <circle cx="50" cy="50" r="46" />
      </clipPath>
      <g clipPath={`url(#av-${a.id})`} stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
        {hairBack[a.style]}
        <path d="M18 100 Q20 76 50 74 Q80 76 82 100 Z" fill={a.shirt} />
        <rect x="44" y="62" width="12" height="14" fill={a.skin} stroke="none" />
        <ellipse cx="50" cy="50" rx="22" ry="24" fill={a.skin} />
        {hairFront[a.style]}
        <circle cx="42" cy="52" r="3" fill={INK} stroke="none" />
        <circle cx="58" cy="52" r="3" fill={INK} stroke="none" />
        {a.glasses && (
          <g fill="none" strokeWidth={2}>
            <circle cx="42" cy="52" r="7" />
            <circle cx="58" cy="52" r="7" />
            <path d="M49 52 L51 52" />
          </g>
        )}
        <path d="M43 62 Q50 68 57 62" fill="none" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx="35" cy="60" r="3.5" fill="#fb7185" opacity={0.45} stroke="none" />
        <circle cx="65" cy="60" r="3.5" fill="#fb7185" opacity={0.45} stroke="none" />
      </g>
    </svg>
  );
}
