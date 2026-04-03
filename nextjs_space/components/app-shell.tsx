'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, Info, Moon, Sun, Mail, Coins, ScrollText } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '1.1';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/doa', label: 'Doa', icon: BookOpen },
  { href: '/hadits', label: 'Hadits', icon: ScrollText },
  { href: '/waris', label: 'Waris', icon: Calculator },
  { href: '/zakat', label: 'Zakat', icon: Coins },
  { href: '/tentang', label: 'Tentang', icon: Info },
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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-arabic">جـ</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">Jariyah</span>
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
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs font-arabic">جـ</span>
            </div>
            <span className="font-display font-bold text-base tracking-tight text-foreground">Jariyah</span>
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
              href="mailto:bipi.surel@gmail.com?subject=Masukan%20Aplikasi%20Jariyah"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Mail size={16} />
              Hubungi Admin / Berikan Masukan
            </a>
            <p className="text-xs text-muted-foreground">
              bipi.surel@gmail.com
            </p>
          </div>

          {/* Divider & Version */}
          <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Jariyah — Aplikasi Islam Lengkap
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
              v{APP_VERSION}
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems?.map?.((item: any) => {
            const Icon = item?.icon;
            const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith?.(item?.href));
            return (
              <Link
                key={item?.href}
                href={item?.href ?? '/'}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {Icon && <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />}
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item?.label}</span>
              </Link>
            );
          }) ?? []}
        </div>
      </nav>
    </div>
  );
}
