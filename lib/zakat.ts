// Zakat Calculator Logic

export interface ZakatMaalInput {
  totalHarta: number;
  hutang: number;
  hargaEmasPerGram: number; // User provides current gold price
}

export interface ZakatFitrahInput {
  jumlahJiwa: number;
  hargaBeras: number;
}

export interface ZakatPerdaganganInput {
  modalAwal: number;
  keuntungan: number;
  piutangLancar: number;
  hutangDagang: number;
  stokBarang: number;
}

export interface ZakatPertanianInput {
  hasilPanen: number;
  hargaPerKg: number;
  jenisIrigasi: 'tadah_hujan' | 'irigasi' | 'campuran';
}

export interface ZakatPeternakanInput {
  jenisHewan: 'unta' | 'sapi' | 'kambing';
  jumlahEkor: number;
}

export interface ZakatResult {
  wajibZakat: boolean;
  jumlahZakat: number;
  nisab: number;
  totalHartaBersih: number;
  persentase: number;
  penjelasan: string;
  zakatHewan?: string; // For peternakan — describes what to pay
}

const NISAB_EMAS_GRAM = 85;
const TAKARAN_FITRAH_KG = 2.5;
const NISAB_PERTANIAN_KG = 653;

// ===== ZAKAT MAAL =====
export function hitungZakatMaal(input: ZakatMaalInput): ZakatResult {
  const hargaEmas = input?.hargaEmasPerGram ?? 0;
  const nisab = NISAB_EMAS_GRAM * hargaEmas;
  const hartaBersih = Math.max(0, (input?.totalHarta ?? 0) - (input?.hutang ?? 0));
  const wajib = hargaEmas > 0 && hartaBersih >= nisab;
  const jumlah = wajib ? hartaBersih * 0.025 : 0;

  return {
    wajibZakat: wajib,
    jumlahZakat: Math.round(jumlah),
    nisab,
    totalHartaBersih: hartaBersih,
    persentase: 2.5,
    penjelasan: hargaEmas <= 0
      ? 'Masukkan harga emas per gram terlebih dahulu untuk menghitung nisab.'
      : wajib
        ? `Harta bersih Anda (Rp ${formatCurrency(hartaBersih)}) telah mencapai nisab (85 gram emas × Rp ${formatCurrency(hargaEmas)}/gram = Rp ${formatCurrency(nisab)}). Zakat yang wajib dikeluarkan adalah 2,5% dari harta bersih.`
        : `Harta bersih Anda (Rp ${formatCurrency(hartaBersih)}) belum mencapai nisab (85 gram emas × Rp ${formatCurrency(hargaEmas)}/gram = Rp ${formatCurrency(nisab)}). Anda belum wajib membayar zakat maal, namun tetap dianjurkan bersedekah.`
  };
}

// ===== ZAKAT FITRAH =====
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

// ===== ZAKAT PERDAGANGAN =====
export function hitungZakatPerdagangan(input: ZakatPerdaganganInput & { hargaEmasPerGram: number }): ZakatResult {
  const hargaEmas = input?.hargaEmasPerGram ?? 0;
  const nisab = NISAB_EMAS_GRAM * hargaEmas;
  const totalAset = (input?.stokBarang ?? 0) + (input?.keuntungan ?? 0) + (input?.piutangLancar ?? 0) + (input?.modalAwal ?? 0);
  const hartaBersih = Math.max(0, totalAset - (input?.hutangDagang ?? 0));
  const wajib = hargaEmas > 0 && hartaBersih >= nisab;
  const jumlah = wajib ? hartaBersih * 0.025 : 0;

  return {
    wajibZakat: wajib,
    jumlahZakat: Math.round(jumlah),
    nisab,
    totalHartaBersih: hartaBersih,
    persentase: 2.5,
    penjelasan: hargaEmas <= 0
      ? 'Masukkan harga emas per gram terlebih dahulu untuk menghitung nisab.'
      : wajib
        ? `Total aset perdagangan bersih (Rp ${formatCurrency(hartaBersih)}) telah mencapai nisab (Rp ${formatCurrency(nisab)}). Zakat perdagangan = 2,5% × Rp ${formatCurrency(hartaBersih)} = Rp ${formatCurrency(Math.round(jumlah))}.`
        : `Total aset perdagangan bersih (Rp ${formatCurrency(hartaBersih)}) belum mencapai nisab (Rp ${formatCurrency(nisab)}). Belum wajib zakat perdagangan.`
  };
}

// ===== ZAKAT PERTANIAN =====
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

// ===== ZAKAT PETERNAKAN =====

interface NisabTernak {
  min: number;
  max: number; // use Infinity for last bracket
  zakatDesc: string;
}

