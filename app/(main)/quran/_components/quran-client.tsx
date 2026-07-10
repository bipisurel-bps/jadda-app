'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, Book, Layers, Grid3X3, ChevronRight, Globe, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchAllSurahs, getSurahNameId, getRevelationLabel, JUZ_MAP, SURAH_PAGE_STARTS, getSurahForPage, SurahItem } from '@/lib/quran';
import { PageHeader } from '@/components/layouts/page-header';
import { Input } from '@/components/ui/input';

type TabMode = 'surah' | 'juz' | 'halaman';

export default function QuranClient() {
  const [surahs, setSurahs] = useState<SurahItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabMode>('surah');

  useEffect(() => {
    fetchAllSurahs()
      .then(setSurahs)
      .catch(() => setError('Gagal memuat daftar surah. Periksa koneksi internet.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return surahs;
    const q = search.toLowerCase();
    return surahs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.transliteration.toLowerCase().includes(q) ||
        getSurahNameId(s.number).toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [surahs, search]);

  const juzList = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const juz = i + 1;
      const entry = JUZ_MAP.find((j) => j.juz === juz);
      const surah = surahs.find((s) => s.number === entry?.surah);
      return {
        juz,
        surahNumber: entry?.surah ?? 0,
        surahName: surah?.name ?? '',
        surahEnglish: surah?.number ? getSurahNameId(surah.number) : '',
        startAyah: entry?.ayah ?? 1,
      };
    });
  }, [surahs]);

  const filteredJuzList = useMemo(() => {
    if (!search.trim()) return juzList;
    const q = search.toLowerCase().trim();
    return juzList.filter(
      (j) =>
        String(j.juz).includes(q) ||
        j.surahName.toLowerCase().includes(q) ||
        j.surahEnglish.toLowerCase().includes(q)
    );
  }, [juzList, search]);

  const pageGroups = useMemo(() => {
    const groups: { juz: number; label: string; pages: number[] }[] = [];
    for (let juz = 1; juz <= 30; juz++) {
      const startPage = (juz - 1) * 20 + 1;
      const endPage = juz === 30 ? 604 : juz * 20;
      const pages: number[] = [];
      for (let p = startPage; p <= endPage; p++) pages.push(p);
      groups.push({ juz, label: `Juz ${juz}`, pages });
    }
    return groups;
  }, []);

  const filteredPageGroups = useMemo(() => {
    if (!search.trim()) return pageGroups;
    const pageNum = parseInt(search.trim(), 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) return [];
    const juz = Math.min(Math.ceil(pageNum / 20), 30);
    const sName = surahs.find((s) => s.number === getSurahForPage(pageNum))?.transliteration ?? '';
    return [{ juz, label: `Juz ${juz} → Halaman ${pageNum} (${sName})`, pages: [pageNum] }];
  }, [pageGroups, search, surahs]);

  const tabs: { key: TabMode; label: string; icon: React.ReactNode }[] = [
    { key: 'surah', label: 'Surah', icon: <Book size={15} /> },
    { key: 'juz', label: 'Juz', icon: <Layers size={15} /> },
    { key: 'halaman', label: 'Halaman', icon: <Grid3X3 size={15} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm text-muted-foreground">Memuat 114 surah...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <X size={24} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Al Quran" description={`${surahs.length} Surah • 30 Juz`} />

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 pr-8 h-10 bg-card border-border text-sm"
            placeholder={tab === 'surah' ? 'Cari surah...' : tab === 'juz' ? 'Cari juz...' : 'Cari halaman (1-604)...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1.5 bg-muted/50 p-1 rounded-lg">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surah List */}
      {tab === 'surah' && (
        <div className="px-4 pb-8">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">Surah tidak ditemukan</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((s, i) => (
                <motion.div
                  key={s.number}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.01 }}
                >
                  <Link
                    href={`/quran/${s.number}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{s.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-foreground font-arabic">{s.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {s.transliteration} ({getSurahNameId(s.number)})
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {getRevelationLabel(s.revelationType) === 'Makkiyah' ? (
                          <><Globe size={10} className="inline mr-1" />Makkiyah</>
                        ) : (
                          <><HomeIcon size={10} className="inline mr-1" />Madaniyah</>
                        )}{' '}
                        • {s.numberOfAyahs} ayat
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Juz List */}
      {tab === 'juz' && (
        <div className="px-4 pb-8">
          {filteredJuzList.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">Juz tidak ditemukan</p>
          ) : (
            <div className="space-y-2">
              {filteredJuzList.map((j, i) => (
                <motion.div
                  key={j.juz}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.01 }}
                >
                  <Link
                    href={`/quran/${j.surahNumber}?juz=${j.juz}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-semibold text-emerald-500">Juz</span>
                      <span className="text-base font-bold text-emerald-500">{j.juz}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-foreground font-arabic">{j.surahName}</p>
                      <p className="text-sm text-muted-foreground truncate">{j.surahEnglish}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Mulai ayat {j.startAyah}</p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Halaman Grid */}
      {tab === 'halaman' && (
        <div className="px-4 pb-8">
          {filteredPageGroups.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">Halaman tidak ditemukan</p>
          ) : (
            <div className="space-y-5">
              {filteredPageGroups.map((group) => (
                <div key={group.juz}>
                  <p className="text-sm font-semibold text-foreground mb-2 ml-1">{group.label}</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {group.pages.map((page) => {
                      const pageSurah = getSurahForPage(page);
                      const surah = surahs.find((s) => s.number === pageSurah);
                      return (
                        <Link
                          key={page}
                          href={`/quran/${pageSurah}?page=${page}`}
                          className="aspect-square rounded-lg bg-card border border-border hover:bg-muted/30 transition-colors flex flex-col items-center justify-center p-1"
                        >
                          <span className="text-sm font-bold text-foreground">{page}</span>
                          <span className="text-[9px] text-primary truncate max-w-full text-center leading-tight">
                            {surah?.transliteration ?? `S.${pageSurah}`}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
