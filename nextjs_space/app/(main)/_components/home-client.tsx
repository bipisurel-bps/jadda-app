'use client';

import React from 'react';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
import HeroHeader from '@/components/home/hero-header';
import PrayerTimesCard from '@/components/home/prayer-times-card';
import DailyVerseCard from '@/components/home/daily-verse-card';
import FeatureGrid from '@/components/home/feature-grid';

export default function HomeClient() {
  const {
    prayerTimes,
    nextPrayer,
    countdown,
    hijriDate,
    gregorianDate,
    cityName,
    loading,
  } = usePrayerTimes();

  return (
    <div className="space-y-6">
      <HeroHeader
        hijriDate={hijriDate}
        gregorianDate={gregorianDate}
        cityName={cityName}
      />

      <PrayerTimesCard
        prayerTimes={prayerTimes}
        nextPrayer={nextPrayer}
        countdown={countdown}
        cityName={cityName}
        loading={loading}
      />

      <DailyVerseCard />

      <FeatureGrid />
    </div>
  );
}
