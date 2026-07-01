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

/* ── Feature config ── */
const features = [
  {
    href: '/sholat',
    icon: JaddaSholatIcon,
    title: 'Waktu Sholat & Dzikir',
    desc: 'Jadwal otomatis & pengingat dzikir pagi petang',
    accent: 'emerald',
    size: 'lg',
  },
  {
    href: '/qibla',
    icon: JaddaKiblatIcon,
    title: 'Arah Kiblat',
    desc: 'Kompas digital berbasis GPS & sensor',
    accent: 'teal',
    size: 'md',
  },
  {
    href: '/doa',
    icon: JaddaDoaIcon,
    title: 'Doa Harian',
    desc: '310 doa lengkap dari Hisnul Muslim',
    accent: 'amber',
    size: 'sm',
  },
  {
    href: '/hadits',
    icon: JaddaHaditsIcon,
    title: 'Koleksi Hadits',
    desc: 'Arbain An-Nawawi & Riyadhus Shalihin',
    accent: 'blue',
    size: 'sm',
  },
  {
    href: '/zakat',
    icon: JaddaZakatIcon,
    title: 'Kalkulator Zakat',
    desc: 'Zakat maal, fitrah, dagang, tani & ternak',
    accent: 'rose',
    size: 'sm',
  },
  {
    href: '/waris',
    icon: JaddaWarisIcon,
    title: 'Kalkulator Waris',
    desc: 'Perhitungan faraidh sesuai syariat',
    accent: 'indigo',
    size: 'sm',
  },
  {
    href: '/umroh',
    icon: JaddaUmrahIcon,
    title: 'Panduan Umrah',
    desc: 'Tata cara lengkap dengan doa & bacaan Arab',
    accent: 'cyan',
    size: 'sm',
  },
  {
    href: '/haji',
    icon: JaddaHajiIcon,
    title: 'Panduan Haji',
    desc: 'Tuntunan ringkas ibadah haji sesuai Sunnah',
    accent: 'purple',
    size: 'sm',
  },
];

const accentMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-400/20 hover:border-emerald-400/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-400/20 hover:border-teal-400/40',       text: 'text-teal-400',    glow: 'shadow-teal-500/10' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-400/20 hover:border-amber-400/40',     text: 'text-amber-400',   glow: 'shadow-amber-500/10' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-400/20 hover:border-blue-400/40',       text: 'text-blue-400',    glow: 'shadow-blue-500/10' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-400/20 hover:border-rose-400/40',       text: 'text-rose-400',    glow: 'shadow-rose-500/10' },
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-400/20 hover:border-indigo-400/40',   text: 'text-indigo-400',  glow: 'shadow-indigo-500/10' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-400/20 hover:border-cyan-400/40',       text: 'text-cyan-400',    glow: 'shadow-cyan-500/10' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-400/20 hover:border-purple-400/40',   text: 'text-purple-400',  glow: 'shadow-purple-500/10' },
};

