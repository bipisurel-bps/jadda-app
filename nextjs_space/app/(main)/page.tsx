import HomeClient from './_components/home-client';
import { WebsiteJsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Jadda (جدّ) — Doa Harian, Hadits, Zakat, Waris & Umrah Islami',
  description: 'Jadda — Aplikasi Islami ringkas berbahasa Indonesia: 309 doa harian dari Hisnul Muslim, 42 Hadits Arbain An-Nawawi, kalkulator zakat & waris (faraidh), dan panduan umrah lengkap sesuai Al-Quran dan Sunnah.',
  keywords: ['doa harian islam', 'hisnul muslim', 'hadits arbain', 'kalkulator zakat', 'kalkulator waris', 'faraidh', 'panduan umrah', 'aplikasi islami', 'doa sehari-hari', 'dzikir pagi petang', 'jadda'],
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
