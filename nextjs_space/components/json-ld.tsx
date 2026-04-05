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
      'Jadda — Aplikasi Islami ringkas berbahasa Indonesia: 309 doa harian dari Hisnul Muslim, 42 Hadits Arbain An-Nawawi, kalkulator zakat (maal, fitrah, perdagangan, pertanian, peternakan), kalkulator waris (faraidh), dan panduan umrah lengkap sesuai Al-Quran dan Sunnah.',
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
      '309 doa harian dari Hisnul Muslim dengan teks Arab, transliterasi, dan terjemahan Indonesia',
      '42 Hadits Arbain An-Nawawi dan Ibnu Rajab',
      'Kalkulator zakat maal, fitrah, perdagangan, pertanian, dan peternakan',
      'Kalkulator waris (faraidh) sesuai hukum Islam',
      'Panduan umrah 10 langkah dengan doa dan bacaan lengkap',
      'Tersedia offline (Progressive Web App)',
    ],
    keywords: 'doa harian islam, hisnul muslim, hadits arbain, kalkulator zakat, kalkulator waris faraidh, panduan umrah, aplikasi islami, doa sehari-hari, dzikir pagi petang',
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
