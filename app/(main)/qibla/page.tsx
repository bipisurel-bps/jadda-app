import QiblaClient from './_components/qibla-client';
import { BreadcrumbJsonLd, JsonLd } from '@/components/json-ld';

export const metadata = {
  title: 'Arah Kiblat Online (Kompas Digital) — Jadda',
  description:
    'Kompas arah kiblat online berdasarkan lokasi Anda. Menggunakan GPS dan sensor kompas perangkat untuk menunjukkan arah Ka\'bah di Masjidil Haram secara akurat, beserta jarak dari lokasi Anda ke Makkah.',
  keywords: [
    'arah kiblat',
    'qibla',
    'qibla compass',
    'kompas kiblat',
    'kiblat online',
    'arah kiblat otomatis',
    'arah sholat',
    'arah ka\'bah',
    'jarak ke makkah',
    'kiblat gps',
  ],
  openGraph: {
    title: 'Arah Kiblat Online (Kompas Digital) — Jadda',
    description:
      'Kompas kiblat digital berbasis GPS & sensor perangkat. Tentukan arah Ka\'bah dari mana saja.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function QiblaPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://jadda.app';
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: baseUrl },
          { name: 'Arah Kiblat', url: `${baseUrl}/qibla` },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Arah Kiblat - Jadda',
          description:
            'Kompas arah kiblat digital menggunakan GPS dan sensor perangkat untuk menentukan arah Ka\'bah dari lokasi pengguna.',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web Browser',
          inLanguage: 'id',
          isPartOf: { '@type': 'WebApplication', name: 'Jadda', url: baseUrl },
        }}
      />
      <QiblaClient />
    </>
  );
}

export const dynamic = 'force-dynamic';
