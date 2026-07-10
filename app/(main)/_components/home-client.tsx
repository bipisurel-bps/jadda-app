'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ChevronRight, Compass, Heart, Users, PersonStanding, Book, BookOpen } from 'lucide-react';
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

/* ── Main feature config ── */
const mainFeatures = [
  {
    href: '/sholat',
    icon: JaddaSholatIcon,
    title: 'Waktu Sholat & Dzikir',
    desc: 'Jadwal otomatis & pengingat dzikir pagi petang',
    accent: 'gold',
    size: 'lg',
  },
  {
    href: '/quran',
    icon: Book,
    title: 'Al-Quran',
    desc: '114 surah, 30 juz — baca dengan terjemah Indonesia',
    accent: 'emerald',
    size: 'md',
    isLucide: true,
  },
  {
    href: '/juz',
    icon: BookOpen,
    title: 'Kandungan Juz',
    desc: 'Ringkasan tema pokok setiap juz Al-Quran',
    accent: 'teal',
    size: 'md',
    isLucide: true,
  },
  {
    href: '/qibla',
    icon: JaddaKiblatIcon,
    title: 'Arah Kiblat',
    desc: 'Kompas digital berbasis GPS & sensor',
    accent: 'sapphire',
    size: 'md',
  },
  {
    href: '/doa',
    icon: JaddaDoaIcon,
    title: 'Doa Harian',
    desc: '310 doa dari Al-Quran, hadits & kitab ulama',
    accent: 'gold',
    size: 'sm',
  },
  {
    href: '/hadits',
    icon: JaddaHaditsIcon,
    title: 'Koleksi Hadits',
    desc: 'Arbain An-Nawawi & Riyadhus Shalihin',
    accent: 'sapphire',
    size: 'sm',
  },
];

/* ── Fitur Lainnya ── */
const lainnyaFeatures = [
  {
    href: '/zakat',
    icon: JaddaZakatIcon,
    title: 'Hitung Zakat',
    desc: 'Zakat maal, fitrah, dagang, tani & ternak',
    accent: 'teal',
  },
  {
    href: '/waris',
    icon: JaddaWarisIcon,
    title: 'Hitung Waris',
    desc: 'Perhitungan faraidh sesuai syariat',
    accent: 'amethyst',
  },
  {
    href: '/umroh',
    icon: JaddaUmrahIcon,
    title: 'Panduan Umrah',
    desc: 'Tata cara lengkap dengan doa & bacaan Arab',
    accent: 'teal',
  },
  {
    href: '/haji',
    icon: JaddaHajiIcon,
    title: 'Tuntunan Haji',
    desc: 'Tuntunan ringkas ibadah haji sesuai Sunnah',
    accent: 'amethyst',
  },
  {
    href: '/keilmuan/fiqh-safar',
    icon: Compass,
    title: 'Panduan Safar',
    desc: 'Qashar, jamak, puasa musafir, tayammum & adab',
    accent: 'teal',
    isLucide: true,
  },
  {
    href: '/tuntunan-sholat',
    icon: PersonStanding,
    title: 'Tuntunan Sholat Nabi ﷺ',
    desc: 'Tata cara sholat sesuai Sunnah & makna bacaan',
    accent: 'sapphire',
    isLucide: true,
  },
  {
    href: '/keilmuan/fiqh-jenazah',
    icon: Heart,
    title: 'Panduan Pengurusan Jenazah',
    desc: 'Tata cara memandikan, mengkafani hingga pemakaman',
    accent: 'emerald',
    isLucide: true,
  },
  {
    href: '/fadhilah-amal',
    icon: Star,
    title: 'Fadhilah Amal',
    desc: 'Amalan ringan berpahala besar & keutamaan shalawat',
    accent: 'gold',
    isLucide: true,
  },
  {
    href: '/keilmuan/ulama',
    icon: Users,
    title: 'Biografi Ulama',
    desc: 'Mengenal para imam hadits & ahli ilmu Islam',
    accent: 'emerald',
    isLucide: true,
  },
];

