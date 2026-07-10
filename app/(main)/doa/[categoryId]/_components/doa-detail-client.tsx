'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Share2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layouts/page-header';

interface Prayer {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  label: string;
}

interface Category {
  id: number;
  category_name: string;
  prayers: Prayer[];
}

interface DoaData {
  description: string;
  categories: Category[];
}

export default function DoaDetailClient() {
  const params = useParams();
  const categoryId = parseInt(String(params.categoryId), 10);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/doa100.json')
      .then((r) => r.json())
      .then((data: DoaData) => {
        const found = data.categories.find((c) => c.id === categoryId);
        setCategory(found ?? null);
      })
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const sharePrayer = async (prayer: Prayer) => {
    try {
      await navigator.share({
        text: `${prayer.arabic}\n\n${prayer.transliteration}\n\n"${prayer.translation}"\n\n${prayer.source}`,
      });
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-sm text-muted-foreground">Kategori doa tidak ditemukan</p>
        <Link href="/doa" className="mt-4 text-sm text-primary font-medium">← Kembali ke daftar doa</Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={category.category_name}
        description={`${category.prayers.length} doa`}
        backHref="/doa"
      />

      <div className="mt-4 space-y-3 pb-20">
        {category.prayers.map((prayer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
            className="p-4 rounded-xl bg-card border border-border border-l-[3px] border-l-gold-400/40"
          >
            {/* Arabic */}
            <p className="text-xl leading-[2.2] text-right font-arabic text-foreground mb-3">
              {prayer.arabic}
            </p>

            {/* Transliteration */}
            <p className="text-xs font-semibold text-primary mb-1">Transliterasi:</p>
            <p className="text-sm italic text-foreground/70 mb-3">{prayer.transliteration}</p>

            {/* Translation */}
            <p className="text-xs font-semibold text-muted-foreground mb-1">Terjemah:</p>
            <p className="text-sm leading-relaxed text-foreground/80 mb-3">
              {prayer.translation}
            </p>

            {/* Source */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">{prayer.source}</p>
              <button
                onClick={() => sharePrayer(prayer)}
                className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Share2 size={13} className="text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-30 px-4 py-2.5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link
            href="/doa"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors text-sm font-semibold"
          >
            <ChevronLeft size={16} className="text-primary" />
            <span>Kembali ke Daftar Doa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
