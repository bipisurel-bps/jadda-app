'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock, Compass, BookOpen, Calculator, ScrollText, Coins, MapPin, Landmark, Users, ChevronRight
} from 'lucide-react';

const FEATURES = [
  { href: '/sholat', label: 'Waktu Sholat', desc: 'Jadwal sholat otomatis & pengingat dzikir', Icon: Clock, bg: 'bg-indigo-500/8', iconBg: 'bg-indigo-500/15', iconColor: 'text-indigo-500', hoverBorder: 'hover:border-indigo-400/30' },
  { href: '/qibla', label: 'Arah Kiblat', desc: 'Kompas digital berbasis GPS & sensor perangkat', Icon: Compass, bg: 'bg-emerald-500/8', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-600 dark:text-emerald-400', hoverBorder: 'hover:border-emerald-400/30' },
  { href: '/doa', label: 'Doa Harian', desc: 'Kumpulan doa lengkap dari Hisnul Muslim', Icon: BookOpen, bg: 'bg-primary/8', iconBg: 'bg-primary/15', iconColor: 'text-primary', hoverBorder: 'hover:border-primary/30' },
  { href: '/waris', label: 'Hitung Waris', desc: 'Perhitungan faradh sesuai syariat', Icon: Calculator, bg: 'bg-accent/8', iconBg: 'bg-accent/15', iconColor: 'text-accent', hoverBorder: 'hover:border-accent/30' },
  { href: '/hadits', label: 'Hadits Arbain', desc: 'Hadits pokok ajaran Islam pilihan Imam An-Nawawi', Icon: ScrollText, bg: 'bg-blue-500/8', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-500', hoverBorder: 'hover:border-blue-400/30' },
  { href: '/zakat', label: 'Hitung Zakat', desc: 'Hitung zakat maal, fitrah, dagang, tani & ternak', Icon: Coins, bg: 'bg-pink-500/8', iconBg: 'bg-pink-500/15', iconColor: 'text-pink-500', hoverBorder: 'hover:border-pink-400/30' },
  { href: '/umroh', label: 'Panduan Umrah', desc: 'Panduan umrah lengkap dengan doa & bacaan', Icon: MapPin, bg: 'bg-teal-500/8', iconBg: 'bg-teal-500/15', iconColor: 'text-teal-600 dark:text-teal-400', hoverBorder: 'hover:border-teal-400/30' },
  { href: '/haji', label: 'Panduan Haji', desc: 'Tuntunan ringkas ibadah haji sesuai Sunnah', Icon: Landmark, bg: 'bg-amber-500/8', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-600 dark:text-amber-400', hoverBorder: 'hover:border-amber-400/30' },
  { href: '/ulama', label: 'Biografi Ulama', desc: 'Biografi lengkap para imam hadits dan ulama besar', Icon: Users, bg: 'bg-violet-500/8', iconBg: 'bg-violet-500/15', iconColor: 'text-violet-600 dark:text-violet-400', hoverBorder: 'hover:border-violet-400/30' },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {FEATURES.map((item, i) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
          className={i === FEATURES.length - 1 && FEATURES.length % 2 !== 0 ? 'col-span-2 md:col-span-1' : ''}
        >
          <Link href={item.href} className="block h-full">
            <div className={`group rounded-xl ${item.bg} p-4 md:p-5 shadow-sm border border-border/50 ${item.hoverBorder} hover:shadow-md transition-all cursor-pointer h-full`}>
              <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <item.Icon size={20} className={item.iconColor} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display font-bold text-sm md:text-base text-foreground leading-tight">{item.label}</h2>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground hidden md:block leading-relaxed">{item.desc}</p>
                <div className="hidden md:flex items-center gap-1 mt-auto">
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
