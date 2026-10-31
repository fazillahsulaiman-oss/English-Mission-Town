import type { ReactElement } from 'react';
import { parsePicture, renderPictureContent } from '../art/icons';
import type { Picture as PictureRef, SceneSpec } from '../engine/types';

interface SpotMap {
  on?: [number, number];
  under?: [number, number];
  in?: [number, number];
  /** Item drawn before the anchor (peeks out from inside). */
  inBehind?: boolean;
}

// Item centre positions (final 100×100 coordinates) per anchor, for anchor drawn at translate(10 22) scale(0.72).
const SPOTS: Record<string, SpotMap> = {
  chair: { on: [46, 47], under: [46, 79] },
  table: { on: [46, 31], under: [46, 74] },
  box: { on: [46, 24], in: [46, 40], inBehind: true },
  basket: { on: [46, 20], in: [46, 46], inBehind: true },
  bag: { on: [46, 14], in: [46, 36], inBehind: true },
  bed: { on: [54, 50], under: [54, 86] },
  tree: { on: [46, 30], in: [46, 36], under: [70, 76] },
  car: { on: [46, 30], in: [50, 46] },
};

function placed(key: string, cx: number, cy: number, size: number, k: string): ReactElement {
  const s = size / 100;
  return (
    <g key={k} transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${s})`}>
      {renderPictureContent(key)}
    </g>
  );
}

function SceneContent({ scene }: { scene: SceneSpec }) {
  const spots = SPOTS[parsePicture(scene.anchor).name] ?? {};
  const anchorShift = scene.relation === 'next to' ? 0 : 10;
  const anchor = (
    <g key="anchor" transform={`translate(${anchorShift} 22) scale(0.72)`}>
      {renderPictureContent(scene.anchor)}
    </g>
  );
  const ground = <ellipse key="ground" cx="50" cy="91" rx="46" ry="6" fill="#bbf7d0" opacity={0.8} />;
  switch (scene.relation) {
    case 'on': {
      const [x, y] = spots.on ?? [46, 18];
      return <>{ground}{anchor}{placed(scene.item, x, y, 30, 'item')}</>;
    }
    case 'under': {
      const [x, y] = spots.under ?? [46, 82];
      return <>{ground}{anchor}{placed(scene.item, x, y, 24, 'item')}</>;
    }
    case 'in': {
      const [x, y] = spots.in ?? [46, 50];
      const item = placed(scene.item, x, y, 28, 'item');
      return spots.inBehind ? <>{ground}{item}{anchor}</> : <>{ground}{anchor}{item}</>;
    }
    case 'next to':
      return <>{ground}{anchor}{placed(scene.item, 84, 74, 30, 'item')}</>;
    case 'behind':
      return <>{ground}{placed(scene.item, 66, 34, 32, 'item')}{anchor}</>;
    case 'in front of':
      return <>{ground}{anchor}{placed(scene.item, 46, 78, 34, 'item')}</>;
  }
}

function CountContent({ pictureKey, count }: { pictureKey: string; count: number }) {
  const base = pictureKey.split('*')[0]!;
  const cols = count <= 2 ? count : count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const size = Math.min(92 / cols, 92 / rows);
  const items: ReactElement[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const inRow = Math.min(cols, count - r * cols);
    const offsetX = (100 - inRow * size) / 2;
    const offsetY = (100 - rows * size) / 2;
    items.push(placed(base, offsetX + c * size + size / 2, offsetY + r * size + size / 2, size * 0.95, `c${i}`));
  }
  return <>{items}</>;
}

/** Renders any content picture: icon key, coloured/varied key, counted key, or composed scene. */
export function Picture({ picture, label, className }: { picture: PictureRef; label?: string; className?: string }) {
  let content: ReactElement | null;
  if (typeof picture === 'string') {
    const { count } = parsePicture(picture);
    content = count > 1 ? <CountContent pictureKey={picture} count={count} /> : renderPictureContent(picture);
  } else {
    content = <SceneContent scene={picture} />;
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {content ?? (
        // Missing asset fallback: a friendly question card instead of a broken image.
        <g>
          <rect x="10" y="10" width="80" height="80" rx="16" fill="#e2e8f0" />
          <text x="50" y="62" textAnchor="middle" fontSize="36" fontWeight="800" fill="#64748b">?</text>
        </g>
      )}
    </svg>
  );
}
