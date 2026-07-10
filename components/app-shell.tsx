'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, Info, Moon, Sun, Mail, Coins, ScrollText, MapPin, Clock, Landmark, MoreHorizontal, X, Compass, Book, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '2.5';

const desktopNav = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/quran', label: 'Quran', icon: Book },
  { href: '/juz', label: 'Juz', icon: BookOpen },
  { href: '/sholat', label: 'Sholat', icon: Clock },
  { href: '/doa', label: 'Doa', icon: BookOpen },
  { href: '/hadits', label: 'Hadits', icon: ScrollText },
  { href: '/dzikir', label: 'Dzikir', icon: Moon },
  { href: '/tentang', label: 'Tentang', icon: Info },
];

const mobileMainNav = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/quran', label: 'Quran', icon: Book },
  { href: '/sholat', label: 'Sholat', icon: Clock },
  { href: '/doa', label: 'Doa', icon: BookOpen },
];

const mobileMoreNav = [
  { href: '/dzikir', label: 'Dzikir', icon: Moon },
  { href: '/juz', label: 'Juz', icon: BookOpen },
  { href: '/qibla', label: 'Kiblat', icon: Compass },
  { href: '/hadits', label: 'Hadits', icon: ScrollText },
  { href: '/sirah-alquran', label: 'Rihlah Quran', icon: Book },
  { href: '/waris', label: 'Waris', icon: Calculator },
  { href: '/zakat', label: 'Zakat', icon: Coins },
  { href: '/umroh', label: 'Umrah', icon: MapPin },
  { href: '/haji', label: 'Haji', icon: Landmark },
  { href: '/settings', label: 'Pengaturan', icon: Info },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-[#050a14]">
      {/* ── Desktop Header ── */}
      <header className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-[#050a14]/85 border-b border-emerald-500/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-jadda.png" alt="Jadda" width={36} height={36} className="rounded-lg" />
            <span className="font-display font-bold text-lg tracking-tight text-white/85">
              Jadda
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {desktopNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith?.(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-white/45 hover:bg-white/[0.04] hover:text-white/75'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-[#050a14]/85 border-b border-emerald-500/[0.06]">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-jadda.png" alt="Jadda" width={28} height={28} className="rounded-md" />
            <span className="font-display font-bold text-base tracking-tight text-white/85">
              Jadda
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/[0.04] text-white/50"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className={`max-w-[1200px] mx-auto ${isHome ? 'px-0' : 'px-4 md:px-6 pb-8 pt-4 md:pt-6'}`}>
        {children}
      </main>

      {/* ── Footer ── */}
      {!isHome && (
        <footer className="border-t border-emerald-500/[0.06] bg-[#050a14] pb-24 md:pb-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
            <div className="text-center mb-5">
              <p className="text-xl md:text-2xl font-arabic text-white/80 leading-relaxed mb-2" dir="rtl">
                جَزَاكُمُ اللَّهُ خَيْرًا
              </p>
              <p className="text-[13px] font-bold text-emerald-400/80">Jazakumullahu Khairan</p>
              <p className="text-[12px] text-white/30 mt-1">
                Terima kasih telah berkunjung. Semoga bermanfaat untuk dunia dan akhirat.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 mb-5">
              <a
                href="mailto:bipi.surel@gmail.com?subject=Masukan%20Aplikasi%20Jadda"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-[13px] font-semibold hover:bg-emerald-500/20 transition-colors border border-emerald-500/10"
              >
                <Mail size={16} />
                Hubungi Admin / Berikan Masukan
              </a>
            </div>
            <div className="border-t border-white/[0.04] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-[11px] text-white/25">
                &copy; 2026 Jadda — v{APP_VERSION}
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#050a14]/95 border-t border-emerald-500/[0.06] safe-area-bottom">
        <div className="grid grid-cols-5 items-center h-[60px] px-1">
          {mobileMainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith?.(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all relative ${
                  isActive ? 'text-emerald-400' : 'text-white/25 hover:text-white/50'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-emerald-400" />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[9px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}
          {/* More button */}
          {(() => {
            const isMoreActive = mobileMoreNav.some(
              (item) => pathname === item.href || (item.href !== '/' && pathname?.startsWith?.(item.href))
            );
            return (
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all relative ${
                  isMoreActive || mobileMenuOpen ? 'text-emerald-400' : 'text-white/25 hover:text-white/50'
                }`}
              >
                {(isMoreActive && !mobileMenuOpen) && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-emerald-400" />
                )}
                {mobileMenuOpen ? <X size={18} strokeWidth={2} /> : <MoreHorizontal size={18} strokeWidth={isMoreActive ? 2.5 : 1.5} />}
                <span className={`text-[9px] leading-tight ${isMoreActive ? 'font-bold' : 'font-medium'}`}>Lainnya</span>
              </button>
            );
          })()}
        </div>
      </nav>

      {/* ── Mobile More Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed bottom-[60px] left-0 right-0 z-40 rounded-t-2xl border-t border-emerald-500/[0.06] bg-[#0f1a24] shadow-xl"
            >
              <div className="p-4 space-y-1">
                <div className="w-10 h-1 rounded-full mx-auto mb-3 bg-white/[0.06]" />
                {mobileMoreNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith?.(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-white/65 hover:bg-white/[0.03] hover:text-white/85'
                      }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                      <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
