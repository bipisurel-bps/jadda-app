'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, BookOpen, Heart, Copy, Check, ChevronDown, Bookmark, BookmarkCheck, ListFilter, X, Tag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PrayerCategory, Prayer } from '@/lib/types';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layouts/page-header';

// Accent colors for category icons
const ACCENT_COLORS = [
  { text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { text: 'text-amber-400', bg: 'bg-amber-500/10' },
  { text: 'text-blue-400', bg: 'bg-blue-500/10' },
  { text: 'text-violet-400', bg: 'bg-violet-500/10' },
  { text: 'text-teal-400', bg: 'bg-teal-500/10' },
];

export default function DoaClient() {
  const [data, setData] = useState<PrayerCategory[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/prayers.json')
      .then((res: any) => res?.json?.())
      .then((d: any) => {
        setData(d?.categories ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage?.getItem?.('doa-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setShowCategoryMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveFavorites = useCallback((newFavs: string[]) => {
    setFavorites(newFavs);
    try { localStorage?.setItem?.('doa-favorites', JSON.stringify(newFavs)); } catch {}
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const newFavs = favorites?.includes?.(id)
      ? (favorites?.filter?.((f: string) => f !== id) ?? [])
      : [...(favorites ?? []), id];
    saveFavorites(newFavs);
  }, [favorites, saveFavorites]);

  const copyArabic = useCallback(async (text: string, id: string) => {
    try {
      await navigator?.clipboard?.writeText?.(text ?? '');
      setCopiedId(id);
      toast.success('Teks Arab disalin!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  }, []);

  const toggleCategory = useCallback((catId: number) => {
    setOpenCategory(prev => prev === catId ? null : catId);
  }, []);

  const selectCategory = useCallback((catId: number | null) => {
    setSelectedCategory(catId);
    setShowFavorites(false);
    setShowCategoryMenu(false);
    setOpenCategory(catId);
  }, []);

  const filteredData = useMemo(() => {
    let cats = data ?? [];
    if (selectedCategory !== null) {
      cats = cats?.filter?.((c: PrayerCategory) => c?.id === selectedCategory) ?? [];
    }
    if (search?.trim?.()) {
      const q = search?.toLowerCase?.() ?? '';
      cats = cats?.map?.((c: PrayerCategory) => ({
        ...(c ?? {}),
        prayers: (c?.prayers ?? [])?.filter?.((p: Prayer) =>
          (c?.category_name ?? '')?.toLowerCase?.()?.includes?.(q) ||
          (p?.label ?? '')?.toLowerCase?.()?.includes?.(q) ||
          (p?.transliteration ?? '')?.toLowerCase?.()?.includes?.(q) ||
          (p?.translation ?? '')?.toLowerCase?.()?.includes?.(q)
        ) ?? []
      }))?.filter?.((c: any) => (c?.prayers?.length ?? 0) > 0) ?? [];
    }
    if (showFavorites) {
      cats = cats?.map?.((c: PrayerCategory) => ({
        ...(c ?? {}),
        prayers: (c?.prayers ?? [])?.filter?.((p: Prayer, idx: number) =>
          favorites?.includes?.(`${c?.id}-${idx}`)
        ) ?? []
      }))?.filter?.((c: any) => (c?.prayers?.length ?? 0) > 0) ?? [];
    }
    return cats;
  }, [data, search, selectedCategory, showFavorites, favorites]);

  const totalPrayers = useMemo(() => {
    return filteredData.reduce((sum, cat) => sum + (cat?.prayers?.length ?? 0), 0);
  }, [filteredData]);

  const selectedCategoryName = useMemo(() => {
    if (showFavorites) return 'Favorit';
    if (selectedCategory === null) return 'Semua Kategori';
    return data.find(c => c.id === selectedCategory)?.category_name ?? 'Semua Kategori';
  }, [selectedCategory, showFavorites, data]);

  const totalAllPrayers = useMemo(() => {
    return data.reduce((s, c) => s + c.prayers.length, 0);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a14] flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader
        title="Doa Harian"
        description={`${totalAllPrayers} doa • ${data.length} kategori`}
      />

      <div className="mt-4 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
            <input
              type="text"
              placeholder="Cari doa berdasarkan kata kunci..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e?.target?.value ?? '')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative" ref={categoryMenuRef}>
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-medium text-white/70 hover:bg-white/[0.06] transition-colors w-full sm:w-auto justify-between sm:justify-start min-w-[200px]"
            >
              <ListFilter size={15} className="text-emerald-400 shrink-0" />
              <span className="truncate">{selectedCategoryName}</span>
              <ChevronDown size={14} className={`text-white/35 transition-transform shrink-0 ${showCategoryMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showCategoryMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-2 left-0 right-0 sm:right-auto sm:min-w-[300px] max-h-[60vh] overflow-y-auto rounded-xl bg-[#0a1225] border border-white/[0.08] shadow-lg"
                >
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => selectCategory(null)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedCategory === null && !showFavorites
                          ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                          : 'text-white/70 hover:bg-white/[0.05]'
                      }`}
                    >
                      📖 Semua Kategori
                      <span className="text-xs text-white/35 ml-1">({totalAllPrayers} doa)</span>
                    </button>

                    <button
                      onClick={() => { setShowFavorites(true); setSelectedCategory(null); setShowCategoryMenu(false); setOpenCategory(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        showFavorites
                          ? 'bg-amber-500/10 text-amber-400 font-semibold'
                          : 'text-white/70 hover:bg-white/[0.05]'
                      }`}
                    >
                      <Heart size={13} fill={showFavorites ? 'currentColor' : 'none'} />
                      Favorit
                      <span className="text-xs text-white/35">({favorites.length})</span>
                    </button>

                    <div className="h-px bg-white/[0.06] my-1" />

                    {(data ?? []).map((cat: PrayerCategory) => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                            : 'text-white/70 hover:bg-white/[0.05]'
                        }`}
                      >
                        {cat.category_name}
                        <span className="text-xs text-white/35 ml-1">({cat.prayers.length})</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filter Badge */}
        {(selectedCategory !== null || showFavorites) && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              {showFavorites && <Heart size={12} fill="currentColor" />}
              {selectedCategoryName}
              <button
                onClick={() => { setSelectedCategory(null); setShowFavorites(false); setOpenCategory(null); }}
                className="ml-1 p-0.5 rounded-full hover:bg-emerald-500/20 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
            <span className="text-xs text-white/35">{totalPrayers} doa</span>
          </div>
        )}

        {/* Prayer List */}
        <div className="space-y-2 pb-8">
          {(filteredData?.length ?? 0) === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <BookOpen size={44} className="mx-auto text-white/[0.08] mb-4" />
              <p className="text-sm text-white/50 font-medium">Tidak ada doa ditemukan</p>
              <p className="text-xs text-white/25 mt-1">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            filteredData.map((cat: PrayerCategory) => {
              const isOpen = selectedCategory !== null
                ? true
                : (showFavorites ? true : openCategory === cat.id);

              return (
                <div
                  key={cat.id}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => {
                      if (selectedCategory === null && !showFavorites) {
                        toggleCategory(cat.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-4 md:px-5 transition-colors ${
                      isOpen ? 'bg-emerald-500/[0.04] border-b border-white/[0.06]' : 'hover:bg-white/[0.04]'
                    } ${selectedCategory !== null || showFavorites ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isOpen ? 'bg-emerald-500/15' : 'bg-white/[0.04]'
                      }`}>
                        <BookOpen size={18} className={isOpen ? 'text-emerald-400' : 'text-white/40'} />
                      </div>
                      <div className="text-left">
                        <h2 className="font-display font-bold text-[15px] text-white/85 leading-tight">
                          {cat.category_name}
                        </h2>
                        <p className="text-xs text-white/35 mt-0.5">
                          {cat.prayers.length} doa
                        </p>
                      </div>
                    </div>
                    {selectedCategory === null && !showFavorites && (
                      <ChevronDown
                        size={18}
                        className={`text-white/35 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Prayers inside category */}
                  {isOpen && (
                    <div>
                      {(cat.prayers ?? []).map((prayer: Prayer, pIdx: number) => {
                        const prayerId = `${cat.id}-${pIdx}`;
                        const isFav = favorites?.includes?.(prayerId);
                        const isCopied = copiedId === prayerId;
                        return (
                          <div
                            key={prayerId}
                            className={`p-4 md:px-5 md:py-5 ${
                              pIdx > 0 ? 'border-t border-dashed border-white/[0.04]' : ''
                            }`}
                          >
                            {/* Sub-label */}
                            {prayer.label && (
                              <div className="mb-3 flex items-center gap-2">
                                <Tag size={13} className="text-emerald-400 shrink-0" />
                                <span className="text-sm font-bold text-emerald-400">
                                  {prayer.label}
                                </span>
                              </div>
                            )}

                            {/* Arabic text */}
                            <div className="bg-white/[0.02] rounded-xl p-4 mb-3">
                              <p className="text-xl md:text-2xl font-arabic leading-[2.2] text-white/90 text-right" dir="rtl">
                                {prayer.arabic}
                              </p>
                            </div>

                            {/* Transliteration */}
                            <p className="text-sm text-emerald-400 italic mb-2 leading-relaxed">
                              {prayer.transliteration}
                            </p>

                            {/* Translation */}
                            <p className="text-sm text-white/70 leading-relaxed mb-3">
                              {prayer.translation}
                            </p>

                            {/* Source & Actions */}
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-white/30 bg-white/[0.03] px-2 py-0.5 rounded-full">
                                {prayer.source}
                              </span>
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={() => copyArabic(prayer.arabic ?? '', prayerId)}
                                  className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                                  title="Salin teks Arab"
                                >
                                  {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                                </button>
                                <button
                                  onClick={() => toggleFavorite(prayerId)}
                                  className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                                  title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                >
                                  {isFav ? <BookmarkCheck size={14} className="text-amber-400" /> : <Bookmark size={14} className="text-white/40" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
