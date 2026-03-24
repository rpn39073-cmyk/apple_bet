'use client';

import React from 'react';
import { Wallet, History, TrendingUp, Ticket, Clock } from 'lucide-react';

export interface BetRecord {
  id: string;
  outcome: string;
  amount: number;
  win: number;
  winAmount?: number;
  status: 'won' | 'lost' | 'pending';
  time: string;
}

interface UserDashboardProps {
  balance: number;
  earnings: number;
  history: BetRecord[];
  onOpenWallet: (type: 'deposit' | 'withdraw') => void;
}

export default function UserDashboard({ balance, earnings, history, onOpenWallet }: UserDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Profile & Earnings Summary */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald/40 to-blue-500/40 p-0.5 relative">
            <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center border border-white/10">
              <span className="text-xl font-bold">R</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald rounded-full border-2 border-obsidian"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">@RahulM</h3>
            <p className="text-sm text-metallic flex items-center gap-1 mt-0.5">
               Online • VIP Platinum
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-obsidian rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-metallic mb-1.5">
                <Wallet size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Balance</span>
              </div>
              <span className="text-2xl font-bold font-mono tracking-tighter">₹{balance.toLocaleString()}</span>
            </div>
            {/* Wallet Action Buttons */}
            <div className="flex gap-2 mt-4">
               <button onClick={() => onOpenWallet('deposit')} className="flex-1 py-1.5 rounded-md bg-emerald/20 text-emerald text-[10px] font-bold uppercase tracking-wider hover:bg-emerald/30 transition-colors">Deposit</button>
               <button onClick={() => onOpenWallet('withdraw')} className="flex-1 py-1.5 rounded-md bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/20 transition-colors">Withdraw</button>
            </div>
          </div>

          <div className="bg-emerald/10 rounded-2xl p-4 border border-emerald/20">
            <div className="flex items-center gap-2 text-emerald mb-1.5">
              <TrendingUp size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Earnings</span>
            </div>
            <span className="text-2xl font-bold font-mono text-emerald tracking-tighter">
              {earnings >= 0 ? '+' : '-'}₹{Math.abs(earnings).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bet History */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <History size={18} className="text-metallic" />
            Recent History
          </h3>
          <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded-full text-metallic">{history.length} Bets</span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {history.length === 0 && (
             <div className="text-center py-6 text-sm text-metallic">No historical data available.</div>
          )}
          {history.map((bet) => (
            <div key={bet.id} className="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  bet.status === 'won' ? 'bg-emerald/10 text-emerald' : 
                  bet.status === 'lost' ? 'bg-red-500/10 text-red-500' : 
                  'bg-blue-500/10 text-blue-500 animate-pulse'
                }`}>
                  {bet.status === 'pending' ? <Clock size={18} /> : <Ticket size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{bet.outcome}</p>
                  <p className="text-xs text-metallic">{bet.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-medium">₹{bet.amount.toLocaleString()}</p>
                <div className="mt-0.5">
                   {bet.status === 'won' && <span className="text-xs font-mono font-bold text-emerald">+₹{bet.win.toLocaleString()}</span>}
                   {bet.status === 'lost' && <span className="text-xs font-mono font-bold text-metallic/50">-₹{bet.amount.toLocaleString()}</span>}
                   {bet.status === 'pending' && <span className="text-xs font-mono font-bold text-blue-400">PENDING</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
