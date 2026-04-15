import SholatClient from './_components/sholat-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Jadwal Waktu Sholat & Pengingat Dzikir Pagi Petang — Jadda',
  description: 'Jadwal waktu sholat (adzan) otomatis berdasarkan lokasi Anda. Dilengkapi pengingat dzikir pagi dan petang setelah Subuh dan Ashar. Gratis dan akurat menggunakan metode Kemenag RI.',
  keywords: ['jadwal sholat', 'waktu adzan', 'jadwal adzan', 'waktu sholat hari ini', 'dzikir pagi', 'dzikir petang', 'pengingat sholat', 'waktu sholat online'],
  openGraph: {
    title: 'Jadwal Waktu Sholat & Pengingat Dzikir — Jadda',
    description: 'Jadwal sholat otomatis berdasarkan lokasi & pengingat dzikir pagi petang.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function SholatPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Waktu Sholat', url: `${baseUrl}/sholat` },
      ]} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Jadwal Waktu Sholat - Jadda',
        description: 'Jadwal waktu sholat otomatis berdasarkan lokasi pengguna dengan pengingat dzikir pagi dan petang.',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web Browser',
        inLanguage: 'id',
        isPartOf: { '@type': 'WebApplication', name: 'Jadda', url: baseUrl },
      }} />
      <SholatClient />
    </>
  );
}
