// Zakat Calculator Logic

export interface ZakatMaalInput {
  totalHarta: number; // Total aset (tabungan, emas, investasi dll)
  hutang: number; // Total hutang
}

export interface ZakatFitrahInput {
  jumlahJiwa: number;
  hargaBeras: number; // Harga per kg beras
}

export interface ZakatPerdaganganInput {
  modalAwal: number;
  keuntungan: number;
  piutangLancar: number; // Piutang yang bisa ditagih
  hutangDagang: number;
  stokBarang: number; // Nilai stok barang saat ini
}

export interface ZakatPertanianInput {
  hasilPanen: number; // Dalam kg
  hargaPerKg: number;
  jenisIrigasi: 'tadah_hujan' | 'irigasi' | 'campuran';
}

export interface ZakatResult {
  wajibZakat: boolean;
  jumlahZakat: number;
  nisab: number;
  totalHartaBersih: number;
  persentase: number;
  penjelasan: string;
}

// Nisab emas = 85 gram. Harga emas per gram (estimasi)
const HARGA_EMAS_PER_GRAM = 1_500_000; // Rp 1.500.000 / gram (approx 2024-2025)
const NISAB_EMAS_GRAM = 85;
const NISAB_MAAL = NISAB_EMAS_GRAM * HARGA_EMAS_PER_GRAM; // ~Rp 127.500.000

// Zakat Fitrah = 2.5 kg beras per jiwa (atau 3.5 liter)
const TAKARAN_FITRAH_KG = 2.5;

// Nisab pertanian = 653 kg gabah kering / 524 kg beras
const NISAB_PERTANIAN_KG = 653;

export function hitungZakatMaal(input: ZakatMaalInput): ZakatResult {
  const hartaBersih = Math.max(0, (input?.totalHarta ?? 0) - (input?.hutang ?? 0));
  const wajib = hartaBersih >= NISAB_MAAL;
  const jumlah = wajib ? hartaBersih * 0.025 : 0;

  return {
    wajibZakat: wajib,
    jumlahZakat: Math.round(jumlah),
    nisab: NISAB_MAAL,
    totalHartaBersih: hartaBersih,
    persentase: 2.5,
    penjelasan: wajib
      ? `Harta bersih Anda (Rp ${formatCurrency(hartaBersih)}) telah mencapai nisab (setara 85 gram emas = Rp ${formatCurrency(NISAB_MAAL)}). Zakat yang wajib dikeluarkan adalah 2,5% dari harta bersih.`
      : `Harta bersih Anda (Rp ${formatCurrency(hartaBersih)}) belum mencapai nisab (setara 85 gram emas = Rp ${formatCurrency(NISAB_MAAL)}). Anda belum wajib membayar zakat maal, namun tetap dianjurkan bersedekah.`
  };
}

export function hitungZakatFitrah(input: ZakatFitrahInput): ZakatResult {
  const jumlah = (input?.jumlahJiwa ?? 0) * TAKARAN_FITRAH_KG * (input?.hargaBeras ?? 0);

  return {
    wajibZakat: (input?.jumlahJiwa ?? 0) > 0,
    jumlahZakat: Math.round(jumlah),
    nisab: 0,
    totalHartaBersih: jumlah,
    persentase: 0,
    penjelasan: `Zakat fitrah ditunaikan sebesar ${TAKARAN_FITRAH_KG} kg beras/makanan pokok per jiwa. Untuk ${input?.jumlahJiwa ?? 0} jiwa × ${TAKARAN_FITRAH_KG} kg × Rp ${formatCurrency(input?.hargaBeras ?? 0)}/kg = Rp ${formatCurrency(jumlah)}. Wajib dikeluarkan sebelum shalat Idul Fitri.`
  };
}

export function hitungZakatPerdagangan(input: ZakatPerdaganganInput): ZakatResult {
  const totalAset = (input?.stokBarang ?? 0) + (input?.keuntungan ?? 0) + (input?.piutangLancar ?? 0) + (input?.modalAwal ?? 0);
  const hartaBersih = Math.max(0, totalAset - (input?.hutangDagang ?? 0));
  const wajib = hartaBersih >= NISAB_MAAL;
  const jumlah = wajib ? hartaBersih * 0.025 : 0;

  return {
    wajibZakat: wajib,
    jumlahZakat: Math.round(jumlah),
    nisab: NISAB_MAAL,
    totalHartaBersih: hartaBersih,
    persentase: 2.5,
    penjelasan: wajib
      ? `Total aset perdagangan bersih (Rp ${formatCurrency(hartaBersih)}) telah mencapai nisab. Zakat perdagangan = 2,5% × Rp ${formatCurrency(hartaBersih)} = Rp ${formatCurrency(Math.round(jumlah))}.`
      : `Total aset perdagangan bersih (Rp ${formatCurrency(hartaBersih)}) belum mencapai nisab (Rp ${formatCurrency(NISAB_MAAL)}). Belum wajib zakat perdagangan.`
  };
}

export function hitungZakatPertanian(input: ZakatPertanianInput): ZakatResult {
  const hasilKg = input?.hasilPanen ?? 0;
  const wajib = hasilKg >= NISAB_PERTANIAN_KG;
  
  let persentase = 10;
  let label = 'tadah hujan (10%)';
  if (input?.jenisIrigasi === 'irigasi') {
    persentase = 5;
    label = 'irigasi berbayar (5%)';
  } else if (input?.jenisIrigasi === 'campuran') {
    persentase = 7.5;
    label = 'campuran (7,5%)';
  }

  const nilaiPanen = hasilKg * (input?.hargaPerKg ?? 0);
  const jumlah = wajib ? nilaiPanen * (persentase / 100) : 0;

  return {
    wajibZakat: wajib,
    jumlahZakat: Math.round(jumlah),
    nisab: NISAB_PERTANIAN_KG,
    totalHartaBersih: nilaiPanen,
    persentase,
    penjelasan: wajib
      ? `Hasil panen ${hasilKg} kg telah mencapai nisab (${NISAB_PERTANIAN_KG} kg). Dengan jenis pengairan ${label}, zakat = ${persentase}% × Rp ${formatCurrency(nilaiPanen)} = Rp ${formatCurrency(Math.round(jumlah))}.`
      : `Hasil panen ${hasilKg} kg belum mencapai nisab (${NISAB_PERTANIAN_KG} kg). Belum wajib zakat pertanian.`
  };
}

export function formatCurrency(num: number): string {
  return Math.round(num)?.toLocaleString?.('id-ID') ?? '0';
}

export function parseCurrency(str: string): number {
  const cleaned = (str ?? '')?.replace?.(/[^0-9]/g, '') ?? '';
  return parseInt(cleaned, 10) || 0;
}
