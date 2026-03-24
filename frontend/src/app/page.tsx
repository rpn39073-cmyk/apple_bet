'use client';

import React, { useState, useEffect } from 'react';
import LiveScoreHeader from '@/components/LiveScoreHeader';
import BettingGrid from '@/components/BettingGrid';
import UserDashboard, { BetRecord } from '@/components/UserDashboard';
import RecentWinsTicker from '@/components/RecentWinsTicker';
import ToastNotification from '@/components/ToastNotification';
import WalletModal from '@/components/WalletModal';

export default function Home() {
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState<string | null>(null);

  // User State
  const [balance, setBalance] = useState(45200);
  const [earnings, setEarnings] = useState(12450);
  const [history, setHistory] = useState<BetRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Wallet Modal State
  const [walletAction, setWalletAction] = useState<'deposit' | 'withdraw' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          const outcomes = ['0/1 Run', '2 Runs', '3 Runs', '4 Runs', '6 Runs', 'Wide', 'Wicket', 'No Ball'];
          const randomResult = outcomes[Math.floor(Math.random() * outcomes.length)];
          setResult(randomResult);
          return 30;
        }
        if (prev <= 11) {
          setIsLocked(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Process bets when result changes
  useEffect(() => {
    if (!result) return;
    
    let totalWin = 0;
    let totalLost = 0;
    let anyPendingProcessed = false;

    setHistory(prev => {
      return prev.map(bet => {
        if (bet.status === 'pending') {
          anyPendingProcessed = true;
          if (bet.outcome === result) {
             const winAmt = bet.winAmount || bet.amount; 
             totalWin += winAmt;
             return { ...bet, status: 'won', win: winAmt, time: 'Just now' };
          } else {
             totalLost += bet.amount;
             return { ...bet, status: 'lost', win: 0, time: 'Just now' };
          }
        }
        return bet;
      });
    });

    if (anyPendingProcessed) {
      setBalance(b => b + totalWin);
      setEarnings(e => e + (totalWin - totalLost));
      setToastMessage(`Result: ${result}! ${totalWin > 0 ? `You won ₹${totalWin.toLocaleString()}!` : 'Better luck next time.'}`);
    } else {
      setToastMessage(`Result: ${result}`);
    }

    const t = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(t);
  }, [result]);

  const handlePlaceBet = (label: string, amount: number, potentialWin: number) => {
    if (amount <= 0) {
       setToastMessage("Please enter a valid amount!");
       setTimeout(() => setToastMessage(null), 3000);
       return;
    }
    if (balance < amount) {
       setToastMessage("Insufficient balance!");
       setTimeout(() => setToastMessage(null), 3000);
       return;
    }
    
    setBalance(b => b - amount);
    setHistory(prev => [
      { 
         id: Date.now().toString() + Math.random().toString(), 
         outcome: label, 
         amount, 
         win: 0, 
         winAmount: potentialWin, 
         status: 'pending', 
         time: 'Just now' 
      },
      ...prev
    ]);
    
    setToastMessage(`Bet placed! Potential Win: ₹${potentialWin.toLocaleString()}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleWalletSubmit = (amount: number, type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
      setBalance(b => b + amount);
      setToastMessage(`Deposited ₹${amount.toLocaleString()} successfully.`);
    } else {
      if (balance < amount) {
        setToastMessage("Insufficient balance!");
      } else {
        setBalance(b => b - amount);
        setToastMessage(`Withdrew ₹${amount.toLocaleString()} successfully.`);
      }
    }
    setWalletAction(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="min-h-[100dvh] pb-32 relative overflow-x-hidden bg-obsidian">
      <LiveScoreHeader />
      <ToastNotification message={toastMessage} />
      
      <WalletModal 
        isOpen={walletAction !== null} 
        type={walletAction} 
        onClose={() => setWalletAction(null)} 
        onSubmit={handleWalletSubmit} 
      />
      
      {/* FinTech-style Timeline Indicator */}
      <div className="w-full h-1 bg-white/5 relative z-40">
         <div 
            className={`h-full transition-all duration-1000 ease-linear ${isLocked ? 'bg-red-500' : 'bg-emerald'}`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
         ></div>
      </div>

      {/* Main Content Area - Mobile Optimized */}
      <div className="max-w-[430px] mx-auto px-4 pt-6 space-y-8 animate-fade-in relative z-10 w-full mb-12">
         
         <BettingGrid isLocked={isLocked} onPlaceBet={handlePlaceBet} />

         <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

         <UserDashboard balance={balance} earnings={earnings} history={history} onOpenWallet={setWalletAction} />

      </div>

      <RecentWinsTicker />
    </main>
  );
}
