'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Bell, BellOff, Sun, Sunrise, Sunset, Moon, CloudSun, RefreshCw, Loader2, AlertCircle, Volume2, BookOpen, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface LocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
}

const PRAYER_NAMES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  Fajr: { label: 'Subuh', icon: <Sunrise size={20} />, color: 'text-indigo-500' },
  Sunrise: { label: 'Syuruq', icon: <Sun size={20} />, color: 'text-amber-500' },
  Dhuhr: { label: 'Zhuhur', icon: <CloudSun size={20} />, color: 'text-yellow-600' },
  Asr: { label: 'Ashar', icon: <Sunset size={20} />, color: 'text-orange-500' },
  Maghrib: { label: 'Maghrib', icon: <Sunset size={20} />, color: 'text-red-500' },
  Isha: { label: 'Isya', icon: <Moon size={20} />, color: 'text-blue-600' },
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) return 'Sudah masuk';
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}j ${m}m ${s}d`;
  if (m > 0) return `${m}m ${s}d`;
  return `${s}d`;
}

export default function SholatClient() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState('');
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jadda_dzikir_notif');
      if (saved === 'true') setNotifEnabled(true);
      if ('Notification' in window) {
        setNotifPermission(Notification.permission);
      }
    }
  }, []);

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
        loc.city = data.data.meta.timezone.split('/').pop()?.replace(/_/g, ' ') || '';
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
      setCurrentDate(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    } catch (e: any) {
      setError(e?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [getLocation, fetchPrayerTimes]);

  useEffect(() => { loadData(); }, [loadData]);

  // Countdown
  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      const order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let found = false;
      for (const key of order) {
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

  // Dzikir notifications
  useEffect(() => {
    if (!notifEnabled || !prayerTimes || notifPermission !== 'granted') return;
    const check = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const todayKey = now.toISOString().split('T')[0];
      const fajrMin = timeToMinutes(prayerTimes.Fajr);
      if (nowMin >= fajrMin + 5 && nowMin <= fajrMin + 7) {
        const key = `jadda_notif_pagi_${todayKey}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, '1');
          new Notification('\ud83c\udf05 Dzikir Pagi \u2014 Jadda', { body: 'Waktunya dzikir pagi! Setelah Subuh sampai terbit matahari.', icon: '/logo-jadda.png' });
        }
      }
      const asrMin = timeToMinutes(prayerTimes.Asr);
      if (nowMin >= asrMin + 5 && nowMin <= asrMin + 7) {
        const key = `jadda_notif_petang_${todayKey}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, '1');
          new Notification('\ud83c\udf07 Dzikir Petang \u2014 Jadda', { body: 'Waktunya dzikir petang! Setelah Ashar sampai Maghrib.', icon: '/logo-jadda.png' });
        }
      }
    };
    check();
    notifCheckRef.current = setInterval(check, 60000);
    return () => { if (notifCheckRef.current) clearInterval(notifCheckRef.current); };
  }, [notifEnabled, prayerTimes, notifPermission]);

  const toggleNotif = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser Anda tidak mendukung notifikasi');
      return;
    }
    if (!notifEnabled) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === 'granted') {
        setNotifEnabled(true);
        localStorage.setItem('jadda_dzikir_notif', 'true');
        toast.success('Pengingat dzikir pagi & petang diaktifkan!');
      } else {
        toast.error('Izin notifikasi ditolak. Aktifkan di pengaturan browser.');
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem('jadda_dzikir_notif', 'false');
      toast('Pengingat dzikir dinonaktifkan');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Mendeteksi lokasi & mengambil jadwal sholat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-foreground font-medium">{error}</p>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          <RefreshCw size={16} /> Coba Lagi
        </button>
      </div>
    );
  }

  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Waktu Sholat</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin size={14} />
          <span>{location?.city || `${location?.latitude?.toFixed(2)}, ${location?.longitude?.toFixed(2)}`}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm opacity-80">{currentDate}</p>
            {hijriDate && <p className="text-xs opacity-60 mt-0.5">{hijriDate}</p>}
          </div>
          {nextPrayer && (
            <div className="text-right">
              <p className="text-xs opacity-80 uppercase tracking-wide">Sholat berikutnya</p>
              <p className="text-2xl font-display font-bold mt-0.5">{PRAYER_NAMES[nextPrayer]?.label}</p>
              <div className="flex items-center gap-2 justify-end mt-1">
                <Clock size={14} className="opacity-80" />
                <span className="text-sm font-mono">
                  {(prayerTimes as any)?.[nextPrayer]} &mdash; <span className="font-bold">{countdown}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden"
      >
        {prayerOrder.map((key, i) => {
          const info = PRAYER_NAMES[key];
          const time = (prayerTimes as any)?.[key];
          const isNext = nextPrayer === key;
          const isSunrise = key === 'Sunrise';
          return (
            <div key={key}
              className={`flex items-center justify-between px-5 py-4 ${i < prayerOrder.length - 1 ? 'border-b border-border/30' : ''} ${isNext ? 'bg-primary/5' : ''} ${isSunrise ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isNext ? 'bg-primary/15' : 'bg-muted/50'}`}>
                  <span className={info?.color}>{info?.icon}</span>
                </div>
                <p className={`font-medium ${isNext ? 'text-primary font-semibold' : 'text-foreground'} ${isSunrise ? 'text-muted-foreground' : ''}`}>
                  {info?.label}{isSunrise && <span className="text-xs ml-1">(terbit)</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-base ${isNext ? 'text-primary font-bold' : 'text-foreground'}`}>{time}</span>
                {isNext && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl bg-card border border-border/50 shadow-sm p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Volume2 size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground">Pengingat Dzikir</h2>
              <p className="text-xs text-muted-foreground">Notifikasi dzikir pagi &amp; petang</p>
            </div>
          </div>
          <button onClick={toggleNotif}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${notifEnabled ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {notifEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {notifEnabled ? 'Aktif' : 'Aktifkan'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sunrise size={14} className="text-indigo-500" />
              <span className="text-sm font-semibold text-foreground">Dzikir Pagi</span>
            </div>
            <p className="text-xs text-muted-foreground">Setelah Subuh ({prayerTimes?.Fajr}) sampai Syuruq ({prayerTimes?.Sunrise})</p>
          </div>
          <div className="rounded-lg bg-orange-500/5 border border-orange-500/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sunset size={14} className="text-orange-500" />
              <span className="text-sm font-semibold text-foreground">Dzikir Petang</span>
            </div>
            <p className="text-xs text-muted-foreground">Setelah Ashar ({prayerTimes?.Asr}) sampai Maghrib ({prayerTimes?.Maghrib})</p>
          </div>
        </div>
        <Link href="/doa" className="flex items-center justify-between px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Buka Kumpulan Doa &amp; Dzikir</p>
              <p className="text-xs text-muted-foreground">Dzikir pagi &amp; petang lengkap dari Hisnul Muslim</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </motion.div>

      <div className="flex justify-center">
        <button onClick={loadData} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw size={14} /> Perbarui jadwal
        </button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">Sumber: Aladhan.com &bull; Metode: Kemenag RI</p>
    </div>
  );
}