/* ── Curated 5-Color Accent Map ── */
const accentMap: Record<string, { card: string; text: string; glowLine: string; glowColor: string; iconBg: string; iconGlow: string }> = {
  emerald: {
    card: 'card-emerald',
    text: 'text-emerald-300',
    glowLine: 'glow-line-emerald',
    glowColor: '--glow-emerald',
    iconBg: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/5',
    iconGlow: 'shadow-emerald-500/20',
  },
  gold: {
    card: 'card-gold',
    text: 'text-amber-300',
    glowLine: 'glow-line-gold',
    glowColor: '--glow-gold',
    iconBg: 'bg-gradient-to-br from-amber-500/18 to-yellow-400/6',
    iconGlow: 'shadow-amber-500/20',
  },
  sapphire: {
    card: 'card-sapphire',
    text: 'text-blue-300',
    glowLine: 'glow-line-sapphire',
    glowColor: '--glow-sapphire',
    iconBg: 'bg-gradient-to-br from-blue-500/15 to-indigo-500/5',
    iconGlow: 'shadow-blue-500/20',
  },
  amethyst: {
    card: 'card-amethyst',
    text: 'text-purple-300',
    glowLine: 'glow-line-amethyst',
    glowColor: '--glow-amethyst',
    iconBg: 'bg-gradient-to-br from-purple-500/15 to-violet-500/5',
    iconGlow: 'shadow-purple-500/20',
  },
  teal: {
    card: 'card-teal',
    text: 'text-teal-300',
    glowLine: 'glow-line-teal',
    glowColor: '--glow-teal',
    iconBg: 'bg-gradient-to-br from-teal-500/15 to-cyan-400/5',
    iconGlow: 'shadow-teal-500/20',
  },
};

