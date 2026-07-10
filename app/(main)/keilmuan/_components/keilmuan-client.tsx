'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Plane, HeartHandshake, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/page-header';

const KEILMUAN_MENU = [
  {
    href: '/keilmuan/fiqh-safar',
    title: 'Fiqh Safar',
    desc: 'Panduan lengkap fiqh perjalanan (safar) sesuai syariat',
    icon: Plane,
    accent: '#0D9488',
    count: '9 bab',
  },
  {
    href: '/keilmuan/fiqh-jenazah',
    title: 'Fiqh Jenazah',
    desc: 'Tata cara merawat jenazah dari memandikan hingga menguburkan',
    icon: HeartHandshake,
    accent: '#059669',
    count: '6 bab',
  },
  {
    href: '/keilmuan/ulama',
    title: 'Biografi Ulama',
    desc: 'Mengenal para ulama besar dengan karya monumental',
    icon: BookOpen,
    accent: '#2563EB',
    count: 'tokoh',
  },
];

export default function KeilmuanClient() {
  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader
        title="Keilmuan"
        description="Kajian fiqh Islam berdasarkan Al-Qur'an & Sunnah"
        backHref="/"
      />

      <div className="max-w-2xl mx-auto px-4 pb-12">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 mb-5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
              <BookOpen size={22} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white/90">Kumpulan Fiqh</h2>
              <p className="text-xs text-white/50 mt-0.5">Ilmu fiqh yang praktis dan mudah dipahami</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="space-y-3">
          {KEILMUAN_MENU.map((item, idx) => {
            const Icon = item.icon;
            return (
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
                        <Icon size={22} style={{ color: item.accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white/85 group-hover:text-white/95 transition-colors">
                            {item.title}
                          </h3>
                          <span className="text-[10px] font-bold text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">
                            {item.count}
                          </span>
                        </div>
                        <p className="text-sm text-white/50 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <ChevronRight size={18} className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
