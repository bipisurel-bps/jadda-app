import React from 'react';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
}

export const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export const PRAYER_LABELS: Record<string, { label: string; color: string }> = {
  Fajr: { label: 'Subuh', color: 'text-indigo-500' },
  Sunrise: { label: 'Syuruq', color: 'text-amber-500' },
  Dhuhr: { label: 'Zhuhur', color: 'text-yellow-600' },
  Asr: { label: 'Ashar', color: 'text-orange-500' },
  Maghrib: { label: 'Maghrib', color: 'text-red-500' },
  Isha: { label: 'Isya', color: 'text-blue-600' },
};

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) return 'Sudah masuk';
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}j ${m}m ${s}d`;
  if (m > 0) return `${m}m ${s}d`;
  return `${s}d`;
}
