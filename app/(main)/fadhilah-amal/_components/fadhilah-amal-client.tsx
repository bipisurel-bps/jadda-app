'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Sparkles, Heart, HandHeart, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/layouts/page-header';

const FADHILAH_MENU = [
  {
    href: '/fadhilah-amal/fadhilah-amal-shaleh',
    icon: Star,
    title: 'Fadhilah Amal Shaleh',
    desc: '7 keutamaan memperbanyak amal shaleh berdasarkan Al-Qur\'an & Hadits',
    accent: '#D97706',
    count: '7',
  },
  {
    href: '/fadhilah-amal/amalan-ringan',
    icon: HandHeart,
    title: 'Amalan Ringan Berpahala Besar',
    desc: '3 amalan ringan: membantu sesama, menuntut ilmu, & bersedekah',
    accent: '#059669',
    count: '3',
  },
  {
    href: '/fadhilah-amal/amalan-setara-haji',
    icon: Sparkles,
    title: 'Amalan Setara Pahala Haji',
    desc: '8 amalan ringan yang pahalanya setara dengan haji & umrah',
    accent: '#7C3AED',
    count: '8',
  },
  {
    href: '/fadhilah-amal/shalawat-nabi',
    icon: Heart,
    title: 'Shalawat Kepada Nabi ﷺ',
    desc: 'Keutamaan, faidah, bacaan & tempat dianjurkan bershalawat',
    accent: '#E11D48',
    count: '24',
  },
];

export default function FadhilahAmalClient() {
  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader
        title="Fadhilah Amal"
        description="Kumpulan amalan ringan dengan pahala besar & keutamaan bershalawat kepada Nabi ﷺ"
        backHref="/"
      />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-4">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
              <Star size={22} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white/90">Kumpulan Fadhilah</h2>
              <p className="text-xs text-white/50 mt-0.5">Amalan ringan, pahala dahsyat</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="space-y-2.5">
          {FADHILAH_MENU.map((item, idx) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + idx * 0.07 }}
            >
              <Link href={item.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/20 transition-all duration-300 p-5">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-emerald-500/[0.02] pointer-events-none" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: `${item.accent}18`, border: `1px solid ${item.accent}33` }}
                    >
                      {React.createElement(item.icon, { size: 22, style: { color: item.accent } })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white/85 group-hover:text-white/95 transition-colors">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-bold text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">
                          {item.count} keutamaan
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
