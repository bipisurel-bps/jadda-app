'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Clock, ScrollText, PersonStanding, Search, ChevronRight, ChevronDown,
  BookOpen, ArrowLeft, X, Sparkles
} from 'lucide-react';

interface RincianMakna {
  arabic: string;
  arti: string;
}

interface Variant {
  id: string;
  label: string;
  arabic: string;
  latin: string;
  arti: string;
  rincianMakna?: RincianMakna[];
  penjelasan: string;
  dalil?: string;
}

interface Section {
  id: string;
  title: string;
  icon: string;
  order: number;
  penjelasan_umum?: string;
  dalil?: string;
  variants: Variant[];
}

interface MaknaData {
  sections: Section[];
}

const ICON_BG_MAP: Record<number, string> = {
  1: 'bg-teal-500/10 border-teal-400/20',
  2: 'bg-amber-500/10 border-amber-400/20',
  3: 'bg-rose-500/10 border-rose-400/20',
  4: 'bg-emerald-500/10 border-emerald-400/20',
  5: 'bg-sky-500/10 border-sky-400/20',
  6: 'bg-violet-500/10 border-violet-400/20',
  7: 'bg-amber-600/10 border-amber-500/20',
  8: 'bg-indigo-500/10 border-indigo-400/20',
  9: 'bg-cyan-500/10 border-cyan-400/20',
  10: 'bg-pink-500/10 border-pink-400/20',
  11: 'bg-lime-500/10 border-lime-400/20',
};

