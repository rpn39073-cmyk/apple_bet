'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import io from 'socket.io-client';

interface Odds {
  matchId: string;
  teamA: number;
  teamB: number;
  draw: number;
  liveTimestamp: number;
}

const socket = io('http://localhost:3001');

export default function LiveOddsCard() {
  const [odds, setOdds] = useState<Odds | null>(null);
  const [prevOdds, setPrevOdds] = useState<Odds | null>(null);

  useEffect(() => {
    socket.on('oddsUpdate', (newOdds: Odds) => {
      setPrevOdds(odds);
      setOdds(newOdds);
    });

    return () => {
      socket.off('oddsUpdate');
    };
  }, [odds]);

  if (!odds) return (
    <div className="glass-card p-6 w-full animate-pulse border border-white/5 bg-white/5 h-48 flex items-center justify-center">
      <p className="text-apple-dark-gray text-sm">Loading Real-time Odds...</p>
    </div>
  );

  const renderTrend = (current: number, previous?: number) => {
    if (!previous || current === previous) return <Minus size={14} className="text-apple-dark-gray ml-2" />;
    if (current > previous) return <TrendingUp size={14} className="text-green-500 ml-2" />;
    return <TrendingDown size={14} className="text-red-500 ml-2" />;
  };

  return (
    <div className="glass-card p-6 w-full animate-slide-up hover:border-white/20 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 text-xs font-semibold bg-red-500/20 text-red-500 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
            LIVE
          </span>
          <h3 className="text-lg font-semibold text-white tracking-tight">Champions League</h3>
        </div>
        <span className="text-xs text-apple-dark-gray font-mono">
          {new Date(odds.liveTimestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 bg-white/10 rounded-full mb-3 flex items-center justify-center border border-white/5">
            <span className="text-xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          </div>
          <span className="text-sm font-medium text-apple-silver">Man City</span>
        </div>
        
        <div className="flex flex-col items-center flex-1 px-4">
          <div className="text-3xl font-bold text-white mb-1 font-sf">2 - 1</div>
          <span className="text-xs font-medium text-apple-dark-gray">78:42</span>
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 bg-white/10 rounded-full mb-3 flex items-center justify-center border border-white/5">
            <span className="text-xl">🇪🇸</span>
          </div>
          <span className="text-sm font-medium text-apple-silver">Real Madrid</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
          <span className="text-xs text-apple-dark-gray mb-1">1</span>
          <div className="flex items-center text-white font-semibold group-hover:text-apple-blue transition-colors">
            {odds.teamA} {renderTrend(odds.teamA, prevOdds?.teamA)}
          </div>
        </button>
        <button className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
          <span className="text-xs text-apple-dark-gray mb-1">X</span>
          <div className="flex items-center text-white font-semibold group-hover:text-apple-blue transition-colors">
            {odds.draw} {renderTrend(odds.draw, prevOdds?.draw)}
          </div>
        </button>
        <button className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
          <span className="text-xs text-apple-dark-gray mb-1">2</span>
          <div className="flex items-center text-white font-semibold group-hover:text-apple-blue transition-colors">
            {odds.teamB} {renderTrend(odds.teamB, prevOdds?.teamB)}
          </div>
        </button>
      </div>
    </div>
  );
}
