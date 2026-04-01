'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, BookOpen, Heart, Copy, Check, Filter, X, Bookmark, BookmarkCheck } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">Doa Harian</h1>
        <p className="text-sm text-muted-foreground mt-1">Kumpulan doa dari Hisnul Muslim untuk aktivitas sehari-hari</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari doa..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e?.target?.value ?? '')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setShowFavorites(!showFavorites); setSelectedCategory(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showFavorites ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Heart size={12} fill={showFavorites ? 'currentColor' : 'none'} />
            Favorit
          </button>
          <button
            onClick={() => { setSelectedCategory(null); setShowFavorites(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === null && !showFavorites ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Semua
          </button>
          {(data ?? [])?.map?.((cat: PrayerCategory) => (
            <button
              key={cat?.id}
              onClick={() => { setSelectedCategory(cat?.id ?? null); setShowFavorites(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat?.category_name}
            </button>
          )) ?? []}
        </div>
      </motion.div>

      {/* Prayer List */}
      <div className="space-y-6">
        {(filteredData?.length ?? 0) === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">Tidak ada doa ditemukan</p>
          </div>
        ) : (
          filteredData?.map?.((cat: PrayerCategory, catIdx: number) => (
            <div
              key={cat?.id ?? catIdx}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <BookOpen size={12} className="text-primary" />
                </div>
                <h2 className="font-display font-semibold text-base text-foreground">{cat?.category_name}</h2>
              </div>
              {(cat?.prayers ?? [])?.map?.((prayer: Prayer, pIdx: number) => {
                const prayerId = `${cat?.id}-${pIdx}`;
                const isFav = favorites?.includes?.(prayerId);
                const isCopied = copiedId === prayerId;
                return (
                  <div
                    key={prayerId}
                    className="rounded-xl bg-card border border-border/50 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Arabic */}
                    <p className="text-xl md:text-2xl font-arabic leading-[2] text-foreground text-right mb-4" dir="rtl">
                      {prayer?.arabic}
                    </p>
                    {/* Transliteration */}
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 italic mb-2 leading-relaxed">
                      {prayer?.transliteration}
                    </p>
                    {/* Translation */}
                    <p className="text-sm text-foreground mb-3 leading-relaxed">
                      {prayer?.translation}
                    </p>
                    {/* Source & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-[11px] text-foreground/70 font-medium">{prayer?.source}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyArabic(prayer?.arabic ?? '', prayerId)}
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
              }) ?? []}
            </div>
          )) ?? []
        )}
      </div>
    </div>
  );
}