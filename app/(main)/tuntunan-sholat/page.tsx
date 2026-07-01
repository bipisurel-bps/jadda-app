import TuntunanSholatClient from './_components/tuntunan-sholat-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Tuntunan Sholat Nabi ﷺ — Jadda',
  description: 'Panduan tata cara sholat sesuai Sunnah Nabi Muhammad ﷺ dan makna setiap bacaan dalam sholat — dari takbir hingga salam.',
  keywords: ['tuntunan sholat', 'tata cara sholat nabi', 'makna bacaan sholat', 'sifat sholat nabi', 'bacaan sholat dan artinya', 'panduan sholat lengkap'],
  openGraph: {
    title: 'Tuntunan Sholat Nabi ﷺ — Jadda',
    description: 'Tata cara sholat sesuai Sunnah & makna setiap bacaan.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function TuntunanSholatPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Tuntunan Sholat Nabi', url: `${baseUrl}/tuntunan-sholat` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: 'Tuntunan Sholat Nabi',
        description: 'Panduan lengkap tata cara sholat sesuai Sunnah Nabi Muhammad ﷺ dan makna setiap bacaan dalam sholat.',
        inLanguage: 'id',
        author: { '@type': 'Organization', name: 'Jadda' },
      }} />
      <TuntunanSholatClient />
    </>
  );
}
