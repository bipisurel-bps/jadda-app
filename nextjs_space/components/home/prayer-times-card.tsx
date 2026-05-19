'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Sunrise, CloudSun, Sunset, Moon, ChevronRight, Loader2 } from 'lucide-react';
import { PrayerTimes, PRAYER_LABELS } from '@/lib/prayer-utils';

interface PrayerTimesCardProps {
  prayerTimes: PrayerTimes | null;
  nextPrayer: string | null;
  countdown: string;
  cityName?: string;
  loading: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Fajr: Sunrise,
  Dhuhr: CloudSun,
  Asr: Sunset,
  Maghrib: Sunset,
  Isha: Moon,
};

const DISPLAY_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export default function PrayerTimesCard({ prayerTimes, nextPrayer, countdown, cityName, loading }: PrayerTimesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Link href="/sholat" className="block">
        <div className="group rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-4 md:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <Clock size={20} className="text-indigo-500" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-foreground">Waktu Sholat</h2>
                {cityName && (
                  <p className="text-[11px] text-muted-foreground">{cityName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {nextPrayer && nextPrayer !== 'Sunrise' && (
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                  Next: {PRAYER_LABELS[nextPrayer]?.label}
                </span>
              )}
              <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Prayer Times Grid */}
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : prayerTimes ? (
            <div className="space-y-2">
              {/* Row 1: Subuh, Dzuhur, Ashar */}
              <div className="grid grid-cols-3 gap-2">
                {(['Fajr', 'Dhuhr', 'Asr'] as const).map((key) => {
                  const Icon = ICON_MAP[key];
                  const info = PRAYER_LABELS[key];
                  const isNext = nextPrayer === key;
                  return (
                    <div
                      key={key}
                      className={`rounded-lg p-3 text-center ${
                        isNext ? 'bg-primary/10 ring-1 ring-primary/30' : 'bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon size={14} className={info.color} />
                        <span className="text-[11px] font-medium text-muted-foreground">{info.label}</span>
                      </div>
                      <span className={`text-lg font-bold font-mono ${isNext ? 'text-primary' : 'text-foreground'}`}>
                        {(prayerTimes as any)[key]}
                      </span>
                      {isNext && (
                        <p className="text-[10px] text-primary font-medium mt-0.5">{countdown}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Row 2: Maghrib (highlight), Isya */}
              <div className="grid grid-cols-2 gap-2">
                {(['Maghrib', 'Isha'] as const).map((key) => {
                  const Icon = ICON_MAP[key];
                  const info = PRAYER_LABELS[key];
                  const isNext = nextPrayer === key;
                  const isMaghrib = key === 'Maghrib';
                  return (
                    <div
                      key={key}
                      className={`rounded-lg p-3 text-center ${
                        isNext
                          ? 'bg-primary/10 ring-1 ring-primary/30'
                          : isMaghrib
                          ? 'bg-amber-500/8 border border-amber-500/15'
                          : 'bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon size={14} className={info.color} />
                        <span className="text-[11px] font-medium text-muted-foreground">{info.label}</span>
                      </div>
                      <span className={`text-lg font-bold font-mono ${isNext ? 'text-primary' : 'text-foreground'}`}>
                        {(prayerTimes as any)[key]}
                      </span>
                      {isNext && (
                        <p className="text-[10px] text-primary font-medium mt-0.5">{countdown}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Izinkan akses lokasi untuk melihat jadwal sholat</p>
          )}

          {/* Footer link */}
          <div className="mt-3 pt-3 border-t border-border/30 text-center">
            <span className="text-xs text-primary font-medium group-hover:underline">Lihat lengkap →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
