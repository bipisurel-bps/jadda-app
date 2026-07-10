'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Share2, Globe, Home as HomeIcon, Book, Bed } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchSurahDetail, fetchAllSurahs, getSurahNameId, getRevelationLabel, JUZ_MAP, isSajdaAyah, SurahDetail, SurahItem } from '@/lib/quran';
import { PageHeader } from '@/components/layouts/page-header';

export default function QuranDetailClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const surahNumber = parseInt(String(params.id), 10) || 1;
  const targetJuz = parseInt(searchParams.get('juz') || '0', 10);
  const targetAyah = parseInt(searchParams.get('ayah') || '0', 10);
  const targetPage = parseInt(searchParams.get('page') || '0', 10);

  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [allSurahs, setAllSurahs] = useState<SurahItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([fetchSurahDetail(surahNumber), fetchAllSurahs()])
      .then(([d, s]) => {
        setDetail(d);
        setAllSurahs(s);
        try {
          const saved = JSON.parse(localStorage.getItem('quran_bookmarks') || '{}');
          setBookmarks(new Set((saved[String(surahNumber)] || []).map(Number)));
        } catch {}
      })
      .catch(() => setError('Gagal memuat surah.'))
      .finally(() => setLoading(false));
  }, [surahNumber]);

  useEffect(() => {
    if (!detail || detail.ayahs.length === 0) return;
    let targetIdx = -1;

    if (targetJuz > 0) {
      const juzEntry = JUZ_MAP.find((j) => j.juz === targetJuz);
      if (juzEntry && juzEntry.surah === surahNumber) {
        targetIdx = juzEntry.ayah - 1;
      }
    } else if (targetAyah > 0) {
      targetIdx = targetAyah - 1;
    }

    if (targetIdx >= 0 && targetIdx < detail.ayahs.length) {
      const idx = targetIdx;
      setTimeout(() => {
        ayahRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [detail, targetJuz, targetAyah, surahNumber]);

  const toggleBookmark = (ayahNumber: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(ayahNumber)) next.delete(ayahNumber);
      else next.add(ayahNumber);
      try {
        const saved = JSON.parse(localStorage.getItem('quran_bookmarks') || '{}');
        saved[String(surahNumber)] = Array.from(next);
        localStorage.setItem('quran_bookmarks', JSON.stringify(saved));
      } catch {}
      return next;
    });
  };

  const shareAyah = async (arabic: string, translation: string, ayahNumber: number) => {
    try {
      await navigator.share({
        text: `${arabic}\n\n"${translation}"\n\n— ${detail?.name ?? ''} (${surahNumber}:${ayahNumber})`,
      });
    } catch {}
  };

  const prevSurah = allSurahs.find((s) => s.number === surahNumber - 1);
  const nextSurah = allSurahs.find((s) => s.number === surahNumber + 1);

  const surahJuzList = useMemo(() => {
    return JUZ_MAP.filter((j) => j.surah === surahNumber).map((j) => j.juz);
  }, [surahNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        <p className="mt-3 text-sm text-white/35">Memuat surah...</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20 px-4">
        <p className="text-sm text-white/50">{error || 'Surah tidak ditemukan'}</p>
        <Link href="/quran" className="mt-4 text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">← Kembali ke daftar surah</Link>
      </div>
    );
  }

  const revelationLabel = getRevelationLabel(detail.revelationType);

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title={detail.name} backHref="/quran" />

      {/* Hero card */}
      <div className="mx-4 mt-4 mb-3 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
        <p className="text-xl font-arabic text-white/90 mb-1">{detail.arabicName}</p>
        <p className="text-sm font-semibold text-white/70">
          {detail.name} ({getSurahNameId(surahNumber)})
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-400">
            {revelationLabel === 'Makkiyah' ? <Globe size={10} /> : <HomeIcon size={10} />}
            {revelationLabel}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] text-[11px] font-semibold text-white/60">
            {detail.numberOfAyahs} Ayat
          </span>
          {surahJuzList.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] text-[11px] font-semibold text-white/60">
              <Book size={10} />
              Juz {surahJuzList.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="flex items-center gap-3 mx-4 mb-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <p className="text-xl font-arabic text-white/80">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
      )}

      {/* Ayah list */}
      <div className="px-4 pb-24 space-y-3">
        {detail.ayahs.map((ayah, i) => {
          const isBookmarked = bookmarks.has(ayah.number);
          const isSajda = isSajdaAyah(surahNumber, ayah.number);
          return (
            <motion.div
              key={ayah.number}
              ref={(el) => { ayahRefs.current[i] = el; }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.005, 0.3) }}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] border-l-[3px] border-l-emerald-500/30"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-400">{ayah.number}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isSajda && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-[10px] font-semibold text-amber-400">
                      <Bed size={10} /> Sajdah
                    </span>
                  )}
                  <button
                    onClick={() => shareAyah(ayah.arabic, ayah.translation, ayah.number)}
                    className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                  >
                    <Share2 size={13} className="text-white/40" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(ayah.number)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isBookmarked ? 'bg-amber-500/15' : 'bg-white/[0.04] hover:bg-white/[0.08]'
                    }`}
                  >
                    <Star
                      size={13}
                      className={isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-white/40'}
                    />
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <p className="text-2xl leading-[2.4] text-right font-arabic text-white/90 mb-3" dir="rtl">
                {ayah.arabic}
              </p>

              {/* Translation */}
              <p className="text-[11px] font-extrabold text-white/35 uppercase tracking-tight mb-1">Terjemah</p>
              <p className="text-sm leading-relaxed text-white/70">
                {ayah.translation}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 bg-[#0a1225]/95 backdrop-blur-md border-t border-white/[0.06] z-30 px-4 py-2.5 flex items-center justify-between">
        {prevSurah ? (
          <Link
            href={`/quran/${prevSurah.number}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm font-semibold text-white/70"
          >
            <ChevronLeft size={16} className="text-emerald-400" />
            <span className="truncate max-w-[100px]">{prevSurah.transliteration}</span>
          </Link>
        ) : <div />}

        {bookmarks.size > 0 && (
          <span className="text-xs text-white/35">
            <Star size={12} className="inline text-amber-400 fill-amber-400 mr-1" />
            {bookmarks.size}
          </span>
        )}

        {nextSurah ? (
          <Link
            href={`/quran/${nextSurah.number}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm font-semibold text-white/70"
          >
            <span className="truncate max-w-[100px]">{nextSurah.transliteration}</span>
            <ChevronRight size={16} className="text-emerald-400" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
