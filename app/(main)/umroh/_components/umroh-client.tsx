'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plane, MapPin, CircleDot, BookOpen, Droplets, Scissors, DoorOpen, Footprints, Copy, Check, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layouts/page-header';

interface SubNote { text: string; arabic?: string; transliteration?: string; }
interface UmrohItem { text: string; arabic?: string; transliteration?: string; subnotes?: SubNote[]; }
interface UmrohStep { id: number; title: string; icon: string; preparation?: string[]; items: UmrohItem[]; notes?: string[]; }
interface UmrohData { title: string; description: string; note: string; steps: UmrohStep[]; }

const stepIcons: Record<string, React.ReactNode> = {
  preparation: <Plane size={20} />, ihram: <BookOpen size={20} />, mosque: <MapPin size={20} />,
  thawaf: <CircleDot size={20} />, prayer: <BookOpen size={20} />, zamzam: <Droplets size={20} />,
  hajar: <CircleDot size={20} />, sai: <Footprints size={20} />, tahallul: <Scissors size={20} />, exit: <DoorOpen size={20} />,
};

const stepAccents = ['#059669', '#D97706', '#2563EB', '#7C3AED', '#E11D48', '#0D9488', '#EA580C', '#6366F1', '#EC4899', '#0891B2'];

function ArabicBlock({ arabic, transliteration }: { arabic: string; transliteration?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(arabic).then(() => { setCopied(true); toast.success('Teks Arab disalin'); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }, [arabic]);
  return (
    <div className="my-3 rounded-xl bg-emerald-500/5 border border-emerald-400/10 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xl md:text-2xl font-arabic leading-[2.2] text-white/85 text-right flex-1" dir="rtl">{arabic}</p>
        <button onClick={handleCopy} className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors">
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-white/35" />}
        </button>
      </div>
      {transliteration && <p className="mt-2 text-sm italic text-white/40">{transliteration}</p>}
    </div>
  );
}

export default function UmrohClient() {
  const [data, setData] = useState<UmrohData | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'accordion' | 'stepper'>('accordion');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetch('/data/panduan-umroh.json').then(r => r.json()).then(setData).catch(() => toast.error('Gagal memuat data panduan umroh'));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const step = data.steps[currentStep];
  const a = stepAccents[currentStep % stepAccents.length];

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title={data.title} description={`${data.steps.length} langkah tata cara umrah`} backHref="/" />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Description */}
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="text-sm text-white/50 leading-relaxed">{data.description}</motion.p>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          {([
            { mode: 'accordion' as const, label: 'Semua Langkah' },
            { mode: 'stepper' as const, label: 'Satu Per Satu' },
          ]).map(({ mode, label }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border"
              style={{
                backgroundColor: viewMode === mode ? '#05966918' : 'transparent',
                borderColor: viewMode === mode ? '#05966940' : 'rgba(255,255,255,0.06)',
                color: viewMode === mode ? '#34D399' : 'rgba(255,255,255,0.4)',
              }}>
              {label}
            </button>
          ))}
        </div>

        {viewMode === 'accordion' ? (
          <div className="space-y-3">
            {data.steps.map((s, idx) => {
              const isOpen = openStep === s.id;
              const accent = stepAccents[idx % stepAccents.length];
              return (
                <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                  <button onClick={() => setOpenStep(isOpen ? null : s.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accent}18`, border: `1px solid ${accent}33`, color: accent }}>
                      {stepIcons[s.icon] || <CircleDot size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-white/30">Langkah {s.id}</span>
                      <h3 className="font-extrabold text-sm text-white/85">{s.title}</h3>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-white/35" /> : <ChevronDown size={18} className="text-white/35" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }} className="overflow-hidden">
                        <StepContent step={s} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : step ? (
          <>
            <div className="flex items-center gap-1">{data.steps.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentStep(idx)} className="h-1.5 flex-1 rounded-full transition-colors"
                style={{ backgroundColor: idx === currentStep ? '#059669' : idx < currentStep ? '#05966955' : 'rgba(255,255,255,0.06)' }} />
            ))}</div>

            <motion.div key={step.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
              <div className="p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${a}18`, border: `1px solid ${a}33`, color: a }}>
                    {stepIcons[step.icon] || <CircleDot size={22} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/30">Langkah {step.id} dari {data.steps.length}</span>
                    <h3 className="font-extrabold text-base text-white/90">{step.title}</h3>
                  </div>
                </div>
              </div>
              <StepContent step={step} />
            </motion.div>

            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                <ArrowLeft size={15} /> Sebelumnya</button>
              <span className="text-xs text-white/35 font-mono">{currentStep + 1}/{data.steps.length}</span>
              <button onClick={() => setCurrentStep(p => Math.min(data.steps.length - 1, p + 1))} disabled={currentStep === data.steps.length - 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold disabled:opacity-30 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                Selanjutnya <ArrowRight size={15} /></button>
            </div>
          </>
        ) : null}

        {/* Footer Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-2xl bg-amber-500/5 border border-amber-400/10 p-4">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/80 leading-relaxed">{data.note}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StepContent({ step }: { step: UmrohStep }) {
  return (
    <div className="p-4 space-y-3">
      {step.preparation && step.preparation.length > 0 && (
        <div className="rounded-xl bg-blue-500/5 border border-blue-400/10 p-3">
          <p className="text-xs font-extrabold text-blue-400 mb-1.5 uppercase tracking-tight">Persiapan</p>
          <ul className="space-y-1">{step.preparation.map((p, i) => (
            <li key={i} className="text-sm text-white/60 flex gap-2"><span className="text-blue-400 font-bold">{i + 1}.</span>{p}</li>
          ))}</ul>
        </div>
      )}
      <ol className="space-y-3">
        {step.items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/70 leading-relaxed">{item.text}</p>
              {item.arabic && <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />}
              {item.subnotes && item.subnotes.length > 0 && (
                <div className="mt-2 ml-2 space-y-2 border-l-2 border-emerald-500/20 pl-3">
                  {item.subnotes.map((sub, si) => (
                    <div key={si}><p className="text-sm text-white/45">{sub.text}</p>
                      {sub.arabic && <ArabicBlock arabic={sub.arabic} transliteration={sub.transliteration} />}
                    </div>
                  ))}</div>
              )}
            </div>
          </li>
        ))}
      </ol>
      {step.notes && step.notes.length > 0 && (
        <div className="rounded-xl bg-white/[0.02] p-3 mt-2">
          <p className="text-xs font-extrabold text-white/40 mb-1.5 uppercase tracking-tight">Keterangan</p>
          <ul className="space-y-1">{step.notes.map((n, i) => (
            <li key={i} className="text-xs text-white/35 leading-relaxed">• {n}</li>
          ))}</ul>
        </div>
      )}
    </div>
  );
}
