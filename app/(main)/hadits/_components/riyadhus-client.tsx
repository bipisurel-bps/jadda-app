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
  const [contentCache, setContentCache] = useState<Record<number, ChapterContent>>({}); // keyed by chapter id
  const [loadingChunks, setLoadingChunks] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterFav, setFilterFav] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  // Load index
  useEffect(() => {
    fetch('/data/riyadhus/index.json')
      .then(r => r.json())
      .then((d: IndexData) => setIndexData(d))
      .catch(() => {});
  }, []);

  // Load favorites
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

  // Determine which chunk a chapter belongs to
  const getChunkNum = useCallback((chapterIdx: number) => {
    return Math.floor(chapterIdx / CHUNK_SIZE) + 1;
  }, []);

  // Load chunk on demand
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

  // When expanding, load content if needed
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

  // Filter chapters
  const filtered = useMemo(() => {
    if (!indexData) return [];
    let list = indexData.chapters;
    // Skip pendahuluan (bab 0) in list but keep searchable
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePageNum = Math.min(page, totalPages);
  const paginatedItems = filtered.slice(
    (safePageNum - 1) * ITEMS_PER_PAGE,
    safePageNum * ITEMS_PER_PAGE
  );

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [search, filterFav]);

  const changePage = (newPage: number) => {
    setPage(newPage);
    setExpandedId(null);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!indexData) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4" ref={listRef}>
      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {indexData.description}
      </p>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari bab..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <button onClick={() => setFilterFav(!filterFav)}
          className={`flex items-center gap-1.5 px-3 rounded-lg border text-sm font-medium transition-all ${
            filterFav ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-muted-foreground hover:bg-muted/50'
          }`}>
          <Star size={14} fill={filterFav ? 'currentColor' : 'none'} />
          <span className="hidden sm:inline">Favorit</span>
        </button>
      </div>

      {/* Count & Pagination Info */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} dari {indexData.totalChapters} bab
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground">
            Halaman {safePageNum}/{totalPages}
          </p>
        )}
      </div>

      {/* Chapter List */}
      <div className="space-y-2">
        {paginatedItems.map((ch) => {
          const isOpen = expandedId === ch.id;
          const content = contentCache[ch.id];
          // Find the original index in full list for chunk calculation
          const chapterIdx = indexData.chapters.findIndex(c => c.id === ch.id);
          const isLoading = !content && isOpen;

          return (
            <motion.div key={ch.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
              <div
                onClick={() => handleExpand(ch, chapterIdx)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  {ch.bab}
                </span>
                <span className="flex-1 text-sm font-medium text-foreground leading-snug">{ch.title}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(ch.id); }}
                  className="flex-shrink-0 p-1 hover:bg-muted/50 rounded">
                  <Star size={14} className={favorites.includes(ch.id) ? 'text-accent fill-accent' : 'text-muted-foreground'} />
                </button>
                {isOpen ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
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
                    <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 size={20} className="animate-spin text-primary" />
                          <span className="ml-2 text-sm text-muted-foreground">Memuat konten...</span>
                        </div>
                      ) : content ? (
                        <>
                          {/* Arabic */}
                          {content.arabic && (
                            <div className="bg-primary/5 rounded-lg p-4">
                              <p className="font-arabic text-lg text-foreground text-right leading-[2.2] whitespace-pre-line" dir="rtl">
                                {content.arabic}
                              </p>
                            </div>
                          )}

                          {/* Translation */}
                          {content.translation && (
                            <div>
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
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
        <div className="text-center py-10 text-muted-foreground text-sm">
          {filterFav ? 'Belum ada bab favorit' : 'Bab tidak ditemukan'}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => changePage(safePageNum - 1)}
            disabled={safePageNum <= 1}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/30'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => changePage(safePageNum + 1)}
            disabled={safePageNum >= totalPages}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Attribution */}
      <p className="text-[10px] text-muted-foreground/60 text-center pt-2">
        Sumber data: github.com/irsyadulibad/hadits-database
      </p>
    </div>
  );
}
