// Elapsed-time question timer. Pure functions: the caller supplies `now` (ms).
// Accuracy comes from timestamps, not from counting setInterval ticks.

export interface TimerState {
  limitMs: number | null;
  /** Active time already consumed, excluding the current running stretch. */
  usedMs: number;
  /** Timestamp when the current running stretch started, or null when paused. */
  runningSince: number | null;
}

export function createTimer(limitMs: number | null): TimerState {
  return { limitMs, usedMs: 0, runningSince: null };
}

export function isRunning(t: TimerState): boolean {
  return t.runningSince !== null;
}

export function startTimer(t: TimerState, now: number): TimerState {
  if (t.limitMs === null || t.runningSince !== null) return t;
  return { ...t, runningSince: now };
}

export function pauseTimer(t: TimerState, now: number): TimerState {
  if (t.runningSince === null) return t;
  return { ...t, usedMs: t.usedMs + Math.max(0, now - t.runningSince), runningSince: null };
}

export function elapsedMs(t: TimerState, now: number): number {
  return t.usedMs + (t.runningSince !== null ? Math.max(0, now - t.runningSince) : 0);
}

export function remainingMs(t: TimerState, now: number): number | null {
  if (t.limitMs === null) return null;
  return Math.max(0, t.limitMs - elapsedMs(t, now));
}

export function isExpired(t: TimerState, now: number): boolean {
  const r = remainingMs(t, now);
  return r !== null && r <= 0;
}
