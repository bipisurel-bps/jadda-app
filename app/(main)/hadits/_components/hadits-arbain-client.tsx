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
  kandungan?: string[];
}

interface HadithData {
  title: string;
  description: string;
  hadits: Hadith[];
}

export default function HaditsArbainClient() {
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

  if (!data) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari hadits arbain..."
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

      {/* Count */}
      <p className="text-xs text-white/35">{filtered.length} dari {data.hadits.length} hadits</p>

      {/* Hadith List */}
      <div className="space-y-2">
        {filtered.map((h) => {
          const isOpen = expandedId === h.id;
          return (
            <motion.div key={h.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
              <div
                onClick={() => setExpandedId(isOpen ? null : h.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {h.id}
                </span>
                <span className="flex-1 text-sm font-medium text-white/80">{h.title}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(h.id); }}
                  className="flex-shrink-0 p-1 hover:bg-white/[0.06] rounded">
                  <Star size={14} className={favorites.includes(h.id) ? 'text-amber-400 fill-amber-400' : 'text-white/30'} />
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
                      {/* Arabic */}
                      <div className="bg-white/[0.02] rounded-xl p-4">
                        <p className="font-arabic text-xl text-white/90 text-right leading-[2.2]" dir="rtl">{h.arabic}</p>
                      </div>

                      {/* Translation */}
                      <div>
                        <p className="text-[11px] font-extrabold text-white/30 uppercase tracking-tight mb-1">Terjemahan</p>
                        <p className="text-sm text-white/70 leading-relaxed">{h.translation}</p>
                      </div>

                      {/* Kandungan Hadits */}
                      {h.kandungan && h.kandungan.length > 0 && (
                        <div className="bg-emerald-500/[0.04] border border-emerald-500/10 rounded-xl p-4 space-y-2">
                          <p className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-tight">Kandungan Hadits</p>
                          <ol className="space-y-1.5 list-decimal list-inside">
                            {h.kandungan.map((k, i) => (
                              <li key={i} className="text-sm text-white/70 leading-relaxed">{k}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Narrator & Source */}
                      <div className="flex flex-col sm:flex-row gap-2 text-xs text-white/30">
                        <div className="flex items-center gap-1.5">
                          <BookMarked size={12} />
                          <span>{h.narrator}</span>
                        </div>
                        <span className="hidden sm:inline">&bull;</span>
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
        <div className="text-center py-10 text-white/35 text-sm">
          {filterFav ? 'Belum ada hadits favorit' : 'Hadits tidak ditemukan'}
        </div>
      )}
    </div>
  );
}