/* ── CSS custom property mapping for glow colors ── */
const glowColorVars: Record<string, string> = {
  emerald: 'rgb(5 150 105)',
  gold: 'rgb(217 119 6)',
  sapphire: 'rgb(37 99 235)',
  amethyst: 'rgb(124 58 237)',
  teal: 'rgb(13 148 136)',
};

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
      {/* ═══════ Mesh Aurora Background ═══════ */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Deep void base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050a14] via-[#060e1a] to-[#040a12]" />

        {/* Aurora mesh — multi-layer radial gradients */}
        <div className="absolute inset-0 opacity-60">
          {/* Emerald sweep top-right */}
          <div className="absolute -top-20 -right-16 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(5_150_105_/_0.12),_transparent_70%)] animate-orb-1" />
          {/* Gold sweep mid-left */}
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(217_119_6_/_0.08),_transparent_70%)] animate-orb-2" />
          {/* Sapphire sweep bottom-right */}
          <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(37_99_235_/_0.06),_transparent_70%)] animate-orb-3" />
          {/* Amethyst accent top-center */}
          <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,_rgb(124_58_237_/_0.05),_transparent_70%)] animate-orb-4" />
        </div>

        {/* Subtle geometric grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.5'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* ═══════ Grain Texture Overlay ═══════ */}
      <div className="grain-overlay" />

      {/* ═══════ Content ═══════ */}
      <div className="relative z-10 px-4 md:px-6 pt-8 md:pt-12 max-w-[1200px] mx-auto space-y-6 md:space-y-8">

        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl p-6 md:p-10 border-glow"
        >
          {/* Hero multi-stop gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-[#082018]/60 to-[#050a14]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_30%_20%,_rgb(5_150_105_/_0.15),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_80%,_rgb(217_119_6_/_0.06),_transparent_50%)]" />

          {/* Decorative islamic pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.4'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="relative z-10">
            {/* Bismillah */}
            <p className="text-2xl md:text-4xl font-arabic mb-3 md:mb-4 text-right leading-relaxed bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200 bg-clip-text text-transparent animate-text-shimmer drop-shadow-[0_0_12px_rgb(5_150_105_/_0.3)]" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>

            {/* Salam */}
            <h1 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-white/90">
              Assalamu&apos;alaikum
              <span className="text-emerald-400">!</span>
            </h1>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-white/45 max-w-lg leading-relaxed">
              Selamat datang di <strong className="text-white/65">Jadda</strong>{' '}
              <span className="font-arabic text-emerald-300/80">(جدّ)</span> — aplikasi Islami ringkas untuk ibadah sehari-hari Anda.
            </p>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050a14] to-transparent pointer-events-none" />
        </motion.section>

        {/* ── Daily Verse ── */}
        {verse?.text ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card rounded-2xl p-5 md:p-6 transition-all duration-500 card-sapphire"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/5 border border-blue-400/20 flex items-center justify-center shadow-blue-500/20">
                <Star size={16} className="text-blue-300 animate-pulse-glow" style={{ '--glow-color': 'rgb(37 99 235 / 0.3)' } as React.CSSProperties} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] md:text-xs font-semibold text-white/25 uppercase tracking-[0.15em] mb-1.5">
                  Ayat Hari Ini
                </p>
                <p className="text-sm md:text-base text-white/80 italic leading-relaxed">
                  {verse?.text}
                </p>
                <p className="text-xs text-white/25 mt-2 font-medium">
                  {verse?.source}
                </p>
              </div>
            </div>
          </motion.section>
        ) : null}

        {/* ── Main Feature Bento Grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
        >
          {/* ── Sholat — Featured (spans 2 cols on desktop) ── */}
          <motion.div variants={item} className="md:col-span-2">
            <FeatureCard href={mainFeatures[0].href} icon={mainFeatures[0].icon} title={mainFeatures[0].title} desc={mainFeatures[0].desc} accent={mainFeatures[0].accent} featured />
          </motion.div>

          {/* ── Al-Quran ── */}
          <motion.div variants={item}>
            <FeatureCard href={mainFeatures[1].href} icon={mainFeatures[1].icon} title={mainFeatures[1].title} desc={mainFeatures[1].desc} accent={mainFeatures[1].accent} isLucide />
          </motion.div>

          {/* ── Juz · Kiblat ── */}
          <motion.div variants={item}>
            <FeatureCard href={mainFeatures[2].href} icon={mainFeatures[2].icon} title={mainFeatures[2].title} desc={mainFeatures[2].desc} accent={mainFeatures[2].accent} isLucide />
          </motion.div>
          <motion.div variants={item}>
            <FeatureCard href={mainFeatures[3].href} icon={mainFeatures[3].icon} title={mainFeatures[3].title} desc={mainFeatures[3].desc} accent={mainFeatures[3].accent} />
          </motion.div>

          {/* ── Doa · Hadits ── */}
          <motion.div variants={item}>
            <FeatureCard href={mainFeatures[4].href} icon={mainFeatures[4].icon} title={mainFeatures[4].title} desc={mainFeatures[4].desc} accent={mainFeatures[4].accent} />
          </motion.div>
          <motion.div variants={item}>
            <FeatureCard href={mainFeatures[5].href} icon={mainFeatures[5].icon} title={mainFeatures[5].title} desc={mainFeatures[5].desc} accent={mainFeatures[5].accent} />
          </motion.div>
        </motion.div>

        {/* ── Fitur Lainnya ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="font-display font-bold text-sm md:text-base text-white/50 uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-gradient-to-r from-gold-400/40 to-transparent inline-block" />
            Fitur Lainnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {lainnyaFeatures.map((f) => (
              <FeatureCard
                key={f.href}
                href={f.href}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                accent={f.accent}
                isLucide={f.isLucide}
              />
            ))}
          </div>
        </motion.section>

        {/* ── Footer note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-white/12 text-xs md:text-sm pt-2 pb-8"
        >
          Mohon doanya agar kami bisa melanjutkan development aplikasi ini 🙏🏽
        </motion.p>

      </div>
    </div>
  );
}

/* ── Feature Card Component ── */
function FeatureCard({
  href,
  icon: IconComponent,
  title,
  desc,
  accent,
  featured = false,
  isLucide = false,
}: {
  href: string;
  icon: any;
  title: string;
  desc: string;
  accent: string;
  featured?: boolean;
  isLucide?: boolean;
}) {
  const styles = accentMap[accent] ?? accentMap.emerald;
  const LucideIcon = isLucide ? IconComponent : null;
  const glowVar = glowColorVars[accent] ?? glowColorVars.emerald;

  return (
    <Link href={href} className="block h-full">
      <div
        className={`group relative h-full rounded-2xl overflow-hidden transition-all duration-500 glass-card ${styles.card}`}
      >
        {/* Glow line at top */}
        <div className={`absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${styles.glowLine}`} />

        <div className={`relative z-10 p-4 md:p-6 flex flex-col h-full ${featured ? 'md:flex-row md:items-center md:gap-6' : ''}`}>
          {/* Icon container */}
          <div className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl overflow-hidden ${styles.iconBg} border border-white/[0.06] group-hover:scale-105 group-hover:${styles.iconGlow} transition-all duration-500 mb-3 ${featured ? 'md:mb-0' : ''}`}
            style={{ '--glow-color': glowVar } as React.CSSProperties}
          >
            {LucideIcon ? (
              <div className={`w-full h-full flex items-center justify-center`}>
                <LucideIcon size={22} className={styles.text} />
              </div>
            ) : (
              <IconComponent className="w-full h-full" title={title} />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className={`font-display font-bold text-sm md:text-base text-white/85 group-hover:text-white transition-colors duration-300 ${featured ? 'md:text-lg' : ''}`}>
                {title}
              </h2>
              <ChevronRight size={16} className={`flex-shrink-0 ${styles.text} opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`} />
            </div>
            <p className="mt-1 text-xs md:text-sm text-white/35 group-hover:text-white/45 transition-colors duration-300 leading-relaxed">
              {desc}
            </p>

            {/* Featured badge */}
            {featured && (
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${styles.iconBg} ${styles.text} border border-white/[0.08]`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${styles.text} animate-pulse`} />
                  Fitur Utama
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${styles.iconBg} pointer-events-none`} />
      </div>
    </Link>
  );
}
