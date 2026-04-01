'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, BookOpen, Heart, Copy, Check, ChevronDown, ChevronRight, Bookmark, BookmarkCheck, ListFilter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrayerCategory, PrayerData, Prayer } from '@/lib/types';
import { toast } from 'sonner';

export default function DoaClient() {
  const [data, setData] = useState<PrayerCategory[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/prayers.json')
      .then((res: any) => res?.json?.())
      .then((d: any) => {
        const cats = d?.categories ?? [];
        setData(cats);
        setLoading(false);
        // expand all categories by default
        setExpandedCategories(new Set(cats.map((c: PrayerCategory) => c.id)));
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage?.getItem?.('doa-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  // Close category menu on outside click
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

  const toggleCategoryExpand = useCallback((catId: number) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  }, []);

  const selectCategory = useCallback((catId: number | null) => {
    setSelectedCategory(catId);
    setShowFavorites(false);
    setShowCategoryMenu(false);
    if (catId !== null) {
      setExpandedCategories(new Set([catId]));
    } else {
      setExpandedCategories(new Set(data.map(c => c.id)));
    }
  }, [data]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">Doa Harian</h1>
        <p className="text-sm text-muted-foreground mt-1">Kumpulan doa dari Hisnul Muslim untuk aktivitas sehari-hari</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari doa berdasarkan kata kunci..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e?.target?.value ?? '')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative" ref={categoryMenuRef}>
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors w-full sm:w-auto justify-between sm:justify-start min-w-[180px]"
          >
            <ListFilter size={15} className="text-primary shrink-0" />
            <span className="truncate">{selectedCategoryName}</span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform shrink-0 ${showCategoryMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showCategoryMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 mt-2 left-0 right-0 sm:right-auto sm:min-w-[280px] max-h-[400px] overflow-y-auto rounded-xl bg-card border border-border shadow-lg"
              >
                <div className="p-2">
                  {/* Semua */}
                  <button
                    onClick={() => selectCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === null && !showFavorites
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Semua Kategori ({data.reduce((s, c) => s + c.prayers.length, 0)} doa)
                  </button>

                  {/* Favorit */}
                  <button
                    onClick={() => { setShowFavorites(true); setSelectedCategory(null); setShowCategoryMenu(false); setExpandedCategories(new Set(data.map(c => c.id))); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      showFavorites
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Heart size={13} fill={showFavorites ? 'currentColor' : 'none'} />
                    Favorit ({favorites.length})
                  </button>

                  <div className="h-px bg-border my-1.5" />

                  {/* Categories */}
                  {(data ?? []).map((cat: PrayerCategory) => (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{cat.category_name}</span>
                      <span className="text-muted-foreground text-xs ml-2">({cat.prayers.length})</span>
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {showFavorites && <Heart size={12} fill="currentColor" />}
            {selectedCategoryName}
            <button
              onClick={() => { setSelectedCategory(null); setShowFavorites(false); setExpandedCategories(new Set(data.map(c => c.id))); }}
              className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              <X size={11} />
            </button>
          </span>
          <span className="text-xs text-muted-foreground">{totalPrayers} doa</span>
        </div>
      )}

      {/* Prayer List - Grouped by Category */}
      <div className="space-y-4">
        {(filteredData?.length ?? 0) === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-card border border-border">
            <BookOpen size={44} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground font-medium">Tidak ada doa ditemukan</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          filteredData.map((cat: PrayerCategory) => {
            const isExpanded = expandedCategories.has(cat.id);
            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
              >
                {/* Category Header - Collapsible */}
                <button
                  onClick={() => toggleCategoryExpand(cat.id)}
                  className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <h2 className="font-display font-semibold text-base text-foreground leading-tight">
                        {cat.category_name}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cat.prayers.length} doa
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Category Content */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {(cat.prayers ?? []).map((prayer: Prayer, pIdx: number) => {
                      const prayerId = `${cat.id}-${pIdx}`;
                      const isFav = favorites?.includes?.(prayerId);
                      const isCopied = copiedId === prayerId;
                      const hasLabel = !!prayer.label;
                      return (
                        <div
                          key={prayerId}
                          className={`p-4 md:p-5 ${
                            pIdx > 0 ? 'border-t border-border/50' : ''
                          }`}
                        >
                          {/* Sub-label / Prayer title */}
                          {hasLabel && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <h3 className="text-sm font-semibold text-foreground">
                                {prayer.label}
                              </h3>
                            </div>
                          )}

                          {/* Arabic */}
                          <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-4 mb-3">
                            <p className="text-xl md:text-2xl font-arabic leading-[2.2] text-foreground text-right" dir="rtl">
                              {prayer.arabic}
                            </p>
                          </div>

                          {/* Transliteration */}
                          <p className="text-sm text-emerald-700 dark:text-emerald-400 italic mb-2 leading-relaxed">
                            {prayer.transliteration}
                          </p>

                          {/* Translation */}
                          <p className="text-sm text-foreground leading-relaxed mb-3">
                            {prayer.translation}
                          </p>

                          {/* Source & Actions */}
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-foreground/60 font-medium bg-muted/50 px-2 py-0.5 rounded">
                              {prayer.source}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => copyArabic(prayer.arabic ?? '', prayerId)}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                title="Salin teks Arab"
                              >
                                {isCopied ? <Check size={14} className="text-primary" /> : <Copy size={14} className="text-muted-foreground" />}
                              </button>
                              <button
                                onClick={() => toggleFavorite(prayerId)}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                              >
                                {isFav ? <BookmarkCheck size={14} className="text-primary" /> : <Bookmark size={14} className="text-muted-foreground" />}
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
  );
}
