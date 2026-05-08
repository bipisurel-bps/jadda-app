'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Library } from 'lucide-react';
import HaditsArbainClient from './hadits-arbain-client';
import RiyadhusClient from './riyadhus-client';

const tabs = [
  { id: 'arbain', label: 'Arbain An-Nawawi', icon: BookOpen, desc: '42 hadits pilihan' },
  { id: 'riyadhus', label: 'Riyadhus Shalihin', icon: Library, desc: '372 bab' },
] as const;

type TabId = typeof tabs[number]['id'];

export default function HaditsTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('arbain');

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl text-foreground">Koleksi Hadits</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kumpulan hadits-hadits shahih pilihan untuk panduan hidup sehari-hari
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 gap-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-primary/10 border-primary/30 shadow-sm'
                  : 'bg-card border-border/50 hover:bg-muted/30'
              }`}
            >
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                isActive ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
              }`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}>{tab.label}</p>
                <p className="text-[11px] text-muted-foreground">{tab.desc}</p>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-xl border-2 border-primary/40"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'arbain' ? <HaditsArbainClient /> : <RiyadhusClient />}
    </div>
  );
}