export default function MaknaBacaanClient() {
  const [data, setData] = useState<MaknaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ section: Section; variant: Variant }[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/data/makna-bacaan-sholat.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (!term.trim() || !data) {
      setSearchResults([]);
      return;
    }
    const q = term.toLowerCase();
    const results: { section: Section; variant: Variant }[] = [];
    for (const section of data.sections) {
      for (const variant of section.variants) {
        if (
          variant.label.toLowerCase().includes(q) ||
          variant.latin.toLowerCase().includes(q) ||
          variant.arti.toLowerCase().includes(q) ||
          variant.penjelasan.toLowerCase().includes(q) ||
          section.title.toLowerCase().includes(q)
        ) {
          results.push({ section, variant });
        }
      }
    }
    setSearchResults(results);
  }, [data]);

  const navigateToVariant = (section: Section, variant: Variant) => {
    setExpandedSection(section.id);
    setExpandedVariants(new Set([variant.id]));
    setShowSearch(false);
    setSearchTerm('');
    setSearchResults([]);
    setTimeout(() => {
      const el = document.getElementById(`variant-${variant.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  };

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const toggleVariant = (id: string) => {
    setExpandedVariants(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Gagal memuat data. Silakan coba lagi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Top Navigation Tabs */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/sholat"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors whitespace-nowrap"
        >
          <Clock size={16} /> Waktu Sholat
        </Link>
        <Link
          href="/sholat/tata-cara"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors whitespace-nowrap"
        >
          <PersonStanding size={16} /> Tata Cara
        </Link>
        <Link
          href="/sholat/makna-bacaan"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground shadow-sm whitespace-nowrap"
        >
          <ScrollText size={16} /> Makna Bacaan
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-2">
          <Link href="/sholat" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Sholat
          </Link>
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Makna Bacaan Sholat</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Memahami arti setiap lafadz yang kita ucapkan dalam sholat — rincian makna per kata & penjelasan Ulama
        </p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <button
          onClick={() => { setShowSearch(!showSearch); setTimeout(() => searchInputRef.current?.focus(), 100); }}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
        >
          <Search size={16} />
          <span>Cari bacaan atau kata kunci...</span>
        </button>
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-2">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Ketik kata kunci... (contoh: ruku, sujud, iftitah)"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-card border border-primary/30 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                  {searchTerm && (
                    <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X size={16} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto rounded-xl bg-card border border-border/30 divide-y divide-border/10">
                    {searchResults.map((r, i) => (
                      <button
                        key={`${r.section.id}-${r.variant.id}`}
                        onClick={() => navigateToVariant(r.section, r.variant)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/30 transition-colors"
                      >
                        <span className="text-sm">{r.section.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{r.variant.label}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{r.section.title}</p>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
                {searchTerm && searchResults.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">Tidak ditemukan. Coba kata kunci lain.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600/10 via-primary/10 to-teal-600/10 border border-sky-500/10 p-5"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-sky-500" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-foreground">Agar Sholat Lebih Khusyuk</h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Memahami arti bacaan sholat adalah kunci kekhusyukan. Sumber: kitab <em>&quot;Memahami Makna Bacaan Sholat&quot;</em> — Abu Utsman Kharisman (Pustaka Hudaya). Dilengkapi penjelasan dari Syaikh Utsaimin, Ibnu Katsir, dan ulama Ahlus Sunnah lainnya.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="space-y-3">
        {data.sections.map((section, idx) => {
          const isExpanded = expandedSection === section.id;
          const bgColors = ICON_BG_MAP[section.order] || ICON_BG_MAP[1];

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + idx * 0.04 }}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between rounded-xl bg-card border border-border/50 shadow-sm p-4 hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${bgColors}`}>
                    <span className="text-lg">{section.icon}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-bold text-sm text-foreground">{section.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{section.variants.length} bacaan</p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Section Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-3 pl-2 border-l-2 border-primary/20 ml-4">
                      {/* Penjelasan Umum */}
                      {section.penjelasan_umum && (
                        <div className="px-3 py-2 rounded-lg bg-muted/30 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                          {section.penjelasan_umum}
                        </div>
                      )}

                      {/* Dalil section */}
                      {section.dalil && (
                        <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-2 px-3">
                          <BookOpen size={13} className="text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] text-muted-foreground">{section.dalil}</p>
                        </div>
                      )}

                      {/* Variants */}
                      {section.variants.map((variant) => {
                        const isVariantExpanded = expandedVariants.has(variant.id);
                        return (
                          <div key={variant.id} id={`variant-${variant.id}`} className="rounded-lg bg-card/60 border border-border/30 overflow-hidden">
                            <button
                              onClick={() => toggleVariant(variant.id)}
                              className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm font-medium text-foreground truncate">{variant.label}</span>
                              </div>
                              <ChevronRight
                                size={15}
                                className={`text-muted-foreground transition-transform duration-200 flex-shrink-0 ${isVariantExpanded ? 'rotate-90' : ''}`}
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {isVariantExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 space-y-3">
                                    {/* Arabic */}
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Arab</p>
                                      <p className="text-xl font-arabic leading-relaxed text-right" dir="rtl">{variant.arabic}</p>
                                    </div>

                                    {/* Latin */}
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Latin</p>
                                      <p className="text-sm italic text-primary/80 leading-relaxed">{variant.latin}</p>
                                    </div>

                                    {/* Arti */}
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Arti</p>
                                      <p className="text-sm text-foreground/80 leading-relaxed">{variant.arti}</p>
                                    </div>

                                    {/* Rincian Makna per Kata */}
                                    {variant.rincianMakna && variant.rincianMakna.length > 0 && (
                                      <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Rincian Makna Per Kata</p>
                                        <div className="space-y-1.5">
                                          {variant.rincianMakna.map((rm, i) => (
                                            <div key={i} className="flex items-start gap-2 py-1 border-b border-border/20 last:border-0">
                                              <p className="text-sm font-arabic text-right min-w-[60px] leading-relaxed" dir="rtl">{rm.arabic}</p>
                                              <p className="text-[10px] text-muted-foreground pt-0.5">→</p>
                                              <p className="text-xs text-foreground/70 leading-relaxed flex-1">{rm.arti}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Penjelasan */}
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Penjelasan</p>
                                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{variant.penjelasan}</p>
                                    </div>

                                    {/* Dalil */}
                                    {variant.dalil && (
                                      <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-2.5">
                                        <BookOpen size={13} className="text-primary mt-0.5 flex-shrink-0" />
                                        <p className="text-[11px] text-muted-foreground">{variant.dalil}</p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6"
      >
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Sumber: &quot;Memahami Makna Bacaan Sholat — Sebuah Upaya Menikmati Indahnya Berdialog dengan Allah&quot;<br />
          Abu Utsman Kharisman — Penerbit Pustaka Hudaya<br />
          Dengan rujukan tafsir Ibnu Katsir, syarah hadits, dan penjelasan para Ulama Ahlus Sunnah
        </p>
      </motion.div>
    </div>
  );
}
