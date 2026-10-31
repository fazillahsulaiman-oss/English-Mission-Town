// Layered celebration effects: custom canvas fireworks, curling ribbons and twinkling stars,
// plus canvas-confetti bursts. Both canvases are pointer-events: none and cleaned up after use.
// No strobing: brightness changes are smooth fades, never rapid flashing.
import confetti from 'canvas-confetti';

const PALETTE = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'];

type Particle =
  | { kind: 'rocket'; x: number; y: number; vx: number; vy: number; targetY: number; colour: string; size: number }
  | { kind: 'spark'; x: number; y: number; px: number; py: number; vx: number; vy: number; life: number; max: number; colour: string; size: number }
  | {
      kind: 'ribbon';
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      spin: number;
      phase: number;
      life: number;
      max: number;
      colour: string;
      width: number;
      trail: { x: number; y: number }[];
    }
  | { kind: 'star'; x: number; y: number; life: number; max: number; size: number; colour: string; rot: number; vy: number };

export type CelebrationKind = 'answer' | 'final';
export type Intensity = 'full' | 'gentle';

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;

export class CelebrationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private raf: number | null = null;
  private last = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private confettiFn: confetti.CreateTypes | null = null;
  private frameTimes: number[] = [];
  /** Scales particle counts down on slow devices; effects stay visible, just lighter. */
  quality = 1;
  private w = 0;
  private h = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement, confettiCanvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    try {
      this.confettiFn = confetti.create(confettiCanvas, { resize: true, useWorker: false });
    } catch {
      this.confettiFn = null;
    }
    if (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4) this.quality = 0.7;
    this.resize();
  }

  resize() {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private n(count: number) {
    return Math.max(1, Math.round(count * this.quality));
  }

  private later(ms: number, fn: () => void) {
    this.timers.push(setTimeout(fn, ms));
  }

  private start() {
    if (this.raf !== null) return;
    this.last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.last) / 1000);
      this.last = t;
      this.trackPerformance(dt);
      this.step(dt);
      this.draw();
      if (this.particles.length > 0) this.raf = requestAnimationFrame(loop);
      else {
        this.raf = null;
        this.ctx?.clearRect(0, 0, this.w, this.h);
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  private trackPerformance(dt: number) {
    this.frameTimes.push(dt);
    if (this.frameTimes.length >= 30) {
      const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.frameTimes = [];
      if (avg > 0.028 && this.quality > 0.35) {
        this.quality = Math.max(0.35, this.quality * 0.7);
        // Thin out existing sparks rather than dropping whole effects.
        this.particles = this.particles.filter((p, i) => p.kind !== 'spark' || i % 2 === 0);
      }
    }
  }

  // ---------- spawners ----------
  firework(x: number, targetY: number) {
    this.particles.push({ kind: 'rocket', x, y: this.h + 10, vx: rand(-30, 30), vy: -rand(this.h * 1.1, this.h * 1.4), targetY, colour: pick(PALETTE), size: 3 });
    this.start();
  }

  private explode(x: number, y: number, colour: string) {
    const count = this.n(46);
    const second = pick(PALETTE);
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + rand(-0.08, 0.08);
      const sp = rand(120, 260);
      this.particles.push({ kind: 'spark', x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.9, 1.4), colour: i % 3 === 0 ? second : colour, size: rand(2, 3.4) });
    }
  }

  ribbon(fromLeft: boolean) {
    const x = fromLeft ? rand(-10, this.w * 0.15) : rand(this.w * 0.85, this.w + 10);
    this.particles.push({
      kind: 'ribbon',
      x,
      y: this.h + 20,
      vx: (fromLeft ? 1 : -1) * rand(80, 220),
      vy: -rand(this.h * 0.75, this.h * 1.05),
      angle: 0,
      spin: rand(9, 13) * (Math.random() < 0.5 ? -1 : 1),
      phase: rand(0, Math.PI * 2),
      life: 0,
      max: rand(1.6, 2.3),
      colour: pick(PALETTE),
      width: rand(5, 8),
      trail: [],
    });
    this.start();
  }

  stars(count: number, area: { x: number; y: number; w: number; h: number }) {
    for (let i = 0; i < this.n(count); i++) {
      this.particles.push({ kind: 'star', x: area.x + rand(0, area.w), y: area.y + rand(0, area.h), life: -rand(0, 0.5), max: rand(0.9, 1.4), size: rand(8, 16), colour: pick(['#facc15', '#fde047', '#fff7ae', '#f9a8d4', '#a5f3fc']), rot: rand(0, Math.PI), vy: -rand(10, 30) });
    }
    this.start();
  }

  confettiBurst(origin: { x: number; y: number }, angle: number, count: number, spread = 70) {
    this.confettiFn?.({ particleCount: this.n(count), angle, spread, origin, startVelocity: 48, ticks: 160, colors: PALETTE, scalar: 1, disableForReducedMotion: true });
  }

  // ---------- choreography ----------
  celebrate(kind: CelebrationKind, intensity: Intensity) {
    const gentle = intensity === 'gentle';
    const centre = { x: this.w * 0.2, y: this.h * 0.15, w: this.w * 0.6, h: this.h * 0.4 };
    if (kind === 'answer') {
      const fw = gentle ? 1 : 3;
      for (let i = 0; i < fw; i++) this.later(i * 260, () => this.firework(rand(this.w * 0.15, this.w * 0.85), rand(this.h * 0.12, this.h * 0.3)));
      this.confettiBurst({ x: 0.15, y: 0.9 }, 60, gentle ? 30 : 70);
      this.confettiBurst({ x: 0.85, y: 0.9 }, 120, gentle ? 30 : 70);
      const rb = gentle ? 2 : 6;
      for (let i = 0; i < rb; i++) this.later(i * 90, () => this.ribbon(i % 2 === 0));
      this.stars(gentle ? 6 : 14, centre);
      return;
    }
    // Final celebration ≈ 3.5 s: fireworks across the top, confetti from both sides, ribbons, stars.
    const fw = gentle ? 4 : 9;
    for (let i = 0; i < fw; i++) this.later(i * 350, () => this.firework(((i + 0.5) / fw) * this.w + rand(-30, 30), rand(this.h * 0.08, this.h * 0.25)));
    const bursts = gentle ? 3 : 7;
    for (let i = 0; i < bursts; i++) {
      this.later(i * 450, () => {
        this.confettiBurst({ x: 0, y: 0.65 }, 55, gentle ? 35 : 60, 60);
        this.confettiBurst({ x: 1, y: 0.65 }, 125, gentle ? 35 : 60, 60);
      });
    }
    const rb = gentle ? 6 : 16;
    for (let i = 0; i < rb; i++) this.later(i * 180, () => this.ribbon(i % 2 === 0));
    for (let i = 0; i < 4; i++) this.later(i * 700, () => this.stars(gentle ? 5 : 12, { x: 0, y: 0, w: this.w, h: this.h * 0.5 }));
  }

  stop() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.particles = [];
    this.confettiFn?.reset();
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.ctx?.clearRect(0, 0, this.w, this.h);
  }

  destroy() {
    this.stop();
  }

  // ---------- simulation ----------
  private step(dt: number) {
    const g = 260;
    const next: Particle[] = [];
    for (const p of this.particles) {
      switch (p.kind) {
        case 'rocket': {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += g * 0.9 * dt;
          if (p.y <= p.targetY || p.vy >= -40) this.explode(p.x, p.y, p.colour);
          else next.push(p);
          break;
        }
        case 'spark': {
          p.px = p.x;
          p.py = p.y;
          p.vx *= 1 - 1.6 * dt;
          p.vy = p.vy * (1 - 1.6 * dt) + g * 0.45 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life += dt;
          if (p.life < p.max) next.push(p);
          break;
        }
        case 'ribbon': {
          p.life += dt;
          p.vy += g * 0.75 * dt;
          p.vx *= 1 - 0.5 * dt;
          p.angle += p.spin * dt;
          // Curling: lateral sine offset around the travel direction.
          const curl = Math.sin(p.angle + p.phase) * 170;
          p.x += (p.vx + curl) * dt;
          p.y += p.vy * dt;
          p.trail.push({ x: p.x + Math.cos(p.angle) * 14, y: p.y + Math.sin(p.angle) * 14 });
          if (p.trail.length > 14) p.trail.shift();
          if (p.life < p.max && p.y < this.h + 60) next.push(p);
          break;
        }
        case 'star': {
          p.life += dt;
          p.y += p.vy * dt;
          p.rot += dt * 0.8;
          if (p.life < p.max) next.push(p);
          break;
        }
      }
    }
    this.particles = next;
  }

  private draw() {
    const c = this.ctx;
    if (!c) return;
    c.clearRect(0, 0, this.w, this.h);
    for (const p of this.particles) {
      switch (p.kind) {
        case 'rocket':
          c.globalAlpha = 1;
          c.fillStyle = p.colour;
          c.beginPath();
          c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          c.fill();
          c.globalAlpha = 0.4;
          c.fillRect(p.x - 1, p.y, 2, 18);
          break;
        case 'spark': {
          const a = 1 - p.life / p.max;
          c.globalAlpha = Math.max(0, a);
          c.strokeStyle = p.colour;
          c.lineWidth = p.size;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(p.px, p.py);
          c.lineTo(p.x, p.y);
          c.stroke();
          break;
        }
        case 'ribbon': {
          const a = Math.min(1, (p.max - p.life) * 2);
          c.globalAlpha = Math.max(0, a);
          c.strokeStyle = p.colour;
          c.lineWidth = p.width;
          c.lineCap = 'round';
          c.lineJoin = 'round';
          c.beginPath();
          p.trail.forEach((pt, i) => (i === 0 ? c.moveTo(pt.x, pt.y) : c.lineTo(pt.x, pt.y)));
          c.stroke();
          c.strokeStyle = 'rgba(255,255,255,0.55)';
          c.lineWidth = p.width * 0.3;
          c.stroke();
          break;
        }
        case 'star': {
          if (p.life < 0) break;
          const t = p.life / p.max;
          // Smooth single rise and fade (no flicker).
          const s = Math.sin(Math.PI * t);
          c.globalAlpha = s;
          drawStar(c, p.x, p.y, p.size * (0.6 + 0.4 * s), p.rot, p.colour);
          break;
        }
      }
    }
    c.globalAlpha = 1;
  }
}

function drawStar(c: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number, colour: string) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.fillStyle = colour;
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI * i) / 5 - Math.PI / 2;
    c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  c.closePath();
  c.fill();
  c.restore();
}
