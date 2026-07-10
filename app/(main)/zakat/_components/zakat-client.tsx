'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Wheat, ShoppingCart, Heart, Beef, Calculator, RotateCcw, CheckCircle, AlertCircle, ChevronDown, BookOpen, Users } from 'lucide-react';
import { hitungZakatMaal, hitungZakatFitrah, hitungZakatPerdagangan, hitungZakatPertanian, hitungZakatPeternakan, getNisabTable, formatCurrency, parseCurrency } from '@/lib/zakat';
import type { ZakatResult } from '@/lib/zakat';
import { PageHeader } from '@/components/layouts/page-header';
import { toast } from 'sonner';

type MainTabType = 'kalkulator' | 'fiqh';
type ZakatTabType = 'maal' | 'fitrah' | 'perdagangan' | 'pertanian' | 'peternakan';

const zakatTabs: { id: ZakatTabType; label: string; icon: React.ElementType; accent: string }[] = [
  { id: 'maal', label: 'Zakat Maal', icon: Coins, accent: '#059669' },
  { id: 'fitrah', label: 'Zakat Fitrah', icon: Heart, accent: '#E11D48' },
  { id: 'perdagangan', label: 'Zakat Dagang', icon: ShoppingCart, accent: '#2563EB' },
  { id: 'pertanian', label: 'Zakat Tani', icon: Wheat, accent: '#D97706' },
  { id: 'peternakan', label: 'Zakat Ternak', icon: Beef, accent: '#EA580C' },
];

const FIQH_CHAPTERS = [
  {
    id: 1, title: 'Pengertian Zakat',
    content: 'Zakat secara bahasa berarti "bersih, suci, subur, dan berkah". Secara istilah syariat, zakat adalah sejumlah harta tertentu yang wajib dikeluarkan oleh seorang Muslim kepada golongan yang berhak menerimanya (mustahik) dengan syarat-syarat tertentu. Zakat merupakan salah satu dari Rukun Islam yang lima dan merupakan ibadah maliyah (harta) yang memiliki dimensi sosial yang tinggi.',
  },
  {
    id: 2, title: 'Syarat Wajib Zakat',
    items: ['Islam — zakat hanya wajib bagi Muslim', 'Merdeka — bukan budak/hamba sahaya', 'Harta mencapai nisab (batas minimal)', 'Harta dimiliki secara sempurna (milku At-Tamm)', 'Telah mencapai haul (1 tahun hijriyah) — kecuali zakat pertanian & rikaz', 'Harta berkembang (produktif) atau berpotensi berkembang'],
  },
  {
    id: 3, title: 'Jenis-jenis Zakat',
    items: [
      'Zakat Fitrah — wajib atas setiap jiwa Muslim menjelang Idul Fitri, berupa makanan pokok 2,5 kg / 3,5 liter',
      'Zakat Maal (Harta) — 2,5% dari harta yang telah mencapai nisab (85 gram emas) dan haul 1 tahun',
      'Zakat Perdagangan — 2,5% dari modal + keuntungan + piutang lancar + stok barang - hutang dagang',
      'Zakat Pertanian — 10% (tadah hujan) / 5% (irigasi) / 7,5% (campuran) saat panen jika ≥ 653 kg gabah',
      'Zakat Peternakan — hewan ternak yang digembalakan (sa\'imah) dengan nisab berbeda per jenis hewan',
      'Zakat Profesi/Penghasilan — dianalogikan dengan zakat emas/perak, 2,5% dari penghasilan bersih',
      'Zakat Rikaz (Harta Karun) — 20% dari harta temuan, tanpa syarat nisab dan haul',
    ],
  },
  {
    id: 4, title: '8 Golongan Penerima Zakat (Mustahik)',
    content: 'Berdasarkan QS. At-Taubah ayat 60, terdapat 8 golongan (asnaf) yang berhak menerima zakat:\n\n1. Fakir — orang yang hampir tidak memiliki apa-apa\n2. Miskin — orang yang memiliki harta tapi tidak mencukupi kebutuhan dasar\n3. Amil — pengelola/petugas zakat\n4. Muallaf — orang yang baru masuk Islam atau yang perlu dilunakkan hatinya\n5. Riqab — budak/memerdekakan budak\n6. Gharimin — orang yang berhutang untuk kebutuhan halal\n7. Fi Sabilillah — orang yang berjuang di jalan Allah\n8. Ibnu Sabil — musafir yang kehabisan bekal',
  },
];

