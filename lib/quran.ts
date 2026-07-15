// Quran data service — fetches from quran-json CDN (same as Android)
const QURAN_JSON_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_id.json';

// Normalize Quranic Unicode (mushaf Utsmani) to standard Arabic
// Fixes display issues with fonts that don't support Quranic orthography
// Mapping: Quranic marks → standard equivalents, or '' for visual-only marks
const QURAN_TO_STANDARD: Record<string, string> = {
  // ── Replace with standard Arabic equivalents ──
  '\u06E1': '\u0652', // Quranic sukun → standard sukun (37K occurrences)
  '\u0657': '\u064B', // Inverted damma → standard fatḥatayn (2.9K)
  '\u065E': '\u064B', // Fatha with two dots → standard fatḥatayn (1.8K)
  '\u06DF': '\u0652', // Small high rounded zero → sukun
  // ── Remove: Quranic notation marks (no standard equivalent) ──
  '\u0656': '',       // Subscript alef (1.9K)
  '\u06E5': '',       // Small waw (1.3K)
  '\u06E6': '',       // Small ya (957)
  '\u06E8': '',       // Small high noon (1)
  '\u06E0': '',       // Small high upright rectangular zero (66)
  '\u06E2': '',       // Small high meem isolate (510)
  '\u06E4': '',       // Small high mad / elongated alef (26)
  '\u06E7': '',       // Small high ya with dots (38)
  '\u06D6': '',       // Wasl / continue sign (1.7K)
  '\u06D7': '',       // Stop sign (511)
  '\u06D8': '',       // Lazim stop (21)
  '\u06DA': '',       // Waqf / pause permitted (2.1K)
  '\u06DB': '',       // Small high 3 dots stop (6)
  '\u06DC': '',       // Small high seen stop (8)
  '\u06EC': '',       // Rounded high stop (2)
  '\u06ED': '',       // Small low meem (99)
  '\u06EA': '',       // Empty centre low stop
  '\u06EB': '',       // Empty centre high stop
};

export function normalizeQuranText(text: string): string {
  let out = text;
  for (const [from, to] of Object.entries(QURAN_TO_STANDARD)) {
    while (out.includes(from)) out = out.replaceAll(from, to);
  }
  return out;
}

export interface SurahItem {
  number: number;
  name: string;
  transliteration: string;
  translation: string;
  revelationType: 'meccan' | 'medinan';
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberGlobal: number;
  arabic: string;
  translation: string;
  sajda: boolean;
}

