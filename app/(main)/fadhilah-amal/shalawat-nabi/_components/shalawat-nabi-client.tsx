'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Heart, BookOpen, Sparkles, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';
import data from '@/public/data/fadhilah-shalawat-nabi.json';

function ArabicBlock({ arabic, transliteration }: { arabic?: string; transliteration?: string }) {
  const [copied, setCopied] = useState(false);
  if (!arabic) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(arabic).then(() => {
      setCopied(true);
      toast.success('Teks Arab disalin');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('Gagal menyalin'));
  };
  return (
    <div className="my-3 rounded-lg bg-muted/50 p-4 border border-border/30">
      <p className="text-xl md:text-2xl font-arabic text-foreground leading-[2.2] text-right mb-2" dir="rtl">{arabic}</p>
      {transliteration && <p className="text-sm text-muted-foreground italic">{transliteration}</p>}
      <button onClick={handleCopy} className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Tersalin' : 'Salin teks Arab'}
      </button>
    </div>
  );
}

export default function ShalawatNabiClient() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{data.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{data.subtitle}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {data.author} — Penerjemah: {data.translator}
        </p>
      </motion.div>

      {/* Intro - Muqoddimah */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl bg-card border border-border/50 p-5 md:p-6"
      >
        <h2 className="font-display font-bold text-lg text-foreground mb-4">{data.intro.title}</h2>
        {data.intro.items.map((item, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{item.text}</p>
            {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
            {item.source && <p className="text-xs text-muted-foreground mt-1">📖 {item.source}</p>}
          </div>
        ))}
      </motion.div>

      {/* Keutamaan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-600/5 border border-rose-500/15 p-5 md:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart size={18} className="text-rose-400" />
          <h2 className="font-display font-bold text-lg text-foreground">{data.keutamaan.title}</h2>
        </div>
        {data.keutamaan.items.map((item, i) => (
          <div key={i} className="mb-4 last:mb-0 pl-4 border-l-2 border-rose-400/20">
            <p className="text-sm md:text-base text-foreground/75 leading-relaxed">{item.text}</p>
            {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
            {item.source && <p className="text-xs text-muted-foreground mt-1">📖 {item.source}</p>}
          </div>
        ))}
      </motion.div>

      {/* Faidah */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/15 p-5 md:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-emerald-400" />
          <h2 className="font-display font-bold text-lg text-foreground">{data.faidah.title}</h2>
        </div>
        <ol className="space-y-3">
          {data.faidah.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-xs font-bold text-emerald-400 flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm md:text-base text-foreground/75 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Bacaan Shalawat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-2xl bg-card border border-border/50 p-5 md:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={18} className="text-blue-400" />
          <h2 className="font-display font-bold text-lg text-foreground">{data.bacaan.title}</h2>
        </div>
        {data.bacaan.items.map((item, i) => (
          <div key={i} className="mb-4 last:mb-0">
            {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
            <p className="text-xs text-muted-foreground mt-1">📖 {item.source}</p>
          </div>
        ))}
      </motion.div>

      {/* Tempat Dianjurkan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-600/5 border border-indigo-500/15 p-5 md:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <ListOrdered size={18} className="text-indigo-400" />
          <h2 className="font-display font-bold text-lg text-foreground">{data.tempat.title}</h2>
        </div>
        <ol className="space-y-3">
          {data.tempat.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm md:text-base text-foreground/75 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-center text-muted-foreground/50 text-xs pt-2 pb-4"
      >
        Disarikan dari buku &quot;Shalawat Kepada Nabi, Keutamaan Serta Faidahnya&quot; karya {data.author}
      </motion.p>
    </div>
  );
}
