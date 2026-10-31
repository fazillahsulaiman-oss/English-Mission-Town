// Read-aloud service. Prefers bundled recordings (audioAsset); falls back to the browser's
// speech synthesis as a prototype voice. Never starts on page load: only after a user gesture.

export type AudioAvailability = 'unknown' | 'available' | 'unavailable';
export type SpeakResult = 'ended' | 'stopped' | 'failed';

declare global {
  interface Window {
    /** Test hook: 'fake' simulates a working voice, 'none' simulates no audio. */
    __EMT_AUDIO__?: 'fake' | 'none';
  }
}

type Listener = (speaking: boolean) => void;

class SpeechService {
  availability: AudioAvailability = 'unknown';
  private voice: SpeechSynthesisVoice | null = null;
  private current: { resolve: (r: SpeakResult) => void; cleanup: () => void } | null = null;
  private listeners = new Set<Listener>();
  private detecting: Promise<AudioAvailability> | null = null;

  onSpeakingChange(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(speaking: boolean) {
    this.listeners.forEach((l) => l(speaking));
  }

  get speaking(): boolean {
    return this.current !== null;
  }

  detect(): Promise<AudioAvailability> {
    if (this.availability !== 'unknown') return Promise.resolve(this.availability);
    if (this.detecting) return this.detecting;
    this.detecting = new Promise<AudioAvailability>((resolve) => {
      const done = (a: AudioAvailability) => {
        this.availability = a;
        resolve(a);
      };
      if (window.__EMT_AUDIO__ === 'fake') return done('available');
      if (window.__EMT_AUDIO__ === 'none' || !('speechSynthesis' in window)) return done('unavailable');
      const pick = () => {
        const voices = window.speechSynthesis.getVoices();
        const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
        this.voice = en.find((v) => v.lang === 'en-GB') ?? en.find((v) => v.lang === 'en-MY') ?? en[0] ?? null;
        return this.voice !== null;
      };
      if (pick()) return done('available');
      const timer = setTimeout(() => done(pick() ? 'available' : 'unavailable'), 1500);
      window.speechSynthesis.addEventListener?.('voiceschanged', () => {
        if (this.availability === 'unknown' && pick()) {
          clearTimeout(timer);
          done('available');
        }
      });
    });
    return this.detecting;
  }

  stop() {
    if (this.current) {
      const c = this.current;
      this.current = null;
      c.cleanup();
      c.resolve('stopped');
      this.emit(false);
    }
  }

  /** Speak an exact authored script (or play its recording). Resolves when finished or stopped. */
  async speak(text: string, opts: { asset?: string | null; rate?: number } = {}): Promise<SpeakResult> {
    this.stop();
    if (opts.asset) return this.playAsset(opts.asset);
    const availability = await this.detect();
    if (availability !== 'available') return 'failed';
    if (window.__EMT_AUDIO__ === 'fake') return this.fakeSpeak(text);

    return new Promise<SpeakResult>((resolve) => {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (this.voice) u.voice = this.voice;
      u.lang = this.voice?.lang ?? 'en-GB';
      u.rate = opts.rate ?? 0.9;
      let started = false;
      const startGuard = setTimeout(() => {
        if (!started) finish('failed');
      }, 2500);
      const maxGuard = setTimeout(() => finish('ended'), 4000 + text.length * 120);
      const finish = (r: SpeakResult) => {
        if (this.current?.resolve !== resolveOnce) return;
        this.current = null;
        clearTimeout(startGuard);
        clearTimeout(maxGuard);
        this.emit(false);
        resolve(r);
      };
      const resolveOnce = (r: SpeakResult) => resolve(r);
      u.onstart = () => {
        started = true;
      };
      u.onend = () => finish('ended');
      u.onerror = () => finish('failed');
      this.current = {
        resolve: resolveOnce,
        cleanup: () => {
          clearTimeout(startGuard);
          clearTimeout(maxGuard);
          synth.cancel();
        },
      };
      this.emit(true);
      synth.speak(u);
    });
  }

  private fakeSpeak(text: string): Promise<SpeakResult> {
    return new Promise((resolve) => {
      const t = setTimeout(() => {
        if (this.current?.resolve !== resolve) return;
        this.current = null;
        this.emit(false);
        resolve('ended');
      }, Math.min(600, 150 + text.length * 4));
      this.current = { resolve, cleanup: () => clearTimeout(t) };
      this.emit(true);
    });
  }

  private playAsset(src: string): Promise<SpeakResult> {
    return new Promise((resolve) => {
      const el = new Audio(src);
      const end = (r: SpeakResult) => {
        if (this.current?.resolve !== resolve) return;
        this.current = null;
        this.emit(false);
        resolve(r);
      };
      el.onended = () => end('ended');
      el.onerror = () => end('failed');
      this.current = { resolve, cleanup: () => el.pause() };
      this.emit(true);
      el.play().catch(() => end('failed'));
    });
  }
}

export const speech = new SpeechService();
