'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Heart, BookOpen, MapPin, Globe, Mail, Shield, Users, Sparkles } from 'lucide-react';
import PageHeader from '@/components/page-header';

const FEATURES = [
  { icon: BookOpen, title: 'Al-Qur\'an & Juz', desc: 'Baca Al-Qur\'an lengkap dengan kandungan setiap Juz' },
  { icon: Sparkles, title: 'Doa & Dzikir', desc: 'Kumpulan doa harian dan dzikir pagi-petang' },
  { icon: MapPin, title: 'Waktu Sholat & Kiblat', desc: 'Jadwal sholat akurat + kompas arah kiblat' },
  { icon: Heart, title: 'Fadhilah Amal', desc: 'Amalan ringan berpahala besar berdasarkan dalil' },
  { icon: Globe, title: 'Haji & Umroh', desc: 'Panduan lengkap manasik haji dan umroh' },
  { icon: Shield, title: 'Fiqh & Keilmuan', desc: 'Fiqh jenazah, safar, zakat, waris dan lainnya' },
];

const ACCENTS = ['#059669', '#D97706', '#2563EB', '#7C3AED', '#0D9488', '#059669'];

export default function TentangClient() {
  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title="Tentang" description="Mengenal jadda.app lebih dekat" backHref="/" />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
              <Smartphone size={28} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white/90">jadda.app</h1>
              <p className="text-sm text-white/60 mt-0.5">
                Jalan Aplikasi Dakwah Digital — Aplikasi Islami terlengkap dalam genggaman
              </p>
            </div>
          </div>
        </motion.div>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-white/90 uppercase tracking-tight">Versi</span>
            <span className="text-sm font-mono text-white/60 bg-white/[0.04] px-3 py-1 rounded-lg border border-white/[0.05]">
              v1.4.0
            </span>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-3"
        >
          <h2 className="text-[13px] font-extrabold text-white/90 uppercase tracking-tight">Fitur Unggulan</h2>
          <div className="space-y-2">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              const accent = ACCENTS[idx % ACCENTS.length];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accent}18`, border: `1px solid ${accent}33` }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white/85">{feature.title}</h3>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"
        >
          <h2 className="text-[13px] font-extrabold text-white/90 uppercase tracking-tight mb-3">Visi Kami</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Memudahkan umat Islam dalam mengakses ilmu agama yang shahih, kapan saja dan di mana saja,
            melalui teknologi yang indah dan mudah digunakan. Setiap fitur dirancang dengan cinta,
            merujuk pada Al-Qur&apos;an dan Sunnah yang sahih.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/35">
            <Heart size={12} className="text-rose-400" />
            Made with love for the Ummah
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"
        >
          <h2 className="text-[13px] font-extrabold text-white/90 uppercase tracking-tight mb-3">Kontak & Dukungan</h2>
          <a
            href="mailto:hello@jadda.app"
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Mail size={16} />
            hello@jadda.app
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center pt-4"
        >
          <p className="text-xs text-white/25">jadda.app &copy; {new Date().getFullYear()}</p>
        </motion.div>
      </div>
    </div>
  );
}
