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
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        <p className="mt-3 text-sm text-white/35">Memuat hadits...</p>
      </div>
    );
  }

  if (!hadits) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20 px-4">
        <p className="text-sm text-white/50">Hadits tidak ditemukan</p>
        <Link href="/hadits" className="mt-4 text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">← Kembali ke daftar hadits</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title="Hadits Arbain" description={`Hadits ke-${hadits.id}`} backHref="/hadits" />

      <div className="mt-4 space-y-4 pb-24">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/10 overflow-hidden"
        >
          <div className="p-5">
            {/* Number & Title */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <span className="text-sm font-bold text-emerald-400">{hadits.id}</span>
              </div>
              <h2 className="text-base font-bold text-white/85">{hadits.title}</h2>
              <button
                onClick={shareHadits}
                className="ml-auto w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
              >
                <Share2 size={13} className="text-white/40" />
              </button>
            </div>

            {/* Arabic text */}
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-3">
              <p className="text-xl leading-[2.2] text-right font-arabic text-white/90" dir="rtl">
                {hadits.arabic}
              </p>
            </div>

            {/* Narrator + Source */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-400">
                <Book size={10} />
                {hadits.narrator}
              </span>
              <span className="text-[11px] text-white/30">
                {hadits.source}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Translation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"
        >
          <h3 className="text-[11px] font-extrabold text-white/30 uppercase tracking-tight mb-3">Terjemahan</h3>
          <p className="text-sm leading-relaxed text-white/70">{hadits.translation}</p>
        </motion.div>

        {/* Kandungan / Lesson */}
        {hadits.kandungan && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"
          >
            <h3 className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-tight mb-3">Kandungan Hadits</h3>
            <div className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
              {hadits.kandungan}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 bg-[#0a1225]/95 backdrop-blur-md border-t border-white/[0.06] z-30 px-4 py-2.5 flex items-center justify-between">
        {prevHadits ? (
          <Link
            href={`/hadits/${prevHadits.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm font-semibold text-white/70"
          >
            <ChevronLeft size={16} className="text-emerald-400" />
            <span className="truncate max-w-[120px]">Hadits {prevHadits.id}</span>
          </Link>
        ) : <div />}

        <Link
          href="/hadits"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm font-semibold text-white/35"
        >
          <Book size={14} />
          Semua Hadits
        </Link>

        {nextHadits ? (
          <Link
            href={`/hadits/${nextHadits.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm font-semibold text-white/70"
          >
            <span className="truncate max-w-[120px]">Hadits {nextHadits.id}</span>
            <ChevronRight size={16} className="text-emerald-400" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
