'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, BookOpen, AlertTriangle, Lightbulb, CheckCircle2, Info } from 'lucide-react';

interface SafarSection {
  id: string;
  title: string;
  type: 'text' | 'dalil' | 'checklist' | 'madhab-table' | 'info-box' | 'arabic-dua' | 'numbered-list' | 'qa';
  content?: string;
  items?: string[];
  arabic?: string;
  transliteration?: string;
  translation?: string;
  note?: string;
  infoType?: string;
  dalil?: { text: string; source: string };
  madhabTable?: { headers: string[]; rows: { madhab: string; opinion: string }[] };
  qas?: { question: string; answer: string }[];
}

interface SafarChapter {
  id: number;
  title: string;
  icon: string;
  sections: SafarSection[];
}

interface SafarData {
  title: string;
  description: string;
  source: string;
  note?: string;
  chapters: SafarChapter[];
}

const ACCENT = {
  primary: 'border-cyan-400/30 text-cyan-400',
  bg: 'bg-cyan-500/10',
  border: 'border-cyan-400/20',
  gradient: 'from-cyan-500/10 to-blue-600/5',
};

function infoIcon(type?: string) {
  if (type === 'warning') return AlertTriangle;
  if (type === 'tip') return Lightbulb;
  return Info;
}

function infoBg(infoType?: string): string {
  if (infoType === 'warning') return 'border-red-400/30 bg-red-500/5';
  if (infoType === 'tip') return 'border-cyan-400/30 bg-cyan-500/5';
  return 'border-blue-400/30 bg-blue-500/5';
}

function infoIconColor(infoType?: string): string {
  if (infoType === 'warning') return 'text-red-400';
  if (infoType === 'tip') return 'text-cyan-400';
  return 'text-blue-400';
}

export default function FiqhSafarClient() {
  const [data, setData] = useState<SafarData | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/fiqh-safar.json')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-white/35">Data tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      {/* Back nav */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/keilmuan"
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white/85 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Keilmuan
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{data.title}</h1>
        <p className="text-sm text-white/35 mt-1">{data.description}</p>
      </motion.div>

      {/* Source Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-400/10 p-4"
      >
        <div className="flex items-start gap-3">
          <BookOpen size={18} className="text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-cyan-400 mb-1">Sumber Rujukan</p>
            <p className="text-xs text-white/35 leading-relaxed">{data.source}</p>
          </div>
        </div>
      </motion.div>

      {/* Chapters */}
      <div className="space-y-3">
        {(data.chapters ?? []).map((chapter) => {
          const isOpen = expandedChapters.has(chapter.id);
          return (
            <div key={chapter.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden shadow-sm">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isOpen ? 'bg-cyan-500/5 border-b border-border' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isOpen ? 'bg-cyan-500/10 border border-cyan-400/20' : 'bg-muted'}`}>
                    <BookOpen size={16} className={isOpen ? 'text-cyan-400' : 'text-white/35'} />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-display font-bold text-sm ${isOpen ? 'text-cyan-400' : 'text-white/85'}`}>
                      Bab {chapter.id}: {chapter.title}
                    </h3>
                    <p className="text-xs text-white/35">{chapter.sections.length} bahasan</p>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-white/35 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 space-y-5">
                      {chapter.sections.map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Section Renderer ─── */
function SectionRenderer({ section }: { section: SafarSection }) {
  switch (section.type) {
    case 'text':
      return (
        <div>
          <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>
          {section.content && (
            <p className="text-sm text-white/35 leading-relaxed whitespace-pre-line">{section.content}</p>
          )}
        </div>
      );

    case 'dalil':
      return (
        <div>
          <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>
          {section.dalil && (
            <div className="rounded-xl bg-cyan-500/5 border-l-2 border-cyan-400 p-3">
              <BookOpen size={14} className="text-cyan-400 mb-2" />
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{section.dalil.text}</p>
              {section.dalil.source && (
                <p className="text-xs text-cyan-400/70 mt-2 font-medium">{section.dalil.source}</p>
              )}
            </div>
          )}
        </div>
      );

    case 'checklist':
      return (
        <div>
          <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>
          <ul className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/35 leading-relaxed">
                <CheckCircle2 size={15} className="text-cyan-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'numbered-list':
      return (
        <div>
          <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>
          <ol className="space-y-2 list-decimal list-inside">
            {section.items?.map((item, i) => (
              <li key={i} className="text-sm text-white/35 leading-relaxed pl-1">
                <span className="ml-1">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case 'madhab-table':
      return (
        <div>
          <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>
          {section.madhabTable && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.04]">
                    {section.madhabTable.headers.map((h, i) => (
                      <th key={i} className="px-3 py-2.5 text-left font-semibold text-white/70 text-xs">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.madhabTable.rows.map((row, i) => (
                    <tr key={i} className="border-t border-white/50 hover:bg-white/20 transition-colors">
                      <td className="px-3 py-2.5 font-semibold text-white/70 text-xs">{row.madhab}</td>
                      <td className="px-3 py-2.5 text-white/35 text-xs leading-relaxed">{row.opinion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );

    case 'info-box':
      const IconComponent = infoIcon(section.infoType);
      return (
        <div>
          {section.title && <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>}
          <div className={`rounded-xl border p-4 ${infoBg(section.infoType)}`}>
            <div className="flex items-start gap-2.5">
              <IconComponent size={16} className={`${infoIconColor(section.infoType)} mt-0.5 shrink-0`} />
              <div className="space-y-2">
                {section.content && <p className="text-sm text-white/70 leading-relaxed">{section.content}</p>}
                {section.arabic && (
                  <p className="text-lg font-arabic leading-relaxed text-right" dir="rtl">{section.arabic}</p>
                )}
                {section.transliteration && (
                  <p className="text-xs text-cyan-700 dark:text-cyan-400 italic">{section.transliteration}</p>
                )}
                {section.translation && (
                  <p className="text-xs text-white/35">{section.translation}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    case 'arabic-dua':
      return (
        <div>
          <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>
          <div className="rounded-xl bg-muted/20 dark:bg-muted/10 p-4 space-y-3">
            {section.arabic && (
              <p className="text-xl md:text-2xl font-arabic leading-[2.2] text-white/85 text-right" dir="rtl">
                {section.arabic}
              </p>
            )}
            {section.transliteration && (
              <p className="text-sm text-cyan-700 dark:text-cyan-400 italic leading-relaxed">{section.transliteration}</p>
            )}
            {section.translation && (
              <p className="text-sm text-white/70 leading-relaxed">{section.translation}</p>
            )}
            {section.note && (
              <p className="text-xs text-white/35/60 italic">{section.note}</p>
            )}
          </div>
        </div>
      );

    case 'qa':
      return (
        <div>
          <h4 className="font-bold text-sm text-white/85 mb-2">{section.title}</h4>
          <div className="space-y-3">
            {section.qas?.map((qa, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] p-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full shrink-0">T</span>
                  <p className="text-sm font-semibold text-foreground">{qa.question}</p>
                </div>
                <div className="flex items-start gap-2 mt-2 pl-1">
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full shrink-0">J</span>
                  <p className="text-sm text-white/35 leading-relaxed">{qa.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
