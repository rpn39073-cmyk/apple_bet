'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BetCardProps {
  label: string;
  multiplier: string;
  isLocked?: boolean;
  onSelect?: () => void;
}

export default function BetCard({ label, multiplier, isLocked = false, onSelect }: BetCardProps) {
  return (
    <motion.div
      whileTap={!isLocked ? { scale: 0.94 } : {}}
      className={`glass-card relative cursor-pointer border-t border-white/10 transition-all duration-300 flex items-center justify-center p-4 min-h-[100px] ${
        isLocked ? 'grayscale opacity-50 pointer-events-none blur-[2px]' : 'hover:border-emerald hover:bg-emerald/5 hover:shadow-[0_0_15px_rgba(0,255,65,0.15)]'
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <span className="text-xs font-bold text-metallic uppercase tracking-widest">{label}</span>
        <span className="text-2xl text-white font-bold tracking-tight">{multiplier}x</span>
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="bg-obsidian/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest text-xs font-bold text-metallic flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
              LOCKED
            </div>
        </div>
      )}
    </motion.div>
  );
}
