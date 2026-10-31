// Six original town destinations and sticker artwork.
import type { CategoryId } from '../engine/types';
import type { StickerDef } from '../content/stickers';

const INK = '#2f2f48';

function Park() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="92" ry="22" fill="#86efac" />
      <rect x="40" y="84" width="12" height="54" rx="4" fill="#a16207" />
      <circle cx="46" cy="70" r="30" fill="#22c55e" />
      <circle cx="28" cy="84" r="18" fill="#16a34a" />
      <circle cx="64" cy="86" r="18" fill="#16a34a" />
      <rect x="140" y="96" width="10" height="44" rx="3" fill="#a16207" />
      <circle cx="145" cy="86" r="22" fill="#4ade80" />
      {/* bench */}
      <rect x="80" y="118" width="48" height="8" rx="3" fill="#f97316" />
      <rect x="80" y="104" width="48" height="8" rx="3" fill="#fb923c" />
      <path d="M86 126 L86 140 M122 126 L122 140" strokeWidth={5} />
      {/* flowers */}
      {[[96, 146, '#f472b6'], [112, 150, '#facc15'], [164, 146, '#a855f7']].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={y as number} r="6" fill={c as string} />
      ))}
      {/* kite */}
      <path d="M160 18 L176 34 L160 52 L144 34 Z" fill="#ef4444" />
      <path d="M160 52 Q150 70 162 84" fill="none" strokeWidth={2} />
    </g>
  );
}

function Station() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="92" ry="20" fill="#bae6fd" />
      <rect x="30" y="66" width="140" height="78" rx="10" fill="#e0f2fe" />
      <path d="M20 70 Q100 18 180 70 Z" fill="#0ea5e9" />
      <circle cx="100" cy="50" r="14" fill="#fff" />
      <path d="M100 42 L100 50 L106 54" strokeWidth={3} fill="none" />
      <rect x="44" y="84" width="30" height="24" rx="4" fill="#7dd3fc" />
      <rect x="126" y="84" width="30" height="24" rx="4" fill="#7dd3fc" />
      <rect x="86" y="96" width="28" height="48" rx="4" fill="#0369a1" />
      {/* satellite dish + sound waves */}
      <path d="M150 34 Q170 30 172 48 Z" fill="#f8fafc" />
      <path d="M176 26 Q186 36 180 50 M184 20 Q198 36 188 56" fill="none" stroke="#0ea5e9" strokeWidth={3} />
      <path d="M30 144 L170 144" strokeWidth={4} />
    </g>
  );
}

function Clubhouse() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="92" ry="20" fill="#fed7aa" />
      <rect x="34" y="70" width="132" height="74" rx="6" fill="#fde68a" />
      <path d="M24 74 L100 24 L176 74 Z" fill="#f97316" />
      <rect x="64" y="40" width="72" height="18" rx="4" fill="#fff" />
      <text x="100" y="54" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} stroke="none">ABC</text>
      {[48, 136].map((x) => (
        <rect key={x} x={x} y="86" width="18" height="18" rx="3" fill="#bae6fd" />
      ))}
      <rect x="86" y="96" width="28" height="48" rx="4" fill="#c2410c" />
      {/* letter blocks */}
      <rect x="148" y="122" width="22" height="22" rx="3" fill="#22c55e" />
      <text x="159" y="139" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" stroke="none">A</text>
      <rect x="30" y="122" width="22" height="22" rx="3" fill="#3b82f6" />
      <text x="41" y="139" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" stroke="none">B</text>
    </g>
  );
}

function MysteryHouse() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="92" ry="20" fill="#ddd6fe" />
      <rect x="46" y="64" width="108" height="80" rx="6" fill="#c4b5fd" />
      <path d="M36 68 L100 20 L164 68 Z" fill="#7c3aed" />
      <rect x="120" y="22" width="14" height="30" fill="#6d28d9" />
      <circle cx="100" cy="50" r="10" fill="#fde047" />
      <text x="100" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} stroke="none">?</text>
      <rect x="58" y="82" width="22" height="22" rx="11" fill="#fef9c3" />
      <rect x="120" y="82" width="22" height="22" rx="11" fill="#fef9c3" />
      <path d="M86 144 L86 108 Q100 94 114 108 L114 144 Z" fill="#4c1d95" />
      {/* magnifying glass */}
      <circle cx="166" cy="116" r="12" fill="#e0f2fe" strokeWidth={4} />
      <path d="M174 126 L186 140" strokeWidth={6} />
      {/* stars */}
      <path d="M30 30 L33 38 L41 38 L35 43 L37 51 L30 46 L23 51 L25 43 L19 38 L27 38 Z" fill="#fde047" />
    </g>
  );
}