export interface SurahDetail {
  number: number;
  name: string;
  arabicName: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

// Surah name in Indonesian
const SURAH_NAME_ID: Record<number, string> = {
  1: 'Al-Fatihah', 2: 'Al-Baqarah', 3: 'Ali Imran', 4: 'An-Nisa', 5: 'Al-Maidah',
  6: 'Al-An\'am', 7: 'Al-A\'raf', 8: 'Al-Anfal', 9: 'At-Taubah', 10: 'Yunus',
  11: 'Hud', 12: 'Yusuf', 13: 'Ar-Ra\'d', 14: 'Ibrahim', 15: 'Al-Hijr',
  16: 'An-Nahl', 17: 'Al-Isra\'', 18: 'Al-Kahf', 19: 'Maryam', 20: 'Taha',
  21: 'Al-Anbiya\'', 22: 'Al-Hajj', 23: 'Al-Mu\'minun', 24: 'An-Nur', 25: 'Al-Furqan',
  26: 'Asy-Syu\'ara\'', 27: 'An-Naml', 28: 'Al-Qasas', 29: 'Al-Ankabut', 30: 'Ar-Rum',
  31: 'Luqman', 32: 'As-Sajdah', 33: 'Al-Ahzab', 34: 'Saba\'', 35: 'Fatir',
  36: 'Yasin', 37: 'As-Saffat', 38: 'Sad', 39: 'Az-Zumar', 40: 'Ghafir',
  41: 'Fussilat', 42: 'Asy-Syura', 43: 'Az-Zukhruf', 44: 'Ad-Dukhan', 45: 'Al-Jasiyah',
  46: 'Al-Ahqaf', 47: 'Muhammad', 48: 'Al-Fath', 49: 'Al-Hujurat', 50: 'Qaf',
  51: 'Az-Zariyat', 52: 'At-Tur', 53: 'An-Najm', 54: 'Al-Qamar', 55: 'Ar-Rahman',
  56: 'Al-Waqi\'ah', 57: 'Al-Hadid', 58: 'Al-Mujadilah', 59: 'Al-Hasyr', 60: 'Al-Mumtahanah',
  61: 'As-Saff', 62: 'Al-Jumu\'ah', 63: 'Al-Munafiqun', 64: 'At-Tagabun', 65: 'At-Talaq',
  66: 'At-Tahrim', 67: 'Al-Mulk', 68: 'Al-Qalam', 69: 'Al-Haqqah', 70: 'Al-Ma\'arij',
  71: 'Nuh', 72: 'Al-Jinn', 73: 'Al-Muzzammil', 74: 'Al-Muddassir', 75: 'Al-Qiyamah',
  76: 'Al-Insan', 77: 'Al-Mursalat', 78: 'An-Naba\'', 79: 'An-Nazi\'at', 80: '\'Abasa',
  81: 'At-Takwir', 82: 'Al-Infitar', 83: 'Al-Mutaffifin', 84: 'Al-Insyiqaq', 85: 'Al-Buruj',
  86: 'At-Tariq', 87: 'Al-A\'la', 88: 'Al-Gasyiyah', 89: 'Al-Fajr', 90: 'Al-Balad',
  91: 'Asy-Syams', 92: 'Al-Lail', 93: 'Ad-Duha', 94: 'Al-Insyirah', 95: 'At-Tin',
  96: 'Al-\'Alaq', 97: 'Al-Qadr', 98: 'Al-Bayyinah', 99: 'Az-Zalzalah', 100: 'Al-\'Adiyat',
  101: 'Al-Qari\'ah', 102: 'At-Takasur', 103: 'Al-\'Asr', 104: 'Al-Humazah', 105: 'Al-Fil',
  106: 'Quraisy', 107: 'Al-Ma\'un', 108: 'Al-Kausar', 109: 'Al-Kafirun', 110: 'An-Nasr',
  111: 'Al-Lahab', 112: 'Al-Ikhlas', 113: 'Al-Falaq', 114: 'An-Nas',
};

export function getSurahNameId(number: number): string {
  return SURAH_NAME_ID[number] ?? '';
}

export function getRevelationLabel(type: string): string {
  return type === 'meccan' ? 'Makkiyah' : 'Madaniyah';
}

// Juz map: which surah & ayah each juz starts at
export const JUZ_MAP: { juz: number; surah: number; ayah: number }[] = [
  { juz: 1, surah: 1, ayah: 1 }, { juz: 2, surah: 2, ayah: 142 }, { juz: 3, surah: 2, ayah: 253 },
  { juz: 4, surah: 3, ayah: 93 }, { juz: 5, surah: 4, ayah: 24 }, { juz: 6, surah: 4, ayah: 148 },
  { juz: 7, surah: 5, ayah: 82 }, { juz: 8, surah: 6, ayah: 111 }, { juz: 9, surah: 7, ayah: 88 },
  { juz: 10, surah: 8, ayah: 41 }, { juz: 11, surah: 9, ayah: 93 }, { juz: 12, surah: 11, ayah: 6 },
  { juz: 13, surah: 12, ayah: 53 }, { juz: 14, surah: 15, ayah: 1 }, { juz: 15, surah: 17, ayah: 1 },
  { juz: 16, surah: 18, ayah: 75 }, { juz: 17, surah: 21, ayah: 1 }, { juz: 18, surah: 23, ayah: 1 },
  { juz: 19, surah: 25, ayah: 21 }, { juz: 20, surah: 27, ayah: 56 }, { juz: 21, surah: 29, ayah: 46 },
  { juz: 22, surah: 33, ayah: 31 }, { juz: 23, surah: 36, ayah: 28 }, { juz: 24, surah: 39, ayah: 32 },
  { juz: 25, surah: 41, ayah: 47 }, { juz: 26, surah: 46, ayah: 1 }, { juz: 27, surah: 51, ayah: 31 },
  { juz: 28, surah: 58, ayah: 1 }, { juz: 29, surah: 67, ayah: 1 }, { juz: 30, surah: 78, ayah: 1 },
];

// Surah page starts (standard Madinah mushaf, 604 pages)
export const SURAH_PAGE_STARTS: { surah: number; startPage: number }[] = [
  { surah: 1, startPage: 1 }, { surah: 2, startPage: 2 }, { surah: 3, startPage: 50 },
  { surah: 4, startPage: 77 }, { surah: 5, startPage: 106 }, { surah: 6, startPage: 128 },
  { surah: 7, startPage: 151 }, { surah: 8, startPage: 177 }, { surah: 9, startPage: 187 },
  { surah: 10, startPage: 208 }, { surah: 11, startPage: 221 }, { surah: 12, startPage: 235 },
  { surah: 13, startPage: 249 }, { surah: 14, startPage: 255 }, { surah: 15, startPage: 262 },
  { surah: 16, startPage: 267 }, { surah: 17, startPage: 282 }, { surah: 18, startPage: 293 },
  { surah: 19, startPage: 305 }, { surah: 20, startPage: 312 }, { surah: 21, startPage: 322 },
  { surah: 22, startPage: 332 }, { surah: 23, startPage: 342 }, { surah: 24, startPage: 350 },
  { surah: 25, startPage: 359 }, { surah: 26, startPage: 367 }, { surah: 27, startPage: 377 },
  { surah: 28, startPage: 385 }, { surah: 29, startPage: 396 }, { surah: 30, startPage: 404 },
  { surah: 31, startPage: 411 }, { surah: 32, startPage: 415 }, { surah: 33, startPage: 418 },
  { surah: 34, startPage: 428 }, { surah: 35, startPage: 434 }, { surah: 36, startPage: 440 },
  { surah: 37, startPage: 446 }, { surah: 38, startPage: 453 }, { surah: 39, startPage: 458 },
  { surah: 40, startPage: 467 }, { surah: 41, startPage: 477 }, { surah: 42, startPage: 483 },
  { surah: 43, startPage: 489 }, { surah: 44, startPage: 496 }, { surah: 45, startPage: 499 },
  { surah: 46, startPage: 502 }, { surah: 47, startPage: 507 }, { surah: 48, startPage: 511 },
  { surah: 49, startPage: 515 }, { surah: 50, startPage: 518 }, { surah: 51, startPage: 520 },
  { surah: 52, startPage: 523 }, { surah: 53, startPage: 526 }, { surah: 54, startPage: 528 },
  { surah: 55, startPage: 531 }, { surah: 56, startPage: 534 }, { surah: 57, startPage: 537 },
  { surah: 58, startPage: 542 }, { surah: 59, startPage: 545 }, { surah: 60, startPage: 549 },
  { surah: 61, startPage: 551 }, { surah: 62, startPage: 553 }, { surah: 63, startPage: 554 },
  { surah: 64, startPage: 556 }, { surah: 65, startPage: 559 }, { surah: 66, startPage: 562 },
  { surah: 67, startPage: 564 }, { surah: 68, startPage: 566 }, { surah: 69, startPage: 568 },
  { surah: 70, startPage: 570 }, { surah: 71, startPage: 572 }, { surah: 72, startPage: 574 },
  { surah: 73, startPage: 575 }, { surah: 74, startPage: 576 }, { surah: 75, startPage: 577 },
  { surah: 76, startPage: 578 }, { surah: 77, startPage: 580 }, { surah: 78, startPage: 582 },
  { surah: 79, startPage: 583 }, { surah: 80, startPage: 585 }, { surah: 81, startPage: 586 },
  { surah: 82, startPage: 587 }, { surah: 83, startPage: 588 }, { surah: 84, startPage: 589 },
  { surah: 85, startPage: 590 }, { surah: 86, startPage: 591 }, { surah: 87, startPage: 592 },
  { surah: 88, startPage: 592 }, { surah: 89, startPage: 593 }, { surah: 90, startPage: 593 },
  { surah: 91, startPage: 594 }, { surah: 92, startPage: 595 }, { surah: 93, startPage: 595 },
  { surah: 94, startPage: 595 }, { surah: 95, startPage: 596 }, { surah: 96, startPage: 596 },
  { surah: 97, startPage: 596 }, { surah: 98, startPage: 597 }, { surah: 99, startPage: 598 },
  { surah: 100, startPage: 599 }, { surah: 101, startPage: 599 }, { surah: 102, startPage: 600 },
  { surah: 103, startPage: 601 }, { surah: 104, startPage: 602 }, { surah: 105, startPage: 602 },
  { surah: 106, startPage: 602 }, { surah: 107, startPage: 602 }, { surah: 108, startPage: 603 },
  { surah: 109, startPage: 603 }, { surah: 110, startPage: 603 }, { surah: 111, startPage: 603 },
  { surah: 112, startPage: 604 }, { surah: 113, startPage: 604 }, { surah: 114, startPage: 604 },
];

export function getSurahForPage(page: number): number {
  for (let i = SURAH_PAGE_STARTS.length - 1; i >= 0; i--) {
    if (page >= SURAH_PAGE_STARTS[i].startPage) return SURAH_PAGE_STARTS[i].surah;
  }
  return 1;
}

// Saida (prostration) ayahs
const SAJDA_AYAHS: Record<number, number[]> = {
  7: [206], 13: [15], 16: [50], 17: [109], 19: [58], 22: [18, 77],
  25: [60], 27: [26], 32: [15], 38: [24], 41: [38], 53: [62], 84: [21], 96: [19],
};

export function isSajdaAyah(surahNumber: number, ayahNumber: number): boolean {
  return SAJDA_AYAHS[surahNumber]?.includes(ayahNumber) ?? false;
}

// ── Fetching ──
interface QJVerse {
  id: number;
  text: string;
  translation: string;
}

interface QJSurah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  verses: QJVerse[];
}

