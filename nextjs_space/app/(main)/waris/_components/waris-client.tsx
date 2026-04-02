'use client';

import React, { useState, useCallback } from 'react';
import { Calculator, RotateCcw, AlertTriangle, Scale, BookOpen, Users, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gender, HeirInput, InheritanceResult, HeirResult } from '@/lib/types';
import { calculateInheritance, formatRupiah, parseRupiah } from '@/lib/faraidh';
import { toast } from 'sonner';
import InheritancePieChart from './inheritance-pie-chart';

const defaultHeirs: HeirInput = {
  husband: false,
  wife: 0,
  son: 0,
  daughter: 0,
  father: false,
  mother: false,
  grandfather: false,
  grandmother: false,
  fullBrother: 0,
  fullSister: 0,
  paternalHalfBrother: 0,
  paternalHalfSister: 0,
  maternalHalfBrother: 0,
  maternalHalfSister: 0,
  grandsonFromSon: 0,
  granddaughterFromSon: 0,
  paternalUncle: 0,
  uncleSon: 0,
};

interface HeirFieldConfig {
  key: keyof HeirInput;
  label: string;
  type: 'boolean' | 'number';
  max?: number;
  showWhen?: (gender: Gender) => boolean;
  group: string;
}

const heirFields: HeirFieldConfig[] = [
  { key: 'husband', label: 'Suami', type: 'boolean', showWhen: (g: Gender) => g === 'female', group: 'Pasangan' },
  { key: 'wife', label: 'Istri', type: 'number', max: 4, showWhen: (g: Gender) => g === 'male', group: 'Pasangan' },
  { key: 'son', label: 'Anak Laki-laki', type: 'number', max: 20, group: 'Anak' },
  { key: 'daughter', label: 'Anak Perempuan', type: 'number', max: 20, group: 'Anak' },
  { key: 'father', label: 'Ayah', type: 'boolean', group: 'Orang Tua' },
  { key: 'mother', label: 'Ibu', type: 'boolean', group: 'Orang Tua' },
  { key: 'grandfather', label: 'Kakek (dari ayah)', type: 'boolean', group: 'Kakek/Nenek' },
  { key: 'grandmother', label: 'Nenek', type: 'boolean', group: 'Kakek/Nenek' },
  { key: 'fullBrother', label: 'Saudara Laki-laki Kandung', type: 'number', max: 10, group: 'Saudara Kandung' },
  { key: 'fullSister', label: 'Saudara Perempuan Kandung', type: 'number', max: 10, group: 'Saudara Kandung' },
  { key: 'paternalHalfBrother', label: 'Saudara Laki-laki Seayah', type: 'number', max: 10, group: 'Saudara Seayah' },
  { key: 'paternalHalfSister', label: 'Saudara Perempuan Seayah', type: 'number', max: 10, group: 'Saudara Seayah' },
  { key: 'maternalHalfBrother', label: 'Saudara Laki-laki Seibu', type: 'number', max: 10, group: 'Saudara Seibu' },
  { key: 'maternalHalfSister', label: 'Saudara Perempuan Seibu', type: 'number', max: 10, group: 'Saudara Seibu' },
  { key: 'grandsonFromSon', label: 'Cucu Laki-laki (dari anak laki-laki)', type: 'number', max: 10, group: 'Cucu' },
  { key: 'granddaughterFromSon', label: 'Cucu Perempuan (dari anak laki-laki)', type: 'number', max: 10, group: 'Cucu' },
  { key: 'paternalUncle', label: 'Paman (saudara ayah)', type: 'number', max: 10, group: 'Paman' },
  { key: 'uncleSon', label: 'Anak Paman', type: 'number', max: 10, group: 'Paman' },
];

