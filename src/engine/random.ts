/** Small deterministic PRNG so shuffles can be reproduced when a session resumes. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic shuffle. Ensures the result differs from the input order when possible. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...items];
  for (let attempt = 0; attempt < 4; attempt++) {
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j]!, out[i]!];
    }
    if (out.length < 2 || out.some((v, i) => v !== items[i])) break;
  }
  return out;
}

export function randomId(prefix: string): string {
  const rnd = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rnd}`;
}