const glowLineClass = (a: string) => `glow-line-${a}`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
    <div className="relative min-h-screen -mx-4 md:-mx-6 -mt-4 md:-mt-6 pb-16">
      {/* ═══════ Animated Background Orbs ═══════ */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060d14]">
        {/* Deep base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#071818] to-[#060d14]" />

        {/* Floating orbs */}
        <div className="absolute -top-32 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.07] blur-[128px] animate-orb-1" />
        <div className="absolute top-1/3 -left-24 w-[450px] h-[450px] rounded-full bg-teal-500/[0.06] blur-[120px] animate-orb-2" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/[0.04] blur-[100px] animate-orb-3" />
      </div>

      {/* ═══════ Content ═══════ */}
      <div className="relative z-10 px-4 md:px-6 pt-8 md:pt-12 max-w-[1200px] mx-auto space-y-6 md:space-y-8">

        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl p-6 md:p-10"
        >
          {/* Hero background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#0d2818]/50 to-[#0a1628]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/10 via-transparent to-transparent" />

          {/* Decorative islamic pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.5'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="relative z-10">
            {/* Bismillah */}
            <p className="text-2xl md:text-4xl font-arabic mb-3 md:mb-4 text-right leading-relaxed bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent animate-text-shimmer" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>

            {/* Salam */}
            <h1 className="font-display font-bold text-2xl md:text-4xl tracking-tight text-white/90">
              Assalamu&apos;alaikum
              <span className="text-emerald-400">!</span>
            </h1>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-white/50 max-w-lg leading-relaxed">
              Selamat datang di <strong className="text-white/70">Jadda</strong>{' '}
              <span className="font-arabic text-emerald-300/80">(جدّ)</span> — aplikasi Islami ringkas untuk ibadah sehari-hari Anda.
            </p>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#060d14] to-transparent pointer-events-none" />
        </motion.section>

        {/* ── Daily Verse ── */}
        {verse?.text ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card rounded-2xl p-5 md:p-6 transition-all duration-500"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                <Star size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] md:text-xs font-medium text-white/30 uppercase tracking-wider mb-1.5">
                  Ayat Hari Ini
                </p>
                <p className="text-sm md:text-base text-white/80 italic leading-relaxed">
                  {verse?.text}
                </p>
                <p className="text-xs text-white/30 mt-2 font-medium">
                  {verse?.source}
                </p>
              </div>
            </div>
          </motion.section>
        ) : null}

        {/* ── Feature Bento Grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
        >
          {/* ── Sholat — Featured (spans 2 cols on desktop) ── */}
          <motion.div variants={item} className="md:col-span-2">
            <FeatureCard feature={features[0]} featured />
          </motion.div>

          {/* ── Kiblat ── */}
          <motion.div variants={item}>
            <FeatureCard feature={features[1]} />
          </motion.div>

          {/* ── Doa · Hadits · Zakat ── */}
          <motion.div variants={item}>
            <FeatureCard feature={features[2]} />
          </motion.div>
          <motion.div variants={item}>
            <FeatureCard feature={features[3]} />
          </motion.div>
          <motion.div variants={item}>
            <FeatureCard feature={features[4]} />
          </motion.div>

          {/* ── Waris · Umrah · Haji ── */}
          <motion.div variants={item}>
            <FeatureCard feature={features[5]} />
          </motion.div>
          <motion.div variants={item}>
            <FeatureCard feature={features[6]} />
          </motion.div>
          <motion.div variants={item}>
            <FeatureCard feature={features[7]} />
          </motion.div>
        </motion.div>

        {/* ── Footer note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-white/15 text-xs md:text-sm pt-2"
        >
          Mohon doanya agar kami bisa melanjutkan development aplikasi ini 🙏🏽
        </motion.p>

      </div>
    </div>
  );
}

/* ── Feature Card Component ── */
function FeatureCard({
  feature,
  featured = false,
}: {
  feature: (typeof features)[number];
  featured?: boolean;
}) {
  const { href, icon: Icon, title, desc, accent } = feature;
  const styles = accentMap[accent] ?? accentMap.emerald;

  return (
    <Link href={href} className="block h-full">
      <div
        className={`group relative h-full rounded-2xl overflow-hidden transition-all duration-500 glass-card ${styles.border} hover:${styles.glow}`}
      >
        {/* Glow line at top */}
        <div className={`absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowLineClass(accent)}`} />

        <div className={`relative z-10 p-4 md:p-6 flex flex-col h-full ${featured ? 'md:flex-row md:items-center md:gap-6' : ''}`}>
          {/* Icon */}
          <div className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl overflow-hidden ${styles.bg} border border-white/[0.06] group-hover:scale-105 transition-transform duration-500 mb-3 ${featured ? 'md:mb-0' : ''}`}>
            <Icon className="w-full h-full" title={title} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className={`font-display font-bold text-sm md:text-base text-white/85 group-hover:text-white transition-colors duration-300 ${featured ? 'md:text-lg' : ''}`}>
                {title}
              </h2>
              <ChevronRight size={16} className={`flex-shrink-0 ${styles.text} opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300`} />
            </div>
            <p className="mt-1 text-xs md:text-sm text-white/35 group-hover:text-white/50 transition-colors duration-300 leading-relaxed">
              {desc}
            </p>

            {/* Featured badge for Sholat card */}
            {featured && (
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${styles.bg} ${styles.text} border ${styles.border}`}>
                  <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                  Fitur Utama
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${styles.bg} pointer-events-none`} />
      </div>
    </Link>
  );
}
