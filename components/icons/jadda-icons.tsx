'use client';

import React from 'react';

/**
 * Jadda Iconography System
 * Design language: kemurnian bentuk, konsistensi garis, metafora kuat
 * Corner Radius: 24px (feature icons) / 128px (app logo on 512px)
 * Main Stroke: 6px (feature icons) / 42px (app logo)
 */

// --- KONFIGURASI WARNA & STROKE ---
export const jaddaIconColors = {
  primary: '#10B981', // Emerald 500
  dark: '#0F172A', // Slate 900
  accent: '#34D399', // Emerald 400
  sholat: '#F59E0B', // Amber 500
  doa: '#F43F5E', // Rose 500
  hadits: '#3B82F6', // Blue 500
  waris: '#8B5CF6', // Violet 500
  kiblat: '#0D9488', // Teal 600
  lightBg: '#F8FAFC',
};

const STROKE_BOLD = '42';

type IconProps = { className?: string; title?: string };

// 1. IKON UTAMA (APP LOGO) — Konsep "The Path" Arab جَدَّ
export const JaddaMainLogo: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Jadda' }) => (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title}>
    <rect width="512" height="512" rx="128" fill={jaddaIconColors.dark} />
    <path
      d="M380 200C380 200 340 160 280 160C200 160 140 220 140 300C140 360 180 400 240 400H380"
      stroke={jaddaIconColors.primary}
      strokeWidth={STROKE_BOLD}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M380 400V320" stroke={jaddaIconColors.primary} strokeWidth={STROKE_BOLD} strokeLinecap="round" />
    <path
      d="M280 100C290 85 300 85 310 100C320 115 330 115 340 100"
      stroke={jaddaIconColors.accent}
      strokeWidth="28"
      strokeLinecap="round"
      opacity="0.8"
    />
    <circle cx="260" cy="280" r="35" fill={jaddaIconColors.primary} />
    <circle cx="260" cy="280" r="55" fill={jaddaIconColors.primary} fillOpacity="0.1" />
  </svg>
);

// 2. WAKTU SHOLAT — Horizon & Sun
export const JaddaSholatIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Waktu Sholat' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Prayer_times_in_Islam.svg/960px-Prayer_times_in_Islam.svg.png" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill="#FFFBEB" />
    <path d="M25 65H75" stroke={jaddaIconColors.sholat} strokeWidth="6" strokeLinecap="round" />
    <path d="M50 20V35" stroke={jaddaIconColors.sholat} strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="55" r="14" stroke={jaddaIconColors.sholat} strokeWidth="6" strokeDasharray="6 4" />
  </svg>
);

// 3. DOA HARIAN — Heart & Intention
export const JaddaDoaIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Doa Harian' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill="#FFF1F2" />
    <path
      d="M50 75C30 62 22 50 22 35C22 24 30 18 40 22L50 28L60 22C70 18 78 24 78 35C78 50 70 62 50 75Z"
      fill={jaddaIconColors.doa}
      fillOpacity="0.15"
    />
    <path d="M50 30V12M38 18L40 20M62 18L60 20" stroke={jaddaIconColors.doa} strokeWidth="5" strokeLinecap="round" />
    <path
      d="M35 55C35 55 42 62 50 62C58 62 65 55 65 55"
      stroke={jaddaIconColors.doa}
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// 4. HADITS ARBAIN — Minimal Manuscript
export const JaddaHaditsIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Hadits' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="https://static.vecteezy.com/system/resources/previews/070/767/157/non_2x/islamic-icon-set-with-18-minimal-line-graphics-interface-icons-for-daily-use-free-vector.jpg" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill="#EFF6FF" />
    <path
      d="M30 30H70M30 45H70M30 60H55"
      stroke={jaddaIconColors.hadits}
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.3"
    />
    <path d="M25 25V75L50 65L75 75V25H25Z" stroke={jaddaIconColors.hadits} strokeWidth="6" strokeLinejoin="round" />
  </svg>
);

// 5. ARAH KIBLAT — Needle & Goal
export const JaddaKiblatIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Arah Kiblat' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="https://cdn.vectorstock.com/i/1000v/78/09/qibla-direction-icon-vector-48127809.jpg" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill="#F0FDFA" />
    <circle cx="50" cy="50" r="35" stroke={jaddaIconColors.kiblat} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
    <path d="M50 15L62 45H38L50 15Z" fill={jaddaIconColors.kiblat} />
    <path d="M50 45V80" stroke={jaddaIconColors.dark} strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="15" r="4" fill={jaddaIconColors.kiblat} />
  </svg>
);

// 6. KALKULATOR ZAKAT — Wealth Clarity (Permata)
export const JaddaZakatIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Zakat' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="https://upload.wikimedia.org/wikipedia/commons/4/41/Zakat_spending_as_per_Holy_Quran.png" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill="#ECFDF5" />
    <path d="M50 25L75 45L50 75L25 45L50 25Z" stroke={jaddaIconColors.primary} strokeWidth="6" strokeLinejoin="round" />
    <path d="M25 45H75M50 25V75" stroke={jaddaIconColors.primary} strokeWidth="2" opacity="0.4" />
    <circle cx="50" cy="50" r="8" fill={jaddaIconColors.primary} />
  </svg>
);

// 7. KALKULATOR WARIS — Equity Balance (Mizan)
export const JaddaWarisIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Waris' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Squircle_rounded_square.svg/960px-Squircle_rounded_square.svg.png" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill="#F5F3FF" />
    <path d="M25 35H75" stroke={jaddaIconColors.waris} strokeWidth="6" strokeLinecap="round" />
    <path d="M50 35V75" stroke={jaddaIconColors.waris} strokeWidth="6" strokeLinecap="round" />
    <rect x="25" y="65" width="50" height="12" rx="4" fill={jaddaIconColors.waris} fillOpacity="0.2" />
    <circle cx="50" cy="35" r="5" fill={jaddaIconColors.waris} />
  </svg>
);

// 8. PANDUAN UMRAH — Gate & Path to Ka'bah
export const JaddaUmrahIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Umrah' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="https://i.etsystatic.com/38819373/r/il/73263e/5721200287/il_fullxfull.5721200287_g1hf.jpg" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill={jaddaIconColors.lightBg} />
    <rect x="40" y="45" width="20" height="20" rx="2" fill={jaddaIconColors.dark} />
    <path d="M50 20V35" stroke={jaddaIconColors.primary} strokeWidth="5" strokeLinecap="round" />
    <path
      d="M30 40C30 40 35 25 50 25C65 25 70 40 70 40"
      stroke={jaddaIconColors.primary}
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// 9. PANDUAN HAJI — Tawaf Movement & Ka'bah
export const JaddaHajiIcon: React.FC<IconProps> = ({ className = 'w-full h-full', title = 'Haji' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title}>
    <rect width="100" height="100" rx="24" fill={jaddaIconColors.lightBg} />
    <rect x="38" y="38" width="24" height="24" rx="2" fill={jaddaIconColors.dark} />
    <path
      d="M50 15C70 15 85 30 85 50C85 70 70 85 50 85C30 85 15 70 15 50"
      stroke={jaddaIconColors.primary}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="1 10"
    />
    <path d="M85 50L90 45M85 50L80 45" stroke={jaddaIconColors.primary} strokeWidth="5" strokeLinecap="round" />
  </svg>
);
