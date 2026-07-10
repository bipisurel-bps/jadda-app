'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { dailyVerses } from '@/lib/quran-verses';

/* ══════════════════════════════════════════
   Accent Palette — matching Android premium theme
   ══════════════════════════════════════════ */
const ACCENT = {
  emerald:  { hex: '#059669', light: '#34D399', dark: '#047857' },
  gold:     { hex: '#D97706', light: '#F59E0B', dark: '#B45309' },
  sapphire: { hex: '#2563EB', light: '#60A5FA', dark: '#1D4ED8' },
  amethyst: { hex: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
  teal:     { hex: '#0D9488', light: '#2DD4BF', dark: '#0F766E' },
} as const;

type AccentKey = keyof typeof ACCENT;

/* ══════════════════════════════════════════
   Prayer Config — matching Android
   ══════════════════════════════════════════ */
const PRAYER_NAMES_AR: Record<string, string> = {
  Fajr: 'صبح', Dhuhr: 'ظهر', Asr: 'عصر', Maghrib: 'مغرب', Isha: 'عشاء',
};
const PRAYER_NAMES_ID: Record<string, string> = {
  Fajr: 'Subuh', Dhuhr: 'Zhuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya',
};
const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerKey = typeof PRAYER_ORDER[number];

const PRAYER_ICONS: Record<PrayerKey, string> = {
  Fajr: '🌙', Dhuhr: '☀️', Asr: '⛅', Maghrib: '🌆', Isha: '🌑',
};

const PRAYER_COLORS: Record<PrayerKey, string> = {
  Fajr: ACCENT.sapphire.hex,
  Dhuhr: ACCENT.gold.dark,
  Asr: ACCENT.amethyst.hex,
  Maghrib: '#DC2626',
  Isha: ACCENT.sapphire.dark,
};

/* ══════════════════════════════════════════
   Date Helper
   ══════════════════════════════════════════ */
const HARI = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

function formatTanggal(): string {
  const now = new Date();
  return `${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`;
}

/* ══════════════════════════════════════════
   Feature Lists — matching Android structure
   ══════════════════════════════════════════ */
const MAIN_FEATURES = [
  { title: 'Waktu Sholat & Dzikir', desc: 'Jadwal Sholat dan pengingat Dzikir', href: '/sholat', icon: '⏰', accent: 'amethyst' as AccentKey },
  { title: 'Arah Kiblat', desc: 'Kompas Digital berbasis GPS', href: '/qibla', icon: '🧭', accent: 'sapphire' as AccentKey },
  { title: 'Doa Harian', desc: 'Doa-doa dari Alquran dan Hadits', href: '/doa', icon: '📖', accent: 'emerald' as AccentKey },
];

const PILIHAN_FEATURES = [
  { title: 'Al-Quran', desc: 'Baca & Tadabur', href: '/quran', icon: '📖', accent: 'amethyst' as AccentKey },
  { title: 'Tuntunan Sholat Nabi ﷺ', desc: 'Tata cara dan makna bacaan sholat', href: '/tuntunan-sholat', icon: '🕌', accent: 'sapphire' as AccentKey },
  { title: 'Hadits', desc: 'Arbain, 7 Sahabat & Kisah dari Hadits', href: '/hadits', icon: '📜', accent: 'emerald' as AccentKey },
  { title: 'Zakat', desc: 'Kalkulator dan Fiqh Zakat', href: '/zakat', icon: '💰', accent: 'amethyst' as AccentKey },
  { title: 'Waris', desc: 'Kalkulator dan Fiqh Waris', href: '/waris', icon: '🧮', accent: 'sapphire' as AccentKey },
  { title: 'Panduan Manasik Umroh', desc: 'Panduan ringkas sesuai sunnah', href: '/umroh', icon: '🕋', accent: 'emerald' as AccentKey },
  { title: 'Panduan Manasik Haji', desc: 'Panduan ringkas sesuai sunnah', href: '/haji', icon: '🕋', accent: 'amethyst' as AccentKey },
  { title: 'Panduan Safar', desc: 'Qashar, jamak, puasa dan adab musafir', href: '/keilmuan/fiqh-safar', icon: '✈️', accent: 'sapphire' as AccentKey },
  { title: 'Panduan Pengurusan Jenazah', desc: 'Panduan Pengurusan Jenazah', href: '/keilmuan/fiqh-jenazah', icon: '🌸', accent: 'emerald' as AccentKey },
];

const LAINNYA_FEATURES = [
  { title: 'Rihlah Al-Quran', desc: 'Sejarah dan kisah Perjalanan Al-Quran', href: '/sirah-alquran', icon: '📚', accent: 'amethyst' as AccentKey },
  { title: 'Fadhilah Amal', desc: 'Amalan Ringan berpahala besar', href: '/fadhilah-amal', icon: '⭐', accent: 'sapphire' as AccentKey },
  { title: 'Biografi Ulama', desc: 'Mengenal para imam dan ulama besar', href: '/keilmuan/ulama', icon: '👥', accent: 'emerald' as AccentKey },
  { title: 'Dzikir Pagi & Petang', desc: 'Bacaan dzikir dari Al-Quran & Sunnah', href: '/dzikir', icon: '🌅', accent: 'teal' as AccentKey },
];

/* ══════════════════════════════════════════
   GlassFeatureCard — matching Android 2-col
   ══════════════════════════════════════════ */
function GlassFeatureCard({
  title, icon, accent, href, isDark,
}: {
  title: string; icon: string; accent: AccentKey; href: string; isDark: boolean;
}) {
  const a = ACCENT[accent];
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-[14px] py-3.5 px-3.5 transition-all duration-200 ${
        isDark
          ? 'bg-[#1E293B] hover:bg-[#1E293B]/90'
          : 'bg-white hover:bg-gray-50/90'
      } ${isDark ? 'shadow-none' : 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]'}`}
      style={{
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 text-lg"
        style={{
          backgroundColor: isDark
            ? `${a.hex}22`
            : `${a.hex}1A`,
        }}
      >
        {icon}
      </div>
      <span
        className="text-[13px] font-bold leading-[18px] flex-1 line-clamp-3"
        style={{ color: isDark ? '#F1F5F9' : '#0F172A' }}
      >
        {title}
      </span>
    </Link>
  );
}

/* ══════════════════════════════════════════
   Prayer Pill
   ══════════════════════════════════════════ */
function PrayerPill({
  nameAr, nameId, time, icon, isActive, color, isDark,
}: {
  nameAr: string; nameId: string; time: string; icon: string; isActive: boolean; color: string; isDark: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 px-3.5 rounded-xl transition-all duration-200 ${
        isActive
          ? isDark ? 'bg-white/10 border-white/15' : 'bg-gray-50 border-gray-200'
          : ''
      }`}
      style={{
        border: isActive ? `1px solid ${color}30` : '1px solid transparent',
        backgroundColor: isActive ? (isDark ? `${color}12` : `${color}08`) : 'transparent',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-base">{icon}</span>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: isActive ? (isDark ? '#F1F5F9' : '#0F172A') : isDark ? '#94A3B8' : '#9CA3AF' }}>
            {nameAr} ({nameId})
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>
            {time}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Section Header
   ══════════════════════════════════════════ */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-[15px] font-extrabold text-white/90 tracking-tight">{title}</h2>
      {subtitle && <p className="text-[12px] text-white/35 mt-0.5">{subtitle}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */
export default function HomeClient() {
  const [verse, setVerse] = useState({ text: '', source: '' });
  const [isDark, setIsDark] = useState(true);
  const today = useMemo(() => formatTanggal(), []);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const idx = dayOfYear % (dailyVerses?.length ?? 1);
    setVerse(dailyVerses?.[idx] ?? { text: '', source: '' });

    // Detect theme
    const html = document.documentElement;
    setIsDark(!html.classList.contains('light'));
    const observer = new MutationObserver(() => {
      setIsDark(!html.classList.contains('light'));
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Prayer times — using static sample for demo on PWA
  // In production this would use the geolocation + AlAdhan API
  const [prayerTimes] = useState<Record<PrayerKey, string>>({
    Fajr: '04:45', Dhuhr: '11:57', Asr: '15:15', Maghrib: '17:52', Isha: '19:05',
  });

  // Countdown to next prayer
  const [countdown, setCountdown] = useState('--:--:--');
  const [nextPrayerKey, setNextPrayerKey] = useState<PrayerKey | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      let found = false;
      for (const p of PRAYER_ORDER) {
        const [h, m] = (prayerTimes[p] || '00:00').split(':').map(Number);
        const pd = new Date(now); pd.setHours(h, m, 0, 0);
        if (pd > now) {
          setNextPrayerKey(p);
          const diff = pd.getTime() - now.getTime();
          const hrs = Math.floor(diff / 3600000);
          const mins = Math.floor((diff % 3600000) / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setCountdown(`${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
          found = true;
          break;
        }
      }
      if (!found) {
        setNextPrayerKey('Fajr');
        setCountdown('--:--:--');
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <div className="relative min-h-screen -mx-4 md:-mx-6 -mt-4 md:-mt-6 pb-16">
      {/* ═══════ Deep Void Background ═══════ */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[\0] via-[#060e1a] to-[#040a12]" />
        {/* Aurora mesh */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute -top-20 -right-16 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(5_150_105_/_0.10),_transparent_70%)] animate-orb-1" />
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(217_119_6_/_0.07),_transparent_70%)] animate-orb-2" />
          <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(37_99_235_/_0.05),_transparent_70%)] animate-orb-3" />
          <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(124_58_237_/_0.04),_transparent_70%)] animate-orb-4" />
        </div>
        {/* Geometric grid */}
        <div className="absolute inset-0 opacity-[0.012]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.5'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-6 pt-8 md:pt-12 max-w-[1200px] mx-auto space-y-5 md:space-y-6">

        {/* ═══════ HERO ═══════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl p-6 md:p-8"
        >
          {/* Hero solid bg — matching Android #137343 green + pattern */}
          <div className="absolute inset-0 bg-[#0D5C3B]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_30%_30%,_rgb(16_185_129_/_0.20),_transparent_50%)]" />
          {/* Islamic pattern overlay — 7% opacity matching Android */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.4'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3Cpath d='M40 10L70 40L40 70L10 40Z'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="relative z-10">
            {/* Bismillah */}
            <p className="text-xl md:text-3xl font-arabic mb-2 md:mb-3 text-right leading-relaxed text-white/90" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            {/* Date */}
            <p className="text-[11px] md:text-xs text-white/45 mb-3">{today}</p>
            {/* Greeting */}
            <h1 className="font-display font-extrabold text-xl md:text-3xl tracking-tight text-white/95">
              Assalamu&apos;alaikum<span className="text-emerald-300">!</span>
            </h1>
            <p className="mt-1.5 md:mt-2 text-[13px] md:text-sm text-white/45 max-w-lg leading-relaxed">
              Selamat datang di <strong className="text-white/60">Jadda</strong>{' '}
              <span className="font-arabic text-emerald-300/70">(جدّ)</span> — aplikasi Islami ringkas untuk ibadah sehari-hari.
            </p>
          </div>

          {/* Bottom fade for seamless blend */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[\0] to-transparent pointer-events-none" />
        </motion.section>

        {/* ═══════ DAILY VERSE ═══════ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="px-4 md:px-0"
        >
          {verse.text && (
            <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 border border-white/[0.06] bg-white/[0.03]">
              <div className="absolute top-0 left-4 text-[10px] font-bold text-emerald-400/60 uppercase tracking-[0.15em]">
                Ayat Hari Ini
              </div>
              <p className="mt-4 text-[13px] md:text-sm leading-relaxed text-white/55 italic">
                &ldquo;{verse.text}&rdquo;
              </p>
              {verse.source && (
                <p className="mt-1.5 text-[11px] text-white/25">— {verse.source}</p>
              )}
            </div>
          )}
        </motion.section>

        {/* ═══════ PRAYER CARD — 2x5 Grid ═══════ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="px-4 md:px-0"
        >
          <div className="rounded-2xl p-4 border border-white/[0.06] bg-white/[0.03]">
            {/* Countdown */}
            {nextPrayerKey && (
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <p className="text-[11px] text-white/35 uppercase tracking-wider">Menuju</p>
                  <p className="text-sm font-bold text-white/85">
                    {PRAYER_NAMES_AR[nextPrayerKey]} ({PRAYER_NAMES_ID[nextPrayerKey]}) — {prayerTimes[nextPrayerKey]}
                  </p>
                </div>
                <div
                  className="px-3 py-1.5 rounded-full text-sm font-mono font-bold tracking-wider"
                  style={{
                    backgroundColor: `${PRAYER_COLORS[nextPrayerKey]}18`,
                    color: PRAYER_COLORS[nextPrayerKey],
                    border: `1px solid ${PRAYER_COLORS[nextPrayerKey]}30`,
                  }}
                >
                  {countdown}
                </div>
              </div>
            )}
            {/* Prayer pills */}
            <div className="space-y-1.5">
              {PRAYER_ORDER.map((p) => (
                <PrayerPill
                  key={p}
                  nameAr={PRAYER_NAMES_AR[p]}
                  nameId={PRAYER_NAMES_ID[p]}
                  time={prayerTimes[p]}
                  icon={PRAYER_ICONS[p]}
                  isActive={nextPrayerKey === p}
                  color={PRAYER_COLORS[p]}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══════ FITUR UTAMA — 3 horizontal ═══════ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-4 md:px-0 space-y-3"
        >
          <SectionHeader title="Fitur Utama" />
          <div className="grid grid-cols-3 gap-2.5">
            {MAIN_FEATURES.map((f) => {
              const a = ACCENT[f.accent];
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${a.hex}20` }}
                  >
                    {f.icon}
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight text-white/80 line-clamp-2">
                    {f.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* ═══════ FITUR PILIHAN — 2-col GlassFeatureCard ═══════ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="px-4 md:px-0 space-y-3"
        >
          <SectionHeader title="Fitur Pilihan" />
          <div className="grid grid-cols-2 gap-2.5">
            {PILIHAN_FEATURES.map((f) => (
              <GlassFeatureCard
                key={f.title}
                title={f.title}
                icon={f.icon}
                accent={f.accent}
                href={f.href}
                isDark={isDark}
              />
            ))}
          </div>
        </motion.section>

        {/* ═══════ FITUR LAINNYA — 2-col GlassFeatureCard ═══════ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-4 md:px-0 space-y-3 mb-8"
        >
          <SectionHeader title="Fitur Lainnya" />
          <div className="grid grid-cols-2 gap-2.5">
            {LAINNYA_FEATURES.map((f) => (
              <GlassFeatureCard
                key={f.title}
                title={f.title}
                icon={f.icon}
                accent={f.accent}
                href={f.href}
                isDark={isDark}
              />
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
