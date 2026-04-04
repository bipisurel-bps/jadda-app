'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Plane,
  MapPin,
  CircleDot,
  BookOpen,
  Droplets,
  Scissors,
  DoorOpen,
  Footprints,
  Copy,
  Check,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

interface SubNote {
  text: string;
  arabic?: string;
  transliteration?: string;
}

interface UmrohItem {
  text: string;
  arabic?: string;
  transliteration?: string;
  subnotes?: SubNote[];
}

interface UmrohStep {
  id: number;
  title: string;
  icon: string;
  preparation?: string[];
  items: UmrohItem[];
  notes?: string[];
}

interface UmrohData {
  title: string;
  description: string;
  note: string;
  steps: UmrohStep[];
}

const stepIcons: Record<string, React.ReactNode> = {
  preparation: <Plane size={20} />,
  ihram: <BookOpen size={20} />,
  mosque: <MapPin size={20} />,
  thawaf: <CircleDot size={20} />,
  prayer: <BookOpen size={20} />,
  zamzam: <Droplets size={20} />,
  hajar: <CircleDot size={20} />,
  sai: <Footprints size={20} />,
  tahallul: <Scissors size={20} />,
  exit: <DoorOpen size={20} />,
};

const stepColors = [
  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
];

function ArabicBlock({ arabic, transliteration }: { arabic: string; transliteration?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(arabic).then(() => {
      setCopied(true);
      toast.success('Teks Arab berhasil disalin');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [arabic]);

  return (
    <div className="my-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xl md:text-2xl font-arabic leading-[2.2] text-foreground text-right flex-1" dir="rtl">
          {arabic}
        </p>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label="Salin teks Arab"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
        </button>
      </div>
      {transliteration && (
        <p className="mt-2 text-sm italic text-muted-foreground leading-relaxed">
          {transliteration}
        </p>
      )}
    </div>
  );
}

export default function UmrohClient() {
  const [data, setData] = useState<UmrohData | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'accordion' | 'stepper'>('accordion');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetch('/data/panduan-umroh.json')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => toast.error('Gagal memuat data panduan umroh'));
  }, []);

  const toggleStep = (id: number) => {
    setOpenStep(prev => (prev === id ? null : id));
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Memuat panduan umrah...</div>
      </div>
    );
  }

  const step = data.steps[currentStep];
  const colorClass = stepColors[currentStep % stepColors.length];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
              {data.title}
            </h1>
            <p className="text-sm text-muted-foreground">{data.steps.length} langkah tata cara umrah</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {data.description}
        </p>
      </motion.div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('accordion')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'accordion'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Semua Langkah
        </button>
        <button
          onClick={() => setViewMode('stepper')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'stepper'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Satu per Satu
        </button>
      </div>

      {/* Accordion View */}
      {viewMode === 'accordion' && (
        <div className="space-y-3">
          {data.steps.map((s, idx) => {
            const isOpen = openStep === s.id;
            const color = stepColors[idx % stepColors.length];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleStep(s.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    {stepIcons[s.icon] || <CircleDot size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">Langkah {s.id}</span>
                    </div>
                    <h3 className="font-display font-bold text-foreground truncate">{s.title}</h3>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={20} className="text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <StepContent step={s} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stepper View */}
      {viewMode === 'stepper' && step && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center gap-1">
            {data.steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  idx === currentStep
                    ? 'bg-primary'
                    : idx < currentStep
                    ? 'bg-primary/40'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                  {stepIcons[step.icon] || <CircleDot size={22} />}
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-foreground">Langkah {step.id} dari {data.steps.length}</span>
                  <h3 className="text-xl font-display font-bold text-foreground">{step.title}</h3>
                </div>
              </div>
            </div>
            <StepContent step={step} />
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-sm font-medium disabled:opacity-30 hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft size={16} /> Sebelumnya
            </button>
            <span className="text-sm text-muted-foreground font-medium">
              {currentStep + 1} / {data.steps.length}
            </span>
            <button
              onClick={() => setCurrentStep(p => Math.min(data.steps.length - 1, p + 1))}
              disabled={currentStep === data.steps.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 hover:bg-primary/90 transition-colors"
            >
              Selanjutnya <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 p-4"
      >
        <div className="flex items-start gap-3">
          <Info size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            {data.note}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function StepContent({ step }: { step: UmrohStep }) {
  return (
    <div className="p-4 space-y-3">
      {/* Preparation notes */}
      {step.preparation && step.preparation.length > 0 && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 p-3">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1.5">Persiapan:</p>
          <ul className="space-y-1">
            {step.preparation.map((p, i) => (
              <li key={i} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Items */}
      <ol className="space-y-4">
        {step.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
              {item.arabic && (
                <ArabicBlock arabic={item.arabic} transliteration={item.transliteration} />
              )}
              {/* Subnotes */}
              {item.subnotes && item.subnotes.length > 0 && (
                <div className="mt-2 ml-2 space-y-3 border-l-2 border-primary/20 pl-3">
                  {item.subnotes.map((sub, si) => (
                    <div key={si}>
                      <p className="text-sm text-muted-foreground">{sub.text}</p>
                      {sub.arabic && (
                        <ArabicBlock arabic={sub.arabic} transliteration={sub.transliteration} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Notes */}
      {step.notes && step.notes.length > 0 && (
        <div className="rounded-lg bg-muted/50 p-3 mt-3">
          <p className="text-xs font-bold text-muted-foreground mb-1.5">Keterangan:</p>
          <ul className="space-y-1">
            {step.notes.map((n, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
