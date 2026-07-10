import QuranDetailClient from './_components/quran-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Surah ke-${id} — Al-Quran — Jadda`,
    description: `Baca Al-Quran surah ke-${id} dengan terjemahan bahasa Indonesia`,
  };
}

export default function QuranDetailPage() {
  return <QuranDetailClient />;
}