export default function WarisClient() {
  const [totalEstate, setTotalEstate] = useState('');
  const [deceasedGender, setDeceasedGender] = useState<Gender>('male');
  const [heirs, setHeirs] = useState<HeirInput>({ ...defaultHeirs });
  const [result, setResult] = useState<InheritanceResult | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Pasangan', 'Anak', 'Orang Tua']);

  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev: string[]) =>
      prev?.includes?.(group)
        ? prev?.filter?.((g: string) => g !== group) ?? []
        : [...(prev ?? []), group]
    );
  }, []);

  const updateHeir = useCallback((key: keyof HeirInput, value: boolean | number) => {
    setHeirs((prev: HeirInput) => ({ ...(prev ?? {}), [key]: value } as HeirInput));
  }, []);

  const handleCalculate = useCallback(() => {
    const estate = parseRupiah(totalEstate);
    if (estate <= 0) {
      toast.error('Masukkan jumlah harta warisan');
      return;
    }
    // Check at least one heir
    const hasHeir = Object.entries(heirs ?? {})?.some?.(([k, v]: [string, any]) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'number') return v > 0;
      return false;
    });
    if (!hasHeir) {
      toast.error('Pilih minimal satu ahli waris');
      return;
    }
    const res = calculateInheritance(estate, deceasedGender, heirs);
    setResult(res);
    // Scroll to results
    setTimeout(() => {
      document?.getElementById?.('waris-results')?.scrollIntoView?.({ behavior: 'smooth' });
    }, 100);
  }, [totalEstate, deceasedGender, heirs]);

  const handleReset = useCallback(() => {
    setTotalEstate('');
    setDeceasedGender('male');
    setHeirs({ ...defaultHeirs });
    setResult(null);
  }, []);

  const handleEstateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = (e?.target?.value ?? '')?.replace?.(/[^0-9]/g, '') ?? '';
    setTotalEstate(raw ? parseInt(raw, 10)?.toLocaleString?.('id-ID') ?? '' : '');
  }, []);

  // Group the fields
  const groups = (() => {
    const map: Record<string, HeirFieldConfig[]> = {};
    for (const f of heirFields) {
      if (f?.showWhen && !f.showWhen(deceasedGender)) continue;
      const g = f?.group ?? 'Lainnya';
      if (!map[g]) map[g] = [];
      map[g].push(f);
    }
    return Object.entries(map);
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">Kalkulator Waris</h1>
        <p className="text-sm text-muted-foreground mt-1">Perhitungan faraidh sesuai Al-Qur&apos;an dan Sunnah</p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        {/* Total Estate */}
        <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
          <label className="text-sm font-medium text-foreground mb-2 block">Total Harta Warisan</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">Rp</span>
            <input
              type="text"
              value={totalEstate}
              onChange={handleEstateChange}
              placeholder="0"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
            />
          </div>
        </div>

        {/* Deceased Gender */}
        <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
          <label className="text-sm font-medium text-foreground mb-3 block">Status Pewaris (yang meninggal)</label>
          <div className="flex gap-3">
            {(['male', 'female'] as Gender[])?.map?.((g: Gender) => (
              <button
                key={g}
                onClick={() => {
                  setDeceasedGender(g);
                  // Reset spouse-related fields
                  if (g === 'male') updateHeir('husband', false);
                  if (g === 'female') updateHeir('wife', 0);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  deceasedGender === g
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {g === 'male' ? 'Laki-laki' : 'Perempuan'}
              </button>
            )) ?? []}
          </div>
        </div>

        {/* Heir Selection */}
        <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-primary" />
            <label className="text-sm font-medium text-foreground">Ahli Waris yang Ada</label>
          </div>
          <div className="space-y-2">
            {groups?.map?.(([groupName, fields]: [string, HeirFieldConfig[]]) => {
              const isExpanded = expandedGroups?.includes?.(groupName);
              return (
                <div key={groupName} className="rounded-lg border border-border/30 overflow-hidden">
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{groupName}</span>
                    {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 space-y-2">
                          {fields?.map?.((field: HeirFieldConfig) => (
                            <div key={field?.key} className="flex items-center justify-between gap-3">
                              <span className="text-sm text-foreground">{field?.label}</span>
                              {field?.type === 'boolean' ? (
                                <button
                                  onClick={() => updateHeir(field?.key, !(heirs as any)?.[field?.key])}
                                  className={`w-10 h-6 rounded-full transition-colors relative ${
                                    (heirs as any)?.[field?.key] ? 'bg-primary' : 'bg-muted'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                                    (heirs as any)?.[field?.key] ? 'translate-x-5' : 'translate-x-1'
                                  }`} />
                                </button>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      const cur = ((heirs as any)?.[field?.key] ?? 0) as number;
                                      if (cur > 0) updateHeir(field?.key, cur - 1);
                                    }}
                                    className="w-7 h-7 rounded-md bg-muted text-foreground flex items-center justify-center text-sm font-bold hover:bg-muted/80"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center text-sm font-mono text-foreground">
                                    {((heirs as any)?.[field?.key] ?? 0)}
                                  </span>
                                  <button
                                    onClick={() => {
                                      const cur = ((heirs as any)?.[field?.key] ?? 0) as number;
                                      if (cur < (field?.max ?? 20)) updateHeir(field?.key, cur + 1);
                                    }}
                                    className="w-7 h-7 rounded-md bg-muted text-foreground flex items-center justify-center text-sm font-bold hover:bg-muted/80"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          )) ?? []}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) ?? []}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-md hover:bg-primary/90 transition-all"
          >
            <Calculator size={16} />
            Hitung Waris
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-muted text-muted-foreground font-medium text-sm hover:bg-muted/80 transition-all"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </motion.div>

      {/* Results */}
      {result && (
        <div id="waris-results" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Summary */}
            <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Scale size={16} className="text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">Hasil Perhitungan</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Total harta: <strong className="text-foreground font-mono">Rp {formatRupiah(result?.totalEstate ?? 0)}</strong>
              </p>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Ahli Waris</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Dasar</th>
                      <th className="text-center py-2 px-2 text-muted-foreground font-medium">Bagian</th>
                      <th className="text-right py-2 px-2 text-muted-foreground font-medium">Persentase</th>
                      <th className="text-right py-2 px-2 text-muted-foreground font-medium">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result?.heirs ?? [])?.map?.((heir: HeirResult, idx: number) => (
                      <tr key={idx} className="border-b border-border/30">
                        <td className="py-2.5 px-2 text-foreground font-medium">
                          <div>{heir?.name}{(heir?.count ?? 0) > 1 ? ` (${heir.count} orang)` : ''}</div>
                          {(heir?.perPersonAmount ?? 0) > 0 && (heir?.count ?? 0) > 1 && (
                            <div className="text-xs text-muted-foreground mt-0.5">Masing-masing: Rp {formatRupiah(heir.perPersonAmount ?? 0)}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-muted-foreground text-xs">{heir?.basis}</td>
                        <td className="py-2.5 px-2 text-center text-foreground font-mono text-xs">{heir?.shareFraction}</td>
                        <td className="py-2.5 px-2 text-right text-foreground font-mono">{(heir?.percentage ?? 0)?.toFixed?.(1) ?? '0'}%</td>
                        <td className="py-2.5 px-2 text-right text-foreground font-mono font-medium">Rp {formatRupiah(heir?.amount ?? 0)}</td>
                      </tr>
                    )) ?? []}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie Chart */}
            {(result?.heirs ?? [])?.filter?.((h: HeirResult) => (h?.amount ?? 0) > 0)?.length > 0 && (
              <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
                <h3 className="font-display font-semibold text-sm text-foreground mb-4">Visualisasi Pembagian</h3>
                <div className="w-full" style={{ height: 300 }}>
                  <InheritancePieChart heirs={(result?.heirs ?? [])?.filter?.((h: HeirResult) => (h?.amount ?? 0) > 0) ?? []} />
                </div>
              </div>
            )}

            {/* Explanations */}
            <div className="space-y-3">
              {/* Blocked Heirs */}
              {(result?.blockedHeirs?.length ?? 0) > 0 && (
                <div className="rounded-xl bg-card border border-border/50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <h3 className="font-semibold text-sm text-foreground">Ahli Waris yang Terhalang (Hajb)</h3>
                  </div>
                  <ul className="space-y-2">
                    {(result?.blockedHeirs ?? [])?.map?.((h: HeirResult, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        <strong className="text-foreground">{h?.name}</strong> ({h?.count} orang) — {h?.blockReason}
                      </li>
                    )) ?? []}
                  </ul>
                </div>
              )}

              {/* Aul */}
              {result?.aulOccurred && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={14} className="text-amber-600" />
                    <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-300">&apos;Aul (Penyesuaian Proporsional)</h3>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-400">{result?.aulExplanation}</p>
                </div>
              )}

              {/* Radd */}
              {result?.raddOccurred && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={14} className="text-emerald-600" />
                    <h3 className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">Radd (Pengembalian Sisa)</h3>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">{result?.raddExplanation}</p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-muted/50 p-4 border border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Disclaimer:</strong> Hasil perhitungan ini adalah panduan berdasarkan Al-Qur&apos;an dan Sunnah. Untuk kepastian hukum, disarankan berkonsultasi dengan ahli waris, notaris, atau Pengadilan Agama.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}