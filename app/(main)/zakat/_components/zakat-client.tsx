'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Wheat, ShoppingCart, Heart, CheckCircle, AlertCircle, Beef } from 'lucide-react';
import { hitungZakatMaal, hitungZakatFitrah, hitungZakatPerdagangan, hitungZakatPertanian, hitungZakatPeternakan, getNisabTable, formatCurrency, parseCurrency } from '@/lib/zakat';
import type { ZakatResult } from '@/lib/zakat';
import { toast } from 'sonner';

type TabType = 'maal' | 'fitrah' | 'perdagangan' | 'pertanian' | 'peternakan';

const tabs: { id: TabType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'maal', label: 'Maal', icon: Coins, color: 'text-primary' },
  { id: 'fitrah', label: 'Fitrah', icon: Heart, color: 'text-pink-500' },
  { id: 'perdagangan', label: 'Dagang', icon: ShoppingCart, color: 'text-blue-500' },
  { id: 'pertanian', label: 'Tani', icon: Wheat, color: 'text-amber-600' },
  { id: 'peternakan', label: 'Ternak', icon: Beef, color: 'text-orange-600' },
];

function CurrencyInput({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            onChange(raw ? parseInt(raw).toLocaleString('id-ID') : '');
          }}
          placeholder={placeholder ?? '0'}
          className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder, suffix }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            onChange(raw);
          }}
          placeholder={placeholder ?? '0'}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

