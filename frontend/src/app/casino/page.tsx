import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Sparkles, Spade, Gem } from 'lucide-react';

export default function CasinoLobby() {
  const originals = [
    { id: 'crash', name: 'Crash', icon: '📈', path: '/originals/crash', color: 'from-blue-500/20 to-cyan-500/20' },
    { id: 'dice', name: 'Dice', icon: '🎲', path: '#', color: 'from-green-500/20 to-emerald-500/20' },
    { id: 'plinko', name: 'Plinko', icon: '🎯', path: '#', color: 'from-purple-500/20 to-pink-500/20' },
    { id: 'mines', name: 'Mines', icon: '💣', path: '#', color: 'from-red-500/20 to-orange-500/20' },
  ];

  return (
    <main className="min-h-screen bg-apple-black text-white selection:bg-apple-blue selection:text-white pb-20">
      <Navbar />
      
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-apple-midnight to-black border border-white/10 p-10 md:p-16 text-center animate-slide-up">
            <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/10 blur-[100px] rounded-full pointer-events-none"></div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Stake Originals & Casino
            </h1>
            <p className="text-apple-dark-gray font-medium text-lg max-w-2xl mx-auto mb-8">
                Provably fair, instant crypto payouts, and unmatched Apple-style elegance.
            </p>
            <button className="apple-btn apple-btn-accent px-8 py-3 text-base">Browse All Games</button>
        </div>

        {/* Stake Originals Section */}
        <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="text-apple-blue" size={24} />
                <h2 className="text-2xl font-bold tracking-tight"> Originals</h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {originals.map(game => (
                    <Link href={game.path} key={game.id} className={`block relative rounded-2xl p-6 bg-gradient-to-b ${game.color} border border-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-300 group`}>
                        <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center h-32 md:h-48">
                            <span className="text-5xl md:text-7xl mb-4 group-hover:scale-110 transition-transform">{game.icon}</span>
                            <span className="font-bold text-lg">{game.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* Slots & Live Casino Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
                <div className="flex items-center space-x-3 mb-6">
                    <Gem className="text-purple-500" size={24} />
                    <h2 className="text-xl font-bold">Premium Slots</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     {[1, 2, 3, 4].map(i => (
                         <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 border border-white/5 animate-pulse flex items-center justify-center text-apple-dark-gray text-xs">Slot {i}</div>
                     ))}
                </div>
            </div>

            <div className="glass-card p-8">
                <div className="flex items-center space-x-3 mb-6">
                    <Spade className="text-red-500" size={24} />
                    <h2 className="text-xl font-bold">Live Casino</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     {[1, 2].map(i => (
                         <div key={i} className="aspect-video rounded-xl bg-white/5 border border-white/5 animate-pulse flex items-center justify-center text-apple-dark-gray text-xs">Live Dealer {i}</div>
                     ))}
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}
