'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroHeaderProps {
  hijriDate: string;
  gregorianDate: string;
  cityName?: string;
}

export default function HeroHeader({ hijriDate, gregorianDate, cityName }: HeroHeaderProps) {
  const dateLabel = gregorianDate && hijriDate
    ? `${gregorianDate} / ${hijriDate}`
    : gregorianDate || hijriDate || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 md:p-10 text-primary-foreground"
    >
      {/* Islamic pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <pattern id="islamic-hero" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="400" height="400" fill="url(#islamic-hero)" />
        </svg>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-2xl md:text-4xl font-arabic mb-2 leading-relaxed opacity-90" dir="rtl">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <h1 className="text-2xl md:text-4xl font-display font-bold mt-4 tracking-tight">
          Assalamu&apos;alaikum!
        </h1>
        <p className="mt-2 text-sm md:text-base opacity-90 max-w-2xl mx-auto">
          Selamat datang di Jadda &ndash; aplikasi Islami ringkas untuk jadwal sholat, arah kiblat, doa, zakat, waris, dan panduan umrah &amp; haji sesuai Al-Qur&apos;an dan Sunnah.
        </p>

        {dateLabel && (
          <div className="mt-5">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-xs md:text-sm font-medium backdrop-blur-sm">
              {dateLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
