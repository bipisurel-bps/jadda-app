'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, BookOpen, Quote, GraduationCap, Clock } from 'lucide-react';

interface UlamaSection {
  title: string;
  content?: string;
  quotes?: { scholar: string; text: string }[];
}

interface UlamaScholar {
  id: string;
  name: string;
  fullName: string;
  kunyah?: string;
  birthYear?: string;
  birthPlace?: string;
  deathYear?: string;
  deathPlace?: string;
  age?: number;
  masterwork?: string;
  color: string;
  sections: UlamaSection[];
}

interface UlamaCategory {
  id: string;
  title: string;
  description: string;
  scholars: UlamaScholar[];
}

interface UlamaData {
  title: string;
  description: string;
  categories: UlamaCategory[];
}

const colorMap: Record<string, { border: string; text: string; bg: string; gradient: string }> = {
  emerald: { border: 'border-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10', gradient: 'from-emerald-600/10 to-teal-600/5' },
  blue: { border: 'border-blue-400/30', text: 'text-blue-400', bg: 'bg-blue-500/10', gradient: 'from-blue-600/10 to-indigo-600/5' },
  violet: { border: 'border-violet-400/30', text: 'text-violet-400', bg: 'bg-violet-500/10', gradient: 'from-violet-600/10 to-purple-600/5' },
  amber: { border: 'border-amber-400/30', text: 'text-amber-400', bg: 'bg-amber-500/10', gradient: 'from-amber-600/10 to-orange-600/5' },
  rose: { border: 'border-rose-400/30', text: 'text-rose-400', bg: 'bg-rose-500/10', gradient: 'from-rose-600/10 to-pink-600/5' },
  cyan: { border: 'border-cyan-400/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10', gradient: 'from-cyan-600/10 to-blue-600/5' },
  orange: { border: 'border-orange-400/30', text: 'text-orange-400', bg: 'bg-orange-500/10', gradient: 'from-orange-600/10 to-red-600/5' },
  green: { border: 'border-green-400/30', text: 'text-green-400', bg: 'bg-green-500/10', gradient: 'from-green-600/10 to-emerald-600/5' },
  indigo: { border: 'border-indigo-400/30', text: 'text-indigo-400', bg: 'bg-indigo-500/10', gradient: 'from-indigo-600/10 to-blue-600/5' },
  red: { border: 'border-red-400/30', text: 'text-red-400', bg: 'bg-red-500/10', gradient: 'from-red-600/10 to-rose-600/5' },
};

export default function UlamaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [data, setData] = useState<UlamaData | null>(null);
  const [scholar, setScholar] = useState<UlamaScholar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/ulama.json')
      .then(r => r.json())
      .then((d: UlamaData) => {
        setData(d);
        const allScholars = d.categories.flatMap(c => c.scholars);
        const found = allScholars.find(s => s.id === id);
        setScholar(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!scholar) {
    return notFound();
  }

  const styles = colorMap[scholar.color] ?? colorMap.emerald;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      {/* Back nav */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/keilmuan/ulama"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Biografi Ulama
        </Link>
      </motion.div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.gradient} border ${styles.border} p-6`}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 bg-current -translate-y-1/2 translate-x-1/4" style={{ color: `var(--color-${scholar.color})` }} />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${styles.bg} ${styles.border} flex items-center justify-center`}>
              <GraduationCap size={26} className={styles.text} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl md:text-2xl text-foreground">{scholar.name}</h1>
              {scholar.kunyah && (
                <p className="text-sm text-muted-foreground mt-0.5">{scholar.kunyah}</p>
              )}
              <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">{scholar.fullName}</p>
            </div>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            {(scholar.birthYear || scholar.deathYear) && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className={styles.text} />
                <span className="text-xs text-muted-foreground">
                  {scholar.birthYear ?? '?'} — {scholar.deathYear ?? '?'}
                </span>
              </div>
            )}
            {scholar.age && (
              <div className="flex items-center gap-2">
                <Clock size={14} className={styles.text} />
                <span className="text-xs text-muted-foreground">{scholar.age} tahun</span>
              </div>
            )}
            {scholar.birthPlace && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className={styles.text} />
                <span className="text-xs text-muted-foreground">{scholar.birthPlace}</span>
              </div>
            )}
            {scholar.masterwork && (
              <div className="flex items-center gap-2 col-span-2 sm:col-span-3">
                <BookOpen size={14} className={styles.text} />
                <span className="text-xs text-muted-foreground">
                  Karya utama: <span className="font-medium text-foreground/80">{scholar.masterwork}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Biography sections */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        {scholar.sections.map((section, i) => (
          <div
            key={i}
            className={`rounded-2xl bg-card border ${styles.border} p-5`}
          >
            <h3 className={`font-display font-bold text-sm ${styles.text} mb-3`}>
              {section.title}
            </h3>
            {section.content && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            )}
            {section.quotes && section.quotes.length > 0 && (
              <div className="space-y-3">
                {section.quotes.map((q, j) => (
                  <div key={j} className="rounded-xl bg-muted/30 border border-border/50 p-3">
                    <div className="flex items-start gap-2.5">
                      <Quote size={14} className={`${styles.text} mt-0.5 shrink-0`} />
                      <div>
                        <p className="text-xs text-foreground/80 leading-relaxed italic">
                          &ldquo;{q.text}&rdquo;
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                          — {q.scholar}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
