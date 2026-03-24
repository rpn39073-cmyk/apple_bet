'use client';

import { Wallet, Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center animate-fade-in">
              <span className="text-xl font-bold tracking-tight text-white hover:text-apple-silver transition-colors">
                 Bet
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/sports" className="text-sm font-medium text-apple-silver hover:text-white transition-colors">Sports</Link>
            <Link href="/live" className="text-sm font-medium text-apple-silver hover:text-white transition-colors flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse-slow"></span>
              Live Now
            </Link>
            <Link href="/casino" className="text-sm font-medium text-apple-silver hover:text-white transition-colors">Casino</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-apple-silver hover:text-white transition-colors rounded-full hover:bg-white/10">
              <Bell size={20} />
            </button>
            <button className="hidden md:flex items-center space-x-2 apple-btn apple-btn-secondary">
              <Wallet size={16} />
              <span className="text-sm">Connect Wallet</span>
            </button>
            <button className="md:hidden p-2 text-apple-silver hover:text-white transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