function GlassInput({ label, value, onChange, placeholder, hint, prefix }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; prefix?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-white/70 mb-1.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/35">{prefix}</span>}
        <input type="text" inputMode="numeric" value={value}
          onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ''); onChange(raw ? parseInt(raw).toLocaleString('id-ID') : ''); }}
          placeholder={placeholder ?? '0'}
          className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] py-3 pr-4 text-sm text-white/85 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/30 transition-all"
          style={{ paddingLeft: prefix ? '2.5rem' : '1rem' }} />
      </div>
      {hint && <p className="text-xs text-white/30 mt-1">{hint}</p>}
    </div>
  );
}

function NumberGlassInput({ label, value, onChange, placeholder, suffix }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-white/70 mb-1.5">{label}</label>
      <div className="relative">
        <input type="text" inputMode="numeric" value={value}
          onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ''); onChange(raw); }}
          placeholder={placeholder ?? '0'}
          className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-sm text-white/85 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/30 transition-all" />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/35">{suffix}</span>}
      </div>
    </div>
  );
}

export default function ZakatClient() {
  const [mainTab, setMainTab] = useState<MainTabType>('kalkulator');
  const [activeTab, setActiveTab] = useState<ZakatTabType>('maal');
  const [result, setResult] = useState<ZakatResult | null>(null);
  const [showNisabTable, setShowNisabTable] = useState(false);
  const [expandedFiqh, setExpandedFiqh] = useState<number[]>([]);

  const [hargaEmas, setHargaEmas] = useState('');
  const [maalHarta, setMaalHarta] = useState(''); const [maalHutang, setMaalHutang] = useState('');
  const [fitrahJiwa, setFitrahJiwa] = useState(''); const [fitrahHarga, setFitrahHarga] = useState('');
  const [dagangModal, setDagangModal] = useState(''); const [dagangUntung, setDagangUntung] = useState('');
  const [dagangPiutang, setDagangPiutang] = useState(''); const [dagangHutang, setDagangHutang] = useState(''); const [dagangStok, setDagangStok] = useState('');
  const [taniHasil, setTaniHasil] = useState(''); const [taniHarga, setTaniHarga] = useState('');
  const [taniIrigasi, setTaniIrigasi] = useState<'tadah_hujan' | 'irigasi' | 'campuran'>('tadah_hujan');
  const [ternakJenis, setTernakJenis] = useState<'unta' | 'sapi' | 'kambing'>('kambing');
  const [ternakJumlah, setTernakJumlah] = useState('');

  const handleReset = () => {
    setResult(null); setShowNisabTable(false);
    setMaalHarta(''); setMaalHutang(''); setFitrahJiwa(''); setFitrahHarga('');
    setDagangModal(''); setDagangUntung(''); setDagangPiutang(''); setDagangHutang(''); setDagangStok('');
    setTaniHasil(''); setTaniHarga(''); setTaniIrigasi('tadah_hujan');
    setTernakJumlah('');
  };

  const handleTabChange = (tab: ZakatTabType) => { setActiveTab(tab); setResult(null); setShowNisabTable(false); };
  const needsGoldPrice = activeTab === 'maal' || activeTab === 'perdagangan';

  const handleHitung = () => {
    let res: ZakatResult; const emasPrice = parseCurrency(hargaEmas);
    switch (activeTab) {
      case 'maal':
        if (!maalHarta) { toast.error('Masukkan total harta'); return; }
        if (!hargaEmas || emasPrice <= 0) { toast.error('Masukkan harga emas per gram'); return; }
        res = hitungZakatMaal({ totalHarta: parseCurrency(maalHarta), hutang: parseCurrency(maalHutang), hargaEmasPerGram: emasPrice }); break;
      case 'fitrah':
        if (!fitrahJiwa || !fitrahHarga) { toast.error('Lengkapi semua field'); return; }
        res = hitungZakatFitrah({ jumlahJiwa: parseInt(fitrahJiwa) || 0, hargaBeras: parseCurrency(fitrahHarga) }); break;
      case 'perdagangan':
        if (!dagangStok && !dagangUntung && !dagangModal) { toast.error('Masukkan data perdagangan'); return; }
        if (!hargaEmas || emasPrice <= 0) { toast.error('Masukkan harga emas per gram'); return; }
        res = hitungZakatPerdagangan({ modalAwal: parseCurrency(dagangModal), keuntungan: parseCurrency(dagangUntung), piutangLancar: parseCurrency(dagangPiutang), hutangDagang: parseCurrency(dagangHutang), stokBarang: parseCurrency(dagangStok), hargaEmasPerGram: emasPrice }); break;
      case 'pertanian':
        if (!taniHasil || !taniHarga) { toast.error('Lengkapi data pertanian'); return; }
        res = hitungZakatPertanian({ hasilPanen: parseInt(taniHasil) || 0, hargaPerKg: parseCurrency(taniHarga), jenisIrigasi: taniIrigasi }); break;
      case 'peternakan':
        if (!ternakJumlah) { toast.error('Masukkan jumlah hewan ternak'); return; }
        res = hitungZakatPeternakan({ jenisHewan: ternakJenis, jumlahEkor: parseInt(ternakJumlah) || 0 }); break;
      default: return;
    }
    setResult(res);
  };

  const nisabTableData = activeTab === 'peternakan' ? getNisabTable(ternakJenis) : [];

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title="Kalkulator Zakat" description="Hitung zakat Anda sesuai ketentuan syariat Islam" backHref="/" />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Main Tabs: Kalkulator | Fiqh */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
          {([
            { id: 'kalkulator' as MainTabType, label: 'Kalkulator Zakat', icon: Calculator },
            { id: 'fiqh' as MainTabType, label: 'Fiqh Zakat', icon: BookOpen },
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
            <motion.div key="calculator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Zakat Type Sub-tabs */}
              <motion.div className="flex flex-wrap gap-2">
                {zakatTabs.map(tab => {
                  const Icon = tab.icon; const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border"
                      style={{ backgroundColor: isActive ? `${tab.accent}18` : 'transparent', borderColor: isActive ? `${tab.accent}40` : 'rgba(255,255,255,0.06)', color: isActive ? tab.accent : 'rgba(255,255,255,0.5)' }}>
                      <Icon size={15} style={{ color: isActive ? tab.accent : 'rgba(255,255,255,0.35)' }} />{tab.label}</button>
                  );
                })}
              </motion.div>

              {/* Gold Price */}
              {needsGoldPrice && (
                <motion.div className="rounded-2xl bg-white/[0.03] border border-amber-400/10 p-4">
                  <GlassInput label="Harga Emas per Gram (saat ini)" value={hargaEmas} onChange={setHargaEmas} placeholder="Contoh: 1.800.000" prefix="Rp" hint="Cek harga emas terkini. Nisab = 85 gram emas." />
                  {hargaEmas && parseCurrency(hargaEmas) > 0 && (
                    <p className="text-xs text-amber-400/80 mt-2 font-medium">Nisab saat ini: Rp {formatCurrency(85 * parseCurrency(hargaEmas))} (85 gram × Rp {formatCurrency(parseCurrency(hargaEmas))})</p>)}
                </motion.div>
              )}

              {/* Form Card */}
              <motion.div key={activeTab} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-4">
                {activeTab === 'maal' && (<>
                  <div className="text-xs text-white/45 bg-white/[0.02] rounded-xl p-3 leading-relaxed"><strong className="text-white/70">Zakat Maal</strong> wajib atas harta yang telah mencapai nisab (setara 85 gram emas) dan telah dimiliki selama 1 tahun (haul). Besarnya 2,5% dari harta bersih.</div>
                  <GlassInput label="Total Harta (tabungan, emas, investasi, dll)" value={maalHarta} onChange={setMaalHarta} prefix="Rp" />
                  <GlassInput label="Total Hutang (opsional)" value={maalHutang} onChange={setMaalHutang} prefix="Rp" />
                </>)}
                {activeTab === 'fitrah' && (<>
                  <div className="text-xs text-white/45 bg-white/[0.02] rounded-xl p-3 leading-relaxed"><strong className="text-white/70">Zakat Fitrah</strong> wajib atas setiap jiwa Muslim menjelang Idul Fitri. Besarnya 2,5 kg / 3,5 liter makanan pokok per jiwa.</div>
                  <NumberGlassInput label="Jumlah Jiwa" value={fitrahJiwa} onChange={setFitrahJiwa} placeholder="Contoh: 4" suffix="jiwa" />
                  <GlassInput label="Harga Beras per Kg" value={fitrahHarga} onChange={setFitrahHarga} placeholder="15.000" prefix="Rp" />
                </>)}
                {activeTab === 'perdagangan' && (<>
                  <div className="text-xs text-white/45 bg-white/[0.02] rounded-xl p-3 leading-relaxed"><strong className="text-white/70">Zakat Perdagangan</strong> dikenakan atas harta niaga yang telah mencapai nisab dan haul. (modal + keuntungan + piutang lancar + stok) - hutang dagang × 2,5%.</div>
                  <GlassInput label="Modal Awal Usaha" value={dagangModal} onChange={setDagangModal} prefix="Rp" />
                  <GlassInput label="Keuntungan Bersih" value={dagangUntung} onChange={setDagangUntung} prefix="Rp" />
                  <GlassInput label="Piutang Lancar" value={dagangPiutang} onChange={setDagangPiutang} prefix="Rp" />
                  <GlassInput label="Nilai Stok Barang" value={dagangStok} onChange={setDagangStok} prefix="Rp" />
                  <GlassInput label="Hutang Dagang" value={dagangHutang} onChange={setDagangHutang} prefix="Rp" />
                </>)}
                {activeTab === 'pertanian' && (<>
                  <div className="text-xs text-white/45 bg-white/[0.02] rounded-xl p-3 leading-relaxed"><strong className="text-white/70">Zakat Pertanian</strong> dikenakan saat panen jika hasil ≥ 653 kg gabah. 10% tadah hujan, 5% irigasi, 7,5% campuran.</div>
                  <NumberGlassInput label="Hasil Panen" value={taniHasil} onChange={setTaniHasil} placeholder="Contoh: 1000" suffix="kg" />
                  <GlassInput label="Harga per Kg" value={taniHarga} onChange={setTaniHarga} prefix="Rp" />
                  <div>
                    <label className="block text-[13px] font-bold text-white/70 mb-1.5">Jenis Pengairan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ value: 'tadah_hujan' as const, label: 'Tadah Hujan', pct: '10%' }, { value: 'irigasi' as const, label: 'Irigasi', pct: '5%' }, { value: 'campuran' as const, label: 'Campuran', pct: '7,5%' }].map(opt => (
                        <button key={opt.value} onClick={() => setTaniIrigasi(opt.value)}
                          className="rounded-xl border px-3 py-2.5 text-xs font-medium transition-all"
                          style={{ backgroundColor: taniIrigasi === opt.value ? '#05966918' : 'transparent', borderColor: taniIrigasi === opt.value ? '#05966940' : 'rgba(255,255,255,0.06)', color: taniIrigasi === opt.value ? '#34D399' : 'rgba(255,255,255,0.5)' }}>
                          <div>{opt.label}</div><div className="text-[10px] mt-0.5 opacity-70">{opt.pct}</div></button>))}
                    </div>
                  </div>
                </>)}
                {activeTab === 'peternakan' && (<>
                  <div className="text-xs text-white/45 bg-white/[0.02] rounded-xl p-3 leading-relaxed"><strong className="text-white/70">Zakat Peternakan</strong> wajib atas hewan ternak yang digembalakan (sa&apos;imah), mencapai nisab, dan dimiliki 1 tahun (haul).</div>
                  <div>
                    <label className="block text-[13px] font-bold text-white/70 mb-1.5">Jenis Hewan Ternak</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ value: 'kambing' as const, label: 'Kambing/Domba', nisab: 'Nisab: 40' }, { value: 'sapi' as const, label: 'Sapi/Kerbau', nisab: 'Nisab: 30' }, { value: 'unta' as const, label: 'Unta', nisab: 'Nisab: 5' }].map(opt => (
                        <button key={opt.value} onClick={() => { setTernakJenis(opt.value); setResult(null); setShowNisabTable(false); }}
                          className="rounded-xl border px-3 py-2.5 text-xs font-medium transition-all"
                          style={{ backgroundColor: ternakJenis === opt.value ? '#EA580C18' : 'transparent', borderColor: ternakJenis === opt.value ? '#EA580C40' : 'rgba(255,255,255,0.06)', color: ternakJenis === opt.value ? '#F97316' : 'rgba(255,255,255,0.5)' }}>
                          <div>{opt.label}</div><div className="text-[10px] mt-0.5 opacity-70">{opt.nisab} ekor</div></button>))}
                    </div>
                  </div>
                  <NumberGlassInput label="Jumlah Hewan" value={ternakJumlah} onChange={setTernakJumlah} placeholder="Contoh: 50" suffix="ekor" />
                  <button onClick={() => setShowNisabTable(!showNisabTable)} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    {showNisabTable ? 'Sembunyikan' : 'Lihat'} tabel nisab</button>
                  <AnimatePresence>
                    {showNisabTable && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                          <table className="w-full text-xs"><thead className="bg-white/[0.02]"><tr><th className="text-left px-3 py-2 font-bold text-white/60">Jumlah (ekor)</th><th className="text-left px-3 py-2 font-bold text-white/60">Zakat</th></tr></thead>
                            <tbody>{nisabTableData.map((row, i) => (<tr key={i} className="border-t border-white/[0.04]"><td className="px-3 py-2 text-white/70">{row.max === Infinity ? `${row.min}+` : `${row.min} – ${row.max}`}</td><td className="px-3 py-2 text-white/50">{row.zakatDesc}</td></tr>))}</tbody></table></div>
                      </motion.div>)}
                  </AnimatePresence>
                </>)}

                <div className="flex gap-3 pt-2">
                  <button onClick={handleHitung} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"><Calculator size={16} />Hitung Zakat</button>
                  <button onClick={handleReset} className="px-4 rounded-xl border border-white/[0.06] text-sm text-white/50 hover:bg-white/[0.04] hover:text-white/70 transition-colors"><RotateCcw size={16} /></button>
                </div>
              </motion.div>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-5 space-y-3"
                    style={{ backgroundColor: result.wajibZakat ? '#05966908' : 'rgba(255,255,255,0.01)', borderColor: result.wajibZakat ? '#05966930' : 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2">
                      {result.wajibZakat ? <CheckCircle size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-white/35" />}
                      <h3 className="font-extrabold text-base text-white/90">{result.wajibZakat ? 'Wajib Zakat' : 'Belum Wajib Zakat'}</h3>
                    </div>
                    {result.wajibZakat && activeTab !== 'peternakan' && (
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                        <p className="text-xs text-white/40 mb-1">Zakat yang harus dikeluarkan</p>
                        <p className="text-2xl font-extrabold text-emerald-400">Rp {formatCurrency(result.jumlahZakat)}</p>
                        {result.persentase > 0 && <p className="text-xs text-white/40 mt-1">{result.persentase}% dari Rp {formatCurrency(result.totalHartaBersih)}</p>}
                      </div>)}
                    {result.wajibZakat && activeTab === 'peternakan' && result.zakatHewan && (
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"><p className="text-xs text-white/40 mb-1">Zakat yang harus dikeluarkan</p><p className="text-lg font-extrabold text-emerald-400">{result.zakatHewan}</p></div>)}
                    <p className="text-sm text-white/50 leading-relaxed">{result.penjelasan}</p>
                    <div className="text-xs text-white/30 bg-white/[0.02] rounded-xl p-3 mt-2"><strong className="text-white/50">Catatan:</strong> Perhitungan ini bersifat estimasi. Konsultasikan dengan ulama atau lembaga amil zakat terpercaya.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Fiqh Zakat Tab */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                  <BookOpen size={20} className="text-emerald-400" /></div>
                <div><h2 className="font-extrabold text-base text-white/90">Fiqh Zakat</h2><p className="text-xs text-white/40">Panduan dasar zakat sesuai syariat Islam</p></div>
              </div>
            </div>

            {FIQH_CHAPTERS.map((chapter, idx) => {
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
                          {chapter.items && <ul className="space-y-2 mt-1">{chapter.items.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-white/50"><CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />{item}</li>))}</ul>}
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
