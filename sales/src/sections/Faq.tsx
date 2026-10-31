import { useId, useState } from 'react';
import { COPY } from '../copy';
import { SITE } from '../config';
import type { Mode } from './Pricing';

/** Accessible accordion: buttons with aria-expanded/aria-controls, operable with Tab, Enter and Space. */
export function Faq({ mode }: { mode: Mode }) {
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [open, setOpen] = useState<number | null>(0);
  const items = [...COPY.faq.items];
  const accessKnown = SITE.accessDuration !== null;
  if (accessKnown) items.push({ q: COPY.faq.accessQuestion, a: `Tempoh akses ialah ${SITE.accessDuration}.` });
  return (
    <div className="faq">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <h3 className="faq-q">
              <button type="button" aria-expanded={isOpen} aria-controls={`${base}-p${i}`} id={`${base}-b${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                <span>{it.q}</span>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="faq-chev">
                  <path d="M6 9 L12 15 L18 9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} hidden={!isOpen} className="faq-a">
              <p>{it.a}</p>
            </div>
          </div>
        );
      })}
      {mode === 'owner' && !accessKnown && (
        <div className="faq-item owner-box" data-owner-only>
          <p className="faq-q-static">{COPY.faq.accessQuestion}</p>
          <p className="owner-note">Perlu pengesahan pemilik. Soalan ini disembunyikan daripada pelanggan sehingga SITE.accessDuration ditetapkan dalam config.ts.</p>
        </div>
      )}
    </div>
  );
}
