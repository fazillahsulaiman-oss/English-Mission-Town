// Curriculum registry. Content packs reference a curriculum version id, so a new
// curriculum (e.g. Kurikulum Persekolahan 2027) can be added as a new pack without
// changing the game engine.

export interface CurriculumVersionInfo {
  id: string;
  name: string;
  description: string;
  /** Status of this registry entry itself. */
  status: 'inUse' | 'plannedNotMapped';
  sourceReferences: { title: string; url: string | null; accessed: string | null; note: string }[];
}

export const CURRICULA: CurriculumVersionInfo[] = [
  {
    id: 'kssr-2017-penjajaran',
    name: 'KSSR (Semakan 2017) with Dokumen Penjajaran — English Level I',
    description:
      'Working reference for this starter content. The implementation details of the alignment document (edition, year of use) have not been verified from the official source in this build.',
    status: 'inUse',
    sourceReferences: [
      {
        title: 'Surat Siaran KPM Bil. 1 Tahun 2025: Pelaksanaan Dokumen Penjajaran KSSR (Semakan 2017)',
        url: 'https://www.moe.gov.my/surat-siaran-kpm-bil-1-tahun-2025-pelaksanaan-dokumen-penjajaran-kurikulum-standard-sekolah-rendah-semakan-2017',
        accessed: null,
        note: 'Could not be accessed from the build environment. Must be checked by a reviewer.',
      },
      {
        title: 'Dokumen Penjajaran KSSR (Semakan 2017) English Level I, Edition 3',
        url: null,
        accessed: null,
        note: 'Named in the product brief. Not inspected. No standard codes have been taken from it.',
      },
      {
        title: 'KPM English DSKP, SK Years 1–3',
        url: null,
        accessed: null,
        note: 'Named in the product brief. Not inspected.',
      },
    ],
  },
  {
    id: 'kurikulum-2027',
    name: 'Kurikulum Persekolahan 2027 (planned)',
    description:
      'Placeholder for the next curriculum. No content is mapped yet. Add a new content pack with this curriculum id when official documents are available.',
    status: 'plannedNotMapped',
    sourceReferences: [
      {
        title: 'Kurikulum Persekolahan 2027',
        url: 'https://www.moe.gov.my/kurikulum-persekolahan-2027',
        accessed: null,
        note: 'Could not be accessed from the build environment. Implementation year not verified.',
      },
    ],
  },
];

export const ACTIVE_CURRICULUM_ID = 'kssr-2017-penjajaran';

export const PENDING_NOTE = 'Pending teacher review: proposed by the content author, not checked against the official document.';
