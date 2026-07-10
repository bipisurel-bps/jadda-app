'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Book, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layouts/page-header';
import { Input } from '@/components/ui/input';

interface RawJuzContent {
  number: number;
  content: string;
}

interface JuzDisplay {
  number: number;
  title: string;
  details: string[];
  estimatedSurahs: string;
}

// Parse raw juz content text into structured display
function parseJuzContent(raw: RawJuzContent): JuzDisplay {
  const lines = raw.content.split('\n').filter((l) => l.trim());
  const details: string[] = [];
  let title = `Juz ${raw.number}`;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Extract title from first meaningful line
    if (title === `Juz ${raw.number}` && trimmed.length > 10) {
      // Clean up the title
      const cleaned = trimmed
        .replace(/^\(\d+\)\s*/, '')
        .replace(/\u00a0/g, ' ')
        .trim();
      if (cleaned.length > 15) {
        title = cleaned.length > 80 ? cleaned.substring(0, 80) + '…' : cleaned;
      }
    }

    // Collect key points — lines starting with numbers or significant content
    if (trimmed.match(/^\(\d+\)/) || trimmed.length > 25) {
      const cleaned = trimmed
        .replace(/^\(\d+\)\s*/, '')
        .replace(/\u00a0/g, ' ')
        .trim();
      if (cleaned.length > 6) {
        details.push(cleaned.length > 120 ? cleaned.substring(0, 120) + '…' : cleaned);
      }
    }
  }

  // Surah estimation per juz
  const surahRanges: Record<number, string> = {
    1: 'Al-Fatihah – Al-Baqarah', 2: 'Al-Baqarah', 3: 'Al-Baqarah – Ali Imran',
    4: 'Ali Imran – An-Nisa', 5: 'An-Nisa', 6: 'An-Nisa – Al-Maidah',
    7: 'Al-Maidah – Al-An\'am', 8: 'Al-An\'am – Al-A\'raf', 9: 'Al-A\'raf – Al-Anfal',
    10: 'Al-Anfal – At-Taubah', 11: 'At-Taubah – Hud', 12: 'Hud – Yusuf',
    13: 'Yusuf – Ar-Ra\'d', 14: 'Ar-Ra\'d – Al-Hijr', 15: 'Al-Hijr – Al-Isra',
    16: 'Al-Kahf – Taha', 17: 'Al-Anbiya – Al-Hajj', 18: 'Al-Mu\'minun – Al-Furqan',
    19: 'Al-Furqan – An-Naml', 20: 'An-Naml – Al-Ankabut', 21: 'Al-Ankabut – Al-Ahzab',
    22: 'Al-Ahzab – Yasin', 23: 'Yasin – Az-Zumar', 24: 'Az-Zumar – Fussilat',
    25: 'Fussilat – Al-Ahqaf', 26: 'Al-Ahqaf – Qaf', 27: 'Az-Zariyat – Al-Hadid',
    28: 'Al-Mujadilah – At-Tahrim', 29: 'Al-Mulk – Al-Mursalat', 30: 'An-Naba – An-Nas',
  };

  return {
    number: raw.number,
    title,
    details: details.slice(0, 5),
    estimatedSurahs: surahRanges[raw.number] ?? '',
  };
}

export default function JuzClient() {
  const [contents, setContents] = useState<JuzDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  React.useEffect(() => {
    fetch('/data/juz-content.json')
      .then((r) => {
        if (!r.ok) throw new Error('Gagal memuat');
        return r.json();
      })
      .then((data) => {
        const parsed = (data.juz as RawJuzContent[]).map(parseJuzContent);
        setContents(parsed);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return contents;
    const q = search.toLowerCase();
    return contents.filter(
      (j) =>
        String(j.number).includes(q) ||
        j.title.toLowerCase().includes(q) ||
        j.details.some((d) => d.toLowerCase().includes(q)) ||
        j.estimatedSurahs.toLowerCase().includes(q)
    );
  }, [contents, search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm text-muted-foreground">Memuat kandungan juz...</p>
      </div>
    );
  }

  if (error && contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-sm text-muted-foreground">Gagal memuat data: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Kandungan Juz Al-Quran" description="30 Juz • Ringkasan Tema Pokok" />

      {/* Search */}
      <div className="mt-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 pr-8 h-10 bg-card border-border text-sm"
            placeholder="Cari juz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Juz list */}
      <div className="pb-8">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-10">Juz tidak ditemukan</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((juz, i) => (
              <motion.div
                key={juz.number}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  href={`/quran?tab=juz&search=${juz.number}`}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-base font-bold text-white">{juz.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">{juz.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {juz.estimatedSurahs}
                    </p>
                    {juz.details.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {juz.details.slice(0, 3).map((d, di) => (
                          <li key={di} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <span className="mt-1 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                            <span className="line-clamp-1">{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground flex-shrink-0 mt-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
