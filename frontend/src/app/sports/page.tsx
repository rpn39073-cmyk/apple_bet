'use client';

import Navbar from '@/components/Navbar';
import BetSlip from '@/components/BetSlip';
import { Search, Trophy, Calendar, Watch, Flame } from 'lucide-react';

export default function Sportsbook() {
  return (
    <main className="min-h-screen bg-apple-black text-white selection:bg-apple-blue selection:text-white pb-20">
      <Navbar />
      
      <div className="pt-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
        
        {/* Left Sidebar - Sports Menu */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-dark-gray" size={18} />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-apple-blue transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-apple-dark-gray uppercase tracking-wider mb-3 px-3">Top Leagues</h3>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
              <span className="flex items-center text-sm font-medium text-apple-silver group-hover:text-white">
                <Trophy size={16} className="mr-3 text-yellow-500" />
                Champions League
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
              <span className="flex items-center text-sm font-medium text-apple-silver group-hover:text-white">
                <Trophy size={16} className="mr-3 text-white" />
                Premier League
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
              <span className="flex items-center text-sm font-medium text-apple-silver group-hover:text-white">
                <Trophy size={16} className="mr-3 text-orange-500" />
                NBA
              </span>
            </button>
          </div>

          <div className="space-y-1 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-apple-dark-gray uppercase tracking-wider mb-3 px-3">All Sports</h3>
            {['Soccer', 'Basketball', 'Tennis', 'Esports', 'American Football', 'Baseball', 'Ice Hockey'].map(sport => (
               <button key={sport} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium text-apple-silver hover:text-white">
                 {sport}
               </button>
            ))}
          </div>
        </aside>

        {/* Main Feed */}
        <div className="flex-1 space-y-6 animate-slide-up">
          {/* Featured Match Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-apple-blue/20 to-purple-500/20 border border-white/10 p-8 h-64 flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/40"></div>
             <div className="relative z-10 flex items-center justify-between w-full">
                 <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500 mb-3">
                        <Flame size={12} className="mr-1" /> FEATURED EVENT
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">El Clásico</h2>
                    <p className="text-apple-silver font-medium text-sm">Real Madrid vs FC Barcelona</p>
                 </div>
                 <button className="apple-btn apple-btn-primary">Bet Now</button>
             </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button className="flex items-center px-4 py-2 rounded-full bg-white text-apple-black font-semibold text-sm whitespace-nowrap">
               <Watch size={16} className="mr-2" /> Live Now
            </button>
            <button className="flex items-center px-4 py-2 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors whitespace-nowrap">
               <Calendar size={16} className="mr-2" /> Starting Soon
            </button>
             <button className="px-4 py-2 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors whitespace-nowrap">Outrights</button>
          </div>

          {/* Matches List Container */}
          <div className="glass-card border border-white/5 divide-y divide-white/5">
             {/* Match Row 1 */}
             <div className="p-4 hover:bg-white/5 transition-colors grid grid-cols-12 gap-4 items-center">
                 <div className="col-span-12 md:col-span-5 flex items-center justify-between">
                     <div className="flex items-center space-x-3 text-sm">
                         <span className="text-red-500 font-mono text-xs">45:00</span>
                         <div className="flex flex-col space-y-1 font-medium">
                            <span className="text-white">Arsenal</span>
                            <span className="text-white">Liverpool</span>
                         </div>
                     </div>
                     <div className="flex flex-col space-y-1 font-bold font-mono text-white text-right">
                        <span>1</span>
                        <span>0</span>
                     </div>
                 </div>
                 <div className="col-span-12 md:col-span-7 flex space-x-2">
                     <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('add-bet', { detail: { id: 'm1_1', match: 'Arsenal vs Liverpool', selection: 'Arsenal To Win', odds: 2.10 } }))}
                        className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 py-3 rounded-lg flex justify-between px-4 items-center transition-all group">
                        <span className="text-xs text-apple-dark-gray font-medium">1</span>
                        <span className="text-sm font-bold text-white group-hover:text-apple-blue transition-colors">2.10</span>
                     </button>
                     <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('add-bet', { detail: { id: 'm1_x', match: 'Arsenal vs Liverpool', selection: 'Draw', odds: 3.50 } }))}
                        className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 py-3 rounded-lg flex justify-between px-4 items-center transition-all group">
                        <span className="text-xs text-apple-dark-gray font-medium">X</span>
                        <span className="text-sm font-bold text-white group-hover:text-apple-blue transition-colors">3.50</span>
                     </button>
                     <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('add-bet', { detail: { id: 'm1_2', match: 'Arsenal vs Liverpool', selection: 'Liverpool To Win', odds: 3.20 } }))}
                        className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 py-3 rounded-lg flex justify-between px-4 items-center transition-all group">
                        <span className="text-xs text-apple-dark-gray font-medium">2</span>
                        <span className="text-sm font-bold text-white group-hover:text-apple-blue transition-colors">3.20</span>
                     </button>
                 </div>
             </div>
              {/* Match Row 2 */}
             <div className="p-4 hover:bg-white/5 transition-colors grid grid-cols-12 gap-4 items-center">
                 <div className="col-span-12 md:col-span-5 flex items-center justify-between">
                     <div className="flex items-center space-x-3 text-sm">
                         <span className="text-apple-dark-gray font-mono text-xs">Today, 20:00</span>
                         <div className="flex flex-col space-y-1 font-medium">
                            <span className="text-apple-silver hover:text-white transition-colors cursor-pointer">Chelsea</span>
                            <span className="text-apple-silver hover:text-white transition-colors cursor-pointer">Man Utd</span>
                         </div>
                     </div>
                 </div>
                 <div className="col-span-12 md:col-span-7 flex space-x-2">
                     <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('add-bet', { detail: { id: 'm2_1', match: 'Chelsea vs Man Utd', selection: 'Chelsea To Win', odds: 1.95 } }))}
                        className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 py-3 rounded-lg flex justify-between px-4 items-center transition-all group">
                        <span className="text-xs text-apple-dark-gray font-medium">1</span>
                        <span className="text-sm font-bold text-white group-hover:text-apple-blue transition-colors">1.95</span>
                     </button>
                     <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('add-bet', { detail: { id: 'm2_x', match: 'Chelsea vs Man Utd', selection: 'Draw', odds: 4.00 } }))}
                        className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 py-3 rounded-lg flex justify-between px-4 items-center transition-all group">
                        <span className="text-xs text-apple-dark-gray font-medium">X</span>
                        <span className="text-sm font-bold text-white group-hover:text-apple-blue transition-colors">4.00</span>
                     </button>
                     <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('add-bet', { detail: { id: 'm2_2', match: 'Chelsea vs Man Utd', selection: 'Man Utd To Win', odds: 3.80 } }))}
                        className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 py-3 rounded-lg flex justify-between px-4 items-center transition-all group">
                        <span className="text-xs text-apple-dark-gray font-medium">2</span>
                        <span className="text-sm font-bold text-white group-hover:text-apple-blue transition-colors">3.80</span>
                     </button>
                 </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar - Spacer for BetSlip which is absolute/fixed */}
        <div className="hidden xl:block w-[320px] shrink-0"></div>

      </div>

      <BetSlip />
    </main>
  );
}
