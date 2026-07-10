'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Book, MapPin, PenLine, ScrollText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/layouts/page-header';

interface Section {
  title: string;
  content: string;
}

interface Chapter {
  id: number;
  title: string;
  icon: string;
  sections: Section[];
}

interface SirahData {
  title: string;
  subtitle: string;
  meaning: string;
  description: string;
  source: string;
  note: string;
  chapters: Chapter[];
}

const iconMap: Record<string, React.ReactNode> = {
  'map-pin': <MapPin size={16} />,
  'pen-line': <PenLine size={16} />,
  'scroll-text': <ScrollText size={16} />,
  book: <Book size={16} />,
  globe: <Globe size={16} />,
};

export default function SirahClient() {
  const [data, setData] = useState<SirahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

  useEffect(() => {
    fetch('/data/sirah-alquran.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-white/35">Gagal memuat data</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={data.title} description={data.meaning} />

      {/* Description */}
      <div className="mt-4 mb-4 p-4 rounded-xl bg-white/[0.03] border border-border">
        <p className="text-sm leading-relaxed text-white/35">{data.description}</p>
        <p className="text-xs text-white/35/60 mt-2">— {data.source}</p>
      </div>

      {/* Chapters */}
      <div className="space-y-2 pb-8">
        {data.chapters.map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
          >
            <button
              onClick={() => setExpandedChapter(expandedChapter === ch.id ? null : ch.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400">{iconMap[ch.icon] ?? <Book size={16} />}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{ch.title}</h3>
              </div>
              {expandedChapter === ch.id ? (
                <ChevronUp size={18} className="text-white/35 flex-shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-white/35 flex-shrink-0" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {expandedChapter === ch.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-white/50 pt-3">
                    {ch.sections.map((sec, si) => (
                      <div key={si}>
                        <h4 className="text-sm font-semibold text-white/85 mb-1">{sec.title}</h4>
                        <p className="text-sm leading-relaxed text-white/35">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Note */}
      {data.note && (
        <p className="text-xs text-center text-white/35/50 pb-8 italic">{data.note}</p>
      )}
    </div>
  );
}
