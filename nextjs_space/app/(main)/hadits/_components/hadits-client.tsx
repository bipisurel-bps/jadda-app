'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, BookMarked, Star } from 'lucide-react';

interface Hadith {
  id: number;
  title: string;
  arabic: string;
  narrator: string;
  translation: string;
  source: string;
}

interface HadithData {
  title: string;
  description: string;
  hadits: Hadith[];
}

export default function HaditsClient() {
  const [data, setData] = useState<HadithData | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterFav, setFilterFav] = useState(false);

  useEffect(() => {
    fetch('/data/hadits-arbain.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hadits-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleFav = (id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem('hadits-favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.hadits;
    if (filterFav) list = list.filter(h => favorites.includes(h.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(h =>
        h.title.toLowerCase().includes(q) ||
        h.translation.toLowerCase().includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        String(h.id).includes(q)
      );
    }
    return list;
  }, [data, search, filterFav, favorites]);

  if (!data) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl text-foreground">Hadits Arbain An-Nawawi</h1>
        <p className="text-sm text-muted-foreground mt-1">42 hadits pokok-pokok ajaran Islam pilihan Imam An-Nawawi &amp; Ibnu Rajab</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari hadits..."
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
      </motion.div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">{filtered.length} dari {data.hadits.length} hadits</p>

      {/* Hadith List */}
      <div className="space-y-2">
        {filtered.map((h) => {
          const isOpen = expandedId === h.id;
          return (
            <motion.div key={h.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
              <div
                onClick={() => setExpandedId(isOpen ? null : h.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {h.id}
                </span>
                <span className="flex-1 text-sm font-medium text-foreground">{h.title}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(h.id); }}
                  className="flex-shrink-0 p-1 hover:bg-muted/50 rounded">
                  <Star size={14} className={favorites.includes(h.id) ? 'text-accent fill-accent' : 'text-muted-foreground'} />
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
                      {/* Arabic */}
                      <div className="bg-primary/5 rounded-lg p-4">
                        <p className="font-arabic text-xl text-foreground text-right leading-[2.2]" dir="rtl">{h.arabic}</p>
                      </div>

                      {/* Translation */}
                      <div>
                        <p className="text-sm text-foreground leading-relaxed">{h.translation}</p>
                      </div>

                      {/* Narrator & Source */}
                      <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <BookMarked size={12} />
                          <span>{h.narrator}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>{h.source}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm">
          {filterFav ? 'Belum ada hadits favorit' : 'Hadits tidak ditemukan'}
        </div>
      )}
    </div>
  );
}
