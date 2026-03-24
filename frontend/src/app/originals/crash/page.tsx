'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import io from 'socket.io-client';

export default function CrashGame() {
    const [gameState, setGameState] = useState('STARTING'); // STARTING, IN_PROGRESS, CRASHED
    const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
    const [timeRemaining, setTimeRemaining] = useState(5.0);
    const [crashPoint, setCrashPoint] = useState<number | null>(null);
    const [wager, setWager] = useState('10');
    const [hasBetted, setHasBetted] = useState(false);
    
    useEffect(() => {
        const socket = io('http://localhost:3001/crash');

        socket.on('gameState', (data) => {
            setGameState(data.gameState);
            if(data.gameState === 'STARTING') {
                setTimeRemaining(data.timeRemaining);
                setCrashPoint(null);
                setHasBetted(false);
            }
        });

        socket.on('tick', (data) => {
            setGameState(data.gameState);
            if (data.gameState === 'STARTING') {
                setTimeRemaining(data.timeRemaining);
            } else if (data.gameState === 'IN_PROGRESS') {
                setCurrentMultiplier(parseFloat(data.currentMultiplier));
            }
        });

        socket.on('crashed', (data) => {
            setGameState('CRASHED');
            setCrashPoint(parseFloat(data.currentMultiplier));
            setCurrentMultiplier(parseFloat(data.currentMultiplier));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleAction = () => {
        const socket = io('http://localhost:3001/crash');
        if (gameState === 'STARTING' && !hasBetted) {
            setHasBetted(true);
            socket.emit('placeBet', { userId: '123', amount: parseFloat(wager), username: 'Player1' });
        } else if (gameState === 'IN_PROGRESS' && hasBetted) {
            setHasBetted(false);
            socket.emit('cashOut', '123');
        }
    };

    return (
        <main className="min-h-screen bg-apple-black text-white">
            <Navbar />
            
            <div className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-6">
                
                {/* Left Controls Panel */}
                <div className="w-full md:w-80 shrink-0 glass-card p-6 flex flex-col animate-slide-up">
                    <div className="mb-6 border-b border-white/10 pb-4">
                        <span className="text-xl font-bold tracking-tight">Crash</span>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-semibold text-apple-dark-gray block mb-1">Bet Amount (USDT)</label>
                            <input 
                                type="number" 
                                value={wager}
                                onChange={e => setWager(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:border-apple-blue focus:outline-none transition-colors"
                            />
                        </div>

                        <button 
                            onClick={handleAction}
                            disabled={gameState === 'CRASHED' || (gameState === 'IN_PROGRESS' && !hasBetted)}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-apple-glow ${
                                gameState === 'STARTING' && !hasBetted 
                                    ? 'bg-apple-blue text-white hover:bg-blue-600' 
                                    : gameState === 'IN_PROGRESS' && hasBetted
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-white/10 text-apple-dark-gray cursor-not-allowed border border-white/5 shadow-none'
                            }`}
                        >
                            {gameState === 'STARTING' && !hasBetted && 'Place Bet'}
                            {gameState === 'STARTING' && hasBetted && 'Bet Placed'}
                            {gameState === 'IN_PROGRESS' && hasBetted && `Cash Out (${(parseFloat(wager)*currentMultiplier).toFixed(2)})`}
                            {gameState === 'IN_PROGRESS' && !hasBetted && 'Wait for next round...'}
                            {gameState === 'CRASHED' && 'Crashed'}
                        </button>
                    </div>
                </div>

                {/* Main Graph Canvas Canvas area */}
                <div className="flex-1 glass-card overflow-hidden relative flex flex-col">
                    
                    <div className="flex-1 relative flex items-center justify-center p-8 min-h-[400px]">
                        {/* Background Grid */}
                        <div className="absolute inset-0 z-0 opacity-10" 
                             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>

                        <div className="relative z-10 text-center flex flex-col items-center">
                            {gameState === 'STARTING' && (
                                <>
                                   <div className="text-6xl font-black font-sf tracking-tighter mb-4 text-white">{currentMultiplier.toFixed(2)}x</div>
                                   <div className="text-apple-dark-gray font-medium">Starting in {timeRemaining}s</div>
                                   <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-apple-blue transition-all" style={{ width: `${(timeRemaining/6.0)*100}%` }}></div>
                                   </div>
                                </>
                            )}
                            
                            {gameState === 'IN_PROGRESS' && (
                                <div className="text-7xl md:text-9xl font-black font-sf tracking-tighter text-white animate-pulse" style={{ color: currentMultiplier > 2 ? '#0071E3' : 'white' }}>
                                    {currentMultiplier.toFixed(2)}x
                                </div>
                            )}

                            {gameState === 'CRASHED' && (
                                <div className="text-7xl md:text-9xl font-black font-sf tracking-tighter text-red-500">
                                    {crashPoint?.toFixed(2)}x
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
