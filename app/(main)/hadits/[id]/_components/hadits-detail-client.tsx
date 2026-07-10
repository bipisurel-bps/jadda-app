'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Share2, Star, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layouts/page-header';

interface Hadits {
  id: number;
  title: string;
  arabic: string;
  narrator: string;
  translation: string;
  source: string;
  kandungan: string;
}

interface HaditsData {
  title: string;
  description: string;
  hadits: Hadits[];
}

export default function HaditsDetailClient() {
  const params = useParams();
  const haditsId = parseInt(String(params.id), 10);
  const [allHadits, setAllHadits] = useState<Hadits[]>([]);
  const [hadits, setHadits] = useState<Hadits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/hadits-arbain.json')
      .then((r) => r.json())
      .then((data: HaditsData) => {
        const hds = data.hadits ?? [];
        setAllHadits(hds);
        const found = hds.find((h) => h.id === haditsId);
        setHadits(found ?? null);
      })
      .catch(() => setHadits(null))
      .finally(() => setLoading(false));
  }, [haditsId]);

  const prevHadits = allHadits.find((h) => h.id === haditsId - 1);
  const nextHadits = allHadits.find((h) => h.id === haditsId + 1);

  const shareHadits = async () => {
    if (!hadits) return;
    try {
      await navigator.share({
        text: `${hadits.title}\n\n${hadits.arabic}\n\n"${hadits.translation}"\n\nHR. ${hadits.source}`,
      });
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hadits) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-sm text-white/35">Hadits tidak ditemukan</p>
        <Link href="/hadits" className="mt-4 text-sm text-emerald-400 font-medium">← Kembali ke daftar hadits</Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Hadits Arbain" description={`Hadits ke-${hadits.id}`} backHref="/hadits" />

      <div className="mt-4 space-y-4 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card border border-amber-500/20"
        >
          {/* Number & Title */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-amber-500">{hadits.id}</span>
            </div>
            <h2 className="text-base font-bold text-foreground">{hadits.title}</h2>
          </div>

          {/* Arabic text */}
          <div className="p-4 rounded-xl bg-card/50 border border-border">
            <p className="text-xl leading-[2.2] text-right font-arabic text-foreground">
              {hadits.arabic}
            </p>
          </div>

          {/* Narrator + Source */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-[11px] font-semibold text-amber-500">
              <Book size={10} />
              {hadits.narrator}
            </span>
            <span className="text-[11px] text-white/35">
              {hadits.source}
            </span>
          </div>
        </motion.div>

        {/* Translation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-white/[0.03] border border-border"
        >
          <h3 className="text-xs font-semibold text-white/35 mb-2">TERJEMAHAN</h3>
          <p className="text-sm leading-relaxed text-white/70">{hadits.translation}</p>
        </motion.div>

        {/* Kandungan / Lesson */}
        {hadits.kandungan && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-border"
          >
            <h3 className="text-xs font-semibold text-white/35 mb-2">KANDUNGAN HADITS</h3>
            <div className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
              {hadits.kandungan}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-white/[0.06] z-30 px-4 py-2.5 flex items-center justify-between">
        {prevHadits ? (
          <Link
            href={`/hadits/${prevHadits.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-sm font-semibold"
          >
            <ChevronLeft size={16} className="text-emerald-400" />
            <span className="truncate max-w-[120px]">Hadits {prevHadits.id}</span>
          </Link>
        ) : <div />}

        <Link
          href="/hadits"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-sm font-semibold text-white/35"
        >
          <Book size={14} />
          Semua Hadits
        </Link>

        {nextHadits ? (
          <Link
            href={`/hadits/${nextHadits.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-sm font-semibold"
          >
            <span className="truncate max-w-[120px]">Hadits {nextHadits.id}</span>
            <ChevronRight size={16} className="text-emerald-400" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
