'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Compass, Heart, BookOpen, ChevronRight } from 'lucide-react';

const KEILMUAN_MENU = [
  {
    href: '/keilmuan/ulama',
    icon: Users,
    title: 'Biografi Ulama',
    desc: 'Mengenal para imam hadits & ahli ilmu Islam',
    accent: 'emerald',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-600',
  },
  {
    href: '/keilmuan/fiqh-safar',
    icon: Compass,
    title: 'Panduan Safar',
    desc: 'Qashar, jamak, puasa musafir, tayammum & adab safar',
    accent: 'cyan',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-blue-600',
  },
  {
    href: '/keilmuan/fiqh-jenazah',
    icon: Heart,
    title: 'Panduan Pengurusan Jamaah',
    desc: 'Tata cara memandikan, mengkafani, menshalatkan hingga pemakaman',
    accent: 'green',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-700',
  },
];

const accentStyles: Record<string, { bg: string; border: string; text: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-400/20', text: 'text-emerald-400' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-400/20',    text: 'text-cyan-400' },
  green:   { bg: 'bg-green-500/10',   border: 'border-green-400/20',   text: 'text-green-400' },
};

export default function KeilmuanClient() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Keilmuan Islam</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kumpulan biografi ulama & fiqh praktis untuk kehidupan sehari-hari
        </p>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-teal-600/15 to-cyan-600/10 border border-emerald-500/10 p-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
              <BookOpen size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">Pusat Keilmuan</h2>
              <p className="text-xs text-muted-foreground">Warisan ilmu para ulama & panduan fiqh</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 gap-3"
      >
        {KEILMUAN_MENU.map((item) => {
          const Icon = item.icon;
          const styles = accentStyles[item.accent];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group block"
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-${item.accent}-400/30 transition-all duration-300 p-5`}
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.gradientFrom}/5 ${item.gradientTo}/5 pointer-events-none`} />

                <div className="relative z-10 flex items-center gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${styles.bg} ${styles.border} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Icon size={22} className={styles.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base text-foreground group-hover:text-foreground/90 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
