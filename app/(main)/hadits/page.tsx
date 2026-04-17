import HaditsClient from './_components/hadits-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: '42 Hadits Arbain An-Nawawi & Ibnu Rajab — Jadda',
  description: '42 hadits pilihan Imam An-Nawawi dan Ibnu Rajab tentang pokok-pokok ajaran Islam. Dilengkapi teks Arab, perawi, terjemahan bahasa Indonesia, sumber hadits, dan kandungan hadits.',
  keywords: ['hadits arbain', 'hadits nawawi', 'hadits 40', 'hadits pilihan', 'hadits pokok islam', 'arbain nawawi', 'ibnu rajab', 'hadits niat', 'hadits islam'],
  openGraph: {
    title: '42 Hadits Arbain An-Nawawi & Ibnu Rajab — Jadda',
    description: '42 hadits pilihan tentang pokok-pokok ajaran Islam dengan teks Arab, terjemahan Indonesia, dan kandungan hadits.',
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
        { name: 'Hadits Arbain', url: `${baseUrl}/hadits` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '42 Hadits Arbain An-Nawawi & Ibnu Rajab',
        description: '42 hadits pilihan Imam An-Nawawi dan Ibnu Rajab tentang pokok-pokok ajaran Islam.',
        inLanguage: 'id',
        isPartOf: { '@type': 'WebApplication', name: 'Jadda', url: baseUrl },
        numberOfItems: 42,
      }} />
      <HaditsClient />
    </>
  );
}
