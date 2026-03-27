'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import LiveScoreHeader from '@/components/LiveScoreHeader';
import BettingGrid from '@/components/BettingGrid';
import UserDashboard, { BetRecord } from '@/components/UserDashboard';
import RecentWinsTicker from '@/components/RecentWinsTicker';
import ToastNotification from '@/components/ToastNotification';
import WalletModal from '@/components/WalletModal';
import { Cog } from 'lucide-react';

// Use environment variable for backend URL in production
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const socket = io(SOCKET_URL);

export default function Home() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Escape Plan / Emergency States
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [killSwitch, setKillSwitch] = useState(false);

  // User Balance & History
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [history, setHistory] = useState<BetRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [walletAction, setWalletAction] = useState<'deposit' | 'withdraw' | null>(null);

  useEffect(() => {
    // 1. Auth Check (The Wall)
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      router.push('/auth');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    setBalance(1500); // Initial sync balance

    // 2. Escape Triggers (Shift+K / Shift+M)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'K') {
        setKillSwitch(true);
        localStorage.setItem('OFFLINE_PROTOCOL', 'TRUE');
      }
      if (e.shiftKey && e.key === 'M') setIsMaintenance(m => !m);
    };

    if (localStorage.getItem('OFFLINE_PROTOCOL') === 'TRUE') setKillSwitch(true);
    window.addEventListener('keydown', handleKeyDown);

    // 3. Socket Sync
    socket.on('gameTimer', (data) => setTimeLeft(data.timeLeft));
    socket.on('gameStatus', (data) => setIsLocked(data.isLocked));
    socket.on('gameResult', (data) => {
      setResult(data.result);
      setTimeout(() => setResult(null), 5000);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      socket.off('gameTimer');
      socket.off('gameStatus');
      socket.off('gameResult');
    };
  }, [router]);

  // Process bets on result change
  useEffect(() => {
    if (!result) return;
    
    let totalWin = 0;
    let totalLost = 0;
    let anyProcessed = false;

    setHistory(prev => prev.map(bet => {
      if (bet.status === 'pending') {
        anyProcessed = true;
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
    }));

    if (anyProcessed) {
      setBalance(b => b + totalWin);
      setEarnings(e => e + (totalWin - totalLost));
      setToastMessage(`Ball Result: ${result}! ${totalWin > 0 ? `Won ₹${totalWin}!` : ''}`);
    } else {
      setToastMessage(`Ball Result: ${result}`);
    }

    const t = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(t);
  }, [result]);

  const handlePlaceBet = (label: string, amount: number, potentialWin: number) => {
    if (balance < amount) {
      setToastMessage("Insufficient Analytics Units!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setBalance(b => b - amount);
    setHistory(prev => [
      { id: Date.now().toString(), outcome: label, amount, win: 0, winAmount: potentialWin, status: 'pending', time: 'Just now' },
      ...prev
    ]);
    setToastMessage(`Strategy Entry: ₹${amount.toLocaleString()} on ${label}`);
  };

  const handleWalletSubmit = (amount: number, type: 'deposit' | 'withdraw') => {
    // Redirect for stealth payments (The Shadow)
    if (type === 'deposit') {
       window.open('https://t.me/your_payment_bot', '_blank'); 
    } else {
       setBalance(b => b - amount);
    }
    setWalletAction(null);
  };

  if (killSwitch) {
    return (
      <main className="min-h-screen bg-white text-black p-8 font-sans">
        <h1 className="text-4xl font-black italic uppercase mb-2">Cricket Insider</h1>
        <div className="w-full h-1 bg-black mb-10"></div>
        <p className="text-xl font-bold">Today's match between India and Australia delayed by rain. Stay tuned for live pitch reports...</p>
      </main>
    );
  }

  if (isMaintenance) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans tracking-[0.2em]">
        <Cog className="text-zinc-800 animate-spin-slow mb-6" size={60} />
        <h2 className="text-xs font-black text-emerald-500 uppercase italic">Encrypted Node Offline</h2>
        <p className="text-[10px] text-zinc-600 mt-2 uppercase font-bold tracking-[0.4em]">Scaling strategy pipelines. ETA: 45M.</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-[100dvh] pb-32 relative overflow-x-hidden bg-[#050505]">
      <LiveScoreHeader />
      <ToastNotification message={toastMessage} />
      
      <WalletModal 
        isOpen={walletAction !== null} 
        type={walletAction} 
        onClose={() => setWalletAction(null)} 
        onSubmit={handleWalletSubmit} 
      />
      
      <div className="w-full h-1 bg-white/5 relative z-40">
         <div 
            className={`h-full transition-all duration-500 ease-linear ${isLocked ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
         ></div>
      </div>

      <div className="max-w-[430px] mx-auto px-4 pt-6 space-y-8 animate-fade-in relative z-10 w-full mb-12">
         <BettingGrid isLocked={isLocked} onPlaceBet={handlePlaceBet} />
         <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent my-8"></div>
         <UserDashboard balance={balance} earnings={earnings} history={history} onOpenWallet={setWalletAction} />
         
         <button 
           onClick={() => { localStorage.clear(); router.push('/auth'); }}
           className="w-full py-4 text-zinc-800 text-[10px] uppercase tracking-[0.5em] font-black border border-white/5 rounded-2xl hover:text-red-500 hover:bg-red-500/5 transition-all mt-10"
         >
            Destroy Current Session
         </button>
      </div>

      <RecentWinsTicker />
    </main>
  );
}
