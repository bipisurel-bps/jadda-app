'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ChapterIndex {
  id: number;
  bab: number;
  title: string;
}

interface ChapterContent {
  id: number;
  bab: number;
  title: string;
  arabic: string;
  translation: string;
}

interface IndexData {
  title: string;
  author: string;
  description: string;
  totalChapters: number;
  chapters: ChapterIndex[];
}

const CHUNK_SIZE = 50;
const ITEMS_PER_PAGE = 30;

export default function RiyadhusClient() {
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [contentCache, setContentCache] = useState<Record<number, ChapterContent>>({});
  const [loadingChunks, setLoadingChunks] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterFav, setFilterFav] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/riyadhus/index.json')
      .then(r => r.json())
      .then((d: IndexData) => setIndexData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('riyadhus-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleFav = (id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem('riyadhus-favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const getChunkNum = useCallback((chapterIdx: number) => {
    return Math.floor(chapterIdx / CHUNK_SIZE) + 1;
  }, []);

  const loadChunk = useCallback(async (chunkNum: number) => {
    if (loadingChunks.has(chunkNum)) return;
    setLoadingChunks(prev => new Set(prev).add(chunkNum));
    try {
      const resp = await fetch(`/data/riyadhus/chunk-${chunkNum}.json`);
      const chapters: ChapterContent[] = await resp.json();
      setContentCache(prev => {
        const next = { ...prev };
        chapters.forEach(ch => { next[ch.id] = ch; });
        return next;
      });
    } catch {}
    setLoadingChunks(prev => {
      const next = new Set(prev);
      next.delete(chunkNum);
      return next;
    });
  }, [loadingChunks]);

  const handleExpand = useCallback(async (chapter: ChapterIndex, chapterIdx: number) => {
    if (expandedId === chapter.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(chapter.id);
    if (!contentCache[chapter.id]) {
      await loadChunk(getChunkNum(chapterIdx));
    }
  }, [expandedId, contentCache, loadChunk, getChunkNum]);

  const filtered = useMemo(() => {
    if (!indexData) return [];
    let list = indexData.chapters;
    if (filterFav) list = list.filter(ch => favorites.includes(ch.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(ch =>
        ch.title.toLowerCase().includes(q) ||
        String(ch.bab).includes(q)
      );
    }
    return list;
  }, [indexData, search, filterFav, favorites]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePageNum = Math.min(page, totalPages);
  const paginatedItems = filtered.slice(
    (safePageNum - 1) * ITEMS_PER_PAGE,
    safePageNum * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [search, filterFav]);

  const changePage = (newPage: number) => {
    setPage(newPage);
    setExpandedId(null);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!indexData) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-3" ref={listRef}>
      {/* Description */}
      <p className="text-xs text-white/35 leading-relaxed">
        {indexData.description}
      </p>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari bab..."
            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
          />
        </div>
        <button onClick={() => setFilterFav(!filterFav)}
          className={`flex items-center gap-1.5 px-3 rounded-xl border text-sm font-medium transition-all ${
            filterFav ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'border-white/[0.06] text-white/40 hover:bg-white/[0.04]'
          }`}>
          <Star size={14} fill={filterFav ? 'currentColor' : 'none'} />
          <span className="hidden sm:inline">Favorit</span>
        </button>
      </div>

      {/* Count & Pagination Info */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/35">
          {filtered.length} dari {indexData.totalChapters} bab
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-white/35">
            Halaman {safePageNum}/{totalPages}
          </p>
        )}
      </div>

      {/* Chapter List */}
      <div className="space-y-2">
        {paginatedItems.map((ch) => {
          const isOpen = expandedId === ch.id;
          const content = contentCache[ch.id];
          const chapterIdx = indexData.chapters.findIndex(c => c.id === ch.id);
          const isLoading = !content && isOpen;

          return (
            <motion.div key={ch.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
              <div
                onClick={() => handleExpand(ch, chapterIdx)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                  {ch.bab}
                </span>
                <span className="flex-1 text-sm font-medium text-white/80 leading-snug">{ch.title}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(ch.id); }}
                  className="flex-shrink-0 p-1 hover:bg-white/[0.06] rounded">
                  <Star size={14} className={favorites.includes(ch.id) ? 'text-amber-400 fill-amber-400' : 'text-white/30'} />
                </button>
                {isOpen ? <ChevronUp size={16} className="text-white/35 flex-shrink-0" /> : <ChevronDown size={16} className="text-white/35 flex-shrink-0" />}
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 size={20} className="animate-spin text-emerald-400" />
                          <span className="ml-2 text-sm text-white/35">Memuat konten...</span>
                        </div>
                      ) : content ? (
                        <>
                          {content.arabic && (
                            <div className="bg-white/[0.02] rounded-xl p-4">
                              <p className="font-arabic text-lg text-white/90 text-right leading-[2.2] whitespace-pre-line" dir="rtl">
                                {content.arabic}
                              </p>
                            </div>
                          )}

                          {content.translation && (
                            <div>
                              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                                {content.translation}
                              </p>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-10 text-white/35 text-sm">
          {filterFav ? 'Belum ada bab favorit' : 'Bab tidak ditemukan'}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => changePage(safePageNum - 1)}
            disabled={safePageNum <= 1}
            className="p-2 rounded-lg border border-white/[0.06] text-white/35 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => changePage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  p === safePageNum
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-white/35 hover:bg-white/[0.04]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => changePage(safePageNum + 1)}
            disabled={safePageNum >= totalPages}
            className="p-2 rounded-lg border border-white/[0.06] text-white/35 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Attribution */}
      <p className="text-[10px] text-white/[0.15] text-center pt-2">
        Sumber data: github.com/irsyadulibad/hadits-database
      </p>
    </div>
  );
}
