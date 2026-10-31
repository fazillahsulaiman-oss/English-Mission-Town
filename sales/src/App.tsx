import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Mascot } from '../../src/art/characters';
import { COPY } from './copy';
import { PACKAGES, REFERENCE_VALUES, referenceValuesVisible, withPrice } from './config';
import { Faq } from './sections/Faq';
import { Pricing, type Mode } from './sections/Pricing';
import { Device } from './svg/Devices';
import { DeskIllustration, FluentIcon, ParentIllustration, WordBlocksIllustration, type IconName } from './svg/Illustrations';
import {
  CelebrationScreen,
  DialoguePhoneScreen,
  GrammarPhoneScreen,
  ListenScreen,
  PhoneSentenceScreen,
  ScoreScreen,
  SentenceTabletScreen,
  StickerAlbumScreen,
  StoryTabletScreen,
  TownScreen,
  WordExplorerScreen,
} from './svg/Screens';
import { useInView, usePrefersReducedMotion } from './useInView';

const Demo = lazy(() => import('./sections/Demo'));

function Section({ id, className = '', labelledBy, children }: { id?: string; className?: string; labelledBy: string; children: (inView: boolean) => ReactNode }) {
  const [ref, inView] = useInView<HTMLElement>('80px');
  return (
    <section id={id} ref={ref} className={`section ${className}`} aria-labelledby={labelledBy} data-inview={inView}>
      <div className="wrap">{children(inView)}</div>
    </section>
  );
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="English Mission Town, ke atas halaman">
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd36e" />
            <stop offset="1" stopColor="#f0a020" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="12" fill="url(#logo-g)" />
        <path d="M20 8 L23.4 15.4 L31.4 16.3 L25.5 21.8 L27 29.7 L20 25.8 L13 29.7 L14.5 21.8 L8.6 16.3 L16.6 15.4 Z" fill="#ffffff" />
      </svg>
      <span>English Mission Town</span>
    </a>
  );
}

