'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, BookOpen, ChevronRight, Loader2, MapPin, Calendar, Star } from 'lucide-react';

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
}

interface Category {
  id: string;
  title: string;
  description: string;
  scholars: Scholar[];
}

interface UlamaData {
  title: string;
  description: string;
  categories: Category[];
}

const COLOR_MAP: Record<string, { bg: string; iconBg: string; text: string; border: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-500/8', iconBg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', ring: 'hover:ring-emerald-500/30' },
  blue: { bg: 'bg-blue-500/8', iconBg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', ring: 'hover:ring-blue-500/30' },
  amber: { bg: 'bg-amber-500/8', iconBg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', ring: 'hover:ring-amber-500/30' },
  violet: { bg: 'bg-violet-500/8', iconBg: 'bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/20', ring: 'hover:ring-violet-500/30' },
  rose: { bg: 'bg-rose-500/8', iconBg: 'bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', ring: 'hover:ring-rose-500/30' },
  teal: { bg: 'bg-teal-500/8', iconBg: 'bg-teal-500/15', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/20', ring: 'hover:ring-teal-500/30' },
  sky: { bg: 'bg-sky-500/8', iconBg: 'bg-sky-500/15', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/20', ring: 'hover:ring-sky-500/30' },
  indigo: { bg: 'bg-indigo-500/8', iconBg: 'bg-indigo-500/15', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20', ring: 'hover:ring-indigo-500/30' },
};

export default function UlamaClient() {
  const [data, setData] = useState<UlamaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/biografi-ulama.json')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Memuat data ulama...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
            <Users size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{data.title}</h1>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      {data.categories.map((cat, catIdx) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + catIdx * 0.1 }}
          className="space-y-4"
        >
          {/* Category Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
              <BookOpen size={18} className="text-accent" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">{cat.title}</h2>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </div>
          </div>

          {/* Scholar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.scholars.map((scholar, i) => {
              const colors = COLOR_MAP[scholar.color] || COLOR_MAP.emerald;
              return (
                <motion.div
                  key={scholar.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <Link href={`/ulama/${scholar.id}`} className="block h-full">
                    <div className={`group rounded-xl ${colors.bg} p-4 md:p-5 border ${colors.border} hover:shadow-md hover:ring-1 ${colors.ring} transition-all h-full`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                          <BookOpen size={18} className={colors.text} />
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground mt-2 transition-colors" />
                      </div>

                      <h3 className="font-display font-bold text-base text-foreground mb-1">{scholar.name}</h3>
                      <p className="text-[11px] text-muted-foreground mb-3 line-clamp-1">{scholar.kunyah}</p>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>{scholar.birthYear} — {scholar.deathYear} ({scholar.age} tahun)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          <span>{scholar.birthPlace}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star size={12} />
                          <span className="font-medium">{scholar.masterwork}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