function CafeMarket() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="92" ry="20" fill="#fbcfe8" />
      <rect x="30" y="66" width="140" height="78" rx="6" fill="#fff1f2" />
      <path d="M22 66 L32 38 L168 38 L178 66 Z" fill="#ec4899" />
      {[40, 64, 88, 112, 136, 160].map((x) => (
        <path key={x} d={`M${x} 38 L${x - 4} 66`} stroke="#fff" strokeWidth={8} />
      ))}
      <path d="M22 66 Q36 76 50 66 Q64 76 78 66 Q92 76 106 66 Q120 76 134 66 Q148 76 162 66 Q170 72 178 66" fill="#ec4899" />
      <rect x="40" y="96" width="70" height="30" rx="4" fill="#fde68a" />
      <circle cx="54" cy="110" r="7" fill="#ef4444" />
      <circle cx="72" cy="110" r="7" fill="#facc15" />
      <circle cx="90" cy="110" r="7" fill="#22c55e" />
      {/* cup with steam */}
      <path d="M128 98 L156 98 L152 126 L132 126 Z" fill="#fff" />
      <path d="M156 104 Q166 106 162 116 Q158 120 154 118" fill="none" strokeWidth={3} />
      <path d="M136 92 Q132 84 138 78 M146 92 Q142 84 148 78" fill="none" stroke="#9ca3af" />
      <path d="M30 144 L170 144" strokeWidth={4} />
    </g>
  );
}

function Treehouse() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="92" ry="20" fill="#fef08a" />
      <rect x="88" y="70" width="24" height="76" rx="6" fill="#92400e" />
      <circle cx="100" cy="48" r="44" fill="#65a30d" />
      <circle cx="60" cy="62" r="26" fill="#4d7c0f" />
      <circle cx="142" cy="62" r="26" fill="#4d7c0f" />
      <rect x="66" y="58" width="68" height="40" rx="4" fill="#fbbf24" />
      <path d="M60 60 L100 34 L140 60 Z" fill="#dc2626" />
      <rect x="92" y="70" width="16" height="28" rx="2" fill="#7c2d12" />
      <rect x="72" y="68" width="14" height="12" rx="2" fill="#fef3c7" />
      {/* ladder */}
      <path d="M118 98 L126 146 M132 98 L140 146 M120 110 L134 110 M122 122 L136 122 M124 134 L138 134" strokeWidth={3.5} />
      {/* open book */}
      <path d="M40 132 Q52 124 64 132 Q76 124 88 132 L88 146 Q76 140 64 146 Q52 140 40 146 Z" fill="#fff" />
      <path d="M64 132 L64 146" strokeWidth={2} />
    </g>
  );
}

const BUILDINGS: Record<CategoryId, () => JSX.Element> = {
  'word-explorer': Park,
  'listen-discover': Station,
  'sentence-builder': Clubhouse,
  'grammar-quest': MysteryHouse,
  'everyday-english': CafeMarket,
  'story-adventure': Treehouse,
};

export function Building({ categoryId, className }: { categoryId: CategoryId; className?: string }) {
  const B = BUILDINGS[categoryId];
  return (
    <svg viewBox="0 0 200 170" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
        <B />
      </g>
    </svg>
  );
}

// ---------- Stickers ----------

