import DoaClient from './_components/doa-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Doa Harian Lengkap dari Hisnul Muslim — Jadda',
  description: '310 doa harian Islam dari kitab Hisnul Muslim dalam 161 kategori. Dilengkapi teks Arab, transliterasi latin, terjemahan bahasa Indonesia, dan sumber hadits. Bisa disimpan sebagai favorit.',
  keywords: ['doa harian islam', 'hisnul muslim', 'doa sehari-hari', 'doa arab dan artinya', 'doa bangun tidur', 'doa makan', 'doa bepergian', 'dzikir pagi', 'dzikir petang', 'doa lengkap'],
  openGraph: {
    title: 'Doa Harian Lengkap dari Hisnul Muslim — Jadda',
    description: '310 doa harian dari Hisnul Muslim dengan teks Arab, transliterasi, dan terjemahan Indonesia.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function DoaPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Doa Harian', url: `${baseUrl}/doa` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Doa Harian Lengkap dari Hisnul Muslim',
        description: '310 doa harian Islam dari kitab Hisnul Muslim dalam 161 kategori dengan teks Arab, transliterasi, dan terjemahan Indonesia.',
        inLanguage: 'id',
        isPartOf: { '@type': 'WebApplication', name: 'Jadda', url: baseUrl },
        about: {
          '@type': 'Thing',
          name: 'Hisnul Muslim',
          description: 'Kumpulan doa dan dzikir dari Al-Quran dan Sunnah yang disusun oleh Syaikh Said bin Ali bin Wahf Al-Qahthani.',
        },
      }} />
      <DoaClient />
    </>
  );
}
