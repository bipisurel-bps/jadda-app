import { Metadata } from 'next';
import UlamaClient from './_components/ulama-client';
import { BreadcrumbJsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Biografi Ulama Islam — Imam Hadits & Ulama Besar | Jadda',
  description: 'Mengenal lebih dekat para ulama besar Islam: Imam Bukhari, Imam Muslim, Imam Abu Dawud, Imam At-Tirmidzi, Imam An-Nasa\'i, dan Imam Ibnu Majah — enam imam penulis Kutub as-Sittah.',
  keywords: ['biografi ulama', 'imam hadits', 'imam bukhari', 'imam muslim', 'imam abu dawud', 'imam tirmidzi', 'imam nasai', 'imam ibnu majah', 'kutub as-sittah', 'ulama islam'],
  openGraph: {
    title: 'Biografi Ulama Islam — Jadda',
    description: 'Mengenal lebih dekat para imam hadits besar penulis Kutub as-Sittah (enam kitab hadits utama).',
  },
};

export default function UlamaPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Beranda', url: '/' },
        { name: 'Biografi Ulama', url: '/ulama' },
      ]} />
      <UlamaClient />
    </>
  );
}
