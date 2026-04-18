/**
 * Utility perhitungan Arah Kiblat (Qibla).
 * Titik acuan: Ka'bah (Masjidil Haram), Makkah al-Mukarramah.
 * Sumber koordinat: 21°25′21.2″N 39°49′34.2″E (Wikipedia, konsisten dengan sebagian besar aplikasi kiblat).
 */

export const KAABA = {
  latitude: 21.4225,
  longitude: 39.8262,
} as const;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Menghitung arah kiblat (initial great-circle bearing) dari titik asal
 * (lat, lon) ke Ka'bah, dalam derajat 0..360 dari utara sejati (clockwise).
 */
export function calculateQiblaBearing(lat: number, lon: number): number {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA.latitude);
  const deltaLambda = toRad(KAABA.longitude - lon);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearing = (toDeg(theta) + 360) % 360;
  return bearing;
}

/**
 * Jarak great-circle (km) dari titik (lat, lon) ke Ka'bah menggunakan formula Haversine.
 */
export function calculateDistanceToKaaba(lat: number, lon: number): number {
  const R = 6371; // radius bumi, km
  const dLat = toRad(KAABA.latitude - lat);
  const dLon = toRad(KAABA.longitude - lon);
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Mengubah bearing (derajat dari utara) menjadi label mata angin kasar.
 */
export function bearingToCompassLabel(bearing: number): string {
  const dirs = [
    'U',
    'TL',
    'T',
    'Tg',
    'S',
    'BD',
    'B',
    'BL',
  ];
  const idx = Math.round(((bearing % 360) / 45)) % 8;
  return dirs[idx] ?? 'U';
}

/**
 * Nama arah mata angin panjang (Indonesia).
 */
export function bearingToCompassLabelLong(bearing: number): string {
  const b = ((bearing % 360) + 360) % 360;
  if (b < 22.5 || b >= 337.5) return 'Utara';
  if (b < 67.5) return 'Timur Laut';
  if (b < 112.5) return 'Timur';
  if (b < 157.5) return 'Tenggara';
  if (b < 202.5) return 'Selatan';
  if (b < 247.5) return 'Barat Daya';
  if (b < 292.5) return 'Barat';
  return 'Barat Laut';
}

/**
 * Menghitung selisih sudut terpendek antara dua bearing (derajat), 0..180.
 * Berguna untuk menentukan apakah pengguna sudah menghadap kiblat.
 */
export function shortestAngleDiff(a: number, b: number): number {
  const diff = Math.abs(((a - b + 540) % 360) - 180);
  return diff;
}

/**
 * Normalisasi sudut ke rentang 0..360.
 */
export function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}
