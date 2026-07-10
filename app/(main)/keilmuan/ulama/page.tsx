'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ChevronDown, MapPin, BookOpen, Calendar, Users, GraduationCap, Star } from 'lucide-react';

interface UlamaScholar {
  id: string;
  name: string;
  fullName: string;
  kunyah?: string;
  color: string;
  birthPlace?: string;
  birthYear?: string;
  deathYear?: string;
  masterwork?: string;
  category: string;
}

interface UlamaCategory {
  id: string;
  name: string;
  color: string;
  scholars: UlamaScholar[];
}

const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  emerald: { border: 'border-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  blue: { border: 'border-blue-400/30', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  violet: { border: 'border-violet-400/30', text: 'text-violet-400', bg: 'bg-violet-500/10' },
  amber: { border: 'border-amber-400/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  rose: { border: 'border-rose-400/30', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  cyan: { border: 'border-cyan-400/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  orange: { border: 'border-orange-400/30', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  green: { border: 'border-green-400/30', text: 'text-green-400', bg: 'bg-green-500/10' },
  indigo: { border: 'border-indigo-400/30', text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  red: { border: 'border-red-400/30', text: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function UlamaPage() {
  const [data, setData] = useState<UlamaCategory[]>([]);
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/ulama.json')
      .then(r => r.json())
      .then(d => {
        setData(d?.categories ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data
      .map(cat => ({
        ...cat,
        scholars: cat.scholars.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.fullName.toLowerCase().includes(q) ||
          (s.kunyah ?? '').toLowerCase().includes(q) ||
          (s.masterwork ?? '').toLowerCase().includes(q) ||
          (s.birthPlace ?? '').toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.scholars.length > 0);
  }, [data, search]);

  const totalUlama = useMemo(() => data.reduce((s, c) => s + c.scholars.length, 0), [data]);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back nav */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/keilmuan"
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white/85 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Keilmuan
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white/85">Biografi Ulama</h1>
        <p className="text-sm text-white/35 mt-1">
          Mengenal para ulama Islam — {totalUlama} biografi
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative"
      >
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
        <input
          type="text"
          placeholder="Cari ulama berdasarkan nama, karya, atau tempat lahir..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-white/85 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </motion.div>

      {/* Ulama list by category */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-card border border-border">
            <Users size={44} className="mx-auto text-white/35/30 mb-4" />
            <p className="text-sm text-white/35 font-medium">Tidak ada ulama ditemukan</p>
          </div>
        ) : (
          filtered.map((cat) => {
            const isOpen = search ? true : expandedCategories.has(cat.id);
            const styles = colorMap[cat.color] ?? colorMap.emerald;
            return (
              <div key={cat.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-4 transition-colors ${
                    isOpen ? 'bg-primary/5 border-b border-border' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.bg} ${styles.border}`}>
                      <Users size={18} className={styles.text} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-display font-bold text-sm text-white/85">{cat.name}</h3>
                      <p className="text-xs text-white/35">{cat.scholars.length} ulama</p>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-white/35 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-3 space-y-2">
                        {cat.scholars.map((scholar) => {
                          const s = colorMap[scholar.color] ?? colorMap.emerald;
                          return (
                            <Link
                              key={scholar.id}
                              href={`/keilmuan/ulama/${scholar.id}`}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                            >
                              {/* Academic cap icon */}
                              <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${s.bg} ${s.border} flex items-center justify-center`}>
                                <GraduationCap size={18} className={s.text} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-white/85 group-hover:text-primary transition-colors">
                                  {scholar.name}
                                </h4>
                                <p className="text-xs text-white/35">{scholar.fullName}</p>
                                {(scholar.birthYear || scholar.deathYear) && (
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <Calendar size={11} className="text-white/35/50" />
                                    <span className="text-[11px] text-white/35/60">
                                      {scholar.birthYear ?? '?'} — {scholar.deathYear ?? '?'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {(scholar.masterwork ?? scholar.birthPlace) && (
                                <div className="hidden sm:flex flex-col items-end gap-1">
                                  {scholar.masterwork && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.bg} ${s.text}`}>
                                      <BookOpen size={9} />
                                      {scholar.masterwork}
                                    </span>
                                  )}
                                  {scholar.birthPlace && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-white/35/50">
                                      <MapPin size={9} />
                                      {scholar.birthPlace}
                                    </span>
                                  )}
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
