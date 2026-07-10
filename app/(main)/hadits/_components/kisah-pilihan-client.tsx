'use client';

import React from 'react';
import { BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KisahPilihanClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
    >
      <Heart size={44} className="mx-auto text-white/[0.08] mb-4" />
      <p className="text-sm text-white/50 font-medium">Kisah Pilihan</p>
      <p className="text-xs text-white/25 mt-1 max-w-xs mx-auto">
        Kumpulan kisah dan hadits pilihan akan segera hadir.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
        <BookOpen size={12} />
        Segera Hadir
      </div>
    </motion.div>
  );
}
