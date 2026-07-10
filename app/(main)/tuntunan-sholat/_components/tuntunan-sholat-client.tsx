'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PersonStanding, ScrollText } from 'lucide-react';
import { PageHeader } from '@/components/layouts/page-header';
import TataCaraClient from '@/app/(main)/sholat/tata-cara/_components/tata-cara-client';
import MaknaBacaanClient from '@/app/(main)/sholat/makna-bacaan/_components/makna-bacaan-client';

const TABS = [
  { id: 'tata-cara', label: 'Tata Cara Sholat', icon: PersonStanding, accent: '#059669' },
  { id: 'makna-bacaan', label: 'Makna Bacaan', icon: ScrollText, accent: '#D97706' },
] as const;

export default function TuntunanSholatClient() {
  const [activeTab, setActiveTab] = useState<string>('tata-cara');

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader
        title="Tuntunan Sholat Nabi ﷺ"
        description="Tata cara sholat sesuai Sunnah & makna setiap bacaan"
        backHref="/"
      />

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-5">
        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border"
                style={{
                  backgroundColor: isActive ? `${tab.accent}18` : 'transparent',
                  borderColor: isActive ? `${tab.accent}40` : 'rgba(255,255,255,0.06)',
                  color: isActive ? tab.accent : 'rgba(255,255,255,0.4)',
                }}>
                <Icon size={15} style={{ color: isActive ? tab.accent : 'rgba(255,255,255,0.35)' }} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}>
          {activeTab === 'tata-cara' ? <TataCaraClient /> : <MaknaBacaanClient />}
        </motion.div>
      </div>
    </div>
  );
}
