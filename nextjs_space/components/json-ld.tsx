'use client';

export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd({ baseUrl }: { baseUrl: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Jadda (جدّ)',
    alternateName: ['Jadda', 'جدّ', 'Aplikasi Islami Jadda'],
    url: baseUrl,
    description:
      'Jadda — Aplikasi Islami ringkas berbahasa Indonesia: jadwal waktu sholat otomatis, pengingat dzikir pagi petang, 309 doa harian dari Hisnul Muslim, 42 Hadits Arbain An-Nawawi, kalkulator zakat & waris (faraidh), panduan umrah dan haji lengkap sesuai Al-Quran dan Sunnah.',
    applicationCategory: 'ReligiousApp',
    operatingSystem: 'Web Browser',
    inLanguage: 'id',
    author: {
      '@type': 'Organization',
      name: 'Jadda',
      url: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    featureList: [
      'Jadwal waktu sholat otomatis berdasarkan lokasi GPS',
      'Pengingat dzikir pagi dan petang via notifikasi browser',
      '309 doa harian dari Hisnul Muslim dengan teks Arab, transliterasi, dan terjemahan Indonesia',
      '42 Hadits Arbain An-Nawawi dan Ibnu Rajab',
      'Kalkulator zakat maal, fitrah, perdagangan, pertanian, dan peternakan',
      'Kalkulator waris (faraidh) sesuai hukum Islam',
      'Panduan umrah 10 langkah dengan doa dan bacaan lengkap',
      'Panduan haji 10 langkah sesuai Sunnah dengan doa lengkap',
      'Tersedia offline (Progressive Web App)',
    ],
    keywords: 'jadwal sholat, waktu adzan, doa harian islam, hisnul muslim, hadits arbain, kalkulator zakat, kalkulator waris faraidh, panduan umrah, panduan haji, aplikasi islami, dzikir pagi petang',
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}
