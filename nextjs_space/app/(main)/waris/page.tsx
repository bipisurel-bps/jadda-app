import WarisClient from './_components/waris-client';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Kalkulator Waris Islam (Faraidh) Online — Jadda',
  description: 'Kalkulator pembagian harta waris (faraidh) sesuai hukum Islam. Hitung bagian ahli waris secara otomatis dengan fitur Ashabul Furudh, Ashabah, Hajb, Aul, dan Radd. Gratis dan mudah digunakan.',
  keywords: ['kalkulator waris', 'faraidh', 'pembagian harta waris islam', 'kalkulator warisan', 'hukum waris islam', 'ashabul furudh', 'ashabah', 'bagian ahli waris'],
  openGraph: {
    title: 'Kalkulator Waris Islam (Faraidh) Online — Jadda',
    description: 'Hitung pembagian harta waris sesuai hukum Islam secara otomatis. Gratis dan akurat.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function WarisPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Kalkulator Waris', url: `${baseUrl}/waris` },
      ]} />
      <FAQJsonLd faqs={[
        { question: 'Bagaimana cara menghitung waris dalam Islam?', answer: 'Pembagian waris Islam (faraidh) mengikuti ketentuan Al-Quran Surat An-Nisa ayat 11-12. Setiap ahli waris mendapat bagian yang sudah ditentukan (Ashabul Furudh), kemudian sisanya dibagikan kepada ahli waris Ashabah.' },
        { question: 'Siapa saja yang termasuk ahli waris dalam Islam?', answer: 'Ahli waris dalam Islam meliputi: suami/istri, anak laki-laki dan perempuan, ayah, ibu, saudara laki-laki dan perempuan (sekandung, seayah, seibu), kakek, dan nenek.' },
        { question: 'Apa itu Aul dan Radd dalam waris Islam?', answer: 'Aul terjadi ketika total bagian ahli waris melebihi harta yang ada, sehingga setiap bagian dikurangi secara proporsional. Radd terjadi ketika ada sisa harta setelah semua ahli waris Ashabul Furudh mendapat bagiannya.' },
      ]} />
      <WarisClient />
    </>
  );
}
