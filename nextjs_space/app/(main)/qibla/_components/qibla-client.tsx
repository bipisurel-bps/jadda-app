'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Navigation2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  LocateFixed,
  Smartphone,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  bearingToCompassLabelLong,
  shortestAngleDiff,
  normalizeAngle,
} from '@/lib/qibla';

type Coords = { lat: number; lon: number; accuracy?: number };

type SensorStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

function formatCoord(v: number) {
  const abs = Math.abs(v);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(1);
  return `${deg}° ${min}′ ${sec}″`;
}

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString('id-ID')} km`;
}

export default function QiblaClient() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  // Sensor
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('idle');
  const [heading, setHeading] = useState<number | null>(null);
  const [headingAccuracy, setHeadingAccuracy] = useState<'absolute' | 'relative' | 'ios' | null>(null);

  const lastHeadingRef = useRef<number | null>(null);

  // --- Geolocation ---
  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationError('Perangkat Anda tidak mendukung geolokasi. Silakan gunakan input manual.');
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocationLoading(false);
        toast.success('Lokasi berhasil dideteksi');
      },
      (err) => {
        setLocationLoading(false);
        let msg = 'Gagal mendapatkan lokasi.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Izin lokasi ditolak. Aktifkan izin lokasi di browser, lalu coba lagi.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Lokasi tidak tersedia. Pastikan GPS aktif.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Waktu habis saat mengambil lokasi. Coba lagi di area terbuka.';
        }
        setLocationError(msg);
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    // Coba ambil lokasi otomatis saat pertama load
    requestLocation();
  }, [requestLocation]);

  // Reverse geocode ringan (opsional, pakai Nominatim tanpa kunci)
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=10&addressdetails=1`,
          { headers: { 'Accept-Language': 'id' } }
        );
        if (!resp.ok) return;
        const data = await resp.json();
        if (cancelled) return;
        const addr = data?.address || {};
        const parts = [
          addr.city || addr.town || addr.village || addr.municipality || addr.county,
          addr.state,
          addr.country,
        ].filter(Boolean);
        if (parts.length) setLocationLabel(parts.join(', '));
      } catch {
        /* abaikan error reverse geocode */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [coords]);

  // --- Sensor Orientasi ---
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // iOS Safari (non-standard, true north)
    const anyEvent = event as any;
    let h: number | null = null;
    let kind: 'absolute' | 'relative' | 'ios' | null = null;

    if (typeof anyEvent.webkitCompassHeading === 'number' && !Number.isNaN(anyEvent.webkitCompassHeading)) {
      h = anyEvent.webkitCompassHeading;
      kind = 'ios';
    } else if (event.alpha !== null && event.alpha !== undefined) {
      // alpha: rotasi terhadap sumbu z, 0..360, counter-clockwise dari utara
      const alpha = event.alpha;
      h = (360 - alpha) % 360;
      kind = event.absolute ? 'absolute' : 'relative';
    }
    if (h === null) return;

    // Koreksi untuk rotasi layar (landscape)
    if (typeof window !== 'undefined' && typeof window.screen !== 'undefined') {
      const scr: any = window.screen;
      const angle = typeof scr.orientation?.angle === 'number' ? scr.orientation.angle : 0;
      h = (h + angle) % 360;
    }
    h = normalizeAngle(h);

    // Low-pass filter sederhana untuk mengurangi jitter
    const prev = lastHeadingRef.current;
    if (prev !== null) {
      const diff = ((h - prev + 540) % 360) - 180;
      h = normalizeAngle(prev + diff * 0.25);
    }
    lastHeadingRef.current = h;
    setHeading(h);
    setHeadingAccuracy(kind);
  }, []);

  const startSensor = useCallback(async () => {
    if (typeof window === 'undefined') return;
    setSensorStatus('requesting');

    const DOE: any = (window as any).DeviceOrientationEvent;
    if (!DOE) {
      setSensorStatus('unsupported');
      toast.error('Perangkat tidak mendukung sensor orientasi.');
      return;
    }

    // iOS 13+: perlu permission eksplisit
    if (typeof DOE.requestPermission === 'function') {
      try {
        const res = await DOE.requestPermission();
        if (res !== 'granted') {
          setSensorStatus('denied');
          toast.error('Izin sensor orientasi ditolak.');
          return;
        }
      } catch {
        setSensorStatus('denied');
        toast.error('Gagal meminta izin sensor.');
        return;
      }
    }

    // Prefer deviceorientationabsolute (Android Chrome)
    const absEvent = 'ondeviceorientationabsolute' in window;
    const listener = handleOrientation as EventListener;
    if (absEvent) {
      window.addEventListener('deviceorientationabsolute', listener, true);
    }
    window.addEventListener('deviceorientation', listener, true);
    setSensorStatus('granted');
    toast.success('Sensor kompas aktif');
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      const listener = handleOrientation as EventListener;
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientationabsolute', listener, true);
        window.removeEventListener('deviceorientation', listener, true);
      }
    };
  }, [handleOrientation]);

  // Turunan: bearing dan jarak
  const qiblaBearing = coords ? calculateQiblaBearing(coords.lat, coords.lon) : null;
  const distanceKm = coords ? calculateDistanceToKaaba(coords.lat, coords.lon) : null;

  // Sudut antara arah perangkat dengan kiblat
  const deltaToQibla =
    heading !== null && qiblaBearing !== null ? shortestAngleDiff(heading, qiblaBearing) : null;
  const isFacingQibla = deltaToQibla !== null && deltaToQibla <= 5;

  // Rotasi rose kompas (-heading) & posisi marker Ka'bah (qiblaBearing)
  const roseRotation = heading !== null ? -heading : 0;
  const kaabaAngle = qiblaBearing ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-5 md:p-7 text-primary-foreground"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Compass size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">Arah Kiblat</h1>
            <p className="text-sm md:text-base opacity-90 mt-1">
              Kompas digital berbasis GPS &amp; sensor perangkat. Tentukan arah Ka&apos;bah dari mana saja.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Status lokasi */}
      {locationError && !coords ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">Gagal mendeteksi lokasi</p>
            <p className="text-xs text-muted-foreground mt-1">{locationError}</p>
            <button
              onClick={requestLocation}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90"
            >
              <RefreshCw size={12} />
              Coba Lagi
            </button>
          </div>
        </div>
      ) : null}

      {locationLoading && !coords ? (
        <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center gap-3">
          <Loader2 size={18} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Mendeteksi lokasi Anda…</p>
        </div>
      ) : null}

      {/* Kompas */}
      {coords && qiblaBearing !== null ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl bg-card border border-border shadow-sm p-5 md:p-8"
        >
          {/* Status aligned */}
          <div className="flex items-center justify-center mb-4">
            {heading === null ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                <Info size={12} /> Aktifkan sensor kompas untuk navigasi
              </div>
            ) : isFacingQibla ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold"
              >
                <CheckCircle2 size={14} /> Menghadap Kiblat
              </motion.div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent-foreground text-xs font-medium">
                <Navigation2 size={12} />
                Putar {deltaToQibla !== null ? `${Math.round(deltaToQibla)}°` : '—'} menuju kiblat
              </div>
            )}
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[340px]">
            {/* Penanda atas (tetap, "arah perangkat") */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-primary z-20" aria-hidden="true" />

            {/* Compass Rose (rotates -heading) */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-border bg-background shadow-inner"
              animate={{ rotate: roseRotation }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, mass: 0.5 }}
            >
              {/* Tick marks */}
              {Array.from({ length: 72 }).map((_, i) => {
                const isMajor = i % 9 === 0;
                const angle = i * 5;
                return (
                  <div
                    key={i}
                    className="absolute left-1/2 top-0 origin-bottom"
                    style={{
                      transform: `translateX(-50%) rotate(${angle}deg)`,
                      height: '50%',
                    }}
                  >
                    <div
                      className={`${
                        isMajor ? 'w-[2px] h-3 bg-foreground/60' : 'w-[1px] h-1.5 bg-muted-foreground/40'
                      } mx-auto`}
                    />
                  </div>
                );
              })}

              {/* N / E / S / W labels */}
              {[
                { label: 'N', angle: 0, color: 'text-red-500 dark:text-red-400' },
                { label: 'E', angle: 90, color: 'text-foreground' },
                { label: 'S', angle: 180, color: 'text-foreground' },
                { label: 'W', angle: 270, color: 'text-foreground' },
              ].map((c) => (
                <div
                  key={c.label}
                  className="absolute left-1/2 top-0 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${c.angle}deg)`, height: '50%' }}
                >
                  <div
                    className="-translate-y-0 pt-5"
                    style={{ transform: `rotate(${-c.angle}deg)` }}
                  >
                    <span className={`font-display font-bold text-base ${c.color}`}>{c.label}</span>
                  </div>
                </div>
              ))}

              {/* Degree numbers 30, 60, 120, ... */}
              {[30, 60, 120, 150, 210, 240, 300, 330].map((angle) => (
                <div
                  key={angle}
                  className="absolute left-1/2 top-0 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${angle}deg)`, height: '50%' }}
                >
                  <div className="pt-6" style={{ transform: `rotate(${-angle}deg)` }}>
                    <span className="text-[10px] text-muted-foreground">{angle}</span>
                  </div>
                </div>
              ))}

              {/* Ka'bah marker at qiblaBearing */}
              <div
                className="absolute left-1/2 top-0 origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${kaabaAngle}deg)`, height: '50%' }}
              >
                <div
                  className="-translate-y-2 flex flex-col items-center"
                  style={{ transform: `rotate(${-kaabaAngle}deg)` }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md ring-2 ring-background ${
                      isFacingQibla ? 'bg-primary' : 'bg-accent'
                    }`}
                    aria-label="Ka'bah"
                  >
                    <span className="text-base" role="img" aria-hidden="true">
                      🕋️
                    </span>
                  </div>
                  <div
                    className={`w-[2px] h-20 ${
                      isFacingQibla ? 'bg-primary' : 'bg-accent'
                    } mt-1`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </motion.div>

            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
              <span className="font-arabic text-primary text-sm leading-none">كعبة</span>
            </div>
          </div>

          {/* Info derajat */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/60 p-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                Arah Kiblat
              </p>
              <p className="font-display text-2xl font-bold text-primary mt-1">
                {Math.round(qiblaBearing)}°
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {bearingToCompassLabelLong(qiblaBearing)} dari utara
              </p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                Arah Perangkat
              </p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">
                {heading !== null ? `${Math.round(heading)}°` : '—'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {heading !== null ? bearingToCompassLabelLong(heading) : 'Sensor belum aktif'}
              </p>
            </div>
          </div>

          {/* Aktifkan sensor */}
          {sensorStatus !== 'granted' ? (
            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                onClick={startSensor}
                disabled={sensorStatus === 'requesting'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {sensorStatus === 'requesting' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Smartphone size={16} />
                )}
                {sensorStatus === 'requesting' ? 'Meminta izin…' : 'Aktifkan Sensor Kompas'}
              </button>
              {sensorStatus === 'denied' ? (
                <p className="text-[11px] text-destructive">
                  Izin sensor ditolak. Aktifkan di pengaturan browser, lalu muat ulang halaman.
                </p>
              ) : sensorStatus === 'unsupported' ? (
                <p className="text-[11px] text-muted-foreground">
                  Perangkat tidak mendukung sensor. Gunakan derajat kiblat di atas &amp; kompas fisik.
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  iOS: perlu izin orientasi. Android Chrome biasanya langsung aktif.
                </p>
              )}
            </div>
          ) : headingAccuracy === 'relative' ? (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                Sensor perangkat tidak absolut terhadap utara. Kalibrasi dengan menggerakkan perangkat
                membentuk angka <strong>8</strong>, lalu cocokkan arah N pada kompas dengan arah utara sebenarnya.
              </p>
            </div>
          ) : null}
        </motion.div>
      ) : null}

      {/* Info lokasi & jarak */}
      {coords && distanceKm !== null ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="rounded-xl bg-card border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                  Lokasi Anda
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate">
                  {locationLabel || 'Terdeteksi'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {formatCoord(coords.lat)} {coords.lat >= 0 ? 'LU' : 'LS'} ·{' '}
                  {formatCoord(coords.lon)} {coords.lon >= 0 ? 'BT' : 'BB'}
                </p>
                {coords.accuracy ? (
                  <p className="text-[11px] text-muted-foreground">
                    Akurasi: ±{Math.round(coords.accuracy)} m
                  </p>
                ) : null}
              </div>
              <button
                onClick={requestLocation}
                disabled={locationLoading}
                aria-label="Perbarui lokasi"
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
              >
                {locationLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LocateFixed size={14} />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Navigation2 size={16} className="text-accent-foreground" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                  Jarak ke Ka&apos;bah
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {formatDistance(distanceKm)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Garis lurus (great-circle) ke Masjidil Haram, Makkah.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Panduan & disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-xl bg-card border border-border p-4 md:p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-sm text-foreground">Petunjuk Penggunaan</h3>
            <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
              <li>Izinkan akses <strong>lokasi</strong> agar arah kiblat dihitung dari posisi Anda.</li>
              <li>Ketuk <strong>Aktifkan Sensor Kompas</strong> untuk mengaktifkan kompas perangkat.</li>
              <li>
                Kalibrasi kompas dengan menggerakkan perangkat membentuk angka <strong>8</strong> di udara.
              </li>
              <li>
                Putar perangkat hingga ikon <span aria-hidden="true">🕋️</span> Ka&apos;bah mencapai penanda atas.
                Maka perangkat Anda menghadap kiblat.
              </li>
              <li>
                Jauhi benda magnetik (logam besar, speaker, casing bermagnet) agar pembacaan akurat.
              </li>
            </ol>
            <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
              Catatan: Akurasi kompas web bergantung pada sensor perangkat. Untuk akurasi optimal, gunakan di area
              terbuka, hindari sumber magnet, dan kalibrasi berkala. Nilai derajat kiblat yang ditampilkan dihitung
              dengan rumus bearing lingkaran besar (great-circle) dari lokasi Anda ke Ka&apos;bah
              (21,4225°LU, 39,8262°BT).
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
