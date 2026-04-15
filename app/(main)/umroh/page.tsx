import UmrohClient from './_components/umroh-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Panduan Umrah Lengkap 10 Langkah dengan Doa — Jadda',
  description: 'Panduan ringkas tata cara umrah lengkap 10 langkah: ihram, talbiyah, thawaf, sai, tahallul. Dilengkapi doa dan bacaan Arab, transliterasi latin, dan keterangan praktis sesuai Sunnah.',
  keywords: ['panduan umrah', 'tata cara umrah', 'doa umrah', 'bacaan thawaf', 'bacaan sai', 'ihram', 'talbiyah', 'manasik umrah', 'umrah lengkap'],
  openGraph: {
    title: 'Panduan Umrah Lengkap 10 Langkah dengan Doa — Jadda',
    description: 'Panduan umrah lengkap dengan doa Arab, transliterasi, dan keterangan praktis sesuai Sunnah.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function UmrohPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Panduan Umrah', url: `${baseUrl}/umroh` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Panduan Umrah Lengkap 10 Langkah',
        description: 'Panduan ringkas tata cara umrah sesuai Sunnah Nabi Muhammad ﷺ',
        inLanguage: 'id',
        totalTime: 'PT3H',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Persiapan Sebelum Berangkat' },
          { '@type': 'HowToStep', position: 2, name: 'Miqat & Niat Ihram' },
          { '@type': 'HowToStep', position: 3, name: 'Talbiyah' },
          { '@type': 'HowToStep', position: 4, name: 'Masuk Masjidil Haram' },
          { '@type': 'HowToStep', position: 5, name: 'Thawaf (7 Putaran)' },
          { '@type': 'HowToStep', position: 6, name: 'Shalat 2 Rakaat di Maqam Ibrahim' },
          { '@type': 'HowToStep', position: 7, name: 'Minum Air Zamzam' },
          { '@type': 'HowToStep', position: 8, name: "Sa'i (Shafa — Marwah)" },
          { '@type': 'HowToStep', position: 9, name: 'Tahallul (Cukur/Potong Rambut)' },
          { '@type': 'HowToStep', position: 10, name: 'Selesai & Doa Penutup' },
        ],
      }} />
      <UmrohClient />
    </>
  );
}
