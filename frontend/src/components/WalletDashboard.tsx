'use client';

import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Bitcoin } from 'lucide-react';

export default function WalletDashboard() {
  const [balance, setBalance] = useState<number>(4250.75);
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      const res = await fetch('http://localhost:3001/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 100, currency: 'USDT' })
      });
      const data = await res.json();
      if(data.success) {
        setTimeout(() => {
          setBalance(prev => prev + 100);
          setIsDepositing(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setIsDepositing(false);
    }
  };

  return (
    <div className="glass-card p-6 w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center">
          <Wallet className="mr-2 text-apple-dark-gray" size={20} />
          Crypto Wallet
        </h2>
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <RefreshCw size={16} className="text-apple-silver" />
        </button>
      </div>

      <div className="mb-8">
        <p className="text-sm text-apple-dark-gray mb-1">Total Balance</p>
        <div className="flex items-end space-x-2">
          <span className="text-4xl font-bold text-white tracking-tight font-sf">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="text-sm font-medium text-green-500 mb-1">+2.4%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={handleDeposit}
          disabled={isDepositing}
          className="flex items-center justify-center space-x-2 bg-white text-apple-black py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-70"
        >
          {isDepositing ? <RefreshCw size={18} className="animate-spin" /> : <ArrowDownLeft size={18} />}
          <span>Deposit</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors">
          <ArrowUpRight size={18} />
          <span>Withdraw</span>
        </button>
      </div>

      <div className="pt-6 border-t border-white/10">
        <h3 className="text-sm font-medium text-apple-dark-gray mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <ArrowDownLeft size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Deposit USDT</p>
                <p className="text-xs text-apple-dark-gray">Today, 14:32</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-500">+$500.00</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <Bitcoin size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Bet Placed (BTC)</p>
                <p className="text-xs text-apple-dark-gray">Yesterday, 09:15</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-white">-$50.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
