// ===========================================================================
//  SALES PAGE SETTINGS — the only file the owner normally needs to edit.
//  After editing: npm run sales:build  (output in dist-sales/)
//  Owner review page: /owner.html (shows unverified items; never link it publicly).
// ===========================================================================

export type FeatureStatus =
  /** Exists in the current game build. */
  | 'available'
  /** Promised in the offer but not yet built or enforced in the game. Must be finished before selling. */
  | 'needsProductWork';

export interface PackageFeature {
  text: string;
  status: FeatureStatus;
  /** Internal note, shown only on the owner review page. */
  ownerNote?: string;
}

export interface PackageConfig {
  id: 'basic' | 'pro';
  name: string;
  description: string;
  /** Selling price in RM. */
  price: number;
  /** Real previous price in RM. Leave null unless it is a genuine, verifiable price. */
  originalPrice: number | null;
  ctaLabel: string;
  /** Checkout link. Keep '#' until a real checkout exists. */
  ctaHref: string;
  ribbon: string | null;
  featuresIntro: string | null;
  features: PackageFeature[];
}

export const SITE = {
  /** Show prices as a promotion. Requires real originalPrice values for both packages. */
  promotionApproved: false,
  /** Category reference values (RM25 etc.). Both must be true before customers see them. */
  showReferenceValues: false,
  referenceValuesApproved: false,
  /** Set only if the per-Year value is confirmed to be the same for Years 1, 2 and 3 (enables the RM480 PRO total). */
  referenceValuePerYearConfirmed: false,
  /** Access period text, e.g. "12 bulan". null hides the FAQ answer from customers. */
  accessDuration: null as string | null,
  /** Shows a short "payment links are not active yet" note under the prices while checkout links are '#'. */
  showCheckoutPendingNote: true,
  /** Link for the "Cuba Demo" game, if you later want to link the full game. null = use the on-page demo only. */
  productStatus: 'in-development' as 'in-development' | 'ready',
  /**
   * Auto-resize when embedded in an iframe. Set to the exact origin of the parent page,
   * e.g. 'https://www.example.com'. null disables height messages.
   */
  embedParentOrigin: null as string | null,
};

export const PACKAGES: PackageConfig[] = [
  {
    id: 'basic',
    name: 'Pakej BASIC',
    description: 'Untuk fokus pada satu Tahun pilihan.',
    price: 49,
    originalPrice: null,
    ctaLabel: 'Pilih BASIC — RM49',
    ctaHref: '#',
    ribbon: null,
    featuresIntro: null,
    features: [
      { text: 'Akses untuk satu Tahun pilihan: Tahun 1, Tahun 2 atau Tahun 3', status: 'needsProductWork', ownerNote: 'The game currently opens all three Years for everyone. Year-based access is not built yet.' },
      { text: 'Enam kategori pembelajaran', status: 'available' },
      { text: 'Semua format aktiviti yang berkaitan', status: 'available' },
      { text: 'Lapan soalan setiap misi', status: 'available' },
      { text: 'Tiga pilihan tetapan masa', status: 'available' },
      { text: 'Bantuan perkataan', status: 'available' },
      { text: 'Kad markah dan bintang', status: 'available' },
      { text: 'Koleksi sticker bagi Tahun yang dibeli', status: 'needsProductWork', ownerNote: 'Stickers exist, but they are earned per place across all Years, not per purchased Year.' },
      { text: 'Rekod kemajuan pada peranti', status: 'available' },
    ],
  },
  {
    id: 'pro',
    name: 'Pakej PRO',
    description: 'Untuk akses tiga Tahun dan lebih ruang berkembang.',
    price: 89,
    originalPrice: null,
    ctaLabel: 'Pilih PRO — RM89',
    ctaHref: '#',
    ribbon: 'Pilihan Lebih Lengkap',
    featuresIntro: 'Semua ciri BASIC, serta:',
    features: [
      { text: 'Akses Tahun 1, Tahun 2 dan Tahun 3', status: 'available', ownerNote: 'Available today (all Years open), but needs licence logic to differ from BASIC.' },
      { text: 'Pilihan tahap latihan yang lebih luas', status: 'available', ownerNote: 'Follows from three Years of missions.' },
      { text: 'Sehingga tiga profil anak pada peranti yang sama', status: 'needsProductWork', ownerNote: 'The game allows up to 12 local profiles with no package limit. Decide and enforce the limit.' },
      { text: 'Ringkasan kemajuan mengikut anak dan kategori', status: 'available', ownerNote: 'Exists in the Parent & Teacher Area for every player today.' },
      { text: 'Cadangan latihan seterusnya berdasarkan prestasi', status: 'available', ownerNote: 'Exists today for every player (shown after each mission).' },
      { text: 'Export/import rekod kemajuan', status: 'available', ownerNote: 'Exists today for every player in the Parent & Teacher Area.' },
    ],
  },
];

/** Suggested positioning values per category (RM). Unverified: never shown to customers unless approved above. */
export const REFERENCE_VALUES: Record<string, number> = {
  'word-explorer': 25,
  'listen-discover': 25,
  'sentence-builder': 30,
  'grammar-quest': 25,
  'everyday-english': 25,
  'story-adventure': 30,
};

export function referenceValuesVisible(mode: 'customer' | 'owner'): boolean {
  if (mode === 'owner') return true;
  return SITE.showReferenceValues && SITE.referenceValuesApproved;
}

export function promotionActive(): boolean {
  return SITE.promotionApproved && PACKAGES.every((p) => p.originalPrice !== null && p.originalPrice > p.price);
}
