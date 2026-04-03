'use client';

import React from 'react';
import { BookOpen, Scale, Heart, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TentangClient() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">Tentang Aplikasi</h1>
        <p className="text-sm text-muted-foreground mt-1">Informasi tentang Jariyah</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl bg-card border border-border/50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Info size={20} className="text-primary" />
          </div>
          <h2 className="font-display font-bold text-lg text-foreground">Jariyah <span className="font-arabic text-base">(جارية)</span></h2>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
          <strong>Jariyah</strong> adalah aplikasi web (PWA) yang dirancang untuk membantu umat Islam dalam beribadah sehari-hari:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen size={12} className="text-primary" />
            </div>
            <div>
              <strong className="text-sm text-foreground">Doa Harian</strong>
              <p className="text-sm text-muted-foreground">Kumpulan doa dari kitab Hisnul Muslim karya Sa&apos;id bin Ali bin Wahf Al-Qahtani, mencakup 163 kategori dengan 309 doa lengkap — teks Arab, transliterasi Latin, terjemahan Indonesia, dan sumber hadits.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Scale size={12} className="text-accent" />
            </div>
            <div>
              <strong className="text-sm text-foreground">Kalkulator Waris (Faraidh)</strong>
              <p className="text-sm text-muted-foreground">Perhitungan pembagian warisan sesuai hukum Islam berdasarkan Al-Qur&apos;an dan Sunnah. Mendukung berbagai kasus termasuk &apos;Aul, Radd, Hajb, dan Al-Umariyyatain.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen size={12} className="text-blue-500" />
            </div>
            <div>
              <strong className="text-sm text-foreground">Hadits Arbain An-Nawawi</strong>
              <p className="text-sm text-muted-foreground">42 hadits pilihan Imam An-Nawawi dan Ibnu Rajab yang merupakan pokok-pokok ajaran Islam, lengkap dengan teks Arab, terjemahan, dan sumber periwayatan.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-pink-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Scale size={12} className="text-pink-500" />
            </div>
            <div>
              <strong className="text-sm text-foreground">Kalkulator Zakat</strong>
              <p className="text-sm text-muted-foreground">Perhitungan zakat maal, fitrah, perdagangan, pertanian, dan peternakan sesuai ketentuan syariat Islam.</p>
            </div>
          </li>
        </ul>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl bg-card border border-border/50 p-6 shadow-sm">
        <h2 className="font-display font-bold text-base text-foreground mb-4">Referensi</h2>
        <ul className="space-y-3 text-sm text-foreground/80">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Hisnul Muslim</strong> — Said bin Ali bin Wahf Al-Qahthani (Kumpulan Doa)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Hadits Arbain An-Nawawi</strong> — Imam Yahya bin Syaraf An-Nawawi &amp; Ibnu Rajab (42 Hadits Pokok)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Al-Qur&apos;an Al-Karim</strong> — Surat An-Nisa ayat 11, 12, dan 176 (Hukum Waris)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Hadits Shahih</strong> — Bukhari, Muslim, Abu Daud, Tirmidzi, Ibnu Majah</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Fiqh Mawaris</strong> — Ilmu Faraidh berdasarkan Al-Qur&apos;an dan Sunnah</span>
          </li>
        </ul>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl bg-card border border-border/50 p-6 shadow-sm">
        <h2 className="font-display font-bold text-base text-foreground mb-4">Fitur Aplikasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            'Doa lengkap dengan teks Arab',
            'Transliterasi & terjemahan',
            'Pencarian & filter doa',
            'Bookmark doa favorit',
            'Salin teks Arab',
            'Kalkulator waris lengkap',
            'Visualisasi diagram lingkaran',
            'Penjelasan Hajb, Aul, Radd',
            'Mode gelap/terang',
            'Bisa diinstal sebagai aplikasi (PWA)',
            'Bekerja offline',
            'Responsif di semua perangkat',
          ]?.map?.((feat: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-foreground/80">{feat}</span>
            </div>
          )) ?? []}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl bg-muted/50 p-5 text-center">
        <p className="text-sm text-muted-foreground">
          Dibuat dengan <Heart size={12} className="inline text-red-500 mx-1" /> untuk umat Islam Indonesia
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Semoga bermanfaat dan menjadi amal jariyah. Aamiin.
        </p>
      </motion.div>
    </div>
  );
}
