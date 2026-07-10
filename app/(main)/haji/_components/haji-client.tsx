'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, MapPin, CircleDot, Info, ArrowRight, ArrowLeft, Copy, Check, AlertTriangle, Landmark, Mountain, Flag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layouts/page-header';

interface HajiItem { text: string; arabic?: string; transliteration?: string; }
interface HajiStep { id: number; title: string; icon: string; preparation?: string[]; items: HajiItem[]; notes?: string[]; }
interface HajiData { title: string; description: string; source: string; note: string; steps: HajiStep[]; }

const stepIcons: Record<string, React.ReactNode> = {
  info: <Info size={20} />, location: <MapPin size={20} />, ihram: <BookOpen size={20} />, types: <Flag size={20} />,
  forbidden: <AlertTriangle size={20} />, mosque: <Landmark size={20} />, arafah: <Mountain size={20} />,
  muzdalifah: <Star size={20} />, jumrah: <CircleDot size={20} />, wada: <Landmark size={20} />, star: <Star size={20} />,
};

const stepAccents = ['#059669', '#2563EB', '#7C3AED', '#D97706', '#E11D48', '#0D9488', '#6366F1', '#EA580C', '#EC4899', '#0891B2'];

function ArabicBlock({ arabic, transliteration }: { arabic?: string; transliteration?: string }) {
  const [copied, setCopied] = useState(false);
  if (!arabic) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(arabic).then(() => { setCopied(true); toast.success('Teks Arab disalin'); setTimeout(() => setCopied(false), 2000); }).catch(() => toast.error('Gagal menyalin'));
  };
  return (
    <div className="my-3 rounded-xl bg-emerald-500/5 border border-emerald-400/10 p-4">
      <p className="text-xl md:text-2xl font-arabic text-white/85 leading-[2.2] text-right mb-2" dir="rtl">{arabic}</p>
      {transliteration && <p className="text-sm text-white/40 italic">{transliteration}</p>}
      <button onClick={handleCopy} className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
        {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Tersalin' : 'Salin'}</button>
    </div>
  );
}

export default function HajiClient() {
  const [data, setData] = useState<HajiData | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [viewMode, setViewMode] = useState<'accordion' | 'stepper'>('accordion');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetch('/data/panduan-haji.json').then(r => r.json()).then(setData).catch(() => toast.error('Gagal memuat data panduan haji'));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const steps = data.steps || [];

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title={data.title} description={data.description} backHref="/" />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Important Note */}
        {data.note && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-emerald-500/5 border border-emerald-400/10 p-4">
            <div className="flex gap-3"><Info size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-white/70 leading-relaxed">{data.note}</p></div>
          </motion.div>
        )}

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          {([
            { mode: 'accordion' as const, label: 'Semua Langkah' },
            { mode: 'stepper' as const, label: 'Langkah demi Langkah' },
          ]).map(({ mode, label }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border"
              style={{
                backgroundColor: viewMode === mode ? '#05966918' : 'transparent',
                borderColor: viewMode === mode ? '#05966940' : 'rgba(255,255,255,0.06)',
                color: viewMode === mode ? '#34D399' : 'rgba(255,255,255,0.4)',
              }}>{label}</button>
          ))}
        </div>

        {viewMode === 'accordion' ? (
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isOpen = openStep === idx;
              const accent = stepAccents[idx % stepAccents.length];
              return (
                <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                  <button onClick={() => setOpenStep(isOpen ? null : idx)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accent}18`, border: `1px solid ${accent}33`, color: accent }}>
                      {stepIcons[step.icon] || <Info size={20} />}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-white/30">Langkah {step.id}</span>
                      <h3 className="font-extrabold text-sm text-white/85">{step.title}</h3>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-white/35" /> : <ChevronDown size={18} className="text-white/35" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3">
                          {step.preparation && step.preparation.length > 0 && (
                            <div className="rounded-xl bg-white/[0.02] p-3">
                              <p className="text-xs font-extrabold text-white/40 mb-1.5 uppercase tracking-tight">Persiapan</p>
                              <ul className="space-y-1">{step.preparation.map((p, i) => (
                                <li key={i} className="text-sm text-white/60 flex gap-2"><span className="text-emerald-400 font-bold">{i + 1}.</span>{p}</li>
                              ))}</ul>
                            </div>
                          )}
                          {step.items.map((item, i) => (
                            <div key={i}><p className="text-sm text-white/70 leading-relaxed">{item.text}</p>
                              <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} /></div>
                          ))}
                          {step.notes && step.notes.length > 0 && (
                            <div className="rounded-xl bg-amber-500/5 border border-amber-400/10 p-3">
                              <p className="text-xs font-extrabold text-amber-400 mb-1 uppercase tracking-tight">Catatan</p>
                              {step.notes.map((n, i) => (<p key={i} className="text-xs text-white/45 leading-relaxed mt-1">• {n}</p>))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {steps.map((step, idx) => (
                <button key={step.id} onClick={() => setCurrentStep(idx)}
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    backgroundColor: idx === currentStep ? '#059669' : idx < currentStep ? '#05966940' : 'rgba(255,255,255,0.04)',
                    color: idx === currentStep ? '#fff' : idx < currentStep ? '#34D399' : 'rgba(255,255,255,0.35)',
                  }}>{step.id}</button>
              ))}
            </div>
            {steps[currentStep] && (
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stepAccents[currentStep % stepAccents.length]}18`, border: `1px solid ${stepAccents[currentStep % stepAccents.length]}33`, color: stepAccents[currentStep % stepAccents.length] }}>
                    {stepIcons[steps[currentStep].icon] || <Info size={20} />}</div>
                  <div><span className="text-[10px] font-bold text-white/30">Langkah {steps[currentStep].id} dari {steps.length}</span>
                    <h2 className="font-extrabold text-base text-white/90">{steps[currentStep].title}</h2></div>
                </div>
                {steps[currentStep].preparation && (
                  <div className="rounded-xl bg-white/[0.02] p-3">
                    <p className="text-xs font-extrabold text-white/40 mb-1.5 uppercase tracking-tight">Persiapan</p>
                    <ul className="space-y-1">{steps[currentStep].preparation!.map((p, i) => (
                      <li key={i} className="text-sm text-white/60 flex gap-2"><span className="text-emerald-400 font-bold">{i + 1}.</span>{p}</li>
                    ))}</ul></div>
                )}
                {steps[currentStep].items.map((item, i) => (
                  <div key={i}><p className="text-sm text-white/70 leading-relaxed">{item.text}</p>
                    <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} /></div>
                ))}
                {steps[currentStep].notes && (
                  <div className="rounded-xl bg-amber-500/5 border border-amber-400/10 p-3">
                    <p className="text-xs font-extrabold text-amber-400 mb-1 uppercase tracking-tight">Catatan</p>
                    {steps[currentStep].notes!.map((n, i) => (<p key={i} className="text-xs text-white/45 leading-relaxed mt-1">• {n}</p>))}</div>
                )}
                <div className="flex justify-between pt-2">
                  <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30 transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                    <ArrowLeft size={15} /> Sebelumnya</button>
                  <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold disabled:opacity-30 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                    Selanjutnya <ArrowRight size={15} /></button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <p className="text-center text-[11px] text-white/25 italic pt-2">
          Sumber: Mulakhos Fiqhi (Kitabul Hajj) — Syaikh Shaleh bin Fauzan Al-Fauzan
        </p>
      </div>
    </div>
  );
}
