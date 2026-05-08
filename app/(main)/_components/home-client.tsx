'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { dailyVerses } from '@/lib/quran-verses';
import {
  JaddaSholatIcon,
  JaddaKiblatIcon,
  JaddaDoaIcon,
  JaddaWarisIcon,
  JaddaHaditsIcon,
  JaddaZakatIcon,
  JaddaUmrahIcon,
  JaddaHajiIcon,
} from '@/components/icons/jadda-icons';

export default function HomeClient() {
  const [verse, setVerse] = useState({ text: '', source: '' });

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const idx = dayOfYear % (dailyVerses?.length ?? 1);
    setVerse(dailyVerses?.[idx] ?? { text: '', source: '' });
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 md:p-10 text-primary-foreground"
      >
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <pattern id="islamic" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="400" height="400" fill="url(#islamic)" />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-2xl md:text-3xl font-arabic mb-2 text-right leading-relaxed" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-4 tracking-tight">Assalamu&apos;alaikum!</h1>
          <p className="mt-2 text-sm md:text-base opacity-90 max-w-xl">
            Selamat datang di <strong>Jadda</strong> <span className="font-arabic">(جدّ)</span> — aplikasi Islami ringkas: jadwal sholat, arah kiblat, doa harian, hadits, kalkulator zakat &amp; waris, serta panduan umrah &amp; haji sesuai Al-Qur&apos;an dan Sunnah.
          </p>
        </div>
      </motion.div>

      {/* Daily Verse */}
      {verse?.text ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl bg-card p-5 shadow-sm border border-border/50"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Star size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Ayat Hari Ini</p>
              <p className="text-sm md:text-base text-foreground italic leading-relaxed">{verse?.text}</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{verse?.source}</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Waktu Sholat - New featured card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="md:col-span-2"
        >
          <Link href="/sholat" className="block">
            <div className="group rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-6 shadow-sm border border-indigo-500/20 hover:shadow-md hover:border-indigo-400/40 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaSholatIcon className="w-full h-full" title="Waktu Sholat" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Waktu Sholat &amp; Dzikir</h2>
                    <p className="text-sm text-muted-foreground">Jadwal sholat otomatis &amp; pengingat dzikir pagi petang</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Arah Kiblat */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="md:col-span-2"
        >
          <Link href="/qibla" className="block">
            <div className="group rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 shadow-sm border border-emerald-500/20 hover:shadow-md hover:border-emerald-400/40 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaKiblatIcon className="w-full h-full" title="Arah Kiblat" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Arah Kiblat</h2>
                    <p className="text-sm text-muted-foreground">Kompas digital berbasis GPS &amp; sensor perangkat</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/doa" className="block">
            <div className="group rounded-xl bg-card p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaDoaIcon className="w-full h-full" title="Doa Harian" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Doa Harian</h2>
                    <p className="text-sm text-muted-foreground">Kumpulan doa lengkap dari Hisnul Muslim</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/waris" className="block">
            <div className="group rounded-xl bg-card p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-accent/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaWarisIcon className="w-full h-full" title="Kalkulator Waris" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Kalkulator Waris</h2>
                    <p className="text-sm text-muted-foreground">Perhitungan faraidh sesuai syariat</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/hadits" className="block">
            <div className="group rounded-xl bg-card p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-blue-400/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaHaditsIcon className="w-full h-full" title="Koleksi Hadits" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Koleksi Hadits</h2>
                    <p className="text-sm text-muted-foreground">Arbain An-Nawawi &amp; Riyadhus Shalihin</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/zakat" className="block">
            <div className="group rounded-xl bg-card p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-pink-400/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaZakatIcon className="w-full h-full" title="Kalkulator Zakat" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Kalkulator Zakat</h2>
                    <p className="text-sm text-muted-foreground">Hitung zakat maal, fitrah, dagang, tani &amp; ternak</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-pink-500 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link href="/umroh" className="block">
            <div className="group rounded-xl bg-card p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-teal-400/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaUmrahIcon className="w-full h-full" title="Panduan Umrah" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Panduan Umrah</h2>
                    <p className="text-sm text-muted-foreground">Tata cara umrah lengkap dengan doa &amp; bacaan Arab</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-teal-500 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href="/haji" className="block">
            <div className="group rounded-xl bg-card p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-amber-400/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <JaddaHajiIcon className="w-full h-full" title="Panduan Haji" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">Panduan Haji</h2>
                    <p className="text-sm text-muted-foreground">Tuntunan ringkas ibadah haji sesuai Sunnah</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>


    </div>
  );
}