'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Bell, BellOff, Sun, Sunrise, Sunset, Moon, CloudSun, RefreshCw, Loader2, AlertCircle, Volume2, BookOpen, ChevronRight, Compass
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/page-header';

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

// Per-sholat colors matching Android
const PRAYER_COLORS: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; text: string }> = {
  Fajr: { label: 'Subuh', icon: <Sunrise size={20} />, color: '#7C3AED', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  Sunrise: { label: 'Syuruq', icon: <Sun size={20} />, color: '#D97706', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  Dhuhr: { label: 'Zhuhur', icon: <CloudSun size={20} />, color: '#059669', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  Asr: { label: 'Ashar', icon: <Sunset size={20} />, color: '#EA580C', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  Maghrib: { label: 'Maghrib', icon: <Sunset size={20} />, color: '#DC2626', bg: 'bg-red-500/10', text: 'text-red-400' },
  Isha: { label: 'Isya', icon: <Moon size={20} />, color: '#2563EB', bg: 'bg-blue-500/10', text: 'text-blue-400' },
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
  const [adzanEnabled, setAdzanEnabled] = useState(false);
  const [adzanPermission, setAdzanPermission] = useState<string>('default');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const adzanCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jadda_dzikir_notif');
      if (saved === 'true') setNotifEnabled(true);
      const adzanSaved = localStorage.getItem('jadda_adzan_enabled');
      if (adzanSaved === 'true') setAdzanEnabled(true);
      if ('Notification' in window) {
        setNotifPermission(Notification.permission);
        setAdzanPermission(Notification.permission);
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

  // Adzan sound + notification
  useEffect(() => {
    if (!adzanEnabled || !prayerTimes || adzanPermission !== 'granted') return;
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerLabels: Record<string, string> = {
      Fajr: 'Subuh', Dhuhr: 'Zhuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya',
    };
    const checkAdzan = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const todayKey = now.toISOString().split('T')[0];

      for (const key of prayerOrder) {
        const time = (prayerTimes as any)[key];
        if (!time) continue;
        const prayerMin = timeToMinutes(time);
        if (nowMin >= prayerMin && nowMin <= prayerMin + 2) {
          const notifKey = `jadda_adzan_${key}_${todayKey}`;
          if (!localStorage.getItem(notifKey)) {
            localStorage.setItem(notifKey, '1');
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
            new Notification(`\u{1F54C} Waktu ${prayerLabels[key]} \u2014 Jadda`, {
              body: `Sudah masuk waktu sholat ${prayerLabels[key]} (${time})`,
              icon: '/logo-jadda.png',
              tag: `adzan-${key}`,
            });
          }
        }
      }
    };
    checkAdzan();
    adzanCheckRef.current = setInterval(checkAdzan, 30000);
    return () => { if (adzanCheckRef.current) clearInterval(adzanCheckRef.current); };
  }, [adzanEnabled, prayerTimes, adzanPermission]);

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
          new Notification('\u{1F305} Dzikir Pagi \u2014 Jadda', { body: 'Waktunya dzikir pagi! Setelah Subuh sampai terbit matahari.', icon: '/logo-jadda.png' });
        }
      }
      const asrMin = timeToMinutes(prayerTimes.Asr);
      if (nowMin >= asrMin + 5 && nowMin <= asrMin + 7) {
        const key = `jadda_notif_petang_${todayKey}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, '1');
          new Notification('\u{1F307} Dzikir Petang \u2014 Jadda', { body: 'Waktunya dzikir petang! Setelah Ashar sampai Maghrib.', icon: '/logo-jadda.png' });
        }
      }
    };
    check();
    notifCheckRef.current = setInterval(check, 60000);
    return () => { if (notifCheckRef.current) clearInterval(notifCheckRef.current); };
  }, [notifEnabled, prayerTimes, notifPermission]);

  const toggleAdzan = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser Anda tidak mendukung notifikasi');
      return;
    }
    if (!adzanEnabled) {
      const perm = await Notification.requestPermission();
      setAdzanPermission(perm);
      if (perm === 'granted') {
        setAdzanEnabled(true);
        localStorage.setItem('jadda_adzan_enabled', 'true');
        if (audioRef.current) {
          audioRef.current.load();
        }
        toast.success('Adzan & notifikasi waktu sholat diaktifkan! \u{1F50A}');
      } else {
        toast.error('Izin notifikasi ditolak. Aktifkan di pengaturan browser.');
      }
    } else {
      setAdzanEnabled(false);
      localStorage.setItem('jadda_adzan_enabled', 'false');
      toast('Adzan dinonaktifkan');
    }
  };

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
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-400" />
        <p className="text-white/35 text-sm">Mendeteksi lokasi & mengambil jadwal sholat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-white/70 font-medium">{error}</p>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
          <RefreshCw size={16} /> Coba Lagi
        </button>
      </div>
    );
  }

  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const nextPrayerColor = nextPrayer ? PRAYER_COLORS[nextPrayer] : null;

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title="Waktu Sholat" description={location?.city || 'Lokasi Anda'} />

      {/* Hidden audio element for adzan */}
      <audio ref={audioRef} src="/audio/adzan.mp3" preload="auto" />

      <div className="mt-4 space-y-4">
        {/* Date card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/10 p-5"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-white/60">{currentDate}</p>
              {hijriDate && <p className="text-xs text-white/35 mt-0.5">{hijriDate}</p>}
            </div>
            {nextPrayer && (
              <div className="text-right">
                <p className="text-[11px] font-extrabold text-white/30 uppercase tracking-tight">Sholat berikutnya</p>
                <p className="text-2xl font-display font-bold text-white/90 mt-0.5">
                  {PRAYER_COLORS[nextPrayer]?.label}
                </p>
                <div className="flex items-center gap-2 justify-end mt-1.5">
                  <Clock size={14} className="text-white/40" />
                  <span className="text-sm text-white/70 font-mono">
                    {(prayerTimes as any)?.[nextPrayer]} — <span className="font-bold text-emerald-400">{countdown}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Prayer pills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
        >
          {prayerOrder.map((key, i) => {
            const info = PRAYER_COLORS[key];
            const time = (prayerTimes as any)?.[key];
            const isNext = nextPrayer === key;
            const isSunrise = key === 'Sunrise';
            return (
              <div key={key}
                className={`flex items-center justify-between px-5 py-4 ${
                  i < prayerOrder.length - 1 ? 'border-b border-white/[0.04]' : ''
                } ${isNext ? 'bg-emerald-500/[0.03]' : ''} ${isSunrise ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isNext ? info.bg : 'bg-white/[0.03]'}`}>
                    <span className={info.text}>{info.icon}</span>
                  </div>
                  <p className={`font-medium text-sm ${
                    isNext ? 'text-white/90 font-semibold' : 'text-white/60'
                  }`}>
                    {info.label}{isSunrise && <span className="text-xs text-white/30 ml-1">(terbit)</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-base ${
                    isNext ? 'text-emerald-400 font-bold' : 'text-white/70'
                  }`}>{time}</span>
                  {isNext && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Toggles card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-4"
        >
          {/* Adzan Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Volume2 size={20} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-sm text-white/80">Adzan & Pengingat Sholat</h2>
                <p className="text-xs text-white/35">Suara adzan + notifikasi tiap waktu sholat</p>
              </div>
            </div>
            <button onClick={toggleAdzan}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                adzanEnabled ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/[0.04] text-white/35 hover:bg-white/[0.06]'
              }`}
            >
              {adzanEnabled ? <Bell size={16} /> : <BellOff size={16} />}
              {adzanEnabled ? 'Aktif' : 'Aktifkan'}
            </button>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Volume2 size={20} className="text-amber-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-sm text-white/80">Pengingat Dzikir</h2>
                <p className="text-xs text-white/35">Notifikasi dzikir pagi & petang</p>
              </div>
            </div>
            <button onClick={toggleNotif}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                notifEnabled ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/[0.04] text-white/35 hover:bg-white/[0.06]'
              }`}
            >
              {notifEnabled ? <Bell size={16} /> : <BellOff size={16} />}
              {notifEnabled ? 'Aktif' : 'Aktifkan'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet-500/[0.04] border border-violet-500/10 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sunrise size={14} className="text-violet-400" />
                <span className="text-sm font-semibold text-white/80">Dzikir Pagi</span>
              </div>
              <p className="text-xs text-white/35">Setelah Subuh ({prayerTimes?.Fajr}) sampai Syuruq ({prayerTimes?.Sunrise})</p>
            </div>
            <div className="rounded-xl bg-orange-500/[0.04] border border-orange-500/10 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sunset size={14} className="text-orange-400" />
                <span className="text-sm font-semibold text-white/80">Dzikir Petang</span>
              </div>
              <p className="text-xs text-white/35">Setelah Ashar ({prayerTimes?.Asr}) sampai Maghrib ({prayerTimes?.Maghrib})</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/doa" className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/[0.04] hover:bg-emerald-500/[0.06] transition-colors group">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white/70">Kumpulan Doa & Dzikir</p>
                  <p className="text-xs text-white/35">Dzikir pagi & petang dari Hisnul Muslim</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/25 group-hover:text-emerald-400 transition-colors" />
            </Link>
            <Link href="/qibla" className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/[0.04] hover:bg-emerald-500/[0.06] transition-colors group">
              <div className="flex items-center gap-3">
                <Compass size={18} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white/70">Arah Kiblat</p>
                  <p className="text-xs text-white/35">Kompas digital berbasis GPS & sensor</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/25 group-hover:text-emerald-400 transition-colors" />
            </Link>
          </div>
        </motion.div>

        <div className="flex justify-center pb-4">
          <button onClick={loadData} className="flex items-center gap-2 text-sm text-white/35 hover:text-emerald-400 transition-colors">
            <RefreshCw size={14} /> Perbarui jadwal
          </button>
        </div>
        <p className="text-center text-[11px] text-white/[0.15] pb-8">Sumber: Aladhan.com • Metode: Kemenag RI</p>
      </div>
    </div>
  );
}
