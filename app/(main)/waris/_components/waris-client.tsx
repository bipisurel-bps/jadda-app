'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, RotateCcw, AlertTriangle, Scale, Users, ChevronDown, ChevronUp, Info, BookOpen } from 'lucide-react';
import { Gender, HeirInput, InheritanceResult, HeirResult } from '@/lib/types';
import { calculateInheritance, formatRupiah, parseRupiah } from '@/lib/faraidh';
import { PageHeader } from '@/components/layouts/page-header';
import { toast } from 'sonner';
import InheritancePieChart from './inheritance-pie-chart';

type MainTabType = 'kalkulator' | 'fiqh';

const defaultHeirs: HeirInput = { husband: false, wife: 0, son: 0, daughter: 0, father: false, mother: false, grandfather: false, grandmother: false, fullBrother: 0, fullSister: 0, paternalHalfBrother: 0, paternalHalfSister: 0, maternalHalfBrother: 0, maternalHalfSister: 0, grandsonFromSon: 0, granddaughterFromSon: 0, paternalUncle: 0, uncleSon: 0 };

interface HeirFieldConfig { key: keyof HeirInput; label: string; type: 'boolean' | 'number'; max?: number; showWhen?: (gender: Gender) => boolean; group: string; }

const heirFields: HeirFieldConfig[] = [
  { key: 'husband', label: 'Suami', type: 'boolean', showWhen: g => g === 'female', group: 'Pasangan' },
  { key: 'wife', label: 'Istri', type: 'number', max: 4, showWhen: g => g === 'male', group: 'Pasangan' },
  { key: 'son', label: 'Anak Laki-laki', type: 'number', max: 20, group: 'Anak' },
  { key: 'daughter', label: 'Anak Perempuan', type: 'number', max: 20, group: 'Anak' },
  { key: 'father', label: 'Ayah', type: 'boolean', group: 'Orang Tua' },
  { key: 'mother', label: 'Ibu', type: 'boolean', group: 'Orang Tua' },
  { key: 'grandfather', label: 'Kakek (dari ayah)', type: 'boolean', group: 'Kakek/Nenek' },
  { key: 'grandmother', label: 'Nenek', type: 'boolean', group: 'Kakek/Nenek' },
  { key: 'fullBrother', label: 'Saudara Laki Kandung', type: 'number', max: 10, group: 'Saudara Kandung' },
  { key: 'fullSister', label: 'Saudara Perempuan Kandung', type: 'number', max: 10, group: 'Saudara Kandung' },
  { key: 'paternalHalfBrother', label: 'Saudara Laki Seayah', type: 'number', max: 10, group: 'Saudara Seayah' },
  { key: 'paternalHalfSister', label: 'Saudara Perempuan Seayah', type: 'number', max: 10, group: 'Saudara Seayah' },
  { key: 'maternalHalfBrother', label: 'Saudara Laki Seibu', type: 'number', max: 10, group: 'Saudara Seibu' },
  { key: 'maternalHalfSister', label: 'Saudara Perempuan Seibu', type: 'number', max: 10, group: 'Saudara Seibu' },
  { key: 'grandsonFromSon', label: 'Cucu Laki (dari anak laki)', type: 'number', max: 10, group: 'Cucu' },
  { key: 'granddaughterFromSon', label: 'Cucu Perempuan (dari anak laki)', type: 'number', max: 10, group: 'Cucu' },
  { key: 'paternalUncle', label: 'Paman (saudara ayah)', type: 'number', max: 10, group: 'Paman' },
  { key: 'uncleSon', label: 'Anak Paman', type: 'number', max: 10, group: 'Paman' },
];

