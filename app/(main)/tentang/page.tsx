import TentangClient from './_components/tentang-client';

export const metadata = {
  title: 'Tentang Aplikasi Jadda (جدّ) — Aplikasi Islami Ringkas',
  description: 'Jadda adalah aplikasi Islami ringkas berbahasa Indonesia yang menyediakan doa harian, hadits, kalkulator zakat & waris, dan panduan umrah. Gratis, offline-ready, sesuai Al-Quran dan Sunnah.',
  openGraph: {
    title: 'Tentang Jadda — Aplikasi Islami Ringkas',
    description: 'Jadda menyediakan doa harian, hadits, kalkulator zakat & waris, dan panduan umrah. Gratis dan offline-ready.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function TentangPage() {
  return <TentangClient />;
}
