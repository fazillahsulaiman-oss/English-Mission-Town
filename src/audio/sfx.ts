// Small synthesised sound effects (no audio files needed). Gentle by design: no buzzers.
let ctx: AudioContext | null = null;
let enabled = true;

export function setSfxEnabled(on: boolean) {
  enabled = on;
}

function audio(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'triangle', gain = 0.12) {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  tap() {
    tone(660, 0, 0.08, 'sine', 0.05);
  },
  place() {
    tone(520, 0, 0.1, 'sine', 0.07);
    tone(780, 0.05, 0.1, 'sine', 0.05);
  },
  correct() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.3, 'triangle', 0.12));
    tone(1568, 0.36, 0.4, 'sine', 0.05);
  },
  tryAgain() {
    tone(440, 0, 0.18, 'sine', 0.07);
    tone(392, 0.16, 0.25, 'sine', 0.06);
  },
  victory() {
    const notes = [523, 659, 784, 659, 784, 1047];
    notes.forEach((f, i) => tone(f, i * 0.13, 0.3, 'triangle', 0.12));
    [1047, 1319, 1568].forEach((f) => tone(f, 0.85, 0.9, 'sine', 0.06));
  },
  sticker() {
    [1175, 1397, 1760, 2093].forEach((f, i) => tone(f, i * 0.07, 0.25, 'sine', 0.06));
  },
};
