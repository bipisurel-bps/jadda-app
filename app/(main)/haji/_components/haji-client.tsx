'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, BookOpen, MapPin, CircleDot, Info, ArrowRight, ArrowLeft,
  Copy, Check, AlertTriangle, Landmark, Mountain, Moon as MoonIcon, Flag
} from 'lucide-react';
import { toast } from 'sonner';

interface HajiItem {
  text: string;
  arabic?: string;
  transliteration?: string;
}

interface HajiStep {
  id: number;
  title: string;
  icon: string;
  preparation?: string[];
  items: HajiItem[];
  notes?: string[];
}

interface HajiData {
  title: string;
  description: string;
  source: string;
  note: string;
  steps: HajiStep[];
}

const stepIcons: Record<string, React.ReactNode> = {
  info: <Info size={20} />,
  location: <MapPin size={20} />,
  ihram: <BookOpen size={20} />,
  types: <Flag size={20} />,
  forbidden: <AlertTriangle size={20} />,
  mosque: <Landmark size={20} />,
  arafah: <Mountain size={20} />,
  muzdalifah: <MoonIcon size={20} />,
  jumrah: <CircleDot size={20} />,
  wada: <Landmark size={20} />,
};

const stepColors = [
  'bg-emerald-500/10 text-emerald-600',
  'bg-blue-500/10 text-blue-600',
  'bg-purple-500/10 text-purple-600',
  'bg-amber-500/10 text-amber-600',
  'bg-red-500/10 text-red-600',
  'bg-teal-500/10 text-teal-600',
  'bg-indigo-500/10 text-indigo-600',
  'bg-orange-500/10 text-orange-600',
  'bg-pink-500/10 text-pink-600',
  'bg-cyan-500/10 text-cyan-600',
];

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

export default function HajiClient() {
  const [data, setData] = useState<HajiData | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [viewMode, setViewMode] = useState<'accordion' | 'stepper'>('accordion');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetch('/data/panduan-haji.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => toast.error('Gagal memuat data panduan haji'));
  }, []);

  const toggleStep = useCallback((idx: number) => {
    setOpenStep(prev => prev === idx ? null : idx);
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const steps = data.steps || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{data.title}</h1>
        <p className="text-sm text-muted-foreground">{data.description}</p>
        <p className="text-xs text-muted-foreground italic">{data.source}</p>
      </motion.div>

      {data.note && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl bg-primary/5 border border-primary/15 p-4">
          <div className="flex gap-3">
            <Info size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">{data.note}</p>
          </div>
        </motion.div>
      )}

      {/* View toggle */}
      <div className="flex gap-2">
        <button onClick={() => setViewMode('accordion')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'accordion' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
          Semua Langkah
        </button>
        <button onClick={() => setViewMode('stepper')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'stepper' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
          Langkah demi Langkah
        </button>
      </div>

      {viewMode === 'accordion' ? (
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isOpen = openStep === idx;
            const color = stepColors[idx % stepColors.length];
            return (
              <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <button onClick={() => toggleStep(idx)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    {stepIcons[step.icon] || <Info size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Langkah {step.id}</p>
                    <p className="font-display font-bold text-foreground truncate">{step.title}</p>
                  </div>
                  {isOpen ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3">
                        {step.preparation && step.preparation.length > 0 && (
                          <div className="rounded-lg bg-muted/30 p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">PERSIAPAN:</p>
                            <ul className="space-y-1">
                              {step.preparation.map((p, i) => (
                                <li key={i} className="text-sm text-foreground flex gap-2">
                                  <span className="text-primary font-bold">{i + 1}.</span> {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {step.items.map((item, i) => (
                          <div key={i}>
                            <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                            <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />
                          </div>
                        ))}
                        {step.notes && step.notes.length > 0 && (
                          <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3 mt-2">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">CATATAN:</p>
                            {step.notes.map((n, i) => (
                              <p key={i} className="text-xs text-muted-foreground leading-relaxed mt-1">• {n}</p>
                            ))}
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
        /* Stepper view */
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {steps.map((step, idx) => (
              <button key={step.id} onClick={() => setCurrentStep(idx)}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  idx === currentStep ? 'bg-primary text-primary-foreground shadow-md scale-110' :
                  idx < currentStep ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                {step.id}
              </button>
            ))}
          </div>

          {steps[currentStep] && (
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              className="rounded-xl bg-card border border-border/50 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stepColors[currentStep % stepColors.length]}`}>
                  {stepIcons[steps[currentStep].icon] || <Info size={20} />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Langkah {steps[currentStep].id} dari {steps.length}</p>
                  <h2 className="font-display font-bold text-lg text-foreground">{steps[currentStep].title}</h2>
                </div>
              </div>
              {steps[currentStep].preparation && (
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">PERSIAPAN:</p>
                  <ul className="space-y-1">
                    {steps[currentStep].preparation!.map((p, i) => (
                      <li key={i} className="text-sm text-foreground flex gap-2">
                        <span className="text-primary font-bold">{i + 1}.</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {steps[currentStep].items.map((item, i) => (
                <div key={i}>
                  <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                  <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />
                </div>
              ))}
              {steps[currentStep].notes && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">CATATAN:</p>
                  {steps[currentStep].notes!.map((n, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed mt-1">• {n}</p>
                  ))}
                </div>
              )}
              <div className="flex justify-between pt-2">
                <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted/80 transition-colors">
                  <ArrowLeft size={16} /> Sebelumnya
                </button>
                <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                  Selanjutnya <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      <p className="text-center text-[11px] text-muted-foreground italic">Sumber: Mulakhos Fiqhi (Kitabul Hajj) &mdash; Syaikh Shaleh bin Fauzan Al-Fauzan</p>
    </div>
  );
}