let cachedData: { surahs: QJSurah[]; globalAyahOffset: number[] } | null = null;

async function getQuranData() {
  if (cachedData) return cachedData;
  const res = await fetch(QURAN_JSON_URL, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Gagal mengambil data Quran');
  const surahs: QJSurah[] = await res.json();
  const globalAyahOffset: number[] = [];
  let offset = 0;
  for (const s of surahs) {
    globalAyahOffset.push(offset);
    offset += s.total_verses;
  }
  cachedData = { surahs, globalAyahOffset };
  return cachedData;
}

export async function fetchAllSurahs(): Promise<SurahItem[]> {
  const data = await getQuranData();
  return data.surahs.map((s) => ({
    number: s.id,
    name: s.name,
    transliteration: s.transliteration,
    translation: s.translation,
    revelationType: s.type === 'meccan' ? 'meccan' : 'medinan',
    numberOfAyahs: s.total_verses,
  }));
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const data = await getQuranData();
  const surah = data.surahs[surahNumber - 1];
  if (!surah) throw new Error(`Surah ke-${surahNumber} tidak ditemukan`);
  const globalOffset = data.globalAyahOffset[surahNumber - 1];
  const shouldStrip = surahNumber > 1 && surahNumber !== 9;

  const ayahs: Ayah[] = surah.verses.map((v, i) => {
    const raw = v.text;
    const idxAfterBismillah = raw.indexOf('\u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650');
    let arabic = i === 0 && idxAfterBismillah > 0 && shouldStrip
      ? raw.substring(idxAfterBismillah)
      : raw;
    arabic = normalizeQuranText(arabic);
    if (i === 0 && shouldStrip) {
      const basmalahEnd = arabic.indexOf('\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650');
      if (basmalahEnd > 0) {
        const after = arabic.substring(basmalahEnd + 5).trim();
        if (after) arabic = after;
      }
    }
    return {
      number: i + 1,
      numberGlobal: globalOffset + i + 1,
      arabic,
      translation: v.translation,
      sajda: isSajdaAyah(surahNumber, i + 1),
    };
  });

  return {
    number: surahNumber,
    name: surah.transliteration,
    arabicName: surah.name,
    revelationType: surah.type === 'meccan' ? 'meccan' : 'medinan',
    numberOfAyahs: surah.total_verses,
    ayahs,
  };
}
