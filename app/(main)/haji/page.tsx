import HajiClient from './_components/haji-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Panduan Haji Lengkap Sesuai Sunnah — Jadda',
  description: 'Tuntunan ringkas ibadah haji berdasarkan buku Mulakhos Fiqhi karya Syaikh Shaleh bin Fauzan. Meliputi syarat, miqat, ihram, wukuf Arafah, Muzdalifah, lempar jumrah, thawaf, dan doa haji.',
  keywords: ['panduan haji', 'tata cara haji', 'manasik haji', 'doa haji', 'wukuf arafah', 'ihram haji', 'lempar jumrah', 'thawaf ifadhah', 'haji tamattuk', 'rukun haji'],
  openGraph: {
    title: 'Panduan Haji Lengkap Sesuai Sunnah — Jadda',
    description: 'Tuntunan ringkas ibadah haji: syarat, ihram, wukuf, muzdalifah, jumrah, thawaf & doa lengkap.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function HajiPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Panduan Haji', url: `${baseUrl}/haji` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Tuntunan Ringkas Ibadah Haji',
        description: 'Panduan manasik haji berdasarkan buku Mulakhos Fiqhi karya Syaikh Shaleh bin Fauzan Al-Fauzan.',
        inLanguage: 'id',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Syarat & Keutamaan Haji' },
          { '@type': 'HowToStep', position: 2, name: 'Miqat Haji (Waktu & Tempat)' },
          { '@type': 'HowToStep', position: 3, name: 'Tatacara Berihram' },
          { '@type': 'HowToStep', position: 4, name: 'Macam-Macam Haji' },
          { '@type': 'HowToStep', position: 5, name: 'Larangan Saat Ihram' },
          { '@type': 'HowToStep', position: 6, name: 'Sampai di Mekah' },
          { '@type': 'HowToStep', position: 7, name: 'Hari Tarwiyah & Wukuf Arafah' },
          { '@type': 'HowToStep', position: 8, name: 'Mabit di Muzdalifah & Amalan 10 Dzulhijjah' },
          { '@type': 'HowToStep', position: 9, name: 'Hari Tasyrik (Melempar Jumrah)' },
          { '@type': 'HowToStep', position: 10, name: 'Thawaf Wada\'' },
        ],
      }} />
      <HajiClient />
    </>
  );
}
