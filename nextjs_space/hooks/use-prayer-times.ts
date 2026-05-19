'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PrayerTimes, LocationInfo, timeToMinutes, formatCountdown, PRAYER_ORDER } from '@/lib/prayer-utils';

interface UsePrayerTimesReturn {
  prayerTimes: PrayerTimes | null;
  nextPrayer: string | null;
  countdown: string;
  hijriDate: string;
  gregorianDate: string;
  cityName: string;
  loading: boolean;
  error: string | null;
  location: LocationInfo | null;
  reload: () => void;
}

export function usePrayerTimes(): UsePrayerTimesReturn {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState('');
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [gregorianDate, setGregorianDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [cityName, setCityName] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getLocation = useCallback((): Promise<LocationInfo> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung browser ini'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          if (err.code === 1) reject(new Error('Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser Anda.'));
          else if (err.code === 2) reject(new Error('Lokasi tidak tersedia.'));
          else reject(new Error('Waktu permintaan lokasi habis. Coba lagi.'));
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
      );
    });
  }, []);

  const fetchPrayerTimes = useCallback(async (loc: LocationInfo) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${loc.latitude}&longitude=${loc.longitude}&method=20`
    );
    const data = await res.json();
    if (data?.code === 200 && data?.data?.timings) {
      const t = data.data.timings;
      setPrayerTimes({
        Fajr: t.Fajr?.split(' ')[0] || '',
        Sunrise: t.Sunrise?.split(' ')[0] || '',
        Dhuhr: t.Dhuhr?.split(' ')[0] || '',
        Asr: t.Asr?.split(' ')[0] || '',
        Maghrib: t.Maghrib?.split(' ')[0] || '',
        Isha: t.Isha?.split(' ')[0] || '',
      });
      if (data.data.date?.hijri) {
        const h = data.data.date.hijri;
        setHijriDate(`${h.day} ${h.month?.en || ''} ${h.year} H`);
      }
      if (data.data.meta?.timezone) {
        const city = data.data.meta.timezone.split('/').pop()?.replace(/_/g, ' ') || '';
        setCityName(city);
        loc.city = city;
        setLocation({ ...loc });
      }
    } else {
      throw new Error('Gagal mengambil jadwal sholat');
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await getLocation();
      setLocation(loc);
      await fetchPrayerTimes(loc);
      setGregorianDate(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    } catch (e: any) {
      setError(e?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [getLocation, fetchPrayerTimes]);

  useEffect(() => { loadData(); }, [loadData]);

  // Countdown timer
  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      let found = false;
      for (const key of PRAYER_ORDER) {
        const t = (prayerTimes as any)[key];
        if (!t) continue;
        if (timeToMinutes(t) > nowMin) {
          setNextPrayer(key);
          const [ph, pm] = t.split(':').map(Number);
          const target = new Date();
          target.setHours(ph, pm, 0, 0);
          setCountdown(formatCountdown(target.getTime() - now.getTime()));
          found = true;
          break;
        }
      }
      if (!found) { setNextPrayer('Fajr'); setCountdown('Besok'); }
    };
    update();
    intervalRef.current = setInterval(update, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [prayerTimes]);

  return {
    prayerTimes,
    nextPrayer,
    countdown,
    hijriDate,
    gregorianDate,
    cityName,
    loading,
    error,
    location,
    reload: loadData,
  };
}
