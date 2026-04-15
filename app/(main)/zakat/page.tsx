import ZakatClient from './_components/zakat-client';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Kalkulator Zakat Online (Maal, Fitrah, Perdagangan, Pertanian, Peternakan) — Jadda',
  description: 'Hitung zakat maal, fitrah, perdagangan, pertanian, dan peternakan secara online. Dilengkapi nisab terbaru dan panduan lengkap sesuai syariat Islam. Gratis dan mudah digunakan.',
  keywords: ['kalkulator zakat', 'zakat maal', 'zakat fitrah', 'zakat perdagangan', 'zakat pertanian', 'zakat peternakan', 'nisab zakat', 'cara hitung zakat', 'zakat online'],
  openGraph: {
    title: 'Kalkulator Zakat Online Lengkap — Jadda',
    description: 'Hitung zakat maal, fitrah, perdagangan, pertanian, dan peternakan sesuai syariat Islam.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function ZakatPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: baseUrl },
        { name: 'Kalkulator Zakat', url: `${baseUrl}/zakat` },
      ]} />
      <FAQJsonLd faqs={[
        { question: 'Berapa nisab zakat maal?', answer: 'Nisab zakat maal setara dengan 85 gram emas murni. Jika harta yang dimiliki sudah mencapai nisab dan sudah dimiliki selama 1 tahun (haul), maka wajib dikeluarkan zakatnya sebesar 2,5%.' },
        { question: 'Berapa zakat fitrah yang harus dibayar?', answer: 'Zakat fitrah sebesar 2,5 kg atau 3,5 liter beras (atau makanan pokok lainnya) per jiwa, dibayarkan sebelum shalat Idul Fitri.' },
        { question: 'Bagaimana cara menghitung zakat perdagangan?', answer: 'Zakat perdagangan dihitung dari total aset dagang dikurangi hutang jangka pendek. Jika hasilnya mencapai nisab (85 gram emas), maka zakatnya 2,5%.' },
      ]} />
      <ZakatClient />
    </>
  );
}
