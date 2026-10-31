// Device frames in a soft 3D style: rounded bodies, gentle gradients, rim highlights and soft shadows.
import type { ReactNode } from 'react';
import { SoftShadowFilter, useSvgId } from './kit';

export const SCREENS = {
  monitor: { w: 640, h: 380 },
  tablet: { w: 300, h: 400 },
  tabletWide: { w: 420, h: 300 },
  phone: { w: 190, h: 390 },
};

type Kind = keyof typeof SCREENS;

const BEZEL: Record<Kind, number> = { monitor: 16, tablet: 16, tabletWide: 16, phone: 9 };
const RADIUS: Record<Kind, number> = { monitor: 22, tablet: 30, tabletWide: 30, phone: 34 };

/**
 * A device with an SVG screen. `children` draw in the screen's own coordinates
 * (0..SCREENS[kind].w, 0..SCREENS[kind].h).
 */
export function Device({ kind, children, label, className, screenBg = '#dff4fd' }: { kind: Kind; children: ReactNode; label: string; className?: string; screenBg?: string }) {
  const id = useSvgId(kind);
  const s = SCREENS[kind];
  const b = BEZEL[kind];
  const r = RADIUS[kind];
  const bodyW = s.w + b * 2;
  const bodyH = s.h + b * 2;
  const stand = kind === 'monitor' ? 70 : 0;
  const pad = 24;
  const vbW = bodyW + pad * 2;
  const vbH = bodyH + stand + pad * 2;
  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className={className} role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#5b6478" />
          <stop offset="0.55" stopColor="#2d3445" />
          <stop offset="1" stopColor="#1c2130" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`${id}-stand`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9d1de" />
          <stop offset="0.5" stopColor="#eef2f7" />
          <stop offset="1" stopColor="#b8c1d0" />
        </linearGradient>
        <linearGradient id={`${id}-glare`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={pad + b} y={pad + b} width={s.w} height={s.h} rx={Math.max(6, r - b)} />
        </clipPath>
        <SoftShadowFilter id={`${id}-shadow`} blur={12} dy={14} opacity={0.22} />
      </defs>
      {kind === 'monitor' && (
        <g>
          <path d={`M${vbW / 2 - 34} ${pad + bodyH - 4} L${vbW / 2 + 34} ${pad + bodyH - 4} L${vbW / 2 + 46} ${pad + bodyH + stand - 14} L${vbW / 2 - 46} ${pad + bodyH + stand - 14} Z`} fill={`url(#${id}-stand)`} />
          <rect x={vbW / 2 - 110} y={pad + bodyH + stand - 18} width={220} height={14} rx={7} fill={`url(#${id}-stand)`} filter={`url(#${id}-shadow)`} />
        </g>
      )}
      <rect x={pad} y={pad} width={bodyW} height={bodyH} rx={r} fill={`url(#${id}-body)`} filter={`url(#${id}-shadow)`} />
      <rect x={pad + 1.5} y={pad + 1.5} width={bodyW - 3} height={bodyH - 3} rx={r - 1.5} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={2} />
      {kind === 'phone' && <rect x={pad + bodyW / 2 - 22} y={pad + b + 6} width={44} height={10} rx={5} fill="#141824" />}
      {kind !== 'phone' && <circle cx={kind === 'monitor' ? pad + bodyW / 2 : pad + bodyW / 2} cy={pad + b / 2} r={2.6} fill="#8a93a6" />}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={pad + b} y={pad + b} width={s.w} height={s.h} fill={screenBg} />
        <svg x={pad + b} y={pad + b} width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} overflow="hidden">
          {children}
        </svg>
        <rect x={pad + b} y={pad + b} width={s.w} height={s.h} fill={`url(#${id}-glare)`} pointerEvents="none" />
      </g>
    </svg>
  );
}

/** Frame for the live demo: drawn with percentage geometry so it fits any screen height. */
export function DemoTabletFrame() {
  const id = useSvgId('demo');
  return (
    <svg className="demo-frame" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#5b6478" />
          <stop offset="0.55" stopColor="#2d3445" />
          <stop offset="1" stopColor="#1c2130" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" rx="34" fill={`url(#${id}-body)`} />
      <rect x="1.5" y="1.5" width="99%" height="99%" rx="33" fill="none" stroke={`url(#${id}-rim)`} strokeWidth="2" />
      <circle cx="50%" cy="11" r="3" fill="#8a93a6" />
    </svg>
  );
}