export default function ZakatClient() {
  const [activeTab, setActiveTab] = useState<TabType>('maal');
  const [result, setResult] = useState<ZakatResult | null>(null);
  const [showNisabTable, setShowNisabTable] = useState(false);

  // Shared gold price
  const [hargaEmas, setHargaEmas] = useState('');

  // Maal state
  const [maalHarta, setMaalHarta] = useState('');
  const [maalHutang, setMaalHutang] = useState('');

  // Fitrah state
  const [fitrahJiwa, setFitrahJiwa] = useState('');
  const [fitrahHarga, setFitrahHarga] = useState('');

  // Perdagangan state
  const [dagangModal, setDagangModal] = useState('');
  const [dagangUntung, setDagangUntung] = useState('');
  const [dagangPiutang, setDagangPiutang] = useState('');
  const [dagangHutang, setDagangHutang] = useState('');
  const [dagangStok, setDagangStok] = useState('');

  // Pertanian state
  const [taniHasil, setTaniHasil] = useState('');
  const [taniHarga, setTaniHarga] = useState('');
  const [taniIrigasi, setTaniIrigasi] = useState<'tadah_hujan' | 'irigasi' | 'campuran'>('tadah_hujan');

  // Peternakan state
  const [ternakJenis, setTernakJenis] = useState<'unta' | 'sapi' | 'kambing'>('kambing');
  const [ternakJumlah, setTernakJumlah] = useState('');

  const handleReset = () => {
    setResult(null);
    setShowNisabTable(false);
    setMaalHarta(''); setMaalHutang('');
    setFitrahJiwa(''); setFitrahHarga('');
    setDagangModal(''); setDagangUntung(''); setDagangPiutang(''); setDagangHutang(''); setDagangStok('');
    setTaniHasil(''); setTaniHarga(''); setTaniIrigasi('tadah_hujan');
    setTernakJumlah('');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setResult(null);
    setShowNisabTable(false);
  };

  const needsGoldPrice = activeTab === 'maal' || activeTab === 'perdagangan';

  const handleHitung = () => {
    let res: ZakatResult;
    const emasPrice = parseCurrency(hargaEmas);

    switch (activeTab) {
      case 'maal':
        if (!maalHarta) { toast.error('Masukkan total harta'); return; }
        if (!hargaEmas || emasPrice <= 0) { toast.error('Masukkan harga emas per gram'); return; }
        res = hitungZakatMaal({ totalHarta: parseCurrency(maalHarta), hutang: parseCurrency(maalHutang), hargaEmasPerGram: emasPrice });
        break;
      case 'fitrah':
        if (!fitrahJiwa || !fitrahHarga) { toast.error('Lengkapi semua field'); return; }
        res = hitungZakatFitrah({ jumlahJiwa: parseInt(fitrahJiwa) || 0, hargaBeras: parseCurrency(fitrahHarga) });
        break;
      case 'perdagangan':
        if (!dagangStok && !dagangUntung && !dagangModal) { toast.error('Masukkan data perdagangan'); return; }
        if (!hargaEmas || emasPrice <= 0) { toast.error('Masukkan harga emas per gram'); return; }
        res = hitungZakatPerdagangan({
          modalAwal: parseCurrency(dagangModal), keuntungan: parseCurrency(dagangUntung),
          piutangLancar: parseCurrency(dagangPiutang), hutangDagang: parseCurrency(dagangHutang),
          stokBarang: parseCurrency(dagangStok), hargaEmasPerGram: emasPrice
        });
        break;
      case 'pertanian':
        if (!taniHasil || !taniHarga) { toast.error('Lengkapi data pertanian'); return; }
        res = hitungZakatPertanian({ hasilPanen: parseInt(taniHasil) || 0, hargaPerKg: parseCurrency(taniHarga), jenisIrigasi: taniIrigasi });
        break;
      case 'peternakan':
        if (!ternakJumlah) { toast.error('Masukkan jumlah hewan ternak'); return; }
        res = hitungZakatPeternakan({ jenisHewan: ternakJenis, jumlahEkor: parseInt(ternakJumlah) || 0 });
        break;
      default:
        return;
    }
    setResult(res);
  };

  const nisabTableData = activeTab === 'peternakan' ? getNisabTable(ternakJenis) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl text-foreground">Kalkulator Zakat</h1>
        <p className="text-sm text-muted-foreground mt-1">Hitung zakat Anda sesuai ketentuan syariat Islam</p>
      </motion.div>

      {/* Tab Selector */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                isActive ? 'bg-primary/10 border-primary/30 text-primary shadow-sm' : 'bg-card border-border/50 text-muted-foreground hover:bg-muted/50'
              }`}>
              <Icon size={15} className={isActive ? 'text-primary' : tab.color} />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Gold Price Input - shared for maal & perdagangan */}
      {needsGoldPrice && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
          <CurrencyInput
            label="Harga Emas per Gram (saat ini)"
            value={hargaEmas}
            onChange={setHargaEmas}
            placeholder="Contoh: 1.800.000"
            hint="Cek harga emas terkini di toko emas atau situs resmi. Nisab = 85 gram emas."
          />
          {hargaEmas && parseCurrency(hargaEmas) > 0 && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-medium">
              Nisab saat ini: Rp {formatCurrency(85 * parseCurrency(hargaEmas))} (85 gram × Rp {formatCurrency(parseCurrency(hargaEmas))})
            </p>
          )}
        </motion.div>
      )}

      {/* Form */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="rounded-xl bg-card border border-border/50 p-5 shadow-sm space-y-4">
        
        {activeTab === 'maal' && (
          <>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <strong>Zakat Maal</strong> wajib atas harta yang telah mencapai nisab (setara 85 gram emas) dan telah dimiliki selama 1 tahun (haul). Besarnya 2,5% dari harta bersih.
            </div>
            <CurrencyInput label="Total Harta (tabungan, emas, investasi, dll)" value={maalHarta} onChange={setMaalHarta} />
            <CurrencyInput label="Total Hutang (opsional)" value={maalHutang} onChange={setMaalHutang} />
          </>
        )}

        {activeTab === 'fitrah' && (
          <>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <strong>Zakat Fitrah</strong> wajib atas setiap jiwa Muslim menjelang Idul Fitri. Besarnya 2,5 kg atau 3,5 liter makanan pokok per jiwa.
            </div>
            <NumberInput label="Jumlah Jiwa" value={fitrahJiwa} onChange={setFitrahJiwa} placeholder="Contoh: 4" suffix="jiwa" />
            <CurrencyInput label="Harga Beras per Kg" value={fitrahHarga} onChange={setFitrahHarga} placeholder="15.000" />
          </>
        )}

        {activeTab === 'perdagangan' && (
          <>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <strong>Zakat Perdagangan</strong> dikenakan atas harta niaga yang telah mencapai nisab dan haul. Dihitung dari: (modal + keuntungan + piutang lancar + stok barang) - hutang dagang. Besarnya 2,5%.
            </div>
            <CurrencyInput label="Modal Awal Usaha" value={dagangModal} onChange={setDagangModal} />
            <CurrencyInput label="Keuntungan Bersih" value={dagangUntung} onChange={setDagangUntung} />
            <CurrencyInput label="Piutang Lancar (bisa ditagih)" value={dagangPiutang} onChange={setDagangPiutang} />
            <CurrencyInput label="Nilai Stok Barang Saat Ini" value={dagangStok} onChange={setDagangStok} />
            <CurrencyInput label="Hutang Dagang" value={dagangHutang} onChange={setDagangHutang} />
          </>
        )}

        {activeTab === 'pertanian' && (
          <>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <strong>Zakat Pertanian</strong> dikenakan saat panen jika hasilnya mencapai nisab (653 kg gabah). Besarnya 10% jika tadah hujan, 5% jika irigasi berbayar, dan 7,5% jika campuran.
            </div>
            <NumberInput label="Hasil Panen" value={taniHasil} onChange={setTaniHasil} placeholder="Contoh: 1000" suffix="kg" />
            <CurrencyInput label="Harga per Kg" value={taniHarga} onChange={setTaniHarga} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Jenis Pengairan</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'tadah_hujan' as const, label: 'Tadah Hujan', pct: '10%' },
                  { value: 'irigasi' as const, label: 'Irigasi', pct: '5%' },
                  { value: 'campuran' as const, label: 'Campuran', pct: '7,5%' },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => setTaniIrigasi(opt.value)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      taniIrigasi === opt.value ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-background border-border text-muted-foreground hover:bg-muted/50'
                    }`}>
                    <div>{opt.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{opt.pct}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'peternakan' && (
          <>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <strong>Zakat Peternakan</strong> wajib atas hewan ternak (unta, sapi/kerbau, kambing/domba) yang telah mencapai nisab, digembalakan (sa&apos;imah), dan dimiliki selama 1 tahun (haul). Zakat dibayarkan dalam bentuk hewan.
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Jenis Hewan Ternak</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'kambing' as const, label: 'Kambing/Domba', nisab: 'Nisab: 40' },
                  { value: 'sapi' as const, label: 'Sapi/Kerbau', nisab: 'Nisab: 30' },
                  { value: 'unta' as const, label: 'Unta', nisab: 'Nisab: 5' },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => { setTernakJenis(opt.value); setResult(null); setShowNisabTable(false); }}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      ternakJenis === opt.value ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-background border-border text-muted-foreground hover:bg-muted/50'
                    }`}>
                    <div>{opt.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{opt.nisab} ekor</div>
                  </button>
                ))}
              </div>
            </div>
            <NumberInput label="Jumlah Hewan" value={ternakJumlah} onChange={setTernakJumlah} placeholder="Contoh: 50" suffix="ekor" />
            
            <button onClick={() => setShowNisabTable(!showNisabTable)}
              className="text-xs text-primary hover:underline font-medium">
              {showNisabTable ? 'Sembunyikan' : 'Lihat'} tabel nisab {ternakJenis === 'kambing' ? 'kambing/domba' : ternakJenis === 'sapi' ? 'sapi/kerbau' : 'unta'}
            </button>

            {showNisabTable && (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-foreground">Jumlah (ekor)</th>
                      <th className="text-left px-3 py-2 font-medium text-foreground">Zakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {nisabTableData.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-3 py-2 text-foreground">{row.max === Infinity ? `${row.min}+` : `${row.min} – ${row.max}`}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.zakatDesc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleHitung}
            className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
            Hitung Zakat
          </button>
          <button onClick={handleReset}
            className="px-4 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
            Reset
          </button>
        </div>
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className={`rounded-xl border p-5 shadow-sm space-y-3 ${
            result.wajibZakat ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border/50'
          }`}>
          <div className="flex items-center gap-2">
            {result.wajibZakat
              ? <CheckCircle size={20} className="text-primary" />
              : <AlertCircle size={20} className="text-muted-foreground" />
            }
            <h3 className="font-display font-semibold text-foreground">
              {result.wajibZakat ? 'Wajib Zakat' : 'Belum Wajib Zakat'}
            </h3>
          </div>

          {result.wajibZakat && activeTab !== 'peternakan' && (
            <div className="bg-card rounded-lg p-4 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Zakat yang harus dikeluarkan</p>
              <p className="font-display font-bold text-2xl text-primary">Rp {formatCurrency(result.jumlahZakat)}</p>
              {result.persentase > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{result.persentase}% dari Rp {formatCurrency(result.totalHartaBersih)}</p>
              )}
            </div>
          )}

          {result.wajibZakat && activeTab === 'peternakan' && result.zakatHewan && (
            <div className="bg-card rounded-lg p-4 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Zakat yang harus dikeluarkan</p>
              <p className="font-display font-bold text-lg text-primary">{result.zakatHewan}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">{result.penjelasan}</p>

          <div className="text-xs text-muted-foreground/70 bg-muted/30 rounded-lg p-3 mt-2">
            <strong>Catatan:</strong> Perhitungan ini bersifat estimasi. Konsultasikan dengan ulama atau lembaga amil zakat terpercaya untuk perhitungan yang lebih akurat.
          </div>
        </motion.div>
      )}
    </div>
  );
}
