'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Share2, Copy, Check } from 'lucide-react';
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
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showTransliteration, setShowTransliteration] = useState<Record<number, boolean>>({});

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

  const toggleTransliteration = (idx: number) => {
    setShowTransliteration((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyPrayer = async (prayer: Prayer, idx: number) => {
    try {
      await navigator.clipboard.writeText(
        `${prayer.arabic}\n\n${prayer.transliteration}\n\n"${prayer.translation}"\n\n${prayer.source}`
      );
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  };

  const sharePrayer = async (prayer: Prayer) => {
    try {
      await navigator.share({
        text: `${prayer.arabic}\n\n${prayer.transliteration}\n\n"${prayer.translation}"\n\n${prayer.source}`,
      });
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        <p className="mt-3 text-sm text-white/35">Memuat doa...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20 px-4">
        <p className="text-sm text-white/50">Kategori doa tidak ditemukan</p>
        <Link href="/doa" className="mt-4 text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">← Kembali ke daftar doa</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader
        title={category.category_name}
        description={`${category.prayers.length} doa`}
        backHref="/doa"
      />

      <div className="mt-4 space-y-3 pb-24">
        {category.prayers.map((prayer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] border-l-[3px] border-l-amber-500/30 overflow-hidden"
          >
            <div className="p-4">
              {/* Arabic */}
              <p className="text-xl leading-[2.2] text-right font-arabic text-white/90 mb-3" dir="rtl">
                {prayer.arabic}
              </p>

              {/* Transliteration toggle */}
              <button
                onClick={() => toggleTransliteration(i)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 mb-2 transition-colors"
              >
                {showTransliteration[i] ? 'Sembunyikan transliterasi ▲' : 'Tampilkan transliterasi ▼'}
              </button>

              {showTransliteration[i] && (
                <p className="text-sm italic text-white/60 mb-3 bg-white/[0.02] rounded-lg p-3">
                  {prayer.transliteration}
                </p>
              )}

              {/* Translation */}
              <p className="text-[11px] font-extrabold text-white/35 uppercase tracking-tight mb-1">Terjemah</p>
              <p className="text-sm leading-relaxed text-white/70 mb-3">
                {prayer.translation}
              </p>

              {/* Source + Actions */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/30 bg-white/[0.03] px-2 py-0.5 rounded-full">
                  {prayer.source}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => copyPrayer(prayer, i)}
                    className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                    title="Salin"
                  >
                    {copiedIdx === i ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} className="text-white/40" />
                    )}
                  </button>
                  <button
                    onClick={() => sharePrayer(prayer)}
                    className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                    title="Bagikan"
                  >
                    <Share2 size={13} className="text-white/40" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 bg-[#0a1225]/95 backdrop-blur-md border-t border-white/[0.06] z-30 px-4 py-2.5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link
            href="/doa"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm font-semibold text-white/70"
          >
            <ChevronLeft size={16} className="text-emerald-400" />
            <span>Kembali ke Daftar Doa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
