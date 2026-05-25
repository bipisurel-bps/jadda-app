'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, MapPin, Star, ChevronDown, ChevronUp, Loader2, Quote, Users } from 'lucide-react';

interface QuoteItem {
  scholar: string;
  text: string;
}

interface Section {
  title: string;
  content?: string;
  quotes?: QuoteItem[];
}

interface Scholar {
  id: string;
  name: string;
  fullName: string;
  kunyah: string;
  birthYear: string;
  birthPlace: string;
  deathYear: string;
  deathPlace: string;
  age: number;
  masterwork: string;
  color: string;
  sections: Section[];
}

const COLOR_MAP: Record<string, { bg: string; iconBg: string; text: string; border: string; headerBg: string }> = {
  emerald: { bg: 'bg-emerald-500/5', iconBg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', headerBg: 'from-emerald-600/90 to-emerald-700' },
  blue: { bg: 'bg-blue-500/5', iconBg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', headerBg: 'from-blue-600/90 to-blue-700' },
  amber: { bg: 'bg-amber-500/5', iconBg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', headerBg: 'from-amber-600/90 to-amber-700' },
  violet: { bg: 'bg-violet-500/5', iconBg: 'bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/20', headerBg: 'from-violet-600/90 to-violet-700' },
  rose: { bg: 'bg-rose-500/5', iconBg: 'bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', headerBg: 'from-rose-600/90 to-rose-700' },
  teal: { bg: 'bg-teal-500/5', iconBg: 'bg-teal-500/15', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/20', headerBg: 'from-teal-600/90 to-teal-700' },
  sky: { bg: 'bg-sky-500/5', iconBg: 'bg-sky-500/15', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/20', headerBg: 'from-sky-600/90 to-sky-700' },
  indigo: { bg: 'bg-indigo-500/5', iconBg: 'bg-indigo-500/15', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20', headerBg: 'from-indigo-600/90 to-indigo-700' },
};

export default function UlamaDetailClient({ slug }: { slug: string }) {
  const [scholar, setScholar] = useState<Scholar | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('/data/biografi-ulama.json')
      .then(res => res.json())
      .then(data => {
        for (const cat of data.categories) {
          const found = cat.scholars.find((s: any) => s.id === slug);
          if (found) {
            setScholar(found);
            setCatTitle(cat.title);
            setOpenSections(new Set(found.sections.map((_: any, i: number) => i)));
            break;
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const toggleSection = (idx: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Memuat biografi...</p>
      </div>
    );
  }

  if (!scholar) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Biografi tidak ditemukan.</p>
        <Link href="/ulama" className="text-primary text-sm mt-4 inline-block hover:underline">← Kembali ke daftar ulama</Link>
      </div>
    );
  }

  const colors = COLOR_MAP[scholar.color] || COLOR_MAP.emerald;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link href="/ulama" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Biografi Ulama
        </Link>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.headerBg} p-6 md:p-8 text-white`}
      >
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <pattern id="islamic-ulama" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="400" height="400" fill="url(#islamic-ulama)" />
          </svg>
        </div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-sm mb-4">
            {catTitle}
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-bold">{scholar.name}</h1>
          <p className="text-sm opacity-80 mt-1">{scholar.kunyah} — {scholar.fullName}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="opacity-70" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">Lahir</span>
              </div>
              <p className="text-sm font-bold">{scholar.birthYear}</p>
              <p className="text-[11px] opacity-70">{scholar.birthPlace}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="opacity-70" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">Wafat</span>
              </div>
              <p className="text-sm font-bold">{scholar.deathYear}</p>
              <p className="text-[11px] opacity-70">{scholar.deathPlace}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Users size={12} className="opacity-70" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">Usia</span>
              </div>
              <p className="text-sm font-bold">{scholar.age} tahun</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen size={12} className="opacity-70" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">Karya Utama</span>
              </div>
              <p className="text-sm font-bold leading-tight">{scholar.masterwork}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sections (Accordion) */}
      <div className="space-y-3">
        {scholar.sections.map((section, idx) => {
          const isOpen = openSections.has(idx);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.04 }}
              className={`rounded-xl border ${colors.border} overflow-hidden`}
            >
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg ${colors.iconBg} flex items-center justify-center text-xs font-bold ${colors.text}`}>
                    {idx + 1}
                  </span>
                  <h2 className="font-display font-bold text-sm md:text-base text-foreground">{section.title}</h2>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      {section.content && (
                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      )}
                      {section.quotes && section.quotes.length > 0 && (
                        <div className="space-y-3 mt-2">
                          {section.quotes.map((q, qIdx) => (
                            <div key={qIdx} className={`${colors.bg} rounded-lg p-4 border ${colors.border}`}>
                              <div className="flex items-start gap-3">
                                <Quote size={16} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                                <div>
                                  <p className="text-sm text-foreground italic leading-relaxed">"{q.text}"</p>
                                  <p className={`text-xs font-semibold mt-2 ${colors.text}`}>— {q.scholar}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Back link */}
      <div className="pt-4">
        <Link href="/ulama" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft size={14} />
          Lihat semua biografi ulama
        </Link>
      </div>
    </div>
  );
}
