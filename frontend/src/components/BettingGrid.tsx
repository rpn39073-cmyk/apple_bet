'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BetCard from './BetCard';

interface BettingGridProps {
  isLocked: boolean;
  onPlaceBet?: (label: string, amount: number, potentialWin: number) => void;
}

const OUTCOMES = [
  { label: '0/1 Run', multiplier: '1.5' },
  { label: '2 Runs', multiplier: '2.0' },
  { label: '3 Runs', multiplier: '3.0' },
  { label: '4 Runs', multiplier: '10.0' },
  { label: '6 Runs', multiplier: '12.0' },
  { label: 'Wide', multiplier: '10.0' },
  { label: 'Wicket', multiplier: '15.0' },
  { label: 'No Ball', multiplier: '20.0' },
];

export default function BettingGrid({ isLocked, onPlaceBet }: BettingGridProps) {
  const [selectedBet, setSelectedBet] = useState<{label: string, multiplier: string} | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');

  const handlePlaceBet = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(betAmount);
    if (!isNaN(amount) && amount > 0 && selectedBet && onPlaceBet) {
      const potentialWin = amount * parseFloat(selectedBet.multiplier);
      onPlaceBet(selectedBet.label, amount, potentialWin);
      setSelectedBet(null);
      setBetAmount('');
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Next Ball Prediction</h2>
          <p className="text-metallic text-sm mt-1">Tap an outcome to place your bet.</p>
        </div>
        
        {isLocked && (
          <div className="animate-pulse bg-red-500/20 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full border border-red-500/30">
            MARKET LOCKED
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {OUTCOMES.map((outcome, idx) => (
          <BetCard
            key={idx}
            label={outcome.label}
            multiplier={outcome.multiplier}
            isLocked={isLocked}
            onSelect={() => {
               if(!isLocked) {
                  setSelectedBet(outcome);
                  setBetAmount('');
               }
            }}
          />
        ))}
      </div>

      {/* Bet Modal Overlay */}
      <AnimatePresence>
        {selectedBet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm"
              onClick={() => setSelectedBet(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[90%] max-w-[400px] glass-card shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald"></div>
                <h2 className="text-lg font-bold">Place Your Bet</h2>
                <button type="button" onClick={() => setSelectedBet(null)} className="text-metallic hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handlePlaceBet} className="p-6">
                <div className="flex justify-between items-center mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-metallic mb-1">Your Prediction</span>
                      <span className="text-base font-bold text-white tracking-wider">{selectedBet.label}</span>
                   </div>
                   <div className="text-lg bg-emerald/20 border border-emerald/30 text-emerald px-3 py-1 rounded-lg font-bold">{selectedBet.multiplier}x</div>
                </div>

                <label className="block text-sm font-semibold text-metallic mb-2 uppercase tracking-wider">Stake Amount (₹)</label>
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl font-mono">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    min="1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full bg-obsidian border border-white/10 rounded-xl py-4 pl-10 pr-4 text-2xl text-white font-mono focus:outline-none focus:border-emerald transition-colors"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[100, 500, 1000, 5000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBetAmount(val.toString())}
                      className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-6 border-t border-white/5 pt-4">
                   <span className="text-sm font-semibold text-metallic tracking-wide">Potential Win:</span>
                   <span className="text-xl font-mono font-bold text-emerald">
                      ₹{betAmount && !isNaN(parseInt(betAmount)) ? (parseInt(betAmount) * parseFloat(selectedBet.multiplier)).toLocaleString() : '0'}
                   </span>
                </div>

                <button
                  type="submit"
                  disabled={!betAmount || parseInt(betAmount) <= 0}
                  className="w-full py-3.5 rounded-xl bg-emerald text-obsidian font-bold text-lg tracking-wide transition-opacity disabled:opacity-50 shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:bg-[#00e63a]"
                >
                  Confirm Bet
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
