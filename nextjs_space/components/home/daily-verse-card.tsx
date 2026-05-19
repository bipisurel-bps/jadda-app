'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { dailyVerses } from '@/lib/quran-verses';

export default function DailyVerseCard() {
  const [verse, setVerse] = useState({ arabic: '', text: '', source: '' });

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const idx = dayOfYear % (dailyVerses?.length ?? 1);
    setVerse(dailyVerses?.[idx] ?? { arabic: '', text: '', source: '' });
  }, []);

  if (!verse?.text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl bg-secondary/10 border border-secondary/20 p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <Star size={14} className="text-accent" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ayat Hari Ini</span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">{verse.source}</span>
      </div>

      {/* Arabic */}
      {verse.arabic && (
        <p className="text-xl md:text-2xl font-arabic text-foreground text-center leading-[2] mb-3" dir="rtl">
          {verse.arabic}
        </p>
      )}

      {/* Translation */}
      <p className="text-sm text-muted-foreground italic leading-relaxed text-center">
        {verse.text}
      </p>
    </motion.div>
  );
}
