'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, Info, Moon, Sun, Mail, Coins, ScrollText, MapPin, Clock, Landmark, MoreHorizontal, X, Compass, Book } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '2.4';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/quran', label: 'Quran', icon: Book },
  { href: '/juz', label: 'Juz', icon: BookOpen },
  { href: '/sholat', label: 'Sholat', icon: Clock },
  { href: '/qibla', label: 'Kiblat', icon: Compass },
  { href: '/doa', label: 'Doa', icon: BookOpen },
  { href: '/hadits', label: 'Hadits', icon: ScrollText },
  { href: '/waris', label: 'Waris', icon: Calculator },
  { href: '/zakat', label: 'Zakat', icon: Coins },
  { href: '/umroh', label: 'Umrah', icon: MapPin },
  { href: '/haji', label: 'Haji', icon: Landmark },
  { href: '/keilmuan', label: 'Keilmuan', icon: BookOpen },
  { href: '/tentang', label: 'Tentang', icon: Info },
];

const mobileMainNav = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/quran', label: 'Quran', icon: Book },
  { href: '/sholat', label: 'Sholat', icon: Clock },
  { href: '/doa', label: 'Doa', icon: BookOpen },
];

const mobileMoreNav = [
  { href: '/juz', label: 'Juz', icon: BookOpen },
  { href: '/qibla', label: 'Kiblat', icon: Compass },
  { href: '/hadits', label: 'Hadits', icon: ScrollText },
  { href: '/sirah-alquran', label: 'Sirah Quran', icon: Book },
  { href: '/waris', label: 'Waris', icon: Calculator },
  { href: '/zakat', label: 'Zakat', icon: Coins },
  { href: '/umroh', label: 'Umrah', icon: MapPin },
  { href: '/haji', label: 'Haji', icon: Landmark },
  { href: '/settings', label: 'Pengaturan', icon: Info },
  { href: '/tentang', label: 'Tentang', icon: Info },
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
    <div className={`min-h-screen ${isHome ? 'bg-transparent' : 'bg-background islamic-pattern'}`}>
      {/* ── Desktop Header ── */}
      <header
        className={`hidden md:block sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${
          isHome ? 'bg-[#060d14]/70 border-white/[0.06]' : 'bg-background/80 border-border'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-jadda.svg" alt="Jadda" width={36} height={36} className="rounded-lg" />
            <span className={`font-display font-bold text-lg tracking-tight ${isHome ? 'text-white/85' : 'text-foreground'}`}>
              Jadda
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems?.map?.((item: any) => {
              const Icon = item?.icon;
              const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith?.(item?.href));
              return (
                <Link
                  key={item?.href}
                  href={item?.href ?? '/'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isHome
                        ? 'bg-white/10 text-white shadow-md'
                        : 'bg-primary text-primary-foreground shadow-md'
                      : isHome
                        ? 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {item?.label}
                </Link>
              );
            }) ?? []}
            {mounted && (
              <button
                onClick={toggleTheme}
                className={`ml-2 p-2 rounded-lg transition-colors ${
                  isHome ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header
        className={`md:hidden sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${
          isHome ? 'bg-[#060d14]/70 border-white/[0.06]' : 'bg-background/80 border-border'
        }`}
      >
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-jadda.png" alt="Jadda" width={28} height={28} className="rounded-md" />
            <span className={`font-display font-bold text-base tracking-tight ${isHome ? 'text-white/85' : 'text-foreground'}`}>
              Jadda
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isHome ? 'bg-white/[0.06] text-white/60' : 'bg-muted text-foreground'
                }`}
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
        <footer className="border-t border-border bg-card/50 pb-24 md:pb-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
            <div className="text-center mb-6">
              <p className="text-xl md:text-2xl font-arabic text-foreground leading-relaxed mb-2" dir="rtl">
                جَزَاكُمُ اللَّهُ خَيْرًا
              </p>
              <p className="text-sm font-semibold text-primary">Jazakumullahu Khairan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Terima kasih telah berkunjung. Semoga bermanfaat untuk kehidupan dunia dan akhirat.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 mb-6">
              <a
                href="mailto:bipi.surel@gmail.com?subject=Masukan%20Aplikasi%20Jadda"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Mail size={16} />
                Hubungi Admin / Berikan Masukan
              </a>
            </div>
            <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                &copy; 2026 Jadda — Mohon doanya agar kami bisa melanjutkan proses development aplikasi ini 🙏🏽
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                v{APP_VERSION}
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t safe-area-bottom transition-colors duration-500 ${
          isHome ? 'bg-[#060d14]/95 border-white/[0.06]' : 'bg-background/95 border-border'
        }`}
      >
        <div className="grid grid-cols-5 items-center h-[60px] px-1">
          {mobileMainNav?.map?.((item: any) => {
            const Icon = item?.icon;
            const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith?.(item?.href));
            return (
              <Link
                key={item?.href}
                href={item?.href ?? '/'}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all relative ${
                  isActive
                    ? isHome ? 'text-emerald-400' : 'text-primary'
                    : isHome ? 'text-white/30 hover:text-white/60' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <span className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full ${isHome ? 'bg-emerald-400' : 'bg-primary'}`} />
                )}
                {Icon && <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />}
                <span className={`text-[9px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item?.label}</span>
              </Link>
            );
          }) ?? []}
          {/* More button */}
          {(() => {
            const isMoreActive = mobileMoreNav.some(
              (item: any) => pathname === item.href || (item.href !== '/' && pathname?.startsWith?.(item.href))
            );
            return (
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all relative ${
                  isMoreActive || mobileMenuOpen
                    ? isHome ? 'text-emerald-400' : 'text-primary'
                    : isHome ? 'text-white/30 hover:text-white/60' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isMoreActive && !mobileMenuOpen && (
                  <span className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full ${isHome ? 'bg-emerald-400' : 'bg-primary'}`} />
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
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`md:hidden fixed bottom-[60px] left-0 right-0 z-40 rounded-t-2xl border-t shadow-xl ${
                isHome ? 'bg-[#0f1a24] border-white/[0.06]' : 'bg-background border-border'
              }`}
            >
              <div className="p-4 space-y-1">
                <div className={`w-10 h-1 rounded-full mx-auto mb-3 ${isHome ? 'bg-white/[0.08]' : 'bg-muted'}`} />
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
                          ? isHome ? 'bg-white/[0.06] text-emerald-400' : 'bg-primary/10 text-primary'
                          : isHome ? 'text-white/70 hover:bg-white/[0.04]' : 'text-foreground hover:bg-muted'
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
