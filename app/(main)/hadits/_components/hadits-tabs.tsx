'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Heart } from 'lucide-react';
import { PageHeader } from '@/components/layouts/page-header';
import HaditsArbainClient from './hadits-arbain-client';
import RiyadhusClient from './riyadhus-client';
import KisahPilihanClient from './kisah-pilihan-client';

const tabs = [
  { id: 'arbain', label: 'Arbain', desc: '42 hadits pilihan', icon: BookOpen },
  { id: 'sahabat', label: '7 Sahabat', desc: 'Hadits dari 7 sahabat', icon: Users },
  { id: 'kisah', label: 'Kisah Pilihan', desc: 'Kisah & hadits pilihan', icon: Heart },
] as const;

type TabId = typeof tabs[number]['id'];

export default function HaditsTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('arbain');

  return (
    <div className="min-h-screen bg-[#050a14]">
      <PageHeader
        title="Koleksi Hadits"
        description="Hadits-hadits shahih pilihan"
      />

      <div className="mt-4 space-y-4">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex gap-1.5 bg-white/[0.03] p-1 rounded-xl"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'arbain' ? (
          <HaditsArbainClient />
        ) : activeTab === 'sahabat' ? (
          <RiyadhusClient />
        ) : (
          <KisahPilihanClient />
        )}
      </div>
    </div>
  );
}
