import HaditsTabs from './_components/hadits-tabs';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Koleksi Hadits: Arbain An-Nawawi & Riyadhus Shalihin — Jadda',
  description: 'Kumpulan hadits shahih pilihan: 42 Hadits Arbain An-Nawawi & Ibnu Rajab dan Kitab Riyadhus Shalihin (372 bab). Dilengkapi teks Arab, terjemahan bahasa Indonesia, dan kandungan hadits.',
  keywords: ['hadits arbain', 'hadits nawawi', 'riyadhus shalihin', 'riyadhus sholihin', 'hadits 40', 'hadits pilihan', 'hadits pokok islam', 'arbain nawawi', 'ibnu rajab', 'imam nawawi', 'hadits shahih', 'hadits islam'],
  openGraph: {
    title: 'Koleksi Hadits: Arbain An-Nawawi & Riyadhus Shalihin — Jadda',
    description: 'Kumpulan hadits shahih: Arbain An-Nawawi (42 hadits) dan Riyadhus Shalihin (372 bab) dengan teks Arab dan terjemahan Indonesia.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function HaditsPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Koleksi Hadits', url: `${baseUrl}/hadits` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Koleksi Hadits — Arbain An-Nawawi & Riyadhus Shalihin',
        description: 'Kumpulan hadits shahih pilihan: 42 Hadits Arbain An-Nawawi dan Kitab Riyadhus Shalihin (372 bab).',
        inLanguage: 'id',
        isPartOf: { '@type': 'WebApplication', name: 'Jadda', url: baseUrl },
      }} />
      <HaditsTabs />
    </>
  );
}