const FIQH_WARIS_CHAPTERS = [
  {
    id: 1, title: 'Pengertian Faraidh',
    content: 'Faraidh (الفرائض) adalah bentuk jamak dari faridhah (فريضة) yang berarti "bagian yang telah ditentukan". Secara istilah, faraidh adalah ilmu tentang pembagian harta warisan berdasarkan ketentuan Al-Qur\'an dan Sunnah. Ilmu ini juga disebut ilmu mawaris atau ilmu fikih mawaris.',
  },
  {
    id: 2, title: 'Dasar Hukum',
    content: 'Pembagian waris dalam Islam diatur langsung oleh Allah SWT dalam Al-Qur\'an, terutama pada Surah An-Nisa ayat 11, 12, dan 176. Selain itu, terdapat juga hadits-hadits Nabi ﷺ yang menjelaskan lebih detail tentang pembagian warisan. Rasulullah ﷺ bersabda: "Pelajarilah ilmu faraidh dan ajarkanlah, karena ia adalah separuh ilmu dan ia akan dilupakan, serta ia adalah ilmu yang pertama kali akan dicabut dari umatku." (HR. Ibnu Majah)',
  },
  {
    id: 3, title: 'Rukun Waris',
    items: [
      'Muwarrits (المورث) — orang yang meninggal dunia dan meninggalkan harta',
      'Warits (الوارث) — ahli waris yang berhak menerima harta warisan',
      'Mauruts (الموروث) — harta warisan yang ditinggalkan oleh muwarrits',
    ],
  },
  {
    id: 4, title: 'Sebab Menerima Warisan',
    items: [
      'Hubungan nasab (keturunan) — anak, orang tua, saudara, paman, dll',
      'Hubungan pernikahan — suami/istri yang sah',
      'Wala\' (perwalian) — memerdekakan budak (sudah tidak relevan di masa kini)',
    ],
  },
  {
    id: 5, title: 'Hajb (Penghalang Waris)',
    content: 'Hajb adalah terhalangnya seseorang dari menerima warisan, baik seluruhnya (hajb hirman) maupun sebagian (hajb nuqshan).\n\nHajb Hirman (terhalang sepenuhnya):\n• Kakek terhalang oleh ayah\n• Nenek terhalang oleh ibu\n• Cucu terhalang oleh anak laki-laki\n• Saudara kandung terhalang oleh ayah dan anak laki-laki\n• Saudara seayah terhalang oleh saudara kandung laki-laki\n\nHajb Nuqshan (bagian berkurang):\n• Suami dari 1/2 menjadi 1/4 jika ada anak\n• Istri dari 1/4 menjadi 1/8 jika ada anak\n• Ibu dari 1/3 menjadi 1/6 jika ada anak atau saudara',
  },
  {
    id: 6, title: '\'Aul dan Radd',
    content: '\'Aul (العول) terjadi ketika jumlah bagian para ahli waris melebihi 1 (100%). Dalam kondisi ini, semua bagian dikurangi secara proporsional.\n\nRadd (الرد) terjadi ketika jumlah bagian para ahli waris kurang dari 1 dan tidak ada ahli waris ashabah (yang menerima sisa). Sisa harta dikembalikan kepada ahli waris secara proporsional.',
  },
];

