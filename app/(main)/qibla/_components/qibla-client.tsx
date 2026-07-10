'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Navigation2, RefreshCw, AlertTriangle, CheckCircle2, Info, Loader2, LocateFixed, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { calculateQiblaBearing, calculateDistanceToKaaba, bearingToCompassLabelLong, shortestAngleDiff, normalizeAngle } from '@/lib/qibla';
import { PageHeader } from '@/components/layouts/page-header';

type Coords = { lat: number; lon: number; accuracy?: number };
type SensorStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

function formatCoord(v: number) {
  const abs = Math.abs(v); const deg = Math.floor(abs); const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat); const sec = ((minFloat - min) * 60).toFixed(1);
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
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('idle');
  const [heading, setHeading] = useState<number | null>(null);
  const [headingAccuracy, setHeadingAccuracy] = useState<'absolute' | 'relative' | 'ios' | null>(null);
  const lastHeadingRef = useRef<number | null>(null);

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationError('Perangkat Anda tidak mendukung geolokasi. Silakan gunakan input manual.'); return;
    }
    setLocationLoading(true); setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy }); setLocationLoading(false); toast.success('Lokasi berhasil dideteksi'); },
      (err) => { setLocationLoading(false); let msg = 'Gagal mendapatkan lokasi.';
        if (err.code === err.PERMISSION_DENIED) msg = 'Izin lokasi ditolak. Aktifkan izin lokasi di browser, lalu coba lagi.';
        else if (err.code === err.POSITION_UNAVAILABLE) msg = 'Lokasi tidak tersedia. Pastikan GPS aktif.';
        else if (err.code === err.TIMEOUT) msg = 'Waktu habis saat mengambil lokasi. Coba lagi di area terbuka.';
        setLocationError(msg); toast.error(msg); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => { requestLocation(); }, [requestLocation]);

  useEffect(() => {
    if (!coords) return; let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=10&addressdetails=1`, { headers: { 'Accept-Language': 'id' } });
        if (!resp.ok) return; const data = await resp.json(); if (cancelled) return;
        const addr = data?.address || {};
        const parts = [addr.city || addr.town || addr.village || addr.municipality || addr.county, addr.state, addr.country].filter(Boolean);
        if (parts.length) setLocationLabel(parts.join(', '));
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [coords]);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const anyEvent = event as any; let h: number | null = null; let kind: 'absolute' | 'relative' | 'ios' | null = null;
    if (typeof anyEvent.webkitCompassHeading === 'number' && !Number.isNaN(anyEvent.webkitCompassHeading)) { h = anyEvent.webkitCompassHeading; kind = 'ios'; }
    else if (event.alpha !== null && event.alpha !== undefined) { h = (360 - event.alpha) % 360; kind = event.absolute ? 'absolute' : 'relative'; }
    if (h === null) return;
    if (typeof window !== 'undefined' && typeof window.screen !== 'undefined') {
      const scr: any = window.screen; const angle = typeof scr.orientation?.angle === 'number' ? scr.orientation.angle : 0;
      h = (h + angle) % 360;
    }
    h = normalizeAngle(h);
    const prev = lastHeadingRef.current;
    if (prev !== null) { const diff = ((h - prev + 540) % 360) - 180; h = normalizeAngle(prev + diff * 0.25); }
    lastHeadingRef.current = h; setHeading(h); setHeadingAccuracy(kind);
  }, []);

  const startSensor = useCallback(async () => {
    if (typeof window === 'undefined') return; setSensorStatus('requesting');
    const DOE: any = (window as any).DeviceOrientationEvent;
    if (!DOE) { setSensorStatus('unsupported'); toast.error('Perangkat tidak mendukung sensor orientasi.'); return; }
    if (typeof DOE.requestPermission === 'function') {
      try { const res = await DOE.requestPermission(); if (res !== 'granted') { setSensorStatus('denied'); toast.error('Izin sensor orientasi ditolak.'); return; } }
      catch { setSensorStatus('denied'); toast.error('Gagal meminta izin sensor.'); return; }
    }
    const listener = handleOrientation as EventListener;
    if ('ondeviceorientationabsolute' in window) window.addEventListener('deviceorientationabsolute', listener, true);
    window.addEventListener('deviceorientation', listener, true);
    setSensorStatus('granted'); toast.success('Sensor kompas aktif');
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      const listener = handleOrientation as EventListener;
      if (typeof window !== 'undefined') { window.removeEventListener('deviceorientationabsolute', listener, true); window.removeEventListener('deviceorientation', listener, true); }
    };
  }, [handleOrientation]);

  const qiblaBearing = coords ? calculateQiblaBearing(coords.lat, coords.lon) : null;
  const distanceKm = coords ? calculateDistanceToKaaba(coords.lat, coords.lon) : null;
  const deltaToQibla = heading !== null && qiblaBearing !== null ? shortestAngleDiff(heading, qiblaBearing) : null;
  const isFacingQibla = deltaToQibla !== null && deltaToQibla <= 5;
  const roseRotation = heading !== null ? -heading : 0;
  const kaabaAngle = qiblaBearing ?? 0;

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title="Arah Kiblat" description="Kompas digital berbasis GPS & sensor perangkat. Tentukan arah Ka'bah dari mana saja." backHref="/" />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Location Error */}
        {locationError && !coords && (
          <div className="rounded-2xl bg-red-500/5 border border-red-400/20 p-4 flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-400">Gagal mendeteksi lokasi</p>
              <p className="text-xs text-white/40 mt-1">{locationError}</p>
              <button onClick={requestLocation}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-colors">
                <RefreshCw size={12} />Coba Lagi</button>
            </div>
          </div>
        )}

        {locationLoading && !coords && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 flex items-center justify-center gap-3">
            <Loader2 size={16} className="animate-spin text-emerald-400" />
            <p className="text-sm text-white/40">Mendeteksi lokasi Anda…</p>
          </div>
        )}

        {/* Compass */}
        {coords && qiblaBearing !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 md:p-8">
            {/* Status */}
            <div className="flex items-center justify-center mb-4">
              {heading === null ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 text-xs font-bold">
                  <Info size={12} />Aktifkan sensor kompas</div>
              ) : isFacingQibla ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={13} />Menghadap Kiblat</motion.div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold">
                  <Navigation2 size={12} />Putar {deltaToQibla !== null ? `${Math.round(deltaToQibla)}°` : '—'} menuju kiblat</div>
              )}
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[340px]">
              {/* Top pointer */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-emerald-400 z-20" />

              {/* Compass Rose */}
              <motion.div className="absolute inset-0 rounded-full border border-white/[0.06]"
                animate={{ rotate: roseRotation }} transition={{ type: 'spring', damping: 20, stiffness: 100, mass: 0.5 }}>
                {Array.from({ length: 72 }).map((_, i) => {
                  const isMajor = i % 9 === 0; const angle = i * 5;
                  return (
                    <div key={i} className="absolute left-1/2 top-0 origin-bottom" style={{ transform: `translateX(-50%) rotate(${angle}deg)`, height: '50%' }}>
                      <div className={`${isMajor ? 'w-[2px] h-3 bg-white/50' : 'w-[1px] h-1.5 bg-white/15'} mx-auto`} /></div>
                  );
                })}
                {[{ label: 'N', angle: 0, color: '#EF4444' }, { label: 'E', angle: 90, color: '#FFFFFF' }, { label: 'S', angle: 180, color: '#FFFFFF' }, { label: 'W', angle: 270, color: '#FFFFFF' }].map(c => (
                  <div key={c.label} className="absolute left-1/2 top-0 origin-bottom" style={{ transform: `translateX(-50%) rotate(${c.angle}deg)`, height: '50%' }}>
                    <div className="-translate-y-0 pt-5" style={{ transform: `rotate(${-c.angle}deg)` }}>
                      <span className="font-extrabold text-base" style={{ color: c.color }}>{c.label}</span></div></div>
                ))}
                {[30, 60, 120, 150, 210, 240, 300, 330].map(angle => (
                  <div key={angle} className="absolute left-1/2 top-0 origin-bottom" style={{ transform: `translateX(-50%) rotate(${angle}deg)`, height: '50%' }}>
                    <div className="pt-6" style={{ transform: `rotate(${-angle}deg)` }}>
                      <span className="text-[10px] text-white/25">{angle}</span></div></div>
                ))}
                {/* Ka'bah marker */}
                <div className="absolute left-1/2 top-0 origin-bottom" style={{ transform: `translateX(-50%) rotate(${kaabaAngle}deg)`, height: '50%' }}>
                  <div className="-translate-y-2 flex flex-col items-center" style={{ transform: `rotate(${-kaabaAngle}deg)` }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md ring-2 ring-[#050a14] ${isFacingQibla ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                      <span className="text-base">🕋️</span></div>
                    <div className={`w-[2px] h-16 ${isFacingQibla ? 'bg-emerald-500' : 'bg-amber-400'} mt-1`} /></div>
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#050a14] border border-emerald-400/20 flex items-center justify-center z-10">
                <span className="font-arabic text-emerald-400 text-sm">كعبة</span></div>
            </div>

            {/* Degree info */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <p className="text-[11px] font-extrabold text-white/30 uppercase tracking-tight">Arah Kiblat</p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">{Math.round(qiblaBearing)}°</p>
                <p className="text-[11px] text-white/30 mt-0.5">{bearingToCompassLabelLong(qiblaBearing)} dari utara</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <p className="text-[11px] font-extrabold text-white/30 uppercase tracking-tight">Arah Perangkat</p>
                <p className="text-2xl font-extrabold text-white/80 mt-1">{heading !== null ? `${Math.round(heading)}°` : '—'}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{heading !== null ? bearingToCompassLabelLong(heading) : 'Sensor belum aktif'}</p>
              </div>
            </div>

            {/* Activate sensor */}
            {sensorStatus !== 'granted' ? (
              <div className="mt-5 flex flex-col items-center gap-2">
                <button onClick={startSensor} disabled={sensorStatus === 'requesting'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 disabled:opacity-60 transition-colors shadow-lg shadow-emerald-500/20">
                  {sensorStatus === 'requesting' ? <Loader2 size={15} className="animate-spin" /> : <Smartphone size={15} />}
                  {sensorStatus === 'requesting' ? 'Meminta izin…' : 'Aktifkan Sensor Kompas'}</button>
                {sensorStatus === 'denied' ? <p className="text-[11px] text-red-400">Izin sensor ditolak. Aktifkan di pengaturan browser, lalu muat ulang halaman.</p>
                  : sensorStatus === 'unsupported' ? <p className="text-[11px] text-white/35">Perangkat tidak mendukung sensor. Gunakan derajat kiblat di atas &amp; kompas fisik.</p>
                  : <p className="text-[11px] text-white/35">iOS: perlu izin orientasi. Android Chrome biasanya langsung aktif.</p>}
              </div>
            ) : headingAccuracy === 'relative' ? (
              <div className="mt-4 rounded-xl bg-amber-500/5 border border-amber-400/15 p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-200/70 leading-relaxed">Sensor perangkat tidak absolut terhadap utara. Kalibrasi dengan menggerakkan perangkat membentuk angka <strong>8</strong>.</p>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Location & Distance */}
        {coords && distanceKm !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                  <MapPin size={15} className="text-emerald-400" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold text-white/30 uppercase tracking-tight">Lokasi Anda</p>
                  <p className="text-sm font-bold text-white/80 mt-0.5 truncate">{locationLabel || 'Terdeteksi'}</p>
                  <p className="text-[11px] text-white/30 mt-1">{formatCoord(coords.lat)} {coords.lat >= 0 ? 'LU' : 'LS'} · {formatCoord(coords.lon)} {coords.lon >= 0 ? 'BT' : 'BB'}</p>
                  {coords.accuracy && <p className="text-[11px] text-white/25">Akurasi: ±{Math.round(coords.accuracy)} m</p>}</div>
                <button onClick={requestLocation} disabled={locationLoading} className="p-2 rounded-lg hover:bg-white/[0.04] text-white/35 transition-colors">
                  {locationLoading ? <Loader2 size={13} className="animate-spin" /> : <LocateFixed size={13} />}</button>
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                  <Navigation2 size={15} className="text-amber-400" /></div>
                <div>
                  <p className="text-[11px] font-extrabold text-white/30 uppercase tracking-tight">Jarak ke Ka'bah</p>
                  <p className="text-sm font-bold text-white/80 mt-0.5">{formatDistance(distanceKm)}</p>
                  <p className="text-[11px] text-white/30 mt-1">Garis lurus (great-circle) ke Masjidil Haram, Makkah.</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guide */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
              <Info size={15} className="text-emerald-400" /></div>
            <div>
              <h3 className="font-extrabold text-sm text-white/90">Petunjuk Penggunaan</h3>
              <ol className="mt-2 space-y-1.5 text-sm text-white/45 list-decimal list-inside leading-relaxed">
                <li>Izinkan akses <strong className="text-white/70">lokasi</strong> agar arah kiblat dihitung dari posisi Anda.</li>
                <li>Ketuk <strong className="text-white/70">Aktifkan Sensor Kompas</strong> untuk mengaktifkan kompas perangkat.</li>
                <li>Kalibrasi kompas dengan menggerakkan perangkat membentuk angka <strong className="text-white/70">8</strong> di udara.</li>
                <li>Putar perangkat hingga ikon <span>🕋️</span> Ka'bah mencapai penanda atas. Maka perangkat Anda menghadap kiblat.</li>
                <li>Jauhi benda magnetik (logam besar, speaker, casing bermagnet) agar pembacaan akurat.</li>
              </ol>
              <p className="mt-3 text-[11px] text-white/25 leading-relaxed">
                Catatan: Akurasi kompas web bergantung pada sensor perangkat. Untuk akurasi optimal, gunakan di area terbuka, hindari sumber magnet, dan kalibrasi berkala. Nilai derajat kiblat yang ditampilkan dihitung dengan rumus bearing lingkaran besar (great-circle) dari lokasi Anda ke Ka'bah (21,4225°LU, 39,8262°BT).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
