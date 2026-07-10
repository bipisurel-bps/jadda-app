'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PersonStanding, ScrollText } from 'lucide-react';
import TataCaraClient from '@/app/(main)/sholat/tata-cara/_components/tata-cara-client';
import MaknaBacaanClient from '@/app/(main)/sholat/makna-bacaan/_components/makna-bacaan-client';

const TABS = [
  { id: 'tata-cara', label: 'Tata Cara Sholat', icon: PersonStanding },
  { id: 'makna-bacaan', label: 'Makna Bacaan', icon: ScrollText },
] as const;

export default function TuntunanSholatClient() {
  const [activeTab, setActiveTab] = useState<string>('tata-cara');

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          Tuntunan Sholat Nabi ﷺ
        </h1>
        <p className="text-sm text-white/35 mt-1">
          Tata cara sholat sesuai Sunnah & makna setiap bacaan
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-white/[0.04] text-white/35 hover:bg-white/80 hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === 'tata-cara' ? <TataCaraClient /> : <MaknaBacaanClient />}
      </motion.div>
    </div>
  );
}
