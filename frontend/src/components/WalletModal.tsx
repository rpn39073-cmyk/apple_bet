import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  type: 'deposit' | 'withdraw' | null;
  onClose: () => void;
  onSubmit: (amount: number, type: 'deposit' | 'withdraw') => void;
}

export default function WalletModal({ isOpen, type, onClose, onSubmit }: WalletModalProps) {
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (!isNaN(val) && val > 0 && type) {
      onSubmit(val, type);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && type && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[90%] max-w-[400px] glass-card"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 relative overflow-hidden">
               <div className={`absolute top-0 left-0 w-full h-1 ${type === 'deposit' ? 'bg-emerald' : 'bg-red-500'}`}></div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                {type === 'deposit' ? <ArrowDownRight className="text-emerald" size={20} /> : <ArrowUpRight className="text-red-500" size={20} />}
                {type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
              </h2>
              <button type="button" onClick={onClose} className="text-metallic hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <label className="block text-sm font-semibold text-metallic mb-2 uppercase tracking-wider">Amount (₹)</label>
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl font-mono">₹</span>
                <input
                  type="number"
                  placeholder="0"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-obsidian border border-white/10 rounded-xl py-4 pl-10 pr-4 text-2xl text-white font-mono focus:outline-none focus:border-emerald transition-colors"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[500, 1000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!amount || parseInt(amount) <= 0}
                className={`w-full py-3.5 rounded-xl font-bold tracking-wide transition-opacity disabled:opacity-50 ${
                  type === 'deposit' ? 'bg-emerald text-obsidian shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:bg-[#00e63a]' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-400'
                }`}
              >
                Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
