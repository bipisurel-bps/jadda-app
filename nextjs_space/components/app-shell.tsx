'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, Info, Moon, Sun, Mail, Coins, ScrollText, MapPin, Clock, Landmark, MoreHorizontal, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '2.1';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/sholat', label: 'Sholat', icon: Clock },
  { href: '/doa', label: 'Doa', icon: BookOpen },
  { href: '/hadits', label: 'Hadits', icon: ScrollText },
  { href: '/waris', label: 'Waris', icon: Calculator },
  { href: '/zakat', label: 'Zakat', icon: Coins },
  { href: '/umroh', label: 'Umrah', icon: MapPin },
  { href: '/haji', label: 'Haji', icon: Landmark },
  { href: '/tentang', label: 'Tentang', icon: Info },
];

// Mobile: show these 5 in bottom bar, rest in "More" menu
const mobileMainNav = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/sholat', label: 'Sholat', icon: Clock },
  { href: '/doa', label: 'Doa', icon: BookOpen },
  { href: '/hadits', label: 'Hadits', icon: ScrollText },
];

const mobileMoreNav = [
  { href: '/waris', label: 'Kalkulator Waris', icon: Calculator },
  { href: '/zakat', label: 'Kalkulator Zakat', icon: Coins },
  { href: '/umroh', label: 'Panduan Umrah', icon: MapPin },
  { href: '/haji', label: 'Panduan Haji', icon: Landmark },
  { href: '/tentang', label: 'Tentang Aplikasi', icon: Info },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-background islamic-pattern">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-jadda.png" alt="Jadda - Aplikasi Islami Ringkas" width={36} height={36} className="rounded-lg" />
            <span className="font-display font-bold text-lg tracking-tight text-foreground">Jadda</span>
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
                      ? 'bg-primary text-primary-foreground shadow-md'
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
                className="ml-2 p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs font-arabic">جدّ</span>
            </span>
            <span className="font-display font-bold text-base tracking-tight text-foreground">Jadda</span>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-muted text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 pb-8 pt-4 md:pt-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 pb-24 md:pb-8">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
          {/* Jazakallah Khairan */}
          <div className="text-center mb-6">
            <p className="text-xl md:text-2xl font-arabic text-foreground leading-relaxed mb-2" dir="rtl">
              جَزَاكُمُ اللَّهُ خَيْرًا
            </p>
            <p className="text-sm font-semibold text-primary">Jazakumullahu Khairan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Terima kasih telah berkunjung. Semoga bermanfaat untuk kehidupan dunia dan akhirat.
            </p>
          </div>

          {/* Contact Admin */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <a
              href="mailto:bipi.surel@gmail.com?subject=Masukan%20Aplikasi%20Jadda"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Mail size={16} />
              Hubungi Admin / Berikan Masukan
            </a>
          </div>

          {/* Divider & Version */}
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="grid grid-cols-5 items-center h-[60px] px-1">
          {mobileMainNav?.map?.((item: any) => {
            const Icon = item?.icon;
            const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith?.(item?.href));
            return (
              <Link
                key={item?.href}
                href={item?.href ?? '/'}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all relative ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-primary" />}
                {Icon && <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />}
                <span className={`text-[9px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item?.label}</span>
              </Link>
            );
          }) ?? []}
          {/* More button */}
          {(() => {
            const isMoreActive = mobileMoreNav.some(item => pathname === item.href || (item.href !== '/' && pathname?.startsWith?.(item.href)));
            return (
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all relative ${
                  isMoreActive || mobileMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isMoreActive && !mobileMenuOpen && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-primary" />}
                {mobileMenuOpen ? <X size={18} strokeWidth={2} /> : <MoreHorizontal size={18} strokeWidth={isMoreActive ? 2.5 : 1.5} />}
                <span className={`text-[9px] leading-tight ${isMoreActive ? 'font-bold' : 'font-medium'}`}>Lainnya</span>
              </button>
            );
          })()}
        </div>
      </nav>

      {/* Mobile More Menu Overlay */}
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
              className="md:hidden fixed bottom-[60px] left-0 right-0 z-40 bg-background rounded-t-2xl border-t border-border shadow-xl"
            >
              <div className="p-4 space-y-1">
                <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-3" />
                {mobileMoreNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith?.(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
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
