'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, AlertTriangle, Lightbulb, CheckCircle2, Info } from 'lucide-react';
import { PageHeader } from '@/components/layouts/page-header';

interface JenazahSection {
  id: string; title: string;
  type: 'text' | 'dalil' | 'checklist' | 'info-box' | 'arabic-dua' | 'numbered-list' | 'timeline' | 'recipe-steps' | 'qa';
  content?: string; items?: string[];
  arabic?: string; transliteration?: string; translation?: string; note?: string; infoType?: string;
  dalil?: { text: string; source: string };
  timeline?: { step: number; title: string; desc: string }[];
  recipeSteps?: { title: string; materials?: string[]; steps: string[] }[];
  qas?: { question: string; answer: string }[];
}
interface JenazahChapter { id: number; title: string; icon: string; sections: JenazahSection[]; }
interface JenazahData { title: string; description: string; source: string; note?: string; chapters: JenazahChapter[]; }

function infoIcon(type?: string) { if (type === 'warning') return AlertTriangle; if (type === 'tip') return Lightbulb; return Info; }

export default function FiqhJenazahClient() {
  const [data, setData] = useState<JenazahData | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/fiqh-jenazah.json').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (<div className="min-h-screen bg-[#050a14] flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-transparent rounded-full animate-spin" /></div>);
  }
  if (!data) {
    return (<div className="min-h-screen bg-[#050a14] flex items-center justify-center"><p className="text-white/35">Data tidak tersedia</p></div>);
  }

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title={data.title} description={data.description} backHref="/keilmuan" />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Source Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/[0.03] border border-emerald-400/10 p-4">
          <div className="flex items-start gap-3">
            <BookOpen size={16} className="text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-emerald-400 mb-1 uppercase tracking-tight">Sumber Rujukan</p>
              <p className="text-xs text-white/40 leading-relaxed">{data.source}</p>
            </div>
          </div>
        </motion.div>

        {/* Chapters */}
        <div className="space-y-3">
          {(data.chapters ?? []).map((chapter) => {
            const isOpen = expandedChapters.has(chapter.id);
            return (
              <div key={chapter.id} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <button onClick={() => setExpandedChapters(prev => { const n = new Set(prev); n.has(chapter.id) ? n.delete(chapter.id) : n.add(chapter.id); return n; })}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isOpen ? 'bg-emerald-500/10 border border-emerald-400/20' : 'bg-white/[0.03]'}`}>
                      <BookOpen size={15} className={isOpen ? 'text-emerald-400' : 'text-white/35'} /></div>
                    <div className="text-left">
                      <h3 className={`font-extrabold text-sm ${isOpen ? 'text-emerald-400' : 'text-white/85'}`}>Bab {chapter.id}: {chapter.title}</h3>
                      <p className="text-xs text-white/30">{chapter.sections.length} bahasan</p>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-white/35 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                      <div className="p-4 space-y-5">
                        {chapter.sections.map(section => (<JenazahBlock key={section.id} section={section} />))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function JenazahBlock({ section }: { section: JenazahSection }) {
  switch (section.type) {
    case 'text':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-2">{section.title}</h4>{section.content && <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{section.content}</p>}</div>);
    case 'dalil':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-2">{section.title}</h4>{section.dalil && (
        <div className="rounded-xl bg-emerald-500/5 border-l-2 border-emerald-400 p-3">
          <BookOpen size={14} className="text-emerald-400 mb-2" />
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{section.dalil.text}</p>
          {section.dalil.source && <p className="text-xs text-emerald-400/60 mt-2 font-bold">{section.dalil.source}</p>}
        </div>)}</div>);
    case 'checklist':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-2">{section.title}</h4><ul className="space-y-2">
        {section.items?.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-white/50"><CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />{item}</li>))}
      </ul></div>);
    case 'numbered-list':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-2">{section.title}</h4><ol className="space-y-1.5 list-decimal list-inside">
        {section.items?.map((item, i) => (<li key={i} className="text-sm text-white/50 pl-1"><span className="ml-1">{item}</span></li>))}
      </ol></div>);
    case 'timeline':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-3">{section.title}</h4><div className="space-y-4">
        {section.timeline?.map(step => (<div key={step.step} className="flex gap-3">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
              <span className="text-xs font-extrabold text-emerald-400">{step.step}</span></div>
            <div className="w-px flex-1 bg-white/[0.06] mt-1" /></div>
          <div className="pb-2"><h5 className="font-extrabold text-sm text-white/80">{step.title}</h5><p className="text-xs text-white/45 mt-0.5 leading-relaxed">{step.desc}</p></div>
        </div>))}
      </div></div>);
    case 'recipe-steps':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-3">{section.title}</h4><div className="space-y-4">
        {section.recipeSteps?.map((rs, i) => (<div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <h5 className="font-extrabold text-sm text-emerald-400 mb-2">Langkah {i + 1}: {rs.title}</h5>
          {rs.materials && rs.materials.length > 0 && (<div className="mb-2"><p className="text-xs font-extrabold text-white/40 mb-1 uppercase tracking-tight">Bahan &amp; Persiapan</p><ul className="space-y-0.5">{rs.materials.map((m, j) => (<li key={j} className="flex items-start gap-2 text-xs text-white/45"><CheckCircle2 size={11} className="text-emerald-400 mt-0.5 shrink-0" />{m}</li>))}</ul></div>)}
          {rs.steps.length > 0 && (<div><p className="text-xs font-extrabold text-white/40 mb-1 uppercase tracking-tight">Tata Cara</p><ul className="space-y-1">{rs.steps.map((s, j) => (<li key={j} className="flex items-start gap-2 text-xs text-white/45 leading-relaxed"><span className="text-emerald-400 font-extrabold text-xs shrink-0 mt-0.5">{j + 1}.</span>{s}</li>))}</ul></div>)}
        </div>))}
      </div></div>);
    case 'info-box': {
      const IconComponent = infoIcon(section.infoType); const isWarn = section.infoType === 'warning', isTip = section.infoType === 'tip';
      return (<div>{section.title && <h4 className="font-extrabold text-sm text-white/85 mb-2">{section.title}</h4>}
        <div className={`rounded-xl border p-4 ${isWarn ? 'bg-red-500/5 border-red-400/20' : isTip ? 'bg-emerald-500/5 border-emerald-400/20' : 'bg-blue-500/5 border-blue-400/20'}`}>
          <div className="flex items-start gap-2.5"><IconComponent size={15} className={`${isWarn ? 'text-red-400' : isTip ? 'text-emerald-400' : 'text-blue-400'} mt-0.5 shrink-0`} />
            <div className="space-y-2">{section.content && <p className="text-sm text-white/60 leading-relaxed">{section.content}</p>}
              {section.arabic && <p className="text-lg font-arabic leading-relaxed text-right" dir="rtl">{section.arabic}</p>}
              {section.transliteration && <p className="text-xs text-emerald-400 italic">{section.transliteration}</p>}
              {section.translation && <p className="text-xs text-white/40">{section.translation}</p>}</div>
          </div></div></div>);
    }
    case 'arabic-dua':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-2">{section.title}</h4>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
          {section.arabic && <p className="text-xl md:text-2xl font-arabic leading-[2.2] text-white/85 text-right" dir="rtl">{section.arabic}</p>}
          {section.transliteration && <p className="text-sm text-emerald-400 italic leading-relaxed">{section.transliteration}</p>}
          {section.translation && <p className="text-sm text-white/60 leading-relaxed">{section.translation}</p>}
          {section.note && <p className="text-xs text-white/30 italic">{section.note}</p>}
        </div></div>);
    case 'qa':
      return (<div><h4 className="font-extrabold text-sm text-white/85 mb-2">{section.title}</h4><div className="space-y-3">
        {section.qas?.map((qa, i) => (<div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
          <div className="flex items-start gap-2"><span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">T</span><p className="text-sm font-bold text-white/80">{qa.question}</p></div>
          <div className="flex items-start gap-2 mt-2 pl-1"><span className="text-xs font-extrabold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">J</span><p className="text-sm text-white/50 leading-relaxed">{qa.answer}</p></div>
        </div>))}
      </div></div>);
    default: return null;
  }
}
