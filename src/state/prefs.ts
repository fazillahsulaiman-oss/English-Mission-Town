import { useEffect, useState } from 'react';
import { useApp } from './store';

function systemPrefersReduced(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Resolves the motion setting: 'system' follows the device preference. */
export function useReducedMotion(): boolean {
  const motion = useApp((s) => s.save.settings.motion);
  const [sys, setSys] = useState(systemPrefersReduced);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setSys(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  if (motion === 'reduced') return true;
  if (motion === 'full') return false;
  return sys;
}

export function useSettings() {
  return useApp((s) => s.save.settings);
}