const NISAB_UNTA: NisabTernak[] = [
  { min: 5, max: 9, zakatDesc: '1 ekor kambing/domba (umur 1 tahun)' },
  { min: 10, max: 14, zakatDesc: '2 ekor kambing/domba' },
  { min: 15, max: 19, zakatDesc: '3 ekor kambing/domba' },
  { min: 20, max: 24, zakatDesc: '4 ekor kambing/domba' },
  { min: 25, max: 35, zakatDesc: '1 ekor unta bintu makhadh (unta betina umur 1 tahun)' },
  { min: 36, max: 45, zakatDesc: '1 ekor unta bintu labun (unta betina umur 2 tahun)' },
  { min: 46, max: 60, zakatDesc: '1 ekor unta hiqqah (unta betina umur 3 tahun)' },
  { min: 61, max: 75, zakatDesc: "1 ekor unta jadza'ah (unta betina umur 4 tahun)" },
  { min: 76, max: 90, zakatDesc: '2 ekor unta bintu labun' },
  { min: 91, max: 120, zakatDesc: '2 ekor unta hiqqah' },
  { min: 121, max: Infinity, zakatDesc: 'Setiap 40 ekor: 1 bintu labun; setiap 50 ekor: 1 hiqqah' },
];

const NISAB_SAPI: NisabTernak[] = [
  { min: 30, max: 39, zakatDesc: "1 ekor tabi'/tabi'ah (sapi umur 1 tahun)" },
  { min: 40, max: 59, zakatDesc: "1 ekor musinnah (sapi umur 2 tahun)" },
  { min: 60, max: 69, zakatDesc: "2 ekor tabi'/tabi'ah" },
  { min: 70, max: 79, zakatDesc: "1 musinnah + 1 tabi'" },
  { min: 80, max: 89, zakatDesc: '2 ekor musinnah' },
  { min: 90, max: 99, zakatDesc: "3 ekor tabi'/tabi'ah" },
  { min: 100, max: 109, zakatDesc: "2 musinnah + 1 tabi'" },
  { min: 110, max: 119, zakatDesc: "2 tabi' + 1 musinnah" },
  { min: 120, max: Infinity, zakatDesc: "Setiap 30 ekor: 1 tabi'; setiap 40 ekor: 1 musinnah" },
];

const NISAB_KAMBING: NisabTernak[] = [
  { min: 40, max: 120, zakatDesc: '1 ekor kambing/domba (umur 1 tahun)' },
  { min: 121, max: 200, zakatDesc: '2 ekor kambing/domba' },
  { min: 201, max: 399, zakatDesc: '3 ekor kambing/domba' },
  { min: 400, max: Infinity, zakatDesc: 'Setiap 100 ekor: 1 ekor kambing/domba' },
];

export function hitungZakatPeternakan(input: ZakatPeternakanInput): ZakatResult {
  const jumlah = input?.jumlahEkor ?? 0;
  const jenis = input?.jenisHewan ?? 'kambing';
  
  let nisabTable: NisabTernak[];
  let nisabMin: number;
  let namaHewan: string;

  switch (jenis) {
    case 'unta':
      nisabTable = NISAB_UNTA;
      nisabMin = 5;
      namaHewan = 'Unta';
      break;
    case 'sapi':
      nisabTable = NISAB_SAPI;
      nisabMin = 30;
      namaHewan = 'Sapi/Kerbau';
      break;
    case 'kambing':
    default:
      nisabTable = NISAB_KAMBING;
      nisabMin = 40;
      namaHewan = 'Kambing/Domba';
      break;
  }

  const wajib = jumlah >= nisabMin;
  let zakatDesc = '';

  if (wajib) {
    const bracket = nisabTable.find(b => jumlah >= b.min && jumlah <= b.max);
    zakatDesc = bracket?.zakatDesc ?? 'Konsultasikan dengan ulama untuk jumlah ini';
  }

  return {
    wajibZakat: wajib,
    jumlahZakat: 0, // Peternakan pays in-kind, not monetary
    nisab: nisabMin,
    totalHartaBersih: jumlah,
    persentase: 0,
    zakatHewan: zakatDesc,
    penjelasan: wajib
      ? `${namaHewan} sebanyak ${jumlah} ekor telah mencapai nisab (${nisabMin} ekor). Zakat yang wajib dikeluarkan: ${zakatDesc}. Syarat: hewan digembalakan (sa'imah) dan telah dimiliki selama 1 tahun (haul).`
      : `${namaHewan} sebanyak ${jumlah} ekor belum mencapai nisab (${nisabMin} ekor). Belum wajib zakat peternakan.`
  };
}

// Get nisab table for display
export function getNisabTable(jenis: 'unta' | 'sapi' | 'kambing'): NisabTernak[] {
  switch (jenis) {
    case 'unta': return NISAB_UNTA;
    case 'sapi': return NISAB_SAPI;
    case 'kambing': return NISAB_KAMBING;
  }
}

export function formatCurrency(num: number): string {
  return Math.round(num)?.toLocaleString?.('id-ID') ?? '0';
}

export function parseCurrency(str: string): number {
  const cleaned = (str ?? '')?.replace?.(/[^0-9]/g, '') ?? '';
  return parseInt(cleaned, 10) || 0;
}
