'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';
import data from '@/public/data/fadhilah-amalan-setara-haji.json';

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
    <div className="my-3 rounded-lg bg-white/[0.04] p-4 border border-white/30">
      <p className="text-xl md:text-2xl font-arabic text-white/85 leading-[2.2] text-right mb-2" dir="rtl">{arabic}</p>
      {transliteration && <p className="text-sm text-white/35 italic">{transliteration}</p>}
      <button onClick={handleCopy} className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-400/80 transition-colors">
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Tersalin' : 'Salin teks Arab'}
      </button>
    </div>
  );
}

const itemColors = [
  'border-l-amber-400/40',
  'border-l-blue-400/40',
  'border-l-emerald-400/40',
  'border-l-purple-400/40',
  'border-l-rose-400/40',
  'border-l-teal-400/40',
  'border-l-indigo-400/40',
  'border-l-orange-400/40',
];

export default function AmalanSetaraHajiClient() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{data.title}</h1>
        <p className="text-xs text-white/35 mt-1">
          {data.author} — {data.description}
        </p>
      </motion.div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-4 md:p-5 flex items-start gap-3"
      >
        <Info size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-white/65 leading-relaxed">{data.warning}</p>
      </motion.div>

      {/* Items */}
      <div className="space-y-4">
        {data.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + idx * 0.04 }}
            className="rounded-2xl bg-white/[0.03] border border-white/50 hover:border-white/80 transition-colors p-5 md:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={14} className="text-purple-400" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm md:text-base text-white/70 leading-relaxed">{item.text}</p>
                {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
                {item.source && (
                  <p className="text-xs text-white/35">📖 {item.source}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notes */}
      {data.notes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-600/5 border border-purple-500/15 p-5 md:p-6"
        >
          <p className="text-sm text-white/65 leading-relaxed">{data.notes}</p>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-center text-white/35/50 text-xs pt-2 pb-4"
      >
        Disarikan dari materi Khutbah Jum&apos;at oleh {data.author} -waffaqahullah-
      </motion.p>
    </div>
  );
}
