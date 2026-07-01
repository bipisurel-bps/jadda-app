import MaknaBacaanClient from './_components/makna-bacaan-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Makna Bacaan Sholat — Jadda',
  description: 'Memahami arti dan makna setiap bacaan dalam sholat — dari takbir hingga salam. Dilengkapi rincian makna per kata dan penjelasan dari para ulama.',
  keywords: ['makna bacaan sholat', 'arti bacaan sholat', 'bacaan sholat dan artinya', 'bacaan sholat latin', 'bacaan iftitah', 'bacaan ruku', 'bacaan sujud', 'bacaan tasyahud'],
  openGraph: {
    title: 'Makna Bacaan Sholat — Jadda',
    description: 'Memahami arti dan makna setiap bacaan dalam sholat.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function MaknaBacaanPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Sholat', url: `${baseUrl}/sholat` },
        { name: 'Makna Bacaan Sholat', url: `${baseUrl}/sholat/makna-bacaan` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: 'Makna Bacaan Sholat',
        description: 'Penjelasan makna setiap bacaan dalam sholat dari takbir hingga salam.',
        inLanguage: 'id',
        isPartOf: { '@type': 'WebApplication', name: 'Jadda', url: baseUrl },
      }} />
      <MaknaBacaanClient />
    </>
  );
}
