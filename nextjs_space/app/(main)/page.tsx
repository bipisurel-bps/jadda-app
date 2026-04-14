import HomeClient from './_components/home-client';
import { WebsiteJsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Jadda (جدّ) — Waktu Sholat, Doa, Hadits, Zakat, Waris, Umrah & Haji',
  description: 'Jadda — Aplikasi Islami ringkas: jadwal waktu sholat otomatis, pengingat dzikir pagi petang, 309 doa dari Hisnul Muslim, 42 Hadits Arbain, kalkulator zakat & waris, panduan umrah dan haji sesuai Al-Quran dan Sunnah.',
  keywords: ['jadwal sholat', 'waktu adzan', 'doa harian islam', 'hisnul muslim', 'hadits arbain', 'kalkulator zakat', 'kalkulator waris', 'faraidh', 'panduan umrah', 'panduan haji', 'dzikir pagi petang', 'jadda'],
  openGraph: {
    title: 'Jadda (جدّ) — Doa Harian, Hadits, Zakat, Waris & Umrah Islami',
    description: 'Aplikasi Islami ringkas: 309 doa harian Hisnul Muslim, 42 Hadits Arbain, kalkulator zakat & waris, dan panduan umrah sesuai Al-Quran dan Sunnah.',
    type: 'website',
    locale: 'id_ID',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jadda (جدّ) — Aplikasi Islami Ringkas',
    description: 'Doa harian, hadits, kalkulator zakat & waris, panduan umrah sesuai Al-Quran dan Sunnah.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <WebsiteJsonLd baseUrl={baseUrl} />
      <HomeClient />
    </>
  );
}
