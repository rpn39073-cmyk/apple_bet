'use client';

import React from 'react';

export default function LiveScoreHeader() {
  return (
    <div className="sticky top-0 z-50 w-full glass-nav px-4 py-3 pb-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Match Info */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-metallic tracking-wider uppercase mb-1">
            IPL 2024 • Final
          </span>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">MI vs CSK</h1>
        </div>

        {/* Live Indicator & Score */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
             <span className="text-xs text-metallic mb-1">Current Score</span>
             <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter">184/5 <span className="text-sm text-metallic ml-1 text-opacity-80 font-sf">(18.4)</span></span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