export default function WarisClient() {
  const [mainTab, setMainTab] = useState<MainTabType>('kalkulator');
  const [totalEstate, setTotalEstate] = useState('');
  const [deceasedGender, setDeceasedGender] = useState<Gender>('male');
  const [heirs, setHeirs] = useState<HeirInput>({ ...defaultHeirs });
  const [result, setResult] = useState<InheritanceResult | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Pasangan', 'Anak', 'Orang Tua']);
  const [expandedFiqh, setExpandedFiqh] = useState<number[]>([]);

  const toggleGroup = useCallback((group: string) => { setExpandedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]); }, []);
  const updateHeir = useCallback((key: keyof HeirInput, value: boolean | number) => { setHeirs(prev => ({ ...prev, [key]: value } as HeirInput)); }, []);

  const handleCalculate = useCallback(() => {
    const estate = parseRupiah(totalEstate); if (estate <= 0) { toast.error('Masukkan jumlah harta warisan'); return; }
    const hasHeir = Object.entries(heirs).some(([, v]) => typeof v === 'boolean' ? v : (v as number) > 0);
    if (!hasHeir) { toast.error('Pilih minimal satu ahli waris'); return; }
    setResult(calculateInheritance(estate, deceasedGender, heirs));
    setTimeout(() => document.getElementById('waris-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [totalEstate, deceasedGender, heirs]);

  const handleReset = useCallback(() => { setTotalEstate(''); setDeceasedGender('male'); setHeirs({ ...defaultHeirs }); setResult(null); }, []);
  const handleEstateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const raw = (e.target.value ?? '').replace(/[^0-9]/g, ''); setTotalEstate(raw ? parseInt(raw, 10).toLocaleString('id-ID') : ''); }, []);

  const groups = (() => { const map: Record<string, HeirFieldConfig[]> = {}; for (const f of heirFields) { if (f.showWhen && !f.showWhen(deceasedGender)) continue; const g = f.group; if (!map[g]) map[g] = []; map[g].push(f); } return Object.entries(map); })();

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title="Kalkulator Waris" description="Perhitungan faraidh sesuai Al-Qur'an dan Sunnah" backHref="/" />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Main Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
          {([
            { id: 'kalkulator' as MainTabType, label: 'Kalkulator Waris', icon: Calculator },
            { id: 'fiqh' as MainTabType, label: 'Fiqh Waris', icon: BookOpen },
          ]).map(tab => {
            const Icon = tab.icon; const isActive = mainTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setMainTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border"
                style={{ backgroundColor: isActive ? '#05966918' : 'transparent', borderColor: isActive ? '#05966940' : 'rgba(255,255,255,0.06)', color: isActive ? '#34D399' : 'rgba(255,255,255,0.4)' }}>
                <Icon size={15} style={{ color: isActive ? '#34D399' : 'rgba(255,255,255,0.35)' }} />{tab.label}</button>
            );
          })}
        </motion.div>

        {mainTab === 'kalkulator' ? (
          <AnimatePresence mode="wait">
            <motion.div key="calculator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Total Estate */}
              <motion.div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                <label className="block text-[13px] font-extrabold text-white/90 uppercase tracking-tight mb-3">Total Harta Warisan</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/35">Rp</span>
                  <input type="text" value={totalEstate} onChange={handleEstateChange} placeholder="0"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/85 placeholder:text-white/20 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/30 transition-all" />
                </div>
              </motion.div>

              {/* Deceased Gender */}
              <motion.div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                <label className="block text-[13px] font-extrabold text-white/90 uppercase tracking-tight mb-3">Status Pewaris</label>
                <div className="flex gap-3">
                  {(['male', 'female'] as Gender[]).map(g => (
                    <button key={g} onClick={() => { setDeceasedGender(g); if (g === 'male') updateHeir('husband', false); if (g === 'female') updateHeir('wife', 0); }}
                      className="flex-1 py-3 rounded-xl text-sm font-bold transition-all border"
                      style={{ backgroundColor: deceasedGender === g ? '#05966918' : 'transparent', borderColor: deceasedGender === g ? '#05966940' : 'rgba(255,255,255,0.06)', color: deceasedGender === g ? '#34D399' : 'rgba(255,255,255,0.5)' }}>
                      {g === 'male' ? 'Laki-laki' : 'Perempuan'}</button>
                  ))}
                </div>
              </motion.div>

              {/* Heir Selection */}
              <motion.div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4"><Users size={16} className="text-emerald-400" /><label className="text-[13px] font-extrabold text-white/90 uppercase tracking-tight">Ahli Waris yang Ada</label></div>
                <div className="space-y-2">
                  {groups.map(([groupName, fields]) => {
                    const isExpanded = expandedGroups.includes(groupName);
                    return (
                      <div key={groupName} className="rounded-xl border border-white/[0.06] overflow-hidden">
                        <button onClick={() => toggleGroup(groupName)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                          <span className="text-xs font-extrabold text-white/50 uppercase tracking-tight">{groupName}</span>
                          {isExpanded ? <ChevronUp size={14} className="text-white/35" /> : <ChevronDown size={14} className="text-white/35" />}
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="p-3 space-y-2">
                                {fields.map(field => (
                                  <div key={field.key} className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-white/70">{field.label}</span>
                                    {field.type === 'boolean' ? (
                                      <button onClick={() => updateHeir(field.key, !(heirs as any)[field.key])}
                                        className="relative w-10 h-6 rounded-full transition-colors"
                                        style={{ backgroundColor: (heirs as any)[field.key] ? '#059669' : 'rgba(255,255,255,0.08)' }}>
                                        <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                                          style={{ transform: (heirs as any)[field.key] ? 'translateX(20px)' : 'translateX(4px)' }} /></button>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <button onClick={() => { const cur = ((heirs as any)[field.key] ?? 0) as number; if (cur > 0) updateHeir(field.key, cur - 1); }}
                                          className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 flex items-center justify-center text-sm font-bold hover:bg-white/[0.08]">-</button>
                                        <span className="w-8 text-center text-sm font-mono text-white/85">{((heirs as any)[field.key] ?? 0)}</span>
                                        <button onClick={() => { const cur = ((heirs as any)[field.key] ?? 0) as number; if (cur < (field.max ?? 20)) updateHeir(field.key, cur + 1); }}
                                          className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 flex items-center justify-center text-sm font-bold hover:bg-white/[0.08]">+</button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div className="flex gap-3">
                <button onClick={handleCalculate} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"><Calculator size={16} />Hitung Waris</button>
                <button onClick={handleReset} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/[0.06] text-sm text-white/50 hover:bg-white/[0.04] transition-colors"><RotateCcw size={16} /></button>
              </motion.div>

              {/* Results */}
              {result && (
                <div id="waris-results" className="space-y-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                      <div className="flex items-center gap-2 mb-4"><Scale size={16} className="text-emerald-400" /><h2 className="font-extrabold text-base text-white/90">Hasil Perhitungan</h2></div>
                      <p className="text-sm text-white/50 mb-4">Total harta: <strong className="text-white/80 font-mono">Rp {formatRupiah(result.totalEstate)}</strong></p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm"><thead><tr className="border-b border-white/[0.06]"><th className="text-left py-2 px-2 text-white/40 font-medium text-xs">Ahli Waris</th><th className="text-left py-2 px-2 text-white/40 font-medium text-xs">Dasar</th><th className="text-center py-2 px-2 text-white/40 font-medium text-xs">Bagian</th><th className="text-right py-2 px-2 text-white/40 font-medium text-xs">%</th><th className="text-right py-2 px-2 text-white/40 font-medium text-xs">Jumlah</th></tr></thead>
                          <tbody>{(result.heirs ?? []).map((heir: HeirResult, idx: number) => (
                            <tr key={idx} className="border-b border-white/[0.04]"><td className="py-3 px-2 text-white/80 font-medium"><div>{heir.name}{(heir.count ?? 0) > 1 ? ` (${heir.count} org)` : ''}</div>{(heir.perPersonAmount ?? 0) > 0 && (heir.count ?? 0) > 1 && (<div className="text-xs text-white/35 mt-0.5">@ Rp {formatRupiah(heir.perPersonAmount ?? 0)}</div>)}</td><td className="py-3 px-2 text-white/40 text-xs">{heir.basis}</td><td className="py-3 px-2 text-center text-white/60 font-mono text-xs">{heir.shareFraction}</td><td className="py-3 px-2 text-right text-white/60 font-mono text-xs">{(heir.percentage ?? 0).toFixed(1)}%</td><td className="py-3 px-2 text-right text-white/80 font-mono font-bold">Rp {formatRupiah(heir.amount ?? 0)}</td></tr>))}</tbody></table>
                      </div>
                    </div>

                    {(result.heirs ?? []).filter(h => (h.amount ?? 0) > 0).length > 0 && (
                      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"><h3 className="font-extrabold text-sm text-white/90 mb-4">Visualisasi Pembagian</h3><div className="w-full" style={{ height: 300 }}><InheritancePieChart heirs={(result.heirs ?? []).filter(h => (h.amount ?? 0) > 0)} /></div></div>)}
                    {(result.blockedHeirs?.length ?? 0) > 0 && (
                      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"><div className="flex items-center gap-2 mb-3"><AlertTriangle size={14} className="text-amber-400" /><h3 className="font-extrabold text-sm text-white/90">Ahli Waris Terhalang (Hajb)</h3></div><ul className="space-y-2">{(result.blockedHeirs ?? []).map((h: HeirResult, idx: number) => (<li key={idx} className="text-sm text-white/50"><strong className="text-white/70">{h.name}</strong> ({h.count} orang) — {h.blockReason}</li>))}</ul></div>)}
                    {result.aulOccurred && (<div className="rounded-2xl bg-amber-500/5 border border-amber-400/20 p-5"><div className="flex items-center gap-2 mb-2"><Info size={14} className="text-amber-400" /><h3 className="font-extrabold text-sm text-amber-300">&apos;Aul (Penyesuaian Proporsional)</h3></div><p className="text-sm text-amber-200/70 leading-relaxed">{result.aulExplanation}</p></div>)}
                    {result.raddOccurred && (<div className="rounded-2xl bg-emerald-500/5 border border-emerald-400/20 p-5"><div className="flex items-center gap-2 mb-2"><Info size={14} className="text-emerald-400" /><h3 className="font-extrabold text-sm text-emerald-300">Radd (Pengembalian Sisa)</h3></div><p className="text-sm text-emerald-200/70 leading-relaxed">{result.raddExplanation}</p></div>)}
                    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4"><p className="text-xs text-white/35 leading-relaxed"><strong className="text-white/50">Disclaimer:</strong> Hasil perhitungan ini adalah panduan berdasarkan Al-Qur&apos;an dan Sunnah. Konsultasikan dengan ahli waris, notaris, atau Pengadilan Agama.</p></div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Fiqh Waris Tab */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                  <BookOpen size={20} className="text-emerald-400" /></div>
                <div><h2 className="font-extrabold text-base text-white/90">Fiqh Waris (Faraidh)</h2><p className="text-xs text-white/40">Ilmu pembagian harta warisan sesuai syariat Islam</p></div>
              </div>
            </div>
            {FIQH_WARIS_CHAPTERS.map((chapter, idx) => {
              const isOpen = expandedFiqh.includes(chapter.id);
              return (
                <motion.div key={chapter.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                  <button onClick={() => setExpandedFiqh(prev => prev.includes(chapter.id) ? prev.filter(i => i !== chapter.id) : [...prev, chapter.id])}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isOpen ? 'bg-emerald-500/10 border border-emerald-400/20' : 'bg-white/[0.03]'}`}>
                        {isOpen ? <BookOpen size={15} className="text-emerald-400" /> : <Users size={15} className="text-white/35" />}</div>
                      <h3 className={`font-extrabold text-sm text-left ${isOpen ? 'text-emerald-400' : 'text-white/85'}`}>{chapter.title}</h3>
                    </div>
                    <ChevronDown size={16} className={`text-white/35 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="p-4 pt-0">
                          {chapter.content && <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{chapter.content}</p>}
                          {chapter.items && <ul className="space-y-2 mt-1">{chapter.items.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-white/50"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />{item}</li>))}</ul>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