function animalHead(def: StickerDef) {
  const b = def.colours.body;
  const eyes = (
    <>
      <circle cx="40" cy="54" r="4" fill={INK} stroke="none" />
      <circle cx="60" cy="54" r="4" fill={INK} stroke="none" />
      <circle cx="41.5" cy="52.5" r="1.4" fill="#fff" stroke="none" />
      <circle cx="61.5" cy="52.5" r="1.4" fill="#fff" stroke="none" />
    </>
  );
  const smile = <path d="M44 66 Q50 71 56 66" fill="none" strokeWidth={2.5} />;
  const cheeks = (
    <>
      <circle cx="32" cy="64" r="4" fill="#fb7185" opacity={0.5} stroke="none" />
      <circle cx="68" cy="64" r="4" fill="#fb7185" opacity={0.5} stroke="none" />
    </>
  );
  switch (def.animal) {
    case 'cat':
      return (
        <g>
          <path d="M26 44 L28 20 L44 34 Z M74 44 L72 20 L56 34 Z" fill={b} />
          <circle cx="50" cy="56" r="25" fill={b} />
          {eyes}
          <path d="M47 61 L50 63 L53 61" fill="#f472b6" />
          {smile}
          {cheeks}
        </g>
      );
    case 'tiger':
      return (
        <g>
          <circle cx="30" cy="34" r="8" fill={b} />
          <circle cx="70" cy="34" r="8" fill={b} />
          <circle cx="50" cy="56" r="26" fill={b} />
          <ellipse cx="50" cy="66" rx="13" ry="9" fill="#fff7ed" />
          <path d="M50 30 L50 40 M40 32 L43 41 M60 32 L57 41 M26 54 L34 56 M74 54 L66 56" strokeWidth={3.5} />
          {eyes}
          <path d="M47 62 L53 62 L50 65 Z" fill={INK} />
          {cheeks}
        </g>
      );
    case 'tapir':
      return (
        <g>
          <circle cx="32" cy="36" r="7" fill={b} />
          <circle cx="68" cy="36" r="7" fill={b} />
          <ellipse cx="50" cy="54" rx="25" ry="23" fill={b} />
          <path d="M30 62 Q50 80 70 62 Q66 76 50 78 Q34 76 30 62 Z" fill="#f8fafc" />
          <path d="M44 66 Q50 82 56 66" fill="#64748b" />
          <circle cx="40" cy="50" r="4" fill="#fff" stroke="none" />
          <circle cx="60" cy="50" r="4" fill="#fff" stroke="none" />
          <circle cx="40" cy="50" r="2" fill={INK} stroke="none" />
          <circle cx="60" cy="50" r="2" fill={INK} stroke="none" />
        </g>
      );
    case 'turtle':
      return (
        <g>
          <path d="M20 70 Q20 40 50 40 Q80 40 80 70 Z" fill={b} />
          <path d="M34 68 L40 52 L60 52 L66 68 M40 52 L50 42 L60 52" fill="none" strokeWidth={2} />
          <circle cx="50" cy="30" r="16" fill="#86efac" />
          <circle cx="44" cy="28" r="3" fill={INK} stroke="none" />
          <circle cx="56" cy="28" r="3" fill={INK} stroke="none" />
          <path d="M45 35 Q50 39 55 35" fill="none" strokeWidth={2} />
        </g>
      );
    case 'otter':
      return (
        <g>
          <circle cx="30" cy="38" r="6" fill={b} />
          <circle cx="70" cy="38" r="6" fill={b} />
          <circle cx="50" cy="56" r="25" fill={b} />
          <ellipse cx="50" cy="65" rx="15" ry="11" fill="#fde7c7" />
          {eyes}
          <ellipse cx="50" cy="61" rx="4" ry="3" fill={INK} />
          <path d="M36 64 L28 62 M36 67 L28 69 M64 64 L72 62 M64 67 L72 69" strokeWidth={1.5} />
        </g>
      );
    case 'hornbill':
      return (
        <g>
          <circle cx="46" cy="56" r="24" fill={b} />
          <path d="M62 50 Q90 50 94 66 Q80 62 64 64 Z" fill="#facc15" />
          <path d="M60 46 Q82 36 90 48 Q76 46 62 52 Z" fill="#ef4444" />
          <circle cx="48" cy="52" r="4" fill="#fff" stroke="none" />
          <circle cx="48" cy="52" r="2" fill={INK} stroke="none" />
          <path d="M34 66 Q46 74 56 66" fill="none" stroke="#fff" strokeWidth={3} />
        </g>
      );
    case 'elephant':
      return (
        <g>
          <ellipse cx="24" cy="54" rx="14" ry="18" fill="#cbd5e1" />
          <ellipse cx="76" cy="54" rx="14" ry="18" fill="#cbd5e1" />
          <circle cx="50" cy="52" r="23" fill={b} />
          <path d="M50 62 Q48 82 58 86" fill="none" stroke={INK} strokeWidth={11} />
          <path d="M50 62 Q48 82 58 86" fill="none" stroke={b} strokeWidth={7} />
          {eyes}
          {cheeks}
        </g>
      );
    case 'mousedeer':
      return (
        <g>
          <path d="M34 40 Q28 18 38 22 Q44 28 42 42 Z M66 40 Q72 18 62 22 Q56 28 58 42 Z" fill={b} />
          <ellipse cx="50" cy="56" rx="24" ry="22" fill={b} />
          <ellipse cx="50" cy="66" rx="13" ry="9" fill="#f5deb8" />
          <ellipse cx="50" cy="60" rx="4" ry="3" fill={INK} />
          {eyes}
          {cheeks}
        </g>
      );
    case 'orangutan':
      return (
        <g>
          <circle cx="50" cy="54" r="27" fill={b} />
          <path d="M30 56 Q30 40 42 42 Q50 46 58 42 Q70 40 70 56 Q70 76 50 76 Q30 76 30 56 Z" fill="#fdba74" />
          {eyes}
          <path d="M42 68 Q50 74 58 68" fill="none" strokeWidth={2.5} />
          <path d="M34 30 Q50 18 66 30" fill="none" stroke={b} strokeWidth={6} />
        </g>
      );
    case 'sunbear':
      return (
        <g>
          <circle cx="30" cy="34" r="8" fill={b} />
          <circle cx="70" cy="34" r="8" fill={b} />
          <circle cx="50" cy="54" r="25" fill={b} />
          <ellipse cx="50" cy="64" rx="13" ry="10" fill="#fcd34d" />
          <ellipse cx="50" cy="60" rx="4" ry="3" fill={INK} />
          <circle cx="40" cy="50" r="3.5" fill="#fff" stroke="none" />
          <circle cx="60" cy="50" r="3.5" fill="#fff" stroke="none" />
          <circle cx="40" cy="50" r="2" fill={INK} stroke="none" />
          <circle cx="60" cy="50" r="2" fill={INK} stroke="none" />
          <path d="M38 84 Q50 76 62 84" fill="#fcd34d" />
        </g>
      );
    case 'pangolin':
      return (
        <g>
          <path d="M18 70 Q18 34 50 32 Q82 34 82 70 Z" fill={b} />
          {[28, 40, 52, 64].map((x) => (
            <path key={x} d={`M${x} 52 Q${x + 6} 44 ${x + 12} 52`} fill="none" strokeWidth={2} />
          ))}
          {[34, 46, 58].map((x) => (
            <path key={x} d={`M${x} 62 Q${x + 6} 54 ${x + 12} 62`} fill="none" strokeWidth={2} />
          ))}
          <ellipse cx="78" cy="64" rx="12" ry="9" fill="#fcd9b6" />
          <circle cx="80" cy="61" r="2.4" fill={INK} stroke="none" />
        </g>
      );
    case 'owl':
      return (
        <g>
          <path d="M26 30 L36 40 M74 30 L64 40" strokeWidth={4} />
          <ellipse cx="50" cy="56" rx="26" ry="27" fill={b} />
          <circle cx="40" cy="50" r="10" fill="#fff" />
          <circle cx="60" cy="50" r="10" fill="#fff" />
          <circle cx="40" cy="50" r="4.5" fill={INK} stroke="none" />
          <circle cx="60" cy="50" r="4.5" fill={INK} stroke="none" />
          <path d="M46 60 L50 66 L54 60 Z" fill="#f59e0b" />
          <path d="M36 72 Q50 80 64 72" fill="none" stroke="#fde68a" strokeWidth={3} />
        </g>
      );
  }
}

