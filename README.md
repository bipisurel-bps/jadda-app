<div align="center">

# جدّ

# Jadda — Aplikasi Islami Ringkas

**Doa · Hadits · Zakat · Waris · Umrah · Haji · Sholat · Kiblat**

[![Live App](https://img.shields.io/badge/🌐_Live-jadda.app-10B981?style=for-the-badge)](https://jadda.app)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-6366F1?style=for-the-badge&logo=pwa&logoColor=white)](https://jadda.app)
[![Version](https://img.shields.io/badge/version-2.3-C9A84C?style=for-the-badge)](https://jadda.app/tentang)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

<br />

<img src="public/logo-jadda.png" alt="Jadda Logo" width="120" />

**Jadda** (جدّ) berarti *bersungguh-sungguh*. Aplikasi web Islami ringkas yang menyajikan doa harian, hadits, kalkulator zakat & waris, panduan ibadah, jadwal sholat, dan kompas kiblat — semuanya dalam satu tempat, offline-ready.

[🌐 Buka Jadda](https://jadda.app) · [📱 Install PWA](#-instalasi-pwa) · [🐛 Laporkan Bug](https://github.com/bipisurel-bps/jadda-app/issues)

</div>

---

## ✨ Fitur

### 📖 Doa Harian
- **310 doa** dari kitab **Hisnul Muslim** dalam **161 kategori**
- Teks Arab, transliterasi latin, terjemahan Indonesia, dan sumber hadits
- Pencarian cepat, filter kategori, bookmark favorit
- Salin teks Arab ke clipboard

### 📜 Hadits Arbain An-Nawawi
- **42 hadits** pilihan Imam An-Nawawi & Ibnu Rajab
- Dilengkapi **kandungan hadits** (pelajaran & intisari)
- Teks Arab, perawi, terjemahan, dan sumber
- Pencarian dan bookmark

### 💰 Kalkulator Zakat
5 jenis zakat dengan perhitungan nisab otomatis:
| Jenis | Keterangan |
|---|---|
| **Maal** | Harta (2.5% di atas nisab 85g emas) |
| **Fitrah** | Per jiwa (2.5 kg beras × harga) |
| **Perdagangan** | Aset usaha dikurangi hutang |
| **Pertanian** | Hasil panen (5% tadah hujan / 10% irigasi) |
| **Peternakan** | Unta, sapi/kerbau, kambing/domba — tabel nisab lengkap |

### ⚖️ Kalkulator Waris (Faraidh)
- Perhitungan sesuai **Al-Qur'an dan Sunnah**
- Mendukung: Ashabul Furudh, Ashabah, Hajb, Aul, Radd, Al-Umariyyatain
- Visualisasi pie chart dan tabel pembagian
- Dalil Al-Qur'an untuk setiap bagian

### 🕌 Panduan Umrah
- **10 langkah** tata cara umrah lengkap
- Doa dan bacaan Arab dengan transliterasi
- 2 mode: Accordion (semua langkah) & Stepper (satu per satu)

### 🕋 Panduan Haji
- **10 langkah** manasik haji sesuai Sunnah
- Sumber: *Mulakhos Fiqhi* — Syaikh Shaleh Al-Fauzan
- Mencakup: Ihram, Thawaf, Sa'i, Wukuf Arafah, Jumrah, dll.

### 🕐 Waktu Sholat & Dzikir
- Jadwal sholat otomatis berdasarkan **GPS** (metode Kemenag RI)
- Countdown waktu sholat berikutnya
- Pengingat **Dzikir Pagi & Petang**
- Sumber data: [Aladhan API](https://aladhan.com/prayer-times-api)

### 🧭 Arah Kiblat (Kompas Digital)
- Bearing great-circle ke **Ka'bah** (21.4225°N, 39.8262°E)
- Jarak Haversine ke Makkah
- Sensor orientasi perangkat:
  - `deviceorientationabsolute` (Android Chrome)
  - `webkitCompassHeading` (iOS Safari)
  - Fallback dengan peringatan kalibrasi
- Dukungan izin iOS 13+ (`DeviceOrientationEvent.requestPermission`)
- Indikator visual "Menghadap Kiblat ✓" (toleransi 5°)
- Low-pass filter untuk redam jitter sensor
- Reverse geocode lokasi via OpenStreetMap Nominatim

---

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS, CSS Variables (dark mode) |
| **Animasi** | Framer Motion |
| **Chart** | Recharts |
| **UI** | Radix UI, Lucide Icons |
| **Font** | DM Sans, Plus Jakarta Sans, Amiri (Arabic) |
| **PWA** | Service Worker, Web App Manifest |
| **API** | Aladhan (sholat), Nominatim (geocode) |
| **Analytics** | Google Analytics 4 |


---

## 📁 Struktur Proyek

```
jadda-app/
├── app/
│   ├── (main)/
│   │   ├── page.tsx              # Beranda
│   │   ├── doa/                  # Doa Harian (310 doa)
│   │   ├── hadits/               # Hadits Arbain (42 hadits)
│   │   ├── zakat/                # Kalkulator Zakat (5 jenis)
│   │   ├── waris/                # Kalkulator Waris (Faraidh)
│   │   ├── umroh/                # Panduan Umrah (10 langkah)
│   │   ├── haji/                 # Panduan Haji (10 langkah)
│   │   ├── sholat/               # Waktu Sholat & Dzikir
│   │   ├── qibla/                # Arah Kiblat (Kompas)
│   │   └── tentang/              # Tentang Aplikasi
│   ├── layout.tsx                # Root layout, metadata, fonts
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # robots.txt
├── components/
│   ├── app-shell.tsx             # Header, navigation, footer
│   ├── json-ld.tsx               # SEO structured data
│   ├── icons/                    # Custom SVG icon components
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── faraidh.ts                # Logika kalkulator waris
│   ├── zakat.ts                  # Logika kalkulator zakat
│   ├── qibla.ts                  # Bearing & jarak ke Ka'bah
│   ├── quran-verses.ts           # Ayat harian
│   └── types.ts                  # TypeScript interfaces
├── public/
│   ├── data/
│   │   ├── prayers.json          # 310 doa Hisnul Muslim
│   │   ├── hadits-arbain.json    # 42 hadits + kandungan
│   │   ├── panduan-umroh.json    # 10 langkah umrah
│   │   └── panduan-haji.json     # 10 langkah haji
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   └── logo-jadda.png            # Logo aplikasi
└── tailwind.config.ts            # Theme: emerald + gold
```

---

## 🎨 Desain

- **Warna Utama**: Emerald Green `#1B6B4A` + Gold Accent `#C9A84C`
- **Dark Mode**: Didukung penuh via toggle
- **Mobile-first**: Bottom navigation (mobile), top navigation (desktop)
- **Font Arabic**: [Amiri](https://fonts.google.com/specimen/Amiri) — serif untuk teks Arab
- **Ornamen**: Subtle Islamic geometric patterns

---

## 📱 Instalasi PWA

Jadda dapat di-install sebagai aplikasi native di perangkat Anda:

**Android (Chrome):**
1. Buka [jadda.app](https://jadda.app)
2. Tap menu ⋮ → "Add to Home Screen" / "Install App"
3. Konfirmasi install

**iOS (Safari):**
1. Buka [jadda.app](https://jadda.app)
2. Tap tombol Share ↗ → "Add to Home Screen"
3. Tap "Add"

**Desktop (Chrome/Edge):**
1. Buka [jadda.app](https://jadda.app)
2. Klik ikon install ⊕ di address bar
3. Konfirmasi install

---

## 🚀 Development

### Prasyarat
- Node.js 18+
- Yarn

### Menjalankan Lokal

```bash
# Clone repository
git clone https://github.com/bipisurel-bps/jadda-app.git
cd jadda-app

# Install dependencies
yarn install

# Jalankan development server
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Environment Variables

Buat file `.env` di root:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # Google Analytics 4 Measurement ID (opsional)
```

### Build Production

```bash
yarn build
yarn start
```

---

## 📊 Data & Sumber

| Data | Sumber | Format |
|---|---|---|
| Doa Harian | Kitab Hisnul Muslim | JSON (310 doa, 161 kategori) |
| Hadits Arbain | Imam An-Nawawi & Ibnu Rajab | JSON (42 hadits + kandungan) |
| Panduan Umrah | Referensi fikih umrah | JSON (10 langkah) |
| Panduan Haji | Mulakhos Fiqhi (Syaikh Al-Fauzan) | JSON (10 langkah) |
| Waktu Sholat | [Aladhan API](https://aladhan.com) (metode Kemenag RI) | REST API |
| Geocode | [Nominatim/OpenStreetMap](https://nominatim.openstreetmap.org) | REST API |

> Semua data konten Islam disajikan tanpa menyebut mazhab tertentu, bersumber dari Al-Qur'an dan hadits shahih.

---

## 📋 Changelog

### v2.3 (Mei 2025)
- ✅ Arah Kiblat — kompas digital dengan GPS & sensor orientasi
- ✅ Integrasi navigasi: bottom bar, homepage card, quick link
- ✅ SEO: metadata, JSON-LD, sitemap untuk `/qibla`
- ✅ Service worker v6 — cache offline untuk halaman kiblat

### v2.2 (April 2025)
- ✅ Ekspansi doa: 309 → 310 doa, konsolidasi 163 → 161 kategori
- ✅ Kandungan hadits untuk semua 42 hadits Arbain
- ✅ Custom branding: logo & ikon Jadda
- ✅ Service worker v5

### v2.1 (Maret 2025)
- ✅ Rebranding Jariyah → Jadda
- ✅ Panduan Haji (10 langkah)
- ✅ Kalkulator Zakat Peternakan
- ✅ Google Analytics 4

### v2.0
- ✅ PWA dasar: Doa, Hadits, Zakat, Waris, Umrah, Waktu Sholat

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repo ini
2. Buat branch fitur (`git checkout -b fitur/fitur-baru`)
3. Commit perubahan (`git commit -m 'feat: Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur/fitur-baru`)
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<div align="center">

**بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ**

Dibuat dengan ❤️ untuk umat Islam Indonesia

[jadda.app](https://jadda.app)

</div>
