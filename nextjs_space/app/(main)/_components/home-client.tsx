'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen, Star, ChevronRight, ScrollText, Coins, MapPin, Clock,
  Landmark, Compass, Sunrise, CloudSun, Sunset, Moon, Calculator,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { dailyVerses } from '@/lib/quran-verses';

interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const PRAYER_DISPLAY = [
  { key: 'Fajr', label: 'Subuh', Icon: Sunrise, color: 'text-indigo-300' },
  { key: 'Dhuhr', label: 'Dzuhur', Icon: CloudSun, color: 'text-yellow-300' },
  { key: 'Asr', label: 'Ashar', Icon: Sunset, color: 'text-orange-300' },
  { key: 'Maghrib', label: 'Maghrib', Icon: Sunset, color: 'text-red-300' },
  { key: 'Isha', label: 'Isya', Icon: Moon, color: 'text-blue-300' },
];

export default function HomeClient() {
  const [verse, setVerse] = useState({ arabic: '', text: '', source: '' });
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(true);
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const idx = dayOfYear % (dailyVerses?.length ?? 1);
    setVerse(dailyVerses?.[idx] ?? { arabic: '', text: '', source: '' });
  }, []);

  const fetchPrayerTimes = useCallback(async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
      });
      const { latitude, longitude } = pos.coords;
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${latitude}&longitude=${longitude}&method=20`
      );
      const data = await res.json();
      if (data?.code === 200 && data?.data?.timings) {
        const t = data.data.timings;
        setPrayerTimes({
          Fajr: t.Fajr, Dhuhr: t.Dhuhr, Asr: t.Asr,
          Maghrib: t.Maghrib, Isha: t.Isha,
        });
        // Set hijri date label
        const hijri = data.data?.date?.hijri;
        const gregorian = data.data?.date?.gregorian;
        if (hijri && gregorian) {
          const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' });
          const gregStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          setDateLabel(`${dayName}, ${gregStr} / ${hijri.day} ${hijri.month?.en ?? ''} ${hijri.year} H`);
        }
      }
    } catch {
      // Silent fail - prayer times are optional on homepage
    } finally {
      setPrayerLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  return (
    <div className="space-y-6">
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
          <p className="text-2xl md:text-4xl font-arabic mb-2 text-center leading-relaxed opacity-90" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <h1 className="text-2xl md:text-4xl font-display font-bold mt-4 text-center tracking-tight">Assalamu&apos;alaikum!</h1>
          <p className="mt-2 text-sm md:text-base opacity-90 max-w-2xl mx-auto text-center">
            Selamat datang di Jadda &ndash; aplikasi Islami ringkas untuk jadwal sholat, arah kiblat, doa, zakat, waris, dan panduan umrah &amp; haji sesuai Al-Qur&apos;an dan Sunnah.
          </p>

          {/* Prayer Times Strip */}
          <div className="mt-6">
            {dateLabel && (
              <div className="text-center mb-3">
                <span className="inline-block px-4 py-1 rounded-full bg-white/15 text-xs md:text-sm font-medium backdrop-blur-sm">
                  {dateLabel}
                </span>
              </div>
            )}
            {prayerLoading ? (
              <div className="flex justify-center py-3">
                <Loader2 size={20} className="animate-spin opacity-60" />
              </div>
            ) : prayerTimes ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                <div className="grid grid-cols-5 gap-1 text-center">
                  {PRAYER_DISPLAY.map(({ key, label, Icon, color }) => (
                    <div key={key} className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Icon size={14} className={`${color} hidden md:block`} />
                        <span className="text-[10px] md:text-xs font-medium opacity-80">{label}</span>
                      </div>
                      <span className="text-base md:text-xl font-bold font-mono tracking-tight">
                        {(prayerTimes as any)?.[key] ?? '--:--'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
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
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-2">Ayat Hari Ini:</p>
              {verse.arabic && (
                <p className="text-xl md:text-2xl font-arabic text-foreground text-center leading-[2] mb-3" dir="rtl">
                  {verse.arabic}
                </p>
              )}
              <p className="text-sm md:text-base text-foreground italic leading-relaxed">{verse.text}</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{verse.source}</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Featured Cards - Full Width */}
      <div className="space-y-4">
        {/* Waktu Sholat */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Link href="/sholat" className="block">
            <div className="group rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-5 md:p-6 shadow-sm border border-indigo-500/20 hover:shadow-md hover:border-indigo-400/40 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center group-hover:bg-indigo-500/25 transition-colors">
                    <Clock size={22} className="text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base md:text-lg text-foreground">Waktu Sholat &amp; Dzikir</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Jadwal sholat otomatis &amp; pengingat dzikir pagi petang</p>
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
        >
          <Link href="/qibla" className="block">
            <div className="group rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-5 md:p-6 shadow-sm border border-emerald-500/20 hover:shadow-md hover:border-emerald-400/40 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                    <Compass size={22} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base md:text-lg text-foreground">Arah Kiblat</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Kompas digital berbasis GPS &amp; sensor perangkat</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {[
          { href: '/doa', label: 'Doa Harian', desc: 'Kumpulan doa lengkap dari Hisnul Muslim', Icon: BookOpen, bg: 'bg-primary/8', iconBg: 'bg-primary/15', iconColor: 'text-primary', hoverBorder: 'hover:border-primary/30' },
          { href: '/waris', label: 'Hitung Waris', desc: 'Perhitungan faradh sesuai syariat', Icon: Calculator, bg: 'bg-accent/8', iconBg: 'bg-accent/15', iconColor: 'text-accent', hoverBorder: 'hover:border-accent/30' },
          { href: '/hadits', label: 'Hadits Arbain', desc: 'Hadits pokok ajaran Islam pilihan Imam An-Nawawi', Icon: ScrollText, bg: 'bg-blue-500/8', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-500', hoverBorder: 'hover:border-blue-400/30' },
          { href: '/zakat', label: 'Hitung Zakat', desc: 'Hitung zakat maal, fitrah, dagang, tani & ternak', Icon: Coins, bg: 'bg-pink-500/8', iconBg: 'bg-pink-500/15', iconColor: 'text-pink-500', hoverBorder: 'hover:border-pink-400/30' },
          { href: '/umroh', label: 'Panduan Umrah', desc: 'Panduan umrah lengkap dengan doa & bacaan', Icon: MapPin, bg: 'bg-teal-500/8', iconBg: 'bg-teal-500/15', iconColor: 'text-teal-600 dark:text-teal-400', hoverBorder: 'hover:border-teal-400/30' },
          { href: '/haji', label: 'Panduan Haji', desc: 'Tuntunan ringkas ibadah haji sesuai Sunnah', Icon: Landmark, bg: 'bg-amber-500/8', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-600 dark:text-amber-400', hoverBorder: 'hover:border-amber-400/30' },
        ].map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          >
            <Link href={item.href} className="block h-full">
              <div className={`group rounded-xl ${item.bg} p-4 md:p-5 shadow-sm border border-border/50 ${item.hoverBorder} hover:shadow-md transition-all cursor-pointer h-full`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 h-full">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <item.Icon size={20} className={item.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display font-bold text-sm md:text-base text-foreground leading-tight">{item.label}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5 hidden md:block">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground hidden md:block flex-shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