function accessory(def: StickerDef) {
  switch (def.accessory) {
    case 'helmet':
      return <circle cx="50" cy="54" r="33" fill="#bae6fd" opacity={0.35} strokeWidth={3} />;
    case 'rainbow':
      return (
        <g fill="none" strokeWidth={0}>
          {['#ef4444', '#facc15', '#22c55e', '#3b82f6'].map((c, i) => (
            <path key={c} d={`M${14 + i * 5} 36 A${36 - i * 5} ${30 - i * 5} 0 0 1 ${86 - i * 5} 36`} stroke={c} strokeWidth={4} />
          ))}
        </g>
      );
    case 'cape':
      return <path d="M24 74 Q50 98 76 74 L84 92 Q50 104 16 92 Z" fill="#ef4444" />;
    case 'rocket':
      return (
        <g transform="translate(70 62) rotate(30)">
          <path d="M0 -14 Q8 -4 6 12 L-6 12 Q-8 -4 0 -14 Z" fill="#f8fafc" />
          <circle cx="0" cy="-2" r="3" fill="#38bdf8" />
          <path d="M-6 12 L0 22 L6 12 Z" fill="#f97316" />
        </g>
      );
    case 'magnifier':
      return (
        <g>
          <circle cx="74" cy="72" r="11" fill="#e0f2fe" opacity={0.8} strokeWidth={3.5} />
          <path d="M82 80 L92 92" strokeWidth={5} />
        </g>
      );
    case 'wizard':
      return (
        <g>
          <path d="M28 36 L50 0 L72 36 Z" fill="#6d28d9" />
          <path d="M22 36 L78 36" strokeWidth={6} stroke="#6d28d9" />
          <path d="M48 14 L50 18 L54 18 L51 21 L52 25 L48 22 L45 25 L46 21 L43 18 L47 18 Z" fill="#fde047" strokeWidth={1} />
        </g>
      );
    case 'crown':
      return <path d="M30 34 L34 16 L42 28 L50 12 L58 28 L66 16 L70 34 Z" fill="#facc15" />;
    case 'headphones':
      return (
        <g>
          <path d="M24 56 Q24 22 50 22 Q76 22 76 56" fill="none" strokeWidth={5} />
          <rect x="16" y="50" width="12" height="18" rx="5" fill="#0ea5e9" />
          <rect x="72" y="50" width="12" height="18" rx="5" fill="#0ea5e9" />
        </g>
      );
    case 'chef':
      return <path d="M32 34 Q22 16 36 16 Q42 6 50 14 Q58 6 64 16 Q78 16 68 34 Z" fill="#fff" />;
    case 'book':
      return (
        <g transform="translate(50 84)">
          <path d="M0 -6 Q-12 -12 -24 -8 L-24 8 Q-12 4 0 10 Z" fill="#fff" />
          <path d="M0 -6 Q12 -12 24 -8 L24 8 Q12 4 0 10 Z" fill="#fff" />
        </g>
      );
    case 'wand':
      return (
        <g>
          <path d="M70 84 L86 60" strokeWidth={4} />
          <path d="M86 50 L89 57 L96 57 L91 62 L93 69 L86 65 L79 69 L81 62 L76 57 L83 57 Z" fill="#fde047" strokeWidth={1.5} />
        </g>
      );
    case 'scarf':
      return <path d="M28 76 Q50 88 72 76 L74 84 Q50 96 26 84 Z M60 84 L66 98 L58 98 L54 88 Z" fill="#14b8a6" />;
    case 'leaf':
      return <path d="M50 30 Q64 10 80 14 Q76 32 54 34 Z" fill="#22c55e" />;
    case 'medal':
      return (
        <g>
          <path d="M42 78 L50 92 L58 78" fill="#3b82f6" />
          <circle cx="50" cy="92" r="8" fill="#facc15" />
        </g>
      );
    case 'balloon':
      return (
        <g>
          <path d="M80 48 Q76 64 70 76" fill="none" strokeWidth={1.5} />
          <ellipse cx="82" cy="34" rx="10" ry="13" fill="#f43f5e" />
        </g>
      );
    case 'pencil':
      return (
        <g transform="translate(78 70) rotate(35)">
          <rect x="-4" y="-18" width="8" height="28" fill="#facc15" />
          <path d="M-4 10 L0 18 L4 10 Z" fill="#fde7c7" />
        </g>
      );
  }
}

