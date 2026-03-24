'use client';

import React from 'react';

const RECENT_WINS = [
  "User @Rahul just won ₹15,000 on a Wicket (15x)!",
  "User @Sneha bet ₹500 on a 4 (10x) and won ₹5,000!",
  "User @Vikram just won ₹12,000 on a 6 (12x)!",
  "User @Amit just locked in a 1.5x prediction.",
  "User @Priya just won ₹20,000 on a No Ball (20x) Jackpot!"
];

export default function RecentWinsTicker() {
  return (
    <div className="fixed bottom-0 w-full glass-nav border-t border-white/5 overflow-hidden py-2.5 z-50">
      <div className="flex whitespace-nowrap animate-[scroll_25s_linear_infinite]">
        {[...RECENT_WINS, ...RECENT_WINS].map((win, idx) => (
          <div key={idx} className="flex items-center mx-8">
            <div className="w-2 h-2 rounded-full bg-emerald mr-3 shadow-[0_0_8px_rgba(0,255,65,0.8)]"></div>
            <span className="text-sm text-metallic font-medium tracking-wide">{win}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
