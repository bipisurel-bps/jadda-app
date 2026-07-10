'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Globe, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layouts/page-header';
import Link from 'next/link';

const APP_VERSION = '3.0';

export default function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const settingsSections = [
    {
      title: 'Tampilan',
      icon: <Monitor size={16} />,
      items: [
        {
          label: 'Tema Gelap',
          description: 'Mode gelap sepanjang waktu',
          type: 'toggle',
          key: 'dark',
          value: theme === 'dark',
          onChange: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
        },
      ],
    },
    {
      title: 'Aplikasi',
      icon: <Info size={16} />,
      items: [
        {
          label: 'Versi Aplikasi',
          description: `v${APP_VERSION}`,
          type: 'info',
          key: 'version',
        },
        {
          label: 'Sumber Data Quran',
          description: 'quran-json v3 (CDN)',
          type: 'info',
          key: 'quran-source',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader title="Pengaturan" description="Preferensi & Informasi Aplikasi" />

      <div className="mt-4 space-y-4 pb-8">
        {settingsSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-white/[0.02]">
              <span className="text-white/35">{section.icon}</span>
              <h3 className="text-[13px] font-extrabold text-white/80 uppercase tracking-tight">{section.title}</h3>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-white/80">{item.label}</p>
                    <p className="text-xs text-white/35 mt-0.5">{item.description}</p>
                  </div>
                  {item.type === 'toggle' && 'onChange' in item && (
                    <button
                      onClick={item.onChange}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        item.value ? 'bg-emerald-500' : 'bg-white/[0.08]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                          item.value ? 'translate-x-[23px]' : 'translate-x-[3px]'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-white/[0.02]">
            <span className="text-white/35"><Globe size={16} /></span>
            <h3 className="text-[13px] font-extrabold text-white/80 uppercase tracking-tight">Tautan</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            <Link href="/tentang" className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
              <span className="text-sm font-medium text-white/70">Tentang Jadda</span>
              <ExternalLink size={14} className="text-white/25" />
            </Link>
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-6 pb-8"
        >
          <p className="font-arabic text-lg text-white/[0.10] mb-3" dir="rtl">
            جَزَاكُمُ اللَّهُ خَيْرًا
          </p>
          <p className="text-xs text-white/[0.15]">
            Jadda &copy; {new Date().getFullYear()} — Jalan Aplikasi Dakwah Digital
          </p>
        </motion.div>
      </div>
    </div>
  );
}
