'use client';

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
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
        // Load bookmarks from localStorage
        try {
          const saved = JSON.parse(localStorage.getItem('quran_bookmarks') || '{}');
          setBookmarks(new Set((saved[String(surahNumber)] || []).map(Number)));
        } catch {}
      })
      .catch(() => setError('Gagal memuat surah.'))
      .finally(() => setLoading(false));
  }, [surahNumber]);

  // Scroll to target
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

      // Save to localStorage
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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-sm text-muted-foreground">{error || 'Surah tidak ditemukan'}</p>
        <Link href="/quran" className="mt-4 text-sm text-primary font-medium">← Kembali ke daftar surah</Link>
      </div>
    );
  }

  const revelationLabel = getRevelationLabel(detail.revelationType);

  return (
    <div>
      <PageHeader title={detail.name} backHref="/quran" />

      {/* Hero */}
      <div className="mx-4 mb-3 p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white text-center">
        <p className="text-xl font-arabic mb-1">{detail.arabicName}</p>
        <p className="text-sm font-semibold opacity-90">
          {detail.name} ({getSurahNameId(surahNumber)})
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">
            {revelationLabel === 'Makkiyah' ? <Globe size={10} /> : <HomeIcon size={10} />}
            {revelationLabel}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">
            {detail.numberOfAyahs} Ayat
          </span>
          {surahJuzList.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">
              <Book size={10} />
              Juz {surahJuzList.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="flex items-center gap-3 mx-4 mb-4">
          <div className="flex-1 h-px bg-border" />
          <p className="text-xl font-arabic text-foreground">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}

      {/* Ayah list */}
      <div className="px-4 pb-20 space-y-3">
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
              className="p-4 rounded-xl bg-card border border-border border-l-[3px] border-l-primary/30"
            >
              {/* Header: ayah number + actions */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{ayah.number}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isSajda && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-[10px] font-semibold text-amber-500">
                      <Bed size={10} /> Sajdah
                    </span>
                  )}
                  <button
                    onClick={() => shareAyah(ayah.arabic, ayah.translation, ayah.number)}
                    className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Share2 size={13} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(ayah.number)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isBookmarked ? 'bg-amber-500/15' : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <Star
                      size={13}
                      className={isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}
                    />
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <p className="text-2xl leading-[2.4] text-right font-arabic text-foreground mb-3">
                {ayah.arabic}
              </p>

              {/* Translation */}
              <p className="text-xs font-semibold text-muted-foreground mb-1">Terjemah:</p>
              <p className="text-sm leading-relaxed text-foreground/80">
                {ayah.translation}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-30 px-4 py-2.5 flex items-center justify-between">
        {prevSurah ? (
          <Link
            href={`/quran/${prevSurah.number}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors text-sm font-semibold"
          >
            <ChevronLeft size={16} className="text-primary" />
            <span className="truncate max-w-[100px]">{prevSurah.transliteration}</span>
          </Link>
        ) : <div />}

        {/* Bookmark count */}
        {bookmarks.size > 0 && (
          <span className="text-xs text-muted-foreground">
            <Star size={12} className="inline text-amber-500 fill-amber-500 mr-1" />
            {bookmarks.size}
          </span>
        )}

        {nextSurah ? (
          <Link
            href={`/quran/${nextSurah.number}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors text-sm font-semibold"
          >
            <span className="truncate max-w-[100px]">{nextSurah.transliteration}</span>
            <ChevronRight size={16} className="text-primary" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
