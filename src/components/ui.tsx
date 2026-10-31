import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { speech } from '../audio/speech';
import type { GlossaryEntry } from '../engine/types';

export function Icon({ name, className = 'w-6 h-6' }: { name: 'back' | 'speaker' | 'stop' | 'gear' | 'star' | 'pause' | 'check' | 'replay' | 'lock' | 'help' | 'cross' | 'home' | 'album' | 'next' | 'grown-up'; className?: string }) {
  const p: Record<string, ReactNode> = {
    back: <path d="M15 5 L8 12 L15 19" />,
    next: <path d="M9 5 L16 12 L9 19" />,
    speaker: (
      <>
        <path d="M4 9 L8 9 L13 5 L13 19 L8 15 L4 15 Z" fill="currentColor" />
        <path d="M16 9 Q18 12 16 15 M18.5 6.5 Q22 12 18.5 17.5" fill="none" />
      </>
    ),
    stop: <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />,
    gear: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M4.9 4.9 L7 7 M17 17 L19.1 19.1 M4.9 19.1 L7 17 M17 7 L19.1 4.9" />
      </>
    ),
    star: <path d="M12 2.5 L14.9 8.6 L21.5 9.3 L16.5 13.8 L18 20.4 L12 17 L6 20.4 L7.5 13.8 L2.5 9.3 L9.1 8.6 Z" fill="currentColor" />,
    pause: (
      <>
        <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
        <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
      </>
    ),
    check: <path d="M5 12.5 L10 17 L19 7" />,
    cross: <path d="M6 6 L18 18 M18 6 L6 18" />,
    replay: (
      <>
        <path d="M4 12 A8 8 0 1 0 7 5.8" fill="none" />
        <path d="M3 4 L7 6 L5 10" fill="none" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
        <path d="M8 11 L8 8 A4 4 0 0 1 16 8 L16 11" fill="none" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9.5" fill="none" />
        <path d="M9.5 9.5 A2.5 2.5 0 1 1 12 12 L12 14" fill="none" />
        <circle cx="12" cy="17.3" r="1.2" fill="currentColor" />
      </>
    ),
    home: <path d="M3 11 L12 3 L21 11 M6 9 L6 20 L18 20 L18 9" fill="none" />,
    album: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" fill="none" />
        <circle cx="12" cy="11" r="3.5" fill="currentColor" />
      </>
    ),
    'grown-up': (
      <>
        <circle cx="12" cy="7" r="3.5" fill="none" />
        <path d="M5 21 Q5 13 12 13 Q19 13 19 21" fill="none" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name]}
    </svg>
  );
}

export function StarRow({ stars, size = 28, label }: { stars: number; size?: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label ?? `${stars} out of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path d="M12 2.5 L14.9 8.6 L21.5 9.3 L16.5 13.8 L18 20.4 L12 17 L6 20.4 L7.5 13.8 L2.5 9.3 L9.1 8.6 Z" fill={i <= stars ? '#facc15' : '#e2e8f0'} stroke="#2f2f48" strokeWidth={1.8} strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export function TopBar({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <header className="flex items-center gap-3 px-4 pt-4 pb-2 max-w-5xl mx-auto w-full">
      {onBack && (
        <button className="btn btn-icon" onClick={onBack} aria-label="Back">
          <Icon name="back" className="w-7 h-7" />
        </button>
      )}
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl flex-1 leading-tight">{title}</h1>
      {right}
    </header>
  );
}

export function Modal({ title, onClose, children, labelledBy = 'modal-title', wide = false }: { title: string; onClose?: () => void; children: ReactNode; labelledBy?: string; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>('button, [href], input, select, textarea');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40" onClick={onClose}>
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`card w-full ${wide ? 'max-w-2xl' : 'max-w-md'} p-5 max-h-[90vh] overflow-y-auto`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={labelledBy} className="font-display font-extrabold text-2xl mb-3">
          {title}
        </h2>
        {children}
      </motion.div>
    </div>
  );
}

export function SpeakButton({ text, label = 'Read to me', onStart, onEnd, className = '' }: { text: string; label?: string; onStart?: () => void; onEnd?: () => void; className?: string }) {
  return (
    <button
      className={`btn btn-sm btn-blue ${className}`}
      onClick={async () => {
        onStart?.();
        await speech.speak(text);
        onEnd?.();
      }}
      aria-label={`${label}: ${text}`}
    >
      <Icon name="speaker" className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

/** A word-help popup: word, simpler synonym (when accurate), explanation, example and pronunciation. */
export function GlossaryPopup({ entry, onClose, voiceOn }: { entry: GlossaryEntry; onClose: () => void; voiceOn: boolean }) {
  return (
    <Modal title={entry.word} onClose={onClose} labelledBy="glossary-title">
      <div className="space-y-3 text-lg">
        {entry.synonym && (
          <p>
            <span className="font-extrabold text-violet-700">Means: </span>
            {entry.synonym}
          </p>
        )}
        <p>{entry.explanation[0]!.toUpperCase() + entry.explanation.slice(1)}.</p>
        <p className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200">
          <span className="font-extrabold">Example: </span>
          {entry.example}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {voiceOn && <SpeakButton text={`${entry.word}. ${entry.example}`} label="Say it" />}
          <button className="btn btn-sm btn-go" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </Modal>
  );
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Renders text with tappable word-help buttons for glossary words.
 * Assessed words stay plain until `unlockAssessed` is true (after a first incorrect attempt).
 */
export function WordText({ text, entries, unlockAssessed, onOpen }: { text: string; entries: GlossaryEntry[]; unlockAssessed: boolean; onOpen: (e: GlossaryEntry) => void }) {
  const usable = entries.filter((e) => !e.assessed || unlockAssessed);
  if (usable.length === 0) return <>{text}</>;
  const re = new RegExp(`\\b(${usable.map((e) => escapeRe(e.word)).sort((a, b) => b.length - a.length).join('|')})\\b`, 'gi');
  const parts: ReactNode[] = [];
  let last = 0;
  const seen = new Set<string>();
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    const word = m[0];
    const entry = usable.find((e) => e.word.toLowerCase() === word.toLowerCase());
    if (!entry || seen.has(entry.word)) continue;
    seen.add(entry.word);
    parts.push(text.slice(last, idx));
    parts.push(
      <button key={idx} type="button" className="word-help inline" onClick={() => onOpen(entry)} aria-label={`Word help: ${word}`}>
        {word}
        <sup aria-hidden="true" className="ml-0.5 text-xs">?</sup>
      </button>,
    );
    last = idx + word.length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
