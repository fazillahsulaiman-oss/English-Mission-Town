import { COPY } from '../copy';
import { PACKAGES, REFERENCE_VALUES, SITE, promotionActive, referenceValuesVisible, withPrice, type PackageConfig } from '../config';
import { FluentIcon } from '../svg/Illustrations';

export type Mode = 'customer' | 'owner';

const rm = (n: number) => `RM${Number.isInteger(n) ? n : n.toFixed(2)}`;
const CATEGORY_TOTAL = Object.values(REFERENCE_VALUES).reduce((a, b) => a + b, 0);

/** Reference value shown beside a package line, or null. Never double-counts a feature. */
function valueFor(pkg: PackageConfig, featureIndex: number): number | null {
  const text = pkg.features[featureIndex]!.text;
  if (pkg.id === 'basic' && text.startsWith('Enam kategori')) return CATEGORY_TOTAL;
  if (pkg.id === 'pro' && text.startsWith('Akses Tahun 1') && SITE.referenceValuePerYearConfirmed) return CATEGORY_TOTAL * 3;
  return null;
}

function Price({ pkg, mode }: { pkg: PackageConfig; mode: Mode }) {
  const promo = promotionActive();
  return (
    <div className="price">
      {promo && pkg.originalPrice !== null && (
        <p className="price-was">
          <span className="sr-only">Harga asal </span>
          <s>{rm(pkg.originalPrice)}</s>
          <span className="price-save">Jimat {rm(pkg.originalPrice - pkg.price)}</span>
        </p>
      )}
      {!promo && mode === 'owner' && (
        <p className="owner-note" data-owner-only>
          Tempat harga asal berpalang (dipaparkan hanya jika harga asal sah diberikan dan promosi disahkan). Kini: {pkg.originalPrice === null ? 'belum ditetapkan' : rm(pkg.originalPrice)}.
        </p>
      )}
      {promo && <p className="price-label">{COPY.pricing.promoLabel}</p>}
      <p className="price-now">
        <span className="price-rm">RM</span>
        {pkg.price}
      </p>
    </div>
  );
}

export function Pricing({ mode }: { mode: Mode }) {
  const showValues = referenceValuesVisible(mode);
  const pending = SITE.showCheckoutPendingNote && PACKAGES.every((p) => p.ctaHref === '#');
  return (
    <div className="pricing-grid">
      {PACKAGES.map((pkg) => (
        <article key={pkg.id} className={`plan plan-${pkg.id}`} aria-labelledby={`plan-${pkg.id}-title`} data-plan={pkg.id}>
          {pkg.ribbon && <p className="plan-ribbon">{pkg.ribbon}</p>}
          <h3 id={`plan-${pkg.id}-title`} className="plan-name">
            {pkg.name}
          </h3>
          <p className="plan-desc">{pkg.description}</p>
          <Price pkg={pkg} mode={mode} />
          <a className={`btn ${pkg.id === 'pro' ? 'btn-primary' : 'btn-outline'} btn-block`} href={pkg.ctaHref} data-cta="purchase" data-plan-cta={pkg.id}>
            {withPrice(pkg.ctaLabel, pkg.price)}
          </a>
          {pkg.featuresIntro && <p className="plan-intro">{pkg.featuresIntro}</p>}
          <ul className="plan-list">
            {pkg.features.map((f, i) => {
              const v = showValues ? valueFor(pkg, i) : null;
              return (
                <li key={f.text}>
                  <FluentIcon name="check" size={26} />
                  <span>
                    {f.text}
                    {v !== null && mode === 'customer' && <span className="plan-value"> (nilai {rm(v)})</span>}
                    {v !== null && mode === 'owner' && <span className="owner-note inline" data-owner-only> Cadangan nilai: {rm(v)} — belum disahkan.</span>}
                    {mode === 'owner' && f.status === 'needsProductWork' && (
                      <span className="owner-flag" data-owner-only>
                        Perlu dibina dalam produk{f.ownerNote ? `: ${f.ownerNote}` : ''}
                      </span>
                    )}
                    {mode === 'owner' && f.status === 'available' && f.ownerNote && (
                      <span className="owner-note inline" data-owner-only>
                        {' '}
                        {f.ownerNote}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
      {pending && <p className="pricing-pending">{COPY.pricing.checkoutPending}</p>}
    </div>
  );
}
