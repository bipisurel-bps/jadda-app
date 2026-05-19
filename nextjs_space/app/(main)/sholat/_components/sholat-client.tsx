'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Bell, BellOff, Sun, Sunrise, Sunset, Moon, CloudSun, RefreshCw, Loader2, AlertCircle, Volume2, BookOpen, ChevronRight, Compass
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { PrayerTimes, PRAYER_LABELS, PRAYER_ORDER, timeToMinutes } from '@/lib/prayer-utils';

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  Fajr: <Sunrise size={20} />,
  Sunrise: <Sun size={20} />,
  Dhuhr: <CloudSun size={20} />,
  Asr: <Sunset size={20} />,
  Maghrib: <Sunset size={20} />,
  Isha: <Moon size={20} />,
};

export default function SholatClient() {
  const {
    prayerTimes,
    nextPrayer,
    countdown,
    hijriDate,
    gregorianDate,
    cityName,
    loading,
    error,
    location,
    reload,
  } = usePrayerTimes();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>('default');
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
          new Notification('🌅 Dzikir Pagi — Jadda', { body: 'Waktunya dzikir pagi! Setelah Subuh sampai terbit matahari.', icon: '/logo-jadda.png' });
        }
      }
      const asrMin = timeToMinutes(prayerTimes.Asr);
      if (nowMin >= asrMin + 5 && nowMin <= asrMin + 7) {
        const key = `jadda_notif_petang_${todayKey}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, '1');
          new Notification('🌇 Dzikir Petang — Jadda', { body: 'Waktunya dzikir petang! Setelah Ashar sampai Maghrib.', icon: '/logo-jadda.png' });
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
        <button onClick={reload} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          <RefreshCw size={16} /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Waktu Sholat</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin size={14} />
          <span>{cityName || (location ? `${location.latitude?.toFixed(2)}, ${location.longitude?.toFixed(2)}` : '')}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm opacity-80">{gregorianDate}</p>
            {hijriDate && <p className="text-xs opacity-60 mt-0.5">{hijriDate}</p>}
          </div>
          {nextPrayer && (
            <div className="text-right">
              <p className="text-xs opacity-80 uppercase tracking-wide">Sholat berikutnya</p>
              <p className="text-2xl font-display font-bold mt-0.5">{PRAYER_LABELS[nextPrayer]?.label}</p>
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
        {PRAYER_ORDER.map((key, i) => {
          const info = PRAYER_LABELS[key];
          const time = (prayerTimes as any)?.[key];
          const isNext = nextPrayer === key;
          const isSunrise = key === 'Sunrise';
          return (
            <div key={key}
              className={`flex items-center justify-between px-5 py-4 ${i < PRAYER_ORDER.length - 1 ? 'border-b border-border/30' : ''} ${isNext ? 'bg-primary/5' : ''} ${isSunrise ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isNext ? 'bg-primary/15' : 'bg-muted/50'}`}>
                  <span className={info?.color}>{PRAYER_ICONS[key]}</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/doa" className="flex items-center justify-between px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Kumpulan Doa &amp; Dzikir</p>
                <p className="text-xs text-muted-foreground">Dzikir pagi &amp; petang dari Hisnul Muslim</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link href="/qibla" className="flex items-center justify-between px-4 py-3 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 transition-colors group">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-foreground">Arah Kiblat</p>
                <p className="text-xs text-muted-foreground">Kompas digital berbasis GPS &amp; sensor</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </Link>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <button onClick={reload} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw size={14} /> Perbarui jadwal
        </button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">Sumber: Aladhan.com &bull; Metode: Kemenag RI</p>
    </div>
  );
}
