'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import data from '@/public/data/fadhilah-amal-shaleh.json';

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

const fadhilahColors = [
  'from-amber-500/20 to-orange-600/10 border-amber-500/20',
  'from-emerald-500/20 to-teal-600/10 border-emerald-500/20',
  'from-blue-500/20 to-cyan-600/10 border-blue-500/20',
  'from-purple-500/20 to-violet-600/10 border-purple-500/20',
  'from-rose-500/20 to-pink-600/10 border-rose-500/20',
  'from-teal-500/20 to-green-600/10 border-teal-500/20',
  'from-indigo-500/20 to-blue-600/10 border-indigo-500/20',
];

export default function FadhilahAmalShalehClient() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{data.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {data.author} — Penerjemah: {data.translator}
        </p>
      </motion.div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl bg-card border border-border/50 p-5 md:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-1 h-12 rounded-full bg-amber-500/60 flex-shrink-0" />
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed italic">{data.intro}</p>
        </div>
      </motion.div>

      {/* Fadhilah */}
      <div className="space-y-4">
        {data.fadhilah.map((f, idx) => (
          <motion.div
            key={f.number}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + idx * 0.05 }}
            className={`rounded-2xl bg-gradient-to-br ${fadhilahColors[idx % fadhilahColors.length]} p-5 md:p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center text-sm font-bold text-foreground">
                {f.number}
              </div>
              <h2 className="font-display font-bold text-base md:text-lg text-foreground">{f.title}</h2>
            </div>
            <div className="space-y-4">
              {f.items.map((item, i) => (
                <div key={i} className="pl-4 border-l-2 border-foreground/10">
                  <p className="text-sm md:text-base text-foreground/75 leading-relaxed">{item.text}</p>
                  {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
                  {item.source && (
                    <p className="text-xs text-muted-foreground mt-2">📖 {item.source}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-muted-foreground/50 text-xs pt-2 pb-4"
      >
        Disarikan dari buku &quot;Fadhilah Amal Shaleh&quot; karya Syaikh Amin bin Abdullah asy-Syaqawi
      </motion.p>
    </div>
  );
}
