import { Metadata } from 'next';
import UlamaDetailClient from './_components/ulama-detail-client';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { readFileSync } from 'fs';
import path from 'path';

function getScholarData(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'biografi-ulama.json');
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    for (const cat of data.categories) {
      const scholar = cat.scholars.find((s: any) => s.id === slug);
      if (scholar) return { scholar, categoryTitle: cat.title };
    }
  } catch {}
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = getScholarData(params.slug);
  if (!result) {
    return { title: 'Biografi Ulama — Jadda' };
  }
  const { scholar } = result;
  return {
    title: `Biografi ${scholar.name} — ${scholar.fullName} | Jadda`,
    description: `Biografi singkat ${scholar.name} (${scholar.kunyah}), lahir ${scholar.birthYear} di ${scholar.birthPlace}, penulis kitab ${scholar.masterwork}. Wafat ${scholar.deathYear} di ${scholar.deathPlace}.`,
    keywords: [scholar.name.toLowerCase(), scholar.kunyah.toLowerCase(), scholar.masterwork.toLowerCase(), 'biografi ulama', 'imam hadits'],
    openGraph: {
      title: `Biografi ${scholar.name} — Jadda`,
      description: `Mengenal ${scholar.name}, penulis ${scholar.masterwork}`,
    },
  };
}

export default function UlamaDetailPage({ params }: { params: { slug: string } }) {
  const result = getScholarData(params.slug);

  return (
    <>
      {result && (
        <BreadcrumbJsonLd items={[
          { name: 'Beranda', url: '/' },
          { name: 'Biografi Ulama', url: '/ulama' },
          { name: result.scholar.name, url: `/ulama/${params.slug}` },
        ]} />
      )}
      <UlamaDetailClient slug={params.slug} />
    </>
  );
}
