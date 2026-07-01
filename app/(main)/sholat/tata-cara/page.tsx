import TataCaraClient from './_components/tata-cara-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Tata Cara Sholat Nabi — Jadda',
  description: 'Panduan tata cara sholat sesuai Sunnah Nabi Muhammad ﷺ — dari takbir hingga salam, lengkap dengan dalil hadits shahih.',
  keywords: ['tata cara sholat', 'sholat nabi', 'sifat sholat nabi', 'cara sholat sunnah', 'panduan sholat', 'sholat sesuai sunnah'],
  openGraph: {
    title: 'Tata Cara Sholat Nabi ﷺ — Jadda',
    description: 'Panduan lengkap tata cara sholat sesuai Sunnah Nabi ﷺ.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function TataCaraPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Sholat', url: `${baseUrl}/sholat` },
        { name: 'Tata Cara Sholat Nabi', url: `${baseUrl}/sholat/tata-cara` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: 'Tata Cara Sholat Nabi',
        description: 'Panduan tata cara sholat sesuai Sunnah Nabi Muhammad ﷺ.',
        inLanguage: 'id',
        isPartOf: { '@type': 'WebApplication', name: 'Jadda', url: baseUrl },
      }} />
      <TataCaraClient />
    </>
  );
}
