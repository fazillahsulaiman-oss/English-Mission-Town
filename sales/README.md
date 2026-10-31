# English Mission Town — Sales Page

A static sales page for parents (Bahasa Melayu copy). All game screens, mockups and the demo are in English. The page reuses the game's own artwork, drag-and-drop board, sounds and celebration engine, so the mockups and the demo match the real product.

## Commands (run from the repository root)

```bash
npm run sales:dev        # http://localhost:5180 (customer page), /owner.html (owner review)
```

```bash
npm run sales:build      # static output in dist-sales/
```

```bash
npm run sales:preview    # serve dist-sales/ on http://localhost:4180
```

```bash
npm run sales:test       # Playwright checks for the sales page
```

`dist-sales/` is plain static files with relative paths, so it can be uploaded to any static host or a sub-folder (for example `https://example.com/emt/`). It contains:

- `index.html`: the customer page.
- `owner.html`: the owner review page. It shows unconfirmed values, placeholders and items that still need product work. It is marked `noindex`. Do not link or upload it publicly.
- `embed-example.html`: an iframe example.

## Changing prices, links and offers

Everything commercial is in **`sales/src/config.ts`**:

| What | Where |
|---|---|
| Prices | `PACKAGES[n].price` |
| Checkout links | `PACKAGES[n].ctaHref` (keep `'#'` until a real checkout exists) |
| Button text | `PACKAGES[n].ctaLabel` |
| Package features | `PACKAGES[n].features` (set `status: 'available'` only once the game really does it) |
| Real previous prices | `PACKAGES[n].originalPrice` (leave `null` unless genuine) |
| Show promotion | `SITE.promotionApproved` (needs real original prices for both packages; the saving is calculated automatically) |
| Category reference values | `REFERENCE_VALUES`, plus `SITE.showReferenceValues` and `SITE.referenceValuesApproved` (both must be `true` before customers see them) |
| PRO three-Year total (RM480) | `SITE.referenceValuePerYearConfirmed` |
| Access period | `SITE.accessDuration` (e.g. `'12 bulan'`; `null` hides the FAQ answer) |
| "Payment links are not active" note | `SITE.showCheckoutPendingNote` |
| iframe auto-resize | `SITE.embedParentOrigin` |

The copy is in `sales/src/copy.ts` and the demo questions in `sales/src/demoQuestions.ts`. After any change, run `npm run sales:build` and check `owner.html`.

## Embedding with an iframe

Fixed height (works everywhere, no setup):

```html
<iframe
  src="https://YOUR-HOST/emt/index.html"
  title="English Mission Town: halaman jualan dan demo permainan"
  style="display:block;width:100%;height:9000px;border:0"
  loading="lazy"
></iframe>
```

On phones the page is longer. Use CSS such as `@media (max-width: 760px) { iframe { height: 12500px } }`, or enable auto-resize:

1. In `config.ts`, set `SITE.embedParentOrigin` to the exact origin of the page that holds the iframe, e.g. `'https://www.example.com'`, then rebuild.
2. On that page, add the listener from `public/embed-example.html`. It accepts height messages only from the sales page's origin and only from that iframe.

Auto-resize is off by default, and the sales page sends nothing unless the origin is set. Tested: the page and the demo load and work inside an iframe on a different origin (local test). Not tested: your real host's response headers. If the host sends `X-Frame-Options: DENY` or a restrictive `frame-ancestors` policy, the iframe will be blocked, so check this on the real host.

## Performance (last build)

- First-load JavaScript: about 406 KB raw, **about 126 KB gzip** (React, the page, the game's art).
- Demo code is loaded separately when the demo comes near the screen, or when the browser is idle: about 76 KB raw, about 26 KB gzip.
- CSS: about 34 KB raw, about 8 KB gzip. Fonts: Latin subsets only, served locally.
- No video, no 3D library, no Lottie. Animations run only while their section is on screen and stop for reduced-motion users.
- Lighthouse has not been run.

## Before publishing: items to confirm

1. **Year-based access for BASIC.** The game currently opens Years 1–3 for everyone. BASIC's "one chosen Year" and "stickers for the purchased Year" need licence and access logic in the game.
2. **Three child profiles for PRO.** The game allows up to 12 local profiles for everyone. Decide the limits per package and enforce them.
3. **Features that already exist for everyone.** Progress summary, next-mission suggestions and export/import exist for every player today. Decide whether they become PRO-only, or adjust the package lists.
4. **Checkout.** Choose a payment provider and add real links. Keep the buttons as `#` until then.
5. **Access period, updates and refund policy.** Nothing is stated now. Confirm, then fill in `SITE.accessDuration` and any terms page.
6. **Reference values (RM25 to RM30 per category, RM160 total).** These are unconfirmed positioning figures, hidden from customers. Approve them before showing them.
7. **Original or promotional prices.** None are shown. Add them only if they are genuine.
8. **Curriculum wording.** The page says "Dibangunkan dengan rujukan kurikulum English sekolah rendah Malaysia." The game's curriculum mappings are still pending teacher review. Never claim KPM approval.
9. **How buyers receive access.** Decide how a purchase becomes access (a link, a code or accounts). The current game has no accounts or licence keys.
10. **Business details.** Add company name, contact, privacy and terms pages as required for selling online in Malaysia.
