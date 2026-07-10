import QuranClient from './_components/quran-client';

export const metadata = {
  title: 'Al-Quran — Jadda',
  description: 'Baca Al-Quran lengkap 114 surah (30 juz) dengan terjemahan bahasa Indonesia. Navigasi per surah, juz, atau halaman.',
};

export default function QuranPage() {
  return <QuranClient />;
}
