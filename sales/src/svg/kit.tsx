// Shared SVG building blocks and design tokens for every mockup on the sales page.
// Mockups reuse the real game's artwork (buildings, stickers, mascot, pictures) so the
// screens match the product; they are illustrations, not screenshots.
import { useId, type ReactNode } from 'react';

/** Canonical game tokens (mirrors src/index.css of the game). */
export const GAME = {
  ink: '#2f2f48',
  inkSoft: '#4b4b6b',
  sky: '#dff4fd',
  cream: '#fffaf0',
  sun: '#facc15',
  go: '#4ade80',
  blue: '#7dd3fc',
  pink: '#f9a8d4',
  purple: '#c4b5fd',
  white: '#ffffff',
  slot: '#94a3b8',
  font: "'Baloo 2', 'Nunito', system-ui, sans-serif",
  body: "'Nunito', system-ui, sans-serif",
};

/** SVG-safe unique id (React ids contain colons). */
export function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

/** Places a self-sizing child <svg> (game art) inside a box of an outer SVG. */
export function Embed({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <svg x={x} y={y} width={w} height={h} overflow="visible">
      {children}
    </svg>
  );
}

/** Game-style soft 3D button: ink border with a solid bottom shadow. */
export function GameButton({ x, y, w, h, label, fill = GAME.sun, size = 14, disabled = false }: { x: number; y: number; w: number; h: number; label: string; fill?: string; size?: number; disabled?: boolean }) {
  return (
    <g opacity={disabled ? 0.55 : 1}>
      <rect x={x} y={y + 3} width={w} height={h} rx={h / 2} fill={GAME.ink} />
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke={GAME.ink} strokeWidth={2.4} />
      <text x={x + w / 2} y={y + h / 2 + size * 0.36} textAnchor="middle" fontFamily={GAME.font} fontWeight={800} fontSize={size} fill={GAME.ink}>
        {label}
      </text>
    </g>
  );
}

/** Game-style word tile. */
export function GameTile({ x, y, label, w, h = 30, size = 14, selected = false }: { x: number; y: number; label: string; w?: number; h?: number; size?: number; selected?: boolean }) {
  const width = w ?? Math.max(30, label.length * size * 0.62 + 20);
  return (
    <g>
      <rect x={x} y={y + 3} width={width} height={h} rx={9} fill={GAME.ink} />
      <rect x={x} y={y} width={width} height={h} rx={9} fill={selected ? '#fef08a' : GAME.white} stroke={GAME.ink} strokeWidth={2.2} />
      <text x={x + width / 2} y={y + h / 2 + size * 0.36} textAnchor="middle" fontFamily={GAME.body} fontWeight={800} fontSize={size} fill={GAME.ink}>
        {label}
      </text>
    </g>
  );
}

export function GameSlot({ x, y, w, h = 34 }: { x: number; y: number; w: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={10} fill="rgba(255,255,255,.75)" stroke={GAME.slot} strokeWidth={2} strokeDasharray="5 4" />;
}

export function Star({ cx, cy, r, filled = true }: { cx: number; cy: number; r: number; filled?: boolean }) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.48;
    const a = (Math.PI * i) / 5 - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`);
  }
  return <polygon points={pts.join(' ')} fill={filled ? GAME.sun : '#e2e8f0'} stroke={GAME.ink} strokeWidth={Math.max(1.4, r * 0.12)} strokeLinejoin="round" />;
}

/** Progress trail of 8 dots, current one ringed. */
export function Trail({ x, y, current, done = [], r = 8, gap = 6 }: { x: number; y: number; current: number; done?: number[]; r?: number; gap?: number }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const cx = x + r + i * (r * 2 + gap);
        const isDone = done.includes(i);
        return (
          <g key={i}>
            {i === current && <circle cx={cx} cy={y} r={r + 3} fill="none" stroke="#f59e0b" strokeWidth={2.5} />}
            <circle cx={cx} cy={y} r={r} fill={isDone ? GAME.sun : GAME.white} stroke={GAME.ink} strokeWidth={1.8} />
            {isDone ? (
              <Star cx={cx} cy={y} r={r * 0.62} />
            ) : (
              <text x={cx} y={y + r * 0.42} textAnchor="middle" fontFamily={GAME.body} fontWeight={900} fontSize={r * 1.1} fill={GAME.ink}>
                {i + 1}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export function SoftShadowFilter({ id, blur = 10, dy = 12, opacity = 0.18 }: { id: string; blur?: number; dy?: number; opacity?: number }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy={dy} stdDeviation={blur} floodColor="#1d3557" floodOpacity={opacity} />
    </filter>
  );
}
