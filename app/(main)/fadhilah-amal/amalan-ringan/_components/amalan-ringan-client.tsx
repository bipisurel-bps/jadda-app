'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, BookOpen, Info } from 'lucide-react';
import { toast } from 'sonner';
import data from '@/public/data/fadhilah-amalan-ringan.json';

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

export default function AmalanRinganClient() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{data.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {data.author} — {data.publisher}, {data.year}
        </p>
      </motion.div>

      {/* Muqoddimah */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl bg-card border border-border/50 p-5 md:p-6"
      >
        <h2 className="font-display font-bold text-lg text-foreground mb-3">{data.muqoddimah.title}</h2>
        {data.muqoddimah.items.map((item, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{item.text}</p>
            {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
            {item.source && <p className="text-xs text-muted-foreground mt-1">📖 {item.source}</p>}
          </div>
        ))}
      </motion.div>

      {/* Syarat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-600/5 border border-blue-500/15 p-5 md:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-blue-400" />
          <h2 className="font-display font-bold text-lg text-foreground">{data.syarat.title}</h2>
        </div>
        <div className="space-y-4">
          {data.syarat.items.map((item, i) => (
            <div key={i} className="pl-4 border-l-2 border-blue-400/20">
              <p className="text-sm md:text-base text-foreground/75 leading-relaxed">{item.text}</p>
              {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
              {item.source && <p className="text-xs text-muted-foreground mt-1">📖 {item.source}</p>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Jangan Remehkan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl bg-card border border-border/50 p-5 md:p-6"
      >
        <h2 className="font-display font-bold text-lg text-foreground mb-3">{data.janganRemehkan.title}</h2>
        {data.janganRemehkan.items.map((item, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{item.text}</p>
            {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
            {item.source && <p className="text-xs text-muted-foreground mt-1">📖 {item.source}</p>}
          </div>
        ))}
      </motion.div>

      {/* 3 Amalan */}
      {data.amalan.map((amal, idx) => (
        <motion.div
          key={amal.number}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + idx * 0.08 }}
          className={`rounded-2xl p-5 md:p-6 border ${
            idx === 0 ? 'bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border-emerald-500/15' :
            idx === 1 ? 'bg-gradient-to-br from-purple-500/10 to-violet-600/5 border-purple-500/15' :
            'bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-amber-500/15'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center text-sm font-bold text-foreground">
              {amal.number}
            </div>
            <h2 className="font-display font-bold text-base md:text-lg text-foreground">{amal.title}</h2>
          </div>
          <div className="space-y-4">
            {amal.items.map((item, i) => (
              <div key={i} className="pl-4 border-l-2 border-foreground/10">
                <p className="text-sm md:text-base text-foreground/75 leading-relaxed">{item.text}</p>
                {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
                {item.source && <p className="text-xs text-muted-foreground mt-2">📖 {item.source}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Penutup */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
        className="rounded-2xl bg-card border border-border/50 p-5 md:p-6"
      >
        <h2 className="font-display font-bold text-lg text-foreground mb-3">{data.penutup.title}</h2>
        {data.penutup.items.map((item, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{item.text}</p>
            {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
            {item.source && <p className="text-xs text-muted-foreground mt-1">📖 {item.source}</p>}
          </div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-center text-muted-foreground/50 text-xs pt-2 pb-4"
      >
        Disarikan dari buku &quot;Amalan Ringan Berpahala Besar&quot; karya {data.author}
      </motion.p>
    </div>
  );
}