/** Die-cut style sticker: thick white border, coloured ring and the character. */
export function StickerArt({ def, locked = false, className }: { def: StickerDef; locked?: boolean; className?: string }) {
  return (
    <svg viewBox="-6 -6 112 112" className={className} role="img" aria-label={locked ? `Locked sticker: ${def.name}` : `${def.name} sticker`}>
      <defs>
        <filter id={`shadow-${def.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter={locked ? undefined : `url(#shadow-${def.id})`}>
        <circle cx="50" cy="50" r="52" fill={locked ? '#e2e8f0' : '#fff'} />
        <circle cx="50" cy="50" r="45" fill={locked ? '#cbd5e1' : def.colours.bg} stroke={locked ? '#94a3b8' : def.colours.ring} strokeWidth={5} />
      </g>
      <g
        stroke={locked ? '#94a3b8' : INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={locked ? { filter: 'brightness(0) opacity(0.25)' } : undefined}
      >
        {def.accessory === 'cape' && accessory(def)}
        {animalHead(def)}
        {def.accessory !== 'cape' && accessory(def)}
      </g>
      {locked && (
        <g>
          <rect x="38" y="44" width="24" height="20" rx="4" fill="#64748b" />
          <path d="M43 44 L43 38 Q50 28 57 38 L57 44" fill="none" stroke="#64748b" strokeWidth={4} />
        </g>
      )}
    </svg>
  );
}