function Hero({ reduced, ctaRef }: { reduced: boolean; ctaRef: React.RefObject<HTMLDivElement> }) {
  const [ref, inView] = useInView<HTMLElement>();
  const labels: { icon: IconName; text: string }[] = [
    { icon: 'years', text: COPY.hero.labels[0]! },
    { icon: 'wordhelp', text: COPY.hero.labels[1]! },
    { icon: 'pace', text: COPY.hero.labels[2]! },
  ];
  const cards: IconName[] = ['missions', 'wordhelp', 'stars'];
  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title" data-inview={inView} id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">{COPY.hero.headline}</h1>
          <p className="hero-sub">{COPY.hero.sub}</p>
          <p className="hero-support">{COPY.hero.support}</p>
          <div className="hero-ctas" ref={ctaRef}>
            <a className="btn btn-primary btn-lg" href="#pakej" data-cta="nav">
              {withPrice(COPY.hero.ctaPrimary, PACKAGES[0]!.price)}
            </a>
            <a className="btn btn-outline btn-lg" href="#demo" data-cta="nav">
              {COPY.hero.ctaSecondary}
            </a>
          </div>
          <ul className="hero-labels">
            {labels.map((l) => (
              <li key={l.text}>
                <FluentIcon name={l.icon} size={36} />
                <span>{l.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="hero-visual">
          <div className="devices">
            <div className="dev dev-monitor">
              <Device kind="monitor" label="Komputer memaparkan peta Mission Town dengan enam tempat pembelajaran">
                <TownScreen />
              </Device>
            </div>
            <div className="dev dev-tablet">
              <Device kind="tablet" label="Tablet memaparkan kad markah: Congratulations, 7 daripada 8, tiga bintang dan sticker Super Tapir" screenBg="#fff7cc">
                <ScoreScreen />
              </Device>
            </div>
            <div className="dev dev-phone">
              <Device kind="phone" label="Telefon memaparkan soalan Sentence Builder: Build the sentence">
                <PhoneSentenceScreen />
              </Device>
            </div>
            {!reduced && (
              <div className="hero-mascot" aria-hidden="true">
                <Mascot mood="wave" size={90} animate={inView} />
              </div>
            )}
          </div>
          <figcaption className="sr-only">{COPY.hero.mockupCaption}</figcaption>
          <ul className="feature-cards">
            {COPY.hero.featureCards.map((c, i) => (
              <li key={c.title} className="feature-card" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                <FluentIcon name={cards[i]!} size={44} />
                <div>
                  <p className="feature-title">{c.title}</p>
                  <p className="feature-text">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}

const WORLD_MOCKUPS: Record<string, { kind: 'tabletWide' | 'phone'; screen: ReactNode; label: string }> = {
  'word-explorer': { kind: 'tabletWide', screen: <WordExplorerScreen />, label: 'Tablet: padankan perkataan cat, dog dan rabbit dengan gambar' },
  'listen-discover': { kind: 'phone', screen: <ListenScreen />, label: 'Telefon: butang dengar semula dan empat pilihan gambar' },
  'sentence-builder': { kind: 'tabletWide', screen: <SentenceTabletScreen />, label: 'Tablet: menyusun perkataan The cat is sleeping' },
  'grammar-quest': { kind: 'phone', screen: <GrammarPhoneScreen />, label: 'Telefon: isi tempat kosong I have ___ apple dengan a atau an' },
  'everyday-english': { kind: 'phone', screen: <DialoguePhoneScreen />, label: 'Telefon: dialog di kedai, Can I help you?' },
  'story-adventure': { kind: 'tabletWide', screen: <StoryTabletScreen />, label: 'Tablet: cerita pendek Aina’s Cat dengan soalan' },
};

function StickySalesBar({ show }: { show: boolean }) {
  return (
    <div className={`sticky-cta ${show ? 'is-visible' : ''}`} aria-hidden={!show} data-testid="sticky-cta">
      <p>
        BASIC <b>RM{PACKAGES[0]!.price}</b> · PRO <b>RM{PACKAGES[1]!.price}</b>
      </p>
      <a className="btn btn-primary" href="#pakej" tabIndex={show ? 0 : -1}>
        {COPY.stickyCta}
      </a>
    </div>
  );
}

export function App({ mode }: { mode: Mode }) {
  const reduced = usePrefersReducedMotion();
  const [demoRef, demoInView] = useInView<HTMLDivElement>('300px');
  const [demoReady, setDemoReady] = useState(false);
  const [heroSentinel, heroVisible] = useInView<HTMLDivElement>();
  const [pricingSentinel, pricingVisible] = useInView<HTMLDivElement>();
  const showValues = referenceValuesVisible(mode);

  // Links such as /#pakej: the sections render after the browser's own jump, so scroll once mounted.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, []);

  // Load the demo code when it is near the screen, or once the page is idle.
  useEffect(() => {
    if (demoInView) setDemoReady(true);
  }, [demoInView]);
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const t = ric ? ric(() => setDemoReady(true)) : window.setTimeout(() => setDemoReady(true), 2500);
    return () => {
      if (!ric) window.clearTimeout(t);
    };
  }, []);

  const showSticky = !heroVisible && !demoInView && !pricingVisible;

  return (
    <div className={`page ${reduced ? 'reduced' : ''}`}>
      {mode === 'owner' && (
        <div className="owner-banner" role="note" data-owner-only>
          <b>Mod semakan pemilik.</b> Halaman ini menunjukkan perkara yang belum disahkan. Jangan kongsi dengan pelanggan. Halaman pelanggan: index.html.
        </div>
      )}
      <div className="topbar">
        <p className="wrap">{COPY.topBar}</p>
      </div>
      <header className="site-header">
        <div className="wrap header-row">
          <Logo />
          <nav aria-label="Navigasi halaman" className="header-nav">
            <a href="#demo">Cuba Demo</a>
            <a href="#dunia">6 Dunia</a>
            <a href="#soalan">Soalan Lazim</a>
            <a className="btn btn-primary btn-sm" href="#pakej">
              Lihat Pakej
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Hero reduced={reduced} ctaRef={heroSentinel} />

        <Section id="masalah" labelledBy="masalah-title" className="problems">
          {() => (
            <>
              <h2 id="masalah-title" className="section-title">
                {COPY.problems.title}
              </h2>
              <div className="problem-grid">
                {COPY.problems.items.map((p, i) => (
                  <article key={p.title} className="problem-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="problem-art">{[<DeskIllustration key="a" />, <WordBlocksIllustration key="b" />, <ParentIllustration key="c" />][i]}</div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </Section>

        <Section id="kenapa" labelledBy="kenapa-title" className="why">
          {() => (
            <>
              <h2 id="kenapa-title" className="section-title">
                {COPY.why.title}
              </h2>
              <ol className="flow" aria-label="Aliran pembelajaran">
                {COPY.why.flow.map((f, i) => (
                  <li key={f}>
                    <FluentIcon name={(['try', 'hint', 'understand', 'continue', 'sticker'] as IconName[])[i]!} size={48} />
                    <span>{f}</span>
                  </li>
                ))}
              </ol>
              <ul className="reason-grid">
                {COPY.why.reasons.map((r, i) => (
                  <li key={r.title} className="reason reveal" style={{ animationDelay: `${i * 0.06}s` }}>
                    <FluentIcon name={(['six', 'activities', 'wordhelp', 'places', 'timer', 'rewards', 'score'] as IconName[])[i]!} size={48} />
                    <div>
                      <h3>{r.title}</h3>
                      <p>{r.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>

        <section id="demo" className="section demo-section" aria-labelledby="demo-title">
          <div className="wrap">
            <h2 id="demo-title" className="section-title">
              {COPY.demo.title}
            </h2>
            <p className="section-sub">{COPY.demo.text}</p>
            <div ref={demoRef} className="demo-host">
              {demoReady ? (
                <Suspense fallback={<DemoPlaceholder />}>
                  <Demo reducedMotion={reduced} active={demoInView} />
                </Suspense>
              ) : (
                <DemoPlaceholder />
              )}
            </div>
          </div>
        </section>

        <Section id="dunia" labelledBy="dunia-title" className="worlds">
          {() => (
            <>
              <h2 id="dunia-title" className="section-title">
                {COPY.worlds.title}
              </h2>
              <div className="world-list">
                {COPY.worlds.items.map((w, i) => {
                  const m = WORLD_MOCKUPS[w.id]!;
                  const value = REFERENCE_VALUES[w.id];
                  return (
                    <article key={w.id} className={`world ${i % 2 ? 'flip' : ''}`} aria-labelledby={`w-${w.id}`}>
                      <div className={`world-art ${m.kind}`}>
                        <Device kind={m.kind} label={m.label}>
                          {m.screen}
                        </Device>
                      </div>
                      <div className="world-copy">
                        <p className="eyebrow">{w.place}</p>
                        <h3 id={`w-${w.id}`}>{w.name}</h3>
                        <p className="world-activity">{w.activity}</p>
                        <p className="world-benefit">
                          <FluentIcon name="check" size={28} />
                          <span>{w.benefit}</span>
                        </p>
                        {showValues && value !== undefined && mode === 'customer' && <p className="world-value">Nilai RM{value}</p>}
                        {showValues && value !== undefined && mode === 'owner' && (
                          <p className="owner-note" data-owner-only>
                            Cadangan nilai: RM{value} — belum disahkan.
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </Section>

        <Section id="ganjaran" labelledBy="ganjaran-title" className="rewards">
          {(inView) => (
            <>
              <h2 id="ganjaran-title" className="section-title">
                {COPY.rewards.title}
              </h2>
              <p className="section-sub">{COPY.rewards.text}</p>
              <div className={`reward-stage ${inView && !reduced ? 'is-playing' : ''}`}>
                <div className="reward-main">
                  <Device kind="tabletWide" label="Jawapan betul diraikan dengan bunga api, reben, konfeti dan mesej Brilliant">
                    <CelebrationScreen />
                  </Device>
                </div>
                <div className="reward-side">
                  <Device kind="tablet" label="Kad markah selepas misi dengan bintang dan sticker baharu" screenBg="#fff7cc">
                    <ScoreScreen score={8} stickerName="Space Cat" />
                  </Device>
                </div>
              </div>
              <ul className="reward-points">
                {COPY.rewards.points.map((p, i) => (
                  <li key={p.title}>
                    <FluentIcon name={(['celebrate', 'try', 'card', 'album'] as IconName[])[i]!} size={44} />
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="album">
                <Device kind="tabletWide" label="Album sticker: Space Cat, Rainbow Tiger, Super Tapir, Rocket Turtle, Detective Otter dan Wizard Hornbill" screenBg="#fdf2f8">
                  <StickerAlbumScreen names={['Space Cat', 'Rainbow Tiger', 'Super Tapir', 'Rocket Turtle', 'Detective Otter', 'Wizard Hornbill']} />
                </Device>
              </div>
            </>
          )}
        </Section>

        <section id="pakej" className="section pricing" aria-labelledby="pakej-title">
          <div ref={pricingSentinel} className="wrap">
            <h2 id="pakej-title" className="section-title">
              {COPY.pricing.title}
            </h2>
            <p className="section-sub">{COPY.pricing.sub}</p>
            <Pricing mode={mode} />
          </div>
        </section>

        <section id="soalan" className="section faq-section" aria-labelledby="soalan-title">
          <div className="wrap narrow">
            <h2 id="soalan-title" className="section-title">
              {COPY.faq.title}
            </h2>
            <Faq mode={mode} />
          </div>
        </section>

        <section className="section final" aria-labelledby="final-title">
          <div className="wrap final-card">
            <Mascot mood="cheer" size={110} animate={false} />
            <h2 id="final-title">{COPY.finalCta.title}</h2>
            <p>{COPY.finalCta.text}</p>
            <p className="final-prices">
              BASIC <b>RM{PACKAGES[0]!.price}</b> <span aria-hidden="true">|</span> PRO <b>RM{PACKAGES[1]!.price}</b>
            </p>
            <a className="btn btn-primary btn-lg" href="#pakej" data-cta="nav">
              {COPY.finalCta.cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <Logo />
          <p>{COPY.footer.curriculum}</p>
          <p className="footer-small">{COPY.footer.notice}</p>
          <p className="footer-small">Paparan permainan dalam halaman ini ialah ilustrasi dan demo contoh.</p>
        </div>
      </footer>
      <StickySalesBar show={showSticky} />
    </div>
  );
}

function DemoPlaceholder() {
  return (
    <div className="demo-placeholder" aria-busy="true">
      <p>{COPY.demo.loading}</p>
    </div>
  );
}
