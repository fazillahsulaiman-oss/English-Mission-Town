import { useEffect, useRef } from 'react';
import { CelebrationEngine, type CelebrationKind, type Intensity } from './celebration';

let engine: CelebrationEngine | null = null;

/** Fire a celebration. A no-op when the layer is not mounted (e.g. reduced motion). */
export function celebrate(kind: CelebrationKind, intensity: Intensity) {
  engine?.celebrate(kind, intensity);
}

export function stopCelebration() {
  engine?.stop();
}

/** Dedicated full-screen canvases; never intercept taps. */
export function CelebrationLayer() {
  const fx = useRef<HTMLCanvasElement>(null);
  const conf = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!fx.current || !conf.current) return;
    engine = new CelebrationEngine(fx.current, conf.current);
    const onResize = () => engine?.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      engine?.destroy();
      engine = null;
    };
  }, []);
  const style = { position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' } as const;
  return (
    <>
      <canvas ref={conf} aria-hidden="true" style={{ ...style, zIndex: 60 }} data-testid="confetti-canvas" />
      <canvas ref={fx} aria-hidden="true" style={{ ...style, zIndex: 61 }} data-testid="fx-canvas" />
    </>
  );
}
