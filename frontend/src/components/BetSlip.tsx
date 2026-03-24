'use client';

import { useState, useEffect } from 'react';
import { Trash2, TrendingUp, X } from 'lucide-react';

interface BetSelection {
  id: string;
  match: string;
  selection: string;
  odds: number;
}

export default function BetSlip() {
  const [isOpen, setIsOpen] = useState(true);
  const [wager, setWager] = useState<string>('10');
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [isPlacing, setIsPlacing] = useState(false);

  // Listen for 'add-bet' events gracefully across components
  useEffect(() => {
    const handleAddBet = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newSel = customEvent.detail as BetSelection;
      if (!selections.find(s => s.id === newSel.id)) {
        setSelections(prev => [...prev, newSel]);
        setIsOpen(true); // Auto-open slip
      }
    };
    window.addEventListener('add-bet', handleAddBet);
    return () => window.removeEventListener('add-bet', handleAddBet);
  }, [selections]);

  const totalOdds = selections.reduce((acc, curr) => acc * curr.odds, 1);
  const potentialPayout = (parseFloat(wager || '0') * totalOdds).toFixed(2);

  const removeSelection = (id: string) => {
    setSelections(selections.filter(s => s.id !== id));
  };
  
  const handlePlaceBet = () => {
      setIsPlacing(true);
      setTimeout(() => {
          setSelections([]);
          setIsPlacing(false);
          setIsOpen(false);
          alert('Bet Placed Successfully!');
      }, 1000);
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-50 apple-btn apple-btn-accent shadow-apple-glow flex items-center space-x-2"
    >
      <span className="bg-white text-apple-blue font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
        {selections.length}
      </span>
      <span>Bet Slip</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-80 glass-card bg-apple-midnight z-50 animate-slide-up shadow-2xl border-t md:border border-white/10 flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <div className="flex items-center space-x-2">
          <span className="bg-apple-blue text-white font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {selections.length}
          </span>
          <h3 className="font-semibold text-white tracking-tight">Bet Slip</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-apple-dark-gray hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Selections */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {selections.length === 0 ? (
          <div className="text-center py-8 text-apple-dark-gray text-sm">
            Your bet slip is empty. <br/> Click on odds to add selections.
          </div>
        ) : (
          selections.map(sel => (
            <div key={sel.id} className="p-3 bg-white/5 rounded-xl border border-white/5 relative group">
              <button 
                onClick={() => removeSelection(sel.id)}
                className="absolute top-2 right-2 text-apple-dark-gray hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
              <div className="text-xs text-apple-dark-gray mb-1">{sel.match}</div>
              <div className="flex justify-between items-center">
                <div className="font-medium text-white text-sm">{sel.selection}</div>
                <div className="font-semibold text-apple-blue">{sel.odds.toFixed(2)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Wager */}
      {selections.length > 0 && (
        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-apple-silver">
              {selections.length > 1 ? 'Parlay Odds' : 'Single Odds'}
            </span>
            <span className="font-bold text-white flex items-center">
              <TrendingUp size={14} className="mr-1 text-green-500"/>
              {totalOdds.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-dark-gray">$</span>
              <input 
                type="number" 
                value={wager}
                onChange={(e) => setWager(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-white focus:outline-none focus:border-apple-blue transition-colors"
                placeholder="Wager Amount"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-apple-dark-gray">Payout</span>
            <span className="font-bold text-green-500">${potentialPayout}</span>
          </div>

          <button 
            onClick={handlePlaceBet}
            disabled={isPlacing}
            className="w-full apple-btn apple-btn-accent shadow-apple-glow py-3 text-sm font-semibold disabled:opacity-50">
            {isPlacing ? 'Processing...' : 'Place Bet'}
          </button>
        </div>
      )}
    </div>
  );
}
